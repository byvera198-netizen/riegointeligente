"use client";

import { useMemo, useState } from "react";

type Zone = {
  id: "A" | "B" | "C";
  crop: string;
  humidity: number;
  threshold: number;
  tone: string;
};

const initialZones: Zone[] = [
  { id: "A", crop: "Tomate", humidity: 42, threshold: 45, tone: "#e15c46" },
  { id: "B", crop: "Lechuga", humidity: 57, threshold: 50, tone: "#d8ad3d" },
  { id: "C", crop: "Pimiento", humidity: 36, threshold: 44, tone: "#3ea969" },
];

const gallery = [
  {
    src: "/proyecto-frontal.png",
    eyebrow: "Vista frontal",
    title: "Prototipo completo de 2 m²",
    alt: "Vista frontal ultra realista del Sistema de Riego Inteligente con tres zonas, tanque y estación solar",
  },
  {
    src: "/proyecto-isometrico.png",
    eyebrow: "Diseño físico",
    title: "Distribución isométrica",
    alt: "Vista isométrica del prototipo con las zonas de tomate, lechuga y pimiento",
  },
  {
    src: "/estacion-solar.png",
    eyebrow: "Energía protegida",
    title: "Estación solar elevada",
    alt: "Detalle de la estación solar con panel, controlador, inversor y batería elevada",
  },
];

const installation = [
  ["01", "Preparar", "Construir la cama de 1 × 2 m, dividir las tres microzonas y fijar soportes elevados."],
  ["02", "Hidratar", "Instalar depósito, filtro, bombas y red de distribución; comprobar fugas y caudal."],
  ["03", "Energizar", "Montar el panel, controlador, batería elevada, fusibles y convertidor DC–DC."],
  ["04", "Conectar", "Fijar ESP32, sensores capacitivos, MOSFET, pantalla e indicadores en caja protegida."],
  ["05", "Programar", "Cargar el firmware, configurar umbrales, tiempos y panel de monitoreo local."],
  ["06", "Validar", "Calibrar cada sustrato y ensayar suelo seco, nivel bajo y riego secuencial."],
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14" />
    </svg>
  );
}

export default function Home() {
  const [zones, setZones] = useState(initialZones);
  const [irrigating, setIrrigating] = useState<string | null>(null);
  const [tankOk, setTankOk] = useState(true);
  const [log, setLog] = useState("Lecturas actualizadas · listo para decidir");
  const [area, setArea] = useState(12);
  const [activeImage, setActiveImage] = useState<(typeof gallery)[number] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const priority = useMemo(() => {
    if (!tankOk) return null;
    return [...zones]
      .filter((zone) => zone.humidity < zone.threshold)
      .sort(
        (a, b) =>
          b.threshold - b.humidity - (a.threshold - a.humidity),
      )[0] ?? null;
  }, [zones, tankOk]);

  const updateHumidity = (id: Zone["id"], humidity: number) => {
    setZones((current) =>
      current.map((zone) => (zone.id === id ? { ...zone, humidity } : zone)),
    );
    setLog(`Sensor de zona ${id} actualizado a ${humidity}%`);
  };

  const runCycle = () => {
    if (irrigating) return;
    if (!tankOk) {
      setLog("Protección activa: nivel del tanque insuficiente");
      return;
    }
    if (!priority) {
      setLog("Ciclo completado: todas las zonas están sobre su umbral");
      return;
    }
    const target = priority;
    setIrrigating(target.id);
    setLog(`Riego activado en zona ${target.id} · ${target.crop}`);
    window.setTimeout(() => {
      setZones((current) =>
        current.map((zone) =>
          zone.id === target.id
            ? { ...zone, humidity: Math.min(100, zone.humidity + 10) }
            : zone,
        ),
      );
      setIrrigating(null);
      setLog(`Pulso finalizado · zona ${target.id} entra en estabilización`);
    }, 1350);
  };

  const simulateDrySoil = () => {
    setZones([
      { ...initialZones[0], humidity: 28 },
      { ...initialZones[1], humidity: 43 },
      { ...initialZones[2], humidity: 31 },
    ]);
    setLog("Escenario seco cargado · la prioridad ha sido recalculada");
  };

  const resetSimulation = () => {
    setZones(initialZones);
    setTankOk(true);
    setIrrigating(null);
    setLog("Simulación restablecida");
  };

  const sectors = Math.max(3, Math.ceil(area * 3));
  const sensorPoints = Math.max(3, Math.ceil(area * 2));
  const solarStations = Math.max(1, Math.ceil(area / 15));

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <span className="brand-mark">
            <img src="/logo-institucion.jpeg" alt="Logotipo de la Unidad Educativa Fiscal Samborondón" />
          </span>
          <span className="brand-copy">
            <strong>Unidad Educativa</strong>
            <span>Fiscal Samborondón</span>
          </span>
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <nav className={menuOpen ? "nav-open" : ""} aria-label="Navegación principal">
          <a href="#proyecto" onClick={() => setMenuOpen(false)}>Proyecto</a>
          <a href="#simulador" onClick={() => setMenuOpen(false)}>Simulador</a>
          <a href="#vision" onClick={() => setMenuOpen(false)}>Visión agrícola</a>
          <a href="#galeria" onClick={() => setMenuOpen(false)}>Galería</a>
          <a className="nav-cta" href="/Informe_general_Sistema_de_Riego_Inteligente.docx" download>
            Informe <DownloadIcon />
          </a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <img className="hero-image" src="/proyecto-frontal.png" alt="Prototipo final del Sistema de Riego Inteligente" />
        <div className="hero-overlay" />
        <div className="hero-grain" />
        <div className="container hero-content">
          <div className="hero-copy">
            <p className="eyebrow light"><span /> Proyecto institucional · 2026</p>
            <h1><span>Sistema de Riego</span> Inteligente</h1>
            <p className="hero-lead">
              Agricultura de precisión que observa, decide y actúa. Un prototipo solar de tres microzonas diseñado para crecer hacia plantaciones agrícolas reales.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#simulador">Explorar el sistema <ArrowIcon /></a>
              <a className="button ghost" href="/Informe_general_Sistema_de_Riego_Inteligente.docx" download>
                Descargar informe <DownloadIcon />
              </a>
            </div>
          </div>
          <div className="hero-console" aria-label="Resumen operativo del prototipo">
            <div className="console-top">
              <span className="live-dot" />
              <span>Sistema preparado</span>
              <small>Modo demostración</small>
            </div>
            <div className="console-grid">
              <div><strong>3</strong><span>microzonas</span></div>
              <div><strong>2 m²</strong><span>área piloto</span></div>
              <div><strong>Solar</strong><span>energía primaria</span></div>
            </div>
            <div className="console-line"><span style={{ width: "82%" }} /></div>
            <p>Control por humedad · prioridad hídrica · estabilización</p>
          </div>
        </div>
        <a className="scroll-cue" href="#proyecto" aria-label="Continuar al proyecto"><span /> Descubrir</a>
      </section>

      <div className="signal-strip" aria-hidden="true">
        <div>
          <span>Medir</span><i />
          <span>Interpretar</span><i />
          <span>Priorizar</span><i />
          <span>Regar</span><i />
          <span>Aprender</span><i />
          <span>Escalar</span>
        </div>
      </div>

      <section className="section overview" id="proyecto">
        <div className="container">
          <div className="section-intro split-intro">
            <div>
              <p className="eyebrow"><span /> Una plataforma, no solo una maqueta</p>
              <h2>Precisión en pequeño.<br /><em>Impacto en grande.</em></h2>
            </div>
            <div className="intro-copy">
              <p>
                El proyecto convierte diferencias reales del suelo en decisiones observables. Cada cultivo tiene su sensor, su umbral y su canal de riego; el ESP32 coordina la respuesta sin bloquear el monitoreo.
              </p>
              <p>
                La escala de 1 × 2 metros permite validar con seguridad la arquitectura antes de llevarla a sectores hidráulicos de una plantación.
              </p>
            </div>
          </div>

          <div className="principles-grid">
            <article className="principle featured">
              <span className="principle-number">01</span>
              <div className="water-rings"><span /><span /><span /></div>
              <h3>Decidir con datos</h3>
              <p>El riego ocurre cuando la humedad calibrada cae bajo el umbral configurado para cada cultivo.</p>
            </article>
            <article className="principle">
              <span className="principle-number">02</span>
              <div className="mini-icon sun-icon" aria-hidden="true">☼</div>
              <h3>Operar con energía solar</h3>
              <p>Panel, controlador y batería alimentan una ruta DC protegida; el inversor queda como apoyo auxiliar.</p>
            </article>
            <article className="principle">
              <span className="principle-number">03</span>
              <div className="mini-icon" aria-hidden="true">⌁</div>
              <h3>Escalar por sectores</h3>
              <p>La lógica de tres microzonas evoluciona hacia válvulas, estaciones remotas y puntos de medición representativos.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section simulator-section" id="simulador">
        <div className="container">
          <div className="section-intro simulator-heading">
            <div>
              <p className="eyebrow gold"><span /> Simulación interactiva</p>
              <h2>Así piensa el sistema.</h2>
            </div>
            <p>Mueva la humedad de cada cultivo y ejecute un ciclo. El controlador prioriza el mayor déficit, activa una sola zona y luego inicia la estabilización.</p>
          </div>

          <div className="simulator-shell">
            <div className="simulator-toolbar">
              <div>
                <span className={`status-beacon ${tankOk ? "online" : "offline"}`} />
                <div>
                  <small>Estado del controlador</small>
                  <strong>{!tankOk ? "Pausa protegida" : irrigating ? `Regando zona ${irrigating}` : priority ? `Prioridad: zona ${priority.id}` : "Humedad estable"}</strong>
                </div>
              </div>
              <button className={`tank-switch ${tankOk ? "on" : ""}`} type="button" onClick={() => setTankOk((ok) => !ok)} aria-pressed={tankOk}>
                <span /> Tanque {tankOk ? "disponible" : "bajo"}
              </button>
            </div>

            <div className="zones-grid">
              {zones.map((zone) => {
                const needsWater = zone.humidity < zone.threshold;
                const isActive = irrigating === zone.id;
                return (
                  <article className={`zone-card ${isActive ? "is-watering" : ""}`} key={zone.id} style={{ "--zone-tone": zone.tone } as React.CSSProperties}>
                    <div className="zone-top">
                      <span>Zona {zone.id}</span>
                      <small>{isActive ? "Riego activo" : needsWater ? "Bajo umbral" : "Humedad estable"}</small>
                    </div>
                    <h3>{zone.crop}</h3>
                    <div className="humidity-readout"><strong>{zone.humidity}</strong><span>%</span></div>
                    <div className="moisture-track" aria-hidden="true">
                      <span className="threshold-mark" style={{ left: `${zone.threshold}%` }} />
                      <i style={{ width: `${zone.humidity}%` }} />
                    </div>
                    <div className="range-labels"><span>Seco</span><span>Umbral {zone.threshold}%</span><span>Húmedo</span></div>
                    <label>
                      Ajustar lectura de humedad
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={zone.humidity}
                        aria-label={`Humedad de ${zone.crop}`}
                        onChange={(event) => updateHumidity(zone.id, Number(event.target.value))}
                      />
                    </label>
                    {isActive && <div className="water-pulse"><span /><span /><span /></div>}
                  </article>
                );
              })}
            </div>

            <div className="decision-panel">
              <div className="decision-copy">
                <small>Registro del último evento</small>
                <p>{log}</p>
              </div>
              <div className="simulator-actions">
                <button type="button" className="text-button" onClick={simulateDrySoil}>Simular sequía</button>
                <button type="button" className="text-button" onClick={resetSimulation}>Restablecer</button>
                <button type="button" className="button primary dark" onClick={runCycle} disabled={Boolean(irrigating)}>
                  {irrigating ? "Aplicando pulso…" : "Ejecutar ciclo"} <ArrowIcon />
                </button>
              </div>
            </div>
          </div>
          <p className="simulator-note">Simulación educativa. Los umbrales y tiempos reales deben calibrarse con el sustrato, el cultivo y el caudal instalados.</p>
        </div>
      </section>

      <section className="section architecture-section">
        <div className="container">
          <div className="section-intro centered">
            <p className="eyebrow"><span /> Arquitectura funcional</p>
            <h2>De la radiación solar<br />a una decisión agrícola.</h2>
          </div>
          <div className="flow-grid">
            {[
              ["01", "Energía", "Panel solar", "Genera y almacena energía en una estación elevada y protegida."],
              ["02", "Medición", "Sensores capacitivos", "Convierten el estado del suelo en lecturas calibrables por zona."],
              ["03", "Decisión", "Controlador ESP32", "Compara umbrales, calcula prioridad y mantiene la lógica no bloqueante."],
              ["04", "Actuación", "Canales independientes", "MOSFET y bombas aplican el pulso solo donde existe demanda."],
              ["05", "Evidencia", "Panel de monitoreo", "Muestra estados, eventos y datos para validar el impacto real."],
            ].map((item, index) => (
              <article className="flow-card" key={item[0]}>
                <div className="flow-number">{item[0]}</div>
                <span>{item[1]}</span>
                <h3>{item[2]}</h3>
                <p>{item[3]}</p>
                {index < 4 && <i className="flow-arrow">→</i>}
              </article>
            ))}
          </div>
          <div className="energy-note">
            <div className="energy-orbit" aria-hidden="true"><span>DC</span></div>
            <div>
              <p className="eyebrow gold"><span /> Decisión energética recomendada</p>
              <h3>La eficiencia empieza en corriente continua.</h3>
              <p>Bombas de 12 V y un convertidor de 5 V para el ESP32 conforman la ruta principal. El inversor del kit se reserva para cargas auxiliares de corriente alterna.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section macro-section" id="vision">
        <div className="container macro-grid">
          <div className="macro-copy">
            <p className="eyebrow light"><span /> Visión macro</p>
            <h2>Una lógica que crece con el territorio.</h2>
            <p>En campo, cada microzona se convierte en un sector hidráulico definido por cultivo, suelo, pendiente y exposición. La arquitectura suma nodos sin perder la lógica central: medir, priorizar, actuar y documentar.</p>
            <div className="scale-control">
              <div><label htmlFor="area-slider">Área conceptual de plantación</label><strong>{area} ha</strong></div>
              <input id="area-slider" type="range" min="1" max="60" value={area} onChange={(event) => setArea(Number(event.target.value))} />
              <div className="scale-labels"><span>1 ha</span><span>30 ha</span><span>60 ha</span></div>
            </div>
            <p className="concept-note">Estimación conceptual para visualizar escalabilidad; el diseño definitivo depende de hidráulica, topografía, cultivos y ensayos de campo.</p>
          </div>
          <div className="field-console">
            <div className="field-head">
              <div><span className="live-dot" /> Modelo de expansión</div>
              <small>Arquitectura modular</small>
            </div>
            <div className="field-map" aria-label={`Mapa conceptual para ${area} hectáreas`}>
              {Array.from({ length: 24 }).map((_, index) => (
                <span key={index} className={index < Math.min(24, Math.ceil(area / 2.5)) ? "active" : ""} style={{ animationDelay: `${index * 35}ms` }} />
              ))}
              <div className="field-node node-a">A</div>
              <div className="field-node node-b">B</div>
              <div className="field-node node-c">C</div>
            </div>
            <div className="field-stats">
              <div><strong>{sectors}</strong><span>sectores estimados</span></div>
              <div><strong>{sensorPoints}</strong><span>puntos de sensado</span></div>
              <div><strong>{solarStations}</strong><span>estaciones solares</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section installation-section">
        <div className="container">
          <div className="section-intro split-intro">
            <div>
              <p className="eyebrow"><span /> Puesta en marcha</p>
              <h2>Seis fases.<br /><em>Un sistema verificable.</em></h2>
            </div>
            <p className="intro-copy single">La instalación separa agua, potencia y señales. Cada fase termina con una comprobación concreta antes de avanzar a la siguiente.</p>
          </div>
          <div className="installation-list">
            {installation.map(([number, title, description]) => (
              <details key={number}>
                <summary><span>{number}</span><strong>{title}</strong><i>+</i></summary>
                <p>{description}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section gallery-section" id="galeria">
        <div className="container">
          <div className="section-intro gallery-heading">
            <div>
              <p className="eyebrow light"><span /> Proyecto final</p>
              <h2>Diseñado para enseñar.<br />Construido para funcionar.</h2>
            </div>
            <p>Visualizaciones coherentes con los componentes definidos: depósito protegido, control elevado, tres zonas y estación solar conectada.</p>
          </div>
          <div className="gallery-grid">
            {gallery.map((image, index) => (
              <button className={`gallery-card gallery-${index + 1}`} type="button" key={image.src} onClick={() => setActiveImage(image)}>
                <img src={image.src} alt={image.alt} />
                <span className="gallery-shade" />
                <span className="gallery-label"><small>{image.eyebrow}</small><strong>{image.title}</strong></span>
                <span className="gallery-plus">+</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section validation-section">
        <div className="container validation-grid">
          <div>
            <p className="eyebrow"><span /> Validación responsable</p>
            <h2>El impacto se demuestra. No se presume.</h2>
            <p>El proyecto registra evidencia antes de afirmar resultados: lecturas, litros aplicados, uniformidad, energía disponible, autonomía y respuesta de las plantas.</p>
            <a className="inline-link" href="/Informe_general_Sistema_de_Riego_Inteligente.docx" download>Consultar metodología completa <ArrowIcon /></a>
          </div>
          <div className="validation-cards">
            {[
              ["01", "Sensores", "Orden lógico y lecturas estables entre suelo seco y húmedo."],
              ["02", "Actuación", "Solo responde el canal seleccionado y se detiene con tanque bajo."],
              ["03", "Uniformidad", "Volumen repetible medido por zona y por ciclo."],
              ["04", "Autonomía", "Tensión, energía y duración registradas durante el ensayo."],
            ].map((item) => (
              <article key={item[0]}><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="institution-section">
        <div className="institution-glow" />
        <div className="container institution-content">
          <img src="/logo-institucion.jpeg" alt="Logotipo oficial de la Unidad Educativa Fiscal Samborondón" />
          <div>
            <p className="eyebrow gold"><span /> Ciencia aplicada al territorio</p>
            <h2>Unidad Educativa<br />Fiscal Samborondón</h2>
            <p>Un proyecto que conecta educación tecnológica, sostenibilidad y vocación agrícola para convertir el aprendizaje en soluciones observables.</p>
          </div>
          <a className="button primary" href="#inicio">Volver al inicio <span>↑</span></a>
        </div>
      </section>

      <footer>
        <div className="container footer-grid">
          <div><strong>Sistema de Riego Inteligente</strong><span>Proyecto educativo de agricultura de precisión</span></div>
          <p>Unidad Educativa Fiscal Samborondón · Samborondón, Ecuador · 2026</p>
          <a href="/Informe_general_Sistema_de_Riego_Inteligente.docx" download>Descargar informe <DownloadIcon /></a>
        </div>
      </footer>

      {activeImage && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={activeImage.title}>
          <button className="lightbox-backdrop" type="button" aria-label="Cerrar vista ampliada" onClick={() => setActiveImage(null)} />
          <button className="lightbox-close" type="button" aria-label="Cerrar imagen" onClick={() => setActiveImage(null)}>×</button>
          <div className="lightbox-panel">
            <img src={activeImage.src} alt={activeImage.alt} />
            <p><span>{activeImage.eyebrow}</span>{activeImage.title}</p>
          </div>
        </div>
      )}
    </main>
  );
}
