import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "docs", "DESCRIPCION-DETALLADA-DE-TODOS-LOS-COMPONENTES.md");
const implementationSource = resolve(root, "docs", "GUIA-DE-IMPLEMENTACION-PASO-A-PASO.md");
const target = resolve(root, "app", "generated-project-content.ts");
const publicTarget = resolve(root, "public", "documentacion-componentes.md");
const publicImplementationTarget = resolve(root, "public", "guia-implementacion.md");
const markdown = await readFile(source, "utf8");
const implementationMarkdown = await readFile(implementationSource, "utf8");
const banner = "// Archivo generado automáticamente. No editar directamente.\n";

await Promise.all([
  writeFile(target, `${banner}export const projectDocumentation = ${JSON.stringify(markdown)};\n`, "utf8"),
  writeFile(publicTarget, markdown, "utf8"),
  writeFile(publicImplementationTarget, implementationMarkdown, "utf8"),
]);

console.log("Contenido técnico sincronizado.");
