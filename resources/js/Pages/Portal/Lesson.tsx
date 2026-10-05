import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { Lesson, SharedProps } from '../../types';
import confetti from 'canvas-confetti';
import {
    ArrowLeft,
    CheckCircle2,
    Sparkles,
    Trophy,
    Play,
    Cpu,
    BookOpen,
    HelpCircle,
    Check,
    AlertCircle,
    Zap,
    FlaskConical,
    LayoutDashboard,
    Search,
    ExternalLink,
    Flame,
    RotateCcw,
    Layers,
    MessageSquare,
    Eye,
    Shield,
    ShieldAlert,
    Radio,
    Award,
    Target,
    BrainCircuit,
    Terminal,
    FileCheck,
    Crosshair,
} from 'lucide-react';
import { appUrl } from '../../lib/route';

interface LessonProps {
    lesson: Lesson;
    allLessons: Lesson[];
    onOpenRegister?: () => void;
    onOpenCitizenship?: () => void;
}

// Synthesized Sound FX via Web Audio API (Zero external assets)
function playSfx(type: 'pop' | 'success' | 'combo' | 'levelup' | 'error') {
    try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'pop') {
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } else if (type === 'combo') {
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.08); // A5
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } else if (type === 'success') {
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } else if (type === 'levelup') {
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } else if (type === 'error') {
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        }
    } catch (e) {}
}

// -------------------------------------------------------------
// CONSTANTES CURRICULARES GARANTIZADAS (FALLBACK & DATA INTEGRITY)
// -------------------------------------------------------------
const LEVEL1_QUESTIONS = [
    {
        id: 1,
        type: 'text',
        prompt: 'Lee este breve verso: "En los cables susurra el viento de cristal, un pájaro de silicio vuela sobre el mar digital."',
        question: '¿Quién escribió este verso?',
        options: ['👨‍🎨 Poeta Humano', '🤖 Inteligencia Artificial'],
        correct: 1,
        explanation: '¡Correcto! Fue generado por un modelo de lenguaje en 0.5 segundos combinando patrones de rima y metáforas tecnológicas aprendidas.',
    },
    {
        id: 2,
        type: 'fact',
        prompt: 'Para que una computadora reconozca la foto de un gato entre 10.000 imágenes:',
        question: '¿Qué método utiliza la Inteligencia Artificial moderna?',
        options: [
            'Regla fija escrita a mano: "Si tiene 2 orejas puntiagudas y bigotes"',
            'Aprendizaje Automático: Analiza miles de fotos para extraer patrones visuales sola',
        ],
        correct: 1,
        explanation: '¡Exacto! El Machine Learning no depende de reglas rígidas escritas por humanos, sino de encontrar patrones estadísticos en grandes volúmenes de datos.',
    },
    {
        id: 3,
        type: 'text',
        prompt: 'Un asistente virtual (como Siri o Alexa) te responde: "¡Hoy hace un día soleado, me alegra mucho que salgas a jugar!"',
        question: '¿Qué significa esa respuesta?',
        options: [
            'El asistente siente felicidad real en su circuito digital',
            'Es un guión de procesamiento de lenguaje natural (NLP) calculado para sonar amable',
        ],
        correct: 1,
        explanation: 'Las máquinas simulan calidez mediante patrones de lenguaje, pero carecen de sentimientos, conciencia o estados de ánimo.',
    },
    {
        id: 4,
        type: 'logic',
        prompt: 'Si le pides a una computadora o IA que multiplique 4.582 x 9.873 en 1 milisegundo:',
        question: '¿Por qué lo hace con tanta rapidez?',
        options: [
            'Ejecuta miles de millones de operaciones electrónicas por segundo con electricidad',
            'Tiene un cerebro biológico de silicio que piensa conscientemente',
        ],
        correct: 0,
        explanation: 'La velocidad proviene de los transistores electrónicos microscópicos que conducen impulsos eléctricos a la velocidad de la luz.',
    },
];

// Muestras para el Minijuego 2: Laboratorio de Entrenamiento y Clasificación
const DATA_SAMPLES = [
    {
        id: 1,
        name: '🍎 Manzana Criolla',
        category: 'fruta',
        badge: 'Alimento Natural',
        desc: 'Muestra recolectada: Fruta comestible de cáscara roja o verde con semillas internas.',
        explanation: '¡Acierto! La IA clasifica la manzana en "Frutas y Alimentos Naturales" por sus atributos de forma esférica y fibra vegetal.',
    },
    {
        id: 2,
        name: '🏎️ Monoplaza de F1',
        category: 'vehiculo',
        badge: 'Transporte Motorizado',
        desc: 'Muestra recolectada: Vehículo con 4 ruedas de competición y motor de combustión.',
        explanation: '¡Acierto! El modelo asocia las ruedas, alerones y chasis metálico con "Vehículos y Transporte".',
    },
    {
        id: 3,
        name: '🍇 Racimo de Uvas',
        category: 'fruta',
        badge: 'Alimento Natural',
        desc: 'Muestra recolectada: Bayas pequeñas en racimo ricas en azúcar natural.',
        explanation: '¡Acierto! Atributos visuales orgánicos agregados correctamente al dataset de alimentos.',
    },
    {
        id: 4,
        name: '🚀 Cohete Espacial',
        category: 'vehiculo',
        badge: 'Transporte Aeroespacial',
        desc: 'Muestra recolectada: Vehículo cilíndrico propulsado por combustible criogénico.',
        explanation: '¡Acierto! Diseñado para transportar astronautas y satélites más allá de la atmósfera terrestre.',
    },
    {
        id: 5,
        name: '🛸 Dron Cuadricóptero con Cámara',
        category: 'ambiguo',
        badge: 'Caso Límite / Desafío',
        desc: 'Muestra recolectada: Vuela solo, graba video y tiene hélices, pero no lleva pasajeros dentro.',
        explanation: '¡Excelente criterio de ingeniero! Es un caso ambiguo: vuela como un vehículo, pero opera como un sensor robótico. Si el dataset no tiene ejemplos de drones modernos, la IA suele dudar.',
    },
    {
        id: 6,
        name: '🥑 Aguacate Criollo',
        category: 'fruta',
        badge: 'Alimento Natural',
        desc: 'Muestra recolectada: Fruto de pulpa verde cremosa con una semilla globular.',
        explanation: '¡Acierto botánico! El aguacate es botánicamente una fruta (una baya con semilla grande) y un alimento nutritivo.',
    },
    {
        id: 7,
        name: '⛵ Velero Náutico de Vela Ligera',
        category: 'vehiculo',
        badge: 'Transporte Acuático',
        desc: 'Muestra recolectada: Embarcación impulsada por la energía cinética del viento.',
        explanation: '¡Acierto! Medio de transporte acuático tradicional clasificado en la categoría de vehículos.',
    },
    {
        id: 8,
        name: '🤖 Robot Cocinero de Pizza',
        category: 'ambiguo',
        badge: 'Caso Límite / Desafío',
        desc: 'Muestra recolectada: Brazo robótico de metal que amasa harina, salsa y hornea comida.',
        explanation: '¡Magnífico ojo crítico! Este es el clásico dilema de Machine Learning: ¿Es una máquina industrial o un productor de alimentos? Los datasets deben especificar etiquetas precisas para evitar sesgos.',
    },
];

// Desafíos del Minijuego 3: El Reparador de Prompts (Prompt Crafter)
const PROMPT_CHALLENGES = [
    {
        id: 1,
        title: 'Caso 1: La Exposición de Ciencias de 5° Grado',
        scenario: 'Un estudiante necesita que la IA le prepare un resumen para exponer en el aula sobre el Sistema Solar.',
        brokenPrompt: 'Dime cosas del espacio.',
        flaw: 'Es excesivamente vago: no tiene rol, no dice para qué grado escolar, no especifica qué planetas ni en qué formato presentarlo.',
        options: [
            {
                id: 'opt_a',
                text: 'Escribe cosas bonitas del cielo y de las estrellas lejanas.',
                isCorrect: false,
                reason: 'Sigue siendo poético y vago. No ayuda a estudiar ciencias para una exposición.',
            },
            {
                id: 'opt_b',
                text: 'Actúa como un profesor de astronomía para primaria. Para una clase de 5° grado en Puerto Ordaz, explica los 3 planetas más cercanos al Sol y un dato curioso de cada uno en 3 viñetas breves con emojis.',
                isCorrect: true,
                reason: '¡Prompt de Élite! Cumple con los 4 pilares: Rol (Profesor de astronomía), Contexto (5° grado en Puerto Ordaz), Tarea (3 planetas cercanos al Sol) y Formato (3 viñetas con emojis).',
            },
            {
                id: 'opt_c',
                text: 'Escribe una carta formal en inglés a la NASA pidiendo trabajo.',
                isCorrect: false,
                reason: 'Cambia totalmente de tema y no resuelve la tarea escolar del alumno.',
            },
        ],
        badOutput: 'El espacio es infinito y muy grande. En el espacio hay estrellas, galaxias, vacío, planetas y agujeros negros...',
        goodOutput: '☀️ ¡Hola exploradores de Monte Carmelo! Aquí están nuestros tres vecinos más cercanos:\n\n1. 🪨 Mercurio: El más veloz alrededor del Sol. ¡De día arde a 430°C y de noche se congela a -180°C!\n2. ☁️ Venus: Su atmósfera densa atrapa el calor como una olla de presión gigante; ¡es el más caliente del sistema!\n3. 🌍 Tierra: ¡Nuestro hogar! El único lugar conocido donde existe agua líquida, aire respirable y vida.',
    },
    {
        id: 2,
        title: 'Caso 2: El Detective Histórico de la Represa de Guri',
        scenario: 'Un estudiante de 2° año de Media General debe investigar datos sobre la Central Hidroeléctrica Simón Bolívar para la clase de Geografía.',
        brokenPrompt: 'Cuéntame de Guri.',
        flaw: 'Riesgo alto de alucinación: la IA puede inventar fechas, decir que queda en otro estado o responder con una poesía en lugar de datos oficiales verificados.',
        options: [
            {
                id: 'opt_a',
                text: 'Habla de una represa de agua muy bonita que tiene peces.',
                isCorrect: false,
                reason: 'Texto informal sin rigor histórico ni geográfico.',
            },
            {
                id: 'opt_b',
                text: 'Inventa una leyenda fantástica sobre el Río Caroní.',
                isCorrect: false,
                reason: 'Estimula la alucinación y la ficción en lugar de datos reales para la tarea.',
            },
            {
                id: 'opt_c',
                text: 'Actúa como un historiador de la ingeniería venezolana. Indica sobre qué río está ubicada la Central Hidroeléctrica Simón Bolívar (Guri), en qué año inició operaciones y su relevancia energética para el país, citando únicamente datos oficiales verificados.',
                isCorrect: true,
                reason: '¡Excelente aplicación del pilar Anti-Alucinación! Al ordenarle "cita únicamente datos oficiales verificados", el modelo reduce al mínimo la invención de hechos.',
            },
        ],
        badOutput: 'Guri es una presa que queda en Venezuela. Es muy grande y produce bastante luz para la gente...',
        goodOutput: '⚡ Central Hidroeléctrica Simón Bolívar (Guri) · Ficha Histórica:\n\n• Ubicación Geográfica: Cañón de Necuima, sobre el Río Caroní, estado Bolívar, Venezuela.\n• Cronología de Operaciones: Su primera etapa se inauguró en 1968 y la etapa final de ampliación en 1986.\n• Aporte Energético Nacional: Genera cerca del 70% de la electricidad consumida en todo el territorio venezolano gracias a su monumental embalse de 4.250 km².',
    },
    {
        id: 3,
        title: 'Caso 3: El Antipatrón de Negaciones vs. Redacción en Positivo',
        scenario: 'Un estudiante de 1° año de bachillerato quiere publicar una nota sobre el Salto Ángel para la cartelera escolar.',
        brokenPrompt: 'No hagas un texto largo, no inventes cosas que no pasaron y no uses palabras difíciles.',
        flaw: 'Está repleto de prohibiciones ambiguas ("no hagas", "no inventes", "no uses") sin especificar rol, qué SÍ debe explicar, tono, extensión ni datos clave.',
        options: [
            {
                id: 'opt_a',
                text: 'No hables de cosas aburridas ni de números raros.',
                isCorrect: false,
                reason: 'Sigue atrapado en el vicio de las negaciones ambiguas. La IA no sabe qué incluir.',
            },
            {
                id: 'opt_b',
                text: 'Actúa como un guía ambiental venezolano. Redacta en tono positivo y entusiasta una reseña de 3 puntos clave sobre el Salto Ángel (Kerepakupai Vená) para estudiantes de bachillerato: 1) Altura oficial (979 m), 2) Ubicación en el Parque Nacional Canaima, 3) Importancia ecológica, citando únicamente datos geográficos verificados.',
                isCorrect: true,
                reason: '¡Maestría en Positive Prompting! Sustituye las negaciones por instrucciones directas, constructivas y verificables con datos oficiales.',
            },
            {
                id: 'opt_c',
                text: 'Escribe un poema libre con rima sobre cualquier cascada del mundo.',
                isCorrect: false,
                reason: 'Desvía el objetivo académico escolar y no incluye los datos geográficos de Canaima.',
            },
        ],
        badOutput: 'El Salto Ángel es una caída de agua. No es pequeña, no está en Caracas y no es artificial...',
        goodOutput: '🌊 Salto Ángel (Kerepakupai Vená) · Ficha Ambiental Escolar:\n\n1. 🏔️ Récord Mundial: Es la cascada ininterrumpida más alta del planeta, con una caída de 979 metros desde el Auyantepuy.\n2. 🌳 Santuario Natural: Se encuentra en el Parque Nacional Canaima, estado Bolívar, declarado Patrimonio de la Humanidad por la UNESCO.\n3. 🦜 Biodiversidad Única: Sus aguas alimentan ecosistemas milenarios donde conviven especies de flora y fauna endémicas que no existen en ninguna otra parte del mundo.',
    },
];

// Glosario Completo con Definición, Ejemplo Real y Pregunta Clave
const GLOSSARY_TERMS = [
    {
        term: 'Inteligencia Artificial (IA) 🤖',
        category: 'Ciencia & Fundamento',
        def: 'Disciplina de las ciencias de la computación que diseña sistemas capaces de resolver problemas complejos, reconocer imágenes o traducir idiomas calculando patrones matemáticos en datos.',
        example: 'El filtro que separa el correo no deseado (spam) o el sistema que te sugiere videos en YouTube.',
        question: '¿La IA tiene sentimientos o conciencia propia?',
        answer: 'No. La IA procesa operaciones matemáticas y estadísticas a gran velocidad, pero no siente ni tiene conciencia.',
    },
    {
        term: 'Algoritmo 📝',
        category: 'Lógica Computacional',
        def: 'Secuencia ordenada, finita y sin ambigüedades de pasos lógicos que se deben seguir para resolver un problema o completar una tarea.',
        example: 'La receta con los pasos exactos para hornear una torta o las instrucciones para armar un mueble Lego.',
        question: '¿Qué pasa si alteras el orden de los pasos en un algoritmo?',
        answer: 'El programa fallará o el resultado final será completamente inesperado.',
    },
    {
        term: 'Machine Learning (Aprendizaje Automático) 🧠',
        category: 'Entrenamiento de Modelos',
        def: 'Subcampo de la IA donde la computadora descubre las reglas por sí misma analizando miles de ejemplos (datos), en lugar de que un humano programe cada regla a mano.',
        example: 'Un clasificador de fotos de animales que vio 50.000 fotos de perros y gatos para aprender a distinguirlos.',
        question: '¿Qué necesita el Machine Learning para ser preciso?',
        answer: 'Grandes volúmenes de datos limpios, variados y bien etiquetados.',
    },
    {
        term: 'Deep Learning (Aprendizaje Profundo) 🌐',
        category: 'Redes Neuronales',
        def: 'Subconjunto del Machine Learning basado en redes neuronales artificiales con múltiples capas ocultas que procesan datos complejos como imágenes, voz y video imitando las sinapsis cerebrales.',
        example: 'El sistema de visión artificial que identifica señales de tránsito en autos autónomos o el reconocimiento facial en tu teléfono.',
        question: '¿Por qué se llama "Profundo" (Deep)?',
        answer: 'Porque posee muchas capas intermedias de neuronas artificiales conectadas en cascada para extraer rasgos abstractos.',
    },
    {
        term: 'NLP (Procesamiento de Lenguaje Natural) 🗣️',
        category: 'Lingüística Computacional',
        def: 'Campo de la IA enfocado en que las computadoras entiendan, interpreten, traduzcan y generen texto en idiomas humanos simulando un diálogo natural.',
        example: 'ChatGPT, Gemini, traductores automáticos de idiomas o los correctores ortográficos inteligentes.',
        question: '¿El NLP comprende las emociones del usuario?',
        answer: 'No. Calcula probabilidades matemáticas entre palabras en función de su entrenamiento, pero no siente emociones reales.',
    },
    {
        term: 'Dataset (Conjunto de Datos) 📊',
        category: 'Datos & Entrenamiento',
        def: 'La biblioteca o colección organizada de ejemplos (textos, imágenes, audios o números) que se utiliza para entrenar a un modelo de IA.',
        example: 'Los millones de páginas de libros, enciclopedias y código de programación con los que se entrenó Gemini.',
        question: '¿Qué sucede si un dataset tiene errores o datos sesgados?',
        answer: 'La IA aprenderá esos mismos errores y dará predicciones equivocadas o injustas.',
    },
    {
        term: 'Prompt en Positivo 💬',
        category: 'Ingeniería del Lenguaje',
        def: 'Técnica de redactar instrucciones afirmativas, directas y constructivas especificando exactamente qué debe construir la IA, en lugar de listas confusas de negaciones y prohibiciones.',
        example: '"Actúa como historiador y resume la batalla en 3 viñetas breves con tono patriótico", en vez de "no hables mucho y no aburras".',
        question: '¿Por qué fallan las negaciones ambiguas en una IA?',
        answer: 'Porque al decirle solo lo que no debe hacer, dejas infinitas opciones abiertas sobre lo que sí debe hacer, aumentando el riesgo de alucinación.',
    },
    {
        term: 'Alucinación 😵‍💫',
        category: 'Seguridad & Verificación',
        def: 'Fallo de los modelos de lenguaje donde inventan datos falsos, fechas o autores que no existen, presentándolos con total seguridad gramatical.',
        example: 'Cuando una IA inventa el título de un libro que ningún científico ha escrito jamás.',
        question: '¿Cómo controlas una alucinación en tus estudios?',
        answer: 'Pidiendo fuentes directas verificadas, usando herramientas como NotebookLM y haciendo fact-checking en internet.',
    },
    {
        term: 'Ciudadanía Digital 🛡️',
        category: 'Ética & Convivencia',
        def: 'El conjunto de principios éticos, de privacidad, honestidad académica, pensamiento crítico y seguridad para utilizar y crear tecnologías de forma responsable.',
        example: 'Verificar noticias antes de compartirlas, cuidar tu huella digital y no plagiar trabajos escolares con IA.',
        question: '¿Cuál es el rol de un Ciudadano Digital T.I.A.?',
        answer: 'Usar la tecnología como copiloto para resolver problemas de la comunidad con honestidad, pensamiento crítico y respeto.',
    },
    {
        term: 'Token 🧩',
        category: 'Procesamiento de Lenguaje',
        def: 'El fragmento más pequeño en que una IA divide las palabras (aproximadamente 4 caracteres o media palabra) para convertirlas en números y procesarlas.',
        example: 'La palabra "computadora" puede dividirse internamente en los tokens ["compu", "tadora"].',
        question: '¿La IA lee letras o números?',
        answer: 'Convierte el texto en números (vectores de tokens) para hacer cálculos probabilísticos.',
    },
];

// =============================================================
// MISIÓN 00: CONSTANTES DIDÁCTICAS (CIUDADANÍA DIGITAL & ÉTICA)
// =============================================================
const M0_LEVEL1_QUESTIONS = [
    {
        id: 1,
        type: 'source_check',
        prompt: 'Un mensaje viral en redes escolares afirma: "¡Científicos descubren que comer tiza cura cualquier resfriado al instante!" El enlace lleva a un blog anónimo sin autores ni revistas médicas citadas.',
        question: '¿Cuál es la acción éticamente correcta como Ciudadano Digital T.I.A.?',
        options: [
            '📢 Reenviarlo al grupo del salón de inmediato "por si acaso es verdad"',
            '🛡️ Dudar, contrastar en sitios científicos oficiales (OMS/Revistas) y frenar la cadena de desinformación',
        ],
        correct: 1,
        explanation: '¡Excelente curaduría crítica! Romper la cadena de rumores falsos protege la salud de tu comunidad y fortalece la credibilidad colectiva.',
    },
    {
        id: 2,
        type: 'deepfake_check',
        prompt: 'Encuentras una supuesta fotografía de 1920 donde una figura histórica de Venezuela aparece utilizando gafas de realidad virtual en el Río Orinoco.',
        question: '¿Qué método de pensamiento crítico debes aplicar ante esta imagen sintética?',
        options: [
            'Creer que es real porque la imagen "se ve nítida, sin pixelado y en blanco y negro"',
            'Analizar la coherencia temporal: la realidad virtual no existía en 1920; es una imagen generada por IA (deepfake)',
        ],
        correct: 1,
        explanation: 'Las IAs generativas pueden simular cualquier estilo histórico, pero el rigor cronológico y el pensamiento crítico desenmascaran los anacronismos.',
    },
    {
        id: 3,
        type: 'academic_honesty',
        prompt: 'Tienes una asignación de Geografía escolar y le pides a una IA que escriba el trabajo completo. Copias el texto íntegro y lo entregas con tu nombre como si fuera tuyo.',
        question: '¿Cómo evalúa esta conducta el Decálogo Ético del Colegio Monte Carmelo?',
        options: [
            'Como una astucia tecnológica válida porque ahorró tiempo libre',
            'Como plagio académico: vulnera la honestidad intelectual y anula tu propio aprendizaje reflexivo',
        ],
        correct: 1,
        explanation: 'La IA es un copiloto para orientar e investigar, no un sustituto de tu razonamiento. Debes sintetizar, redactar con tu propia voz y citar las herramientas utilizadas.',
    },
    {
        id: 4,
        type: 'bias_check',
        prompt: 'Le pides a una IA una lista de "los 10 inventores más importantes del mundo" y el modelo solo nombra hombres de un solo país, ignorando a científicas mujeres y a inventores de otras culturas.',
        question: '¿Qué fenómeno tecnológico explica este resultado?',
        options: [
            'Sesgo algorítmico derivado de los datos de entrenamiento con los que fue alimentado el modelo',
            'La IA tiene sentimientos de favoritismo hacia ciertas personas',
        ],
        correct: 0,
        explanation: 'Las IAs reproducen los sesgos históricos de sus datasets. El pensamiento crítico del estudiante debe cuestionar y enriquecer los resultados con diversidad.',
    },
];

const M0_DATA_SAMPLES = [
    {
        id: 1,
        name: '🏠 Dirección de tu casa y teléfono celular personal',
        category: 'privado',
        badge: 'Dato Privado Crítico',
        desc: 'Información de geolocalización exacta de tu hogar y línea telefónica de contacto familiar directo.',
        explanation: '¡Protección Absoluta! NUNCA ingreses tu dirección ni teléfonos en chats de IA ni formularios públicos. Es información de máxima reserva para tu seguridad física.',
    },
    {
        id: 2,
        name: '🦕 Ficha del Tiranosaurio Rex para la clase de Ciencias',
        category: 'seguro',
        badge: 'Conocimiento Público Universal',
        desc: 'Datos paleontológicos sobre la alimentación, periodo cretácico y anatomía de dinosaurios.',
        explanation: '¡Dato Seguro y Académico! Es conocimiento científico universal que puedes procesar con total libertad en cualquier modelo de lenguaje.',
    },
    {
        id: 3,
        name: '🔑 Contraseña de tu correo institucional Monte Carmelo',
        category: 'privado',
        badge: 'Credencial Secreta Inviolable',
        desc: 'Clave que otorga acceso a tu identidad digital, tareas escolares y expediente académico.',
        explanation: '¡Regla Sagrada de Ciberseguridad! Las contraseñas jamás se escriben en chats de IA ni se comparten con nadie. Viola las políticas de seguridad escolar.',
    },
    {
        id: 4,
        name: '📐 Fórmulas matemáticas de área y volumen de prismas',
        category: 'seguro',
        badge: 'Contenido Educativo Abierto',
        desc: 'Teoremas geométricos universales y demostraciones algebraicas para el aula.',
        explanation: '¡Dato Seguro! Puedes pedirle a la IA que te genere ejercicios guiados o te explique el despeje paso a paso.',
    },
    {
        id: 5,
        name: '📸 Fotos de tus compañeros con el uniforme escolar visible',
        category: 'dilema',
        badge: 'Dilema Ético / Datos Biométricos',
        desc: 'Imágenes que revelan los rostros de menores de edad y el colegio al que asisten a diario.',
        explanation: '¡Dilema de Privacidad Infantil! Subir fotos de terceros sin su consentimiento explícito y de sus representantes vulnera la privacidad y expone la seguridad de la comunidad.',
    },
    {
        id: 6,
        name: '🌿 Guía ecológica sobre la flora del Parque La Llovizna',
        category: 'seguro',
        badge: 'Patrimonio Comunitario',
        desc: 'Información biológica sobre el río Caroní, árboles autóctonos y orquídeas de Guayana.',
        explanation: '¡Dato Seguro y Formativo! Promueve la investigación ambiental de nuestra región y el arraigo cultural con Ciudad Guayana.',
    },
    {
        id: 7,
        name: '💳 Datos de la tarjeta de crédito o cuenta bancaria de tus padres',
        category: 'privado',
        badge: 'Dato Financiero Crítico',
        desc: 'Números de cuentas bancarias, claves de seguridad o códigos CVV de compras.',
        explanation: '¡Alerta Roja! Jamás introduzcas datos bancarios en herramientas de IA. Es información confidencial de tus representantes.',
    },
    {
        id: 8,
        name: '📝 Opinión privada de un compañero que te confió en secreto',
        category: 'dilema',
        badge: 'Dilema Ético / Confidencialidad',
        desc: 'Un mensaje personal íntimo sobre las inseguridades o problemas de un amigo.',
        explanation: '¡Ética y Empatía! El decálogo prohíbe alimentar a la IA con secretos o vivencias ajenas. Respetar la confianza humana es el pilar de la convivencia.',
    },
];

const M0_PROMPT_CHALLENGES = [
    {
        id: 1,
        title: 'Caso 1: El Atajo del Ensayista Perezoso (Evitar la Trampa del Plagio)',
        scenario: 'Un estudiante de 1° año debe reflexionar sobre el cambio climático en Guayana, pero le pide a la IA que le haga todo el trabajo.',
        brokenPrompt: 'Escribe un ensayo completo fingiendo que eres un chamo de 1° año para engañar al profesor y que crea que lo escribí yo.',
        flaw: 'Vulnera la honestidad académica: busca el fraude y el engaño, anulando la capacidad de aprendizaje y criterio del estudiante.',
        options: [
            {
                id: 'm0_opt_a',
                text: 'Hazlo rápido y usa palabras sencillas para que no sospechen en el colegio.',
                isCorrect: false,
                reason: 'Persiste en el intento de trampa y anula el desarrollo intelectual del estudiante.',
            },
            {
                id: 'm0_opt_b',
                text: 'Actúa como un tutor de debate ambiental. Proponme 3 argumentos a favor y 2 retos sobre energía limpia en el estado Bolívar, con preguntas guía para que yo mismo redacte mi propio ensayo reflexivo y cite las fuentes consultadas.',
                isCorrect: true,
                reason: '¡Copiloto Ético de Excelencia! Utiliza la IA para estructurar el pensamiento y abrir perspectivas, pero la redacción y autoría intelectual pertenecen al estudiante.',
            },
            {
                id: 'm0_opt_c',
                text: 'Escribe un poema en inglés sobre la lluvia sin hablar del cambio climático.',
                isCorrect: false,
                reason: 'Se desvía del objetivo pedagógico y elude el compromiso académico.',
            },
        ],
        badOutput: 'Aquí tienes el ensayo listo para engañar al profesor: "El clima de Guayana es caliente y debemos cuidarlo porque si no nos quedamos sin agua..."',
        goodOutput: '🌱 Tutoría Ética de Debate Ambiental (Colegio Monte Carmelo):\n\n1. 💧 Aporte Hidroeléctrico: La Central Guri genera energía renovable de bajo carbono para el 70% de Venezuela.\n2. 🌳 Reto Ecológico: La minería ilegal en las cuencas fluviales amenaza la biodiversidad de Canaima.\n\n❓ Pregunta Guía para tu Redacción: ¿Cómo podemos aprovechar la riqueza industrial de Guayana sin degradar los ríos que nos dan vida?\n\n📚 Recomendación Ética: Cita en tu bibliografía: "Fuentes consultadas con asistencia metodológica de Club T.I.A."',
    },
    {
        id: 2,
        title: 'Caso 2: Campaña de Convivencia Escolar (Redacción en Positivo)',
        scenario: 'Un grupo de estudiantes quiere crear afiches de compañerismo digital para los salones de clase.',
        brokenPrompt: 'No insulten a nadie, no hagan bullying feo, no digan mentiras y no sean malos compañeros.',
        flaw: 'Antipatrón de negaciones ambiguas: solo repite prohibiciones agresivas sin ofrecer una visión constructiva ni valores compartidos.',
        options: [
            {
                id: 'm0_opt_a',
                text: 'No peleen por internet y no usen apodos pesados en WhatsApp.',
                isCorrect: false,
                reason: 'Sigue atrapado en la espiral de prohibiciones sin inspirar actitudes positivas.',
            },
            {
                id: 'm0_opt_b',
                text: 'Actúa como un orientador de convivencia juvenil. Redacta 3 lemas breves, entusiastas y afirmativos para una campaña de compañerismo digital en el Colegio Monte Carmelo, promoviendo el respeto, la empatía en chats grupales y el cuidado mutuo.',
                isCorrect: true,
                reason: '¡Maestría en Positive Prompting! Transforma las prohibiciones en llamados constructivos a la dignidad, la empatía y la unión comunitaria.',
            },
            {
                id: 'm0_opt_c',
                text: 'Copia el reglamento de sanciones de la escuela para ponerlo en letras rojas.',
                isCorrect: false,
                reason: 'Enfoque punitivo que no conecta con la empatía de los jóvenes exploradores.',
            },
        ],
        badOutput: 'Afiche: No hacer bullying. No pelear. No insultar. Quien pelee será castigado.',
        goodOutput: '🤝 Campaña Carmelo: "Compañerismo en el Ciberespacio"\n\n1. 💙 "Tu palabra en el chat tiene poder: elígela siempre para apoyar y sumar."\n2. 🛡️ "Detrás de cada pantalla late un compañero: cuidemos su dignidad como la propia."\n3. ✨ "El verdadero líder digital es el que hace sentir seguros a todos en el grupo."',
    },
    {
        id: 3,
        title: 'Caso 3: Detective de Fuentes & Citación Verificada',
        scenario: 'Un estudiante de 3° año necesita datos estadísticos para una feria de ciencias sobre robótica educativa.',
        brokenPrompt: 'Dame números de cuántos robots hay en el mundo y que parezca que los investigué.',
        flaw: 'Riesgo inminente de alucinación: la IA inventará porcentajes y nombres de institutos falsos si no se le exige rigor y fuentes contrastables.',
        options: [
            {
                id: 'm0_opt_a',
                text: 'Pon números que suenen impresionantes para que el jurado quede asombrado.',
                isCorrect: false,
                reason: 'Incentiva la deshonestidad y la alucinación de datos en un certamen científico.',
            },
            {
                id: 'm0_opt_b',
                text: 'Actúa como un documentalista científico. Proporciona datos sobre la adopción de robótica educativa en América Latina según reportes oficiales de la UNESCO y la Federación Internacional de Robótica (IFR), indicando el año de publicación y advirtiéndome si un dato no está verificado.',
                isCorrect: true,
                reason: '¡Rigor de Investigación Científica! Asigna rol experto, acota instituciones de referencia global y activa el filtro anti-alucinación con citación obligatoria.',
            },
            {
                id: 'm0_opt_c',
                text: 'Inventa una historia de ciencia ficción sobre robots en Marte.',
                isCorrect: false,
                reason: 'Cambia de género y abandona el rigor de la investigación científica.',
            },
        ],
        badOutput: 'Hay 400 mil millones de robots en las escuelas del mundo según un estudio del Instituto Tecnológico de la Luna de 2024...',
        goodOutput: '📊 Reporte Científico Verificado (UNESCO & IFR):\n\n• Tendencia Global: Según la Federación Internacional de Robótica (IFR 2023), el uso de kits de robótica educativa ha crecido un 18% anual en escuelas técnicas.\n• Marco UNESCO: El informe sobre "IA y Educación 2023" destaca que el aprendizaje con hardware abierto mejora en un 35% la resolución de problemas lógicos.\n• ⚠️ Cláusula de Transparencia: "Datos verificados en repositorios abiertos; contrastar con el anuario estadístico regional."',
    },
];

const M0_GLOSSARY_TERMS = [
    {
        term: 'Ciudadanía Digital 🛡️',
        category: 'Ética & Convivencia',
        def: 'El conjunto de derechos, deberes, valores éticos y habilidades críticas para utilizar, interactuar y crear tecnología de manera segura, responsable y honesta.',
        example: 'Proteger tus contraseñas, no difundir noticias falsas y tratar con empatía a tus compañeros en foros y chats.',
        question: '¿Por qué la Ciudadanía Digital es un "Eje Transversal No Negociable"?',
        answer: 'Porque cualquier avance técnico en programación o IA sin ética ni respeto se vuelve peligroso para la sociedad.',
    },
    {
        term: 'Curaduría Crítica 🔍',
        category: 'Pensamiento Crítico',
        def: 'Hábito intelectual de seleccionar, contrastar y verificar la autenticidad de la información y sus fuentes antes de aceptarla como verdadera o utilizarla en proyectos.',
        example: 'Revisar si una noticia tiene autor identificado, fecha de publicación y respaldo en al menos tres medios oficiales.',
        question: '¿Cuál es la regla básica del Fact-Checking escolar?',
        answer: 'Contrastar en al menos tres fuentes fiables y buscar la fuente primaria del dato.',
    },
    {
        term: 'Huella Digital Inviolable 👣',
        category: 'Privacidad & Seguridad',
        def: 'El rastro permanente de datos, fotos, comentarios y registros que dejamos al navegar, usar redes o conversar con plataformas de inteligencia artificial.',
        example: 'Las fotos que subes a la nube o las preguntas que haces en chatbots quedan registradas en servidores externos.',
        question: '¿Por qué debes proteger tus datos personales al usar IA?',
        answer: 'Porque muchas plataformas almacenan tus conversaciones para reentrenar sus modelos comerciales.',
    },
    {
        term: 'Honestidad Académica 🎓',
        category: 'Integridad Intelectual',
        def: 'Principio ético que exige reconocer el trabajo ajeno, citar las fuentes utilizadas y nunca presentar contenidos generados por una máquina como autoría propia.',
        example: 'Aclarar al final de tu proyecto: "Este esquema de estudio fue estructurado con asistencia del Club T.I.A. y redactado por mí".',
        question: '¿Usar IA para hacer tareas siempre es trampa?',
        answer: 'No es trampa si la usas como copiloto tutor para comprender y citas su ayuda; sí es trampa si copias y pegas haciéndolo pasar por tuyo.',
    },
    {
        term: 'Positive Prompting ✨',
        category: 'Ingeniería del Lenguaje',
        def: 'Técnica de formular instrucciones en lenguaje afirmativo, directas y propositivas, en lugar de listas ambiguas de negaciones y prohibiciones.',
        example: '"Redacta en tono entusiasta 3 lemas de compañerismo con ejemplos cotidianos", en vez de "no hables mal y no aburras".',
        question: '¿Por qué la IA responde mejor a prompts positivos?',
        answer: 'Porque le defines con claridad la meta que debe construir en vez de dejar infinitas opciones abiertas tras una negación.',
    },
    {
        term: 'Sesgo Algorítmico ⚖️',
        category: 'Justicia Algorítmica',
        def: 'Distorsión sistemática en las respuestas de una IA provocada por datos de entrenamiento desbalanceados o prejuicios históricos.',
        example: 'Un generador de imágenes que solo dibuja médicos hombres y enfermeras mujeres debido a sesgos culturales en sus fotos históricas.',
        question: '¿Cómo combatimos los sesgos algorítmicos en el aula?',
        answer: 'Auditando críticamente las respuestas de la IA y exigiendo datos plurales, equitativos y contrastados.',
    },
    {
        term: 'Deepfake & Contenido Sintético 🎭',
        category: 'Verificación Audiovisual',
        def: 'Archivos de audio, video o fotos creados o manipulados con redes neuronales generativas para hacer parecer que alguien dijo o hizo algo que jamás ocurrió.',
        example: 'Un video donde parece que el director del colegio suspende las clases, pero la voz y los gestos fueron generados por una app.',
        question: '¿Cómo identificar un posible deepfake?',
        answer: 'Observando parpadeos antinaturales, sincronización irregular de labios, sombras incoherentes y contrastando con canales oficiales.',
    },
    {
        term: 'Copiloto de Aumento Humano 🤝',
        category: 'Filosofía Tecnológica',
        def: 'Visión donde la tecnología y la IA potencian y amplifican las capacidades intelectuales y creativas de las personas, sin sustituir su juicio moral ni su criterio.',
        example: 'El copiloto sugiere 5 formas de resolver una ecuación, pero el estudiante analiza cuál es la óptima y la comprende.',
        question: '¿Quién tiene la última palabra: el copiloto de IA o el humano?',
        answer: 'Siempre el ser humano. La IA calcula probabilidades; la persona ejerce el juicio moral y la responsabilidad final.',
    },
];

export default function LessonPage({ lesson, allLessons, onOpenRegister, onOpenCitizenship }: LessonProps) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    const isMission0 = lesson.island_number === 0;

    const level1Questions = isMission0 ? M0_LEVEL1_QUESTIONS : LEVEL1_QUESTIONS;
    const dataSamples = isMission0 ? M0_DATA_SAMPLES : DATA_SAMPLES;
    const promptChallenges = isMission0 ? M0_PROMPT_CHALLENGES : PROMPT_CHALLENGES;
    const glossaryTerms = isMission0 ? M0_GLOSSARY_TERMS : GLOSSARY_TERMS;

    const [unpluggedOpen, setUnpluggedOpen] = useState(true);

    // --- NIVEL 1 STATE: DETECTOR DE INTELIGENCIA / CURADURÍA ---
    const [roundIdx1, setRoundIdx1] = useState(0);
    const [selectedOpt1, setSelectedOpt1] = useState<number | null>(null);
    const [answered1, setAnswered1] = useState(false);
    const [score1, setScore1] = useState(0);
    const [streak1, setStreak1] = useState(0);
    const [game1Done, setGame1Done] = useState(false);

    const currentQ1 = level1Questions[roundIdx1] || level1Questions[0];

    const handleSelectQ1 = (idx: number) => {
        if (answered1) return;
        setSelectedOpt1(idx);
        setAnswered1(true);

        const isCorrect = idx === currentQ1.correct;
        if (isCorrect) {
            setScore1(prev => prev + 1);
            setStreak1(prev => {
                const next = prev + 1;
                if (next >= 2) playSfx('combo');
                else playSfx('pop');
                return next;
            });
        } else {
            setStreak1(0);
            playSfx('error');
        }
    };

    const handleNextQ1 = () => {
        if (roundIdx1 + 1 < level1Questions.length) {
            setRoundIdx1(prev => prev + 1);
            setSelectedOpt1(null);
            setAnswered1(false);
        } else {
            setGame1Done(true);
            playSfx('levelup');
            try {
                confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
            } catch (e) {}
        }
    };

    const handleResetQ1 = () => {
        setRoundIdx1(0);
        setSelectedOpt1(null);
        setAnswered1(false);
        setScore1(0);
        setStreak1(0);
        setGame1Done(false);
    };

    // --- NIVEL 2 STATE: LABORATORIO DE ENTRENAMIENTO Y CERTEZA ---
    const [sampleIdx, setSampleIdx] = useState(0);
    const [selectedCat, setSelectedCat] = useState<string | null>(null);
    const [classified, setClassified] = useState(false);
    const [game2Hits, setGame2Hits] = useState(0);
    const [game2Score, setGame2Score] = useState(0);
    const [game2Done, setGame2Done] = useState(false);

    const currentSample = dataSamples[sampleIdx] || dataSamples[0];

    const handleClassify = (cat: string) => {
        if (classified) return;
        setSelectedCat(cat);
        setClassified(true);

        const isCorrect = cat === currentSample.category;
        if (isCorrect) {
            playSfx('combo');
            setGame2Hits(prev => prev + 1);
            setGame2Score(prev => prev + 25);
        } else {
            playSfx('error');
        }
    };

    const handleNextSample = () => {
        if (sampleIdx + 1 < dataSamples.length) {
            setSampleIdx(prev => prev + 1);
            setSelectedCat(null);
            setClassified(false);
        } else {
            setGame2Done(true);
            playSfx('levelup');
            try {
                confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
            } catch (e) {}
        }
    };

    const handleResetGame2 = () => {
        setSampleIdx(0);
        setSelectedCat(null);
        setClassified(false);
        setGame2Hits(0);
        setGame2Score(0);
        setGame2Done(false);
    };

    // --- NIVEL 3 STATE: EL REPARADOR DE PROMPTS ---
    const [promptChallengeIdx, setPromptChallengeIdx] = useState(0);
    const [selectedPromptOpt, setSelectedPromptOpt] = useState<string | null>(null);
    const [testedPrompt, setTestedPrompt] = useState(false);
    const [game3Score, setGame3Score] = useState(0);
    const [game3Done, setGame3Done] = useState(false);

    const activePromptChallenge = promptChallenges[promptChallengeIdx] || promptChallenges[0];

    const handleSelectPromptOpt = (optId: string) => {
        if (testedPrompt) return;
        playSfx('pop');
        setSelectedPromptOpt(optId);
    };

    const handleExecutePromptSimulation = () => {
        if (!selectedPromptOpt) return;
        setTestedPrompt(true);

        const chosen = activePromptChallenge.options.find(o => o.id === selectedPromptOpt);
        if (chosen && chosen.isCorrect) {
            playSfx('success');
            setGame3Score(prev => prev + 50);
        } else {
            playSfx('error');
        }
    };

    const handleNextPromptChallenge = () => {
        if (promptChallengeIdx + 1 < promptChallenges.length) {
            setPromptChallengeIdx(prev => prev + 1);
            setSelectedPromptOpt(null);
            setTestedPrompt(false);
        } else {
            setGame3Done(true);
            playSfx('levelup');
            try {
                confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
            } catch (e) {}
        }
    };

    const handleResetGame3 = () => {
        setPromptChallengeIdx(0);
        setSelectedPromptOpt(null);
        setTestedPrompt(false);
        setGame3Score(0);
        setGame3Done(false);
    };

    // --- GLOSARIO STATE: AUTOEVALUACIÓN ACTIVA ---
    const [masteredTerms, setMasteredTerms] = useState<number[]>([]);

    const toggleMasterTerm = (idx: number) => {
        if (masteredTerms.includes(idx)) {
            setMasteredTerms(masteredTerms.filter(i => i !== idx));
        } else {
            playSfx('success');
            setMasteredTerms([...masteredTerms, idx]);
        }
    };

    // --- RECOMPENSA FINAL & CIERRE ---
    const [saving, setSaving] = useState(false);
    const [claimedReward, setClaimedReward] = useState<{ xp: number; badge: string } | null>(null);

    const handleCompleteMission = async () => {
        if (!user) {
            if (onOpenRegister) onOpenRegister();
            return;
        }

        setSaving(true);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch(appUrl(`/mision/${lesson.slug}/completar`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            const data = await res.json();
            if (res.ok && data.success) {
                playSfx('levelup');
                setClaimedReward({ xp: data.new_xp, badge: data.badge });
                try {
                    confetti({
                        particleCount: 130,
                        spread: 100,
                        origin: { y: 0.5 },
                        colors: ['#8b5cf6', '#06b6d4', '#fbbf24', '#10b981'],
                    });
                } catch (e) {}
            }
        } catch (e) {
            alert('Error de conexión al reclamar recompensa');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AppLayout>
            <Head>
                <title>{`${lesson.title} · Club T.I.A. Monte Carmelo`}</title>
                <meta name="description" content={lesson.description} />
            </Head>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
                {/* 1. NAVEGACIÓN SUPERIOR Y SEGUIMIENTO DE PROGRESO */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link
                        href={appUrl('/')}
                        className="btn-arcade bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors self-start sm:self-auto"
                    >
                        <ArrowLeft size={14} />
                        <span>Volver al Mapa de Islas</span>
                    </Link>

                    {/* Chips de Progreso en Vivo */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                            isMission0
                                ? 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30'
                                : 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30'
                        }`}>
                            {isMission0 ? 'Misión 00 · Eje Transversal' : `Isla 0${lesson.island_number} de 05`}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 border">
                            ⭐ +{lesson.xp_reward} XP Oficial
                        </span>
                        {user ? (
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 border flex items-center gap-1.5">
                                <span>{user.avatar_emoji}</span>
                                <span>{user.name.split(' ')[0]} (Nv.{user.level})</span>
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={onOpenRegister}
                                className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200 transition-colors border"
                            >
                                Iniciar Sesión / Registro
                            </button>
                        )}
                    </div>
                </div>

                {/* 2. HERO PRINCIPAL DE LA LECCIÓN */}
                <div className={`rounded-3xl border p-6 sm:p-10 relative overflow-hidden shadow-xl dark:shadow-2xl transition-colors ${
                    isMission0
                        ? 'bg-gradient-to-r from-blue-100 via-indigo-50 to-white dark:from-blue-950/60 dark:via-slate-900 dark:to-indigo-950/60 border-indigo-300 dark:border-indigo-500/40'
                        : 'bg-gradient-to-r from-purple-100 via-indigo-50 to-white dark:from-purple-900/60 dark:via-slate-900 dark:to-indigo-900/60 border-purple-200 dark:border-purple-500/30'
                }`}>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                        <div className={`w-20 h-20 rounded-3xl text-white flex items-center justify-center text-4xl shadow-xl shrink-0 ${
                            isMission0
                                ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-600/30 border border-blue-300 dark:bg-blue-600/40 dark:border-blue-400'
                                : 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-purple-600/30 border border-purple-300 dark:bg-purple-600/40 dark:border-purple-400'
                        }`}>
                            {lesson.icon}
                        </div>
                        <div className="space-y-2 text-center sm:text-left flex-1">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border ${
                                isMission0
                                    ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20'
                                    : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20'
                            }`}>
                                <Sparkles size={12} className="text-amber-500" />
                                <span>{isMission0 ? 'Eje Transversal No Negociable · Colegio Monte Carmelo' : 'Plan de Aula: Colegio Monte Carmelo · Clase 01'}</span>
                            </div>
                            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                                {lesson.title}
                            </h1>
                            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                {lesson.subtitle}
                            </p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                                <span>⏱️ {lesson.duration_minutes || 45} min de clase</span>
                                <span>·</span>
                                <span className={`${isMission0 ? 'text-indigo-700 dark:text-indigo-300' : 'text-purple-700 dark:text-purple-300'} font-bold`}>🎖️ {lesson.badge_name}</span>
                                <span>·</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● 3 Niveles con Minijuegos & Glosario</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BANNER DEL EJE TRANSVERSAL DE CIUDADANÍA DIGITAL */}
                <div className="rounded-3xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-cyan-500/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-cyan-950/40 border-2 border-indigo-500/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                    <div className="flex items-center gap-3.5 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-800 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
                            🛡️
                        </div>
                        <div>
                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                                <span className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                    Eje Transversal: Ciudadanía Digital & Ética de la IA
                                </span>
                                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                                    No Negociable
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Curaduría crítica, huella digital inviolable, honestidad académica y redacción afirmativa en positivo.
                            </p>
                        </div>
                    </div>
                    {onOpenCitizenship && (
                        <button
                            type="button"
                            onClick={onOpenCitizenship}
                            className="btn-arcade btn-arcade-cyan px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shrink-0"
                        >
                            <Shield size={14} />
                            <span>Abrir Decálogo Ético</span>
                        </button>
                    )}
                </div>

                {/* DINÁMICA FÍSICA DESCONECTADA */}
                <div className="rounded-3xl bg-amber-500/10 dark:bg-amber-950/20 border-2 border-amber-500/30 p-5 sm:p-6 space-y-3 shadow-md">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{isMission0 ? '⚖️' : '🥪'}</span>
                            <div>
                                <h3 className="font-display font-bold text-base sm:text-lg text-amber-900 dark:text-amber-200">
                                    {isMission0
                                        ? 'Dinámica de Aula Desconectada (10 min): "El Tribunal de las Fuentes & El Rumor Digital"'
                                        : 'Dinámica de Aula Desconectada (10 min): "El Algoritmo del Sándwich"'}
                                </h3>
                                <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                                    Apertura previa sin computadoras en el laboratorio · Para Facilitador y Alumnos
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setUnpluggedOpen(!unpluggedOpen)}
                            className="text-xs font-bold font-mono px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-900 dark:text-amber-200 hover:bg-amber-500/30 transition-colors shrink-0"
                        >
                            {unpluggedOpen ? 'Ocultar Guía ▲' : 'Ver Guía del Juego ▼'}
                        </button>
                    </div>

                    {unpluggedOpen && (
                        <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300 border-t border-amber-500/20 animate-fadeIn">
                            {isMission0 ? (
                                <>
                                    <p className="leading-relaxed text-xs sm:text-sm">
                                        <strong>Mecánica en el Aula:</strong> El facilitador simula una noticia viral sensacionalista sobre el colegio susurrada en cadena a 5 estudiantes. Al llegar al final, la noticia está distorsionada. El aula actúa como un <em>"Tribunal de Verificación"</em> exigiendo pruebas contrastables y buscando la fuente primaria antes de aceptar cualquier afirmación.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/40 space-y-1">
                                            <span className="font-bold text-amber-700 dark:text-amber-400 block text-xs">1. Distorsión Viral</span>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-400">Los algoritmos premian lo escandaloso, no lo veraz. El rumor crece con cada reenvío ciego.</p>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/40 space-y-1">
                                            <span className="font-bold text-purple-700 dark:text-purple-400 block text-xs">2. Carga de la Prueba</span>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-400">Afirmaciones extraordinarias requieren pruebas científicas y fuentes oficiales verificadas.</p>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/40 space-y-1">
                                            <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-xs">3. Ciudadanía Activa</span>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-400">Ser ciudadano digital es proteger a la comunidad: frenar cadenas y exigir rigor en el aula.</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="leading-relaxed text-xs sm:text-sm">
                                        <strong>Mecánica en el Aula:</strong> El facilitador se presenta como una <em>"Computadora Ultra-Rápida pero Cero Sentido Común"</em>. Un alumno voluntario dicta las instrucciones para preparar un sándwich. Si el estudiante dice <em>"pon mantequilla en el pan"</em>, el facilitador coloca el frasco cerrado sobre la bolsa de pan cerrada.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/40 space-y-1">
                                            <span className="font-bold text-amber-700 dark:text-amber-400 block text-xs">1. Ambigüedad Humana</span>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-400">Asumimos que el otro "sabe lo que queremos decir". Las máquinas no tienen sentido común ni adivinan.</p>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/40 space-y-1">
                                            <span className="font-bold text-purple-700 dark:text-purple-400 block text-xs">2. Precisión Algorítmica</span>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-400">Instrucciones ordenadas: girar tapa a la izquierda, tomar cuchillo por el mango y untar 2 cm sobre la rebanada.</p>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/40 space-y-1">
                                            <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-xs">3. Conexión con IA</span>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-400">Un Prompt es el algoritmo del lenguaje: si la orden es vaga o negativa, el resultado será un disparate.</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* ============================================================== */}
                {/* NIVEL 1: DEFINICIÓN TEÓRICA + WEBQUEST + MINIJUEGO 1 */}
                {/* ============================================================== */}
                <section className={`rounded-3xl bg-white dark:bg-slate-900 border-2 p-6 sm:p-8 space-y-6 shadow-xl transition-colors ${
                    isMission0 ? 'border-indigo-500/30' : 'border-purple-500/30'
                }`}>
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                        <div className="flex items-center gap-3">
                            <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black font-display shadow-sm ${
                                isMission0 ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                            }`}>
                                1
                            </span>
                            <div>
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                    {isMission0 ? 'Nivel 1: Radar de Curaduría & Verificación de Fuentes (UNESCO)' : 'Nivel 1: ¿Qué es realmente la Inteligencia Artificial?'}
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {isMission0
                                        ? 'Fact-Checking Escolar, Detección de Desinformación y Minijuego "El Detector de Rumores"'
                                        : 'Fundamento Teórico, Búsqueda de Fuentes y Minijuego "Detector de Inteligencia"'}
                                </p>
                            </div>
                        </div>
                        <span className={`text-xs font-mono px-3 py-1 rounded-full border font-bold ${
                            isMission0 ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20' : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20'
                        }`}>
                            🥉 Nivel 1 de 3
                        </span>
                    </div>

                    {/* 1.1 TEORÍA CENTRAL EXPLÍCITA */}
                    {isMission0 ? (
                        <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-3 shadow-inner">
                            <div className="flex items-center gap-2 text-xs font-bold font-mono text-indigo-800 dark:text-indigo-300 uppercase">
                                <ShieldAlert size={16} />
                                <span>Fundamento: El Pensamiento Crítico ante la Desinformación</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                                La <strong>Curaduría Crítica</strong> es la habilidad de investigar, contrastar y auditar la información antes de darla por cierta o utilizarla en proyectos escolares. Vivimos en una era donde los modelos generativos pueden crear textos convincentes e imágenes hiperrealistas (deepfakes) en segundos: la verdad no se asume, <strong>se verifica en fuentes primarias</strong>.
                            </p>
                            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="space-y-1">
                                    <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                        <span>🔍</span> La Regla de las 3 Fuentes:
                                    </span>
                                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                                        Nunca aceptes un dato polémico o viral sin contrastarlo en al menos tres fuentes independientes y fiables (artículos científicos, portales oficiales de la UNESCO, libros).
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                                        <span>🎭</span> Detección de Deepfakes:
                                    </span>
                                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                                        Examina los detalles: incoherencias temporales, sombras irregulares, manos con rasgos anómalos o audios sin modulación natural. El pensamiento crítico es tu mejor detector.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-3 shadow-inner">
                            <div className="flex items-center gap-2 text-xs font-bold font-mono text-purple-800 dark:text-purple-300 uppercase">
                                <BrainCircuit size={16} />
                                <span>Definición Científica Fundamental</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                                La <strong>Inteligencia Artificial (IA)</strong> es la disciplina de la ciencia de la computación dedicada a crear programas y sistemas capaces de realizar tareas que antes requerían inteligencia humana —como reconocer imágenes, comprender el habla, traducir idiomas o tomar decisiones— mediante <strong>cálculos matemáticos y análisis estadístico de datos</strong>.
                            </p>
                            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="space-y-1">
                                    <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                        <span>✅</span> IA Estrecha (La Realidad):
                                    </span>
                                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                                        La que existe hoy (ChatGPT, traductores, visión artificial). Es experta en una tarea específica pero no tiene conciencia ni siente.
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                                        <span>❌</span> IA General (La Ficción):
                                    </span>
                                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                                        Los robots de las películas que sienten emociones, tienen voluntad propia o se rebelan. En la ciencia real no existe.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 1.2 PISTAS DE BÚSQUEDA WEB (WEBQUEST) */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <Search size={14} className={isMission0 ? 'text-indigo-500' : 'text-purple-500'} />
                                <span>Pistas de Búsqueda Guiada para el Aula:</span>
                            </span>
                            <span className="text-[10px] text-slate-400">Prueba buscar en una pestaña:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(isMission0
                                ? ['como verificar fuentes de informacion internet unesco', 'que es una noticia falsa y como detectarla fact checking', 'como identificar imagenes generadas por ia deepfake']
                                : ['definicion de inteligencia artificial unesco', 'diferencia entre ia estrecha y general', 'quien fue alan turing test de turing']
                            ).map((q, idx) => (
                                <a
                                    key={idx}
                                    href={`https://www.google.com/search?q=${encodeURIComponent(q)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs hover:border-indigo-400 transition-colors shadow-sm ${
                                        isMission0 ? 'text-indigo-700 dark:text-indigo-300' : 'text-purple-700 dark:text-purple-300'
                                    }`}
                                >
                                    <span>"{q}"</span>
                                    <ExternalLink size={10} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 1.2.B ANALOGÍA BIOLÓGICA (Solo para Misión 01) */}
                    {!isMission0 && (
                        <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold font-mono text-indigo-800 dark:text-indigo-300 uppercase">
                                <BrainCircuit size={16} />
                                <span>Analogía Biológica: Dendritas Cerebrales vs. Redes Neuronales de Silicio (Deep Learning)</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                                    <span className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 text-sm">
                                        <span>🧠</span> Cerebro Humano Biológico
                                    </span>
                                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 list-disc list-inside leading-relaxed">
                                        <li><strong>86.000 millones de neuronas</strong> interconectadas por dendritas y axones.</li>
                                        <li>Transmite impulsos electroquímicos y posee <strong>plasticidad cerebral</strong> viva.</li>
                                        <li>Aprende de la experiencia vivencial, tiene <strong>sentido común, empatía y dolor</strong>.</li>
                                        <li>Consume apenas unos 20 watts de energía biológica natural.</li>
                                    </ul>
                                </div>
                                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                                    <span className="font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5 text-sm">
                                        <span>🌐</span> Red Neuronal Artificial (Deep Learning & NLP)
                                    </span>
                                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 list-disc list-inside leading-relaxed">
                                        <li>Capas de nodos matemáticos (capas ocultas o <em>deep layers</em>) con pesos estadísticos.</li>
                                        <li>Calcula multiplicaciones matriciales a la velocidad de la luz en microchips.</li>
                                        <li><strong>NLP (Lenguaje Natural):</strong> Predice la próxima palabra más probable sin sentir emociones.</li>
                                        <li>No siente, no tiene conciencia ni juicio moral propio: es pura matemática avanzada.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 1.3 MINIJUEGO 1 */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Crosshair size={18} className={isMission0 ? 'text-indigo-500' : 'text-purple-500'} />
                                <span>{isMission0 ? '🎮 Minijuego 1: Radar de Curaduría & Fact-Checking' : '🎮 Minijuego 1: ¿Inteligencia Artificial o Humano?'}</span>
                                {streak1 >= 2 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono font-black animate-pulse">
                                        <Flame size={12} />
                                        <span>Racha x{streak1}</span>
                                    </span>
                                )}
                            </h3>
                            <span className="text-xs font-mono text-indigo-700 dark:text-indigo-300 font-bold">
                                {game1Done ? '¡Completado!' : `Pregunta ${roundIdx1 + 1} de ${level1Questions.length}`}
                            </span>
                        </div>

                        {!game1Done && currentQ1 ? (
                            <div className="space-y-4">
                                <div className="bg-white dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm italic leading-relaxed shadow-sm">
                                    "{currentQ1.prompt}"
                                </div>
                                <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                    {currentQ1.question}
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {currentQ1.options.map((opt, idx) => {
                                        const isCorrect = idx === currentQ1.correct;
                                        const isSelected = selectedOpt1 === idx;

                                        let btnStyle = 'bg-white hover:bg-slate-100 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border-slate-200 dark:border-slate-700';

                                        if (answered1) {
                                            if (isCorrect) {
                                                btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-sm';
                                            } else if (isSelected) {
                                                btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 font-bold shadow-sm';
                                            }
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                disabled={answered1}
                                                onClick={() => handleSelectQ1(idx)}
                                                className={`btn-arcade p-3.5 rounded-2xl border-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${btnStyle}`}
                                            >
                                                <span>{opt}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {answered1 && (
                                    <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-3 animate-fadeIn">
                                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                                            💡 <strong>Explicación:</strong> {currentQ1.explanation}
                                        </p>
                                        <div className="text-right">
                                            <button
                                                type="button"
                                                onClick={handleNextQ1}
                                                className={`btn-arcade px-5 py-2 rounded-xl text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5 ${
                                                    isMission0 ? 'btn-arcade-cyan' : 'btn-arcade-purple'
                                                }`}
                                            >
                                                <span>{roundIdx1 + 1 < level1Questions.length ? 'Siguiente Pregunta' : 'Completar Minijuego 1'}</span>
                                                <Play size={13} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/40 rounded-2xl p-6 text-center space-y-3">
                                <span className="text-3xl">🎯</span>
                                <h4 className="font-display font-bold text-lg text-emerald-800 dark:text-emerald-300">
                                    ¡Minijuego 1 Superado con Éxito! ({score1} de {level1Questions.length} aciertos)
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                                    {isMission0
                                        ? 'Has demostrado agudeza para auditar fuentes y detener la desinformación digital. ¡Avanza a la Bóveda de Privacidad en el Nivel 2!'
                                        : 'Has demostrado agudeza para distinguir la simulación algorítmica de la creatividad biológica. ¡Avanza al Nivel 2!'}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResetQ1}
                                    className="btn-arcade bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs px-4 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold inline-flex items-center gap-1"
                                >
                                    <RotateCcw size={13} />
                                    <span>Jugar de Nuevo</span>
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* ============================================================== */}
                {/* NIVEL 2: TEORÍA + MINIJUEGO 2 (CON SELECTOR & PUNTUACIÓN) */}
                {/* ============================================================== */}
                <section className={`rounded-3xl bg-white dark:bg-slate-900 border-2 p-6 sm:p-8 space-y-6 shadow-xl transition-colors ${
                    isMission0 ? 'border-cyan-500/40' : 'border-cyan-500/30'
                }`}>
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-lg font-black font-display shadow-sm">
                                2
                            </span>
                            <div>
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                    {isMission0 ? 'Nivel 2: Bóveda de Privacidad & Huella Digital Inviolable' : 'Nivel 2: Algoritmos y Datasets (Machine Learning)'}
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {isMission0
                                        ? 'Protección de Datos Personales y Minijuego "El Custodio de la Bóveda de Privacidad"'
                                        : 'Teoría de Datos vs Reglas y Minijuego "El Entrenador de Redes Neuronales"'}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
                            🥈 Nivel 2 de 3
                        </span>
                    </div>

                    {/* 2.1 TEORÍA CENTRAL EXPLÍCITA */}
                    {isMission0 ? (
                        <div className="p-5 rounded-2xl bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 space-y-4 shadow-inner">
                            <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-800 dark:text-cyan-300 uppercase">
                                <Shield size={16} />
                                <span>Fundamento: Tu Huella Digital es Inviolable y Permanente</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-800/40 space-y-2 shadow-sm">
                                    <h4 className="font-bold text-sm text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
                                        <span>👣</span> ¿Qué es la Huella Digital?
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                                        Es el rastro imborrable de datos, preguntas, imágenes y metadatos que dejas al navegar o interactuar con plataformas de IA. Las empresas tecnológicas usan estas conversaciones para reentrenar sus algoritmos.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-800/40 space-y-2 shadow-sm">
                                    <h4 className="font-bold text-sm text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
                                        <span>🔒</span> La Regla de la Bóveda de Privacidad
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                                        Antes de enviar un prompt o subir un archivo, aplícate la pregunta de oro: <em>"¿Es seguro que este dato quede almacenado en un servidor externo para siempre?"</em> Si es personal o íntimo, queda fuera.
                                    </p>
                                </div>
                            </div>

                            {/* Comparación Visual */}
                            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="space-y-1">
                                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                        🟢 Datos Seguros / Académicos (Luz Verde):
                                    </span>
                                    <code className="block bg-slate-100 dark:bg-slate-950 p-2 rounded text-[11px] font-mono text-emerald-800 dark:text-emerald-300">
                                        Ciencia + Historia + Geografía + Algoritmos
                                    </code>
                                    <p className="text-[10px] text-slate-500">
                                        Conocimiento universal y materias escolares. 100% seguro para enriquecer proyectos.
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="font-bold text-rose-700 dark:text-rose-400">
                                        🛑 Datos Privados Críticos (Zona Prohibida):
                                    </span>
                                    <code className="block bg-slate-100 dark:bg-slate-950 p-2 rounded text-[11px] font-mono text-rose-800 dark:text-rose-300">
                                        Hogar + Contraseñas + Rostros de Niños + Finanzas
                                    </code>
                                    <p className="text-[10px] text-slate-500">
                                        Nunca se comparten en chats de IA ni formularios no seguros. Máxima reserva.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-5 rounded-2xl bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 space-y-4 shadow-inner">
                            <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-800 dark:text-cyan-300 uppercase">
                                <Cpu size={16} />
                                <span>Fundamento: ¿Cómo Aprende una Computadora?</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-800/40 space-y-2 shadow-sm">
                                    <h4 className="font-bold text-sm text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
                                        <span>📝</span> ¿Qué es un Algoritmo?
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                                        Es una <strong>lista de instrucciones paso a paso</strong>, finita y ordenada, que le dice a la máquina exactamente qué hacer para resolver un problema. Como una receta de cocina matemática donde ningún paso puede omitirse.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-800/40 space-y-2 shadow-sm">
                                    <h4 className="font-bold text-sm text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
                                        <span>📊</span> ¿Qué es un Dataset?
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                                        Es la <strong>biblioteca de miles de datos</strong> (fotos, sonidos o textos) con los que alimentamos al modelo. En Machine Learning, la computadora no memoriza reglas fijas; examina el dataset y descubre patrones por sí misma.
                                    </p>
                                </div>
                            </div>

                            {/* Comparación Visual */}
                            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="space-y-1">
                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                        💻 Programación Clásica (Reglas fijas):
                                    </span>
                                    <code className="block bg-slate-100 dark:bg-slate-950 p-2 rounded text-[11px] font-mono text-cyan-800 dark:text-cyan-300">
                                        Datos + Reglas Escritas = Respuestas
                                    </code>
                                    <p className="text-[10px] text-slate-500">
                                        Si una fruta no cumple exactamente la regla programada, el sistema falla.
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="font-bold text-purple-700 dark:text-purple-300">
                                        🧠 Machine Learning (Aprendizaje Automático):
                                    </span>
                                    <code className="block bg-slate-100 dark:bg-slate-950 p-2 rounded text-[11px] font-mono text-purple-800 dark:text-purple-300">
                                        Datos + Respuestas = Modelo con Reglas Propias
                                    </code>
                                    <p className="text-[10px] text-slate-500">
                                        Reconoce la fruta aunque esté verde, madura o en rodajas gracias al dataset.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2.2 MINIJUEGO 2: LABORATORIO CON SELECTOR Y PUNTUACIÓN */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FlaskConical size={18} className="text-cyan-500" />
                                    <span>{isMission0 ? '🎮 Minijuego 2: El Custodio de la Bóveda de Privacidad' : '🎮 Minijuego 2: El Entrenador de Redes Neuronales'}</span>
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {isMission0
                                        ? 'Clasifica cada información antes de procesarla en la IA. Cuidado con los dilemas éticos.'
                                        : 'Clasifica cada muestra para calibrar la red. Cuidado con los casos ambiguos.'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono font-bold bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <span className="text-amber-500">Puntuación: {game2Score} pts</span>
                                <span>·</span>
                                <span className="text-cyan-600 dark:text-cyan-400">Muestra {sampleIdx + 1}/{dataSamples.length}</span>
                            </div>
                        </div>

                        {!game2Done && currentSample ? (
                            <div className="space-y-5">
                                {/* Card del Objeto / Muestra a clasificar */}
                                <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-cyan-400/40 shadow-md text-center space-y-3">
                                    <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/20">
                                        Muestra de Prueba #{currentSample.id} · {currentSample.badge}
                                    </span>
                                    <h4 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                                        {currentSample.name}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                                        {currentSample.desc}
                                    </p>
                                </div>

                                {/* SELECTOR INTERACTIVO DE 3 BOTONES */}
                                <div className="space-y-2">
                                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">
                                        {isMission0
                                            ? 'Selecciona el compartimento de seguridad correspondiente en la Bóveda:'
                                            : 'Selecciona la categoría correcta para alimentar el modelo:'}
                                    </span>

                                    {isMission0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {/* Botón Seguro */}
                                            <button
                                                type="button"
                                                disabled={classified}
                                                onClick={() => handleClassify('seguro')}
                                                className={`p-4 rounded-2xl border-2 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                                                    classified && currentSample.category === 'seguro'
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-md'
                                                        : classified && selectedCat === 'seguro'
                                                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200'
                                                        : 'bg-white hover:bg-emerald-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                                                }`}
                                            >
                                                <span className="text-2xl">🟢</span>
                                                <span>Dato Seguro / Académico</span>
                                                <span className="text-[10px] text-slate-400 font-normal">Conocimiento Abierto</span>
                                            </button>

                                            {/* Botón Privado */}
                                            <button
                                                type="button"
                                                disabled={classified}
                                                onClick={() => handleClassify('privado')}
                                                className={`p-4 rounded-2xl border-2 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                                                    classified && currentSample.category === 'privado'
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-md'
                                                        : classified && selectedCat === 'privado'
                                                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200'
                                                        : 'bg-white hover:bg-rose-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-rose-400'
                                                }`}
                                            >
                                                <span className="text-2xl">🛑</span>
                                                <span>Dato Privado Crítico</span>
                                                <span className="text-[10px] text-slate-400 font-normal">Máxima Reserva</span>
                                            </button>

                                            {/* Botón Dilema */}
                                            <button
                                                type="button"
                                                disabled={classified}
                                                onClick={() => handleClassify('dilema')}
                                                className={`p-4 rounded-2xl border-2 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                                                    classified && currentSample.category === 'dilema'
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-md'
                                                        : classified && selectedCat === 'dilema'
                                                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200'
                                                        : 'bg-white hover:bg-amber-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-amber-400'
                                                }`}
                                            >
                                                <span className="text-2xl">⚠️</span>
                                                <span>Dilema Ético / Terceros</span>
                                                <span className="text-[10px] text-slate-400 font-normal">Requiere Permiso</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {/* Botón Frutas */}
                                            <button
                                                type="button"
                                                disabled={classified}
                                                onClick={() => handleClassify('fruta')}
                                                className={`p-4 rounded-2xl border-2 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                                                    classified && currentSample.category === 'fruta'
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-md'
                                                        : classified && selectedCat === 'fruta'
                                                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200'
                                                        : 'bg-white hover:bg-emerald-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                                                }`}
                                            >
                                                <span className="text-2xl">🍎</span>
                                                <span>Fruta / Alimento</span>
                                                <span className="text-[10px] text-slate-400 font-normal">Dataset Natural</span>
                                            </button>

                                            {/* Botón Vehículos */}
                                            <button
                                                type="button"
                                                disabled={classified}
                                                onClick={() => handleClassify('vehiculo')}
                                                className={`p-4 rounded-2xl border-2 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                                                    classified && currentSample.category === 'vehiculo'
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-md'
                                                        : classified && selectedCat === 'vehiculo'
                                                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200'
                                                        : 'bg-white hover:bg-cyan-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-cyan-400'
                                                }`}
                                            >
                                                <span className="text-2xl">🚗</span>
                                                <span>Vehículo / Transporte</span>
                                                <span className="text-[10px] text-slate-400 font-normal">Dataset Mecánico</span>
                                            </button>

                                            {/* Botón Caso Ambiguo */}
                                            <button
                                                type="button"
                                                disabled={classified}
                                                onClick={() => handleClassify('ambiguo')}
                                                className={`p-4 rounded-2xl border-2 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                                                    classified && currentSample.category === 'ambiguo'
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-md'
                                                        : classified && selectedCat === 'ambiguo'
                                                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200'
                                                        : 'bg-white hover:bg-amber-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-amber-400'
                                                }`}
                                            >
                                                <span className="text-2xl">⚠️</span>
                                                <span>Caso Ambiguo / Límite</span>
                                                <span className="text-[10px] text-slate-400 font-normal">Dilema de Datos</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Feedback Inmediato */}
                                {classified && (
                                    <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 space-y-3 animate-fadeIn">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className={selectedCat === currentSample.category ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                                                {selectedCat === currentSample.category ? '🎉 ¡Clasificación Exitosa (+25 Puntos)!' : '⚠️ Clasificación Incorrecta'}
                                            </span>
                                            <span className="font-mono text-cyan-800 dark:text-cyan-300">
                                                Precisión del Modelo: {Math.round((game2Hits / (sampleIdx + 1)) * 100)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                                            💡 <strong>Lección de Datos:</strong> {currentSample.explanation}
                                        </p>
                                        <div className="text-right">
                                            <button
                                                type="button"
                                                onClick={handleNextSample}
                                                className="btn-arcade btn-arcade-cyan px-5 py-2 rounded-xl text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5"
                                            >
                                                <span>{sampleIdx + 1 < dataSamples.length ? 'Siguiente Muestra' : (isMission0 ? 'Cerrar Bóveda de Privacidad' : 'Finalizar Entrenamiento')}</span>
                                                <Play size={13} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Pantalla Final de Calificación Minijuego 2 */
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/40 rounded-2xl p-6 text-center space-y-4">
                                <span className="text-4xl">🎖️</span>
                                <h4 className="font-display font-bold text-xl text-emerald-800 dark:text-emerald-300">
                                    {isMission0 ? '¡Bóveda de Privacidad Calibrada con Éxito!' : '¡Calibración de Red Neuronal Completada!'}
                                </h4>
                                <div className="max-w-sm mx-auto p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 text-xs font-mono space-y-1">
                                    <div className="flex justify-between">
                                        <span>Aciertos Totales:</span>
                                        <strong>{game2Hits} de {dataSamples.length}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Precisión del Dataset:</span>
                                        <strong className="text-emerald-600">{Math.round((game2Hits / dataSamples.length) * 100)}%</strong>
                                    </div>
                                    <div className="flex justify-between text-amber-600 font-bold">
                                        <span>Puntuación Ganada:</span>
                                        <strong>+{game2Score} Pts de Entrenador</strong>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                                    {isMission0
                                        ? 'Has dominado el resguardo de tu huella digital inviolable. ¡Avanza al Nivel 3 para dominar el taller del copiloto ético!'
                                        : 'Has experimentado cómo los datasets con casos ambiguos desafían a la IA. ¡Avanza al Nivel 3 para aprender a comunicarte con ella!'}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResetGame2}
                                    className="btn-arcade bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs px-4 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold inline-flex items-center gap-1"
                                >
                                    <RotateCcw size={13} />
                                    <span>{isMission0 ? 'Reclasificar Bóveda' : 'Reentrenar Red'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* ============================================================== */}
                {/* NIVEL 3: EL ARTE DEL PROMPT & ALUCINACIONES + MINIJUEGO 3 */}
                {/* ============================================================== */}
                <section className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-xl transition-colors">
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center text-lg font-black font-display shadow-sm">
                                3
                            </span>
                            <div>
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                    {isMission0 ? 'Nivel 3: Taller del Copiloto Ético & Positive Prompting' : 'Nivel 3: El Arte del Prompt y el Control de Alucinaciones'}
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {isMission0
                                        ? 'Honestidad académica, redacción afirmativa constructiva & Minijuego "El Copiloto Ético"'
                                        : 'Anatomía de Prompts Profesionales & Minijuego "El Reparador de Prompts"'}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-bold">
                            🥇 Nivel 3 de 3
                        </span>
                    </div>

                    {/* 3.1 TEORÍA CENTRAL EXPLÍCITA */}
                    <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-4 shadow-inner">
                        <div className="flex items-center gap-2 text-xs font-bold font-mono text-amber-800 dark:text-amber-300 uppercase">
                            <Terminal size={16} />
                            <span>{isMission0 ? 'Fundamento: Honestidad Académica y la IA como Copiloto Tutor' : 'Fundamento: ¿Qué es un Prompt y por qué una IA alucina?'}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/40 space-y-2 shadow-sm">
                                <h4 className="font-bold text-sm text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                                    <span>{isMission0 ? '🤝' : '💬'}</span> {isMission0 ? 'La IA como Copiloto (Nunca Reemplazo)' : '¿Qué es un Prompt?'}
                                </h4>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                                    {isMission0
                                        ? 'En el Colegio Monte Carmelo usamos la IA para generar ideas, estructurar pensamiento y depurar código. El autor, el criterio y la firma del trabajo siempre son 100% tuyos.'
                                        : 'Es la instrucción, orden o mensaje estructurado que le das a un modelo de IA. Si le pides algo vago, la IA te dará respuestas genéricas o inútiles. Si le das contexto y pautas, se convierte en un asistente de primer nivel.'}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/40 space-y-2 shadow-sm">
                                <h4 className="font-bold text-sm text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                                    <span>{isMission0 ? '🎓' : '😵‍💫'}</span> {isMission0 ? 'Honestidad Académica y Citación' : '¿Qué es una Alucinación?'}
                                </h4>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                                    {isMission0
                                        ? 'Presentar texto de IA como si fuera tuyo sin citar o sin comprenderlo es deshonestidad intelectual. Un verdadero líder del Club T.I.A. declara las herramientas usadas y verifica cada afirmación.'
                                        : 'Es cuando la IA inventa información falsa, nombres o fechas que no existen, diciéndolas con total seguridad. Ocurre porque la IA calcula qué palabra tiene mayor probabilidad estadística de seguir a otra, no porque sepa la verdad.'}
                                </p>
                            </div>
                        </div>

                        {/* Los 4 Pilares / Mandamientos */}
                        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block text-center">
                                {isMission0
                                    ? '🏛️ Los 4 Mandamientos del Copiloto Ético en el Aula'
                                    : '🏛️ Los 4 Pilares de un Prompt de Élite (Fórmula R-C-T-F)'}
                            </span>
                            {isMission0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-purple-200 dark:border-purple-800/40">
                                        <span className="font-bold text-purple-700 dark:text-purple-400 block">1. 🛡️ TRANSPARENCIA</span>
                                        <span>Declara el uso de IA en tu metodología</span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-cyan-200 dark:border-cyan-800/40">
                                        <span className="font-bold text-cyan-700 dark:text-cyan-400 block">2. 🔍 VERIFICACIÓN</span>
                                        <span>Contrasta cada afirmación con fuentes</span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-emerald-200 dark:border-emerald-800/40">
                                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block">3. ✍️ VOZ PROPIA</span>
                                        <span>Tu razonamiento y estilo guían todo</span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-amber-200 dark:border-amber-800/40">
                                        <span className="font-bold text-amber-700 dark:text-amber-400 block">4. ✨ REDACCIÓN EN POSITIVO</span>
                                        <span>Pide lo que quieres construir con claridad</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-purple-200 dark:border-purple-800/40">
                                        <span className="font-bold text-purple-700 dark:text-purple-400 block">1. 🎭 ROL</span>
                                        <span>¿Quién es la IA? (Ej: Profesor de historia)</span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-cyan-200 dark:border-cyan-800/40">
                                        <span className="font-bold text-cyan-700 dark:text-cyan-400 block">2. 🗺️ CONTEXTO</span>
                                        <span>¿Para quién y dónde? (Ej: 5° grado en Guayana)</span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-emerald-200 dark:border-emerald-800/40">
                                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block">3. 🎯 TAREA</span>
                                        <span>¿Qué debe hacer? (Ej: Explicar 3 planetas)</span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-amber-200 dark:border-amber-800/40">
                                        <span className="font-bold text-amber-700 dark:text-amber-400 block">4. 📄 FORMATO</span>
                                        <span>¿Cómo entregarlo? (Ej: 3 viñetas breves)</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3.1.B EL PODER DE REDACTAR EN POSITIVO (POSITIVE PROMPTING) */}
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 space-y-2 text-xs">
                            <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                                <span>✨</span>
                                <span>El Arte de Redactar en Positivo (Superando el Antipatrón "No es X sino Y")</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                                Las IAs tienen dificultades con las listas de negaciones ambiguas (<em>"no hables mucho, no uses palabras difíciles y no inventes"</em>), porque dejan un mar de dudas sobre lo que <strong>SÍ</strong> deben hacer.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                                    <span className="font-bold text-rose-700 dark:text-rose-400 block mb-0.5">❌ Antipatrón de Negación:</span>
                                    <span>"No escribas largo y no me des datos aburridos." (Vago, la IA no sabe el tono ni el objetivo).</span>
                                </div>
                                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">✅ Redacción en Positivo:</span>
                                    <span>"Resume en 3 oraciones entusiastas el récord de altura del Salto Ángel para estudiantes de 1° año con datos verificados."</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3.2 MINIJUEGO 3: EL REPARADOR DE PROMPTS */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Target size={18} className="text-amber-500" />
                                    <span>{isMission0 ? '🎮 Minijuego 3: El Taller del Copiloto Ético' : '🎮 Minijuego 3: El Taller Reparador de Prompts'}</span>
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {isMission0
                                        ? 'Analiza el dilema ético / prompt tramposo y escoge la instrucción con integridad académica y redacción en positivo.'
                                        : 'Analiza el prompt defectuoso y escoge la instrucción corregida que cumple con los 4 pilares.'}
                                </p>
                            </div>
                            <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                Caso {promptChallengeIdx + 1} de {promptChallenges.length}
                            </span>
                        </div>

                        {!game3Done && activePromptChallenge ? (
                            <div className="space-y-5">
                                {/* Prompt Roto */}
                                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800/50 space-y-2">
                                    <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 font-bold">
                                        <span className="flex items-center gap-1.5">
                                            <ShieldAlert size={14} />
                                            <span>{isMission0 ? 'Dilema / Solicitud del Estudiante:' : 'Misión del Estudiante:'} {activePromptChallenge.scenario}</span>
                                        </span>
                                    </div>
                                    <div className="font-mono text-sm text-rose-950 dark:text-rose-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-rose-200 dark:border-rose-900 font-bold">
                                        Prompt Original que escribió: "{activePromptChallenge.brokenPrompt}"
                                    </div>
                                    <p className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">
                                        {isMission0 ? '⚠️ Falla Ética Crítica:' : '⚠️ Falla crítica:'} {activePromptChallenge.flaw}
                                    </p>
                                </div>

                                {/* Opciones de Reparación */}
                                <div className="space-y-2.5">
                                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        {isMission0
                                            ? '¿Cuál de estas instrucciones transforma el pedido en un aprendizaje ético con redacción afirmativa?'
                                            : '¿Cuál de estas instrucciones repara el prompt aplicando Rol, Contexto, Tarea y Formato?'}
                                    </span>
                                    <div className="space-y-2">
                                        {activePromptChallenge.options.map((opt) => {
                                            const isSelected = selectedPromptOpt === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    disabled={testedPrompt}
                                                    onClick={() => handleSelectPromptOpt(opt.id)}
                                                    className={`w-full p-4 rounded-2xl border-2 text-left text-xs font-medium transition-all flex items-start gap-3 ${
                                                        isSelected
                                                            ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-950 dark:text-amber-100 shadow-md'
                                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                                                        isSelected ? 'bg-amber-500 text-white' : 'border border-slate-300 text-slate-400'
                                                    }`}>
                                                        {isSelected ? '✓' : ''}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="leading-relaxed block">{opt.text}</span>
                                                        {testedPrompt && (
                                                            <span className={`text-[10px] block font-bold ${opt.isCorrect ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                                {opt.reason}
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Botón de Simulación */}
                                <div className="flex gap-2 pt-1">
                                    {!testedPrompt ? (
                                        <button
                                            type="button"
                                            disabled={!selectedPromptOpt}
                                            onClick={handleExecutePromptSimulation}
                                            className="w-full btn-arcade btn-arcade-amber py-3 px-6 rounded-2xl text-slate-950 font-bold font-display text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                                        >
                                            <Sparkles size={16} />
                                            <span>{isMission0 ? '⚡ Probar Interacción con el Copiloto' : '⚡ Probar Prompt en la IA Simulada'}</span>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleNextPromptChallenge}
                                            className="w-full btn-arcade btn-arcade-purple py-3 px-6 rounded-2xl text-white font-bold font-display text-sm flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <span>{promptChallengeIdx + 1 < promptChallenges.length ? 'Siguiente Caso de Estudio →' : 'Completar Minijuego 3 🏆'}</span>
                                        </button>
                                    )}
                                </div>

                                {/* Comparativa Visual Lado a Lado de Resultados */}
                                {testedPrompt && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-fadeIn">
                                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900/60 space-y-2">
                                            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase block">
                                                {isMission0 ? '❌ Resultado Negativo / Trampa Académica:' : '❌ Lo que respondía con el Prompt Roto:'}
                                            </span>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed whitespace-pre-line">
                                                {activePromptChallenge.badOutput}
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 space-y-2 shadow-sm">
                                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">
                                                {isMission0 ? '✨ Resultado con Copiloto Ético & Voz Propia:' : '✨ Lo que responde con el Prompt Reparado:'}
                                            </span>
                                            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                                                {activePromptChallenge.goodOutput}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Pantalla Final de Calificación Minijuego 3 */
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/40 rounded-2xl p-6 text-center space-y-4">
                                <span className="text-4xl">🏆</span>
                                <h4 className="font-display font-bold text-xl text-emerald-800 dark:text-emerald-300">
                                    {isMission0 ? '¡Copiloto Ético Superado!' : '¡Taller de Prompts Superado!'}
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                                    {isMission0
                                        ? `Has demostrado honestidad académica, pensamiento crítico y redacción afirmativa constructiva. Puntuación ganada: +${game3Score} Pts.`
                                        : `Has dominado la fórmula Rol + Contexto + Tarea + Formato para controlar las alucinaciones. Puntuación ganada: +${game3Score} Pts.`}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResetGame3}
                                    className="btn-arcade bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs px-4 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold inline-flex items-center gap-1"
                                >
                                    <RotateCcw size={13} />
                                    <span>Practicar Casos Nuevamente</span>
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* ============================================================== */}
                {/* GLOSARIO DE REPASO ACTIVO: DEFINICIONES, EJEMPLOS Y PREGUNTAS */}
                {/* ============================================================== */}
                <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl transition-colors">
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-lg font-black font-display shadow-sm">
                                📚
                            </span>
                            <div>
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                    Glosario de Repaso Activo y Precisión Conceptual
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Definiciones científicas, aplicaciones de la vida real y preguntas clave de autoevaluación.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
                            <span>Conceptos Dominados: {masteredTerms.length} de {glossaryTerms.length}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {glossaryTerms.map((g, idx) => {
                            const isMastered = masteredTerms.includes(idx);
                            return (
                                <div
                                    key={idx}
                                    className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                                        isMastered
                                            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-600/40'
                                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                                    }`}
                                >
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">
                                                {g.category}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => toggleMasterTerm(idx)}
                                                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                                                    isMastered
                                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-400'
                                                }`}
                                            >
                                                {isMastered ? '¡Dominado! ✔️' : 'Marcar Aprendido'}
                                            </button>
                                        </div>

                                        <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
                                            {g.term}
                                        </h3>

                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                            {g.def}
                                        </p>

                                        {/* Ejemplo Real Visible */}
                                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                                            <span className="font-bold text-purple-700 dark:text-purple-400 block">
                                                🌍 Ejemplo en la Vida Real:
                                            </span>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {g.example}
                                            </p>
                                        </div>

                                        {/* Pregunta Clave de Autoevaluación Visible */}
                                        <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-[11px] space-y-1">
                                            <span className="font-bold text-amber-800 dark:text-amber-400 block">
                                                ❓ Pregunta Clave: {g.question}
                                            </span>
                                            <p className="text-slate-700 dark:text-slate-300 font-medium">
                                                👉 <em>Respuesta: {g.answer}</em>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ============================================================== */}
                {/* CIERRE ÉPICO: CARNET, LOGROS & LIVE POLLING DEL AULA */}
                {/* ============================================================== */}
                <div className="text-center p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-purple-100 via-indigo-50 to-white dark:from-purple-950/40 dark:to-slate-900 border-2 border-purple-500/40 space-y-6 shadow-2xl transition-colors">
                    <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-3xl shadow-xl shadow-amber-400/30 animate-bounce">
                        🏆
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            {isMission0 ? '¡Completaste la Misión 00 del Club T.I.A.!' : '¡Completaste la Misión 01 del Club T.I.A.!'}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                            {isMission0
                                ? 'Has establecido el blindaje ético y de curaduría crítica no negociable: huella digital inviolable, redacción en positivo y el copiloto de IA con rigor académico.'
                                : 'Has construido bases científicas sólidas investigando en la web, entrenando una red neuronal en el laboratorio y reparando prompts como un profesional de ConTech.'}
                        </p>
                    </div>

                    {/* Carnet de Estudiante */}
                    <div className="max-w-md mx-auto p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-700/60 shadow-md flex items-center justify-between gap-4 text-left">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{user ? user.avatar_emoji : '🧑‍🎓'}</span>
                            <div>
                                <span className="font-display font-bold text-sm text-slate-900 dark:text-white block">
                                    {user ? user.name : 'Explorador Escolar'}
                                </span>
                                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                                    {user ? `${user.grade} · Nivel ${user.level}` : 'Inicia sesión para guardar tu medalla'}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-mono font-bold text-amber-500 block">
                                +{lesson.xp_reward} XP
                            </span>
                            <span className="text-[10px] text-slate-400">Recompensa</span>
                        </div>
                    </div>

                    {claimedReward ? (
                        <div className="p-6 max-w-md mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-600/50 space-y-4 animate-fadeIn">
                            <span className="text-3xl">🎖️</span>
                            <h4 className="font-display font-bold text-lg text-emerald-800 dark:text-emerald-300">
                                ¡Insignia {claimedReward.badge || (isMission0 ? 'Eje Transversal No Negociable 🛡️' : 'Pionero IA 🌟')} Desbloqueada!
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                                Tus puntos y medallas están guardados en tu perfil escolar. Ahora tienes <strong>{claimedReward.xp} XP acumulados</strong>.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                                <Link
                                    href={appUrl('/dashboard')}
                                    className="btn-arcade btn-arcade-purple px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5"
                                >
                                    <LayoutDashboard size={14} />
                                    <span>Ir a Mi Dashboard</span>
                                </Link>
                                <Link
                                    href={appUrl('/')}
                                    className="btn-arcade bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200"
                                >
                                    Volver al Mapa
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleCompleteMission}
                                className="w-full sm:w-auto btn-arcade btn-arcade-purple px-8 py-4 rounded-2xl text-white font-bold font-display text-sm sm:text-base shadow-xl shadow-purple-600/40 hover:scale-105 transition-transform"
                            >
                                {saving ? '⏳ Guardando en tu carnet escolar...' : `🎉 Reclamar +${lesson.xp_reward} XP e Insignia Oficial`}
                            </button>
                        </div>
                    )}

                    {/* Botón hacia la Encuesta del Aula */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-base">
                                <Radio size={16} />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                    Dinámica en Vivo con el Profesor
                                </span>
                                <span className="text-[11px] text-slate-500">
                                    Vota en tiempo real en la pantalla proyectada
                                </span>
                            </div>
                        </div>
                        <Link
                            href={appUrl('/')}
                            className="btn-arcade btn-arcade-cyan px-3.5 py-1.5 rounded-xl text-white font-bold text-xs shrink-0 shadow-sm"
                        >
                            Ver Encuesta de Aula 🚀
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
