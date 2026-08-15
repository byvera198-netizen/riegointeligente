import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renderiza el proyecto institucional completo", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="es">/i);
  assert.match(html, /Sistema de Riego Inteligente \| Unidad Educativa Fiscal Samborondón/i);
  assert.match(html, /Cada componente tiene/i);
  assert.match(html, /Monitoreo interactivo/i);
  assert.match(html, /finca de 200 hectáreas/i);
  assert.match(html, /Informe_general_Sistema_de_Riego_Inteligente\.docx/i);
  assert.doesNotMatch(html, /Sistema de Riego Inteligente 2\.0|codex-preview|Your site is taking shape/i);
});

test("incluye las interacciones y todos los recursos visuales", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /runCycle/);
  assert.match(page, /filteredComponents/);
  assert.match(page, /setGalleryIndex/);
  assert.match(page, /setArea/);
  assert.doesNotMatch(page, /Riego Inteligente 2\.0/i);
  const assets = [
    "logo-institucion.jpeg",
    "01-maqueta-completa.jpg",
    "02-arquitectura-principal.jpg",
    "03-kit-energia-solar.jpg",
    "04-kit-hidraulico.jpg",
    "05-sensores-instrumentacion.jpg",
    "06-electronica-control.jpg",
    "07-conexion-electrica.jpg",
    "08-conexion-hidraulica.jpg",
    "09-estructura-seguridad.jpg",
    "10-control-remoto-web.jpg",
    "og.png",
    "Informe_general_Sistema_de_Riego_Inteligente.docx",
  ];
  await Promise.all(assets.map((asset) => access(new URL(`../public/${asset}`, import.meta.url))));
});
