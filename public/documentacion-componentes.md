# Descripción detallada de todos los componentes

## Sistema de riego inteligente 1.0 — Unidad Educativa Fiscal Samborondón

Este documento describe el proyecto completo desde la estructura física hasta el aplicativo web. Para cada elemento se explica qué es, para qué sirve, dónde se conecta, qué función cumple y qué sucede si falta o falla.

### Clasificación utilizada

- **Obligatorio:** el prototipo no puede cumplir sus funciones o sus protecciones sin este elemento.
- **Recomendado:** el sistema puede encender sin él, pero pierde confiabilidad, seguridad o capacidad de diagnóstico.
- **Opcional:** amplía la demostración, pero no es necesario para la versión básica operativa.

---

# 1. Descripción general del sistema

El proyecto es una cama agrícola de **2,00 m × 1,00 m**, dividida en tres zonas:

| Zona | Cultivo demostrativo | Sensor principal | Actuador hidráulico |
|---|---|---|---|
| A | Tomate | Humedad + temperatura de suelo | Electroválvula A + 2 microaspersores |
| B | Lechuga | Humedad + temperatura de suelo | Electroválvula B + 2 microaspersores |
| C | Pimiento | Humedad + temperatura de suelo | Electroválvula C + 2 microaspersores |

El controlador ESP32 mide las condiciones, decide qué zona necesita agua, abre su válvula, enciende una bomba central, verifica presión y caudal, entrega un volumen definido y registra el resultado. El aplicativo web permite observar el sistema y solicitar riegos, pero la orden solo se ejecuta si el controlador local determina que es segura.

## 1.1 Los ocho conjuntos del proyecto

1. Kit estructural y cama agrícola.
2. Kit hidráulico.
3. Kit de sensores.
4. Kit de control electrónico.
5. Kit de potencia y protección eléctrica.
6. Kit de energía solar.
7. Kit de comunicaciones y software.
8. Kit de montaje, herramientas y consumibles.

## 1.2 Flujo del agua

```text
Tanque con tapa
  → pasamuros
  → válvula manual
  → filtro de 120 mesh
  → bomba de diafragma de 12 V
  → válvula antirretorno
  → regulador de presión
  → manómetro + sensor electrónico de presión
  → caudalímetro
  → colector de tres salidas
      → electroválvula A → 2 emisores de tomate
      → electroválvula B → 2 emisores de lechuga
      → electroválvula C → 2 emisores de pimiento
```

## 1.3 Flujo de energía

```text
Panel solar
  → controlador de carga
  → batería de 12 V
  → seccionador y fusible principal
  → barra de distribución
      → fusible de bomba → bomba 12 V
      → fusible de válvulas → 3 electroválvulas 12 V
      → fusible de control → convertidor 12 V/5 V → ESP32 y sensores
```

## 1.4 Flujo de información

```text
Sensores → ESP32 → decisión autónoma → bomba/válvulas
                → HTTPS cifrado → API → base de datos → aplicativo web
Aplicativo web → orden con vencimiento → API → ESP32 → validación física → ejecución o rechazo
```

---

# 2. Kit estructural y cama agrícola

## 2.1 Bastidor de la cama

**Cantidad:** 1 estructura de 2,00 × 1,00 m.  
**Clasificación:** obligatorio.

Es el marco que contiene el sustrato y define el área útil del prototipo. Puede construirse con madera tratada para exterior, perfil metálico galvanizado o plástico estructural resistente a radiación UV.

**Función en el proyecto:**

- Soportar el peso del sustrato húmedo.
- Mantener separadas y niveladas las tres zonas.
- Dar una presentación segura y educativa.
- Servir de soporte para tuberías, sensores y letreros.

**Requisitos:**

- No debe deformarse cuando el sustrato esté saturado.
- Los bordes no deben tener astillas ni aristas cortantes.
- La tornillería debe resistir humedad.
- La altura exterior recomendada es de 35–45 cm.
- La profundidad útil de sustrato debe ser de 20–30 cm.

**Si falla:** puede perderse sustrato, mezclarse el agua entre zonas o volcarse la estructura.

## 2.2 Tornillos, pernos, tuercas y arandelas

**Cantidad:** según diseño; normalmente 20–40 fijaciones.  
**Clasificación:** obligatorio.

Los tornillos unen el bastidor. En madera se recomiendan tornillos galvanizados o de acero inoxidable; en metal, pernos con tuerca autofrenante.

**Elementos pequeños necesarios:**

- Tornillos o pernos.
- Tuercas.
- Arandelas planas para repartir la carga.
- Arandelas de presión o tuercas autofrenantes para evitar que la vibración afloje la unión.
- Tapas plásticas para extremos de perfiles.

**Si faltan arandelas:** la cabeza del tornillo puede hundirse en la madera o deformar el perfil.

## 2.3 Patas niveladoras

**Cantidad:** 4, una en cada esquina.  
**Clasificación:** recomendado.

Permiten corregir irregularidades del piso. Una cama desnivelada acumula agua en un extremo y altera la comparación entre zonas.

## 2.4 Membrana impermeable

**Cantidad:** una pieza suficiente para fondo y laterales.  
**Clasificación:** obligatorio.

Es una lámina de polietileno de alta densidad, geomembrana o revestimiento apto para contacto indirecto con suelo. Evita que la humedad ataque la estructura y conduce el drenaje hacia un punto controlado.

**No debe:** quedar perforada por tornillos, tener pliegues que atrapen agua o bloquear el drenaje.

## 2.5 Geotextil

**Cantidad:** una capa del tamaño del fondo.  
**Clasificación:** recomendado.

Es una tela permeable que deja pasar agua, pero retiene partículas de sustrato. Se coloca sobre la capa de drenaje.

**Función:** impedir que la tierra tape el drenaje o salga hacia la bandeja inferior.

## 2.6 Capa de drenaje

**Cantidad:** 3–5 cm de grava lavada o material drenante.  
**Clasificación:** recomendado.

Forma una zona libre para que el exceso de agua llegue al desagüe. No sustituye un drenaje correctamente dimensionado.

## 2.7 Salida de drenaje

**Cantidad:** 1–3, según la pendiente del fondo.  
**Clasificación:** obligatorio.

Consiste en un pasamuros pequeño, rejilla y manguera de descarga. Evita que la cama se convierta en un recipiente cerrado.

**Función:** prevenir saturación de raíces, desbordamientos y filtraciones hacia la electrónica.

## 2.8 Divisores de zona

**Cantidad:** 2 divisores internos.  
**Clasificación:** obligatorio para una demostración comparativa.

Separan A, B y C. Deben llegar cerca del fondo y sellarse contra la membrana sin perforarla.

**Función:** reducir el movimiento lateral de agua para que cada sensor represente su zona.

## 2.9 Sustrato

**Cantidad aproximada:** 0,40–0,60 m³, según profundidad.  
**Clasificación:** obligatorio.

Es el medio donde crecen las plantas. Debe prepararse de forma homogénea en las tres zonas para que las diferencias registradas se deban al cultivo y al riego, no a mezclas distintas.

**Debe registrarse:** composición, fecha de llenado, densidad aproximada y profundidad.

## 2.10 Bandeja de contención

**Cantidad:** 1.  
**Clasificación:** recomendado.

Se instala bajo conexiones hidráulicas y zona técnica. Recoge goteos para que no lleguen a batería, cables o piso.

## 2.11 Soporte técnico vertical

**Cantidad:** 1.  
**Clasificación:** obligatorio si se desea un montaje ordenado.

Sostiene la caja electrónica, parte de la hidráulica visible y señalización. No debe soportar la batería si no está calculado para su peso.

## 2.12 Letreros de identificación

**Cantidad:** mínimo 4: nombre general y zonas A, B y C.  
**Clasificación:** recomendado.

Ayudan a relacionar físicamente cada cultivo con su tarjeta en el aplicativo web. Deben resistir agua y radiación solar.

---

# 3. Kit hidráulico completo

## 3.1 Tanque de agua con tapa

**Cantidad:** 1.  
**Capacidad recomendada:** 40–60 L.  
**Clasificación:** obligatorio.

Es el depósito que almacena el agua. La tapa evita ingreso de hojas, insectos, polvo y luz excesiva que favorece algas.

**Función en el sistema:** suministrar agua a la bomba y proporcionar una reserva medible.

**Debe incluir:**

- Pared apta para instalar un pasamuros.
- Tapa desmontable.
- Superficie opaca o protegida de la luz.
- Base estable.
- Acceso para limpieza.

**Si queda abierto:** aumenta el riesgo de contaminación, algas, evaporación y mosquitos.

## 3.2 Pasamuros del tanque

**Cantidad:** 1.  
**Diámetro:** aproximadamente ½ pulgada, compatible con la bomba.  
**Clasificación:** obligatorio.

Es un accesorio roscado con empaques que permite atravesar la pared del tanque sin fugas.

**Partes pequeñas:** cuerpo roscado, tuerca, arandela rígida y empaques de caucho.

**Función:** crear una salida firme; no se debe introducir una manguera suelta por un agujero sellado únicamente con silicona.

## 3.3 Válvula manual de bola

**Cantidad:** 1.  
**Clasificación:** obligatorio.

Permite cerrar el tanque durante mantenimiento del filtro o la bomba. Debe quedar accesible y claramente marcada.

**Si no existe:** habrá que vaciar el tanque cada vez que se intervenga la línea.

## 3.4 Filtro de 120 mesh

**Cantidad:** 1.  
**Clasificación:** obligatorio.

Retiene arena y partículas que podrían bloquear electroválvulas o microaspersores. Debe poder abrirse y lavarse.

**Instalación:** después de la válvula manual y antes de la bomba, si el fabricante permite succión; de lo contrario, usar prefiltro de succión y filtro principal después de la bomba.

**Si se tapa:** disminuyen caudal y presión. El sistema puede interpretarlo como obstrucción.

## 3.5 Manguera de succión reforzada

**Cantidad:** 0,5–1,5 m.  
**Clasificación:** obligatorio.

Conduce agua del tanque a la bomba. Debe soportar vacío parcial sin aplastarse. Una manguera blanda convencional puede cerrarse por succión.

## 3.6 Bomba de diafragma de 12 V

**Cantidad:** 1.  
**Caudal orientativo:** 3–5 L/min.  
**Clasificación:** obligatorio.

Es el elemento que transforma energía eléctrica en presión y caudal. La bomba central alimenta una zona por vez.

**Características requeridas:**

- Alimentación de 12 V DC.
- Autocebante o apta para la posición de montaje.
- Corriente y presión conocidas.
- Conexiones compatibles con la tubería.
- Capacidad de trabajar con regulador o bypass.

**Función de control:** el ESP32 no la alimenta directamente. Un MOSFET de potencia o relé DC controla su corriente.

**Punto crítico:** medir la corriente de arranque. Esa medida determina cable, fusible y MOSFET.

## 3.7 Soportes antivibración de la bomba

**Cantidad:** 4 tacos o una base de caucho.  
**Clasificación:** recomendado.

Reducen ruido, aflojamiento de tornillos y transmisión de vibración hacia sensores o caja.

## 3.8 Abrazaderas de manguera

**Cantidad:** mínimo 6–10.  
**Clasificación:** obligatorio donde haya espigas.

Aprietan la manguera sobre conectores. Deben ser de acero inoxidable o material resistente a humedad.

## 3.9 Válvula antirretorno

**Cantidad:** 1.  
**Clasificación:** recomendado.

Impide que el agua presurizada regrese al tanque cuando la bomba se apaga. Mantiene el cebado y reduce golpes inversos.

## 3.10 Regulador de presión

**Cantidad:** 1.  
**Ajuste inicial:** alrededor de 1 bar.  
**Clasificación:** obligatorio.

Limita la presión entregada a válvulas, microtubos y emisores. La bomba puede producir más presión de la que soporta el circuito.

**Si no se instala:** puede haber desconexiones, fugas y riego desigual.

## 3.11 Manómetro mecánico

**Cantidad:** 1.  
**Rango:** 0–4 bar.  
**Clasificación:** recomendado.

Muestra la presión sin depender del software. Sirve para calibrar el sensor electrónico y diagnosticar el sistema aunque el ESP32 esté apagado.

## 3.12 Sensor electrónico de presión

**Cantidad:** 1.  
**Rango recomendado:** 0–2 bar, salida analógica.  
**Clasificación:** obligatorio para detectar fugas y bloqueos.

Convierte la presión en una señal eléctrica. Se instala después del regulador y antes del colector.

**Función:**

- Presión alta: posible válvula cerrada, línea bloqueada o regulador mal ajustado.
- Presión baja con bomba encendida: fuga, tanque vacío, bomba sin cebar o línea abierta.

**Detalle eléctrico:** si entrega hasta 4,5 V, la salida debe pasar por un divisor resistivo antes del ADS1115. Nunca aplicar 5 V directamente a una entrada de 3,3 V.

## 3.13 Caudalímetro de efecto Hall

**Cantidad:** 1.  
**Rango:** debe medir correctamente aproximadamente 0,5–5 L/min.  
**Clasificación:** obligatorio.

Contiene una turbina y un sensor que genera pulsos. El ESP32 cuenta esos pulsos para calcular litros.

**Función:**

- Confirmar que realmente circula agua.
- Detener la bomba si no hay flujo.
- Entregar un volumen preciso.
- Detectar cambios anormales entre zonas.

**Importante:** el valor de pulsos/litro se determina por aforo. No se debe usar únicamente el número del catálogo.

**Detalle eléctrico:** muchas salidas son de colector abierto; se elevan a 3,3 V mediante una resistencia de aproximadamente 10 kΩ si el módulo no la incluye.

## 3.14 Colector de tres salidas

**Cantidad:** 1.  
**Clasificación:** obligatorio.

Divide la línea principal en tres ramales. Debe tener una entrada y tres salidas del mismo diámetro o adaptadores adecuados.

## 3.15 Electroválvulas de 12 V normalmente cerradas

**Cantidad:** 3.  
**Clasificación:** obligatorio.

Cada válvula controla una zona. “Normalmente cerrada” significa que permanece cerrada sin electricidad, condición segura ante apagones.

**Requisito crítico:** acción directa o funcionamiento desde 0 bar. Una válvula de presión piloto puede no abrir con una bomba pequeña.

**Conexión:** una válvula por salida del colector; la bobina se controla con MOSFET y diodo de rueda libre.

## 3.16 Tubería principal de polietileno de 16 mm

**Cantidad:** 3–4 m.  
**Clasificación:** obligatorio.

Conduce el agua desde el colector y forma cada línea de zona. Es más resistente que un microtubo para el tramo principal.

## 3.17 Microtubo de 6 mm

**Cantidad:** 6–8 m.  
**Clasificación:** obligatorio.

Une la tubería de 16 mm con cada emisor. Debe cortarse de forma perpendicular para evitar fugas.

## 3.18 Microaspersores regulables

**Cantidad:** 6, dos por zona.  
**Caudal:** aproximadamente 20–40 L/h por emisor.  
**Clasificación:** obligatorio.

Distribuyen el agua sobre el cultivo. La regulación permite igualar los dos emisores de una zona.

**Colocación:** no dirigir el chorro directamente al sensor de humedad; eso produciría una lectura artificialmente alta.

## 3.19 Estacas para emisores

**Cantidad:** 6.  
**Clasificación:** obligatorio.

Mantienen altura, dirección y posición. Evitan que el emisor se mueva durante el mantenimiento.

## 3.20 Conectores hidráulicos pequeños

**Cantidad:** según recorrido; comprar algunos repuestos.  
**Clasificación:** obligatorio.

Incluyen:

- Tees de 16 mm.
- Codos de 16 mm.
- Reductores de 16 a 6 mm.
- Espigas.
- Uniones rectas.
- Adaptadores roscados.
- Tapones finales.
- Válvulas o tapones de lavado.
- Arandelas y empaques.

Cada unión debe ser compatible en diámetro y tipo de rosca. No mezclar rosca cónica y paralela sin el adaptador correcto.

## 3.21 Cinta PTFE y sellador de roscas

**Cantidad:** 1 rollo de PTFE y sellador compatible si se requiere.  
**Clasificación:** obligatorio en conexiones roscadas.

La cinta se enrolla en el sentido de la rosca. No se usa sobre conectores de espiga ni debe entrar en la tubería.

## 3.22 Sujetadores de tubería

**Cantidad:** 15–30 grapas, abrazaderas o clips.  
**Clasificación:** recomendado.

Evitan que el peso del agua o la manipulación tire de válvulas y sensores.

---

# 4. Kit de sensores

## 4.1 Sensores capacitivos de humedad del suelo

**Cantidad:** 3, uno por zona.  
**Clasificación:** obligatorio.

Miden variaciones de capacitancia relacionadas con el contenido de agua. Se prefieren frente a sensores resistivos con metal expuesto porque se corroen menos.

**Función:** proporcionar la variable principal para decidir el riego.

**Instalación:**

- A la misma profundidad en las tres zonas.
- Cerca de la zona radicular.
- Fuera del chorro directo.
- Con la parte electrónica superior sellada.
- Con cable desmontable e identificado.

**Calibración individual:** aire, sustrato seco, capacidad de campo y saturación. Los tres sensores pueden producir valores ADC diferentes aunque sean del mismo modelo.

**Si falla:** solamente se bloquea la zona afectada; no se debe usar el promedio de las otras zonas para reemplazarla.

## 4.2 Conversor ADS1115

**Cantidad:** 1.  
**Clasificación:** obligatorio para lecturas analógicas estables.

Es un conversor analógico-digital de 16 bits con cuatro entradas. En este proyecto:

- A0: humedad Zona A.
- A1: humedad Zona B.
- A2: humedad Zona C.
- A3: presión.

**Función:** convertir voltajes de sensores en números que el ESP32 puede procesar con mayor estabilidad que su ADC interno.

**Conexión:** bus I²C, dirección típica 0x48, alimentación compatible con 3,3 V.

## 4.3 Alimentación conmutada de sensores

**Cantidad:** 1 salida controlada mediante transistor/MOSFET.  
**Clasificación:** recomendado.

El ESP32 energiza los sensores capacitivos únicamente al medir, espera estabilización, toma varias muestras y vuelve a apagarlos.

**Función:** reducir consumo y degradación electroquímica.

## 4.4 Sensores DS18B20 impermeables

**Cantidad:** 3.  
**Clasificación:** obligatorio.

Son termómetros digitales con una dirección ROM única. Miden temperatura de suelo en cada zona.

**Función:** registrar estrés térmico y contextualizar la humedad.

**Conexión:** los tres comparten el bus OneWire en GPIO 4.

**Detalle pequeño obligatorio:** resistencia pull-up de 4,7 kΩ entre datos y 3,3 V.

**Identificación:** copiar las tres direcciones ROM a `config.h` en orden A, B y C. No depender del orden en que el software descubre los sensores.

## 4.5 BME280

**Cantidad:** 1.  
**Clasificación:** recomendado.

Mide temperatura y humedad relativa del aire; también presión atmosférica, aunque esta última no debe confundirse con la presión hidráulica.

**Conexión:** I²C, dirección habitual 0x76 o 0x77.

**Ubicación:** dentro de una garita ventilada, a la sombra y separada de la caja caliente.

## 4.6 Garita para sensor ambiental

**Cantidad:** 1.  
**Clasificación:** recomendado.

Es una cubierta blanca ventilada que bloquea sol directo y lluvia. Sin garita, el BME280 puede medir la temperatura de la radiación solar, no la del aire.

## 4.7 Sensor ultrasónico impermeable de nivel

**Cantidad:** 1.  
**Clasificación:** recomendado para mostrar porcentaje continuo.

Mide la distancia desde la tapa hasta la superficie del agua. Con las distancias de tanque lleno y vacío calcula el porcentaje.

**Conexiones:** TRIG a GPIO 32 y ECHO a GPIO 35.

**Detalle obligatorio:** la señal ECHO de muchos módulos es de 5 V. Usar divisor:

- 10 kΩ entre ECHO y GPIO.
- 20 kΩ entre GPIO y tierra.

Eso reduce 5 V a aproximadamente 3,3 V.

**Limitación:** espuma, paredes inclinadas u obstáculos pueden producir ecos falsos; por eso no reemplaza el flotador inferior de seguridad.

## 4.8 Flotador inferior

**Cantidad:** 1.  
**Clasificación:** obligatorio.

Es un interruptor mecánico accionado por el nivel. Indica nivel crítico y debe detener la bomba.

**Conexión lógica:** GPIO 33 con pull-up.  
**Conexión de seguridad recomendada:** contacto normalmente cerrado dentro del circuito de habilitación de la bomba, además de la entrada al ESP32.

Así funciona aunque el programa se bloquee.

## 4.9 Flotador superior

**Cantidad:** 1.  
**Clasificación:** recomendado.

Indica tanque lleno y permite generar aviso de sobrellenado. Se conecta a GPIO 23.

## 4.10 Sensor INA260

**Cantidad:** 1.  
**Clasificación:** recomendado.

Mide tensión y corriente y calcula la potencia solar. Admite hasta 36 V y 15 A; antes de comprar se debe confirmar que la corriente de cortocircuito del panel quede por debajo de ese límite.

La selección se basa en la [hoja de datos oficial del INA260 de Texas Instruments](https://www.ti.com/lit/ds/symlink/ina260.pdf). El firmware utiliza la [biblioteca INA260 publicada por Adafruit en PlatformIO](https://registry.platformio.org/libraries/adafruit/Adafruit%20INA260%20Library).

**Conexión:** I²C, normalmente dirección 0x40, colocado en serie en el tramo de medición conforme a su manual.

**Por qué no usar un INA219 común en el panel:** muchos módulos INA219 económicos están limitados a unos pocos amperios y no son apropiados para un panel de 150 W.

## 4.11 Medición de tensión de batería

**Cantidad:** 2 resistencias y 1 condensador.  
**Clasificación:** obligatorio para protección por batería baja.

El ESP32 no puede medir 12–14,4 V directamente. Se utiliza:

- Resistencia superior: 47 kΩ.
- Resistencia inferior: 10 kΩ.
- Condensador de 100 nF en paralelo con la resistencia inferior para filtrar ruido.

La relación aproximada es 5,7:1. La entrada se conecta a GPIO 34 y se calibra con multímetro.

## 4.12 Pluviómetro de balancín

**Cantidad:** 1.  
**Clasificación:** opcional para instalación exterior.

Genera un pulso por cada cantidad de lluvia. Permite suspender o reducir el riego después de lluvia cuantificable.

Un detector superficial barato solo informa “mojado/no mojado”; no sustituye un pluviómetro.

---

# 5. Kit de control electrónico

## 5.1 ESP32 DevKit

**Cantidad:** 1.  
**Clasificación:** obligatorio.

Es el cerebro local. Lee sensores, ejecuta la máquina de estados, controla salidas, guarda contadores, se conecta por Wi-Fi y comunica con la API.

**Funciones concretas:**

- Promediar lecturas.
- Validar rangos físicos.
- Calcular déficit de humedad.
- Elegir una zona.
- Aplicar un volumen medido.
- Vigilar seguridad.
- Mantener autonomía sin internet.
- Recibir órdenes con vencimiento.
- Registrar el resultado.

**No puede:** alimentar directamente bomba, válvulas ni sensores de 5 V.

## 5.2 Reloj DS3231

**Cantidad:** 1.  
**Clasificación:** obligatorio para mantener fecha sin internet.

Conserva la hora mediante batería de respaldo.

**Función:**

- Reiniciar contadores diarios a medianoche.
- Fechar telemetría.
- Aplicar horarios permitidos.
- Mantener tiempo durante cortes de red.

**Conexión:** I²C, dirección 0x68.

## 5.3 Batería tipo moneda del RTC

**Cantidad:** 1, del tipo indicado por el módulo.  
**Clasificación:** obligatorio.

Mantiene el DS3231 cuando el sistema principal se apaga. Debe verificarse que el módulo no intente recargar una pila no recargable.

## 5.4 Memoria NVS interna

**Cantidad:** integrada en el ESP32.  
**Clasificación:** obligatorio por firmware.

Guarda litros diarios y configuración esencial. No es una pieza adicional, pero forma parte del sistema.

**Función:** impedir que un reinicio borre límites y permita riego duplicado.

## 5.5 Módulo microSD

**Cantidad:** 1.  
**Clasificación:** opcional en la versión 1.0.

Permitiría almacenar históricos cuando internet falla durante mucho tiempo. El firmware actual usa NVS para datos críticos y base de datos remota para históricos; la microSD requiere una ampliación de software y reasignación de pines SPI.

**Advertencia:** los pines SPI predeterminados entran en conflicto con señales ya utilizadas. No conectar una microSD sin actualizar el plano de pines y el firmware.

## 5.6 Pantalla OLED I²C

**Cantidad:** 1.  
**Clasificación:** opcional.

Puede mostrar humedad, batería, tanque, modo y alarma localmente. Comparte I²C y normalmente usa dirección 0x3C.

## 5.7 Expansor MCP23017

**Cantidad:** 1.  
**Clasificación:** opcional si se instalan muchos botones y luces.

Añade entradas/salidas mediante I²C. Permite conectar interfaz local sin consumir pines críticos del ESP32.

**Regla:** bomba y válvulas deben permanecer en pines directos con estado de arranque seguro; el expansor se reserva para LEDs, botones y zumbador.

## 5.8 Botón de modo automático/manual

**Cantidad:** 1.  
**Clasificación:** opcional recomendado para demostración.

Permite cambiar el modo local. No elimina protecciones.

## 5.9 Botones de prueba por zona

**Cantidad:** 3.  
**Clasificación:** opcional.

Solicitan un pulso de prueba A, B o C. El firmware debe tratarlos como solicitudes, no como conexión directa a la válvula.

## 5.10 Indicadores LED

**Cantidad:** 4–6.  
**Clasificación:** opcional.

- Verde: sistema normal.
- Azul A/B/C: zona activa.
- Amarillo: advertencia.
- Rojo: fallo.

Cada LED requiere una resistencia limitadora, normalmente 220–1.000 Ω según LED y brillo.

## 5.11 Zumbador

**Cantidad:** 1.  
**Clasificación:** opcional.

Emite alarma local. Si consume más de lo que soporta un GPIO, necesita transistor y diodo si es inductivo.

## 5.12 Watchdog

**Cantidad:** integrado en el ESP32.  
**Clasificación:** recomendado por firmware.

Reinicia tareas bloqueadas. El reinicio siempre debe comenzar con bomba y válvulas apagadas.

---

# 6. Kit de actuación y potencia eléctrica

## 6.1 Módulos MOSFET de canal N

**Cantidad:** 4: bomba y tres válvulas.  
**Clasificación:** obligatorio.

Son interruptores electrónicos controlados por 3,3 V. Permiten que el ESP32 maneje cargas de 12 V sin conducir su corriente por la placa.

**Requisitos:**

- MOSFET de nivel lógico, completamente activado con 3,3 V.
- Tensión y corriente con margen mínimo del doble.
- Disipación adecuada.
- Estado apagado durante arranque.

Un módulo anunciado únicamente para señal de 5 V puede calentarse o no activar correctamente con ESP32.

## 6.2 Resistencias de compuerta

**Cantidad:** 4.  
**Valor orientativo:** 100–220 Ω.  
**Clasificación:** recomendado.

Se colocan entre GPIO y compuerta del MOSFET. Limitan picos de corriente y reducen oscilación.

## 6.3 Resistencias pull-down

**Cantidad:** 4.  
**Valor:** aproximadamente 10 kΩ.  
**Clasificación:** obligatorio si el módulo no las incluye.

Mantienen cada MOSFET apagado mientras el ESP32 arranca o está desconectado.

## 6.4 Diodos de rueda libre

**Cantidad:** 4.  
**Clasificación:** obligatorio.

Se conectan en paralelo inverso con bomba y bobinas. Absorben el pico producido al apagar una carga inductiva.

**Sin diodo:** el pico puede reiniciar o destruir MOSFET y ESP32.

El diodo debe soportar la corriente de la carga; no usar un diodo pequeño de señal para una bomba.

## 6.5 Relé o contactor DC para bomba

**Cantidad:** 1.  
**Clasificación:** opcional/recomendado según corriente.

Puede proporcionar aislamiento adicional o permitir un circuito físico de habilitación con emergencia y flotador. Debe estar especificado para corriente continua; un valor alto en AC no garantiza la misma capacidad en DC.

## 6.6 Parada de emergencia

**Cantidad:** 1.  
**Clasificación:** obligatorio.

Botón rojo enclavable con contacto normalmente cerrado.

**Doble función:**

1. Informar al ESP32 mediante GPIO 13.
2. Interrumpir físicamente la habilitación de la bomba.

El sistema no debe depender solamente del software para detenerse.

## 6.7 Diodo TVS de 12 V

**Cantidad:** 1 en la barra de 12 V; seleccionar tensión adecuada.  
**Clasificación:** recomendado.

Limita transitorios rápidos de bomba y cables. Complementa, no sustituye, los diodos de rueda libre.

## 6.8 Condensadores de desacoplo

**Cantidad:** varios.  
**Clasificación:** recomendado.

- 100 nF cerca de cada módulo electrónico.
- 470–1.000 µF cerca de la entrada de 5 V del controlador.
- Condensador de potencia adecuado cerca de cargas si el fabricante lo permite.

Reducen caídas y ruido. La polaridad de los electrolíticos debe respetarse.

## 6.9 Convertidor DC–DC 12 V a 5 V

**Cantidad:** 1.  
**Capacidad:** mínimo 3 A continuos.  
**Clasificación:** obligatorio.

Convierte la batería de 12 V a una alimentación estable para ESP32 y sensores.

**Antes de conectar:** ajustar y medir 5,00 V. Algunos convertidores salen de fábrica con un voltaje distinto.

## 6.10 Fusible de control

**Cantidad:** 1.  
**Valor inicial de estudio:** aproximadamente 2 A.  
**Clasificación:** obligatorio.

Protege el cable de control y el convertidor. El valor definitivo depende de la corriente real y la sección del conductor.

## 6.11 Fusible de válvulas

**Cantidad:** 1.  
**Valor inicial de estudio:** aproximadamente 3–5 A.  
**Clasificación:** obligatorio.

Protege el ramal de las tres electroválvulas. Aunque solo una debe activarse, se calcula considerando el fallo posible.

## 6.12 Fusible de bomba

**Cantidad:** 1.  
**Valor inicial de estudio:** 7,5–10 A.  
**Clasificación:** obligatorio.

Debe soportar el arranque normal y abrir ante sobrecorriente. Se selecciona después de medir la placa y corriente de arranque de la bomba.

---

# 7. Kit de energía solar

## 7.1 Panel solar

**Cantidad:** 1.  
**Potencia base:** 150 W.  
**Clasificación:** obligatorio si el prototipo debe ser autónomo energéticamente.

Convierte radiación solar en electricidad DC.

**Datos que deben verificarse:**

- Potencia nominal.
- Voltaje de circuito abierto, Voc.
- Voltaje de máxima potencia, Vmp.
- Corriente de cortocircuito, Isc.
- Corriente de máxima potencia, Imp.
- Límites del controlador y del INA260.

Un panel de 200 W solo puede reemplazar al de 150 W si el controlador, cable, fusible y sensor de corriente admiten su Isc.

## 7.2 Estructura del panel

**Cantidad:** 1.  
**Clasificación:** obligatorio.

Sostiene el panel con inclinación y orientación adecuadas. Debe resistir viento y evitar bordes accesibles.

**Partes:** perfiles, pernos, arandelas, tuercas autofrenantes y puesta a tierra del marco si el diseño la requiere.

## 7.3 Cable solar

**Cantidad:** según distancia, ida y retorno.  
**Clasificación:** obligatorio.

Cable resistente a UV, temperatura y humedad. La sección se calcula para mantener baja caída de tensión.

## 7.4 Conectores MC4

**Cantidad:** un par o los necesarios.  
**Clasificación:** obligatorio cuando el panel los utiliza.

Crean conexiones solares protegidas. Requieren crimpadora específica; no deben improvisarse con alicates.

## 7.5 Controlador de carga

**Cantidad:** 1.  
**Capacidad:** mínimo 15 A, con margen según panel.  
**Clasificación:** obligatorio.

Regula la energía del panel y carga correctamente la batería.

**Preferencia:** MPPT para aprovechar mejor el panel; un PWM puede usarse en un prototipo de menor costo si es compatible.

**Debe configurarse:** tipo de batería, tensiones de carga, desconexión por bajo voltaje y compensación apropiada.

## 7.6 Batería AGM de 12 V y 55 Ah

**Cantidad:** 1.  
**Clasificación:** obligatorio para operación nocturna y respaldo.

Almacena nominalmente unos 660 Wh. Para prolongar vida útil de una AGM no se debe utilizar toda esa energía; se trabaja aproximadamente con la mitad como reserva útil inicial.

**Función:** alimentar control, válvulas y bomba cuando no hay sol o durante picos.

**Seguridad:**

- Elevada del piso.
- Sujetada con correa.
- Terminales cubiertos.
- Bandeja de contención.
- Ventilación.
- Separada de agua y fertilizantes.

## 7.7 Bandeja y correa de batería

**Cantidad:** 1 de cada una.  
**Clasificación:** obligatorio.

La bandeja contiene derrames y la correa evita movimiento. La batería pesa lo suficiente para causar lesiones o cortocircuito si cae.

## 7.8 Fusible principal

**Cantidad:** 1.  
**Valor inicial de estudio:** aproximadamente 15 A.  
**Clasificación:** obligatorio.

Se instala a pocos centímetros del terminal positivo. Protege el conductor principal si se produce un cortocircuito antes de los fusibles de ramal.

## 7.9 Seccionador principal DC

**Cantidad:** 1.  
**Clasificación:** obligatorio.

Permite apagar todo el sistema para mantenimiento. Debe cortar corriente continua y estar rotulado.

## 7.10 Protección contra inversión de polaridad

**Cantidad:** 1 solución mediante diodo ideal, MOSFET o dispositivo adecuado.  
**Clasificación:** recomendado.

Evita daños si se invierte positivo y negativo durante mantenimiento.

## 7.11 Barras de distribución positiva y negativa

**Cantidad:** 1 par.  
**Clasificación:** recomendado.

Distribuyen energía de forma ordenada a bomba, válvulas y control. Deben estar cubiertas y dimensionadas.

## 7.12 Router o módem 4G

**Cantidad:** 1.  
**Clasificación:** opcional si existe Wi-Fi escolar estable.

Proporciona internet donde no hay Wi-Fi. Puede convertirse en la mayor carga diaria del sistema si permanece encendido 24 horas.

## 7.13 Presupuesto energético

El consumo real se mide durante 24 horas. Un rango de diseño razonable es:

| Carga | Sin módem dedicado | Con módem 24 h |
|---|---:|---:|
| ESP32, convertidor y sensores | 20–40 Wh/día | 20–40 Wh/día |
| Bomba y válvulas | 20–40 Wh/día | 20–40 Wh/día |
| Pantalla/indicadores | 0–8 Wh/día | 0–8 Wh/día |
| Comunicaciones | incluidas en ESP32 | 60–120 Wh/día |
| Pérdidas y reserva | 20–30 Wh/día | 30–50 Wh/día |
| **Total de diseño** | **60–118 Wh/día** | **130–258 Wh/día** |

El panel de 150 W y la AGM de 55 Ah son una base conservadora. Si se instala módem permanente, se debe medir su consumo y recalcular autonomía.

**No se recomienda un inversor:** todas las cargas principales son DC. Convertir 12 V DC a AC y nuevamente a DC desperdicia energía.

---

# 8. Kit de cableado, conexiones y caja

## 8.1 Caja IP65

**Cantidad:** 1.  
**Clasificación:** obligatorio.

Protege el controlador contra polvo y agua. IP65 no significa que pueda sumergirse ni que deba recibir chorros permanentes.

**Distribución interna:** separar potencia, señales y antena Wi-Fi.

## 8.2 Placa de montaje o riel DIN

**Cantidad:** 1.  
**Clasificación:** recomendado.

Permite sujetar borneras, fusibles, convertidor y módulos sin dejarlos colgando.

## 8.3 Borneras

**Cantidad:** según número de circuitos; mínimo 20–30 puntos.  
**Clasificación:** obligatorio.

Conectan cables de manera desmontable y ordenada. Deben identificarse con número o nombre.

## 8.4 Prensaestopas IP65

**Cantidad:** uno por grupo de cables.  
**Clasificación:** obligatorio.

Sujetan y sellan la entrada de cables. El diámetro debe coincidir con el cable; un prensaestopas demasiado grande no sella.

## 8.5 Cable de potencia

**Cantidad:** según instalación.  
**Clasificación:** obligatorio.

- 12–14 AWG: batería y bomba, sujeto a cálculo.
- 18 AWG: electroválvulas.
- 20–22 AWG: sensores y señales.

La sección se confirma con corriente, longitud y caída de tensión.

## 8.6 Código de colores

**Clasificación:** recomendado.

- Rojo: positivo 12 V.
- Negro: negativo/0 V.
- Otro color claramente identificado: 5 V.
- Colores diferentes por señal y zona.

Nunca usar el mismo color para positivo y negativo.

## 8.7 Terminales de anillo

**Cantidad:** según batería y barras.  
**Clasificación:** obligatorio.

Crean conexión firme en tornillos de batería y distribución. Se prensan con herramienta adecuada.

## 8.8 Punteras o ferrules

**Cantidad:** una por extremo de cable flexible que entra en bornera.  
**Clasificación:** recomendado.

Evitan hilos sueltos, falsos contactos y cortocircuitos.

## 8.9 Conectores impermeables desmontables

**Cantidad:** mínimo uno por sensor externo y actuador.  
**Clasificación:** recomendado.

Permiten reemplazar una sonda sin abrir la caja ni cortar cables. Cada conector debe estar codificado para no intercambiar sensores.

## 8.10 Tubo termorretráctil

**Cantidad:** un juego de diámetros.  
**Clasificación:** obligatorio para empalmes.

Aísla y proporciona alivio mecánico. En exterior se prefiere termorretráctil con adhesivo.

## 8.11 Canaleta y manguera corrugada

**Cantidad:** según recorrido.  
**Clasificación:** recomendado.

Protegen y organizan cables. Las señales analógicas deben separarse de bomba y válvulas.

## 8.12 Malla o cable apantallado

**Cantidad:** para señales analógicas largas.  
**Clasificación:** recomendado.

Reduce interferencia. La pantalla se conecta a tierra en un solo extremo para evitar lazos, según el diseño.

## 8.13 Bridas resistentes a UV y bases adhesivas/atornilladas

**Cantidad:** 30–50.  
**Clasificación:** recomendado.

Fijan mazos. En exterior, una base únicamente adhesiva suele soltarse; se prefieren bases atornilladas.

## 8.14 Etiquetas

**Cantidad:** todas las conexiones, ambos extremos.  
**Clasificación:** obligatorio para mantenimiento.

Ejemplos: PUMP+, VA+, HUM-A, TEMP-B, FLOW, PRESS, BAT-SENSE.

---

# 9. Plano de conexiones del ESP32

| Señal | Pin | Función |
|---|---:|---|
| OneWire DS18B20 | GPIO 4 | Temperatura de suelo A/B/C |
| Caudalímetro | GPIO 18 | Conteo de pulsos por interrupción |
| Alimentación de sensores | GPIO 19 | Activa sensores durante lectura |
| Bomba | GPIO 25 | Comanda MOSFET/relé de bomba |
| Válvula A | GPIO 26 | Riego de tomate |
| Válvula B | GPIO 27 | Riego de lechuga |
| Válvula C | GPIO 14 | Riego de pimiento |
| Flotador inferior | GPIO 33 | Corte por tanque bajo |
| Flotador superior | GPIO 23 | Indicación de tanque lleno |
| Emergencia | GPIO 13 | Parada inmediata |
| Tensión de batería | GPIO 34 | ADC mediante divisor 47 kΩ/10 kΩ |
| Nivel ultrasónico TRIG | GPIO 32 | Disparo del sensor |
| Nivel ultrasónico ECHO | GPIO 35 | Retorno mediante divisor 10 kΩ/20 kΩ |
| I²C SDA | GPIO 21 | ADS1115, BME280, DS3231, INA260 |
| I²C SCL | GPIO 22 | ADS1115, BME280, DS3231, INA260 |

## 9.1 Direcciones I²C esperadas

| Dispositivo | Dirección típica |
|---|---:|
| INA260 | 0x40 |
| ADS1115 | 0x48 |
| DS3231 | 0x68 |
| BME280 | 0x76 o 0x77 |
| OLED opcional | 0x3C |
| MCP23017 opcional | 0x20 |

Antes de montar definitivamente se debe ejecutar un escáner I²C y confirmar que no hay direcciones duplicadas.

---

# 10. Kit de comunicaciones y software

## 10.1 Red Wi-Fi de 2,4 GHz

**Clasificación:** obligatorio para comunicación remota.

El ESP32 no utiliza Wi-Fi de 5 GHz. Se debe confirmar cobertura en la ubicación del prototipo y evitar colocar la antena dentro de una caja metálica cerrada.

## 10.2 Certificado TLS

**Clasificación:** obligatorio.

Permite que el ESP32 compruebe que se comunica con el servidor auténtico. No se debe usar `setInsecure()` en la instalación final.

## 10.3 Token del dispositivo

**Cantidad:** 1 secreto exclusivo por controlador.  
**Clasificación:** obligatorio.

Autoriza telemetría y consulta de órdenes. No se muestra en el aplicativo ni se guarda en el repositorio.

## 10.4 Firmware del ESP32

Está en `firmware/src/main.cpp`.

**Módulos funcionales:**

- Inicialización con salidas apagadas.
- Muestreo y promedio.
- Calibración de humedad.
- Lectura de presión, caudal, tanque, batería y ambiente.
- Priorización por déficit.
- Máquina de estados hidráulica.
- Control por volumen.
- Límites diarios persistentes.
- Recuperación de Wi-Fi.
- Telemetría HTTPS.
- Recepción y acuse de comandos.
- Fallo seguro.

## 10.5 API web

**Rutas:**

- `/api/device/telemetry`: recibe muestras del ESP32.
- `/api/device/commands`: entrega órdenes y recibe confirmaciones.
- `/api/state`: proporciona datos al panel autorizado.
- `/api/control`: crea una solicitud de riego manual.

## 10.6 Base de datos

**Tablas:**

- `telemetry`: tanque, batería, solar, presión, caudal y ambiente.
- `zone_readings`: humedad y temperatura por zona.
- `zone_config`: límites y pulsos.
- `commands`: orden, usuario, vencimiento y resultado.
- `audit_events`: bitácora de seguridad y operación.

## 10.7 Aplicativo web

**Función:** supervisar el estado, explicar decisiones y solicitar riegos.

**Elementos mostrados:**

- Conectividad.
- Modo autónomo o pausado.
- Estado de cada zona.
- Recursos de agua y energía.
- Actividad reciente.
- Confirmación de riego manual.
- Bloqueos de seguridad.

El panel exige inicio de sesión. El hecho de que el ESP32 pueda llegar a la API desde internet no vuelve públicos los datos del cultivo.

---

# 11. Herramientas y consumibles de montaje

## 11.1 Herramientas eléctricas

- Multímetro digital: medir tensión, continuidad y polaridad.
- Pinza amperimétrica DC o medidor en serie: medir arranque de bomba.
- Pelacables.
- Crimpadora de terminales.
- Crimpadora MC4.
- Destornilladores aislados.
- Cautín, solo donde sea apropiado; las borneras no se sustituyen con empalmes soldados sueltos.
- Pistola de calor para termorretráctil.
- Taladro y brocas.
- Sierra copa para prensaestopas.

## 11.2 Herramientas hidráulicas

- Cortador de tubo.
- Llaves ajustables.
- Recipiente graduado de al menos 1 L.
- Balde de prueba.
- Cronómetro.
- Cepillo para filtro.

## 11.3 Consumibles

- Cinta PTFE.
- Sellador compatible con el material.
- Silicona neutra para pasos no presurizados.
- Termorretráctil con adhesivo.
- Bridas UV.
- Etiquetas.
- Tornillos de repuesto.
- Fusibles de repuesto de los valores seleccionados.
- Empaques hidráulicos.
- Grasa dieléctrica para conectores compatibles.
- Alcohol isopropílico para limpieza electrónica.
- Resina o encapsulante para la parte superior de sondas capacitivas.

---

# 12. Secuencia completa de funcionamiento

1. La batería alimenta el controlador a través del fusible y convertidor.
2. El ESP32 mantiene bomba y válvulas apagadas.
3. Verifica reloj, memoria y sensores.
4. Energiza temporalmente sensores de humedad.
5. Toma siete muestras por zona y promedia.
6. Lee temperatura de suelo por dirección ROM.
7. Lee tanque, batería, presión, clima y energía solar.
8. Valida rangos físicos.
9. Calcula el déficit de cada zona.
10. Descarta zonas en estabilización o con límite agotado.
11. Selecciona la mayor necesidad.
12. Comprueba emergencia, flotador, batería y sensor.
13. Abre una única electroválvula.
14. Espera 1,5 segundos.
15. Enciende la bomba.
16. Exige pulsos de caudal antes de cinco segundos.
17. Vigila presión alta y baja.
18. Cuenta mililitros.
19. Apaga la bomba al alcanzar el objetivo.
20. Espera 1,5 segundos.
21. Cierra la válvula.
22. Guarda el volumen en memoria.
23. Inicia el tiempo de estabilización.
24. Envía telemetría y resultado al servidor.
25. Si internet falla, continúa desde el paso 3 de forma local.

---

# 13. Fases de construcción

## Fase 1: estructura

- Bastidor.
- Impermeabilización.
- Drenaje.
- Divisores.
- Sustrato.
- Soportes técnicos.

**Salida de fase:** estructura firme, nivelada y sin filtraciones.

## Fase 2: kit hidráulico

- Tanque y salida.
- Filtro.
- Bomba.
- Regulador.
- Instrumentación.
- Colector.
- Válvulas.
- Tuberías y emisores.

**Salida:** circuito manual sin fugas, con presión y caudal repetibles.

## Fase 3: kit solar

- Panel.
- Controlador.
- Batería.
- Fusibles.
- Seccionador.
- Distribución y convertidor.

**Salida:** tensiones correctas, polaridad comprobada y batería cargando.

## Fase 4: sensores y electrónica

- ESP32.
- ADS1115.
- BME280.
- DS3231.
- INA260.
- Sensores de suelo, tanque, presión y caudal.
- MOSFET y protecciones.

**Salida:** lecturas estables con cargas todavía desconectadas.

## Fase 5: firmware y aplicativo

- Credenciales.
- Certificado.
- Calibraciones.
- Carga de firmware.
- API y base de datos.
- Panel web.

**Salida:** telemetría visible y comandos con acuse.

## Fase 6: integración

- Conectar una válvula por vez.
- Conectar bomba al final.
- Calibrar volumen.
- Inducir fallos controlados.

**Salida:** las 21 pruebas de aceptación aprobadas.

---

# 14. Matriz de fallos y respuesta

| Falla | Detección | Respuesta |
|---|---|---|
| Tanque bajo | Flotador + nivel continuo | Detener bomba y bloquear riego |
| Bomba sin agua | Caudal cero | Detener en máximo 5 s |
| Tubería bloqueada | Presión alta | Detener y generar alarma |
| Fuga o manguera suelta | Presión baja/caudal anormal | Detener y generar alarma |
| Sensor de humedad inválido | Rango o desconexión | Bloquear solamente esa zona |
| Batería baja | Divisor de tensión | Suspender riego, mantener monitoreo si es posible |
| Internet caído | Tiempo desde última conexión | Continuar autónomamente |
| Orden duplicada | Identificador único | Ejecutar una sola vez |
| Orden antigua | Fecha de expiración | Rechazar |
| Emergencia | Contacto NC | Corte físico y lógico inmediato |
| Reinicio | Secuencia de arranque | Todas las salidas apagadas |
| Filtro tapado | Caudal y presión | Alarma de mantenimiento |

---

# 15. Elementos que no deben sustituirse incorrectamente

- No usar sensores resistivos de dos puntas como sensores permanentes de suelo.
- No comprar electroválvulas que necesiten presión piloto si no garantizan operación desde 0 bar.
- No conectar cargas de 12 V al ESP32.
- No conectar señales de 5 V directamente a GPIO o ADS1115 alimentado a 3,3 V.
- No usar un INA219 pequeño para medir un panel de 150 W.
- No mantener un inversor AC encendido para alimentar equipos DC.
- No eliminar el flotador porque exista un sensor ultrasónico.
- No eliminar el manómetro porque exista un sensor electrónico.
- No sustituir fusibles con puentes o alambre.
- No colocar batería y electrónica debajo del tanque.
- No exponer el ESP32 directamente a internet mediante puertos del router.
- No permitir que un botón web anule una protección física.

---

# 16. Repuestos mínimos recomendados

- 1 sensor capacitivo adicional.
- 1 DS18B20 adicional.
- 1 electroválvula adicional o kit de reparación.
- 2 microaspersores adicionales.
- 2 m de tubería de 16 mm.
- 2 m de microtubo.
- Tees, uniones y tapones.
- Fusibles de cada valor.
- 1 MOSFET de repuesto.
- Diodos de rueda libre.
- Empaques del filtro y pasamuros.
- Conectores impermeables.

---

# 17. Mantenimiento por componente

## Semanal

- Verificar fugas.
- Revisar nivel y tapa del tanque.
- Observar emisores.
- Consultar alarmas.
- Confirmar que el panel no esté sombreado.

## Mensual

- Limpiar filtro.
- Limpiar panel.
- Probar emergencia y flotador inferior.
- Comparar tensión con multímetro.
- Revisar terminales y prensaestopas.
- Comparar caudal entre zonas.

## Trimestral

- Repetir aforo.
- Revisar calibración de presión.
- Inspeccionar membrana y drenaje.
- Probar dos horas sin internet.
- Revisar sulfatación, corrosión y calentamiento de conexiones.

## Anual

- Evaluar capacidad de batería.
- Recalibrar humedad con el sustrato real.
- Revisar todos los fusibles y cables.
- Actualizar firmware y certificado TLS de forma controlada.

---

# 18. Criterio final de sistema operativo

Comprar todos los componentes no significa que el sistema esté operativo. El proyecto se declara funcional cuando:

- Las conexiones corresponden al plano.
- Los valores de calibración son reales.
- El volumen presenta error igual o menor a 10 %.
- Todas las protecciones detienen la bomba.
- El sistema funciona sin internet.
- El aplicativo registra órdenes y resultados.
- Supera 72 horas continuas y siete días de ensayo.
- Las 21 pruebas del protocolo están firmadas.

La lista de compras debe completarse usando este documento junto con `LISTA-DE-MATERIALES.md`, y la puesta en servicio debe seguir `MONTAJE-Y-PUESTA-EN-MARCHA.md` y `PROTOCOLO-DE-PRUEBAS.md`.

---

# 19. Referencias técnicas principales

- [Texas Instruments — hoja de datos INA260](https://www.ti.com/lit/ds/symlink/ina260.pdf).
- [Adafruit/PlatformIO — biblioteca INA260](https://registry.platformio.org/libraries/adafruit/Adafruit%20INA260%20Library).
- [Espressif — guía oficial del convertidor ADC del ESP32](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/adc/adc_calibration.html).
- [Código y documentación técnica del proyecto](../README.md).
