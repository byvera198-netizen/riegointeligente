# Montaje y puesta en marcha

## Regla de trabajo

Montar y probar por subsistemas. No conectar simultáneamente batería, panel, bomba y electrónica sin haber validado antes cada ramal. Toda intervención eléctrica se hace con el seccionador abierto y el panel cubierto o desconectado.

## 1. Estructura

1. Construir y nivelar la cama de 2 × 1 m.
2. Instalar membrana, drenaje, geotextil y divisores.
3. Añadir el mismo volumen y tipo de sustrato en las tres zonas.
4. Fijar soportes separados para tanque, batería y caja IP65.
5. Mantener la batería por encima del piso y fuera de la trayectoria de drenaje.

## 2. Hidráulica

Orden de montaje:

```text
tanque → bola → filtro → bomba → antirretorno → regulador
       → manómetro/sensor de presión → caudalímetro → colector → válvulas → emisores
```

Lavar la tubería antes de colocar los microaspersores. Probar fugas con activación manual y agua limpia. Confirmar que cada válvula puede abrir a presión cero; una válvula piloto inadecuada puede parecer un fallo electrónico.

## 3. Tablero eléctrico

1. Instalar seccionador y fusible principal junto al positivo de batería.
2. Crear ramales independientes para bomba, válvulas y control.
3. Ajustar el DC–DC a 5,00 V antes de conectar el ESP32.
4. Mantener cables de bomba separados de I²C, OneWire y señales analógicas.
5. Instalar diodo sobre cada carga inductiva con polaridad correcta.
6. Adaptar a 3,3 V toda señal procedente de un sensor de 5 V.
7. Etiquetar ambos extremos de cada conductor.
8. Comprobar continuidad, polaridad y ausencia de cortocircuito antes de poner fusibles.

## 4. Sensores

- Humedad: misma profundidad, fuera del chorro directo y con electrónica superior sellada.
- DS18B20: obtener su dirección ROM, asignarla en `config.h` y etiquetarla A/B/C.
- BME280: garita ventilada, sombra permanente y lejos del calor de la caja.
- Caudal: tramo recto y orientación indicada por el fabricante.
- Presión: después del regulador y antes del colector.
- Nivel ultrasónico: perpendicular al agua, sin obstáculos; flotador inferior independiente.
- Emergencia: contacto normalmente cerrado; la rotura de cable debe interpretarse como paro.

## 5. Calibración

### Humedad

Para cada sensor registrar al menos 30 muestras en sustrato seco y 30 a capacidad de campo. Usar la mediana y escribir los resultados en `MOISTURE_DRY_ADC` y `MOISTURE_WET_ADC`. No calibrar únicamente en aire y agua.

### Caudal

1. Recoger agua de una zona en una probeta o recipiente graduado.
2. Registrar pulsos durante al menos 1 L.
3. Repetir tres veces por zona.
4. Calcular pulsos/litro y error.
5. Ajustar hasta lograr error ≤ 10 %.

### Presión

Comparar el sensor con el manómetro en tres puntos. Ajustar cero y escala. Definir límites solo después de conocer la presión normal con cada zona.

### Tanque y batería

Medir distancias de lleno y crítico. Comparar la tensión de batería mostrada con un multímetro en 12,0 V, 12,8 V y durante el arranque de bomba.

## 6. Software

1. Crear `firmware/include/config.h` desde el ejemplo.
2. Cargar direcciones, calibraciones, Wi-Fi, URL, token y certificado.
3. Compilar y cargar el firmware con bomba y válvulas desconectadas.
4. Verificar que todos los GPIO de potencia arrancan apagados.
5. Probar entradas simulando flotador y emergencia.
6. Conectar una carga a la vez.
7. Confirmar telemetría en la web.
8. Enviar una orden de 0,40 L y comparar el resultado físico.

## 7. Puesta en servicio

Ejecutar el protocolo de pruebas completo. Después, observar 72 h de operación continua y un ensayo de siete días. Guardar las calibraciones, versión de firmware, fotografías, incidencias y firma del responsable.

