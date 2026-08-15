import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { auditEvents, commands, telemetry, zoneConfig, zoneReadings } from "../../../db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const [latest] = await db.select().from(telemetry).orderBy(desc(telemetry.id)).limit(1);
    const configs = await db.select().from(zoneConfig);
    const recentEvents = await db.select().from(auditEvents).orderBy(desc(auditEvents.id)).limit(12);
    const recentCommands = await db.select().from(commands).orderBy(desc(commands.id)).limit(8);
    if (!latest) return Response.json({ live: false, zones: [], configs, events: recentEvents, commands: recentCommands });
    const zones = await db.select().from(zoneReadings).where(eq(zoneReadings.telemetryId, latest.id));
    return Response.json({ live: true, updatedAt: latest.receivedAt, telemetry: latest, zones, configs, events: recentEvents, commands: recentCommands });
  } catch (error) {
    return Response.json({ live: false, error: error instanceof Error ? error.message : "No se pudo leer el estado" }, { status: 503 });
  }
}
