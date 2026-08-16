import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: {
      accept: "text/html",
      "oai-authenticated-user-id": "test-user",
      "oai-authenticated-user-email": "pruebas@uefs.edu.ec",
    } }),
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
  assert.match(html, /Ocho kits que funcionan como un solo equipo/);
  assert.match(html, /Catálogo fotográfico interactivo/);
  assert.match(html, /Panel solar de 150 W/);
  assert.match(html, /Batería AGM 12 V 55 Ah/);
  assert.match(html, /Lista de materiales del prototipo/);
  assert.match(html, /ESP32 DevKit/);
  assert.match(html, /INA260/);
  assert.match(html, /Medición solar hasta 36 V\/15 A/);
  assert.match(html, /Proyecto terminado y completamente integrado/);
  assert.match(html, /La web supervisa y solicita; el ESP32 decide/);
  assert.match(html, /Monitorear sistema/);
  assert.match(html, /Regar 0,40 L/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/);
});

test("incluye las protecciones críticas en la interfaz", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /Tanque suficiente/);
  assert.match(html, /Presión y energía estables/);
  assert.match(html, /límite diario/i);
  assert.match(html, /La protección física siempre tiene prioridad/i);
});

test("muestra con imagen y ficha los componentes de todos los kits", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /Catálogo completo del proyecto/);
  assert.match(html, /24/);
  assert.match(html, /Bomba de diafragma 12 V/);
  assert.match(html, /Electroválvulas 12 V NC/);
  assert.match(html, /Microaspersores regulables/);
  assert.match(html, /Panel solar de 150 W/);
  assert.match(html, /Controlador de carga solar/);
  assert.match(html, /Batería AGM 12 V 55 Ah/);
  assert.match(html, /MOSFET de potencia/);
  assert.match(html, /Protecciones eléctricas/);
  assert.match(html, /Convertidor 12 V → 5 V/);
  assert.match(html, /Caja IP65/);
  assert.match(html, /Wi‑Fi \+ API \+ base de datos \+ aplicativo web/);
});

test("integra el manual completo y la navegación institucional", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /Kit de energía solar/);
  assert.match(html, /Tornillos, pernos, tuercas y arandelas/);
  assert.match(html, /Herramientas y consumibles de montaje/);
  assert.match(html, /Buscar en el manual técnico/);
  assert.match(html, /href="#componentes"/);
  assert.match(html, /href="#funcionamiento"/);
  assert.match(html, /href="#documentacion"/);
});

test("integra las infografías en su contexto y muestra sus validaciones", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /Infografías técnicas por kit/);
  assert.match(html, /Energía, datos y circulación del agua/);
  assert.match(html, /Plano de conexiones — versión principal/);
  assert.match(html, /batería de 7 Ah dibujada es ilustrativa/);
  assert.match(html, /No debe emplearse para cablear/);
  assert.match(html, /Referencia de ampliación hidráulica/);
  assert.match(html, /infografias\/10-kit-comunicaciones\.webp/);
});

test("presenta subimágenes independientes y fotografías coherentes en el catálogo", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /147 recortes independientes/);
  assert.match(html, /Cada elemento de todas las infografías, por separado/);
  assert.match(html, /subimage-open-button/);
  assert.match(html, /Ver sus/);
  assert.match(html, /infografias\/subimagenes\/02-estructural\/01\.webp/);
  assert.ok(existsSync(new URL("../public/infografias/subimagenes/flujo-energia/01.webp", import.meta.url)));
  assert.ok(existsSync(new URL("../public/infografias/subimagenes/09-conexiones-principal/01.webp", import.meta.url)));
  assert.match(html, /materiales\/panel-solar-150w\.webp/);
  assert.match(html, /materiales\/esp32-devkit\.webp/);
});
