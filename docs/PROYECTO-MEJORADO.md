# Sistema de riego inteligente 1.0 de la Unidad Educativa Fiscal Samborondón

## 1. Ficha del proyecto

**Nombre oficial:** Sistema de riego inteligente 1.0  
**Tipo:** prototipo educativo de agricultura de precisión  
**Área cultivada:** 2 m², cama de 2,00 × 1,00 m  
**Zonas:** A (tomate), B (lechuga) y C (pimiento)  
**Control:** autónomo local con ESP32 y supervisión web remota  
**Energía:** sistema de 12 V DC con respaldo solar  
**Resultado verificable:** riego independiente por volumen, con telemetría, bitácora y fallo seguro

## 2. Problema y solución

El riego manual o basado únicamente en horarios puede aplicar agua cuando el cultivo no la necesita, no detecta fallos hidráulicos y depende de que una persona esté presente. El Sistema de riego inteligente 1.0 mide cada zona, decide localmente y verifica que el agua realmente circuló. El operador puede observar el estado y solicitar un riego desde el aplicativo web, pero el controlador solo lo ejecuta si todas las protecciones están satisfechas.

La mejora principal respecto de una maqueta convencional es cerrar el ciclo completo:

```text
medir → validar → decidir → regar → comprobar volumen → registrar → informar
```

## 3. Objetivos

### Objetivo general

Diseñar, construir y validar un sistema de riego inteligente capaz de operar autónomamente en tres zonas agrícolas y de ser supervisado y operado remotamente mediante un aplicativo web seguro.

### Objetivos específicos

1. Medir humedad y temperatura del suelo de forma independiente en tres zonas.
2. Regar por volumen real, no únicamente por tiempo.
3. Mantener la automatización local cuando no haya internet.
4. Detectar tanque vacío, falta de caudal, fuga, obstrucción, presión anormal, batería baja y sensores inválidos.
5. Registrar lecturas, decisiones, órdenes y alarmas con fecha, actor y resultado.
6. Utilizar energía solar sin conversiones innecesarias de DC a AC.
7. Demostrar el funcionamiento mediante pruebas repetibles y evidencia registrada.

## 4. Alcance

### Incluido

- Cama agrícola de 2 m² dividida físicamente en tres microzonas.
- Una bomba central de 12 V y una electroválvula normalmente cerrada por zona.
- Dos emisores regulables por zona.
- Humedad y temperatura de suelo por zona.
- Temperatura y humedad ambiental.
- Nivel continuo del tanque y flotador inferior independiente.
- Caudal, presión, tensión de batería y producción solar.
- ESP32, reloj en tiempo real, almacenamiento no volátil y control local.
- API HTTPS, base de datos y aplicativo web responsivo.
- Control manual local, parada de emergencia y riego remoto protegido.

### No incluido en esta fase

- Fertirrigación automática.
- Control de una finca de 200 ha.
- Certificación eléctrica o hidráulica industrial.
- Pronóstico meteorológico como dependencia obligatoria.

El escalamiento a una finca requiere PLC/RTU, válvulas agrícolas, diseño hidráulico profesional y comunicaciones de campo; no consiste en añadir sensores al mismo ESP32.

## 5. Arquitectura funcional

```text
Panel solar → controlador de carga → batería 12 V → fusibles
                                                   ├─ bomba + válvulas
                                                   └─ convertidor 5 V → control

Tanque → filtro → bomba → antirretorno → regulador → presión → caudal
                                                               ├─ válvula A → tomate
                                                               ├─ válvula B → lechuga
                                                               └─ válvula C → pimiento

Sensores → ESP32 → decisión local → MOSFET → bomba/válvulas
              └─ HTTPS con certificado → API → base de datos → aplicativo web
```

### Decisión de diseño: HTTP seguro en lugar de MQTT para el prototipo

El prototipo implementado usa una API HTTPS con consulta periódica de órdenes. Reduce el número de servicios necesarios y permite desplegar panel, API y base de datos como una unidad. La autenticación del dispositivo utiliza un token exclusivo y la conexión verifica el certificado TLS. Para una finca con muchos nodos conviene migrar a MQTT con TLS y credenciales por dispositivo.

## 6. Mejoras técnicas incorporadas

### 6.1 Nivel de tanque realmente medible

Dos flotadores solo informan “bajo” y “lleno”; no pueden justificar un indicador de 78 %. Se añade un sensor ultrasónico impermeable para estimar el porcentaje continuo, manteniendo el flotador inferior como corte independiente de seguridad. La salida ECHO de 5 V debe adaptarse a 3,3 V.

### 6.2 Identidad estable de las sondas

Los DS18B20 se identifican por su dirección ROM de 64 bits. El firmware no depende del orden accidental en el bus: cada dirección se asigna explícitamente a A, B o C y la sonda se etiqueta físicamente.

### 6.3 Riego medido por volumen

El caudalímetro se calibra por aforo. El pulso termina al alcanzar mililitros, con un tiempo máximo como respaldo. La relación inicial de catálogo se reemplaza por:

```text
pulsos por litro = pulsos registrados ÷ litros recogidos
```

### 6.4 Salidas seguras y cargas inductivas

La bomba y las válvulas no se alimentan desde el ESP32. Cada salida utiliza un módulo MOSFET lógico dimensionado, diodo de rueda libre, masa común controlada y fusible. Al iniciar o reiniciar, todas las salidas quedan apagadas.

### 6.5 Comandos idempotentes y con vencimiento

Cada orden remota tiene un identificador único y expira a los dos minutos. El dispositivo acusa aceptación, ejecución o rechazo. La base de datos impide duplicar el identificador, evitando un segundo riego por reintentos de red.

### 6.6 Contadores diarios persistentes

Los mililitros aplicados se conservan en memoria no volátil y se reinician al cambiar el día según el reloj DS3231. Un reinicio no borra el límite diario ni permite regar dos veces por accidente.

## 7. Lógica autónoma

Cada 10 segundos el controlador toma varias muestras, promedia y valida rangos físicos. Si ninguna zona está regando, calcula:

```text
déficit = humedad mínima configurada − humedad medida
```

Selecciona la zona válida con mayor déficit, siempre que haya terminado su estabilización y tenga volumen diario disponible. La histéresis evita encendidos repetidos: se inicia por debajo del mínimo y se impide un nuevo pulso durante el tiempo de absorción.

### Secuencia de un pulso

1. Verificar emergencia, tanque, batería, sensor y límite diario.
2. Abrir únicamente la válvula seleccionada.
3. Esperar 1,5 s.
4. Encender la bomba.
5. Confirmar caudal en menos de 5 s.
6. Vigilar presión y tiempo máximo.
7. Detener al alcanzar el volumen.
8. Apagar la bomba.
9. Esperar 1,5 s y cerrar la válvula.
10. Guardar volumen y entrar en estabilización.

### Parámetros iniciales que deben calibrarse

| Zona | Cultivo | Inicio por debajo de | Pulso inicial | Máximo diario | Estabilización |
|---|---|---:|---:|---:|---:|
| A | Tomate | 45 % | 0,40 L | 3,0 L | 15 min |
| B | Lechuga | 50 % | 0,35 L | 2,4 L | 10 min |
| C | Pimiento | 44 % | 0,40 L | 2,8 L | 15 min |

Son valores de puesta en marcha, no recomendaciones agronómicas definitivas. Deben ajustarse con el sustrato, profundidad radicular, uniformidad de los emisores y respuesta de las plantas.

## 8. Aplicativo web

El aplicativo presenta:

- Estado conectado, autónomo o pausado.
- Caudal, presión, tanque, batería, producción solar y ambiente.
- Humedad, temperatura, umbral, agua diaria y estado por zona.
- Explicación de la decisión autónoma.
- Confirmación antes de una orden manual.
- Bloqueo del comando si la telemetría tiene más de cinco minutos, falta agua, hay baja batería o la zona está deshabilitada.
- Bitácora de acciones y resultado de cada comando.
- Modo demostración cuando aún no se conecta el prototipo.

El sitio debe desplegarse con acceso restringido para operadores. El endpoint del dispositivo requiere un token diferente a la sesión humana. En una instalación escolar permanente se recomienda alojar la API del dispositivo en un endpoint público HTTPS protegido, manteniendo el panel privado.

## 9. Seguridad física y lógica

Protecciones que no pueden anularse desde la web:

- Parada de emergencia cableada con contacto normalmente cerrado.
- Flotador inferior para corte por nivel crítico.
- Fusible principal próximo al positivo de la batería.
- Fusibles separados para control, válvulas y bomba.
- Tiempo máximo de bomba.
- Detección de caudal nulo.
- Límites de presión alta y baja.
- Límite diario por zona.
- Batería mínima y sensor válido.
- Válvulas normalmente cerradas.
- Token único del dispositivo y TLS verificado.
- Registro del usuario, orden y confirmación.

Para una protección adicional, el flotador inferior y la parada de emergencia pueden formar parte del circuito de habilitación del MOSFET/relé de la bomba, de modo que funcionen aunque el microcontrolador falle.

## 10. Datos y privacidad

La base guarda telemetría, lecturas por zona, configuración, órdenes y auditoría. No necesita datos personales de estudiantes. Las credenciales nunca se incluyen en el repositorio. El historial debe tener una política de retención; para el prototipo se recomienda conservar datos por minuto durante 90 días y resúmenes diarios durante el año lectivo.

## 11. Plan de ejecución

| Fase | Resultado | Criterio de salida |
|---|---|---|
| 1. Banco electrónico | Sensores y salidas sin cargas | Lecturas estables y arranque seguro |
| 2. Hidráulica | Circuito sin fugas | Caudal y presión repetibles |
| 3. Calibración | Curvas y constantes reales | Error de volumen ≤ 10 % |
| 4. Autonomía | Riego local sin internet | Tres zonas y todos los bloqueos |
| 5. Conectividad | Telemetría y comandos | Orden con acuse y auditoría |
| 6. Integración solar | Operación en batería | Sin reinicios durante arranque de bomba |
| 7. Aceptación | Prueba continua | 72 h sin bloqueo y 7 días de ensayo |

## 12. Indicadores de éxito

- 100 % de arranques con salidas apagadas.
- Error entre volumen solicitado y recogido igual o menor a 10 % por zona.
- Detención por caudal nulo en máximo 5 s.
- Ningún riego por encima del límite diario.
- Continuidad autónoma durante una desconexión de internet de 2 h.
- 100 % de órdenes remotas con estado final y actor registrado.
- Disponibilidad del controlador de al menos 99 % durante la prueba de siete días.
- Sin agua dentro de la caja eléctrica y sin conductores expuestos.

## 13. Declaración responsable de operatividad

El repositorio contiene un sistema funcional de software y un firmware preparado para el hardware especificado. La expresión “100 % funcional y operativo” solo debe utilizarse después de sustituir las constantes de ejemplo por calibraciones reales y firmar todas las pruebas. La evidencia mínima es: hoja de calibración, fotografías del cableado, aforos, registro de fallos inducidos y exportación de la prueba continua.
