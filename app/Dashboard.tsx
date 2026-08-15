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
  { number: "08", title: "Montaje y herramientas", image: assetPath("cabecera-riego-inteligente.png"), summary: "Reúne cableado, terminales, sellado, herramientas y consumibles de instalación.", items: ["Caja IP65 y borneras", "Cableado identificado", "Herramientas de prueba"], target: "manual-section-11-herramientas-y-consumibles-de-montaje" },
];

const gallery = [
  { src: assetPath("galeria-estructura.jpeg"), title: "Construcción de la cama", caption: "Referencia visual del bastidor, divisores y drenaje previo al sustrato." },
  { src: assetPath("galeria-bomba.jpeg"), title: "Banco hidráulico", caption: "Bomba de diafragma, manómetro, tuberías y base antivibración." },
  { src: assetPath("galeria-control-esp32.jpeg"), title: "Control ESP32", caption: "Referencia de montaje ordenado dentro de una envolvente protegida." },
  { src: assetPath("galeria-caja-ip65.jpeg"), title: "Caja IP65", caption: "Protección de conexiones y circuitos frente a polvo y salpicaduras." },
  { src: assetPath("galeria-panel-solar.jpeg"), title: "Generación solar", caption: "Panel con estructura estable, cableado protegido y controlador de carga." },
  { src: assetPath("galeria-calibracion.jpeg"), title: "Calibración y pruebas", caption: "Medición de sensores, aforo y comprobación del comportamiento hidráulico." },
  { src: assetPath("galeria-zona-c.jpeg"), title: "Riego de la Zona C", caption: "Microaspersión controlada para el cultivo demostrativo de pimiento." },
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

const controlMaterials = [
  { id: "esp32", quantity: "1", name: "ESP32 DevKit", specification: "3,3 V, Wi‑Fi 2,4 GHz", image: assetPath("materiales/esp32-devkit.png"), role: "Es el cerebro local del sistema. Lee los sensores, ejecuta las reglas autónomas, controla bomba y válvulas mediante las etapas de potencia, registra eventos y sincroniza la telemetría con el aplicativo web.", connection: "Se alimenta con 5 V regulados; todas sus entradas y salidas trabajan a 3,3 V. Los sensores I²C comparten SDA/SCL y las cargas de 12 V se gobiernan exclusivamente mediante drivers protegidos." },
  { id: "ads1115", quantity: "1", name: "ADS1115", specification: "ADC I²C de 16 bits", image: assetPath("materiales/ads1115.png"), role: "Amplía la capacidad de medición analógica y mejora la resolución de las tres sondas de humedad del suelo y otras señales lentas.", connection: "Comparte el bus I²C con el ESP32. Sus entradas nunca deben superar la tensión de alimentación; cada canal se calibra con valores de suelo seco y húmedo." },
  { id: "ds3231", quantity: "1", name: "DS3231", specification: "RTC con batería", image: assetPath("materiales/ds3231.png"), role: "Conserva fecha y hora aunque el sistema pierda energía o Internet. Permite aplicar ventanas horarias, límites diarios y una bitácora cronológica confiable.", connection: "Se conecta al bus I²C y utiliza una batería de respaldo propia. El firmware sincroniza su hora cuando la red está disponible sin depender de ella para regar." },
  { id: "soil-moisture", quantity: "3", name: "Sensor capacitivo de suelo", specification: "Salida analógica compatible, encapsulado", image: assetPath("materiales/sensor-humedad-capacitivo.png"), role: "Mide la humedad relativa del sustrato en las zonas A, B y C sin exponer electrodos metálicos que se corroen rápidamente.", connection: "Cada sensor llega a un canal independiente del ADS1115. Se instala en la zona radicular, se encapsula la electrónica y se calibra individualmente en seco y a capacidad de campo." },
  { id: "ds18b20", quantity: "3", name: "DS18B20 impermeable", specification: "Dirección ROM identificable", image: assetPath("materiales/ds18b20-impermeable.png"), role: "Mide la temperatura del suelo de cada cultivo para contextualizar la humedad, detectar condiciones extremas y mejorar las decisiones agronómicas.", connection: "Las tres sondas comparten un bus OneWire con resistencia de elevación. Su dirección ROM se asocia permanentemente a una zona para impedir lecturas cruzadas." },
  { id: "bme280", quantity: "1", name: "BME280", specification: "Temperatura y humedad ambiental", image: assetPath("materiales/bme280.png"), role: "Registra las condiciones ambientales del huerto. Sus datos permiten interpretar la pérdida de humedad y documentar el contexto de cada riego.", connection: "Se conecta por I²C y se monta en una garita ventilada, a la sombra y protegida de lluvia, radiación directa y salpicaduras." },
  { id: "ultrasonic", quantity: "1", name: "Sensor ultrasónico impermeable", specification: "Nivel continuo; ECHO adaptado a 3,3 V", image: assetPath("materiales/sensor-ultrasonico-impermeable.png"), role: "Mide de forma continua la distancia hasta el agua y la convierte en porcentaje y litros disponibles en el tanque.", connection: "Se instala verticalmente en la tapa. TRIG sale del ESP32 y ECHO pasa obligatoriamente por un divisor o adaptador de nivel para no aplicar 5 V al controlador." },
  { id: "floats", quantity: "2", name: "Flotadores", specification: "Inferior de seguridad y superior de lleno", image: assetPath("materiales/flotadores-nivel.png"), role: "Aportan dos confirmaciones físicas independientes: el inferior bloquea la bomba si falta agua y el superior confirma que el tanque alcanzó el nivel de llenado.", connection: "Se leen como contactos digitales con lógica segura. El flotador inferior participa además en el enclavamiento físico que debe detener la bomba aunque el software falle." },
  { id: "flowmeter", quantity: "1", name: "Caudalímetro", specification: "Adecuado al rango real de 1–5 L/min", image: assetPath("materiales/caudalimetro.png"), role: "Cuenta el agua realmente entregada. Permite regar por volumen, detectar tuberías obstruidas o rotas y comprobar que la bomba respondió.", connection: "Se instala después del filtro y antes del colector de zonas, respetando la flecha de flujo. Su salida de pulsos se adapta a 3,3 V y se calibra mediante aforo." },
  { id: "pressure", quantity: "1", name: "Sensor de presión", specification: "0–2 bar preferible o rango calibrable", image: assetPath("materiales/sensor-presion.png"), role: "Vigila que la red opere dentro del rango de los microaspersores. Detecta falta de cebado, obstrucción, válvula cerrada y sobrepresión.", connection: "Se monta en una derivación del colector con sello apropiado. Su señal analógica se acondiciona al ADC y se contrasta con el manómetro durante la calibración." },
  { id: "ina260", quantity: "1", name: "INA260", specification: "Hasta 36 V/15 A; verificar la corriente de cortocircuito del panel", image: assetPath("materiales/ina260.png"), role: "Mide tensión, corriente y potencia del subsistema solar para mostrar producción, consumo y condiciones anómalas en el tablero web.", connection: "Se intercala en el conductor medido y comunica por I²C. Antes de instalarlo se verifica que la corriente de cortocircuito del panel nunca exceda la capacidad real del módulo y sus terminales." },
  { id: "battery-divider", quantity: "1", name: "Divisor de batería", specification: "Resistencias de precisión + protección ADC", image: assetPath("materiales/divisor-bateria.png"), role: "Reduce la tensión de la batería de 12 V a un nivel seguro para que el controlador calcule estado de carga, baja tensión y recuperación.", connection: "Usa resistencias de precisión, limitación de corriente, filtro y protección de entrada. Su relación se calibra con multímetro y la salida nunca puede superar 3,3 V." },
  { id: "oled", quantity: "1", name: "Pantalla OLED", specification: "I²C, opcional para operación local", image: assetPath("materiales/pantalla-oled.png"), role: "Muestra localmente estado, nivel, batería, zona activa y alarmas durante instalación, mantenimiento o pérdida de conectividad.", connection: "Comparte el bus I²C, se alimenta a la tensión indicada por el módulo y se configura con una dirección que no entre en conflicto. No es necesaria para la autonomía." },
];

const finalProjectVisual = {
  src: assetPath("proyecto-final-operativo-v1.png"),
  title: "Sistema completo instalado y en operación",
  caption: "Vista técnica del prototipo integrado: tres cultivos, seis emisores, energía solar, reserva de agua, hidráulica protegida, control ESP32, sensores y supervisión web.",
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
  const [selectedImage, setSelectedImage] = useState<(typeof gallery)[number] | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<(typeof componentCatalog)[number] | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<(typeof controlMaterials)[number] | null>(null);
  const [toast, setToast] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [systemPaused, setSystemPaused] = useState(false);
  const [lastSync, setLastSync] = useState("hace 8 s");
  const [telemetry, setTelemetry] = useState({ tankLevel: 78, batteryVoltage: 13.1, batteryPct: 84, solarWatts: 128, pressureBar: 1, flowLpm: 1.8, ambientTemp: 29.4, ambientHumidity: 71 });

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

      <section className="hero" id="inicio" style={{ backgroundImage: `url(${assetPath("cabecera-riego-inteligente.png")})` }}>
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
            <img src={assetPath("catalogo-componentes-v1.png")} alt="Conjunto fotográfico de componentes del sistema de riego inteligente" />
            {componentCatalog.map((component) => <button
              className="component-hotspot"
              key={component.id}
              style={{ left: `${component.x}%`, top: `${component.y}%` }}
              onClick={() => setSelectedComponent(component)}
              aria-label={`Ver ${component.title}`}
            ><span>{component.number}</span><strong>{component.title}</strong></button>)}
          </div>
          <div className="component-index" aria-label="Índice de componentes fotografiados">
            {componentCatalog.map((component) => <button key={component.id} onClick={() => setSelectedComponent(component)}><span>{component.number}</span><strong>{component.title}</strong><small>{component.kit}</small></button>)}
          </div>
        </div>
        <div className="materials-catalog" aria-labelledby="materials-title">
          <div className="materials-heading">
            <div><span className="eyebrow">Lista de materiales del prototipo</span><h3 id="materials-title">Control y medición</h3></div>
            <p>Las especificaciones son obligatorias; la marca puede variar. Verificar corriente, tensión, presión mínima y disponibilidad antes de comprar.</p>
          </div>
          <div className="materials-stats" aria-label="Resumen de materiales de control y medición">
            <div><strong>13</strong><span>referencias</span></div><div><strong>18</strong><span>unidades totales</span></div><div><strong>12 + 1</strong><span>obligatorios + opcional</span></div>
          </div>
          <div className="materials-grid">
            {controlMaterials.map((material, index) => <article className="material-card" key={material.id}>
              <button onClick={() => setSelectedMaterial(material)} aria-label={`Ver función de ${material.name}`}>
                <span className="material-photo"><img src={material.image} alt={`Fotografía técnica de ${material.name}`} loading="lazy" /><b>{String(index + 1).padStart(2, "0")}</b></span>
                <span className="material-copy"><small>Cantidad: {material.quantity}</small><strong>{material.name}</strong><em>{material.specification}</em><i>Ver función y conexión →</i></span>
              </button>
            </article>)}
          </div>
          <div className="materials-table-wrap">
            <table>
              <caption>Especificaciones mínimas de compra para control y medición</caption>
              <thead><tr><th>Cantidad</th><th>Elemento</th><th>Especificación mínima</th></tr></thead>
              <tbody>{controlMaterials.map((material) => <tr key={`row-${material.id}`}><td>{material.quantity}</td><th scope="row">{material.name}</th><td>{material.specification}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <div className="kit-grid">
          {kitCards.map((kit) => <article className="kit-card" key={kit.number}>
            <div className="kit-image"><img src={kit.image} alt={`Visualización del ${kit.title}`} /><span>{kit.number}</span></div>
            <div className="kit-body"><h3>{kit.title}</h3><p>{kit.summary}</p><ul>{kit.items.map((item) => <li key={item}>{item}</li>)}</ul><a href={`#${kit.target}`}>Ver kit completo <span>→</span></a></div>
          </article>)}
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
        <TechnicalManual />
      </section>

      <section className="contact-section" id="contacto">
        <div className="section contact-inner"><img src={assetPath("logo-uef-samborondon.jpeg")} alt="Unidad Educativa Fiscal Samborondón" /><div><span className="eyebrow">Proyecto institucional</span><h2>Sistema de riego inteligente 1.0</h2><p>Unidad Educativa Fiscal Samborondón · Samborondón, Ecuador</p></div><div className="contact-actions"><a className="button primary" href="#dashboard">Monitorear sistema</a><a className="button secondary" href="#inicio">Volver al inicio</a></div></div>
      </section>

      <footer><div><img src={assetPath("logo-uef-samborondon.jpeg")} alt="" /><p><strong>Sistema de riego inteligente 1.0</strong><small>Unidad Educativa Fiscal Samborondón</small></p></div><p>Control local autónomo · supervisión web segura · energía solar</p><a href="#inicio">↑ Inicio</a></footer>

      {selectedComponent && <div className="modal-backdrop component-backdrop" onMouseDown={() => setSelectedComponent(null)}><article className="component-modal" role="dialog" aria-modal="true" aria-labelledby="component-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="component-close" onClick={() => setSelectedComponent(null)} aria-label="Cerrar descripción del componente">×</button>
        <div className="component-specific-photo" role="img" aria-label={`Acercamiento fotográfico de ${selectedComponent.title}`} style={{ backgroundImage: `url(${assetPath("catalogo-componentes-v1.png")})`, backgroundPosition: selectedComponent.focus, backgroundSize: selectedComponent.zoom }} />
        <div className="component-modal-copy"><span className="eyebrow">{selectedComponent.number} · {selectedComponent.kit}</span><h2 id="component-title">{selectedComponent.title}</h2><p>{selectedComponent.summary}</p><div><strong>Conexión en el proyecto</strong><p>{selectedComponent.connection}</p></div><a href="#documentacion" onClick={() => setSelectedComponent(null)}>Consultar especificación completa →</a></div>
      </article></div>}
      {selectedMaterial && <div className="modal-backdrop material-backdrop" onMouseDown={() => setSelectedMaterial(null)}><article className="material-modal" role="dialog" aria-modal="true" aria-labelledby="material-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="component-close" onClick={() => setSelectedMaterial(null)} aria-label="Cerrar ficha del material">×</button>
        <div className="material-modal-photo"><img src={selectedMaterial.image} alt={`Fotografía de ${selectedMaterial.name}`} /></div>
        <div className="material-modal-copy"><span className="eyebrow">Cantidad requerida: {selectedMaterial.quantity}</span><h2 id="material-title">{selectedMaterial.name}</h2><div className="material-spec"><strong>Especificación mínima</strong><p>{selectedMaterial.specification}</p></div><div><strong>Qué es y qué función cumple</strong><p>{selectedMaterial.role}</p></div><div><strong>Conexión e instalación</strong><p>{selectedMaterial.connection}</p></div><button onClick={() => setSelectedMaterial(null)}>Volver a la lista</button></div>
      </article></div>}
      {selectedZone && <div className="modal-backdrop" onMouseDown={() => setSelectedZone(null)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="watering-title" onMouseDown={(event) => event.stopPropagation()}><span className="modal-icon">⌁</span><span className="eyebrow">Orden remota protegida</span><h2 id="watering-title">Regar Zona {selectedZone.id}</h2><p>Se solicitará un pulso de <strong>0,40 litros</strong> para {selectedZone.crop}. El ESP32 validará tanque, batería, caudal, presión, emergencia y límite diario antes de activar la bomba.</p><div className="safety-checks"><span>✓ Tanque {telemetry.tankLevel} %</span><span>✓ Batería {telemetry.batteryPct} %</span><span>✓ Límite disponible</span></div><div className="modal-actions"><button onClick={() => setSelectedZone(null)}>Cancelar</button><button className="primary" onClick={() => void confirmWatering(selectedZone)}>Confirmar riego</button></div></div></div>}
      {selectedImage && <div className="modal-backdrop image-backdrop" onMouseDown={() => setSelectedImage(null)}><figure className="image-modal" role="dialog" aria-modal="true" aria-label={selectedImage.title} onMouseDown={(event) => event.stopPropagation()}><button onClick={() => setSelectedImage(null)} aria-label="Cerrar imagen">×</button><img src={selectedImage.src} alt={selectedImage.title} /><figcaption><strong>{selectedImage.title}</strong><p>{selectedImage.caption}</p></figcaption></figure></div>}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </main>
  );
}
