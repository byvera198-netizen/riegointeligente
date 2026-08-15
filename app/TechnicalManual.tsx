"use client";

import { Fragment, useMemo, useState } from "react";
import { projectDocumentation } from "./generated-project-content";

type ManualSection = {
  id: string;
  title: string;
  body: string;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function splitSections(markdown: string): ManualSection[] {
  return markdown
    .split(/\n(?=# )/)
    .map((block) => {
      const lines = block.trim().split("\n");
      const title = lines[0].replace(/^#\s+/, "").trim();
      return { id: slugify(title), title, body: lines.slice(1).join("\n").trim() };
    })
    .filter((section) => section.title);
}

function renderInline(text: string, keyPrefix: string) {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(pattern);
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={key}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const isPublicLink = link[2].startsWith("http") || link[2].startsWith("/");
      return isPublicLink ? <a key={key} href={link[2]} target={link[2].startsWith("http") ? "_blank" : undefined} rel="noreferrer">{link[1]}</a> : <span key={key}>{link[1]}</span>;
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

function MarkdownBlocks({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trimEnd();
    if (!line.trim()) { index += 1; continue; }
    if (line.trim() === "---") { blocks.push(<hr key={`hr-${index}`} />); index += 1; continue; }

    if (line.startsWith("```")) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) { code.push(lines[index]); index += 1; }
      blocks.push(<pre key={`code-${index}`}><code>{code.join("\n")}</code></pre>);
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      const Heading = heading[1].length === 2 ? "h3" : "h4";
      blocks.push(<Heading key={`heading-${index}`}>{renderInline(heading[2], `heading-${index}`)}</Heading>);
      index += 1;
      continue;
    }

    if (line.startsWith("|") && index + 1 < lines.length && /^\|?[\s:|-]+\|?$/.test(lines[index + 1].trim())) {
      const tableLines = [line];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) { tableLines.push(lines[index].trim()); index += 1; }
      const rows = tableLines.map((row) => row.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
      blocks.push(
        <div className="manual-table-wrap" key={`table-${index}`}>
          <table>
            <thead><tr>{rows[0].map((cell, cellIndex) => <th key={cellIndex}>{renderInline(cell, `th-${index}-${cellIndex}`)}</th>)}</tr></thead>
            <tbody>{rows.slice(1).map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{renderInline(cell, `td-${index}-${rowIndex}-${cellIndex}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      const items: string[] = [];
      const expression = unordered ? /^[-*]\s+(.+)$/ : /^\d+\.\s+(.+)$/;
      while (index < lines.length) {
        const match = lines[index].trim().match(expression);
        if (!match) break;
        items.push(match[1]);
        index += 1;
      }
      const List = unordered ? "ul" : "ol";
      blocks.push(<List key={`list-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item, `li-${index}-${itemIndex}`)}</li>)}</List>);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length) {
      const next = lines[index].trim();
      if (!next || /^(#{2,3})\s+/.test(next) || next === "---" || next.startsWith("```") || next.startsWith("|") || /^[-*]\s+/.test(next) || /^\d+\.\s+/.test(next)) break;
      paragraph.push(next);
      index += 1;
    }
    blocks.push(<p key={`p-${index}`}>{renderInline(paragraph.join(" "), `p-${index}`)}</p>);
  }

  return <div className="manual-content">{blocks}</div>;
}

const sections = splitSections(projectDocumentation);

export default function TechnicalManual() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("es");
  const visibleSections = useMemo(() => normalizedQuery
    ? sections.filter((section) => `${section.title} ${section.body}`.toLocaleLowerCase("es").includes(normalizedQuery))
    : sections, [normalizedQuery]);

  return (
    <div className="manual-shell">
      <div className="manual-toolbar">
        <label>
          <span>Buscar en el manual técnico</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej.: bomba, fusible, sensor, mantenimiento…" type="search" />
        </label>
        <div><strong>{visibleSections.length}</strong><span>secciones encontradas</span></div>
        <a href="/documentacion-componentes.md" download>Descargar documento</a>
      </div>
      <div className="manual-index" aria-label="Índice del manual">
        {sections.slice(1).map((section, index) => <a key={section.id} href={`#manual-section-${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title.replace(/^\d+\.\s*/, "")}</a>)}
      </div>
      <div className="manual-sections">
        {visibleSections.map((section, index) => (
          <details id={`manual-section-${section.id}`} key={section.id} open={Boolean(normalizedQuery) || index === 0}>
            <summary><span>{String(sections.findIndex((item) => item.id === section.id) + 1).padStart(2, "0")}</span><strong>{section.title}</strong><i aria-hidden="true">+</i></summary>
            <MarkdownBlocks markdown={section.body} />
          </details>
        ))}
        {!visibleSections.length && <div className="manual-empty"><strong>Sin resultados</strong><p>Prueba con el nombre de un kit, sensor, conexión o fase del proyecto.</p></div>}
      </div>
    </div>
  );
}
