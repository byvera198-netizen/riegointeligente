"use client";

import { useEffect, useMemo, useState } from "react";

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
  updatedAt?: string;
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
  zones?: Array<{
    zoneId: string;
    moisturePct: number;
    soilTemp: number;
    dailyLiters: number;
  }>;
};

const initialZones: Zone[] = [
  {
    id: "A",
    crop: "Tomate",
    moisture: 38,
    soilTemp: 24.6,
    min: 45,
    max: 68,
    dailyLiters: 1.4,
    dailyLimit: 3,
    state: "Riego activo",
    tone: "active",
    history: [55, 53, 50, 48, 45, 43, 41, 39, 38],
  },
  {
    id: "B",
    crop: "Lechuga",
    moisture: 57,
    soilTemp: 22.9,
    min: 50,
    max: 72,
    dailyLiters: 0.8,
    dailyLimit: 2.4,
    state: "Humedad óptima",
    tone: "ok",
    history: [62, 60, 61, 59, 58, 57, 56, 58, 57],
  },
  {
    id: "C",
    crop: "Pimiento",
    moisture: 46,
    soilTemp: 25.1,
    min: 44,
    max: 66,
    dailyLiters: 1.1,
    dailyLimit: 2.8,
    state: "En observación",
    tone: "watch",
    history: [54, 52, 51, 49, 48, 47, 48, 47, 46],
  },
];

const events = [
  { time: "11:24", title: "Riego iniciado · Zona A", detail: "Déficit de humedad de 7 puntos", type: "water" },
  { time: "11:23", title: "Validación hidráulica correcta", detail: "1,0 bar · caudal confirmado", type: "check" },
  { time: "10:45", title: "Lecturas sincronizadas", detail: "9 sensores dentro de rango", type: "sync" },
  { time: "08:10", title: "Riego completado · Zona C", detail: "0,42 L aplicados en 46 segundos", type: "done" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function MiniBars({ values }: { values: number[] }) {
  const min = Math.min(...values) - 4;
  const max = Math.max(...values) + 4;
  return (
    <div className="mini-bars" aria-label={`Histórico de humedad: ${values.join(", ")} por ciento`}>
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          style={{ height: `${clamp(((value - min) / (max - min)) * 100, 12, 100)}%` }}
        />
      ))}
    </div>
  );
}

function Donut({ value, label, unit = "%" }: { value: number; label: string; unit?: string }) {
  return (
    <div className="donut-wrap">
      <div className="donut" style={{ "--value": `${value * 3.6}deg` } as React.CSSProperties}>
        <div><strong>{value}</strong><small>{unit}</small></div>
      </div>
      <span>{label}</span>
    </div>
  );
}

export default function Home() {
  const [zones, setZones] = useState(initialZones);
  const [activeView, setActiveView] = useState("Resumen");
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [toast, setToast] = useState("");
  const [lastSync, setLastSync] = useState("hace 8 s");
  const [isLive, setIsLive] = useState(false);
  const [systemPaused, setSystemPaused] = useState(false);
  const [telemetry, setTelemetry] = useState({
    tankLevel: 78,
    batteryVoltage: 13.1,
    batteryPct: 84,
    solarWatts: 128,
    pressureBar: 1.0,
    flowLpm: 1.8,
    ambientTemp: 29.4,
    ambientHumidity: 71,
  });

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const response = await fetch("/api/state", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as RemoteState;
        if (cancelled || !data.live || !data.telemetry) return;
        setTelemetry(data.telemetry);
        setIsLive(true);
        setLastSync("ahora");
        if (data.zones?.length) {
          setZones((current) => current.map((zone) => {
            const incoming = data.zones?.find((item) => item.zoneId === zone.id);
            return incoming ? {
              ...zone,
              moisture: incoming.moisturePct,
              soilTemp: incoming.soilTemp,
              dailyLiters: incoming.dailyLiters,
            } : zone;
          }));
        }
      } catch {
        setIsLive(false);
      }
    }
    void refresh();
    const timer = window.setInterval(refresh, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const activeZone = zones.find((zone) => zone.tone === "active");
  const waterToday = useMemo(() => zones.reduce((sum, zone) => sum + zone.dailyLiters, 0), [zones]);

  async function confirmWatering(zone: Zone) {
    if (systemPaused) {
      setToast("El sistema está pausado. Reactiva el modo autónomo antes de regar.");
      setSelectedZone(null);
      return;
    }
    if (telemetry.tankLevel < 15 || telemetry.batteryPct < 20) {
      setToast("Orden bloqueada por una protección local.");
      setSelectedZone(null);
      return;
    }

    if (isLive) {
      try {
        const response = await fetch("/api/control", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ zoneId: zone.id, action: "water", volumeMl: 400 }),
        });
        const result = (await response.json()) as { error?: string };
        if (!response.ok) throw new Error(result.error ?? "No se pudo enviar la orden");
        setToast(`Orden segura enviada a la Zona ${zone.id}. El controlador confirmará su ejecución.`);
      } catch (error) {
        setToast(error instanceof Error ? error.message : "No se pudo enviar la orden");
      }
    } else {
      setZones((current) => current.map((item) => item.id === zone.id ? {
        ...item,
        dailyLiters: Number((item.dailyLiters + 0.4).toFixed(2)),
        moisture: clamp(item.moisture + 5, 0, 100),
        state: "Riego activo",
        tone: "active",
      } : { ...item, tone: item.moisture >= item.min ? "ok" : "watch", state: item.moisture >= item.min ? "Humedad óptima" : "En observación" }));
      setToast(`Demostración: pulso de 0,40 L aplicado a la Zona ${zone.id}.`);
    }
    setSelectedZone(null);
  }

  function pauseSystem() {
    setSystemPaused((value) => !value);
    setToast(systemPaused ? "Modo autónomo reactivado." : "Sistema pausado: bomba y válvulas quedan desactivadas.");
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <img className="institution-logo" src="/logo-uef-samborondon.jpeg" alt="Logotipo de la Unidad Educativa Fiscal Samborondón" />
          <span><strong>Riego inteligente 1.0</strong><small>UEF Samborondón</small></span>
        </a>
        <nav aria-label="Navegación principal">
          {["Resumen", "Zonas", "Historial", "Configuración"].map((item) => (
            <button key={item} className={activeView === item ? "active" : ""} onClick={() => setActiveView(item)}>{item}</button>
          ))}
        </nav>
        <div className="system-state">
          <span className={systemPaused ? "status-dot paused" : "status-dot"} />
          <span><strong>{systemPaused ? "Sistema pausado" : "Sistema autónomo"}</strong><small>{isLive ? `En línea · ${lastSync}` : "Demostración operativa"}</small></span>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <span className="eyebrow">Sistema de riego inteligente 1.0 / {activeView}</span>
          <h1>El agua correcta.<br /><em>Justo cuando hace falta.</em></h1>
          <p>Control autónomo de tres zonas agrícolas con supervisión remota, límites de seguridad y registro de cada decisión.</p>
        </div>
        <div className="hero-side">
          <figure className="hero-photo">
            <img src="/cabecera-riego-inteligente.png" alt="Prototipo agrícola con riego por zonas, tanque, control hidráulico y panel solar" />
            <figcaption><span className="status-dot" /><span><strong>Prototipo autónomo</strong><small>3 zonas · energía solar · control remoto</small></span></figcaption>
          </figure>
          <div className="hero-actions">
            <button className={systemPaused ? "primary resume" : "danger-outline"} onClick={pauseSystem}>
              <span>{systemPaused ? "▶" : "■"}</span> {systemPaused ? "Reactivar sistema" : "Pausar sistema"}
            </button>
            <span className="weather"><strong>{telemetry.ambientTemp.toFixed(1)} °C</strong><small>Samborondón · {telemetry.ambientHumidity}% HR</small></span>
          </div>
        </div>
      </section>

      <section className="status-strip" aria-label="Estado del sistema">
        <div className="status-lead">
          <span className="pulse-icon">≋</span>
          <div><small>ESTADO ACTUAL</small><strong>{systemPaused ? "Riego suspendido" : activeZone ? `Regando Zona ${activeZone.id}` : "En monitoreo"}</strong></div>
        </div>
        <div><small>CAUDAL</small><strong>{systemPaused ? "0,0" : telemetry.flowLpm.toFixed(1).replace(".", ",")} <b>L/min</b></strong></div>
        <div><small>PRESIÓN</small><strong>{telemetry.pressureBar.toFixed(1).replace(".", ",")} <b>bar</b></strong></div>
        <div><small>APLICADO HOY</small><strong>{waterToday.toFixed(1).replace(".", ",")} <b>L</b></strong></div>
        <div className="progress-cell"><small>{activeZone ? `OBJETIVO ZONA ${activeZone.id}` : "CICLO"}</small><strong>0,40 <b>L</b></strong><span><i style={{ width: "64%" }} /></span></div>
      </section>

      <section className="content-grid">
        <div className="zones-panel">
          <div className="section-title">
            <div><span className="eyebrow">CONTROL POR CULTIVO</span><h2>Tres zonas, tres necesidades</h2></div>
            <div className="legend"><span><i className="green" /> Óptima</span><span><i className="amber" /> Observar</span><span><i className="blue" /> Regando</span></div>
          </div>
          <div className="zone-grid">
            {zones.map((zone) => (
              <article className={`zone-card ${zone.tone}`} key={zone.id}>
                <div className="zone-head">
                  <span className="zone-letter">{zone.id}</span>
                  <div><small>ZONA {zone.id}</small><h3>{zone.crop}</h3></div>
                  <span className={`pill ${zone.tone}`}>{zone.state}</span>
                </div>
                <div className="moisture-row">
                  <div><small>HUMEDAD DEL SUELO</small><strong>{zone.moisture}<sup>%</sup></strong><span>Objetivo {zone.min}–{zone.max}%</span></div>
                  <MiniBars values={zone.history} />
                </div>
                <div className="zone-details">
                  <div><small>TEMP. SUELO</small><strong>{zone.soilTemp.toFixed(1).replace(".", ",")} °C</strong></div>
                  <div><small>AGUA HOY</small><strong>{zone.dailyLiters.toFixed(1).replace(".", ",")} / {zone.dailyLimit.toFixed(1).replace(".", ",")} L</strong></div>
                </div>
                <button className="water-button" onClick={() => setSelectedZone(zone)} disabled={systemPaused}>
                  <span>⌁</span> Regar 0,40 L
                </button>
              </article>
            ))}
          </div>
        </div>

        <aside className="decision-card">
          <span className="eyebrow light">DECISIÓN AUTÓNOMA</span>
          <h2>El sistema explica<br />por qué actúa.</h2>
          <div className="decision-score"><strong>{activeZone ? "7" : "0"}</strong><span><b>puntos</b><small>de déficit detectado</small></span></div>
          <ul>
            <li><i>✓</i><span><b>Suelo bajo el umbral</b><small>Zona A: 38% · mínimo 45%</small></span></li>
            <li><i>✓</i><span><b>Tanque suficiente</b><small>{telemetry.tankLevel}% disponible</small></span></li>
            <li><i>✓</i><span><b>Presión y energía estables</b><small>{telemetry.pressureBar.toFixed(1)} bar · batería {telemetry.batteryPct}%</small></span></li>
            <li><i>✓</i><span><b>Dentro del límite diario</b><small>1,4 de 3,0 litros utilizados</small></span></li>
          </ul>
          <p className="decision-note"><span>i</span> Las protecciones físicas siempre tienen prioridad sobre una orden remota.</p>
        </aside>
      </section>

      <section className="lower-grid">
        <article className="resource-card">
          <div className="section-title compact"><div><span className="eyebrow">RECURSOS</span><h2>Agua y energía</h2></div><span className="healthy">Todo saludable</span></div>
          <div className="resource-content">
            <Donut value={telemetry.tankLevel} label="Tanque" />
            <Donut value={telemetry.batteryPct} label="Batería" />
            <div className="energy-facts">
              <div><small>PRODUCCIÓN SOLAR</small><strong>{telemetry.solarWatts} W</strong><span>cargando</span></div>
              <div><small>TENSIÓN</small><strong>{telemetry.batteryVoltage.toFixed(1).replace(".", ",")} V</strong><span>normal</span></div>
              <div><small>AUTONOMÍA EST.</small><strong>31 h</strong><span>con reserva</span></div>
            </div>
          </div>
        </article>

        <article className="activity-card">
          <div className="section-title compact"><div><span className="eyebrow">BITÁCORA</span><h2>Actividad reciente</h2></div><button onClick={() => setActiveView("Historial")}>Ver todo →</button></div>
          <div className="event-list">
            {events.map((event) => (
              <div className="event" key={`${event.time}-${event.title}`}>
                <time>{event.time}</time><i className={event.type} /><span><strong>{event.title}</strong><small>{event.detail}</small></span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <footer>
        <div><img className="footer-logo" src="/logo-uef-samborondon.jpeg" alt="" /><strong>1.0</strong><span>Sistema de riego inteligente · Unidad Educativa Fiscal Samborondón</span></div>
        <p>Control local autónomo + supervisión web segura</p>
      </footer>

      {selectedZone && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedZone(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <span className="modal-icon">⌁</span>
            <span className="eyebrow">ORDEN REMOTA PROTEGIDA</span>
            <h2 id="modal-title">Regar Zona {selectedZone.id}</h2>
            <p>Se solicitará un pulso de <strong>0,40 litros</strong> para {selectedZone.crop}. El controlador volverá a validar tanque, batería, caudal, presión y límite diario antes de activar la bomba.</p>
            <div className="safety-checks"><span>✓ Tanque {telemetry.tankLevel}%</span><span>✓ Batería {telemetry.batteryPct}%</span><span>✓ Límite disponible</span></div>
            <div className="modal-actions"><button onClick={() => setSelectedZone(null)}>Cancelar</button><button className="primary" onClick={() => void confirmWatering(selectedZone)}>Confirmar riego</button></div>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </main>
  );
}
