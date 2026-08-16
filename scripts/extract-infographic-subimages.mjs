import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDir = path.join(root, "public", "infografias");
const outputDir = path.join(sourceDir, "subimagenes");

const groups = [
  {
    slug: "02-estructural",
    source: "02-kit-estructural.webp",
    crops: [
      ["2.1 Bastidor de la cama", 15, 70, 572, 455], ["2.2 Tornillos y fijaciones", 594, 70, 324, 455],
      ["2.3 Patas niveladoras", 15, 532, 207, 352], ["2.4 Membrana impermeable", 228, 532, 240, 352], ["2.5 Geotextil", 475, 532, 214, 352], ["2.6 Capa de drenaje", 696, 532, 221, 352],
      ["2.7 Salida de drenaje", 15, 891, 207, 300], ["2.8 Divisores de zona", 228, 891, 217, 300], ["2.9 Sustrato", 452, 891, 230, 300], ["2.10 Bandeja de contención", 689, 891, 228, 300],
      ["2.11 Soporte técnico vertical", 15, 1199, 420, 190], ["2.12 Letreros de identificación", 442, 1199, 475, 190],
    ],
  },
  {
    slug: "03-hidraulico",
    source: "03-kit-hidraulico.webp",
    crops: [
      ["3.1 Tanque de agua con tapa", 5, 68, 273, 302], ["3.2 Pasamuros del tanque", 279, 68, 210, 302], ["3.3 Válvula manual de bola", 490, 68, 204, 302], ["3.4 Filtro de 120 mesh", 695, 68, 233, 302],
      ["3.5 Manguera de succión", 5, 373, 192, 287], ["3.6 Bomba de diafragma", 198, 373, 222, 287], ["3.7 Soportes antivibración", 421, 373, 172, 287], ["3.8 Abrazaderas", 594, 373, 156, 287], ["3.9 Válvula antirretorno", 751, 373, 177, 287],
      ["3.10 Regulador de presión", 5, 663, 193, 296], ["3.11 Manómetro mecánico", 199, 663, 223, 296], ["3.12 Sensor de presión", 423, 663, 168, 296], ["3.13 Caudalímetro Hall", 592, 663, 189, 296], ["3.14 Colector de tres salidas", 782, 663, 146, 296],
      ["3.15 Electroválvulas", 5, 963, 241, 233], ["3.16 Tubería principal", 247, 963, 176, 233], ["3.17 Microtubo", 424, 963, 169, 233], ["3.18 Microaspersores", 594, 963, 168, 233], ["3.19 Estacas para emisores", 763, 963, 165, 233],
      ["3.20 Conectores hidráulicos", 5, 1200, 485, 195], ["3.21 Cinta PTFE y sellador", 491, 1200, 229, 195], ["3.22 Sujetadores de tubería", 721, 1200, 207, 195],
    ],
  },
  {
    slug: "04-sensores",
    source: "04-kit-sensores.webp",
    crops: [
      ["4.1 Sensores de humedad", 5, 70, 375, 405], ["4.2 Conversor ADS1115", 380, 70, 260, 405], ["4.3 Alimentación conmutada", 640, 70, 288, 405],
      ["4.4 Sensores DS18B20", 5, 475, 375, 350], ["4.5 Sensor BME280", 380, 475, 260, 350], ["4.6 Garita ambiental", 640, 475, 288, 350],
      ["4.7 Sensor ultrasónico", 5, 825, 310, 260], ["4.8 Flotador inferior", 315, 825, 310, 260], ["4.9 Flotador superior", 625, 825, 303, 260],
      ["4.10 Sensor INA260", 5, 1085, 310, 265], ["4.11 Medición de batería", 315, 1085, 310, 265], ["4.12 Pluviómetro", 625, 1085, 303, 265],
    ],
  },
  {
    slug: "05-control",
    source: "05-kit-control-electronico.webp",
    crops: [
      ["5.1 ESP32 DevKit", 10, 115, 735, 310], ["5.2 Reloj DS3231", 10, 435, 225, 350], ["5.3 Batería del RTC", 240, 435, 225, 350], ["5.4 Memoria NVS", 470, 435, 195, 350], ["5.5 Módulo microSD", 670, 435, 253, 350],
      ["5.6 Pantalla OLED", 10, 795, 285, 245], ["5.7 Expansor MCP23017", 300, 795, 295, 245], ["5.8 Botón automático manual", 600, 795, 323, 245],
      ["5.9 Botones de prueba", 10, 1045, 225, 235], ["5.10 Indicadores LED", 240, 1045, 225, 235], ["5.11 Zumbador", 470, 1045, 205, 235], ["5.12 Watchdog", 680, 1045, 243, 235],
    ],
  },
  {
    slug: "06-potencia",
    source: "06-kit-potencia-electrica.webp",
    crops: [
      ["6.1 Módulos MOSFET", 10, 98, 340, 274], ["6.2 Resistencias de compuerta", 355, 98, 270, 274], ["6.3 Resistencias pull-down", 630, 98, 293, 274],
      ["6.4 Diodos de rueda libre", 10, 378, 340, 285], ["6.5 Relé o contactor DC", 355, 378, 270, 285], ["6.6 Parada de emergencia", 630, 378, 293, 285],
      ["6.7 Diodo TVS", 10, 670, 275, 250], ["6.8 Condensadores", 290, 670, 330, 250], ["6.9 Convertidor DC-DC", 625, 670, 298, 250],
      ["6.10 Fusible de control", 10, 928, 300, 212], ["6.11 Fusible de válvulas", 315, 928, 300, 212], ["6.12 Fusible de bomba", 620, 928, 303, 212],
    ],
  },
  {
    slug: "07-solar",
    source: "07-kit-energia-solar.webp",
    crops: [
      ["7.1 Panel solar", 5, 105, 185, 380], ["7.2 Estructura del panel", 190, 105, 185, 380], ["7.3 Cable solar", 375, 105, 185, 380], ["7.4 Conectores MC4", 560, 105, 185, 380], ["7.5 Controlador de carga", 745, 105, 183, 380],
      ["7.6 Batería AGM", 5, 485, 290, 315], ["7.7 Bandeja y correa", 295, 485, 195, 315], ["7.8 Fusible principal", 490, 485, 145, 315], ["7.9 Seccionador principal", 635, 485, 145, 315], ["7.10 Protección de polaridad", 780, 485, 148, 315],
      ["7.11 Barras de distribución", 5, 800, 300, 315], ["7.12 Router o módem 4G", 305, 800, 180, 315], ["7.13 Presupuesto energético", 485, 800, 443, 315],
    ],
  },
  {
    slug: "08-cableado",
    source: "08-kit-cableado.webp",
    crops: [
      ["8.1 Caja IP65", 5, 100, 230, 385], ["8.2 Placa de montaje", 235, 100, 230, 385], ["8.3 Borneras", 465, 100, 230, 385], ["8.4 Prensaestopas", 695, 100, 233, 385],
      ["8.5 Cable de potencia", 5, 485, 230, 315], ["8.6 Código de colores", 235, 485, 230, 315], ["8.7 Terminales de anillo", 465, 485, 230, 315], ["8.8 Punteras o ferrules", 695, 485, 233, 315],
      ["8.9 Conectores impermeables", 5, 800, 230, 320], ["8.10 Tubo termorretráctil", 235, 800, 230, 320], ["8.11 Canaleta y manguera", 465, 800, 230, 320], ["8.12 Cable apantallado", 695, 800, 233, 320],
      ["8.13 Bridas resistentes UV", 5, 1120, 230, 275], ["8.14 Etiquetas", 235, 1120, 315, 275],
    ],
  },
  {
    slug: "10-comunicaciones",
    source: "10-kit-comunicaciones.webp",
    crops: [
      ["10.1 Red Wi-Fi", 7, 99, 285, 330], ["10.2 Certificado TLS", 293, 99, 286, 330], ["10.3 Token del dispositivo", 580, 99, 346, 330],
      ["10.4 Firmware del ESP32", 7, 433, 919, 327],
      ["10.5 API web", 7, 765, 213, 373], ["10.6 Base de datos", 221, 765, 337, 373], ["10.7 Aplicativo web", 560, 765, 366, 373],
    ],
  },
];

await fs.rm(outputDir, { recursive: true, force: true });

let total = 0;
for (const group of groups) {
  const groupDir = path.join(outputDir, group.slug);
  await fs.mkdir(groupDir, { recursive: true });
  const source = path.join(sourceDir, group.source);

  for (let index = 0; index < group.crops.length; index += 1) {
    const [label, left, top, width, height] = group.crops[index];
    const filename = `${String(index + 1).padStart(2, "0")}.webp`;
    await sharp(source)
      .extract({ left, top, width, height })
      .resize({ width: 440, height: 440, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 72, effort: 5 })
      .toFile(path.join(groupDir, filename));
    total += 1;
    process.stdout.write(`Extraída ${group.slug}/${filename}: ${label}\n`);
  }
}

process.stdout.write(`Subimágenes generadas: ${total}\n`);
