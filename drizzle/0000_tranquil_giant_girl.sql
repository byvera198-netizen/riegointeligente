CREATE TABLE `audit_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category` text NOT NULL,
	`severity` text NOT NULL,
	`message` text NOT NULL,
	`actor` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_events_created` ON `audit_events` (`created_at`);--> statement-breakpoint
CREATE TABLE `commands` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`command_id` text NOT NULL,
	`device_id` text NOT NULL,
	`zone_id` text NOT NULL,
	`action` text NOT NULL,
	`volume_ml` integer NOT NULL,
	`requested_by` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`status_detail` text,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`acknowledged_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_commands_command_id` ON `commands` (`command_id`);--> statement-breakpoint
CREATE INDEX `idx_commands_device_status_created` ON `commands` (`device_id`,`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `telemetry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`device_id` text NOT NULL,
	`tank_level` real NOT NULL,
	`battery_voltage` real NOT NULL,
	`battery_pct` real NOT NULL,
	`solar_watts` real NOT NULL,
	`pressure_bar` real NOT NULL,
	`flow_lpm` real NOT NULL,
	`ambient_temp` real NOT NULL,
	`ambient_humidity` real NOT NULL,
	`recorded_at` text NOT NULL,
	`received_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_telemetry_device_received` ON `telemetry` (`device_id`,`received_at`);--> statement-breakpoint
CREATE TABLE `zone_config` (
	`zone_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`crop` text NOT NULL,
	`min_moisture` real NOT NULL,
	`max_moisture` real NOT NULL,
	`pulse_ml` integer DEFAULT 400 NOT NULL,
	`max_daily_ml` integer NOT NULL,
	`cooldown_minutes` integer DEFAULT 15 NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `zone_readings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`telemetry_id` integer NOT NULL,
	`zone_id` text NOT NULL,
	`moisture_pct` real NOT NULL,
	`soil_temp` real NOT NULL,
	`daily_liters` real DEFAULT 0 NOT NULL,
	`sensor_valid` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`telemetry_id`) REFERENCES `telemetry`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_zone_readings_telemetry_zone` ON `zone_readings` (`telemetry_id`,`zone_id`);
--> statement-breakpoint
INSERT INTO `zone_config` (`zone_id`, `name`, `crop`, `min_moisture`, `max_moisture`, `pulse_ml`, `max_daily_ml`, `cooldown_minutes`, `enabled`)
VALUES
  ('A', 'Zona A', 'Tomate', 45, 68, 400, 3000, 15, 1),
  ('B', 'Zona B', 'Lechuga', 50, 72, 350, 2400, 10, 1),
  ('C', 'Zona C', 'Pimiento', 44, 66, 400, 2800, 15, 1);
--> statement-breakpoint
INSERT INTO `audit_events` (`category`, `severity`, `message`, `actor`)
VALUES ('system', 'info', 'Base de datos del Sistema de riego inteligente 1.0 inicializada', 'system');
--> statement-breakpoint
PRAGMA optimize;
