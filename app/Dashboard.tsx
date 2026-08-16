"use client";

import { useEffect, useMemo, useState } from "react";
import TechnicalManual from "./TechnicalManual";
import { assetPath } from "./asset-path";

type Zone = {
  id: "A" | "B" | "C";
  crop: string;
  moisture: number;
  soilTemp: number;
  min: number;
  max: number;
  dailyLiters: number;
  dailyLimit: number;
  state: "Riego activo" | "Humedad óptima" | "En observación";
  tone: "active" | "ok" | "watch";
  history: number[];
};

type RemoteState = {
  live?: boolean;
  telemetry?: {
    tankLevel: number;
    batteryVoltage: number;
    batteryPct: number;
    solarWatts: number;
    pressureBar: number;
    flowLpm: number;
    ambientTemp: number;
    ambientHumidity: number;
  };
  zones?: Array<{ zoneId: string; moisturePct: number; soilTemp: number; dailyLiters: number }>;
};

type VisualItem = {
  src: string;
  title: string;
  caption: string;
  status?: string;
  tone?: "valid" | "note" | "scale";
  subimageSlug?: string;
};

const navItems = [
  { id: "inicio", label: "Inicio" },
  { id: "proyecto", label: "El proyecto" },
  { id: "componentes", label: "Componentes" },
  { id: "funcionamiento", label: "Funcionamiento" },
  { id: "dashboard", label: "Dashboard" },
  { id: "documentacion", label: "Documentación" },
  { id: "contacto", label: "Contacto" },
];

const initialZones: Zone[] = [
  { id: "A", crop: "Tomate", moisture: 38, soilTemp: 24.6, min: 45, max: 68, dailyLiters: 1.4, dailyLimit: 3, state: "Riego activo", tone: "active", history: [55, 53, 50, 48, 45, 43, 41, 39, 38] },
  { id: "B", crop: "Lechuga", moisture: 57, soilTemp: 22.9, min: 50, max: 72, dailyLiters: 0.8, dailyLimit: 2.4, state: "Humedad óptima", tone: "ok", history: [62, 60, 61, 59, 58, 57, 56, 58, 57] },
  { id: "C", crop: "Pimiento", moisture: 46, soilTemp: 25.1, min: 44, max: 66, dailyLiters: 1.1, dailyLimit: 2.8, state: "En observación", tone: "watch", history: [54, 52, 51, 49, 48, 47, 48, 47, 46] },
];

const kitCards = [
  { number: "01", title: "Kit estructural", image: assetPath("galeria-estructura.jpeg"), summary: "Cama agrícola de 2 × 1 m, tres divisiones, drenaje y soportes seguros.", items: ["Bastidor y fijaciones", "Membrana y geotextil", "Sustrato y drenaje"], target: "manual-section-2-kit-estructural-y-cama-agricola" },
  { number: "02", title: "Kit hidráulico", image: assetPath("galeria-bomba.jpeg"), summary: "Almacena, filtra, impulsa, distribuye y mide el agua de cada riego.", items: ["Tanque de 40–60 L", "Bomba 12 V y filtro", "3 válvulas y 6 emisores"], target: "manual-section-3-kit-hidraulico-completo" },
  { number: "03", title: "Kit de sensores", image: assetPath("galeria-zona-c.jpeg"), summary: "Entrega al controlador las condiciones reales del suelo, ambiente y circuito.", items: ["Humedad y temperatura", "Nivel, caudal y presión", "BME280 e INA260"], target: "manual-section-4-kit-de-sensores" },
  { number: "04", title: "Control electrónico", image: assetPath("galeria-control-esp32.jpeg"), summary: "El ESP32 ejecuta las reglas autónomas y comunica el prototipo con la web.", items: ["ESP32 y ADS1115", "Reloj DS3231", "Memoria y señalización"], target: "manual-section-5-kit-de-control-electronico" },
  { number: "05", title: "Potencia y protección", image: assetPath("galeria-caja-ip65.jpeg"), summary: "Acciona bomba y válvulas sin exponer al controlador a cargas de 12 V.", items: ["MOSFET y contactor", "Fusibles y diodos", "Parada de emergencia"], target: "manual-section-6-kit-de-actuacion-y-potencia-electrica" },
  { number: "06", title: "Energía solar", image: assetPath("galeria-panel-solar.jpeg"), summary: "Mantiene la operación autónoma con producción, almacenamiento y protecciones DC.", items: ["Panel solar de 150 W", "Controlador de carga", "Batería AGM 12 V 55 Ah"], target: "manual-section-7-kit-de-energia-solar" },
  { number: "07", title: "Comunicaciones y software", image: assetPath("galeria-calibracion.jpeg"), summary: "Conecta la telemetría, las órdenes remotas, la base de datos y el panel web.", items: ["Wi‑Fi y HTTPS", "API y base de datos", "Aplicativo web"], target: "manual-section-10-kit-de-comunicaciones-y-software" },
  { number: "08", title: "Montaje y herramientas", image: assetPath("cabecera-riego-inteligente.webp"), summary: "Reúne cableado, terminales, sellado, herramientas y consumibles de instalación.", items: ["Caja IP65 y borneras", "Cableado identificado", "Herramientas de prueba"], target: "manual-section-11-herramientas-y-consumibles-de-montaje" },
];

const gallery: VisualItem[] = [
  { src: assetPath("galeria-estructura.jpeg"), title: "Construcción de la cama", caption: "Referencia visual del bastidor, divisores y drenaje previo al sustrato." },
  { src: assetPath("galeria-bomba.jpeg"), title: "Banco hidráulico", caption: "Bomba de diafragma, manómetro, tuberías y base antivibración." },
  { src: assetPath("galeria-control-esp32.jpeg"), title: "Control ESP32", caption: "Referencia de montaje ordenado dentro de una envolvente protegida." },
  { src: assetPath("galeria-caja-ip65.jpeg"), title: "Caja IP65", caption: "Protección de conexiones y circuitos frente a polvo y salpicaduras." },
  { src: assetPath("galeria-panel-solar.jpeg"), title: "Generación solar", caption: "Panel con estructura estable, cableado protegido y controlador de carga." },
  { src: assetPath("galeria-calibracion.jpeg"), title: "Calibración y pruebas", caption: "Medición de sensores, aforo y comprobación del comportamiento hidráulico." },
  { src: assetPath("galeria-zona-c.jpeg"), title: "Riego de la Zona C", caption: "Microaspersión controlada para el cultivo demostrativo de pimiento." },
];

const architectureInfographics: VisualItem[] = [
  { src: assetPath("infografias/flujo-energia.webp"), title: "Flujo de energía y alimentación", caption: "La secuencia panel → controlador → batería → protección → distribución es correcta. La batería de 7 Ah dibujada es ilustrativa; la especificación oficial del proyecto es AGM de 12 V y 55 Ah.", status: "Validada con corrección", tone: "note", subimageSlug: "flujo-energia" },
  { src: assetPath("infografias/flujo-informacion.webp"), title: "Flujo de información y control seguro", caption: "Representa correctamente la medición local, decisión autónoma, actuación, telemetría HTTPS y órdenes remotas con vencimiento y validación física.", status: "Coherente con el diseño", tone: "valid", subimageSlug: "flujo-informacion" },
  { src: assetPath("infografias/sistema-hidraulico-escalado.webp"), title: "Referencia de ampliación hidráulica", caption: "Muestra cómo escalar el concepto a un huerto mayor. No corresponde a la lista de compra del prototipo: ilustra 2.000 L, tubería de 25 mm y 12 L/min; la versión escolar utiliza 40–60 L, PE de 16 mm, 3–5 L/min y tomate, lechuga y pimiento.", status: "Referencia de escala", tone: "scale", subimageSlug: "sistema-hidraulico" },
];

const kitInfographics: VisualItem[] = [
  { src: assetPath("infografias/02-kit-estructural.webp"), title: "2. Kit estructural y cama agrícola", caption: "Bastidor, fijaciones, impermeabilización, drenaje, divisores, sustrato y soportes. Coincide con la cama demostrativa de 2 × 1 m.", status: "Validada", tone: "valid", subimageSlug: "02-estructural" },
  { src: assetPath("infografias/03-kit-hidraulico.webp"), title: "3. Kit hidráulico completo", caption: "Documenta los 22 grupos hidráulicos desde el tanque hasta los emisores. Las cantidades y rangos corresponden a la lista maestra del prototipo.", status: "Validada", tone: "valid", subimageSlug: "03-hidraulico" },
  { src: assetPath("infografias/04-kit-sensores.webp"), title: "4. Kit de sensores", caption: "Describe medición de suelo, ambiente, tanque, energía y acondicionamiento de señales. El pluviómetro mostrado es opcional y no forma parte de la versión básica.", status: "Validada con opcional", tone: "note", subimageSlug: "04-sensores" },
  { src: assetPath("infografias/05-kit-control-electronico.webp"), title: "5. Kit de control electrónico", caption: "Explica ESP32, RTC, memoria interna e interfaz local. La microSD y el expansor MCP23017 son opcionales y requieren revisar pines y firmware antes de incorporarlos.", status: "Validada con opcionales", tone: "note", subimageSlug: "05-control" },
  { src: assetPath("infografias/06-kit-potencia-electrica.webp"), title: "6. Actuación y potencia eléctrica", caption: "Representa MOSFET, supresión inductiva, parada física, conversión y fusibles de ramal. Los valores finales se confirman midiendo la corriente de arranque.", status: "Validada", tone: "valid", subimageSlug: "06-potencia" },
  { src: assetPath("infografias/07-kit-energia-solar.webp"), title: "7. Kit de energía solar", caption: "Integra panel de 150 W, controlador, AGM de 55 Ah, montaje, distribución y presupuesto energético. El módem 4G permanece opcional.", status: "Validada", tone: "valid", subimageSlug: "07-solar" },
  { src: assetPath("infografias/08-kit-cableado.webp"), title: "8. Cableado, conexiones y caja", caption: "Detalla caja IP65, riel, borneras, prensaestopas, calibres, terminales, canalización y etiquetado para una instalación mantenible.", status: "Validada", tone: "valid", subimageSlug: "08-cableado" },
  { src: assetPath("infografias/10-kit-comunicaciones.webp"), title: "10. Comunicaciones y software", caption: "Resume Wi‑Fi, TLS, firmware, API, base de datos y aplicativo. El dominio y token visibles son ejemplos gráficos: ningún secreto real debe mostrarse ni guardarse en el repositorio.", status: "Validada con aviso de seguridad", tone: "note", subimageSlug: "10-comunicaciones" },
];

const infographicSubimageDefinitions = [
  { slug: "02-estructural", title: "Kit estructural", labels: ["2.1 Bastidor de la cama", "2.2 Tornillos y fijaciones", "2.3 Patas niveladoras", "2.4 Membrana impermeable", "2.5 Geotextil", "2.6 Capa de drenaje", "2.7 Salida de drenaje", "2.8 Divisores de zona", "2.9 Sustrato", "2.10 Bandeja de contención", "2.11 Soporte técnico vertical", "2.12 Letreros de identificación"] },
  { slug: "03-hidraulico", title: "Kit hidráulico", labels: ["3.1 Tanque de agua con tapa", "3.2 Pasamuros del tanque", "3.3 Válvula manual de bola", "3.4 Filtro de 120 mesh", "3.5 Manguera de succión", "3.6 Bomba de diafragma", "3.7 Soportes antivibración", "3.8 Abrazaderas", "3.9 Válvula antirretorno", "3.10 Regulador de presión", "3.11 Manómetro mecánico", "3.12 Sensor de presión", "3.13 Caudalímetro Hall", "3.14 Colector de tres salidas", "3.15 Electroválvulas", "3.16 Tubería principal", "3.17 Microtubo", "3.18 Microaspersores", "3.19 Estacas para emisores", "3.20 Conectores hidráulicos", "3.21 Cinta PTFE y sellador", "3.22 Sujetadores de tubería"] },
  { slug: "04-sensores", title: "Kit de sensores", labels: ["4.1 Sensores de humedad", "4.2 Conversor ADS1115", "4.3 Alimentación conmutada", "4.4 Sensores DS18B20", "4.5 Sensor BME280", "4.6 Garita ambiental", "4.7 Sensor ultrasónico", "4.8 Flotador inferior", "4.9 Flotador superior", "4.10 Sensor INA260", "4.11 Medición de batería", "4.12 Pluviómetro"] },
  { slug: "05-control", title: "Kit de control", labels: ["5.1 ESP32 DevKit", "5.2 Reloj DS3231", "5.3 Batería del RTC", "5.4 Memoria NVS", "5.5 Módulo microSD", "5.6 Pantalla OLED", "5.7 Expansor MCP23017", "5.8 Botón automático manual", "5.9 Botones de prueba", "5.10 Indicadores LED", "5.11 Zumbador", "5.12 Watchdog"] },
  { slug: "06-potencia", title: "Kit de potencia", labels: ["6.1 Módulos MOSFET", "6.2 Resistencias de compuerta", "6.3 Resistencias pull-down", "6.4 Diodos de rueda libre", "6.5 Relé o contactor DC", "6.6 Parada de emergencia", "6.7 Diodo TVS", "6.8 Condensadores", "6.9 Convertidor DC-DC", "6.10 Fusible de control", "6.11 Fusible de válvulas", "6.12 Fusible de bomba"] },
  { slug: "07-solar", title: "Kit solar", labels: ["7.1 Panel solar", "7.2 Estructura del panel", "7.3 Cable solar", "7.4 Conectores MC4", "7.5 Controlador de carga", "7.6 Batería AGM", "7.7 Bandeja y correa", "7.8 Fusible principal", "7.9 Seccionador principal", "7.10 Protección de polaridad", "7.11 Barras de distribución", "7.12 Router o módem 4G", "7.13 Presupuesto energético"] },
  { slug: "08-cableado", title: "Kit de cableado", labels: ["8.1 Caja IP65", "8.2 Placa de montaje", "8.3 Borneras", "8.4 Prensaestopas", "8.5 Cable de potencia", "8.6 Código de colores", "8.7 Terminales de anillo", "8.8 Punteras o ferrules", "8.9 Conectores impermeables", "8.10 Tubo termorretráctil", "8.11 Canaleta y manguera", "8.12 Cable apantallado", "8.13 Bridas resistentes UV", "8.14 Etiquetas"] },
  { slug: "flujo-energia", title: "Flujo de energía", labels: ["1 Panel solar", "2 Controlador de carga", "3 Batería de 12 V", "4 Seccionador y fusible", "5 Barra de distribución", "5A Ramal de bomba", "5B Ramal de electroválvulas", "5C Control ESP32 y sensores"] },
  { slug: "flujo-informacion", title: "Flujo de información", labels: ["1 Sensores del sistema", "2 Controlador ESP32", "3 Decisión autónoma", "4 Bomba y válvulas", "5 Comunicación HTTPS", "6 API de telemetría", "7 Base de datos", "8 Aplicativo web", "9 Solicitud desde la web", "10 Orden con vencimiento", "11 API de control", "12 Recepción en ESP32", "13 Validación física", "14 Ejecución o rechazo"] },
  { slug: "sistema-hidraulico", title: "Sistema hidráulico", labels: ["Depósito y salida de agua", "Bomba y medición de caudal", "Controlador y electroválvulas", "Zona A de hortalizas", "Zona B con microaspersión", "Zona C con riego localizado", "Tubería principal y ramales"] },
  { slug: "09-conexiones-principal", title: "Plano eléctrico principal", labels: ["Sensores y señales de entrada", "Controlador ESP32 y cableado", "Actuadores y protecciones", "Tabla de pines y funciones", "Dispositivos del bus I²C", "Direcciones I²C esperadas", "Buenas prácticas de conexión", "Recomendaciones de montaje"] },
  { slug: "09-conexiones-didactico", title: "Plano eléctrico didáctico", labels: ["Sensores digitales y analógicos", "ESP32 y conexiones centrales", "Bomba, válvulas y emergencia", "Tabla didáctica de señales", "Módulos del bus I²C", "Tabla de direcciones I²C"] },
  { slug: "10-comunicaciones", title: "Comunicaciones", labels: ["10.1 Red Wi-Fi", "10.2 Certificado TLS", "10.3 Token del dispositivo", "10.4 Firmware del ESP32", "10.5 API web", "10.6 Base de datos", "10.7 Aplicativo web"] },
];

const infographicSubimageGroups = infographicSubimageDefinitions.map((group) => ({
  ...group,
  items: group.labels.map((label, index): VisualItem => ({
    src: assetPath(`infografias/subimagenes/${group.slug}/${String(index + 1).padStart(2, "0")}.webp`),
    title: label,
    caption: `Subimagen extraída de la infografía ${group.title}. Conserva la fotografía y la información técnica de la lámina original.`,
  })),
}));

const connectionInfographics: VisualItem[] = [
  { src: assetPath("infografias/09-plano-conexiones-horizontal.webp"), title: "9. Plano de conexiones — versión principal", caption: "Es la referencia visual preferida. Antes del montaje debe contrastarse con la tabla oficial: flotador superior GPIO 23, inferior GPIO 33, ultrasónico TRIG GPIO 32 y ECHO GPIO 35, emergencia GPIO 13 e I²C en GPIO 21/22.", status: "Plano principal validado", tone: "valid", subimageSlug: "09-conexiones-principal" },
  { src: assetPath("infografias/09-plano-conexiones-vertical.webp"), title: "9. Plano de conexiones — versión didáctica vertical", caption: "Útil para explicar buses y actuadores, pero contiene llamadas gráficas contradictorias entre flotador y ultrasonido. No debe emplearse para cablear; prevalecen la tabla oficial, el firmware y el plano principal validado.", status: "Solo referencia didáctica", tone: "note", subimageSlug: "09-conexiones-didactico" },
];

const componentCatalog = [
  { id: "panel", number: "01", title: "Panel solar de 150 W", kit: "Kit de energía solar", summary: "Convierte la radiación solar en energía eléctrica para cargar la batería.", connection: "Se conecta al controlador de carga mediante cable solar y conectores protegidos.", x: 17, y: 18, focus: "17% 17%", zoom: "230%" },
  { id: "battery", number: "02", title: "Batería AGM 12 V 55 Ah", kit: "Kit de energía solar", summary: "Almacena energía y sostiene el sistema durante la noche o con baja radiación.", connection: "Alimenta la distribución de 12 V a través del fusible y seccionador principal.", x: 43, y: 17, focus: "43% 16%", zoom: "240%" },
  { id: "tank", number: "03", title: "Tanque de 40–60 L", kit: "Kit hidráulico", summary: "Mantiene la reserva de agua protegida contra polvo, insectos y luz directa.", connection: "Su pasamuros alimenta el filtro, la válvula manual y la bomba central.", x: 63, y: 17, focus: "63% 16%", zoom: "240%" },
  { id: "enclosure", number: "04", title: "Caja eléctrica IP65", kit: "Kit de cableado y montaje", summary: "Protege controlador, borneras y potencia frente a polvo y salpicaduras.", connection: "Recibe cables por prensaestopas y mantiene separadas potencia y señales.", x: 85, y: 17, focus: "84% 16%", zoom: "230%" },
  { id: "controller", number: "05", title: "Controlador de carga solar", kit: "Kit de energía solar", summary: "Regula la carga de la batería y evita condiciones eléctricas inseguras.", connection: "Se instala entre panel, batería y cargas, respetando la secuencia del fabricante.", x: 10, y: 42, focus: "10% 42%", zoom: "300%" },
  { id: "pump", number: "06", title: "Bomba de diafragma de 12 V", kit: "Kit hidráulico", summary: "Genera el caudal y la presión necesarios para alimentar una zona por vez.", connection: "Se acciona mediante un MOSFET o relé DC, nunca directamente desde el ESP32.", x: 82, y: 45, focus: "82% 44%", zoom: "310%" },
  { id: "filter", number: "07", title: "Filtro hidráulico de 120 mesh", kit: "Kit hidráulico", summary: "Retiene partículas que podrían bloquear válvulas, sensores y emisores.", connection: "Se monta en la línea principal y debe quedar accesible para lavado periódico.", x: 94, y: 45, focus: "94% 44%", zoom: "340%" },
  { id: "esp32", number: "08", title: "Controlador ESP32", kit: "Kit de control electrónico", summary: "Lee sensores, aplica las reglas autónomas y comunica el sistema con la web.", connection: "Trabaja a 3,3 V y gobierna actuadores mediante etapas de potencia aisladas.", x: 8, y: 61, focus: "8% 60%", zoom: "350%" },
  { id: "valves", number: "09", title: "Tres electroválvulas de 12 V", kit: "Kit hidráulico", summary: "Abren de forma independiente las zonas A, B y C; permanecen cerradas sin energía.", connection: "Cada bobina se controla con MOSFET y diodo de rueda libre.", x: 54, y: 61, focus: "54% 60%", zoom: "280%" },
  { id: "sprinklers", number: "10", title: "Seis microaspersores regulables", kit: "Kit hidráulico", summary: "Distribuyen el volumen medido sobre tomate, lechuga y pimiento.", connection: "Se conectan de dos en dos a cada ramal mediante microtubo de 6 mm.", x: 82, y: 61, focus: "82% 60%", zoom: "300%" },
  { id: "moisture", number: "11", title: "Tres sensores capacitivos de humedad", kit: "Kit de sensores", summary: "Miden la humedad del sustrato sin exponer electrodos metálicos al suelo.", connection: "Sus señales analógicas llegan al ADS1115 y se calibran por zona.", x: 9, y: 82, focus: "9% 82%", zoom: "300%" },
  { id: "temperature", number: "12", title: "Tres sondas DS18B20", kit: "Kit de sensores", summary: "Miden la temperatura del suelo en cada cultivo mediante una dirección digital única.", connection: "Comparten el bus OneWire del ESP32 con resistencia de elevación.", x: 24, y: 82, focus: "24% 82%", zoom: "320%" },
  { id: "ultrasonic", number: "13", title: "Sensor ultrasónico de nivel", kit: "Kit de sensores", summary: "Calcula el nivel continuo del tanque sin tocar el agua.", connection: "TRIG se conecta al ESP32 y ECHO pasa por un divisor para proteger la entrada de 3,3 V.", x: 36, y: 82, focus: "36% 82%", zoom: "390%" },
  { id: "floats", number: "14", title: "Interruptores flotadores", kit: "Kit de sensores", summary: "Proporcionan cortes físicos de nivel bajo y confirmación de tanque lleno.", connection: "Se leen como entradas digitales y el flotador inferior bloquea inmediatamente la bomba.", x: 48, y: 82, focus: "48% 82%", zoom: "320%" },
  { id: "emergency", number: "15", title: "Parada de emergencia", kit: "Kit de potencia y protección", summary: "Corta la actuación ante una condición peligrosa o una intervención manual.", connection: "Su contacto normalmente cerrado actúa en el circuito físico y también informa al ESP32.", x: 62, y: 82, focus: "62% 82%", zoom: "380%" },
  { id: "wiring", number: "16", title: "Cableado, borneras y prensaestopas", kit: "Kit de cableado y montaje", summary: "Ordenan, identifican y protegen todas las conexiones eléctricas del prototipo.", connection: "Cada conductor se dimensiona, rotula y termina con punteras o terminales adecuados.", x: 81, y: 83, focus: "81% 83%", zoom: "300%" },
];

const componentCatalogImages: Record<string, string> = {
  panel: assetPath("materiales/panel-solar-150w.webp"),
  battery: assetPath("materiales/bateria-agm-12v-55ah.webp"),
  tank: assetPath("materiales/kit-hidraulico-auxiliar.webp"),
  enclosure: assetPath("materiales/caja-ip65.webp"),
  controller: assetPath("materiales/controlador-carga-solar.webp"),
  pump: assetPath("materiales/bomba-diafragma-12v.webp"),
  filter: assetPath("materiales/kit-hidraulico-auxiliar.webp"),
  esp32: assetPath("materiales/esp32-devkit.webp"),
  valves: assetPath("materiales/electrovalvulas-12v-nc.webp"),
  sprinklers: assetPath("materiales/microaspersores.webp"),
  moisture: assetPath("materiales/sensor-humedad-capacitivo.webp"),
  temperature: assetPath("materiales/ds18b20-impermeable.webp"),
  ultrasonic: assetPath("materiales/sensor-ultrasonico-impermeable.webp"),
  floats: assetPath("materiales/flotadores-nivel.webp"),
  emergency: assetPath("materiales/kit-seguridad-cableado.webp"),
  wiring: assetPath("materiales/kit-seguridad-cableado.webp"),
};

const projectMaterials = [
  { id: "esp32", kit: "Control electrónico", quantity: "1", name: "ESP32 DevKit", specification: "3,3 V, Wi‑Fi 2,4 GHz", image: assetPath("materiales/esp32-devkit.webp"), role: "Es el controlador principal. Lee los sensores, ejecuta las reglas autónomas, controla bomba y válvulas mediante etapas de potencia, registra eventos y sincroniza la telemetría con el aplicativo web.", connection: "Se alimenta con 5 V regulados; todas sus entradas y salidas trabajan a 3,3 V. Los sensores I²C comparten SDA/SCL y las cargas de 12 V se gobiernan exclusivamente mediante drivers protegidos." },
  { id: "ads1115", kit: "Control electrónico", quantity: "1", name: "ADS1115", specification: "Conversor analógico I²C de 16 bits", image: assetPath("materiales/ads1115.webp"), role: "Amplía la capacidad de medición analógica y mejora la resolución de las tres sondas de humedad del suelo y otras señales lentas.", connection: "Comparte el bus I²C con el ESP32. Sus entradas nunca deben superar la tensión de alimentación; cada canal se calibra con valores de suelo seco y húmedo." },
  { id: "ds3231", kit: "Control electrónico", quantity: "1", name: "DS3231", specification: "Reloj de tiempo real con batería", image: assetPath("materiales/ds3231.webp"), role: "Conserva fecha y hora aunque el sistema pierda energía o Internet. Permite aplicar ventanas horarias, límites diarios y una bitácora cronológica confiable.", connection: "Se conecta al bus I²C y utiliza una batería de respaldo propia. El firmware sincroniza su hora cuando la red está disponible sin depender de ella para regar." },
  { id: "soil-moisture", kit: "Kit de sensores", quantity: "3", name: "Sensores capacitivos de humedad", specification: "Salida analógica compatible, electrónica encapsulada", image: assetPath("materiales/sensor-humedad-capacitivo.webp"), role: "Miden la humedad relativa del sustrato en las zonas A, B y C sin exponer electrodos metálicos que se corroen rápidamente.", connection: "Cada sensor llega a un canal independiente del ADS1115. Se instala en la zona radicular, se encapsula la electrónica y se calibra individualmente en seco y a capacidad de campo." },
  { id: "ds18b20", kit: "Kit de sensores", quantity: "3", name: "DS18B20 impermeables", specification: "Sondas con dirección ROM identificable", image: assetPath("materiales/ds18b20-impermeable.webp"), role: "Miden la temperatura del suelo de cada cultivo para contextualizar la humedad, detectar condiciones extremas y mejorar las decisiones agronómicas.", connection: "Las tres sondas comparten un bus OneWire con resistencia de elevación. Su dirección ROM se asocia permanentemente a una zona para impedir lecturas cruzadas." },
  { id: "bme280", kit: "Kit de sensores", quantity: "1", name: "BME280", specification: "Temperatura y humedad ambiental", image: assetPath("materiales/bme280.webp"), role: "Registra las condiciones ambientales del huerto. Sus datos permiten interpretar la pérdida de humedad y documentar el contexto de cada riego.", connection: "Se conecta por I²C y se monta en una garita ventilada, a la sombra y protegida de lluvia, radiación directa y salpicaduras." },
  { id: "ina260", kit: "Kit de energía solar", quantity: "1", name: "INA260", specification: "Medición solar hasta 36 V/15 A; verificar Isc del panel", image: assetPath("materiales/ina260.webp"), role: "Mide tensión, corriente y potencia del subsistema solar para mostrar producción, consumo y condiciones anómalas en el tablero web.", connection: "Se intercala en el conductor medido y comunica por I²C. Antes de instalarlo se verifica que la corriente de cortocircuito del panel nunca exceda la capacidad real del módulo y sus terminales." },
  { id: "pressure", kit: "Kit hidráulico", quantity: "1", name: "Sensor de presión", specification: "0–2 bar preferible o rango calibrable", image: assetPath("materiales/sensor-presion.webp"), role: "Supervisa que la red opere dentro del rango de los microaspersores. Detecta falta de cebado, obstrucción, válvula cerrada y sobrepresión.", connection: "Se monta en una derivación del colector con sello apropiado. Su señal analógica se acondiciona al ADC y se contrasta con el manómetro durante la calibración." },
  { id: "flowmeter", kit: "Kit hidráulico", quantity: "1", name: "Caudalímetro Hall", specification: "Adecuado al rango real de 1–5 L/min", image: assetPath("materiales/caudalimetro.webp"), role: "Cuenta el agua realmente entregada. Permite regar por volumen, detectar tuberías obstruidas o rotas y comprobar que la bomba respondió.", connection: "Se instala después del filtro y antes del colector de zonas, respetando la flecha de flujo. Su salida de pulsos se adapta a 3,3 V y se calibra mediante aforo." },
  { id: "ultrasonic", kit: "Kit de sensores", quantity: "1", name: "Sensor ultrasónico impermeable", specification: "Nivel continuo; ECHO adaptado a 3,3 V", image: assetPath("materiales/sensor-ultrasonico-impermeable.webp"), role: "Mide de forma continua la distancia hasta el agua y la convierte en porcentaje y litros disponibles en el tanque.", connection: "Se instala verticalmente en la tapa. TRIG sale del ESP32 y ECHO pasa obligatoriamente por un divisor o adaptador de nivel para no aplicar 5 V al controlador." },
  { id: "floats", kit: "Kit de sensores", quantity: "2", name: "Flotadores de nivel", specification: "Inferior de seguridad y superior de lleno", image: assetPath("materiales/flotadores-nivel.webp"), role: "Aportan dos confirmaciones físicas independientes: el inferior bloquea la bomba si falta agua y el superior confirma que el tanque alcanzó el nivel de llenado.", connection: "Se leen como contactos digitales con lógica segura. El flotador inferior participa además en el enclavamiento físico que debe detener la bomba aunque el software falle." },
  { id: "pump", kit: "Kit hidráulico", quantity: "1", name: "Bomba de diafragma 12 V", specification: "12 V DC; presión y caudal compatibles con 1–5 L/min", image: assetPath("materiales/bomba-diafragma-12v.webp"), role: "Proporciona la impulsión necesaria para extraer agua del tanque y mantener el caudal y la presión de una zona de riego activa.", connection: "Se instala después de la reserva y el filtro primario, sobre soportes antivibración. La activa un MOSFET dimensionado; nunca se conecta directamente al ESP32." },
  { id: "valves", kit: "Kit hidráulico", quantity: "3", name: "Electroválvulas 12 V NC", specification: "12 V DC, normalmente cerradas; presión mínima verificada", image: assetPath("materiales/electrovalvulas-12v-nc.webp"), role: "Seleccionan de forma independiente las zonas A, B y C. Al perder energía regresan al estado cerrado para evitar un riego no controlado.", connection: "Cada bobina se conecta a un canal MOSFET con diodo de rueda libre. El firmware permite una sola válvula abierta y confirma presión y caudal después de activarla." },
  { id: "sprinklers", kit: "Kit hidráulico", quantity: "6", name: "Microaspersores regulables", specification: "Baja presión, dos emisores por cada zona", image: assetPath("materiales/microaspersores.webp"), role: "Distribuyen el agua uniformemente sobre tomate, lechuga y pimiento. La regulación individual permite equilibrar los seis puntos de aplicación.", connection: "Se conectan de dos en dos a los tres ramales mediante microtubo. Antes de operar se aforan y ajustan para que el volumen calculado coincida con el entregado." },
  { id: "solar-panel", kit: "Kit de energía solar", quantity: "1", name: "Panel solar de 150 W", specification: "150 W, sistema nominal de 12 V, conectores solares protegidos", image: assetPath("materiales/panel-solar-150w.webp"), role: "Convierte la radiación solar en energía eléctrica para recargar la batería y sostener la operación autónoma diaria.", connection: "Se orienta sin sombras y se conecta al controlador de carga con cable solar, conectores correctos, fusible y seccionamiento según el diseño eléctrico." },
  { id: "charge-controller", kit: "Kit de energía solar", quantity: "1", name: "Controlador de carga solar", specification: "Compatible con panel de 150 W y batería AGM de 12 V, con margen", image: assetPath("materiales/controlador-carga-solar.webp"), role: "Gestiona la transferencia de energía entre panel, batería y carga, evitando sobrecarga, descarga profunda y condiciones eléctricas inseguras.", connection: "Se cablea siguiendo la secuencia del fabricante, normalmente batería antes que panel. Sus calibres, fusibles y corriente nominal se seleccionan con margen suficiente." },
  { id: "battery", kit: "Kit de energía solar", quantity: "1", name: "Batería AGM 12 V 55 Ah", specification: "Sellada, ciclo profundo, 12 V, 55 Ah", image: assetPath("materiales/bateria-agm-12v-55ah.webp"), role: "Almacena energía solar para que sensores, control y riego sigan funcionando de noche o durante periodos de baja radiación.", connection: "Se instala en compartimiento ventilado y protegido, con fusible principal próximo al borne positivo, cable de sección adecuada y terminales firmes." },
  { id: "mosfets", kit: "Potencia y protección", quantity: "4", name: "MOSFET de potencia", specification: "Nivel lógico de 3,3 V, margen de corriente, disipación y cuatro canales", image: assetPath("materiales/modulo-mosfet-4-canales.webp"), role: "Conmutan electrónicamente la bomba y las tres electroválvulas de 12 V sin exponer las salidas del ESP32 a corrientes elevadas.", connection: "Cada canal recibe una señal lógica protegida y controla una carga. Debe compartir referencia de tierra, incluir resistencia de compuerta, pull-down, fusible y diodo para cargas inductivas." },
  { id: "protections", kit: "Potencia y protección", quantity: "1 juego", name: "Protecciones eléctricas", specification: "Fusibles, diodos, TVS, borneras y parada de emergencia", image: assetPath("materiales/protecciones-electricas.webp"), role: "Limitan cortocircuitos, picos y retornos inductivos, y permiten detener físicamente bomba y válvulas ante una emergencia o mantenimiento.", connection: "El fusible principal queda junto a la batería y cada rama posee protección propia. Los diodos van sobre las bobinas, el TVS en el bus y la emergencia corta la autorización de potencia." },
  { id: "converter", kit: "Potencia y protección", quantity: "1", name: "Convertidor 12 V → 5 V", specification: "Salida regulada de 5 V, mínimo 3 A y eficiencia adecuada", image: assetPath("materiales/convertidor-12v-5v.webp"), role: "Reduce la tensión de la batería a 5 V estables para el ESP32, sensores y periféricos sin desperdiciar energía como calor excesivo.", connection: "Se conecta después de la protección de electrónica. La salida se ajusta y verifica con multímetro antes de conectar el controlador; se respeta polaridad y ventilación." },
  { id: "enclosure", kit: "Cableado y montaje", quantity: "1", name: "Caja IP65", specification: "IP65 mínimo, placa de montaje, junta y prensaestopas", image: assetPath("materiales/caja-ip65.webp"), role: "Protege la electrónica frente a polvo, insectos, humedad y salpicaduras, y mantiene el cableado ordenado y accesible para mantenimiento.", connection: "Se fija a una altura segura, con entradas hacia abajo, bucles antigoteo y prensaestopas del diámetro correcto. Potencia y señales se mantienen separadas." },
  { id: "iot-platform", kit: "Comunicaciones y software", quantity: "1 sistema", name: "Wi‑Fi + API + base de datos + aplicativo web", specification: "Wi‑Fi 2,4 GHz, HTTPS, API autenticada, persistencia y web adaptable", image: assetPath("materiales/plataforma-iot-web.webp"), role: "Proporciona supervisión y control remoto: recibe telemetría, conserva históricos y bitácoras, muestra alarmas y permite solicitar acciones seguras desde computadora o teléfono.", connection: "El ESP32 publica datos y consulta comandos autenticados. La base de datos conserva lecturas y auditoría; la web nunca acciona directamente las cargas ni anula protecciones locales." },
  { id: "battery-divider", kit: "Potencia y protección", quantity: "1", name: "Divisor de batería", specification: "Resistencias de precisión + protección ADC", image: assetPath("materiales/divisor-bateria.webp"), role: "Reduce la tensión de la batería de 12 V a un nivel seguro para que el controlador calcule estado de carga, baja tensión y recuperación.", connection: "Usa resistencias de precisión, limitación de corriente, filtro y protección de entrada. Su relación se calibra con multímetro y la salida nunca puede superar 3,3 V." },
  { id: "oled", kit: "Control electrónico", quantity: "1", name: "Pantalla OLED", specification: "I²C, opcional para operación local", image: assetPath("materiales/pantalla-oled.webp"), role: "Muestra localmente estado, nivel, batería, zona activa y alarmas durante instalación, mantenimiento o pérdida de conectividad.", connection: "Comparte el bus I²C, se alimenta a la tensión indicada por el módulo y se configura con una dirección que no entre en conflicto. No es necesaria para la autonomía." },
  { id: "estructura-cama", kit: "Kit estructural", quantity: "1 juego", name: "Cama agrícola y estructura", specification: "Bastidor 2 × 1 m, 20–40 fijaciones y 4 patas niveladoras", image: assetPath("materiales/kit-estructural-auxiliar.webp"), role: "Soporta el sustrato húmedo, separa las tres zonas y proporciona puntos seguros para fijar tuberías, sensores y señalización.", connection: "Se arma nivelada con tornillería anticorrosiva, arandelas y tuercas autofrenantes. La estructura se verifica cargada antes de instalar agua, batería o electrónica." },
  { id: "impermeabilizacion-drenaje", kit: "Kit estructural", quantity: "1 juego", name: "Impermeabilización y drenaje", specification: "Geomembrana, geotextil, grava 3–5 cm, 1–3 desagües y bandeja", image: assetPath("materiales/kit-estructural-auxiliar.webp"), role: "Evita que la cama retenga agua, protege la estructura y conduce los excedentes lejos de la batería y la electrónica.", connection: "La membrana cubre fondo y laterales sin perforaciones; sobre ella se dispone drenaje y geotextil. Los pasamuros descargan a una bandeja o punto controlado." },
  { id: "zonas-sustrato-soportes", kit: "Kit estructural", quantity: "1 juego", name: "Divisores, sustrato y soportes", specification: "2 divisores, 0,40–0,60 m³ de sustrato, soporte técnico y 4 letreros", image: assetPath("materiales/kit-estructural-auxiliar.webp"), role: "Forma tres microzonas comparables para tomate, lechuga y pimiento y mantiene identificados los elementos del prototipo.", connection: "Los divisores llegan cerca del fondo sin perforar la membrana. El sustrato se prepara homogéneo y la caja, tanque, batería y panel usan soportes independientes." },
  { id: "tanque-admision", kit: "Kit hidráulico", quantity: "1 juego", name: "Tanque y línea de admisión", specification: "Tanque opaco 40–60 L, pasamuros ½”, válvula, filtro 120 mesh y succión reforzada", image: assetPath("materiales/kit-hidraulico-auxiliar.webp"), role: "Almacena agua limpia y la entrega a la bomba mediante una salida desmontable, filtrada y capaz de cerrarse para mantenimiento.", connection: "El orden es tanque, pasamuros, válvula manual, filtro y manguera reforzada. Todas las uniones se prueban sin fugas antes de energizar la bomba." },
  { id: "regulacion-hidraulica", kit: "Kit hidráulico", quantity: "1 juego", name: "Regulación y diagnóstico hidráulico", specification: "Antirretorno, regulador ≈1 bar, manómetro 0–4 bar y 4 soportes antivibración", image: assetPath("materiales/kit-hidraulico-auxiliar.webp"), role: "Estabiliza el circuito, conserva el cebado y permite contrastar físicamente la presión reportada por el sensor.", connection: "Se instala después de la bomba y antes del colector. El regulador se ajusta con el manómetro y se valida bajo el caudal real de una zona." },
  { id: "red-distribucion", kit: "Kit hidráulico", quantity: "1 juego", name: "Red de distribución y accesorios", specification: "Colector 3 vías, 4 m PE16, 8 m microtubo, 6 estacas, 6–10 abrazaderas y conectores", image: assetPath("materiales/kit-hidraulico-auxiliar.webp"), role: "Distribuye el agua desde la instrumentación hacia una única zona activa y mantiene firmes los seis emisores.", connection: "Incluye tees, codos, reductores, espigas, uniones, tapones de lavado, empaques, PTFE y 15–30 clips. Cada diámetro y rosca debe ser compatible." },
  { id: "acondicionamiento-senales", kit: "Control electrónico", quantity: "1 juego", name: "Acondicionamiento de señales", specification: "Pull-up 4,7 kΩ y 10 kΩ, divisores 5→3,3 V, resistencias de precisión y protección ADC", image: assetPath("materiales/kit-seguridad-cableado.webp"), role: "Adapta OneWire, caudal, presión, ultrasonido y tensión de batería a niveles eléctricos seguros para ESP32 y ADS1115.", connection: "Se monta próximo al controlador, con tierra común y cables de señal separados de bomba y válvulas. Ningún GPIO recibe directamente una señal de 5 V." },
  { id: "fusibles-emergencia", kit: "Potencia y protección", quantity: "1 juego", name: "Fusibles, seccionamiento y emergencia", specification: "Principal ≈15 A; bomba 7,5–10 A; válvulas 3–5 A; control ≈2 A; parada NC", image: assetPath("materiales/kit-seguridad-cableado.webp"), role: "Limita fallos por sobrecorriente y permite cortar físicamente la bomba sin depender del firmware.", connection: "El fusible principal queda a centímetros del positivo de batería; cada ramal posee portafusible propio. Los valores finales se fijan tras medir corrientes reales." },
  { id: "supresion-distribucion", kit: "Potencia y protección", quantity: "1 juego", name: "Supresión y distribución DC", specification: "4 diodos, TVS 12 V, 4 pull-down, 4 resistencias de compuerta, condensadores y barras cubiertas", image: assetPath("materiales/kit-seguridad-cableado.webp"), role: "Absorbe transitorios de cargas inductivas, mantiene los MOSFET apagados durante el arranque y estabiliza los buses de 12 V y 5 V.", connection: "Cada bomba o bobina lleva su diodo; el TVS protege la barra de 12 V y los condensadores se colocan cerca del controlador y las cargas." },
  { id: "cableado-conectores", kit: "Cableado y montaje", quantity: "1 juego", name: "Cableado, borneras y conectores", specification: "12–14 AWG potencia, 18 AWG válvulas, 20–22 AWG señales, 20–30 borneras y prensaestopas", image: assetPath("materiales/kit-seguridad-cableado.webp"), role: "Conecta el sistema con secciones adecuadas, entradas selladas y puntos desmontables que facilitan diagnóstico y reemplazo.", connection: "Incluye riel DIN, terminales de anillo, punteras, conectores impermeables, termorretráctil, canaleta, tubo corrugado, bridas UV y etiquetas en ambos extremos." },
  { id: "montaje-solar", kit: "Kit de energía solar", quantity: "1 juego", name: "Montaje y conexión fotovoltaica", specification: "Estructura, cable solar UV, MC4, seccionamiento DC, fijaciones y puesta a tierra si aplica", image: assetPath("materiales/kit-solar-montaje.webp"), role: "Sujeta el panel frente al viento y transporta su corriente con baja caída de tensión y conectores aptos para intemperie.", connection: "La estructura se orienta sin sombras. Cable, protección y conectores se dimensionan con Voc, Vmp, Isc e Imp reales del panel y límites del controlador." },
  { id: "seguridad-bateria", kit: "Kit de energía solar", quantity: "1 juego", name: "Seguridad y sujeción de batería", specification: "Bandeja, correa, cubreterminales, protección de polaridad y barras de distribución", image: assetPath("materiales/kit-solar-montaje.webp"), role: "Evita movimiento, cortocircuitos y contacto del acumulador con agua o fertilizantes durante la operación y el mantenimiento.", connection: "La batería queda elevada, ventilada y sujeta. Los bornes permanecen cubiertos y el positivo alimenta primero el fusible principal y luego el seccionador." },
];

const finalProjectVisual = {
  src: assetPath("proyecto-final-operativo-ultra-v2.webp"),
  title: "Sistema completo instalado y en operación",
  caption: "Vista fotográfica ultrarrealista del prototipo integrado: tres cultivos, seis emisores, energía solar, reserva de agua, hidráulica protegida, control ESP32, sensores y supervisión web.",
};

const events = [
  { time: "11:24", title: "Riego iniciado · Zona A", detail: "Déficit de humedad de 7 puntos" },
  { time: "11:23", title: "Validación hidráulica correcta", detail: "1,0 bar · caudal confirmado" },
  { time: "10:45", title: "Lecturas sincronizadas", detail: "Sensores dentro de rango" },
  { time: "08:10", title: "Riego completado · Zona C", detail: "0,42 L aplicados en 46 segundos" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function MiniBars({ values }: { values: number[] }) {
  const min = Math.min(...values) - 4;
  const max = Math.max(...values) + 4;
  return <div className="mini-bars" aria-label={`Histórico: ${values.join(", ")} por ciento`}>{values.map((value, index) => <span key={`${value}-${index}`} style={{ height: `${clamp(((value - min) / (max - min)) * 100, 12, 100)}%` }} />)}</div>;
}

function Donut({ value, label }: { value: number; label: string }) {
  return <div className="donut-wrap"><div className="donut" style={{ "--value": `${value * 3.6}deg` } as React.CSSProperties}><div><strong>{value}</strong><small>%</small></div></div><span>{label}</span></div>;
}

export default function IrrigationSite() {
  const [zones, setZones] = useState(initialZones);
  const [activeSection, setActiveSection] = useState("inicio");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedImage, setSelectedImage] = useState<VisualItem | null>(null);
  const [activeSubimageGroup, setActiveSubimageGroup] = useState(infographicSubimageGroups[0].slug);
  const [selectedSubimageGroup, setSelectedSubimageGroup] = useState<(typeof infographicSubimageGroups)[number] | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<(typeof componentCatalog)[number] | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<(typeof projectMaterials)[number] | null>(null);
  const [toast, setToast] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [systemPaused, setSystemPaused] = useState(false);
  const [lastSync, setLastSync] = useState("hace 8 s");
  const [telemetry, setTelemetry] = useState({ tankLevel: 78, batteryVoltage: 13.1, batteryPct: 84, solarWatts: 128, pressureBar: 1, flowLpm: 1.8, ambientTemp: 29.4, ambientHumidity: 71 });
  const visibleSubimageGroup = infographicSubimageGroups.find((group) => group.slug === activeSubimageGroup) ?? infographicSubimageGroups[0];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: "-25% 0px -62%", threshold: [0.05, 0.2, 0.5] });
    navItems.forEach(({ id }) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const response = await fetch(assetPath("api/state"), { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as RemoteState;
        if (cancelled || !data.live || !data.telemetry) return;
        setTelemetry(data.telemetry);
        setIsLive(true);
        setLastSync("ahora");
        if (data.zones?.length) setZones((current) => current.map((zone) => {
          const incoming = data.zones?.find((item) => item.zoneId === zone.id);
          return incoming ? { ...zone, moisture: incoming.moisturePct, soilTemp: incoming.soilTemp, dailyLiters: incoming.dailyLiters } : zone;
        }));
      } catch { setIsLive(false); }
    }
    void refresh();
    const timer = window.setInterval(refresh, 15000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const activeZone = zones.find((zone) => zone.tone === "active");
  const waterToday = useMemo(() => zones.reduce((sum, zone) => sum + zone.dailyLiters, 0), [zones]);

  function closeMenu() { setMobileMenu(false); }

  function openSubimageGroup(slug?: string) {
    if (!slug) return;
    const group = infographicSubimageGroups.find((item) => item.slug === slug);
    if (!group) return;
    setActiveSubimageGroup(group.slug);
    setSelectedSubimageGroup(group);
  }

  async function confirmWatering(zone: Zone) {
    if (systemPaused) { setToast("El sistema está pausado. Reactiva el modo autónomo antes de regar."); setSelectedZone(null); return; }
    if (telemetry.tankLevel < 15 || telemetry.batteryPct < 20) { setToast("Orden bloqueada por una protección local."); setSelectedZone(null); return; }
    if (isLive) {
      try {
        const response = await fetch(assetPath("api/control"), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ zoneId: zone.id, action: "water", volumeMl: 400 }) });
        const result = (await response.json()) as { error?: string };
        if (!response.ok) throw new Error(result.error ?? "No se pudo enviar la orden");
        setToast(`Orden segura enviada a la Zona ${zone.id}.`);
      } catch (error) { setToast(error instanceof Error ? error.message : "No se pudo enviar la orden"); }
    } else {
      setZones((current) => current.map((item) => item.id === zone.id ? { ...item, dailyLiters: Number((item.dailyLiters + 0.4).toFixed(2)), moisture: clamp(item.moisture + 5, 0, 100), state: "Riego activo", tone: "active" } : { ...item, tone: item.moisture >= item.min ? "ok" : "watch", state: item.moisture >= item.min ? "Humedad óptima" : "En observación" }));
      setToast(`Demostración: pulso de 0,40 L aplicado a la Zona ${zone.id}.`);
    }
    setSelectedZone(null);
  }

  function pauseSystem() {
    setSystemPaused((value) => !value);
    setToast(systemPaused ? "Modo autónomo reactivado." : "Sistema pausado: bomba y válvulas desactivadas.");
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" onClick={closeMenu} aria-label="Ir al inicio">
          <img src={assetPath("logo-uef-samborondon.jpeg")} alt="Logotipo de la Unidad Educativa Fiscal Samborondón" />
          <span><strong>Riego inteligente 1.0</strong><small>UEF Samborondón</small></span>
        </a>
        <button className="menu-toggle" onClick={() => setMobileMenu((value) => !value)} aria-expanded={mobileMenu} aria-label="Abrir menú"><i /><i /><i /></button>
        <nav className={mobileMenu ? "open" : ""} aria-label="Navegación principal">
          {navItems.map((item) => <a key={item.id} href={`#${item.id}`} className={activeSection === item.id ? "active" : ""} onClick={closeMenu}>{item.label}</a>)}
        </nav>
        <a className="monitor-button" href="#dashboard" onClick={closeMenu}><span>◉</span> Monitorear sistema</a>
      </header>

      <section className="hero" id="inicio" style={{ backgroundImage: `url(${assetPath("cabecera-riego-inteligente.webp")})` }}>
        <div className="hero-shade" />
        <div className="hero-kpis" aria-label="Características principales">
          <div><span>♧</span><p><strong>3 zonas</strong><small>Tomate, lechuga y pimiento</small></p></div>
          <div><span>◉</span><p><strong>6 emisores</strong><small>Microaspersores regulables</small></p></div>
          <div><span>☀</span><p><strong>Energía solar</strong><small>150 W · batería 55 Ah</small></p></div>
          <div><span>⌁</span><p><strong>IoT seguro</strong><small>Monitoreo en tiempo real</small></p></div>
        </div>
        <div className="hero-copy">
          <span className="hero-tag">Tecnología · sostenibilidad · innovación</span>
          <h1>Sistema de<br /><em>riego inteligente 1.0</em></h1>
          <h2>Unidad Educativa Fiscal Samborondón</h2>
          <p>Un prototipo educativo autónomo que mide el suelo, decide cuándo regar, protege el circuito hidráulico y permite supervisar cada zona desde una aplicación web.</p>
          <div className="hero-features">
            <span><b>♧</b>Agricultura sostenible</span><span><b>⌁</b>Monitoreo inteligente</span><span><b>◉</b>Riego automático</span><span><b>☀</b>Energía solar</span><span><b>✓</b>Seguridad física</span>
          </div>
          <div className="hero-actions">
            <a className="button primary" href="#proyecto"><span>▶</span> Conoce el proyecto</a>
            <a className="button secondary" href="#dashboard"><span>▥</span> Ver dashboard</a>
          </div>
        </div>
        <div className="hardware-strip">
          <div><small>Controlador</small><strong>ESP32</strong></div><div><small>Sensores</small><strong>9 principales</strong></div><div><small>Válvulas</small><strong>3 electroválvulas</strong></div><div><small>Bomba</small><strong>12 V DC</strong></div><div><small>Conectividad</small><strong>Wi‑Fi / HTTPS</strong></div>
        </div>
      </section>

      <section className="section project-section" id="proyecto">
        <div className="section-heading split-heading">
          <div><span className="eyebrow">El proyecto</span><h2>Una solución educativa que trabaja de forma autónoma.</h2></div>
          <p>El aplicativo web supervisa y solicita acciones. El ESP32 conserva la autoridad final: solo riega cuando tanque, batería, presión, caudal, humedad y límites diarios se encuentran dentro de condiciones seguras.</p>
        </div>
        <div className="project-layout">
          <article className="project-story">
            <span className="big-number">1.0</span>
            <h3>Objetivo general</h3>
            <p>Diseñar e implementar un sistema demostrativo de riego inteligente que optimice el uso del agua, funcione aun cuando no exista internet y registre de manera comprensible cada lectura, decisión y alarma.</p>
            <a href="#componentes">Explorar los 8 kits <span>→</span></a>
          </article>
          <div className="architecture-flow">
            <div><span>01</span><strong>Medir</strong><p>Humedad, temperatura, nivel, presión, caudal, batería y producción solar.</p></div>
            <div><span>02</span><strong>Decidir</strong><p>Comparar umbrales, horarios, límites diarios y condiciones de protección.</p></div>
            <div><span>03</span><strong>Actuar</strong><p>Abrir una única zona, activar la bomba y entregar un volumen medido.</p></div>
            <div><span>04</span><strong>Registrar</strong><p>Guardar telemetría, órdenes, resultados, fallos y mantenimiento.</p></div>
          </div>
        </div>
        <div className="zone-summary">
          <div><span>A</span><p><strong>Tomate</strong><small>Humedad objetivo 45–68 %</small></p></div>
          <div><span>B</span><p><strong>Lechuga</strong><small>Humedad objetivo 50–72 %</small></p></div>
          <div><span>C</span><p><strong>Pimiento</strong><small>Humedad objetivo 44–66 %</small></p></div>
          <div className="bed-size"><small>Cama demostrativa</small><strong>2,00 × 1,00 m</strong></div>
        </div>
      </section>

      <section className="section components-section" id="componentes">
        <div className="section-heading centered"><span className="eyebrow">Componentes del sistema</span><h2>Ocho kits que funcionan como un solo equipo.</h2><p>Cada tarjeta abre directamente la explicación completa: cantidades, especificaciones, conexión, función y respuesta ante fallos.</p></div>
        <div className="component-catalog">
          <div className="catalog-heading"><div><span className="eyebrow">Catálogo fotográfico interactivo</span><h3>Selecciona una pieza para verla y comprender su función.</h3></div><p>Los indicadores corresponden a componentes reales del diseño. Al seleccionar uno se muestra un acercamiento del elemento específico, su conexión y el kit al que pertenece.</p></div>
          <div className="component-board">
            <img src={assetPath("catalogo-componentes-v1.webp")} alt="Conjunto fotográfico de componentes del sistema de riego inteligente" />
            {componentCatalog.map((component) => <button
              className="component-hotspot"
              key={component.id}
              style={{ left: `${component.x}%`, top: `${component.y}%` }}
              onClick={() => setSelectedComponent(component)}
              aria-label={`Ver ${component.title}`}
            ><span>{component.number}</span><strong>{component.title}</strong></button>)}
          </div>
          <div className="component-index" aria-label="Índice de componentes fotografiados">
            {componentCatalog.map((component) => <button key={component.id} onClick={() => setSelectedComponent(component)}><img src={componentCatalogImages[component.id]} alt="" loading="lazy" /><span>{component.number}</span><strong>{component.title}</strong><small>{component.kit}</small></button>)}
          </div>
        </div>
        <div className="materials-catalog" aria-labelledby="materials-title">
          <div className="materials-heading">
            <div><span className="eyebrow">Lista de materiales del prototipo</span><h3 id="materials-title">Catálogo completo del proyecto</h3></div>
            <p>Incluye control, sensores, hidráulica, energía solar, potencia, protección y plataforma web. Las especificaciones son obligatorias; la marca puede variar. Verificar corriente, tensión, presión mínima y disponibilidad antes de comprar.</p>
          </div>
          <div className="materials-stats" aria-label="Resumen del catálogo completo de materiales">
            <div><strong>{projectMaterials.length}</strong><span>referencias de compra</span></div><div><strong>90+</strong><span>piezas y consumibles</span></div><div><strong>8</strong><span>kits integrados</span></div>
          </div>
          <div className="materials-grid">
            {projectMaterials.map((material, index) => <article className="material-card" key={material.id}>
              <button onClick={() => setSelectedMaterial(material)} aria-label={`Ver función de ${material.name}`}>
                <span className="material-photo"><img src={material.image} alt={`Fotografía técnica de ${material.name}`} loading="lazy" /><b>{String(index + 1).padStart(2, "0")}</b></span>
                <span className="material-copy"><small>{material.kit} · Cantidad: {material.quantity}</small><strong>{material.name}</strong><em>{material.specification}</em><i>Ver función y conexión →</i></span>
              </button>
            </article>)}
          </div>
          <div className="materials-table-wrap">
            <table>
              <caption>Especificaciones mínimas de compra para todos los subsistemas</caption>
              <thead><tr><th>Cantidad</th><th>Elemento</th><th>Kit</th><th>Especificación mínima</th></tr></thead>
              <tbody>{projectMaterials.map((material) => <tr key={`row-${material.id}`}><td>{material.quantity}</td><th scope="row">{material.name}</th><td>{material.kit}</td><td>{material.specification}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <div className="kit-grid">
          {kitCards.map((kit) => <article className="kit-card" key={kit.number}>
            <div className="kit-image"><img src={kit.image} alt={`Visualización del ${kit.title}`} /><span>{kit.number}</span></div>
            <div className="kit-body"><h3>{kit.title}</h3><p>{kit.summary}</p><ul>{kit.items.map((item) => <li key={item}>{item}</li>)}</ul><a href={`#${kit.target}`}>Ver kit completo <span>→</span></a></div>
          </article>)}
        </div>
        <div className="infographic-library kit-infographics" aria-labelledby="kit-infographics-title">
          <div className="infographic-heading"><div><span className="eyebrow">Infografías técnicas por kit</span><h3 id="kit-infographics-title">Cada conjunto explicado visualmente.</h3></div><p>Las ocho láminas se ubicaron junto al catálogo de componentes. Selecciona cualquiera para verla completa; las notas indican elementos opcionales o precauciones que prevalecen sobre el contenido ilustrativo.</p></div>
          <div className="infographic-grid portrait-grid">
            {kitInfographics.map((item) => {
              const group = infographicSubimageGroups.find((candidate) => candidate.slug === item.subimageSlug);
              return <article key={item.src} className={`infographic-card-shell ${item.tone ?? "valid"}`}>
                <button className="infographic-card" onClick={() => setSelectedImage(item)} aria-label={`Ampliar ${item.title}`}>
                  <img src={item.src} alt={item.title} loading="lazy" /><span><b>{item.status}</b><strong>{item.title}</strong><small>{item.caption}</small><i>Ampliar infografía ↗</i></span>
                </button>
                {group && <button className="subimage-open-button" onClick={() => openSubimageGroup(group.slug)}><span>▦</span> Ver sus {group.items.length} subimágenes</button>}
              </article>;
            })}
          </div>
          <div className="subimage-explorer" aria-labelledby="subimage-title">
            <div className="subimage-heading"><div><span className="eyebrow">147 recortes independientes</span><h3 id="subimage-title">Cada elemento de todas las infografías, por separado.</h3></div><p>Selecciona una lámina y abre cualquier subimagen para verla con mayor detalle. También puedes entrar directamente desde el botón amarillo de cada tarjeta.</p></div>
            <div className="subimage-tabs" role="tablist" aria-label="Kits con subimágenes">
              {infographicSubimageGroups.map((group) => <button key={group.slug} role="tab" aria-selected={group.slug === visibleSubimageGroup.slug} className={group.slug === visibleSubimageGroup.slug ? "active" : ""} onClick={() => setActiveSubimageGroup(group.slug)}>{group.title}<span>{group.items.length}</span></button>)}
            </div>
            <div className="subimage-grid" role="tabpanel" aria-label={`Subimágenes de ${visibleSubimageGroup.title}`}>
              {visibleSubimageGroup.items.map((item) => <button key={item.src} onClick={() => setSelectedImage(item)} aria-label={`Ampliar ${item.title}`}><img src={item.src} alt={item.title} loading="lazy" /><span><strong>{item.title}</strong><small>Ampliar subimagen ↗</small></span></button>)}
            </div>
          </div>
        </div>
      </section>

      <section className="final-project-section" aria-labelledby="final-project-title">
        <div className="section final-project-inner">
          <div className="final-project-visual">
            <button onClick={() => setSelectedImage(finalProjectVisual)} aria-label="Ampliar imagen del sistema completo instalado">
              <img src={finalProjectVisual.src} alt="Sistema de riego inteligente terminado, instalado y funcionando en tres zonas de cultivo" />
              <span>Ampliar imagen <b>↗</b></span>
            </button>
          </div>
          <div className="final-project-description">
            <span className="eyebrow">Integración final del proyecto</span>
            <h2 id="final-project-title">Proyecto terminado y completamente integrado.</h2>
            <p>El Sistema de riego inteligente 1.0 de la Unidad Educativa Fiscal Samborondón es un prototipo autónomo, solar y conectado para una cama agrícola de 2 × 1 m dividida en tomate, lechuga y pimiento. Combina generación y almacenamiento de energía, reserva de agua, filtrado, bombeo, tres ramales independientes, seis microaspersores, medición agronómica e hidráulica y un controlador ESP32 con supervisión web.</p>
            <p>Su operación no depende de Internet: el ESP32 conserva horarios, umbrales y límites, evalúa localmente todas las protecciones y registra cada resultado. La aplicación permite observar el estado, consultar históricos y solicitar un riego, pero ninguna orden remota puede anular un nivel bajo, una batería insuficiente, la parada de emergencia, una anomalía de presión o caudal ni el volumen máximo diario.</p>
            <div className="final-project-flow">
              <div><span>01</span><p><strong>Alimentar</strong><small>El panel carga la batería y las protecciones distribuyen 12 V y 5 V.</small></p></div>
              <div><span>02</span><p><strong>Medir</strong><small>Suelo, ambiente, nivel, caudal, presión, batería y potencia solar.</small></p></div>
              <div><span>03</span><p><strong>Validar</strong><small>Hora, déficit, tanque, energía, emergencia y límite diario.</small></p></div>
              <div><span>04</span><p><strong>Regar</strong><small>Una válvula por vez, bomba activa y volumen confirmado por pulsos.</small></p></div>
              <div><span>05</span><p><strong>Comprobar</strong><small>Detiene, registra el resultado y actualiza el aplicativo web.</small></p></div>
            </div>
            <div className="autonomy-rule"><span>✓</span><p><strong>Autoridad local segura</strong><small>La web supervisa y solicita; el ESP32 decide si la ejecución es segura.</small></p></div>
          </div>
        </div>
      </section>

      <section className="function-section" id="funcionamiento">
        <div className="section function-inner">
          <div className="section-heading light-heading"><span className="eyebrow">Funcionamiento autónomo</span><h2>El riego se ejecuta como una secuencia segura y verificable.</h2></div>
          <div className="operation-flow">
            <div><span>1</span><h3>Detecta necesidad</h3><p>La humedad cae por debajo del umbral y se confirma la validez del sensor.</p></div>
            <div><span>2</span><h3>Valida protecciones</h3><p>Comprueba tanque, batería, emergencia, horario y límite de agua diario.</p></div>
            <div><span>3</span><h3>Riega por volumen</h3><p>Abre la válvula, enciende la bomba y cuenta pulsos del caudalímetro.</p></div>
            <div><span>4</span><h3>Confirma y registra</h3><p>Detiene la bomba, cierra la válvula y publica el resultado en la web.</p></div>
          </div>
          <div className="infographic-library architecture-infographics" aria-labelledby="architecture-infographics-title">
            <div className="infographic-heading light-infographic-heading"><div><span className="eyebrow">Arquitectura visual</span><h3 id="architecture-infographics-title">Energía, datos y circulación del agua.</h3></div><p>Estas láminas explican las relaciones entre subsistemas. Las correcciones técnicas visibles debajo de cada imagen forman parte de su interpretación.</p></div>
            <div className="infographic-grid landscape-grid">
              {architectureInfographics.map((item) => {
                const group = infographicSubimageGroups.find((candidate) => candidate.slug === item.subimageSlug);
                return <article key={item.src} className={`infographic-card-shell ${item.tone ?? "valid"}`}>
                  <button className="infographic-card" onClick={() => setSelectedImage(item)} aria-label={`Ampliar ${item.title}`}>
                    <img src={item.src} alt={item.title} loading="lazy" /><span><b>{item.status}</b><strong>{item.title}</strong><small>{item.caption}</small><i>Ampliar infografía ↗</i></span>
                  </button>
                  {group && <button className="subimage-open-button" onClick={() => openSubimageGroup(group.slug)}><span>▦</span> Ver sus {group.items.length} subimágenes</button>}
                </article>;
              })}
            </div>
          </div>
          <div className="safety-banner"><span>!</span><div><strong>La protección física siempre tiene prioridad.</strong><p>Una orden remota nunca puede anular emergencia, tanque vacío, batería baja, sobrepresión, falta de caudal ni tiempo máximo de bomba.</p></div></div>
          <div className="phase-layout">
            <img src={assetPath("galeria-calibracion.jpeg")} alt="Proceso de calibración y comprobación de sensores" />
            <div><span className="eyebrow">Fases de construcción</span>{["Estructura y drenaje", "Circuito hidráulico", "Energía solar", "Sensores y electrónica", "Firmware y aplicativo", "Integración y 21 pruebas"].map((phase, index) => <p key={phase}><span>{String(index + 1).padStart(2, "0")}</span><strong>{phase}</strong></p>)}</div>
          </div>
        </div>
      </section>

      <section className="section dashboard-section" id="dashboard">
        <div className="section-heading dashboard-heading"><div><span className="eyebrow">Aplicativo web operativo</span><h2>Monitoreo y control por cultivo.</h2></div><div className="live-state"><i className={systemPaused ? "paused" : ""} /><p><strong>{systemPaused ? "Sistema pausado" : "Sistema autónomo"}</strong><small>{isLive ? `En línea · ${lastSync}` : "Demostración interactiva"}</small></p><button onClick={pauseSystem}>{systemPaused ? "Reactivar" : "Pausar"}</button></div></div>
        <div className="status-strip">
          <div className="status-lead"><span>≋</span><p><small>Estado actual</small><strong>{systemPaused ? "Riego suspendido" : activeZone ? `Regando Zona ${activeZone.id}` : "En monitoreo"}</strong></p></div>
          <div><small>Caudal</small><strong>{systemPaused ? "0,0" : telemetry.flowLpm.toFixed(1).replace(".", ",")} <b>L/min</b></strong></div>
          <div><small>Presión</small><strong>{telemetry.pressureBar.toFixed(1).replace(".", ",")} <b>bar</b></strong></div>
          <div><small>Aplicado hoy</small><strong>{waterToday.toFixed(1).replace(".", ",")} <b>L</b></strong></div>
          <div><small>Ambiente</small><strong>{telemetry.ambientTemp.toFixed(1).replace(".", ",")} <b>°C</b></strong></div>
        </div>
        <div className="dashboard-grid">
          <div className="zones-panel">
            <div className="subheading"><div><span className="eyebrow">Tres zonas</span><h3>Condiciones del suelo</h3></div><p><i className="green" /> Óptima <i className="amber" /> Observar <i className="blue" /> Regando</p></div>
            <div className="zone-grid">
              {zones.map((zone) => <article className={`zone-card ${zone.tone}`} key={zone.id}>
                <div className="zone-head"><span>{zone.id}</span><p><small>Zona {zone.id}</small><strong>{zone.crop}</strong></p><i>{zone.state}</i></div>
                <div className="moisture-row"><div><small>Humedad del suelo</small><strong>{zone.moisture}<sup>%</sup></strong><span>Objetivo {zone.min}–{zone.max}%</span></div><MiniBars values={zone.history} /></div>
                <div className="zone-details"><p><small>Temp. suelo</small><strong>{zone.soilTemp.toFixed(1).replace(".", ",")} °C</strong></p><p><small>Agua hoy</small><strong>{zone.dailyLiters.toFixed(1).replace(".", ",")} / {zone.dailyLimit.toFixed(1).replace(".", ",")} L</strong></p></div>
                <button onClick={() => setSelectedZone(zone)} disabled={systemPaused}>⌁ Regar 0,40 L</button>
              </article>)}
            </div>
          </div>
          <aside className="decision-card"><span className="eyebrow">Decisión autónoma</span><h3>El sistema explica por qué actúa.</h3><div className="decision-score"><strong>{activeZone ? "7" : "0"}</strong><p><b>puntos</b><small>de déficit detectado</small></p></div><ul><li><i>✓</i><p><strong>Suelo bajo el umbral</strong><small>Zona A: 38 % · mínimo 45 %</small></p></li><li><i>✓</i><p><strong>Tanque suficiente</strong><small>{telemetry.tankLevel} % disponible</small></p></li><li><i>✓</i><p><strong>Presión y energía estables</strong><small>{telemetry.pressureBar.toFixed(1)} bar · batería {telemetry.batteryPct} %</small></p></li><li><i>✓</i><p><strong>Dentro del límite diario</strong><small>1,4 de 3,0 litros utilizados</small></p></li></ul></aside>
        </div>
        <div className="dashboard-lower">
          <article className="resource-card"><div className="subheading"><div><span className="eyebrow">Recursos</span><h3>Agua y energía</h3></div><em>Todo saludable</em></div><div className="resource-content"><Donut value={telemetry.tankLevel} label="Tanque" /><Donut value={telemetry.batteryPct} label="Batería" /><div className="energy-facts"><p><small>Producción solar</small><strong>{telemetry.solarWatts} W</strong><span>cargando</span></p><p><small>Tensión</small><strong>{telemetry.batteryVoltage.toFixed(1).replace(".", ",")} V</strong><span>normal</span></p><p><small>Autonomía est.</small><strong>31 h</strong><span>con reserva</span></p></div></div></article>
          <article className="activity-card"><div className="subheading"><div><span className="eyebrow">Bitácora</span><h3>Actividad reciente</h3></div><a href="#documentacion">Ver protocolo →</a></div><div className="event-list">{events.map((event) => <div className="event" key={event.time + event.title}><time>{event.time}</time><i /><p><strong>{event.title}</strong><small>{event.detail}</small></p></div>)}</div></article>
        </div>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-title">
        <div className="section"><div className="section-heading centered"><span className="eyebrow">Galería validada</span><h2 id="gallery-title">Referencias visuales del prototipo.</h2><p>Se seleccionaron imágenes coherentes con el diseño. Abre cada una para revisarla en detalle.</p></div><div className="gallery-grid">{gallery.map((item, index) => <button key={item.src} className={index === 0 ? "wide" : ""} onClick={() => setSelectedImage(item)}><img src={item.src} alt={item.title} /><span><strong>{item.title}</strong><small>{item.caption}</small></span></button>)}</div><p className="gallery-disclaimer">Estas imágenes son visualizaciones técnicas de referencia. La aceptación del sistema se realiza con fotografías, mediciones y pruebas del montaje físico definitivo.</p></div>
      </section>

      <section className="section documentation-section" id="documentacion">
        <div className="section-heading split-heading"><div><span className="eyebrow">Documentación completa</span><h2>Todos los componentes, hasta el elemento más pequeño.</h2></div><p>El manual integra estructura, hidráulica, sensores, potencia, energía solar, conexiones, software, herramientas, fases, fallos, repuestos, mantenimiento y criterios de operación.</p></div>
        <div className="document-stats"><div><strong>8</strong><span>kits integrados</span></div><div><strong>144</strong><span>apartados técnicos</span></div><div><strong>21</strong><span>pruebas de aceptación</span></div><div><strong>7 días</strong><span>de ensayo prolongado</span></div></div>
        <div className="infographic-library connection-infographics" aria-labelledby="connection-infographics-title">
          <div className="infographic-heading"><div><span className="eyebrow">Planos eléctricos</span><h3 id="connection-infographics-title">Conexiones del ESP32 verificadas antes del montaje.</h3></div><p>Se recibieron dos archivos horizontales idénticos y se almacenó una sola copia optimizada. La versión horizontal es la referencia principal; la vertical se conserva únicamente como apoyo didáctico por sus contradicciones internas.</p></div>
          <div className="infographic-grid connection-grid">
            {connectionInfographics.map((item) => {
              const group = infographicSubimageGroups.find((candidate) => candidate.slug === item.subimageSlug);
              return <article key={item.src} className={`infographic-card-shell ${item.tone ?? "valid"}`}>
                <button className="infographic-card" onClick={() => setSelectedImage(item)} aria-label={`Ampliar ${item.title}`}>
                  <img src={item.src} alt={item.title} loading="lazy" /><span><b>{item.status}</b><strong>{item.title}</strong><small>{item.caption}</small><i>Ampliar plano ↗</i></span>
                </button>
                {group && <button className="subimage-open-button" onClick={() => openSubimageGroup(group.slug)}><span>▦</span> Ver sus {group.items.length} subimágenes</button>}
              </article>;
            })}
          </div>
        </div>
        <TechnicalManual />
      </section>

      <section className="contact-section" id="contacto">
        <div className="section contact-inner"><img src={assetPath("logo-uef-samborondon.jpeg")} alt="Unidad Educativa Fiscal Samborondón" /><div><span className="eyebrow">Proyecto institucional</span><h2>Sistema de riego inteligente 1.0</h2><p>Unidad Educativa Fiscal Samborondón · Samborondón, Ecuador</p></div><div className="contact-actions"><a className="button primary" href="#dashboard">Monitorear sistema</a><a className="button secondary" href="#inicio">Volver al inicio</a></div></div>
      </section>

      <footer><div><img src={assetPath("logo-uef-samborondon.jpeg")} alt="" /><p><strong>Sistema de riego inteligente 1.0</strong><small>Unidad Educativa Fiscal Samborondón</small></p></div><p>Control local autónomo · supervisión web segura · energía solar</p><a href="#inicio">↑ Inicio</a></footer>

      {selectedComponent && <div className="modal-backdrop component-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedComponent(null); }}><article className="component-modal" role="dialog" aria-modal="true" aria-labelledby="component-title">
        <button className="component-close" onClick={() => setSelectedComponent(null)} aria-label="Cerrar descripción del componente">×</button>
        <div className="component-specific-photo"><img src={componentCatalogImages[selectedComponent.id]} alt={`Fotografía ampliada de ${selectedComponent.title}`} /></div>
        <div className="component-modal-copy"><span className="eyebrow">{selectedComponent.number} · {selectedComponent.kit}</span><h2 id="component-title">{selectedComponent.title}</h2><p>{selectedComponent.summary}</p><div><strong>Conexión en el proyecto</strong><p>{selectedComponent.connection}</p></div><a href="#documentacion" onClick={() => setSelectedComponent(null)}>Consultar especificación completa →</a></div>
      </article></div>}
      {selectedMaterial && <div className="modal-backdrop material-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedMaterial(null); }}><article className="material-modal" role="dialog" aria-modal="true" aria-labelledby="material-title">
        <button className="component-close" onClick={() => setSelectedMaterial(null)} aria-label="Cerrar ficha del material">×</button>
        <div className="material-modal-photo"><img src={selectedMaterial.image} alt={`Fotografía de ${selectedMaterial.name}`} /></div>
        <div className="material-modal-copy"><span className="eyebrow">{selectedMaterial.kit} · Cantidad requerida: {selectedMaterial.quantity}</span><h2 id="material-title">{selectedMaterial.name}</h2><div className="material-spec"><strong>Especificación mínima</strong><p>{selectedMaterial.specification}</p></div><div><strong>Qué es y qué función cumple</strong><p>{selectedMaterial.role}</p></div><div><strong>Conexión e instalación</strong><p>{selectedMaterial.connection}</p></div><button onClick={() => setSelectedMaterial(null)}>Volver a la lista</button></div>
      </article></div>}
      {selectedZone && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedZone(null); }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="watering-title"><span className="modal-icon">⌁</span><span className="eyebrow">Orden remota protegida</span><h2 id="watering-title">Regar Zona {selectedZone.id}</h2><p>Se solicitará un pulso de <strong>0,40 litros</strong> para {selectedZone.crop}. El ESP32 validará tanque, batería, caudal, presión, emergencia y límite diario antes de activar la bomba.</p><div className="safety-checks"><span>✓ Tanque {telemetry.tankLevel} %</span><span>✓ Batería {telemetry.batteryPct} %</span><span>✓ Límite disponible</span></div><div className="modal-actions"><button onClick={() => setSelectedZone(null)}>Cancelar</button><button className="primary" onClick={() => void confirmWatering(selectedZone)}>Confirmar riego</button></div></div></div>}
      {selectedSubimageGroup && <div className="modal-backdrop subimage-gallery-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedSubimageGroup(null); }}><section className="subimage-gallery-modal" role="dialog" aria-modal="true" aria-labelledby="subimage-gallery-title">
        <button className="component-close" onClick={() => setSelectedSubimageGroup(null)} aria-label="Cerrar galería de subimágenes">×</button>
        <header><span className="eyebrow">Infografía separada · {selectedSubimageGroup.items.length} recortes</span><h2 id="subimage-gallery-title">{selectedSubimageGroup.title}</h2><p>Cada recorte conserva la imagen y la información técnica de su sección original. Selecciona uno para ampliarlo en calidad visible.</p></header>
        <div className="subimage-modal-grid">{selectedSubimageGroup.items.map((item) => <button key={item.src} onClick={() => setSelectedImage(item)} aria-label={`Ampliar ${item.title}`}><img src={item.src} alt={item.title} loading="lazy" /><span><strong>{item.title}</strong><small>Abrir en alta calidad ↗</small></span></button>)}</div>
      </section></div>}
      {selectedImage && <div className="modal-backdrop image-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedImage(null); }}><figure className="image-modal" role="dialog" aria-modal="true" aria-label={selectedImage.title}><button onClick={() => setSelectedImage(null)} aria-label="Cerrar imagen">×</button><img src={selectedImage.src} alt={selectedImage.title} /><figcaption><strong>{selectedImage.title}</strong><p>{selectedImage.caption}</p></figcaption></figure></div>}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </main>
  );
}
