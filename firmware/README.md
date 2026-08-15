# Firmware del Sistema de riego inteligente 1.0

Este firmware convierte el ESP32 en el cerebro autónomo del prototipo. Decide localmente, controla una bomba y tres electroválvulas, mide el volumen realmente aplicado y continúa funcionando si se pierde internet.

## Preparación

1. Instalar Visual Studio Code con PlatformIO.
2. Copiar `include/config.example.h` como `include/config.h`.
3. Completar Wi-Fi, URL, token del dispositivo, certificado raíz y constantes de calibración.
4. Comprobar con multímetro que ninguna entrada del ESP32 reciba más de 3,3 V.
5. Compilar con `pio run` y cargar con `pio run --target upload`.

`config.h` contiene credenciales y está excluido del control de versiones. El token debe ser único para este controlador.

## Comportamiento seguro

- Las salidas arrancan apagadas.
- Primero abre la válvula, luego enciende la bomba.
- Mide el volumen con pulsos del caudalímetro.
- Detiene la bomba por falta de agua, caudal nulo, presión anormal, batería baja, sensor inválido, límite diario, tiempo máximo o parada de emergencia.
- Una orden web no puede desactivar estas protecciones.
- La conexión HTTPS valida el certificado del servidor.

Antes de energizar la bomba, ejecutar las pruebas de `docs/PROTOCOLO-DE-PRUEBAS.md` con las cargas desconectadas y después con fusibles instalados.
