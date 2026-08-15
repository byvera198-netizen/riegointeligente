import { env } from "cloudflare:workers";
import { getDb } from "../../../../db";
import { auditEvents, telemetry, zoneReadings } from "../../../../db/schema";

type ZonePayload = { zoneId?: string; moisturePct?: number; soilTemp?: number; dailyLiters?: number; sensorValid?: boolean };
type TelemetryPayload = {
  deviceId?: string; recordedAt?: string; tankLevel?: number; batteryVoltage?: number; batteryPct?: number;
  solarWatts?: number; pressureBar?: number; flowLpm?: number; ambientTemp?: number; ambientHumidity?: number; zones?: ZonePayload[];
};

function authorized(request: Request) {
  const expected = (env as unknown as { DEVICE_API_TOKEN?: string }).DEVICE_API_TOKEN;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return Boolean(expected && supplied && supplied === expected);
}

function finite(value: unknown, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Dispositivo no autorizado." }, { status: 401 });
  const data = (await request.json()) as TelemetryPayload;
  const valid = data.deviceId && finite(data.tankLevel, 0, 100) && finite(data.batteryVoltage, 0, 20) &&
    finite(data.batteryPct, 0, 100) && finite(data.solarWatts, 0, 1000) && finite(data.pressureBar, 0, 10) &&
    finite(data.flowLpm, 0, 30) && finite(data.ambientTemp, -20, 70) && finite(data.ambientHumidity, 0, 100) &&
    Array.isArray(data.zones) && data.zones.length === 3;
  if (!valid) return Response.json({ error: "Telemetría incompleta o fuera de rango." }, { status: 400 });

  const validZones = data.zones!.filter((zone) => zone.zoneId && finite(zone.moisturePct, 0, 100) && finite(zone.soilTemp, -10, 70));
  if (validZones.length !== 3) return Response.json({ error: "Las tres zonas deben incluir lecturas válidas." }, { status: 400 });

  const db = getDb();
  const [sample] = await db.insert(telemetry).values({
    deviceId: data.deviceId!, recordedAt: data.recordedAt ?? new Date().toISOString(), tankLevel: data.tankLevel!,
    batteryVoltage: data.batteryVoltage!, batteryPct: data.batteryPct!, solarWatts: data.solarWatts!,
    pressureBar: data.pressureBar!, flowLpm: data.flowLpm!, ambientTemp: data.ambientTemp!, ambientHumidity: data.ambientHumidity!,
  }).returning({ id: telemetry.id });

  const readings = validZones.map((zone) => ({
    telemetryId: sample.id, zoneId: zone.zoneId!.toUpperCase(), moisturePct: zone.moisturePct!, soilTemp: zone.soilTemp!,
    dailyLiters: finite(zone.dailyLiters, 0, 1000) ? zone.dailyLiters! : 0, sensorValid: zone.sensorValid !== false,
  }));
  await db.insert(zoneReadings).values(readings);
  if (data.tankLevel! < 15 || data.batteryPct! < 20) {
    await db.insert(auditEvents).values({ category: "safety", severity: "critical", message: data.tankLevel! < 15 ? "Nivel crítico del tanque" : "Batería en nivel protegido", actor: data.deviceId! });
  }
  return Response.json({ accepted: true, telemetryId: sample.id }, { status: 201 });
}
