"use client";

import { useEffect, useMemo, useState } from "react";

type Zone = {
  id: "A" | "B" | "C";
  crop: string;
  humidity: number;
  threshold: number;
  temperature: number;
  color: string;
};

type Category = "Energía" | "Control" | "Sensores" | "Hidráulica" | "Estructura";

type Component = {
  name: string;
  category: Category;
  description: string;
  function: string;
  quantity: string;
  spec: string;
  image: string;
};

const initialZones: Zone[] = [
  { id: "A", crop: "Tomate", humidity: 43, threshold: 45, temperature: 24.8, color: "#f05b49" },
  { id: "B", crop: "Lechuga", humidity: 55, threshold: 50, temperature: 23.6, color: "#d7e629" },
  { id: "C", crop: "Pimiento", humidity: 48, threshold: 44, temperature: 25.1, color: "#35c978" },
];

const categoryImages: Record<Category, string> = {
  Energía: "/03-kit-energia-solar.jpg",
  Control: "/06-electronica-control.jpg",
  Sensores: "/05-sensores-instrumentacion.jpg",
  Hidráulica: "/04-kit-hidraulico.jpg",
  Estructura: "/09-estructura-seguridad.jpg",
};

const components: Component[] = [
  { name: "Panel solar monocristalino", category: "Energía", quantity: "1 unidad", spec: "150–200 W recomendado", description: "Módulo fotovoltaico montado sobre estructura de aluminio con inclinación y ventilación posterior.", function: "Convierte la radiación solar en electricidad para cargar la batería y sostener la operación autónoma.", image: categoryImages.Energía },
  { name: "Controlador de carga PWM", category: "Energía", quantity: "1 unidad", spec: "12 V · 15 A mínimo", description: "Regulador situado entre el panel, la batería y las cargas de corriente continua.", function: "Administra la carga de la batería, evita sobrecargas y protege la alimentación del sistema.", image: categoryImages.Energía },
  { name: "Batería AGM", category: "Energía", quantity: "1 unidad", spec: "12 V · 55 Ah", description: "Acumulador sellado instalado en una repisa elevada, seca, ventilada y sujeto mediante correa.", function: "Almacena energía para que el riego continúe durante la noche o cuando disminuye la radiación solar.", image: categoryImages.Energía },
  { name: "Fusible principal DC", category: "Energía", quantity: "1 + repuestos", spec: "15 A · junto al positivo", description: "Protección instalada a pocos centímetros del borne positivo de la batería.", function: "Interrumpe el circuito ante sobrecorriente y reduce el riesgo de daño en cables y equipos.", image: categoryImages.Energía },
  { name: "Convertidor DC–DC", category: "Energía", quantity: "1 unidad", spec: "12 V a 5 V · 3 A", description: "Módulo reductor regulado con entrada desde la distribución protegida de 12 V.", function: "Entrega 5 V estables al ESP32, sensores, pantalla y módulos de bajo consumo.", image: categoryImages.Energía },
  { name: "Inversor auxiliar", category: "Energía", quantity: "1 unidad", spec: "300 W", description: "Equipo incluido en el kit solar y conectado a una rama independiente con protección.", function: "Alimenta únicamente cargas auxiliares de corriente alterna; no forma parte de la ruta principal eficiente.", image: categoryImages.Energía },
  { name: "Cables solares y conectores MC4", category: "Energía", quantity: "1 juego", spec: "Rojo/negro · UV", description: "Conductores flexibles, terminales de anillo, conectores y elementos de fijación para intemperie.", function: "Transportan energía con polaridad identificada y conexiones resistentes al ambiente.", image: categoryImages.Energía },

  { name: "ESP32 DevKit", category: "Control", quantity: "1 unidad", spec: "Wi‑Fi integrado", description: "Microcontrolador de hardware libre programable desde Arduino IDE.", function: "Lee sensores, ejecuta la lógica autónoma, controla bomba y válvulas y comunica datos con la web.", image: categoryImages.Control },
  { name: "Convertidor ADS1115", category: "Control", quantity: "1 unidad", spec: "ADC · 16 bits", description: "Módulo de conversión analógica de alta resolución conectado por I²C.", function: "Mejora la estabilidad de las lecturas de humedad y evita limitaciones del ADC interno del ESP32.", image: categoryImages.Control },
  { name: "Reloj DS3231", category: "Control", quantity: "1 unidad", spec: "RTC con respaldo", description: "Reloj de tiempo real con batería propia para conservar fecha y hora.", function: "Registra cada riego, alarma y medición con una marca temporal confiable aun sin internet.", image: categoryImages.Control },
  { name: "Módulo microSD", category: "Control", quantity: "1 unidad", spec: "Registro local", description: "Lector de tarjeta instalado dentro del gabinete protegido.", function: "Guarda historial operativo para análisis, evaluación escolar y recuperación cuando no existe conexión.", image: categoryImages.Control },
  { name: "Pantalla LCD 20×4", category: "Control", quantity: "1 unidad", spec: "Interfaz I²C", description: "Pantalla local retroiluminada visible desde el panel frontal.", function: "Muestra humedad, modo, zona activa, nivel del tanque, batería y alarmas sin depender de la web.", image: categoryImages.Control },
  { name: "Drivers MOSFET", category: "Control", quantity: "4 canales", spec: "Nivel lógico · 12 V", description: "Etapa electrónica dimensionada para una bomba y tres electroválvulas, con diodos de protección.", function: "Permite al ESP32 conmutar cargas de mayor corriente sin someter sus pines a esfuerzos eléctricos.", image: categoryImages.Control },
  { name: "Gabinete IP65", category: "Control", quantity: "1 unidad", spec: "Puerta transparente", description: "Caja cerrada con riel, canaletas, borneras, prensaestopas y separación de señales y potencia.", function: "Mantiene la electrónica seca, organizada, inspeccionable y protegida contra polvo y salpicaduras.", image: categoryImages.Control },
  { name: "Parada de emergencia", category: "Control", quantity: "1 unidad", spec: "Pulsador tipo hongo", description: "Mando rojo de enclavamiento instalado en un lugar frontal y accesible.", function: "Corta inmediatamente la energía de bomba y válvulas manteniendo disponible el registro de control.", image: categoryImages.Control },
  { name: "Selector AUTO/MANUAL", category: "Control", quantity: "1 unidad", spec: "2 posiciones", description: "Selector físico para operación autónoma o intervención durante pruebas y mantenimiento.", function: "Permite cambiar el modo de trabajo sin modificar la programación del controlador.", image: categoryImages.Control },

  { name: "Sensor capacitivo de humedad", category: "Sensores", quantity: "3 unidades", spec: "1 por zona · sellado", description: "Sonda de pala plana recubierta, instalada a la profundidad representativa de las raíces.", function: "Mide el contenido relativo de humedad sin exponer electrodos metálicos propensos a corrosión.", image: categoryImages.Sensores },
  { name: "Sonda DS18B20", category: "Sensores", quantity: "3 unidades", spec: "Acero inoxidable", description: "Sensor digital impermeable colocado en el suelo de cada zona.", function: "Registra la temperatura radicular para contextualizar las lecturas y detectar condiciones anómalas.", image: categoryImages.Sensores },
  { name: "Sensor ambiental BME280", category: "Sensores", quantity: "1 unidad", spec: "Temperatura · humedad · presión", description: "Módulo protegido por cubierta ventilada y ubicado fuera del gabinete.", function: "Aporta condiciones ambientales para interpretar la demanda hídrica y documentar el ensayo.", image: categoryImages.Sensores },
  { name: "Flotadores de nivel", category: "Sensores", quantity: "2 unidades", spec: "Nivel bajo y alto", description: "Interruptores instalados en dos alturas del tanque de almacenamiento.", function: "Impiden el trabajo en seco de la bomba y reportan disponibilidad o llenado del depósito.", image: categoryImages.Sensores },
  { name: "Medidor de caudal", category: "Sensores", quantity: "1 unidad", spec: "Efecto Hall", description: "Sensor en línea instalado después de la bomba y antes del colector de zonas.", function: "Confirma circulación de agua, calcula volumen aplicado y detecta obstrucciones o fallas de bombeo.", image: categoryImages.Sensores },
  { name: "Sensor de presión", category: "Sensores", quantity: "1 unidad", spec: "0–10 bar", description: "Transductor roscado complementado por un manómetro analógico de inspección.", function: "Supervisa la presión hidráulica y permite detener el sistema ante fugas, bloqueo o sobrepresión.", image: categoryImages.Sensores },
  { name: "Sensor de corriente", category: "Sensores", quantity: "1 unidad", spec: "Monitor DC", description: "Módulo de medición instalado en la rama de potencia de la bomba.", function: "Ayuda a identificar bomba bloqueada, consumo anormal y problemas eléctricos antes de que causen daño.", image: categoryImages.Sensores },

  { name: "Tanque de agua", category: "Hidráulica", quantity: "1 unidad", spec: "40–60 L", description: "Depósito azul con tapa, salida inferior y soporte metálico estable.", function: "Conserva el agua de riego y entrega una reserva suficiente para demostraciones autónomas.", image: categoryImages.Hidráulica },
  { name: "Filtro de riego", category: "Hidráulica", quantity: "1 unidad", spec: "120 mesh", description: "Filtro lavable de carcasa transparente instalado antes de la bomba.", function: "Retiene partículas que podrían obstruir el caudalímetro, las válvulas y los microaspersores.", image: categoryImages.Hidráulica },
  { name: "Bomba de diafragma", category: "Hidráulica", quantity: "1 unidad", spec: "12 V · 3–5 L/min", description: "Bomba compacta de corriente continua fijada sobre base antivibratoria.", function: "Genera el caudal y la presión necesarios para irrigar una zona a la vez.", image: categoryImages.Hidráulica },
  { name: "Válvula de retención", category: "Hidráulica", quantity: "1 unidad", spec: "½ pulgada", description: "Accesorio instalado en la línea principal respetando el sentido del flujo.", function: "Evita el retorno del agua y ayuda a conservar cebada la conducción.", image: categoryImages.Hidráulica },
  { name: "Colector de tres vías", category: "Hidráulica", quantity: "1 unidad", spec: "Tres sectores", description: "Manifold rígido situado después de los instrumentos de caudal y presión.", function: "Distribuye el suministro principal hacia las tres zonas independientes.", image: categoryImages.Hidráulica },
  { name: "Electroválvulas", category: "Hidráulica", quantity: "3 unidades", spec: "12 V · normalmente cerradas", description: "Válvulas de acción directa, una por tomate, lechuga y pimiento.", function: "Aíslan cada sector y permiten que el controlador aplique agua únicamente donde existe demanda.", image: categoryImages.Hidráulica },
  { name: "Tubería principal PE", category: "Hidráulica", quantity: "Según trazado", spec: "16 mm · protección UV", description: "Manguera negra para la conducción principal y los lazos de cada zona.", function: "Transporta el agua con pérdidas reducidas y una instalación ordenada y reparable.", image: categoryImages.Hidráulica },
  { name: "Microtubo y microaspersores", category: "Hidráulica", quantity: "6 emisores", spec: "2 por zona · regulables", description: "Ramales de 6 mm y emisores sobre estacas distribuidos de forma uniforme.", function: "Aplican una lluvia fina ajustable sobre el suelo de cada cultivo y permiten comparar uniformidad.", image: categoryImages.Hidráulica },

  { name: "Cama de cultivo", category: "Estructura", quantity: "1 unidad", spec: "2,00 × 1,00 m", description: "Estructura de madera tratada dividida en tres microzonas equivalentes.", function: "Contiene el sustrato y reproduce a escala controlada sectores agrícolas con diferentes cultivos.", image: categoryImages.Estructura },
  { name: "Revestimiento y drenaje", category: "Estructura", quantity: "1 juego", spec: "HDPE + malla", description: "Barrera impermeable y capa drenante instaladas sin bloquear la evacuación del exceso de agua.", function: "Protege la estructura, controla filtraciones y evita encharcamientos durante las pruebas.", image: categoryImages.Estructura },
  { name: "Soportes elevados", category: "Estructura", quantity: "3 conjuntos", spec: "Tanque · batería · panel", description: "Bastidores metálicos o de aluminio anclados y dimensionados para cada carga.", function: "Mantienen los equipos estables, secos, ventilados y separados del suelo húmedo.", image: categoryImages.Estructura },
  { name: "Canalización y fijaciones", category: "Estructura", quantity: "1 juego", spec: "IP67 · protección UV", description: "Canaletas, conduit, cajas de paso, prensaestopas, abrazaderas y tornillería inoxidable.", function: "Ordenan los recorridos, evitan esfuerzos en terminales y separan agua, potencia y señales.", image: categoryImages.Estructura },
  { name: "Seguridad y herramientas", category: "Estructura", quantity: "1 juego", spec: "EPP + multímetro", description: "Gafas, guantes, extintor, multímetro, crimpadora, destornilladores y cortatubo.", function: "Permiten construir, comprobar y mantener la maqueta siguiendo prácticas seguras.", image: categoryImages.Estructura },
];

const additionalComponents: Component[] = [
  { name: "Barra de distribución DC", category: "Energía", quantity: "1 unidad", spec: "12 V · borneras protegidas", description: "Punto central de reparto instalado después del interruptor y el fusible general.", function: "Distribuye la energía protegida hacia bomba, válvulas, convertidor de 5 V y comunicaciones.", image: categoryImages.Energía },
  { name: "Interruptor principal", category: "Energía", quantity: "1 unidad", spec: "DC · 20 A mínimo", description: "Seccionador accesible instalado entre la batería y la distribución de cargas.", function: "Permite desenergizar de forma segura toda la maqueta durante mantenimiento o emergencia.", image: categoryImages.Energía },
  { name: "Cable de potencia 12–14 AWG", category: "Energía", quantity: "Según recorrido", spec: "Batería y bomba", description: "Conductor flexible rojo y negro dimensionado para las ramas de mayor corriente.", function: "Reduce caída de tensión y calentamiento entre batería, protecciones, bomba y distribución.", image: categoryImages.Energía },
  { name: "Cable para válvulas 18 AWG", category: "Energía", quantity: "Según recorrido", spec: "Tres electroválvulas", description: "Cableado identificado para la alimentación individual de los actuadores hidráulicos.", function: "Conduce la corriente de cada válvula con margen térmico y facilita su mantenimiento.", image: categoryImages.Energía },
  { name: "Cable de señal 20–22 AWG", category: "Energía", quantity: "Según recorrido", spec: "Sensores y buses", description: "Conductores de baja corriente para entradas digitales, analógicas e I²C.", function: "Conecta la instrumentación al controlador sin mezclar señales con las líneas de potencia.", image: categoryImages.Energía },
  { name: "Terminales de anillo", category: "Energía", quantity: "1 juego", spec: "Bornes de batería", description: "Terminales crimpados y aislados compatibles con los pernos de la batería AGM.", function: "Aseguran una unión mecánica firme, de baja resistencia y protegida contra falsos contactos.", image: categoryImages.Energía },
  { name: "Portafusibles individuales", category: "Energía", quantity: "4 unidades", spec: "Bomba y válvulas", description: "Bases accesibles para proteger cada rama de carga según su corriente nominal.", function: "Aíslan una falla sin apagar innecesariamente los demás subsistemas.", image: categoryImages.Energía },
  { name: "Router o módem", category: "Control", quantity: "1 unidad", spec: "Wi‑Fi / 4G opcional", description: "Equipo de comunicaciones alimentado desde una salida protegida de la distribución DC.", function: "Enlaza el ESP32 con la aplicación web remota manteniendo el control autónomo local.", image: categoryImages.Control },
  { name: "Tarjeta microSD", category: "Control", quantity: "1 unidad", spec: "8–32 GB · FAT32", description: "Memoria extraíble de calidad industrial o alta resistencia instalada en el lector local.", function: "Almacena lecturas, riegos, alarmas y diagnósticos cuando internet no está disponible.", image: categoryImages.Control },
  { name: "MOSFET para bomba", category: "Control", quantity: "1 canal", spec: "Nivel lógico · disipado", description: "Etapa de potencia de baja pérdida con resistencia de compuerta y protección inductiva.", function: "Activa la bomba de 12 V sin cargar los pines del ESP32 y con mejor eficiencia que un relé continuo.", image: categoryImages.Control },
  { name: "MOSFET para válvulas", category: "Control", quantity: "3 canales", spec: "Uno por zona", description: "Tres canales independientes de conmutación para las electroválvulas normalmente cerradas.", function: "Abren únicamente la zona ordenada y permiten pruebas manuales sector por sector.", image: categoryImages.Control },
  { name: "Diodos de rueda libre", category: "Control", quantity: "4 unidades", spec: "Bomba + 3 válvulas", description: "Diodos instalados en paralelo inverso sobre cada carga inductiva de corriente continua.", function: "Absorben el pico de tensión generado al apagar motores y bobinas, protegiendo los MOSFET.", image: categoryImages.Control },
  { name: "Relé automotriz auxiliar", category: "Control", quantity: "1 opcional", spec: "12 V · 30 A", description: "Relé de potencia con zócalo y fusible usado como aislamiento adicional de la bomba.", function: "Permite un corte físico de la rama de bombeo cuando la estrategia de seguridad lo exige.", image: categoryImages.Control },
  { name: "Botones manuales de zona", category: "Control", quantity: "3 unidades", spec: "A · B · C", description: "Pulsadores frontales identificados para pruebas controladas de cada sector.", function: "Solicitan un ciclo manual sin anular las protecciones de nivel, caudal y emergencia.", image: categoryImages.Control },
  { name: "Indicadores LED de zona", category: "Control", quantity: "3 unidades", spec: "Rojo · amarillo · verde", description: "Pilotos luminosos frontales asociados a las zonas A, B y C.", function: "Muestran de forma inmediata qué electroválvula está activa durante operación y exposición.", image: categoryImages.Control },
  { name: "LED de alarma", category: "Control", quantity: "1 unidad", spec: "Alta visibilidad", description: "Indicador independiente para nivel bajo, falta de caudal, sobrecorriente o fallo de sensor.", function: "Advierte visualmente una condición que requiere atención del operador.", image: categoryImages.Control },
  { name: "Zumbador", category: "Control", quantity: "1 unidad", spec: "5 V · activo", description: "Alarma acústica montada en el panel y gobernada por una salida protegida.", function: "Refuerza las alarmas críticas y confirma acciones durante diagnóstico.", image: categoryImages.Control },
  { name: "Watchdog integrado", category: "Control", quantity: "1 función", spec: "ESP32", description: "Temporizador interno supervisado por el firmware durante la ejecución normal.", function: "Reinicia el controlador si una tarea se bloquea y devuelve el sistema a un estado seguro.", image: categoryImages.Control },
  { name: "Borneras y punteras", category: "Control", quantity: "1 juego", spec: "Carril DIN", description: "Bloques de conexión y ferrules crimpados para terminar conductores flexibles.", function: "Ordenan la distribución, evitan hilos sueltos y simplifican medición y sustitución.", image: categoryImages.Control },
  { name: "Cable apantallado", category: "Control", quantity: "Según necesidad", spec: "Señales analógicas largas", description: "Cable con malla conectada a tierra en un solo extremo para recorridos sensibles.", function: "Reduce interferencias de la bomba y de las válvulas sobre las mediciones analógicas.", image: categoryImages.Control },
  { name: "Sensor de lluvia", category: "Sensores", quantity: "1 opcional", spec: "Contacto protegido", description: "Detector exterior instalado en posición libre de salpicaduras del propio riego.", function: "Suspende ciclos automáticos durante precipitación y registra el evento meteorológico.", image: categoryImages.Sensores },
  { name: "Conectores impermeables", category: "Sensores", quantity: "Según sensores", spec: "IP67", description: "Acoples desmontables sellados e identificados para sondas y actuadores de campo.", function: "Permiten mantenimiento rápido sin abrir empalmes ni comprometer la protección contra agua.", image: categoryImages.Sensores },
  { name: "Manómetro analógico", category: "Hidráulica", quantity: "1 unidad", spec: "0–6 bar", description: "Instrumento visible conectado mediante una derivación en la línea de impulsión.", function: "Permite contrastar el sensor electrónico y diagnosticar presión aun sin energía.", image: categoryImages.Hidráulica },
  { name: "Válvula de corte manual", category: "Hidráulica", quantity: "2 unidades", spec: "Entrada y mantenimiento", description: "Llaves de paso instaladas a la salida del tanque y antes del colector.", function: "Aíslan tramos para limpieza del filtro, reparación o transporte de la maqueta.", image: categoryImages.Hidráulica },
  { name: "Accesorios hidráulicos", category: "Hidráulica", quantity: "1 juego", spec: "Tes · codos · uniones", description: "Conectores, adaptadores, abrazaderas y cinta PTFE compatibles con cada diámetro.", function: "Construyen una red desmontable y estanca, minimizando fugas y pérdidas de carga.", image: categoryImages.Hidráulica },
  { name: "Membrana impermeable", category: "Estructura", quantity: "1 pieza", spec: "2,2 × 1,2 m", description: "Lámina resistente colocada dentro de la cama con pliegues protegidos.", function: "Evita filtraciones hacia la madera y conduce el exceso de agua al drenaje.", image: categoryImages.Estructura },
  { name: "Geotextil", category: "Estructura", quantity: "1 pieza", spec: "Separación y drenaje", description: "Manta permeable situada entre el sustrato y la capa drenante.", function: "Retiene finos sin bloquear el paso del agua y mantiene estable el lecho de cultivo.", image: categoryImages.Estructura },
  { name: "Divisores internos", category: "Estructura", quantity: "2 unidades", spec: "Tres zonas", description: "Separadores impermeabilizados instalados transversalmente en la cama.", function: "Independizan tomate, lechuga y pimiento para comparar decisiones de riego.", image: categoryImages.Estructura },
  { name: "Patas niveladoras", category: "Estructura", quantity: "4–6 unidades", spec: "Ajustables", description: "Apoyos regulables fijados a la base estructural.", function: "Mantienen la maqueta estable y con pendiente de drenaje controlada.", image: categoryImages.Estructura },
  { name: "Bandeja elevada para batería", category: "Estructura", quantity: "1 unidad", spec: "Seca y ventilada", description: "Repisa rígida ubicada fuera de la cama y por encima del suelo.", function: "Evita que la batería permanezca sobre tierra húmeda y facilita inspeccionar sus bornes.", image: categoryImages.Estructura },
  { name: "Correa de batería", category: "Estructura", quantity: "1 unidad", spec: "Sujeción mecánica", description: "Cincha resistente fijada a la bandeja elevada.", function: "Impide el desplazamiento o vuelco del acumulador durante transporte y operación.", image: categoryImages.Estructura },
  { name: "Bandeja inferior de contención", category: "Estructura", quantity: "1 unidad", spec: "Fugas y drenaje", description: "Superficie impermeable desmontable situada bajo conexiones hidráulicas críticas.", function: "Contiene pequeñas fugas y protege la mesa o el suelo de exposición.", image: categoryImages.Estructura },
  { name: "Riel DIN y canaletas", category: "Estructura", quantity: "1 juego", spec: "Gabinete técnico", description: "Perfiles y ductos internos para fijar protecciones, borneras y conductores.", function: "Mantienen el tablero ordenado, accesible y con separación entre potencia y señales.", image: categoryImages.Estructura },
  { name: "Prensaestopas IP65", category: "Estructura", quantity: "Según entradas", spec: "M12–M20", description: "Pasacables roscados con sello de compresión instalados en la cara inferior del gabinete.", function: "Evitan entrada de polvo y agua y descargan esfuerzos mecánicos sobre las conexiones.", image: categoryImages.Estructura },
  { name: "Etiquetas técnicas", category: "Estructura", quantity: "1 juego", spec: "Cables y equipos", description: "Marcadores resistentes al agua colocados en ambos extremos de cada conductor y tubería.", function: "Facilitan instalación, exposición, diagnóstico y mantenimiento seguro.", image: categoryImages.Estructura },
];

const allComponents = [...components, ...additionalComponents];

const componentCrops: Record<string, [number, number, number]> = {
  "Panel solar monocristalino": [30, 24, 175], "Controlador de carga PWM": [69, 42, 210], "Batería AGM": [84, 20, 190], "Inversor auxiliar": [16, 74, 210], "Cables solares y conectores MC4": [48, 68, 220], "Fusible principal DC": [62, 84, 260], "Convertidor DC–DC": [88, 84, 260], "Barra de distribución DC": [76, 82, 260], "Interruptor principal": [62, 82, 260], "Cable de potencia 12–14 AWG": [45, 67, 230], "Cable para válvulas 18 AWG": [49, 70, 240], "Cable de señal 20–22 AWG": [43, 70, 240], "Terminales de anillo": [57, 70, 280], "Portafusibles individuales": [66, 84, 280],
  "Gabinete IP65": [16, 25, 180], "Router o módem": [56, 20, 220], "ESP32 DevKit": [23, 52, 250], "Convertidor ADS1115": [34, 52, 280], "Reloj DS3231": [38, 52, 280], "Módulo microSD": [43, 52, 280], "Tarjeta microSD": [44, 52, 320], "Pantalla LCD 20×4": [53, 52, 240], "Drivers MOSFET": [66, 52, 240], "MOSFET para bomba": [66, 52, 290], "MOSFET para válvulas": [75, 52, 250], "Relé automotriz auxiliar": [61, 72, 270], "Parada de emergencia": [10, 72, 260], "Selector AUTO/MANUAL": [27, 72, 280], "Botones manuales de zona": [38, 72, 250], "Indicadores LED de zona": [38, 72, 280], "LED de alarma": [12, 72, 300], "Zumbador": [51, 72, 300], "Diodos de rueda libre": [72, 72, 300], "Watchdog integrado": [23, 52, 300], "Borneras y punteras": [52, 88, 220], "Cable apantallado": [85, 88, 240],
  "Sensor capacitivo de humedad": [18, 19, 230], "Sonda DS18B20": [30, 52, 260], "Sensor ambiental BME280": [51, 51, 270], "Flotadores de nivel": [69, 43, 230], "Medidor de caudal": [90, 52, 240], "Sensor de presión": [13, 83, 260], "Sensor de corriente": [35, 84, 260], "Sensor de lluvia": [60, 84, 250], "Conectores impermeables": [85, 84, 240],
  "Tanque de agua": [20, 25, 180], "Filtro de riego": [42, 44, 260], "Bomba de diafragma": [56, 44, 260], "Medidor de caudal": [67, 45, 260], "Válvula de retención": [74, 43, 280], "Colector de tres vías": [52, 62, 230], "Electroválvulas": [72, 62, 230], "Tubería principal PE": [15, 75, 220], "Microtubo y microaspersores": [52, 82, 230], "Manómetro analógico": [84, 47, 260], "Válvula de corte manual": [31, 44, 270], "Accesorios hidráulicos": [80, 82, 220],
  "Cama de cultivo": [50, 15, 170], "Revestimiento y drenaje": [22, 50, 210], "Membrana impermeable": [22, 43, 240], "Geotextil": [22, 58, 240], "Divisores internos": [50, 46, 240], "Patas niveladoras": [65, 46, 260], "Soportes elevados": [50, 48, 210], "Bandeja elevada para batería": [48, 64, 250], "Correa de batería": [31, 65, 280], "Bandeja inferior de contención": [22, 58, 240], "Riel DIN y canaletas": [10, 65, 250], "Prensaestopas IP65": [64, 65, 280], "Etiquetas técnicas": [90, 65, 260], "Canalización y fijaciones": [65, 65, 220], "Seguridad y herramientas": [50, 85, 180],
};

function ComponentVisual({ component, large = false }: { component: Component; large?: boolean }) {
  const [x, y, zoom] = componentCrops[component.name] ?? [50, 50, 180];
  return <div className={`component-visual${large ? " large" : ""}`} role="img" aria-label={`Vista individual de ${component.name}`} style={{ backgroundImage: `url(${component.image})`, backgroundPosition: `${x}% ${y}%`, backgroundSize: `${zoom}% auto` }}><span>{component.name}</span></div>;
}

const gallery = [
  ["/01-maqueta-completa.jpg", "Maqueta completa", "Prototipo funcional de 1 × 2 metros"],
  ["/02-arquitectura-principal.jpg", "Arquitectura principal", "Energía, agua, control y comunicación"],
  ["/03-kit-energia-solar.jpg", "Energía solar", "Componentes fotovoltaicos y protecciones"],
  ["/04-kit-hidraulico.jpg", "Sistema hidráulico", "Tanque, bomba, válvulas y distribución"],
  ["/05-sensores-instrumentacion.jpg", "Instrumentación", "Sensores de campo resistentes y medibles"],
  ["/06-electronica-control.jpg", "Automatización", "Controlador, módulos, gabinete y mandos"],
  ["/07-conexion-electrica.jpg", "Conexión eléctrica", "Distribución DC protegida y documentada"],
  ["/08-conexion-hidraulica.jpg", "Conexión hidráulica", "Tres zonas independientes y seis emisores"],
  ["/09-estructura-seguridad.jpg", "Montaje y seguridad", "Estructura, herramientas y protección"],
  ["/10-control-remoto-web.jpg", "Aplicación web", "Supervisión responsiva desde cualquier dispositivo"],
] as const;

const installation = [
  ["01", "Preparación estructural", "Construir y nivelar la cama de 2,00 × 1,00 m, colocar divisiones, revestimiento, drenaje y soportes externos."],
  ["02", "Montaje hidráulico", "Instalar tanque, válvula manual, filtro, retención, bomba, medición, colector, electroválvulas y líneas por zona."],
  ["03", "Sistema solar", "Fijar panel, controlador y batería elevada; comprobar polaridad, fusibles y tensión antes de conectar las cargas."],
  ["04", "Automatización", "Montar ESP32, ADC, reloj, registro, drivers, pantalla y borneras dentro del gabinete seco."],
  ["05", "Sensores y actuadores", "Instalar sondas a profundidad radicular, flotadores, caudal y presión; conectar bomba y válvulas con protección inductiva."],
  ["06", "Programación", "Cargar el firmware, configurar Wi‑Fi, umbrales, tiempos máximos, estabilización y credenciales seguras del servicio web."],
  ["07", "Calibración", "Registrar valores de suelo seco, humedad de campo y saturación para transformar lecturas en porcentajes útiles por zona."],
  ["08", "Pruebas de aceptación", "Verificar fugas, corte por tanque bajo, ausencia de caudal, sobrepresión, reinicio, modo sin internet y parada de emergencia."],
];

const categories: Array<"Todos" | Category> = ["Todos", "Energía", "Control", "Sensores", "Hidráulica", "Estructura"];

function Arrow() {
  return <span aria-hidden="true" className="arrow">→</span>;
}

export default function Home() {
  const [zones, setZones] = useState(initialZones);
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("Todos");
  const [query, setQuery] = useState("");
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tankLevel, setTankLevel] = useState(78);
  const [battery, setBattery] = useState(86);
  const [mode, setMode] = useState<"AUTO" | "MANUAL">("AUTO");
  const [irrigating, setIrrigating] = useState<Zone["id"] | null>(null);
  const [eventLog, setEventLog] = useState("Sistema verificado. Monitoreo autónomo activo.");
  const [clock, setClock] = useState("");
  const [area, setArea] = useState(200);

  useEffect(() => {
    const update = () => setClock(new Intl.DateTimeFormat("es-EC", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const averageHumidity = Math.round(zones.reduce((sum, zone) => sum + zone.humidity, 0) / zones.length);
  const priority = useMemo(() => [...zones].filter((zone) => zone.humidity < zone.threshold).sort((a, b) => (b.threshold - b.humidity) - (a.threshold - a.humidity))[0] ?? null, [zones]);
  const filteredComponents = useMemo(() => allComponents.filter((component) => {
    const categoryMatch = activeCategory === "Todos" || component.category === activeCategory;
    const haystack = `${component.name} ${component.description} ${component.function}`.toLowerCase();
    return categoryMatch && haystack.includes(query.trim().toLowerCase());
  }), [activeCategory, query]);

  const runCycle = (manualZone?: Zone["id"]) => {
    if (irrigating || tankLevel < 15) {
      if (tankLevel < 15) setEventLog("Protección activa: nivel de tanque insuficiente.");
      return;
    }
    const target = manualZone ? zones.find((zone) => zone.id === manualZone) : priority;
    if (!target) {
      setEventLog("Lecturas estables: ninguna zona requiere riego.");
      return;
    }
    setIrrigating(target.id);
    setEventLog(`Zona ${target.id} · ${target.crop}: válvula abierta, verificando caudal.`);
    window.setTimeout(() => {
      setZones((current) => current.map((zone) => zone.id === target.id ? { ...zone, humidity: Math.min(90, zone.humidity + 8) } : zone));
      setTankLevel((level) => Math.max(0, level - 2));
      setBattery((level) => Math.max(0, level - 1));
      setIrrigating(null);
      setEventLog(`Pulso completado en zona ${target.id}. Periodo de estabilización iniciado.`);
    }, 1600);
  };

  const dryScenario = () => {
    setZones(initialZones.map((zone, index) => ({ ...zone, humidity: [29, 41, 33][index] })));
    setEventLog("Escenario de suelo seco cargado. Prioridad recalculada.");
  };

  const projectedSectors = Math.ceil(area / 2.5);
  const projectedNodes = Math.max(3, Math.ceil(area / 2.5));
  const projectedWater = Math.round(area * 55.6);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <img src="/logo-institucion.jpeg" alt="Logotipo de la Unidad Educativa Fiscal Samborondón" />
          <span><small>Unidad Educativa Fiscal</small><strong>Samborondón</strong></span>
        </a>
        <button className="menu-toggle" type="button" aria-label="Abrir navegación" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><i /><i /></button>
        <nav className={menuOpen ? "open" : ""} aria-label="Navegación principal">
          <a href="#proyecto" onClick={() => setMenuOpen(false)}>El proyecto</a>
          <a href="#componentes" onClick={() => setMenuOpen(false)}>Componentes</a>
          <a href="#monitoreo" onClick={() => setMenuOpen(false)}>Monitoreo</a>
          <a href="#arquitectura" onClick={() => setMenuOpen(false)}>Sistema</a>
          <a href="#instalacion" onClick={() => setMenuOpen(false)}>Instalación</a>
          <a href="#galeria" onClick={() => setMenuOpen(false)}>Galería</a>
          <a className="nav-button" href="#monitoreo">Dashboard <Arrow /></a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <img className="hero-photo" src="/01-maqueta-completa.jpg" alt="Sistema de Riego Inteligente instalado y funcionando" fetchPriority="high" decoding="async" />
        <div className="hero-wash" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <p className="kicker"><span /> Proyecto STEAM · Agricultura de precisión</p>
            <h1><span>Sistema de</span> Riego Inteligente</h1>
            <p className="hero-subtitle">Tecnología autónoma, sostenible y conectada para optimizar el uso del agua, monitorear cultivos y tomar decisiones de riego en tiempo real.</p>
            <div className="hero-actions">
              <a className="button primary" href="#proyecto">Explorar proyecto <Arrow /></a>
              <a className="button secondary" href="#monitoreo">Ver en tiempo real <span aria-hidden="true">↗</span></a>
            </div>
            <div className="connected"><i /><span><strong>Sistema conectado</strong>Todos los módulos operan correctamente</span></div>
          </div>
          <div className="hero-side-card">
            <span className="live-pill"><i /> Operación autónoma</span>
            <strong>{clock || "08:30:00"}</strong>
            <small>Hora del controlador</small>
            <div className="mini-bars"><i style={{ height: "52%" }} /><i style={{ height: "68%" }} /><i style={{ height: "78%" }} /><i style={{ height: "64%" }} /><i style={{ height: "88%" }} /><i style={{ height: "74%" }} /></div>
          </div>
        </div>
        <div className="hero-monitor">
          <div className="container metrics-grid">
            <article><span>Humedad promedio</span><strong>{averageHumidity}%</strong><small>Lectura óptima</small></article>
            <article><span>Temperatura ambiente</span><strong>28.4 °C</strong><small>Condición normal</small></article>
            <article><span>Nivel del tanque</span><strong>{tankLevel}%</strong><small>Reserva disponible</small></article>
            <article><span>Caudal actual</span><strong>{irrigating ? "3.2" : "0.0"} L/min</strong><small>{irrigating ? "Flujo confirmado" : "En espera"}</small></article>
            <article><span>Energía del sistema</span><strong>{battery}%</strong><small>Autonomía solar</small></article>
          </div>
        </div>
      </section>

      <section className="impact-strip" aria-label="Beneficios principales">
        <div className="container"><p><b>Innovación, tecnología y sostenibilidad</b> al servicio de la educación y el campo.</p><div><span><strong>3</strong> zonas inteligentes</span><span><strong>100%</strong> control autónomo</span><span><strong>24/7</strong> supervisión local</span></div></div>
      </section>

      <section className="section project-section" id="proyecto">
        <div className="container">
          <div className="section-heading split">
            <div><p className="eyebrow">El proyecto</p><h2>Un laboratorio agrícola<br /><em>completo y verificable.</em></h2></div>
            <div><p>La maqueta de <b>1 metro de ancho por 2 metros de largo</b> integra tres cultivos, energía solar, sensores resistentes, actuación hidráulica y una aplicación web. Su controlador continúa trabajando aunque no exista conexión a internet.</p><a className="text-link" href="/Informe_general_Sistema_de_Riego_Inteligente.docx" download>Descargar informe general <Arrow /></a></div>
          </div>
          <div className="project-grid">
            <article className="project-image-card"><img src="/01-maqueta-completa.jpg" alt="Vista completa del prototipo" loading="lazy" decoding="async" /><div><span>Dimensiones reales</span><strong>2,00 × 1,00 m</strong></div></article>
            <div className="project-points">
              <article><span>01</span><h3>Medir</h3><p>Humedad y temperatura por cultivo, nivel de tanque, caudal, presión, energía y ambiente.</p></article>
              <article><span>02</span><h3>Decidir</h3><p>El ESP32 compara umbrales, identifica prioridad y valida condiciones seguras.</p></article>
              <article><span>03</span><h3>Actuar</h3><p>Una bomba alimenta tres válvulas independientes y seis microaspersores regulables.</p></article>
              <article><span>04</span><h3>Documentar</h3><p>Cada lectura, orden, alarma y volumen queda disponible localmente y en la web.</p></article>
            </div>
          </div>
        </div>
      </section>

      <section className="section components-section" id="componentes">
        <div className="container">
          <div className="section-heading centered light"><p className="eyebrow">Inventario técnico</p><h2>Cada componente tiene<br /><em>una función precisa.</em></h2><p>Explore el sistema por categorías, consulte su especificación y comprenda su papel dentro de la maqueta.</p></div>
          <div className="component-toolbar">
            <div className="category-tabs" role="tablist" aria-label="Categorías de componentes">{categories.map((category) => <button key={category} type="button" className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
            <label className="component-search"><span>Buscar</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. sensor, bomba, batería…" /></label>
          </div>
          <div className="component-feature">
            <div><span>{activeCategory === "Todos" ? "Sistema completo" : activeCategory}</span><strong>{filteredComponents.length}</strong><small>componentes y accesorios</small></div>
            <img src={activeCategory === "Todos" ? "/02-arquitectura-principal.jpg" : categoryImages[activeCategory]} alt={`Vista de ${activeCategory === "Todos" ? "la arquitectura completa" : activeCategory}`} loading="lazy" decoding="async" />
          </div>
          <div className="components-grid">
            {filteredComponents.map((component, index) => (
              <button className="component-card" type="button" key={component.name} onClick={() => setSelectedComponent(component)}>
                <ComponentVisual component={component} />
                <span className="component-index">{String(index + 1).padStart(2, "0")}</span>
                <small>{component.category} · {component.quantity}</small>
                <h3>{component.name}</h3>
                <p>{component.description}</p>
                <div><span>{component.spec}</span><b>Ver función <Arrow /></b></div>
              </button>
            ))}
          </div>
          {filteredComponents.length === 0 && <p className="empty-state">No hay coincidencias. Pruebe otra palabra o categoría.</p>}
        </div>
      </section>

      <section className="section dashboard-section" id="monitoreo">
        <div className="container">
          <div className="section-heading split light">
            <div><p className="eyebrow">Monitoreo interactivo</p><h2>Observe cómo decide<br /><em>el sistema.</em></h2></div>
            <p>Modifique la humedad, simule suelo seco o ejecute un ciclo. En modo automático se atiende primero la zona con mayor déficit respecto a su umbral.</p>
          </div>
          <div className="dashboard-shell">
            <div className="dashboard-top">
              <div><i className={tankLevel < 15 ? "alarm" : ""} /><span><small>Estado</small><strong>{tankLevel < 15 ? "Protección por nivel bajo" : irrigating ? `Regando zona ${irrigating}` : priority ? `Prioridad zona ${priority.id}` : "Variables estables"}</strong></span></div>
              <div className="mode-switch" aria-label="Modo de operación"><button type="button" className={mode === "AUTO" ? "active" : ""} onClick={() => setMode("AUTO")}>AUTO</button><button type="button" className={mode === "MANUAL" ? "active" : ""} onClick={() => setMode("MANUAL")}>MANUAL</button></div>
            </div>
            <div className="zones-grid">
              {zones.map((zone) => {
                const deficit = zone.threshold - zone.humidity;
                return <article className={`zone-card ${irrigating === zone.id ? "watering" : ""}`} key={zone.id} style={{ "--zone": zone.color } as React.CSSProperties}>
                  <div className="zone-head"><span>Zona {zone.id}</span><i>{irrigating === zone.id ? "Riego activo" : deficit > 0 ? `Déficit ${deficit}%` : "Estable"}</i></div>
                  <h3>{zone.crop}</h3>
                  <div className="zone-reading"><strong>{zone.humidity}</strong><span>%<small>humedad</small></span></div>
                  <div className="moisture-bar"><i style={{ width: `${zone.humidity}%` }} /><b style={{ left: `${zone.threshold}%` }} /></div>
                  <div className="bar-legend"><span>Seco</span><span>Umbral {zone.threshold}%</span><span>Húmedo</span></div>
                  <label>Ajustar lectura<input type="range" min="15" max="85" value={zone.humidity} onChange={(event) => setZones((current) => current.map((item) => item.id === zone.id ? { ...item, humidity: Number(event.target.value) } : item))} /></label>
                  <div className="zone-meta"><span>Suelo <b>{zone.temperature} °C</b></span><span>Válvula <b>{irrigating === zone.id ? "Abierta" : "Cerrada"}</b></span></div>
                  {mode === "MANUAL" && <button className="manual-button" type="button" disabled={Boolean(irrigating)} onClick={() => runCycle(zone.id)}>Regar zona {zone.id}</button>}
                  {irrigating === zone.id && <div className="rain-animation"><i /><i /><i /><i /></div>}
                </article>;
              })}
            </div>
            <div className="dashboard-actions"><div><small>Registro operativo</small><p>{eventLog}</p></div><div><button type="button" onClick={dryScenario}>Simular suelo seco</button><button type="button" onClick={() => { setZones(initialZones); setTankLevel(78); setBattery(86); setEventLog("Simulación restablecida."); }}>Restablecer</button>{mode === "AUTO" && <button className="button primary" type="button" disabled={Boolean(irrigating)} onClick={() => runCycle()}>Ejecutar ciclo <Arrow /></button>}</div></div>
          </div>
          <p className="educational-note">Simulación educativa: los valores reales se determinan mediante calibración del suelo, pruebas de caudal y criterios agronómicos.</p>
        </div>
      </section>

      <section className="section architecture-section" id="arquitectura">
        <div className="container">
          <div className="section-heading split"><div><p className="eyebrow">Arquitectura principal</p><h2>Agua, energía y datos<br /><em>trabajando juntos.</em></h2></div><p>La arquitectura separa físicamente la ruta hidráulica, la potencia de 12 V, la electrónica de 5 V y las comunicaciones. El control local conserva la autonomía cuando la red no está disponible.</p></div>
          <button className="architecture-image" type="button" onClick={() => setGalleryIndex(1)} aria-label="Ampliar arquitectura principal"><img src="/02-arquitectura-principal.jpg" alt="Arquitectura principal del Sistema de Riego Inteligente" loading="lazy" decoding="async" /><span>Ampliar arquitectura <Arrow /></span></button>
          <div className="architecture-cards">
            <article><span>01</span><h3>Energía solar</h3><p>Panel → controlador → batería → distribución DC protegida.</p></article>
            <article><span>02</span><h3>Control local</h3><p>ESP32, ADC, reloj, registro y lógica autónoma no bloqueante.</p></article>
            <article><span>03</span><h3>Instrumentación</h3><p>Suelo, ambiente, nivel, caudal, presión y consumo eléctrico.</p></article>
            <article><span>04</span><h3>Actuación</h3><p>Bomba única, colector y tres electroválvulas normalmente cerradas.</p></article>
            <article><span>05</span><h3>Supervisión web</h3><p>Telemetría, alarmas, historial y comandos autenticados.</p></article>
          </div>
        </div>
      </section>

      <section className="connections-section">
        <article><img src="/07-conexion-electrica.jpg" alt="Conexión eléctrica completa" loading="lazy" decoding="async" /><div><p className="eyebrow">Conexión eléctrica</p><h2>Potencia protegida.<br />Señales ordenadas.</h2><p>Fusibles, borneras, canaletas y gabinete seco mantienen una instalación inspeccionable.</p><button type="button" onClick={() => setGalleryIndex(6)}>Ver detalle <Arrow /></button></div></article>
        <article><img src="/08-conexion-hidraulica.jpg" alt="Conexión hidráulica completa" loading="lazy" decoding="async" /><div><p className="eyebrow">Conexión hidráulica</p><h2>Tres zonas.<br />Una red controlada.</h2><p>Filtro, bomba, instrumentos y válvulas convierten cada orden en un volumen verificable.</p><button type="button" onClick={() => setGalleryIndex(7)}>Ver detalle <Arrow /></button></div></article>
      </section>

      <section className="section installation-section" id="instalacion">
        <div className="container">
          <div className="section-heading split"><div><p className="eyebrow">Puesta en marcha</p><h2>De los materiales a<br /><em>la operación autónoma.</em></h2></div><p>La instalación se realiza por etapas. Cada una termina con una comprobación antes de energizar o incorporar el siguiente subsistema.</p></div>
          <div className="installation-grid">
            <img src="/09-estructura-seguridad.jpg" alt="Materiales de estructura, montaje y seguridad" loading="lazy" decoding="async" />
            <div>{installation.map(([number, title, description]) => <details key={number}><summary><span>{number}</span><strong>{title}</strong><i>+</i></summary><p>{description}</p></details>)}</div>
          </div>
        </div>
      </section>

      <section className="section remote-section">
        <div className="container remote-grid"><div><p className="eyebrow">Control remoto</p><h2>La finca disponible<br /><em>en cualquier pantalla.</em></h2><p>La aplicación web responsiva presenta estados, tendencias, alarmas y comandos. El equipo de campo no se expone directamente a internet: intercambia mensajes seguros con el servicio central y conserva su lógica local.</p><ul><li>Panel adaptable a computador, tableta y teléfono.</li><li>Roles de propietario, administrador, operador y observador.</li><li>Historial de órdenes, confirmaciones y eventos de seguridad.</li><li>Operación local aunque la comunicación esté temporalmente caída.</li></ul><a className="button primary" href="#monitoreo">Probar dashboard <Arrow /></a></div><img src="/10-control-remoto-web.jpg" alt="Aplicación web de control remoto en laptop y teléfono" loading="lazy" decoding="async" /></div>
      </section>

      <section className="section scale-section" id="escala">
        <div className="container scale-grid">
          <div><p className="eyebrow">Visión agrícola real</p><h2>Del prototipo a una<br /><em>finca de 200 hectáreas.</em></h2><p>La lógica se replica por sectores hidráulicos: nodos solares de campo, sensores representativos, electroválvulas industriales, comunicación LoRaWAN y una estación central de bombeo.</p><label className="area-control"><span>Área conceptual <strong>{area} ha</strong></span><input type="range" min="2" max="200" step="2" value={area} onChange={(event) => setArea(Number(event.target.value))} /><small><i>2 ha</i><i>100 ha</i><i>200 ha</i></small></label></div>
          <div className="scale-console"><div className="field-pattern">{Array.from({ length: 40 }).map((_, index) => <i className={index < Math.ceil(area / 5) ? "active" : ""} key={index} />)}</div><div className="scale-stats"><article><strong>{projectedSectors}</strong><span>sectores de 2,5 ha</span></article><article><strong>{projectedNodes}</strong><span>nodos de campo</span></article><article><strong>{projectedWater.toLocaleString("es-EC")}</strong><span>m³/día estimados*</span></article></div><small>*Ejemplo conceptual con 5 mm/día y 90% de eficiencia. El diseño definitivo requiere estudio agronómico, hidráulico, topográfico y energético.</small></div>
        </div>
      </section>

      <section className="section gallery-section" id="galeria">
        <div className="container">
          <div className="section-heading split light"><div><p className="eyebrow">Galería técnica</p><h2>El proyecto desde<br /><em>cada perspectiva.</em></h2></div><p>Diez visualizaciones coherentes con el inventario, la arquitectura y la instalación propuesta.</p></div>
          <div className="gallery-grid">{gallery.map(([src, label, title], index) => <button type="button" key={src} className={`gallery-card gallery-${index + 1}`} onClick={() => setGalleryIndex(index)}><img src={src} alt={title} loading="lazy" decoding="async" /><span><small>{String(index + 1).padStart(2, "0")} · {label}</small><strong>{title}</strong><i>+</i></span></button>)}</div>
        </div>
      </section>

      <section className="institution-section"><div className="container institution-grid"><img src="/logo-institucion.jpeg" alt="Unidad Educativa Fiscal Samborondón" loading="lazy" decoding="async" /><div><p className="eyebrow">Proyecto institucional</p><h2>Unidad Educativa Fiscal Samborondón</h2><p>Formamos estudiantes capaces de convertir ciencia, tecnología y conciencia ambiental en soluciones reales para su comunidad.</p></div><a className="button secondary" href="/Informe_general_Sistema_de_Riego_Inteligente.docx" download>Descargar informe <Arrow /></a></div></section>

      <footer><div className="container"><div><strong>Sistema de Riego Inteligente</strong><span>Unidad Educativa Fiscal Samborondón</span></div><p>Proyecto educativo de agricultura de precisión · Samborondón, Ecuador · 2026</p><a href="#inicio">Volver arriba ↑</a></div></footer>

      {selectedComponent && <div className="modal" role="dialog" aria-modal="true" aria-labelledby="component-title"><button className="modal-backdrop" type="button" aria-label="Cerrar" onClick={() => setSelectedComponent(null)} /><div className="component-modal"><button className="modal-close" type="button" aria-label="Cerrar ficha" onClick={() => setSelectedComponent(null)}>×</button><ComponentVisual component={selectedComponent} large /><div><p className="eyebrow">{selectedComponent.category} · {selectedComponent.quantity}</p><h2 id="component-title">{selectedComponent.name}</h2><span className="spec-pill">{selectedComponent.spec}</span><h3>Descripción</h3><p>{selectedComponent.description}</p><h3>Función en el proyecto</h3><p>{selectedComponent.function}</p></div></div></div>}

      {galleryIndex !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galería ampliada"><button className="modal-backdrop" type="button" aria-label="Cerrar galería" onClick={() => setGalleryIndex(null)} /><button className="modal-close" type="button" onClick={() => setGalleryIndex(null)} aria-label="Cerrar">×</button><button className="lightbox-nav previous" type="button" aria-label="Imagen anterior" onClick={() => setGalleryIndex((galleryIndex - 1 + gallery.length) % gallery.length)}>‹</button><figure><img src={gallery[galleryIndex][0]} alt={gallery[galleryIndex][2]} decoding="async" /><figcaption><span>{gallery[galleryIndex][1]}</span><strong>{gallery[galleryIndex][2]}</strong><small>{galleryIndex + 1} / {gallery.length}</small></figcaption></figure><button className="lightbox-nav next" type="button" aria-label="Imagen siguiente" onClick={() => setGalleryIndex((galleryIndex + 1) % gallery.length)}>›</button></div>}
    </main>
  );
}
