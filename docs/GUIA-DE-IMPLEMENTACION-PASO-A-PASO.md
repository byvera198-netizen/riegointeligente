# Guía de implementación paso a paso

## Sistema de riego inteligente 1.0 — Unidad Educativa Fiscal Samborondón

Esta guía convierte la documentación técnica, la lista maestra de compra, los planos, el firmware y el protocolo de pruebas en una secuencia única de implementación. El prototipo solo puede declararse operativo después de calibrar el montaje real y aprobar las 21 pruebas.

## Reglas obligatorias

- Trabajar por subsistemas y energizar un ramal a la vez.
- Abrir el seccionador, cubrir o desconectar el panel y cerrar el agua antes de intervenir.
- No alimentar bomba, válvulas ni sensores de 5 V directamente desde GPIO del ESP32.
- No sustituir fusibles, diodos, parada de emergencia, flotador inferior ni límites de software por puentes temporales.
- Registrar responsable, fecha, medición, evidencia y corrección en cada fase.
- Mantener credenciales, tokens y certificados reales fuera del repositorio y de las imágenes.

## 1. Preparación del proyecto

1. Asignar responsable técnico, docente, software y evidencias.
2. Confirmar cama de 2,00 × 1,00 m con A tomate, B lechuga y C pimiento.
3. Elegir lugar nivelado, drenado, seguro, soleado y con Wi‑Fi 2,4 GHz.
4. Definir posiciones de panel, tanque, batería y caja fuera del escurrimiento.
5. Crear carpeta de evidencias, croquis, inventario y protocolo impreso.
6. Preparar EPP, multímetro, herramientas aisladas y señalización.

**Salida:** ubicación, responsables y seguridad aprobados.

## 2. Compra y compatibilidad

1. Cotejar cantidad, modelo, tensión, corriente y hoja de datos.
2. Confirmar bomba y electroválvulas NC de 12 V DC.
3. Medir corriente nominal y de arranque de la bomba.
4. Confirmar panel 150 W y límites Voc, Isc e Imp del controlador e INA260.
5. Configurar controlador para AGM 12 V 55 Ah.
6. Confirmar presión, caudal, diámetros, roscas y conectores.
7. Adaptar a 3,3 V toda señal procedente de 5 V.
8. Separar fusibles, diodos, terminales, sensores y emisores de repuesto.

**Salida:** ninguna especificación crítica queda pendiente.

## 3. Cama y estructura

1. Construir y nivelar el bastidor de 2,00 × 1,00 m.
2. Instalar membrana con pendiente y salida de drenaje.
3. Probar el drenaje antes de añadir sustrato.
4. Colocar geotextil, capa drenante y dos divisores sellados.
5. Añadir el mismo volumen y tipo de sustrato en las tres zonas.
6. Instalar soporte técnico y letreros resistentes al agua.

**Salida:** estructura estable, tres zonas aisladas y drenaje libre.

## 4. Circuito hidráulico

Montar en el siguiente orden:

```text
tanque → bola → filtro → succión → bomba → antirretorno → regulador
       → manómetro/sensor de presión → caudalímetro → colector
       → válvula A/B/C → tubería 16 mm → microtubo 6 mm → emisores
```

Fijar la bomba sobre antivibración, respetar flechas de flujo, lavar cada ramal sin emisores, purgar aire y probar una zona por vez. Confirmar durante 30 minutos que no haya fugas, cavitación, retorno ni aperturas cruzadas.

**Salida:** presión y caudal repetibles en A, B y C.

## 5. Energía solar y distribución DC

1. Fijar panel de 150 W sin sombras y con estructura resistente.
2. Instalar cable UV y MC4; medir polaridad y Voc.
3. Sujetar batería AGM 12 V 55 Ah elevada y ventilada.
4. Colocar fusible principal junto al positivo y luego seccionador DC.
5. Añadir protección de polaridad y barras cubiertas.
6. Crear ramales separados para bomba, válvulas y control.
7. Configurar perfil AGM y medir tensión durante arranque de bomba.

**Salida:** 12 V estable, ramales aislables y ausencia de calentamiento.

## 6. Tablero de control y potencia

1. Instalar placa/riel, borneras, fusibles, DC–DC y MOSFET.
2. Separar potencia, señales analógicas, I²C/OneWire y antena.
3. Ajustar el DC–DC a 5,00 V antes de conectar el ESP32.
4. Usar cuatro MOSFET lógicos: bomba y válvulas A, B y C.
5. Instalar resistencias de compuerta y pull-down cuando falten.
6. Instalar diodos de rueda libre, TVS y condensadores.
7. Cablear emergencia NC como señal y corte físico de bomba.
8. Usar prensaestopas, punteras, termorretráctil y etiquetas.
9. Medir continuidad, polaridad y cortocircuito antes de cada fusible.

**Salida:** encendido sin cargas con todas las salidas apagadas.

## 7. Sensores

- Humedad: uno por zona, igual profundidad, ADS1115 A0/A1/A2.
- Presión: ADS1115 A3, después del regulador y antes del colector.
- DS18B20: tres ROM identificadas y etiquetadas A/B/C en GPIO 4.
- BME280: garita ventilada y sombreada.
- Caudalímetro: GPIO 18 y orientación del fabricante.
- Ultrasónico: TRIG GPIO 32, ECHO GPIO 35 con divisor a 3,3 V.
- Flotadores: inferior GPIO 33 y superior GPIO 23.
- Emergencia: GPIO 13, normalmente cerrada.
- Batería: GPIO 34 con divisor 47 kΩ/10 kΩ y 100 nF.
- I²C: SDA GPIO 21, SCL GPIO 22; escanear direcciones antes de cerrar.

**Salida:** lecturas plausibles y fallo de sensor en estado seguro.

## 8. Firmware, API y web

1. Crear `config.h` desde el ejemplo y mantener secretos fuera de GitHub.
2. Cargar Wi‑Fi 2,4 GHz, HTTPS, token, certificado, ROM y calibraciones.
3. Cargar firmware con bomba y válvulas desconectadas.
4. Verificar diez arranques con salidas apagadas.
5. Ajustar DS3231, NVS y reinicio diario de contadores.
6. Probar telemetría, consulta de órdenes y acuses finales.
7. Confirmar identificador único, vencimiento de dos minutos e idempotencia.
8. Verificar telemetría real en la web y autonomía sin internet.

**Salida:** el ESP32 decide localmente y rechaza órdenes no válidas.

## 9. Calibración

1. Tomar 30 muestras de humedad en seco y 30 a capacidad de campo por zona.
2. Guardar medianas seca/húmeda; no calibrar solo en aire y agua.
3. Confirmar identidad A/B/C calentando una DS18B20 por vez.
4. Aforar al menos 1 L y repetir tres veces por zona.
5. Ajustar pulsos/litro hasta lograr error medio ≤ 10 %.
6. Comparar presión electrónica con manómetro en tres puntos.
7. Definir presión baja/alta con fugas y obstrucciones controladas.
8. Calibrar tanque lleno/crítico y tensión a 12,0 V, 12,8 V y arranque.

**Salida:** hoja de calibración firmada y constantes reales cargadas.

## 10. Integración autónoma

Valores iniciales sujetos a ajuste agronómico:

| Zona | Inicio | Pulso | Máximo diario | Estabilización |
|---|---:|---:|---:|---:|
| A tomate | <45 % | 0,40 L | 3,0 L | 15 min |
| B lechuga | <50 % | 0,35 L | 2,4 L | 10 min |
| C pimiento | <44 % | 0,40 L | 2,8 L | 15 min |

Secuencia: validar protecciones → abrir una válvula → esperar 1,5 s → encender bomba → confirmar caudal en ≤5 s → vigilar presión → detener por volumen o 120 s → apagar bomba → esperar 1,5 s → cerrar válvula → registrar.

**Salida:** tres zonas riegan por volumen y toda protección produce paro seguro.

## 11. Aceptación

Aprobar las 21 pruebas del protocolo: arranque, emergencia, tanque bajo, humedad A/B/C, identidad térmica, aislamiento de zonas, aforo, caudal nulo, obstrucción, fuga, tiempo máximo, límite diario, batería baja, operación sin internet, reconexión, orden vencida, duplicada, acceso no autorizado, reinicio durante riego, 72 horas y siete días.

**Salida:** 21/21 aprobadas, disponibilidad ≥99 %, incidencias cerradas y sin puentes de protección.

## 12. Entrega y mantenimiento

1. Registrar firmware, configuración, esquema as-built y fecha.
2. Entregar credenciales por canal seguro y asignar permisos.
3. Capacitar en autonomía, pausa, riego, alarmas y emergencia.
4. Revisar semanalmente filtro, emisores, fugas, energía y alarmas.
5. Inspeccionar mensualmente sellos, cables, bornes y prensaestopas.
6. Recalibrar al cambiar sustrato/cultivo o intervenir hidráulica.
7. Probar mensualmente emergencia, tanque bajo, caudal nulo y modo sin internet.
8. Registrar repuestos y cada intervención.

**Salida:** la institución puede operar, detener, mantener y recuperar el sistema sin depender del equipo constructor.

## Declaración responsable

La aplicación, la API y el firmware pueden validarse previamente, pero “100 % funcional y operativo” requiere el montaje físico, constantes reales, evidencias y 21 pruebas firmadas. Nunca energizar una bomba con valores de ejemplo sin medir polaridad, tensión, corriente, caudal y presión.
