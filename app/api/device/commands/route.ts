import { env } from "cloudflare:workers";
import { and, asc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { auditEvents, commands } from "../../../../db/schema";

function authorized(request: Request) {
  const expected = (env as unknown as { DEVICE_API_TOKEN?: string }).DEVICE_API_TOKEN;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return Boolean(expected && supplied && supplied === expected);
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Dispositivo no autorizado." }, { status: 401 });
  const deviceId = new URL(request.url).searchParams.get("deviceId");
  if (!deviceId) return Response.json({ error: "deviceId es obligatorio." }, { status: 400 });
  const db = getDb();
  const pending = await db.select().from(commands).where(and(eq(commands.deviceId, deviceId), eq(commands.status, "pending"))).orderBy(asc(commands.id)).limit(1);
  const command = pending[0];
  if (command && Date.parse(command.expiresAt) <= Date.now()) {
    await db.update(commands).set({ status: "expired", statusDetail: "Tiempo de ejecución agotado" }).where(eq(commands.id, command.id));
    return Response.json({ command: null });
  }
  return Response.json({ command: command ?? null });
}

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Dispositivo no autorizado." }, { status: 401 });
  const payload = (await request.json()) as { commandId?: string; status?: string; detail?: string; deviceId?: string };
  if (!payload.commandId || !payload.deviceId || !["accepted", "executed", "rejected", "failed"].includes(payload.status ?? "")) return Response.json({ error: "Confirmación inválida." }, { status: 400 });
  const db = getDb();
  const [updated] = await db.update(commands).set({ status: payload.status, statusDetail: payload.detail?.slice(0, 240), acknowledgedAt: new Date().toISOString() }).where(and(eq(commands.commandId, payload.commandId), eq(commands.deviceId, payload.deviceId))).returning();
  if (!updated) return Response.json({ error: "Comando desconocido." }, { status: 404 });
  await db.insert(auditEvents).values({ category: "device", severity: ["accepted", "executed"].includes(payload.status ?? "") ? "info" : "warning", message: `Comando ${payload.commandId}: ${payload.status}${payload.detail ? ` · ${payload.detail}` : ""}`, actor: payload.deviceId });
  return Response.json({ accepted: true });
}
