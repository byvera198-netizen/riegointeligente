# Lista maestra de compra — Sistema de riego inteligente 1.0

Unidad Educativa Fiscal Samborondón. Revisión: 15 de agosto de 2026. Esta lista cubre el prototipo autónomo de 2,00 × 1,00 m y tres zonas. La marca puede variar; tensión, corriente, presión, grado IP y compatibilidad no deben reducirse. **O = obligatorio, R = recomendado, OP = opcional.**

## A. Estructura y cama agrícola

| Cantidad | Clase | Elemento | Especificación mínima |
|---:|:---:|---|---|
| 1 | O | Bastidor | 2 × 1 m, altura 35–45 cm, resistente a sustrato saturado |
| 20–40 | O | Fijaciones | Tornillería anticorrosiva, tuercas, arandelas y tapas de perfil |
| 4 | R | Patas niveladoras | Carga compatible con la cama completa |
| 1 pieza | O | Membrana | Geomembrana/PEAD para fondo y laterales |
| 1 capa | R | Geotextil | Permeable, tamaño del fondo |
| 3–5 cm | R | Drenante | Grava lavada o equivalente |
| 1–3 | O | Desagües | Pasamuros, rejilla y manguera |
| 2 | O | Divisores | Impermeables, sin perforar membrana |
| 0,40–0,60 m³ | O | Sustrato | Mezcla homogénea documentada |
| 1 | R | Bandeja de contención | Impermeable y extraíble |
| 1 | O | Soporte técnico | Independiente para caja/hidráulica |
| 4 | R | Letreros | Proyecto y zonas A/B/C, resistentes a UV |

## B. Hidráulica

| Cantidad | Clase | Elemento | Especificación mínima |
|---:|:---:|---|---|
| 1 | O | Tanque con tapa | Opaco, 40–60 L, estable y lavable |
| 1 | O | Pasamuros | ≈½”, con tuerca y empaques |
| 1 | O | Válvula de bola | ½”, accesible |
| 1 | O | Filtro | 120 mesh, lavable |
| 0,5–1,5 m | O | Succión reforzada | Resistente al colapso |
| 1 | O | Bomba de diafragma | 12 V, autocebante, 3–5 L/min, arranque conocido |
| 4 | R | Soportes antivibración | Caucho |
| 6–10 | O | Abrazaderas | Inoxidables |
| 1 | R | Antirretorno | ½”, baja pérdida |
| 1 | O | Regulador | Ajustable alrededor de 1 bar |
| 1 | R | Manómetro | 0–4 bar |
| 1 | O | Sensor de presión | Preferible 0–2 bar, señal adaptada |
| 1 | O | Caudalímetro Hall | Fiable entre ≈0,5–5 L/min |
| 1 | O | Colector | Una entrada, tres salidas |
| 3 | O | Electroválvulas | 12 V NC, acción directa/0 bar |
| 3–4 m | O | Tubería principal | PE 16 mm |
| 6–8 m | O | Microtubo | 6 mm |
| 6 | O | Microaspersores | Regulables, baja presión |
| 6 | O | Estacas | Compatibles con emisores |
| Según trazado | O | Accesorios | Tees, codos, reductores, espigas, uniones, tapones, lavado y empaques |
| 1 + 1 | O | PTFE y sellador | Compatibles con roscas/materiales |
| 15–30 | R | Clips de tubería | Resistentes a humedad/UV |

## C. Control y sensores

| Cantidad | Clase | Elemento | Especificación mínima |
|---:|:---:|---|---|
| 1 | O | ESP32 DevKit | 3,3 V, Wi‑Fi 2,4 GHz |
| 1 | O | ADS1115 | ADC I²C 16 bits, 3,3 V |
| 1 | O | DS3231 | RTC con batería |
| 3 + 1 repuesto | O/R | Humedad capacitiva | Analógica, encapsulada |
| 3 + 1 repuesto | O/R | DS18B20 impermeable | ROM individual |
| 1 | O | BME280 | Temperatura/humedad; garita ventilada |
| 1 | O | Ultrasónico impermeable | ECHO adaptado a 3,3 V |
| 2 | O | Flotadores | Inferior de seguridad y superior de lleno |
| 1 | O | INA260 | Hasta 36 V/15 A; verificar Isc real |
| 1 juego | O | Divisor de batería | Precisión, filtro y protección ADC |
| 1 | OP | OLED | I²C, dirección sin conflicto |
| 1 | R | Alimentación conmutada | MOSFET/transistor para sondas |
| 1 | O | Pull-up OneWire | 4,7 kΩ |
| 1 | O* | Pull-up caudal | ≈10 kΩ si el módulo no la incluye |
| 2 juegos | O | Adaptación 5→3,3 V | Para ECHO y presión |

## D. Potencia y seguridad

| Cantidad | Clase | Elemento | Especificación mínima |
|---:|:---:|---|---|
| 4 + 1 repuesto | O/R | MOSFET | Nivel lógico real a 3,3 V, margen ≥2× |
| 4 | R | Resistencias de compuerta | 100–220 Ω |
| 4 | O* | Pull-down | ≈10 kΩ si el módulo no las incluye |
| 4 + repuestos | O | Diodos de rueda libre | Dimensionados para cada carga |
| 1 | R | Relé/contactor DC | Si el arranque de bomba lo exige |
| 1 | O | Parada de emergencia | Enclavable, contacto NC y corte físico |
| 1 | R | TVS | Para bus 12 V |
| Varios | R | Condensadores | 100 nF y 470–1.000 µF |
| 1 | O | Convertidor DC–DC | 12→5 V, mínimo 3 A |
| 1 | O | Fusible control | Valor inicial 2 A |
| 1 | O | Fusible válvulas | Valor inicial 3–5 A |
| 1 | O | Fusible bomba | Valor inicial 7,5–10 A |
| 1 | O | Fusible principal | Valor inicial 15 A, junto al positivo |
| 4 | O | Portafusibles | Aptos para DC |
| 1 | O | Seccionador principal | Tensión/corriente DC adecuadas |
| 1 | R | Protección de polaridad | Dimensionada |
| 1 par | R | Barras de distribución | Cubiertas y dimensionadas |
| 1 juego | O | Fusibles de repuesto | Valores finalmente seleccionados |

Los valores de fusible son de estudio: se confirman midiendo consumo y corriente de arranque y calculando cable/longitud.

## E. Energía solar

| Cantidad | Clase | Elemento | Especificación mínima |
|---:|:---:|---|---|
| 1 | O | Panel | 150 W; Voc/Vmp/Isc/Imp compatibles |
| 1 | O | Estructura | Ajustable, resistente a viento/corrosión |
| Según distancia | O | Cable solar | UV, sección calculada ida/retorno |
| 1 par o más | O | MC4 | Crimpado correcto |
| 1 | O | Controlador | MPPT preferible, mínimo 15 A, AGM |
| 1 | O | Batería AGM | 12 V, 55 Ah, ciclo profundo |
| 1 + 1 | O | Bandeja y correa | Contención y sujeción |
| 1 par | O | Cubreterminales | Aislantes rojo/negro |
| 1 | R | Protección/seccionamiento FV | Compatible con Voc/Isc |
| 1 juego | Según diseño | Puesta a tierra | Marco del panel si corresponde |
| 1 | OP | Router/módem 4G | Solo sin Wi‑Fi; recalcular energía |

## F. Caja, cableado y montaje

| Cantidad | Clase | Elemento | Especificación mínima |
|---:|:---:|---|---|
| 1 | O | Caja | IP65, separación potencia/señal |
| 1 | R | Placa/riel DIN | Soporte interior |
| 20–30 puntos | O | Borneras | Identificables y dimensionadas |
| Según entradas | O | Prensaestopas | IP65, diámetro correcto |
| Según cálculo | O | Cable batería/bomba | 12–14 AWG como referencia |
| Según trazado | O | Cable válvulas | 18 AWG como referencia |
| Según trazado | O | Cable señales | 20–22 AWG; apantallado si es largo |
| Según terminales | O | Terminales de anillo | Crimpados |
| Según borneras | R | Punteras/ferrules | Un extremo por bornera |
| Mín. uno/equipo | R | Conectores impermeables | Codificados y desmontables |
| 1 juego | O | Termorretráctil | Preferible con adhesivo |
| Según trazado | R | Canaleta/conduit | Separación potencia/señal |
| 30–50 | R | Bridas UV y bases | Bases atornilladas en exterior |
| Todas | O | Etiquetas | Ambos extremos de cada cable |

## G. Herramientas y consumibles

| Cantidad | Clase | Elemento | Uso |
|---:|:---:|---|---|
| 1 de cada | O | Multímetro y pinza amperimétrica DC | Tensión, continuidad y arranque |
| 1 de cada | O | Pelacables y crimpadoras | Terminales y MC4 |
| 1 juego | O | Destornilladores aislados | Borneras/protecciones |
| 1 de cada | R | Cautín y pistola de calor | Electrónica y termorretráctil |
| 1 juego | O | Taladro, brocas y sierra copa | Estructura/caja |
| 1 de cada | O | Cortatubo y llaves | Hidráulica |
| 1 de cada | O | Recipiente graduado, balde y cronómetro | Aforo |
| Según uso | O | PTFE, sellador y silicona neutra | Sellado; silicona no presurizada |
| Según uso | R | Grasa dieléctrica, alcohol y encapsulante | Protección/limpieza |

## H. Servicios y configuración indispensables

| Cantidad | Clase | Elemento | Requisito |
|---:|:---:|---|---|
| 1 | O | Wi‑Fi 2,4 GHz | Cobertura comprobada |
| 1 | O | Certificado TLS | Sin modo inseguro en producción |
| 1 | O | Token del dispositivo | Secreto único fuera del repositorio |
| 1 | O | API y base de datos | HTTPS, autenticación, telemetría, comandos, auditoría y respaldo |
| 1 | O | Firmware configurado | Pines, ROM, límites y operación sin Internet |
| 1 | O | Calibración | Humedad, presión, caudal, batería y tanque |

## Antes de autorizar la compra definitiva

1. Medir corriente normal y de arranque de la bomba.
2. Confirmar electroválvulas desde 0 bar y caudal real de dos emisores.
3. Verificar Isc/Voc del panel contra INA260, controlador, cable y protecciones.
4. Calcular caída de tensión y consumo durante 24 horas.
5. Mantener una sola electroválvula activa por vez.

## Repuestos mínimos

1 sensor capacitivo, 1 DS18B20, 1 electroválvula o kit de reparación, 2 microaspersores, 2 m de PE16, 2 m de microtubo, accesorios, fusibles, 1 MOSFET, diodos, empaques y conectores impermeables.

La compra completa no equivale a puesta en servicio: el sistema se declara operativo después de calibración, 21 pruebas, 72 horas continuas y siete días de ensayo documentado.
