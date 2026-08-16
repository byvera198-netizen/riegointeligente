import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const workspace = process.cwd();
const outputDirectory = path.join(workspace, "public", "flujos");
const reportDirectory = path.join(workspace, "work", "report-assets");

const flows = [
  ["C:/Users/bvera/Downloads/Flujo de energia.png", "flujo-energia.webp"],
  ["C:/Users/bvera/Downloads/Flujo de información.png", "flujo-informacion.webp"],
  ["C:/Users/bvera/Downloads/Flujo de Agua.png", "flujo-agua.webp"],
];

await mkdir(outputDirectory, { recursive: true });
await mkdir(reportDirectory, { recursive: true });

for (const [source, filename] of flows) {
  const destination = path.join(outputDirectory, filename);
  await sharp(source)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 86, effort: 6, smartSubsample: true })
    .toFile(destination);
  await sharp(source)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .png({ compressionLevel: 8, adaptiveFiltering: true })
    .toFile(path.join(reportDirectory, filename.replace(/\.webp$/, ".png")));
  process.stdout.write(`Preparado: ${destination}\n`);
}

await sharp(path.join(workspace, "public", "proyecto-final-operativo-ultra-v2.webp"))
  .resize({ width: 1500, withoutEnlargement: true })
  .png({ compressionLevel: 8, adaptiveFiltering: true })
  .toFile(path.join(reportDirectory, "proyecto-final.png"));
