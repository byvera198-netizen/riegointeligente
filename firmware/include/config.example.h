#pragma once

// Copiar este archivo como config.h. config.h no debe subirse al repositorio.
#define WIFI_SSID "NOMBRE_DE_LA_RED"
#define WIFI_PASSWORD "CLAVE_DE_LA_RED"
#define API_BASE_URL "https://su-dominio.example"
#define DEVICE_ID "siris-uefs-001"
#define DEVICE_API_TOKEN "REEMPLAZAR_CON_TOKEN_UNICO"

// Certificado raíz PEM de la autoridad que firma el servidor HTTPS.
// No usar setInsecure(): el dispositivo debe verificar el certificado.
static const char ROOT_CA[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
PEGAR_CERTIFICADO_RAIZ
-----END CERTIFICATE-----
)EOF";

// Calibración individual: ADC en sustrato seco y a capacidad de campo.
static const int16_t MOISTURE_DRY_ADC[3] = {22800, 22950, 22700};
static const int16_t MOISTURE_WET_ADC[3] = {11200, 11050, 11350};

// Direcciones ROM reales de los tres DS18B20, en orden A, B y C.
// Obtenerlas con el ejemplo oneWireSearch y etiquetar físicamente cada sonda.
static const uint8_t SOIL_TEMP_ADDRESS[3][8] = {
  {0x28, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01},
  {0x28, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02},
  {0x28, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03},
};

// Tanque: distancia desde el sensor al agua (cm), lleno y nivel crítico.
constexpr float TANK_FULL_DISTANCE_CM = 8.0f;
constexpr float TANK_EMPTY_DISTANCE_CM = 46.0f;

// Pulsos del caudalímetro por litro. Determinar por aforo, no por catálogo.
constexpr float FLOW_PULSES_PER_LITER = 450.0f;

// Divisor de tensión de batería. Ajustar con multímetro.
constexpr float BATTERY_DIVIDER_RATIO = 5.70f;

// Sensor 0,5–4,5 V / 0–1,2 MPa adaptado a 3,3 V mediante divisor.
constexpr float PRESSURE_ZERO_ADC = 1900.0f;
constexpr float PRESSURE_MAX_ADC = 24400.0f;
constexpr float PRESSURE_MAX_BAR = 12.0f;
