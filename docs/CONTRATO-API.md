# Contrato de comunicación

Todas las rutas usan JSON y HTTPS. El ESP32 envía `Authorization: Bearer <token-del-dispositivo>`. Las órdenes humanas requieren una sesión autorizada del aplicativo.

## Enviar telemetría

`POST /api/device/telemetry`

```json
{
  "deviceId": "siris-uefs-001",
  "recordedAt": "2026-08-15T11:24:00",
  "tankLevel": 78,
  "batteryVoltage": 13.1,
  "batteryPct": 84,
  "solarWatts": 128,
  "pressureBar": 1.0,
  "flowLpm": 1.8,
  "ambientTemp": 29.4,
  "ambientHumidity": 71,
  "zones": [
    { "zoneId": "A", "moisturePct": 38, "soilTemp": 24.6, "dailyLiters": 1.4, "sensorValid": true },
    { "zoneId": "B", "moisturePct": 57, "soilTemp": 22.9, "dailyLiters": 0.8, "sensorValid": true },
    { "zoneId": "C", "moisturePct": 46, "soilTemp": 25.1, "dailyLiters": 1.1, "sensorValid": true }
  ]
}
```

## Consultar orden pendiente

`GET /api/device/commands?deviceId=siris-uefs-001`

La respuesta contiene `command: null` o una orden con `commandId`, `zoneId`, `volumeMl`, `expiresAt` y estado.

## Confirmar una orden

`POST /api/device/commands`

```json
{
  "deviceId": "siris-uefs-001",
  "commandId": "uuid",
  "status": "accepted",
  "detail": "orden aceptada por el controlador local"
}
```

Estados: `accepted`, `executed`, `rejected` o `failed`.

## Solicitar riego desde la web

`POST /api/control`

```json
{ "zoneId": "A", "action": "water", "volumeMl": 400 }
```

El servidor vuelve a comprobar antigüedad de telemetría, tanque, batería, habilitación de la zona y pulso máximo antes de guardar la orden. El ESP32 ejecuta una segunda validación física.

## Leer el panel

`GET /api/state`

Devuelve la telemetría más reciente, lecturas de zona, configuración, eventos y comandos. `live: false` indica que todavía no existe una muestra real y el panel debe permanecer en demostración.

