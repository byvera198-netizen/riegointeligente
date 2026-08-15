import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const telemetry = sqliteTable("telemetry", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  deviceId: text("device_id").notNull(),
  tankLevel: real("tank_level").notNull(),
  batteryVoltage: real("battery_voltage").notNull(),
  batteryPct: real("battery_pct").notNull(),
  solarWatts: real("solar_watts").notNull(),
  pressureBar: real("pressure_bar").notNull(),
  flowLpm: real("flow_lpm").notNull(),
  ambientTemp: real("ambient_temp").notNull(),
  ambientHumidity: real("ambient_humidity").notNull(),
  recordedAt: text("recorded_at").notNull(),
  receivedAt: text("received_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_telemetry_device_received").on(table.deviceId, table.receivedAt)]);

export const zoneReadings = sqliteTable("zone_readings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  telemetryId: integer("telemetry_id").notNull().references(() => telemetry.id, { onDelete: "cascade" }),
  zoneId: text("zone_id").notNull(),
  moisturePct: real("moisture_pct").notNull(),
  soilTemp: real("soil_temp").notNull(),
  dailyLiters: real("daily_liters").notNull().default(0),
  sensorValid: integer("sensor_valid", { mode: "boolean" }).notNull().default(true),
}, (table) => [index("idx_zone_readings_telemetry_zone").on(table.telemetryId, table.zoneId)]);

export const zoneConfig = sqliteTable("zone_config", {
  zoneId: text("zone_id").primaryKey(),
  name: text("name").notNull(),
  crop: text("crop").notNull(),
  minMoisture: real("min_moisture").notNull(),
  maxMoisture: real("max_moisture").notNull(),
  pulseMl: integer("pulse_ml").notNull().default(400),
  maxDailyMl: integer("max_daily_ml").notNull(),
  cooldownMinutes: integer("cooldown_minutes").notNull().default(15),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const commands = sqliteTable("commands", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  commandId: text("command_id").notNull(),
  deviceId: text("device_id").notNull(),
  zoneId: text("zone_id").notNull(),
  action: text("action").notNull(),
  volumeMl: integer("volume_ml").notNull(),
  requestedBy: text("requested_by").notNull(),
  status: text("status").notNull().default("pending"),
  statusDetail: text("status_detail"),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  acknowledgedAt: text("acknowledged_at"),
}, (table) => [
  uniqueIndex("idx_commands_command_id").on(table.commandId),
  index("idx_commands_device_status_created").on(table.deviceId, table.status, table.createdAt),
]);

export const auditEvents = sqliteTable("audit_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(),
  severity: text("severity").notNull(),
  message: text("message").notNull(),
  actor: text("actor").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_audit_events_created").on(table.createdAt)]);
