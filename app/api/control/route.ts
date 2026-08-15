import { desc, eq } from "drizzle-orm";
import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { auditEvents, commands, telemetry, zoneConfig } from "../../../db/schema";

type ControlPayload = { zoneId?: string; action?: string; volumeMl?: number };

function isLocalRequest(request: Request) {
  const hostname = new URL(request.url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user && !isLocalRequest(request)) return Response.json({ error: "Se requiere una sesión autorizada." }, { status: 401 });

  const payload = (await request.json()) as ControlPayload;
  const zoneId = payload.zoneId?.toUpperCase();
  const volumeMl = Math.round(Number(payload.volumeMl));
  if (!zoneId || !["A", "B", "C"].includes(zoneId) || payload.action !== "water" || !Number.isFinite(volumeMl) || volumeMl < 100 || volumeMl > 1000) {
    return Response.json({ error: "Orden de riego inválida." }, { status: 400 });
  }

  try {
    const db = getDb();
    const [latest] = await db.select().from(telemetry).orderBy(desc(telemetry.id)).limit(1);
    const [config] = await db.select().from(zoneConfig).where(eq(zoneConfig.zoneId, zoneId)).limit(1);
    if (!latest) return Response.json({ error: "No hay telemetría del controlador. La orden fue bloqueada." }, { status: 409 });
    const ageMs = Date.now() - Date.parse(latest.receivedAt.replace(" ", "T") + "Z");
    const blockers = [
      ageMs > 5 * 60_000 ? "telemetría desactualizada" : "",
      latest.tankLevel < 15 ? "nivel crítico del tanque" : "",
      latest.batteryPct < 20 || latest.batteryVoltage < 11.8 ? "batería baja" : "",
      !config?.enabled ? "zona deshabilitada" : "",
      config && volumeMl > config.pulseMl ? "volumen superior al pulso autorizado" : "",
    ].filter(Boolean);
    if (blockers.length) {
      await db.insert(auditEvents).values({ category: "control", severity: "warning", message: `Orden bloqueada para zona ${zoneId}: ${blockers.join(", ")}`, actor: user?.email ?? "operador-local" });
      return Response.json({ error: `Orden bloqueada: ${blockers.join(", ")}.` }, { status: 409 });
    }

    const commandId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 2 * 60_000).toISOString();
    const actor = user?.email ?? "operador-local";
    await db.insert(commands).values({ commandId, deviceId: latest.deviceId, zoneId, action: "water", volumeMl, requestedBy: actor, expiresAt });
    await db.insert(auditEvents).values({ category: "control", severity: "info", message: `Riego remoto solicitado: zona ${zoneId}, ${volumeMl} ml`, actor });
    return Response.json({ commandId, status: "pending", expiresAt }, { status: 202 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo registrar la orden" }, { status: 500 });
  }
}
