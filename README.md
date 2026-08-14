# Sistema de Riego Inteligente

Proyecto educativo de la **Unidad Educativa Fiscal Samborondón** que integra agricultura de precisión, automatización por microzonas y alimentación mediante energía solar.

![Presentación del Sistema de Riego Inteligente](public/og.png)

## Visión del proyecto

La maqueta funcional mide **1 metro de ancho por 2 metros de largo** y representa tres zonas agrícolas independientes:

- Zona A: tomate.
- Zona B: lechuga.
- Zona C: pimiento.

Cada zona utiliza un sensor capacitivo de humedad. El controlador ESP32 compara las lecturas con umbrales configurables, identifica la mayor necesidad hídrica y activa únicamente el canal correspondiente. Después de cada pulso se aplica un periodo de estabilización para evitar decisiones repetitivas y exceso de agua.

La maqueta sirve como unidad mínima de una arquitectura escalable hacia plantaciones agrícolas, donde las microzonas evolucionan a sectores hidráulicos, válvulas de campo y estaciones remotas.

## Página interactiva

La experiencia web incluye:

- Simulador de humedad para las tres zonas.
- Priorización automática del sector con mayor déficit.
- Protección por nivel bajo del tanque.
- Simulación de sequía y ciclos de riego.
- Selector conceptual de escala agrícola por hectáreas.
- Arquitectura energética y electrónica.
- Guía resumida de instalación y puesta en marcha.
- Galería del prototipo final.
- Descarga del informe general del proyecto.

Sitio publicado: [sistema-riego-inteligente-samborondon.eemite.chatgpt.site](https://sistema-riego-inteligente-samborondon.eemite.chatgpt.site)

> El sitio está configurado con acceso privado y puede solicitar autenticación con ChatGPT.

## Arquitectura técnica

- **Control:** ESP32.
- **Sensado:** tres sensores capacitivos de humedad y sensor de nivel.
- **Actuación:** tres bombas o canales de potencia independientes mediante MOSFET.
- **Energía:** panel solar, controlador de carga, batería AGM elevada y convertidor DC–DC.
- **Interfaz:** pantalla local y panel web dinámico.
- **Seguridad:** fusibles, canaletas, caja protegida y separación entre agua, potencia y señales.

El núcleo trabaja en corriente continua: bombas de 12 V y conversión a 5 V para el ESP32. El inversor del kit se conserva como salida auxiliar.

## Ejecutar localmente

Requiere Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000` en el navegador.

## Verificación

```bash
npm run lint
npm test
```

`npm test` genera la compilación de producción y comprueba el contenido institucional, las interacciones principales y la presencia de los recursos de presentación.

## Estructura principal

```text
app/
  page.tsx          Experiencia interactiva
  globals.css       Diseño premium y adaptación móvil
public/
  og.png            Portada institucional
  proyecto-*.png    Visualizaciones del prototipo
  estacion-solar.png
  logo-institucion.jpeg
  Informe_general_Sistema_de_Riego_Inteligente.docx
tests/
  rendered-html.test.mjs
```

## Validación responsable

El proyecto evita afirmar porcentajes de ahorro antes de medirlos. Su impacto se demuestra registrando lecturas, litros aplicados, uniformidad por zona, autonomía energética y respuesta de los cultivos durante ensayos comparativos.

---

**Unidad Educativa Fiscal Samborondón · Samborondón, Ecuador · 2026**
