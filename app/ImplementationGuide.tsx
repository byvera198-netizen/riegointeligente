"use client";

import { useMemo, useState } from "react";
import { assetPath } from "./asset-path";

type ImplementationPhase = {
  number: string;
  title: string;
  kit: string;
  duration: string;
  image: string;
  objective: string;
  safety: string;
  tasks: string[];
  verify: string[];
  evidence: string[];
  exit: string;
};

const phases: ImplementationPhase[] = [
  {
    number: "01",
    title: "Preparar el proyecto y el lugar",
    kit: "Gestión, seguridad y evidencias",
    duration: "½–1 día",
    image: assetPath("proyecto-final-operativo-ultra-v2.webp"),
    objective: "Definir responsables, ubicación, documentación y reglas de trabajo antes de comprar o perforar cualquier pieza.",
    safety: "Ninguna persona trabaja sola con batería, herramientas de corte o pruebas hidráulicas. Un docente o responsable técnico autoriza cada energización.",
    tasks: [
      "Nombrar responsable técnico, docente responsable, responsable de software y encargado de registrar evidencias.",
      "Confirmar el alcance: cama de 2,00 × 1,00 m y tres zonas A tomate, B lechuga y C pimiento.",
      "Elegir un lugar nivelado, con drenaje, radiación solar suficiente, cobertura Wi‑Fi de 2,4 GHz y acceso seguro al agua.",
      "Definir la posición del tanque, panel, batería y caja IP65 fuera del escurrimiento y del alcance accidental de estudiantes.",
      "Crear una carpeta de evidencias con planos, facturas, hojas de datos, calibraciones, fotografías, firmware e incidencias.",
      "Imprimir la lista de compra, el plano de pines, el flujo hidráulico y el protocolo de 21 pruebas.",
      "Preparar guantes, gafas, multímetro, herramientas aisladas, extintor adecuado y señalización del área.",
      "Establecer la regla: montar y probar un subsistema por vez, siempre con el seccionador abierto y el panel cubierto o desconectado.",
    ],
    verify: ["Ubicación aprobada", "Wi‑Fi 2,4 GHz comprobado", "Responsables asignados", "Carpeta de evidencias creada"],
    evidence: ["Croquis del lugar", "Fotografías iniciales", "Acta de responsables"],
    exit: "No iniciar compras ni construcción hasta que el croquis, las responsabilidades y las condiciones de seguridad estén aprobados.",
  },
  {
    number: "02",
    title: "Validar la compra y preparar el banco",
    kit: "Todos los kits",
    duration: "1–3 días según disponibilidad",
    image: assetPath("catalogo-componentes-v1.webp"),
    objective: "Evitar incompatibilidades de tensión, corriente, presión, rosca o comunicación antes del montaje definitivo.",
    safety: "No sustituir componentes solo por apariencia. La marca puede cambiar, pero la especificación mínima y los márgenes eléctricos e hidráulicos son obligatorios.",
    tasks: [
      "Comparar cada elemento recibido con la lista maestra y registrar cantidad, modelo, tensión, corriente y hoja de datos.",
      "Verificar que bomba y electroválvulas sean de 12 V DC y que las válvulas normalmente cerradas puedan operar con la presión real del prototipo.",
      "Medir la corriente nominal y de arranque de la bomba para dimensionar cable, MOSFET, fusible y relé o contactor DC.",
      "Confirmar que el panel sea de 150 W y que Voc, Isc e Imp estén dentro de los límites del controlador de carga y del INA260.",
      "Configurar el controlador para batería AGM de 12 V y 55 Ah; no usar perfil de litio ni ecualización incompatible.",
      "Comprobar diámetros y roscas de tanque, filtro, bomba, regulador, sensores, colector, tubería de 16 mm y microtubo de 6 mm.",
      "Verificar que los sensores analógicos no excedan 3,3 V en el ESP32/ADS1115 y preparar divisores o adaptación cuando corresponda.",
      "Separar repuestos mínimos: fusibles, diodos, conectores, terminales, un sensor de humedad y un emisor de reserva.",
    ],
    verify: ["100 % de referencias cotejadas", "Corriente de arranque medida", "Roscas compatibles", "Perfil AGM confirmado"],
    evidence: ["Inventario fotografiado", "Hojas de datos", "Tabla de compatibilidad"],
    exit: "Todas las piezas críticas deben tener especificación confirmada; cualquier duda de corriente, presión o tensión bloquea el montaje.",
  },
  {
    number: "03",
    title: "Construir la cama y los soportes",
    kit: "Kit estructural y cama agrícola",
    duration: "1–2 días",
    image: assetPath("galeria-estructura.jpeg"),
    objective: "Crear una estructura estable, drenada y dividida para que cada sensor represente únicamente su cultivo.",
    safety: "Eliminar astillas y bordes cortantes. La estructura debe soportar el sustrato saturado sin deformarse ni volcarse.",
    tasks: [
      "Construir el bastidor de 2,00 × 1,00 m con material resistente a humedad y radiación UV.",
      "Instalar patas o apoyos, nivelar las cuatro esquinas y comprobar estabilidad con carga.",
      "Colocar la membrana impermeable sin perforaciones innecesarias y formar pendiente hacia la salida de drenaje.",
      "Instalar pasamuros, rejilla y manguera de descarga; realizar una prueba de drenaje con agua antes del sustrato.",
      "Añadir geotextil y una capa drenante de 3–5 cm sin bloquear la salida.",
      "Fijar dos divisores internos sellados que definan las zonas A, B y C.",
      "Añadir el mismo tipo y volumen de sustrato en las tres zonas y registrar composición, fecha, densidad y profundidad.",
      "Instalar soporte técnico vertical y letreros resistentes al agua para el sistema y cada cultivo.",
    ],
    verify: ["Cama nivelada", "Drenaje libre", "Tres zonas aisladas", "Profundidad 20–30 cm"],
    evidence: ["Fotografías por capa", "Medidas finales", "Prueba de drenaje"],
    exit: "La cama llena no se deforma, no retiene agua fuera del diseño y las tres zonas permanecen física y visualmente separadas.",
  },
  {
    number: "04",
    title: "Montar y lavar el circuito hidráulico",
    kit: "Kit hidráulico completo",
    duration: "1–2 días",
    image: assetPath("galeria-bomba.jpeg"),
    objective: "Construir un recorrido estanco, mantenible y medible desde el tanque hasta los seis emisores.",
    safety: "Probar primero con agua limpia y activación manual. Nunca hacer funcionar la bomba en seco ni presurizar un circuito sin regulador y salida disponible.",
    tasks: [
      "Perforar el tanque e instalar pasamuros, empaques y válvula manual sin usar silicona como sustituto de un sello mecánico.",
      "Montar en orden: tanque → válvula de bola → filtro 120 mesh → manguera de succión reforzada → bomba.",
      "Fijar la bomba en soportes antivibración, con ventilación y acceso para mantenimiento.",
      "Instalar después de la bomba: antirretorno → regulador → manómetro y sensor de presión → caudalímetro.",
      "Respetar la flecha de flujo del caudalímetro y dejar tramos rectos según el fabricante.",
      "Conectar el colector de tres salidas y una electroválvula normalmente cerrada de 12 V por zona.",
      "Tender tubería PE de 16 mm y microtubo de 6 mm, utilizando conectores, abrazaderas, PTFE y sellador compatibles.",
      "Instalar dos microaspersores regulables por zona sobre estacas firmes y con acceso para limpieza.",
      "Lavar cada ramal sin los emisores, limpiar el filtro y después instalar los microaspersores.",
      "Llenar el tanque, purgar aire y probar fugas, caudal y presión una zona a la vez.",
    ],
    verify: ["Sin fugas durante 30 min", "Flujo en sentido correcto", "Una zona por vez", "Presión regulada inicialmente a 1 bar"],
    evidence: ["Diagrama as-built", "Fotos de uniones", "Registro de fugas y correcciones"],
    exit: "El circuito entrega agua repetible en A, B y C, sin fugas, cavitación, retorno al tanque ni apertura cruzada de válvulas.",
  },
  {
    number: "05",
    title: "Instalar la energía solar y distribución DC",
    kit: "Kit de energía solar",
    duration: "1 día",
    image: assetPath("galeria-panel-solar.jpeg"),
    objective: "Producir, almacenar y distribuir energía de 12 V con aislamiento, fusibles y capacidad para los picos de la bomba.",
    safety: "Cubrir o desconectar el panel durante el cableado. Conectar el controlador en la secuencia indicada por su fabricante, normalmente batería antes que panel.",
    tasks: [
      "Fijar el panel de 150 W en una estructura resistente, orientada e inclinada para evitar sombras y acumulación de agua.",
      "Tender cable solar UV, colocar conectores MC4 con herramienta correcta y verificar polaridad y Voc antes de conectar.",
      "Instalar la batería AGM elevada, ventilada, protegida del sol y sujeta con bandeja y correa.",
      "Colocar fusible principal lo más cerca posible del positivo de batería y después el seccionador DC rotulado.",
      "Añadir protección contra inversión de polaridad y barras cubiertas positiva y negativa.",
      "Crear ramales independientes y etiquetados para bomba, válvulas y control.",
      "Conectar el INA260 solo si la corriente máxima del panel está dentro de su capacidad y del diseño de sus terminales.",
      "Configurar tipo de batería, tensiones de carga y desconexión por baja tensión en el controlador solar.",
      "Medir tensión en reposo, durante carga y durante arranque de bomba; confirmar que no se reinicia el controlador.",
    ],
    verify: ["Polaridad correcta", "Fusible principal próximo a batería", "Controlador en perfil AGM", "Sin caída crítica al arrancar"],
    evidence: ["Voc e Isc registrados", "Tensiones de carga", "Foto de protecciones"],
    exit: "La distribución entrega 12 V estable, cada ramal puede aislarse y ningún cable o terminal se calienta durante la prueba de carga.",
  },
  {
    number: "06",
    title: "Armar el tablero de control y potencia",
    kit: "Control electrónico, potencia y caja",
    duration: "1–2 días",
    image: assetPath("galeria-caja-ip65.jpeg"),
    objective: "Proteger el ESP32 y gobernar cargas inductivas sin conducir corriente de bomba o válvulas por el microcontrolador.",
    safety: "Ajustar el convertidor a 5,00 V antes de conectar el ESP32. Mantener bomba y válvulas desconectadas durante la primera carga del firmware.",
    tasks: [
      "Montar riel DIN o placa interna, borneras, fusibles de ramal, convertidor DC–DC, MOSFET y controlador sin cables sueltos.",
      "Separar físicamente potencia, señales analógicas, bus I²C/OneWire y antena Wi‑Fi.",
      "Ajustar el convertidor 12 V → 5 V a 5,00 V y comprobar polaridad con multímetro.",
      "Instalar cuatro canales MOSFET lógicos con margen de corriente y disipación: bomba y válvulas A, B y C.",
      "Añadir resistencia de compuerta y pull-down cuando el módulo no las incorpore.",
      "Instalar diodo de rueda libre sobre cada bobina y TVS de 12 V en la distribución según el diseño.",
      "Colocar condensadores de desacoplo cerca del control y reserva de energía cerca de las cargas respetando polaridad.",
      "Cablear parada de emergencia normalmente cerrada para informar al GPIO 13 y cortar físicamente la habilitación de la bomba.",
      "Instalar prensaestopas IP65, punteras, terminales, termorretráctil, canaletas y etiquetas en ambos extremos.",
      "Comprobar continuidad, aislamiento, polaridad y ausencia de cortocircuitos antes de insertar cada fusible.",
    ],
    verify: ["5,00 V estable", "Salidas apagadas al energizar", "Diodos orientados correctamente", "Caja ordenada y sellada"],
    evidence: ["Plano actualizado", "Tabla de fusibles", "Fotos antes de cerrar la caja"],
    exit: "El tablero enciende sin cargas, mantiene todas las salidas apagadas y permite identificar y aislar cada circuito.",
  },
  {
    number: "07",
    title: "Instalar sensores y comprobar señales",
    kit: "Kit de sensores",
    duration: "1–2 días",
    image: assetPath("galeria-zona-c.jpeg"),
    objective: "Obtener lecturas físicamente coherentes, identificables por zona y eléctricamente seguras para el ESP32.",
    safety: "Toda señal de 5 V debe adaptarse a 3,3 V. La desconexión de un sensor crítico debe bloquear la zona, no producir un riego.",
    tasks: [
      "Instalar un sensor capacitivo por zona a igual profundidad, fuera del chorro directo y con la electrónica superior protegida.",
      "Conectar los tres sensores de humedad al ADS1115: A0 zona A, A1 zona B y A2 zona C; reservar A3 para presión.",
      "Instalar tres DS18B20 impermeables, leer sus direcciones ROM y etiquetarlas físicamente A, B y C.",
      "Colocar el BME280 en garita ventilada, a la sombra y separado del calor de la caja.",
      "Montar el ultrasónico perpendicular al agua; adaptar ECHO a 3,3 V y dejar el flotador inferior como protección independiente.",
      "Instalar flotador inferior GPIO 33, flotador superior GPIO 23 y verificar la lógica segura de cada contacto.",
      "Instalar caudalímetro GPIO 18, sensor de presión en ADS1115 e INA260 en el bus I²C.",
      "Conectar DS3231, ADS1115, BME280 e INA260 al bus I²C GPIO 21/22 y ejecutar un escáner de direcciones.",
      "Conectar la medición de batería a GPIO 34 mediante divisor 47 kΩ/10 kΩ y condensador de 100 nF.",
      "Fijar cables con alivio mecánico, conectores impermeables y separación de la bomba; simular desconexiones antes del sellado final.",
    ],
    verify: ["I²C sin direcciones duplicadas", "ROM A/B/C registrada", "ECHO ≤ 3,3 V", "Fallo de sensor bloquea la zona"],
    evidence: ["Tabla de direcciones I²C", "ROM de las sondas", "Lecturas crudas iniciales"],
    exit: "Todos los sensores responden dentro de rangos plausibles y cada desconexión genera un estado seguro identificable.",
  },
  {
    number: "08",
    title: "Configurar firmware, API y aplicativo web",
    kit: "Comunicaciones y software",
    duration: "1–2 días",
    image: assetPath("infografias/10-kit-comunicaciones.webp"),
    objective: "Conservar la autonomía local y añadir telemetría y órdenes remotas seguras sin publicar credenciales.",
    safety: "El token del dispositivo, la contraseña Wi‑Fi y los certificados reales nunca se guardan en GitHub ni se muestran en capturas o infografías.",
    tasks: [
      "Crear firmware/include/config.h desde config.example.h sin modificar ni publicar el archivo de ejemplo con secretos.",
      "Cargar SSID de 2,4 GHz, credencial, URL HTTPS, token exclusivo y certificado raíz válido.",
      "Registrar direcciones ROM, calibraciones preliminares, pines, límites y zona correspondiente en la configuración.",
      "Compilar y cargar el firmware con bomba y válvulas desconectadas.",
      "Confirmar diez arranques consecutivos con GPIO de potencia apagados y watchdog activo.",
      "Ajustar el DS3231, reinicio diario de contadores y almacenamiento persistente NVS.",
      "Verificar POST /api/device/telemetry, consulta de comandos y acuses accepted, executed, rejected o failed.",
      "Comprobar que cada orden tenga identificador único, vencimiento máximo de dos minutos e idempotencia.",
      "Iniciar sesión en el aplicativo y confirmar que el panel cambia de demostración a telemetría real.",
      "Desconectar internet y comprobar que medición, límites y riego automático continúan localmente.",
    ],
    verify: ["TLS válido", "Token fuera del repositorio", "Telemetría real visible", "Autonomía sin internet"],
    evidence: ["Versión de firmware", "Capturas del panel", "Registro de API sin secretos"],
    exit: "El ESP32 opera sin internet, sincroniza al reconectar y ninguna orden anónima, duplicada o vencida puede activar el riego.",
  },
  {
    number: "09",
    title: "Calibrar suelo, agua, presión y energía",
    kit: "Calibración de todos los subsistemas",
    duration: "1–2 días",
    image: assetPath("galeria-calibracion.jpeg"),
    objective: "Sustituir valores de catálogo por constantes reales del montaje antes de habilitar decisiones automáticas.",
    safety: "Los umbrales iniciales son de puesta en marcha, no recomendaciones agronómicas definitivas. Registrar siempre medición, método, fecha y responsable.",
    tasks: [
      "Tomar al menos 30 muestras por sensor de humedad en sustrato seco y 30 a capacidad de campo.",
      "Usar la mediana para obtener MOISTURE_DRY_ADC y MOISTURE_WET_ADC de cada zona; no calibrar solo en aire y agua.",
      "Confirmar identidad térmica calentando una DS18B20 por vez y verificando A, B y C.",
      "Recoger al menos 1 L, contar pulsos y repetir tres veces por zona para calcular pulsos/litro.",
      "Ajustar el factor del caudalímetro hasta lograr error medio de volumen igual o menor a 10 %.",
      "Comparar presión electrónica con el manómetro en cero, presión media y presión normal de cada zona.",
      "Definir límites de presión baja y alta después de conocer los rangos normales, fugas y obstrucciones simuladas.",
      "Medir distancia de tanque lleno y nivel crítico; contrastar ultrasónico con ambos flotadores.",
      "Comparar tensión mostrada con multímetro en 12,0 V, 12,8 V y durante el arranque de la bomba.",
      "Guardar constantes, instrumentos utilizados, incertidumbre, resultados y firma del responsable.",
    ],
    verify: ["30+30 muestras por zona", "Aforo repetido 3 veces", "Error ≤ 10 %", "Presión y batería contrastadas"],
    evidence: ["Hoja de calibración", "Hoja de aforo", "config.h actualizado sin secretos"],
    exit: "No habilitar modo autónomo hasta que humedad, volumen, presión, tanque y batería tengan calibraciones trazables y repetibles.",
  },
  {
    number: "10",
    title: "Integrar la secuencia autónoma",
    kit: "Control local completo",
    duration: "1 día",
    image: assetPath("proyecto-final-operativo-ultra-v2.webp"),
    objective: "Unir sensores, válvulas, bomba y registro con una máquina de estados que siempre falle de forma segura.",
    safety: "La web solicita; el ESP32 decide. Emergencia, tanque bajo, batería, presión, caudal, sensor inválido y límite diario nunca pueden anularse remotamente.",
    tasks: [
      "Configurar valores iniciales: A <45 %, 0,40 L, 3,0 L/día; B <50 %, 0,35 L, 2,4 L/día; C <44 %, 0,40 L, 2,8 L/día.",
      "Tomar varias muestras cada 10 s, filtrar ruido y validar rangos antes de calcular déficit.",
      "Elegir solo una zona válida con mayor déficit y respetar 10–15 min de estabilización.",
      "Antes del pulso comprobar emergencia, tanque, batería, sensor, horario y límite diario.",
      "Abrir una sola válvula y esperar 1,5 s antes de encender la bomba.",
      "Confirmar caudal en menos de 5 s y vigilar presión durante toda la entrega.",
      "Detener al alcanzar el volumen o, como respaldo, al cumplir 120 s de tiempo máximo.",
      "Apagar la bomba, esperar 1,5 s, cerrar la válvula y comprobar que el caudal vuelve a cero.",
      "Guardar mililitros, causa, resultado, alarmas y estado final antes de aceptar otro pulso.",
      "Probar manualmente A, B y C y confirmar que reiniciar el ESP32 deja bomba y válvulas apagadas sin borrar límites diarios.",
    ],
    verify: ["Una válvula por vez", "Caudal confirmado ≤ 5 s", "Tiempo máximo 120 s", "Contadores persistentes"],
    evidence: ["Bitácora de pulsos", "Video de cada zona", "Registro de reinicio seguro"],
    exit: "Tres zonas completan pulsos medidos, todas las protecciones producen paro seguro y cada decisión queda explicada en la bitácora.",
  },
  {
    number: "11",
    title: "Ejecutar las 21 pruebas de aceptación",
    kit: "Validación integral obligatoria",
    duration: "72 h + ensayo de 7 días",
    image: assetPath("infografias/flujo-informacion.webp"),
    objective: "Demostrar con datos que el prototipo es seguro, repetible, autónomo y controlable remotamente.",
    safety: "No marcar aprobado por observación informal. Cada prueba necesita dato medido, evidencia, resultado y repetición después de una corrección.",
    tasks: [
      "Prueba 1: encender diez veces y confirmar que ninguna salida se activa.",
      "Prueba 2: abrir emergencia durante riego y comprobar apagado inmediato.",
      "Prueba 3: accionar tanque bajo y confirmar bloqueo o detención de bomba.",
      "Prueba 4: probar humedad A/B/C seca, húmeda y desconectada.",
      "Prueba 5: calentar una DS18B20 por vez y confirmar identidad A/B/C.",
      "Prueba 6: activar cada zona y confirmar aislamiento de válvulas.",
      "Prueba 7: solicitar el volumen tres veces por zona y obtener error medio ≤ 10 %.",
      "Prueba 8: cerrar suministro y comprobar detención por caudal nulo en ≤ 5 s.",
      "Prueba 9: bloquear brevemente la salida y comprobar paro por presión alta.",
      "Prueba 10: abrir una fuga controlada y comprobar presión baja o caudal anormal.",
      "Prueba 11: suprimir pulsos y confirmar que la bomba nunca supera 120 s.",
      "Prueba 12: alcanzar el límite diario y comprobar rechazo del siguiente pulso.",
      "Prueba 13: simular batería baja y confirmar bloqueo con alarma.",
      "Prueba 14: desconectar internet 2 h y comprobar autonomía local.",
      "Prueba 15: restaurar internet y confirmar retorno de telemetría sin intervención.",
      "Prueba 16: retener una orden más de 2 min y comprobar que no se ejecuta.",
      "Prueba 17: repetir el mismo identificador y comprobar una sola ejecución.",
      "Prueba 18: llamar la API sin autorización y comprobar respuesta denegada.",
      "Prueba 19: reiniciar durante riego y confirmar salidas apagadas y límite conservado.",
      "Prueba 20: operar 72 h sin bloqueo, fuga ni reinicio no explicado.",
      "Prueba 21: operar 7 días con datos consistentes y disponibilidad ≥ 99 %.",
    ],
    verify: ["21/21 aprobadas", "Incidencias cerradas", "Disponibilidad ≥ 99 %", "Sin puentes de protección"],
    evidence: ["Protocolo firmado", "Aforos", "Exportación de bitácora y fotografías"],
    exit: "El sistema solo puede declararse operativo cuando las 21 pruebas estén aprobadas y las calibraciones coincidan con el firmware instalado.",
  },
  {
    number: "12",
    title: "Entregar, operar y mantener",
    kit: "Puesta en servicio y sostenibilidad",
    duration: "Operación continua",
    image: assetPath("infografias/sistema-hidraulico-escalado.webp"),
    objective: "Dejar el sistema documentado, mantenible y preparado para operar durante el año lectivo.",
    safety: "Toda modificación posterior exige abrir el seccionador, cubrir el panel, cerrar el agua y repetir las pruebas afectadas.",
    tasks: [
      "Congelar y registrar versión de firmware, configuración, esquema as-built y fecha de puesta en servicio.",
      "Entregar credenciales por un canal seguro y definir quién puede operar, mantener y administrar el aplicativo.",
      "Capacitar a docentes y estudiantes en modo autónomo, pausa, riego remoto, alarmas y parada de emergencia.",
      "Revisar semanalmente nivel, filtro, emisores, fugas, batería, producción solar, cables y alarmas.",
      "Limpiar filtro y emisores según pérdida de caudal; inspeccionar sellos, abrazaderas y prensaestopas mensualmente.",
      "Recalibrar humedad al cambiar sustrato o cultivo y repetir aforo después de intervenir bomba, válvulas o emisores.",
      "Probar mensualmente emergencia, flotador inferior, caudal nulo y respaldo sin internet.",
      "Mantener repuestos identificados y registrar cada cambio con fecha, motivo, pieza y prueba posterior.",
      "Conservar telemetría por minuto 90 días y resúmenes diarios durante el año lectivo, sin datos personales innecesarios.",
    ],
    verify: ["Documentación entregada", "Usuarios capacitados", "Calendario de mantenimiento", "Repuestos disponibles"],
    evidence: ["Acta de entrega", "Plan de mantenimiento", "Respaldo de firmware y calibraciones"],
    exit: "El proyecto queda aceptado cuando la institución puede operarlo, detenerlo, mantenerlo y recuperar su configuración sin depender del equipo constructor.",
  },
];

export default function ImplementationGuide() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [checked, setChecked] = useState<Set<string>>(() => new Set());
  const active = phases[activeIndex];
  const totalTasks = useMemo(() => phases.reduce((sum, phase) => sum + phase.tasks.length, 0), []);
  const completedCount = checked.size;
  const totalProgress = Math.round((completedCount / totalTasks) * 100);
  const activeKeys = active.tasks.map((_, index) => `${active.number}-${index}`);
  const activeCompleted = activeKeys.every((key) => checked.has(key));

  function toggleTask(key: string) {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function togglePhase() {
    setChecked((current) => {
      const next = new Set(current);
      if (activeCompleted) activeKeys.forEach((key) => next.delete(key));
      else activeKeys.forEach((key) => next.add(key));
      return next;
    });
  }

  function selectPhase(index: number) {
    setActiveIndex(index);
    document.getElementById("implementation-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="implementation-section" id="implementacion" aria-labelledby="implementation-title">
      <div className="section implementation-inner">
        <div className="section-heading split-heading implementation-heading">
          <div><span className="eyebrow">Guía de implementación completa</span><h2 id="implementation-title">Del inventario a un sistema autónomo validado.</h2></div>
          <p>Avanza en orden y no omitas los criterios de salida. La guía integra todos los kits, conexiones, calibraciones, software, seguridad, 21 pruebas y mantenimiento necesarios para convertir las piezas en un prototipo realmente operativo.</p>
        </div>

        <div className="implementation-actions">
          <div className="implementation-progress" aria-label={`Progreso general ${totalProgress} por ciento`}><span><i style={{ width: `${totalProgress}%` }} /></span><p><strong>{totalProgress}%</strong><small>{completedCount} de {totalTasks} acciones verificadas</small></p></div>
          <a href={assetPath("guia-implementacion.md")} download>↓ Descargar guía</a>
          <button onClick={() => window.print()}>▤ Imprimir</button>
        </div>

        <div className="implementation-stats" aria-label="Alcance de la implementación">
          <div><strong>12</strong><span>fases ordenadas</span></div><div><strong>{totalTasks}</strong><span>acciones verificables</span></div><div><strong>21</strong><span>pruebas obligatorias</span></div><div><strong>7 días</strong><span>ensayo final</span></div>
        </div>

        <div className="implementation-layout">
          <nav className="phase-navigation" aria-label="Fases de implementación">
            {phases.map((phase, index) => {
              const phaseDone = phase.tasks.every((_, taskIndex) => checked.has(`${phase.number}-${taskIndex}`));
              return <button key={phase.number} className={index === activeIndex ? "active" : ""} onClick={() => selectPhase(index)} aria-current={index === activeIndex ? "step" : undefined}>
                <span className={phaseDone ? "done" : ""}>{phaseDone ? "✓" : phase.number}</span><p><small>{phase.kit}</small><strong>{phase.title}</strong></p><i>→</i>
              </button>;
            })}
          </nav>

          <article className="implementation-detail" id="implementation-detail">
            <div className="phase-visual"><img src={active.image} alt={`Referencia visual: ${active.title}`} /><span>Fase {active.number} · {active.duration}</span></div>
            <header><span className="eyebrow">{active.kit}</span><h3>{active.title}</h3><p>{active.objective}</p></header>
            <div className="phase-safety"><span>!</span><p><strong>Condición de seguridad</strong><small>{active.safety}</small></p></div>

            <div className="phase-checklist">
              <div className="phase-subheading"><div><span className="eyebrow">Paso a paso</span><h4>{active.tasks.length} acciones de esta fase</h4></div><button onClick={togglePhase}>{activeCompleted ? "Reabrir fase" : "Marcar fase completa"}</button></div>
              {active.tasks.map((task, index) => {
                const key = `${active.number}-${index}`;
                const done = checked.has(key);
                return <button key={key} className={done ? "checked" : ""} role="checkbox" aria-checked={done} onClick={() => toggleTask(key)}><span>{done ? "✓" : String(index + 1).padStart(2, "0")}</span><p>{task}</p></button>;
              })}
            </div>

            <div className="phase-results">
              <div><span className="eyebrow">Qué verificar</span>{active.verify.map((item) => <p key={item}>✓ {item}</p>)}</div>
              <div><span className="eyebrow">Evidencia mínima</span>{active.evidence.map((item) => <p key={item}>▣ {item}</p>)}</div>
            </div>
            <div className="phase-gate"><span>→</span><p><strong>Criterio para pasar a la siguiente fase</strong><small>{active.exit}</small></p></div>
            <footer><button disabled={activeIndex === 0} onClick={() => selectPhase(activeIndex - 1)}>← Fase anterior</button><span>{activeIndex + 1} / {phases.length}</span><button disabled={activeIndex === phases.length - 1} onClick={() => selectPhase(activeIndex + 1)}>Siguiente fase →</button></footer>
          </article>
        </div>
      </div>
    </section>
  );
}
