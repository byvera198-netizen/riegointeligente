import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renderiza el panel del Sistema de riego inteligente 1.0 en español", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Sistema de riego inteligente 1\.0/);
  assert.match(html, /Unidad Educativa Fiscal Samborondón/);
  assert.match(html, /Tres zonas, tres necesidades/);
  assert.match(html, /Regar 0,40 L/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/);
});

test("incluye las protecciones críticas en la interfaz", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /Tanque suficiente/);
  assert.match(html, /Presión y energía estables/);
  assert.match(html, /límite diario/i);
  assert.match(html, /protecciones físicas/i);
});
