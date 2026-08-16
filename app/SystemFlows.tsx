"use client";

import { useEffect, useState } from "react";
import { assetPath } from "./asset-path";

type Flow = {
  number: string;
  title: string;
  subtitle: string;
  src: string;
  sequence: string;
  description: string;
  note: string;
};

const flows: Flow[] = [
  {
    number: "01",
    title: "Flujo de energía",
    subtitle: "Generación, almacenamiento y distribución eléctrica",
    src: assetPath("flujos/flujo-energia.webp"),
    sequence: "Panel 150 W → controlador → batería AGM 12 V 55 Ah → fusible y seccionador → barras → ramales",
    description: "La energía solar se regula, se almacena y se reparte en circuitos protegidos e independientes para la bomba, las electroválvulas y la electrónica de control.",
    note: "Corrección oficial: la batería ilustrada de 7 Ah es una referencia gráfica; el proyecto utiliza una AGM de 12 V y 55 Ah.",
  },
  {
    number: "02",
    title: "Flujo de información",
    subtitle: "Medición, decisión autónoma y supervisión remota",
    src: assetPath("flujos/flujo-informacion.webp"),
    sequence: "Sensores → ESP32 → decisión local → actuadores → HTTPS → API → base de datos → aplicativo web",
    description: "El ESP32 interpreta las mediciones y decide localmente. La web supervisa, registra y solicita acciones; toda orden remota vence y debe superar la validación física antes de ejecutarse.",
    note: "La pérdida de Internet no detiene la autonomía ni permite omitir las protecciones del sistema.",
  },
  {
    number: "03",
    title: "Flujo del agua",
    subtitle: "Captación, impulsión, medición y riego por zonas",
    src: assetPath("flujos/flujo-agua.webp"),
    sequence: "Tanque → válvula → filtro → bomba → antirretorno → regulador → presión → caudal → colector → zonas A/B/C",
    description: "El agua atraviesa una cadena hidráulica medible y protegida. El colector entrega el caudal a una sola electroválvula por vez y cada zona recibe dos emisores regulables.",
    note: "El riego solo continúa si nivel, caudal, presión, batería y emergencia permanecen dentro de límites seguros.",
  },
];

const reportDocx = assetPath("informe-completo-sistema-riego-inteligente-1-0.docx");
const reportMarkdown = assetPath("informe-completo-sistema-riego-inteligente-1-0.md");

export default function SystemFlows() {
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);

  useEffect(() => {
    if (!selectedFlow) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedFlow(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selectedFlow]);

  return <>
    <section className="system-flows-section" id="flujos" aria-labelledby="system-flows-title">
      <div className="section system-flows-inner">
        <div className="system-flows-heading">
          <div>
            <span className="eyebrow">Arquitectura completa del sistema</span>
            <h2 id="system-flows-title">Tres flujos que explican cómo funciona el proyecto.</h2>
          </div>
          <p>Energía, información y agua recorren rutas distintas pero coordinadas. Abre cada lámina para verla a tamaño completo o descárgala para usarla en exposiciones y documentación.</p>
        </div>

        <div className="system-flow-grid">
          {flows.map((flow) => <article className="system-flow-card" key={flow.number}>
            <button className="system-flow-image" onClick={() => setSelectedFlow(flow)} aria-label={`Ampliar ${flow.title}`}>
              <img src={flow.src} alt={`${flow.title} del Sistema de riego inteligente 1.0`} loading="lazy" />
              <span>Ampliar lámina ↗</span>
            </button>
            <div className="system-flow-copy">
              <span className="system-flow-number">{flow.number}</span>
              <p className="system-flow-kicker">{flow.subtitle}</p>
              <h3>{flow.title}</h3>
              <p>{flow.description}</p>
              <strong className="system-flow-sequence">{flow.sequence}</strong>
              <small>{flow.note}</small>
              <div className="system-flow-actions">
                <button onClick={() => setSelectedFlow(flow)}>Ver en pantalla</button>
                <a href={flow.src} download>Descargar imagen</a>
              </div>
            </div>
          </article>)}
        </div>

        <div className="report-download-panel">
          <div>
            <span className="report-download-icon">DOCX</span>
            <p><strong>Informe completo y editable del proyecto</strong><small>Documento institucional con arquitectura, componentes, lista de compra, implementación, calibración, seguridad, pruebas, mantenimiento y los tres flujos.</small></p>
          </div>
          <div>
            <a className="button primary" href={reportDocx} download>Descargar informe editable (.docx)</a>
            <a className="button secondary" href={reportMarkdown} download>Descargar texto editable (.md)</a>
          </div>
        </div>
      </div>
    </section>

    {selectedFlow && <div className="flow-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedFlow(null); }}>
      <figure className="flow-modal" role="dialog" aria-modal="true" aria-label={selectedFlow.title}>
        <button className="flow-modal-close" onClick={() => setSelectedFlow(null)} aria-label="Cerrar flujo">×</button>
        <img src={selectedFlow.src} alt={selectedFlow.title} />
        <figcaption><div><strong>{selectedFlow.title}</strong><p>{selectedFlow.sequence}</p></div><a href={selectedFlow.src} download>Descargar imagen</a></figcaption>
      </figure>
    </div>}
  </>;
}
