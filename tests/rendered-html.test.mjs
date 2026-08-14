import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the complete institutional project", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="es">/i);
  assert.match(html, /Sistema de Riego Inteligente \| U\. E\. Fiscal Samborondón/i);
  assert.match(html, /Unidad Educativa Fiscal Samborondón/i);
  assert.match(html, /Así piensa el sistema/i);
  assert.match(html, /Visión macro/i);
  assert.match(html, /Informe_general_Sistema_de_Riego_Inteligente\.docx/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("includes project interactions and presentation assets", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const pkg = await readFile(new URL("../package.json", import.meta.url), "utf8");

  assert.match(page, /runCycle/);
  assert.match(page, /simulateDrySoil/);
  assert.match(page, /setArea/);
  assert.doesNotMatch(pkg, /react-loading-skeleton/);

  await Promise.all([
    access(new URL("../public/logo-institucion.jpeg", import.meta.url)),
    access(new URL("../public/proyecto-frontal.png", import.meta.url)),
    access(new URL("../public/proyecto-isometrico.png", import.meta.url)),
    access(new URL("../public/estacion-solar.png", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/Informe_general_Sistema_de_Riego_Inteligente.docx", import.meta.url)),
  ]);
});
