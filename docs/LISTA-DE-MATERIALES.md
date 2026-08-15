# Lista de materiales del prototipo

Las especificaciones son obligatorias; la marca puede variar. Verificar corriente, tensión, presión mínima y disponibilidad antes de comprar.

## Control y medición

| Cantidad | Elemento | Especificación mínima |
|---:|---|---|
| 1 | ESP32 DevKit | 3,3 V, Wi-Fi 2,4 GHz |
| 1 | ADS1115 | ADC I²C de 16 bits |
| 1 | DS3231 | RTC con batería |
| 3 | Sensor capacitivo de suelo | Salida analógica compatible, encapsulado |
| 3 | DS18B20 impermeable | Dirección ROM identificable |
| 1 | BME280 | Temperatura y humedad ambiental |
| 1 | Sensor ultrasónico impermeable | Nivel continuo; ECHO adaptado a 3,3 V |
| 2 | Flotadores | Inferior de seguridad y superior de lleno |
| 1 | Caudalímetro | Adecuado al rango real de 1–5 L/min |
| 1 | Sensor de presión | 0–2 bar preferible o rango calibrable |
| 1 | INA260 | Medición de tensión, corriente y potencia solar hasta 36 V/15 A; verificar que la corriente de cortocircuito del panel no exceda el módulo |
| 1 | Divisor de batería | Resistencias de precisión + protección ADC |
| 1 | Pantalla OLED | I²C, opcional para operación local |

## Potencia y seguridad

| Cantidad | Elemento | Especificación mínima |
|---:|---|---|
| 4 | Módulo MOSFET | Entrada lógica 3,3 V, corriente con margen ≥ 2× |
| 4 | Diodo de rueda libre | Dimensionado para bomba/válvulas |
| 1 | Parada de emergencia | Contacto normalmente cerrado, enclavable |
| 1 | Seccionador principal | Corriente DC adecuada |
| 1 | Portafusible principal | Instalado junto al positivo de batería |
| 3 | Portafusibles de ramal | Control, válvulas y bomba |
| 1 | Convertidor DC–DC | 12 V a 5 V, 3 A, eficiencia alta |
| 1 | Caja | IP65, prensaestopas y separación potencia/señal |
| varios | Borneras, punteras y etiquetas | Montaje en riel DIN recomendado |

Los valores de fusible se eligen después de medir la corriente real y revisar la sección del conductor. Como punto de estudio —no valor universal—: control 2 A, válvulas 5 A, bomba 7,5–10 A y principal 15 A.

## Hidráulica

| Cantidad | Elemento | Especificación mínima |
|---:|---|---|
| 1 | Tanque con tapa | 40–60 L |
| 1 | Bomba de diafragma | 12 V, 3–5 L/min, autocebante |
| 3 | Electroválvula | 12 V DC, normalmente cerrada, acción directa/0 bar |
| 1 | Filtro | 120 mesh, desmontable |
| 1 | Válvula de bola | ½ pulgada |
| 1 | Válvula antirretorno | ½ pulgada |
| 1 | Regulador | Ajustable alrededor de 1 bar |
| 1 | Manómetro | 0–4 bar |
| 1 | Colector | Una entrada, tres salidas |
| 6 | Microaspersor regulable | Dos por zona |
| 4 m | Tubería principal | PE 16 mm |
| 8 m | Microtubo | 6 mm |
| varios | Tees, codos, tapones y abrazaderas | Compatibles con presión y diámetro |
| 1 | Bandeja de drenaje | Impermeable y extraíble |

## Energía solar

| Cantidad | Elemento | Especificación inicial |
|---:|---|---|
| 1 | Panel solar | 150–200 W |
| 1 | Controlador | MPPT/PWM, mínimo 15 A, configurable para batería |
| 1 | Batería | AGM 12 V 55 Ah o LiFePO₄ con BMS compatible |
| 1 | Soporte | Orientación ajustable, fijación segura |
| varios | Cable solar y conectores | Sección calculada y polaridad identificada |

El tamaño final se valida midiendo consumo de 24 h, corriente de arranque de la bomba y horas solares del lugar. No mantener un inversor AC encendido para cargas que ya funcionan en DC.

## Estructura

- Cama de 2,00 × 1,00 m y 20–30 cm de sustrato útil.
- Divisores impermeables entre zonas.
- Geotextil, drenaje y bandeja de contención.
- Soportes independientes para tanque, batería, panel y caja.
- Batería elevada, sujeta y ventilada; electrónica protegida de agua y fertilizantes.
