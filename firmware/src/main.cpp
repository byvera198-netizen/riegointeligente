#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_ADS1X15.h>
#include <Adafruit_BME280.h>
#include <Adafruit_INA219.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <RTClib.h>
#include <Preferences.h>
#include "config.h"

// Sistema de riego inteligente 1.0 · Unidad Educativa Fiscal Samborondón
// El control local y las protecciones físicas siempre tienen prioridad.

constexpr uint8_t PIN_ONE_WIRE = 4;
constexpr uint8_t PIN_FLOW = 18;
constexpr uint8_t PIN_SENSOR_POWER = 19;
constexpr uint8_t PIN_PUMP = 25;
constexpr uint8_t PIN_VALVES[3] = {26, 27, 14};
constexpr uint8_t PIN_TANK_LOW = 33;
constexpr uint8_t PIN_TANK_HIGH = 23;
constexpr uint8_t PIN_EMERGENCY = 13;
constexpr uint8_t PIN_BATTERY = 34;
constexpr uint8_t PIN_TANK_TRIG = 32;
constexpr uint8_t PIN_TANK_ECHO = 35; // Usar divisor 5 V → 3,3 V.

constexpr uint32_t SENSOR_INTERVAL_MS = 10'000;
constexpr uint32_t TELEMETRY_INTERVAL_MS = 60'000;
constexpr uint32_t COMMAND_INTERVAL_MS = 15'000;
constexpr uint32_t MAX_PUMP_RUNTIME_MS = 120'000;
constexpr uint32_t NO_FLOW_TIMEOUT_MS = 5'000;
constexpr uint32_t VALVE_PREOPEN_MS = 1'500;
constexpr uint32_t VALVE_CLOSE_DELAY_MS = 1'500;
constexpr float MIN_PRESSURE_BAR = 0.15f;
constexpr float MAX_PRESSURE_BAR = 1.8f;
constexpr float MIN_BATTERY_V = 11.8f;

struct ZoneConfig {
  const char *id;
  float minMoisture;
  float maxMoisture;
  uint16_t pulseMl;
  uint16_t dailyLimitMl;
  uint16_t cooldownMinutes;
};

ZoneConfig zoneConfig[3] = {
  {"A", 45.0f, 68.0f, 400, 3000, 15},
  {"B", 50.0f, 72.0f, 350, 2400, 10},
  {"C", 44.0f, 66.0f, 400, 2800, 15},
};

struct SensorState {
  float moisture[3] = {NAN, NAN, NAN};
  float soilTemp[3] = {NAN, NAN, NAN};
  bool valid[3] = {false, false, false};
  float tankPct = 0;
  float batteryV = 0;
  float batteryPct = 0;
  float solarWatts = 0;
  float pressureBar = 0;
  float flowLpm = 0;
  float ambientTemp = NAN;
  float ambientHumidity = NAN;
};

enum class IrrigationState { IDLE, VALVE_OPENING, PUMPING, VALVE_CLOSING, COOLDOWN, FAULT };

Adafruit_ADS1115 ads;
Adafruit_BME280 bme;
Adafruit_INA219 ina219;
OneWire oneWire(PIN_ONE_WIRE);
DallasTemperature soilTemperatures(&oneWire);
RTC_DS3231 rtc;
Preferences preferences;
SensorState sensors;
IrrigationState irrigationState = IrrigationState::IDLE;
volatile uint32_t flowPulses = 0;
volatile uint32_t lastFlowPulseAt = 0;
uint32_t stateStartedAt = 0;
uint32_t lastSensorAt = 0;
uint32_t lastTelemetryAt = 0;
uint32_t lastCommandAt = 0;
uint32_t lastWifiAttemptAt = 0;
uint32_t lastIrrigationAt[3] = {0, 0, 0};
uint32_t dailyMl[3] = {0, 0, 0};
int activeZone = -1;
uint32_t targetMl = 0;
uint32_t startFlowPulses = 0;
String activeCommandId;
String faultReason;

void IRAM_ATTR onFlowPulse() {
  flowPulses++;
  lastFlowPulseAt = millis();
}

void allOutputsOff() {
  digitalWrite(PIN_PUMP, LOW);
  for (uint8_t pin : PIN_VALVES) digitalWrite(pin, LOW);
}

float clampf(float value, float low, float high) {
  return max(low, min(high, value));
}

float readTankPercent() {
  digitalWrite(PIN_TANK_TRIG, LOW);
  delayMicroseconds(3);
  digitalWrite(PIN_TANK_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TANK_TRIG, LOW);
  const uint32_t duration = pulseIn(PIN_TANK_ECHO, HIGH, 35'000);
  if (duration == 0) return digitalRead(PIN_TANK_LOW) == LOW ? 0.0f : sensors.tankPct;
  const float distance = duration * 0.0343f / 2.0f;
  return clampf(100.0f * (TANK_EMPTY_DISTANCE_CM - distance) /
    (TANK_EMPTY_DISTANCE_CM - TANK_FULL_DISTANCE_CM), 0.0f, 100.0f);
}

float pressureFromAdc(int16_t raw) {
  return clampf((raw - PRESSURE_ZERO_ADC) * PRESSURE_MAX_BAR /
    (PRESSURE_MAX_ADC - PRESSURE_ZERO_ADC), 0.0f, PRESSURE_MAX_BAR);
}

float moistureFromAdc(uint8_t zone, int16_t raw) {
  return clampf(100.0f * (MOISTURE_DRY_ADC[zone] - raw) /
    float(MOISTURE_DRY_ADC[zone] - MOISTURE_WET_ADC[zone]), 0.0f, 100.0f);
}

void sampleSensors() {
  digitalWrite(PIN_SENSOR_POWER, HIGH);
  delay(250);
  for (uint8_t i = 0; i < 3; i++) {
    int32_t total = 0;
    for (uint8_t sample = 0; sample < 7; sample++) {
      total += ads.readADC_SingleEnded(i);
      delay(8);
    }
    sensors.moisture[i] = moistureFromAdc(i, int16_t(total / 7));
  }
  sensors.pressureBar = pressureFromAdc(ads.readADC_SingleEnded(3));
  digitalWrite(PIN_SENSOR_POWER, LOW);

  soilTemperatures.requestTemperatures();
  for (uint8_t i = 0; i < 3; i++) {
    sensors.soilTemp[i] = soilTemperatures.getTempC(SOIL_TEMP_ADDRESS[i]);
    sensors.valid[i] = sensors.moisture[i] >= 0 && sensors.moisture[i] <= 100 &&
      sensors.soilTemp[i] > -5 && sensors.soilTemp[i] < 65;
  }
  sensors.ambientTemp = bme.readTemperature();
  sensors.ambientHumidity = bme.readHumidity();
  sensors.tankPct = readTankPercent();
  sensors.batteryV = analogReadMilliVolts(PIN_BATTERY) / 1000.0f * BATTERY_DIVIDER_RATIO;
  sensors.batteryPct = clampf((sensors.batteryV - 11.8f) / (13.8f - 11.8f) * 100.0f, 0.0f, 100.0f);
  sensors.solarWatts = max(0.0f, ina219.getBusVoltage_V() * ina219.getCurrent_mA() / 1000.0f);

  static uint32_t previousPulses = 0;
  static uint32_t previousAt = millis();
  const uint32_t now = millis();
  noInterrupts();
  const uint32_t pulses = flowPulses;
  interrupts();
  const float elapsedMinutes = max(0.001f, (now - previousAt) / 60'000.0f);
  sensors.flowLpm = (pulses - previousPulses) / FLOW_PULSES_PER_LITER / elapsedMinutes;
  previousPulses = pulses;
  previousAt = now;
}

bool safetyAllowsWatering(String &reason) {
  if (digitalRead(PIN_EMERGENCY) == LOW) reason = "parada de emergencia";
  else if (digitalRead(PIN_TANK_LOW) == LOW || sensors.tankPct < 15) reason = "tanque en nivel crítico";
  else if (sensors.batteryV < MIN_BATTERY_V) reason = "batería baja";
  else if (activeZone < 0 || activeZone > 2 || !sensors.valid[activeZone]) reason = "sensor de zona inválido";
  else if (dailyMl[activeZone] + targetMl > zoneConfig[activeZone].dailyLimitMl) reason = "límite diario alcanzado";
  else return true;
  return false;
}

void enterFault(const String &reason) {
  faultReason = reason;
  allOutputsOff();
  irrigationState = IrrigationState::FAULT;
  stateStartedAt = millis();
  Serial.printf("FALLO SEGURO: %s\n", reason.c_str());
}

void beginWatering(uint8_t zone, uint16_t volumeMl, const String &commandId = "") {
  if (irrigationState != IrrigationState::IDLE || zone > 2) return;
  activeZone = zone;
  targetMl = volumeMl < zoneConfig[zone].pulseMl ? volumeMl : zoneConfig[zone].pulseMl;
  activeCommandId = commandId;
  String reason;
  if (!safetyAllowsWatering(reason)) {
    enterFault(reason);
    return;
  }
  digitalWrite(PIN_VALVES[zone], HIGH);
  irrigationState = IrrigationState::VALVE_OPENING;
  stateStartedAt = millis();
}

uint32_t deliveredMl() {
  noInterrupts();
  const uint32_t pulses = flowPulses - startFlowPulses;
  interrupts();
  return uint32_t(pulses / FLOW_PULSES_PER_LITER * 1000.0f);
}

bool secureRequest(const String &path, const String &method, const String &body, String &responseBody) {
  if (WiFi.status() != WL_CONNECTED) return false;
  WiFiClientSecure client;
  client.setCACert(ROOT_CA);
  HTTPClient http;
  if (!http.begin(client, String(API_BASE_URL) + path)) return false;
  http.addHeader("Authorization", String("Bearer ") + DEVICE_API_TOKEN);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(7000);
  const int code = method == "GET" ? http.GET() : http.POST(body);
  responseBody = http.getString();
  http.end();
  return code >= 200 && code < 300;
}

void acknowledgeCommand(const String &status, const String &detail) {
  if (activeCommandId.isEmpty()) return;
  JsonDocument ack;
  ack["commandId"] = activeCommandId;
  ack["deviceId"] = DEVICE_ID;
  ack["status"] = status;
  ack["detail"] = detail;
  String body, ignored;
  serializeJson(ack, body);
  secureRequest("/api/device/commands", "POST", body, ignored);
}

void updateIrrigation() {
  const uint32_t now = millis();
  if (digitalRead(PIN_EMERGENCY) == LOW) {
    acknowledgeCommand("failed", "parada de emergencia");
    enterFault("parada de emergencia");
    return;
  }

  switch (irrigationState) {
    case IrrigationState::IDLE:
      break;
    case IrrigationState::VALVE_OPENING:
      if (now - stateStartedAt >= VALVE_PREOPEN_MS) {
        startFlowPulses = flowPulses;
        lastFlowPulseAt = now;
        digitalWrite(PIN_PUMP, HIGH);
        irrigationState = IrrigationState::PUMPING;
        stateStartedAt = now;
      }
      break;
    case IrrigationState::PUMPING: {
      String reason;
      if (!safetyAllowsWatering(reason)) enterFault(reason);
      else if (now - stateStartedAt > MAX_PUMP_RUNTIME_MS) enterFault("tiempo máximo excedido");
      else if (now - stateStartedAt > NO_FLOW_TIMEOUT_MS && now - lastFlowPulseAt > NO_FLOW_TIMEOUT_MS) enterFault("bomba sin caudal");
      else if (sensors.pressureBar > MAX_PRESSURE_BAR) enterFault("presión alta / posible bloqueo");
      else if (now - stateStartedAt > NO_FLOW_TIMEOUT_MS && sensors.pressureBar < MIN_PRESSURE_BAR) enterFault("presión baja / posible fuga");
      else if (deliveredMl() >= targetMl) {
        digitalWrite(PIN_PUMP, LOW);
        dailyMl[activeZone] += deliveredMl();
        preferences.putUInt((String("ml") + activeZone).c_str(), dailyMl[activeZone]);
        irrigationState = IrrigationState::VALVE_CLOSING;
        stateStartedAt = now;
      }
      if (irrigationState == IrrigationState::FAULT) acknowledgeCommand("failed", faultReason);
      break;
    }
    case IrrigationState::VALVE_CLOSING:
      if (now - stateStartedAt >= VALVE_CLOSE_DELAY_MS) {
        digitalWrite(PIN_VALVES[activeZone], LOW);
        lastIrrigationAt[activeZone] = now;
        acknowledgeCommand("executed", String(deliveredMl()) + " ml aplicados");
        irrigationState = IrrigationState::COOLDOWN;
        stateStartedAt = now;
      }
      break;
    case IrrigationState::COOLDOWN:
      if (now - stateStartedAt >= zoneConfig[activeZone].cooldownMinutes * 60'000UL) {
        activeZone = -1;
        activeCommandId = "";
        irrigationState = IrrigationState::IDLE;
      }
      break;
    case IrrigationState::FAULT:
      allOutputsOff();
      if (now - stateStartedAt > 60'000 && digitalRead(PIN_EMERGENCY) == HIGH &&
          digitalRead(PIN_TANK_LOW) == HIGH && sensors.batteryV >= MIN_BATTERY_V) {
        activeZone = -1;
        activeCommandId = "";
        faultReason = "";
        irrigationState = IrrigationState::IDLE;
      }
      break;
  }
}

void runAutonomousDecision() {
  if (irrigationState != IrrigationState::IDLE) return;
  int candidate = -1;
  float largestDeficit = 0;
  const uint32_t now = millis();
  for (uint8_t i = 0; i < 3; i++) {
    const float deficit = zoneConfig[i].minMoisture - sensors.moisture[i];
    const bool cooldownDone = lastIrrigationAt[i] == 0 || now - lastIrrigationAt[i] >= zoneConfig[i].cooldownMinutes * 60'000UL;
    if (sensors.valid[i] && cooldownDone && deficit > largestDeficit && dailyMl[i] + zoneConfig[i].pulseMl <= zoneConfig[i].dailyLimitMl) {
      largestDeficit = deficit;
      candidate = i;
    }
  }
  if (candidate >= 0) beginWatering(candidate, zoneConfig[candidate].pulseMl);
}

void resetDailyCountersIfNeeded() {
  const DateTime now = rtc.now();
  if (now.year() < 2024) return;
  const uint32_t dayKey = uint32_t(now.year()) * 10'000UL + uint32_t(now.month()) * 100UL + now.day();
  if (preferences.getUInt("day", 0) == dayKey) return;
  for (uint8_t i = 0; i < 3; i++) {
    dailyMl[i] = 0;
    preferences.putUInt((String("ml") + i).c_str(), 0);
  }
  preferences.putUInt("day", dayKey);
}

void sendTelemetry() {
  JsonDocument doc;
  doc["deviceId"] = DEVICE_ID;
  doc["recordedAt"] = rtc.now().timestamp(DateTime::TIMESTAMP_FULL);
  doc["tankLevel"] = sensors.tankPct;
  doc["batteryVoltage"] = sensors.batteryV;
  doc["batteryPct"] = sensors.batteryPct;
  doc["solarWatts"] = sensors.solarWatts;
  doc["pressureBar"] = sensors.pressureBar;
  doc["flowLpm"] = sensors.flowLpm;
  doc["ambientTemp"] = sensors.ambientTemp;
  doc["ambientHumidity"] = sensors.ambientHumidity;
  JsonArray zones = doc["zones"].to<JsonArray>();
  for (uint8_t i = 0; i < 3; i++) {
    JsonObject zone = zones.add<JsonObject>();
    zone["zoneId"] = zoneConfig[i].id;
    zone["moisturePct"] = sensors.moisture[i];
    zone["soilTemp"] = sensors.soilTemp[i];
    zone["dailyLiters"] = dailyMl[i] / 1000.0f;
    zone["sensorValid"] = sensors.valid[i];
  }
  String body, response;
  serializeJson(doc, body);
  if (!secureRequest("/api/device/telemetry", "POST", body, response)) Serial.println("Telemetría pendiente; la autonomía local continúa.");
}

void pollCommand() {
  String response;
  if (!secureRequest(String("/api/device/commands?deviceId=") + DEVICE_ID, "GET", "", response)) return;
  JsonDocument doc;
  if (deserializeJson(doc, response) || doc["command"].isNull()) return;
  const String commandId = doc["command"]["commandId"] | "";
  const String zoneId = doc["command"]["zoneId"] | "";
  const uint16_t volumeMl = doc["command"]["volumeMl"] | 0;
  const int zone = zoneId == "A" ? 0 : zoneId == "B" ? 1 : zoneId == "C" ? 2 : -1;

  if (commandId == activeCommandId) {
    acknowledgeCommand("accepted", "controlador ejecutando la orden");
    return;
  }

  JsonDocument ack;
  ack["commandId"] = commandId;
  ack["deviceId"] = DEVICE_ID;
  if (zone < 0 || irrigationState != IrrigationState::IDLE) {
    ack["status"] = "rejected";
    ack["detail"] = zone < 0 ? "zona inválida" : "controlador ocupado";
  } else {
    activeZone = zone;
    targetMl = volumeMl;
    String reason;
    if (!safetyAllowsWatering(reason)) {
      activeZone = -1;
      ack["status"] = "rejected";
      ack["detail"] = reason;
    } else {
      beginWatering(zone, volumeMl, commandId);
      ack["status"] = "accepted";
      ack["detail"] = "orden aceptada por el controlador local";
    }
  }
  String body, ignored;
  serializeJson(ack, body);
  secureRequest("/api/device/commands", "POST", body, ignored);
}

void connectWifi() {
  lastWifiAttemptAt = millis();
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  const uint32_t started = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - started < 15'000) delay(250);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_PUMP, OUTPUT);
  for (uint8_t pin : PIN_VALVES) pinMode(pin, OUTPUT);
  pinMode(PIN_SENSOR_POWER, OUTPUT);
  pinMode(PIN_FLOW, INPUT_PULLUP);
  pinMode(PIN_TANK_LOW, INPUT_PULLUP);
  pinMode(PIN_TANK_HIGH, INPUT_PULLUP);
  pinMode(PIN_EMERGENCY, INPUT_PULLUP);
  pinMode(PIN_TANK_TRIG, OUTPUT);
  pinMode(PIN_TANK_ECHO, INPUT);
  allOutputsOff();
  attachInterrupt(digitalPinToInterrupt(PIN_FLOW), onFlowPulse, FALLING);

  Wire.begin(21, 22);
  ads.begin(0x48);
  ads.setGain(GAIN_ONE);
  bme.begin(0x76);
  ina219.begin();
  soilTemperatures.begin();
  soilTemperatures.setWaitForConversion(true);
  rtc.begin();
  preferences.begin("siris", false);
  for (uint8_t i = 0; i < 3; i++) dailyMl[i] = preferences.getUInt((String("ml") + i).c_str(), 0);
  resetDailyCountersIfNeeded();

  sampleSensors();
  connectWifi();
}

void loop() {
  const uint32_t now = millis();
  if (now - lastSensorAt >= SENSOR_INTERVAL_MS) {
    lastSensorAt = now;
    resetDailyCountersIfNeeded();
    sampleSensors();
    runAutonomousDecision();
  }
  if (now - lastTelemetryAt >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryAt = now;
    sendTelemetry();
  }
  if (now - lastCommandAt >= COMMAND_INTERVAL_MS) {
    lastCommandAt = now;
    pollCommand();
  }
  if (WiFi.status() != WL_CONNECTED && now - lastWifiAttemptAt > 60'000) connectWifi();
  updateIrrigation();
  delay(5);
}
