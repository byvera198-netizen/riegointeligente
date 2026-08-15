# Protocolo de pruebas de aceptación

**Prototipo:** __________  **Firmware:** __________  **Fecha:** __________  **Responsable:** __________

No marcar “aprobado” por observación informal. Registrar dato medido, evidencia y resultado.

| Nº | Prueba | Procedimiento resumido | Criterio de aprobación | Resultado |
|---:|---|---|---|---|
| 1 | Arranque | Encender 10 veces | Ninguna salida se activa | ☐ |
| 2 | Emergencia | Abrir contacto durante riego | Bomba y válvula se apagan de inmediato | ☐ |
| 3 | Tanque bajo | Accionar flotador inferior | No inicia o detiene la bomba | ☐ |
| 4 | Sensor A/B/C | Seco, húmedo y desconectado | Lectura coherente; desconexión bloquea su zona | ☐ |
| 5 | Identidad térmica | Calentar una sonda por vez | Coincide siempre con A, B o C | ☐ |
| 6 | Aislamiento de zonas | Activar cada zona | Solo abre la válvula solicitada | ☐ |
| 7 | Aforo | Solicitar 0,40 L, tres veces por zona | Error medio ≤ 10 % | ☐ |
| 8 | Caudal nulo | Cerrar suministro durante riego | Detención en ≤ 5 s | ☐ |
| 9 | Obstrucción | Bloquear salida brevemente | Detecta presión alta y detiene | ☐ |
| 10 | Fuga | Abrir una derivación controlada | Detecta presión baja/caudal anormal | ☐ |
| 11 | Tiempo máximo | Desactivar pulsos en banco | Nunca supera 120 s | ☐ |
| 12 | Límite diario | Alcanzar límite de una zona | Rechaza el siguiente pulso | ☐ |
| 13 | Batería baja | Simular valor bajo | No inicia riego; emite alarma | ☐ |
| 14 | Sin internet | Desconectar red 2 h | Continúa medición y riego autónomo | ☐ |
| 15 | Reconexión | Restaurar red | Telemetría vuelve sin intervención | ☐ |
| 16 | Orden vencida | Retener orden más de 2 min | El dispositivo no la ejecuta | ☐ |
| 17 | Orden duplicada | Repetir el mismo identificador | Se ejecuta una sola vez | ☐ |
| 18 | Usuario no autorizado | Llamar API sin sesión/token | Respuesta denegada | ☐ |
| 19 | Reinicio en riego | Reiniciar controlador | Vuelve con salidas apagadas y conserva límite | ☐ |
| 20 | Prueba continua | Operar 72 h | Sin bloqueo, fuga ni reinicio no explicado | ☐ |
| 21 | Ensayo prolongado | Operar 7 días | Datos consistentes y disponibilidad ≥ 99 % | ☐ |

## Hoja de aforo

| Zona | Volumen pedido | Volumen 1 | Volumen 2 | Volumen 3 | Promedio | Error |
|---|---:|---:|---:|---:|---:|---:|
| A | 400 ml | | | | | |
| B | 400 ml | | | | | |
| C | 400 ml | | | | | |

## Incidencias

| Fecha/hora | Prueba | Hallazgo | Corrección | Repetición aprobada |
|---|---|---|---|---|
| | | | | |

## Aceptación

El sistema solo se declara operativo si las 21 pruebas están aprobadas, no hay puentes temporales en las protecciones y los valores de `config.h` coinciden con las hojas de calibración.

**Responsable técnico:** ____________________  **Docente responsable:** ____________________

