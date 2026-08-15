# Sistema de riego inteligente 1.0

Proyecto de la **Unidad Educativa Fiscal Samborondón** para monitorear y regar de forma autónoma tres microzonas agrícolas, con supervisión y órdenes remotas desde un aplicativo web.

El proyecto incluye:

- Aplicativo web responsivo con estado hidráulico, energía, zonas, bitácora y riego remoto protegido.
- API segura para recibir telemetría y entregar órdenes al dispositivo.
- Base de datos para lecturas, configuraciones, comandos y auditoría.
- Firmware ESP32 con control autónomo y funcionamiento sin internet.
- Diseño hidráulico con bomba central, tres electroválvulas y medición de caudal y presión.
- Plan de montaje, calibración y pruebas de aceptación.

## Principio de seguridad

La web supervisa y solicita acciones; el ESP32 decide si es seguro ejecutarlas. Ni una pérdida de internet ni una orden remota pueden anular el nivel mínimo del tanque, la parada de emergencia, los límites diarios, la presión, el caudal o la protección de batería.

## Documentación

- [Proyecto mejorado](docs/PROYECTO-MEJORADO.md)
- [Lista de materiales](docs/LISTA-DE-MATERIALES.md)
- [Descripción detallada de todos los componentes](docs/DESCRIPCION-DETALLADA-DE-TODOS-LOS-COMPONENTES.md)
- [Montaje y puesta en marcha](docs/MONTAJE-Y-PUESTA-EN-MARCHA.md)
- [Protocolo de pruebas](docs/PROTOCOLO-DE-PRUEBAS.md)
- [Contrato de la API](docs/CONTRATO-API.md)
- [Firmware del ESP32](firmware/README.md)

## Aplicativo web

Requiere Node.js 22 o superior.

```bash
npm ci
npm run dev
```

El panel abre en la dirección local indicada por el servidor. Sin telemetría muestra una demostración interactiva; al conectarse el controlador cambia automáticamente a datos reales.

## Firmware

El firmware utiliza PlatformIO. Antes de compilar, copiar `firmware/include/config.example.h` como `firmware/include/config.h` y reemplazar credenciales, certificado y valores de calibración.

## Qué significa “operativo”

El software puede validarse sin hardware, pero el sistema completo solo se declara operativo cuando el montaje real supera el protocolo de calibración, fallo seguro, desconexión de internet y funcionamiento continuo. No se debe energizar una bomba con valores de ejemplo sin medir polaridad, tensión, caudal, presión y consumo.
