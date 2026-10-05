<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ClassLesson;
use App\Models\Poll;
use App\Models\PollVote;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Usuarios del Semillero (Facilitador, Coordinadora, y Estudiantes de Prueba)
        $facilitador = User::updateOrCreate(
            ['email' => 'hector@motazorrilla.com'],
            [
                'name' => 'Ing. Héctor Mota Zorrilla',
                'password' => Hash::make('carmelo2026'),
                'role' => 'facilitador',
                'grade' => 'Docente / Mentor Técnico',
                'specialty' => 'Innovación Tecnológica & Robótica Educativa',
                'avatar' => '💻',
                'xp_points' => 2500,
                'level' => 10,
                'badges' => ['fundador_tia', 'mentor_estrella', 'maestro_algoritmo', 'live_host'],
            ]
        );

        $coordinadora = User::updateOrCreate(
            ['email' => 'milagros@montecarmelo.edu.ve'],
            [
                'name' => 'Prof. Milagros',
                'password' => Hash::make('carmelo2026'),
                'role' => 'colaborador',
                'grade' => 'Coordinación Académica',
                'specialty' => 'Ciencias & Plan Lector',
                'avatar' => '🔬',
                'xp_points' => 1200,
                'level' => 5,
                'badges' => ['lider_academico', 'pionera_educativa'],
            ]
        );

        // Estudiantes del Colegio Monte Carmelo con datos reales de semillero
        $sampleStudents = [
            ['name' => 'Sofía Carmelo', 'email' => 'sofia@montecarmelo.edu.ve', 'grade' => '5° Grado Primaria', 'section' => 'A', 'avatar' => '🤖', 'xp' => 450, 'level' => 2, 'badges' => ['bienvenida_tia', 'votante_activo', 'badge_mision_1']],
            ['name' => 'Mateo Guayana', 'email' => 'mateo@montecarmelo.edu.ve', 'grade' => '1° Año Media General', 'section' => 'B', 'avatar' => '🚀', 'xp' => 520, 'level' => 3, 'badges' => ['bienvenida_tia', 'explorador_canguro', 'badge_mision_1']],
            ['name' => 'Valeria Silva', 'email' => 'valeria@montecarmelo.edu.ve', 'grade' => '6° Grado Primaria', 'section' => 'A', 'avatar' => '🧠', 'xp' => 380, 'level' => 2, 'badges' => ['bienvenida_tia', 'votante_activo']],
            ['name' => 'Lucas Mendoza', 'email' => 'lucas@montecarmelo.edu.ve', 'grade' => '4° Grado Primaria', 'section' => 'C', 'avatar' => '🐱', 'xp' => 280, 'level' => 2, 'badges' => ['bienvenida_tia', 'curioso_digital']],
            ['name' => 'Camila Rivas', 'email' => 'camila@montecarmelo.edu.ve', 'grade' => '2° Año Media General', 'section' => 'A', 'avatar' => '🦊', 'xp' => 610, 'level' => 3, 'badges' => ['bienvenida_tia', 'badge_mision_1', 'votante_activo']],
            ['name' => 'Andrés Caroní', 'email' => 'andres@montecarmelo.edu.ve', 'grade' => '3° Año Media General', 'section' => 'B', 'avatar' => '⚡', 'xp' => 740, 'level' => 3, 'badges' => ['bienvenida_tia', 'maestro_algoritmo', 'badge_mision_1']],
            ['name' => 'Isabella Bolívar', 'email' => 'isabella@montecarmelo.edu.ve', 'grade' => '5° Grado Primaria', 'section' => 'B', 'avatar' => '🎨', 'xp' => 320, 'level' => 2, 'badges' => ['bienvenida_tia', 'votante_activo']],
            ['name' => 'Diego Orinoco', 'email' => 'diego@montecarmelo.edu.ve', 'grade' => '1° Año Media General', 'section' => 'A', 'avatar' => '👾', 'xp' => 490, 'level' => 2, 'badges' => ['bienvenida_tia', 'badge_mision_1']],
            ['name' => 'Mariana Torres', 'email' => 'mariana@montecarmelo.edu.ve', 'grade' => '4° Año Media General', 'section' => 'A', 'avatar' => '🌟', 'xp' => 850, 'level' => 4, 'badges' => ['bienvenida_tia', 'lider_estudiantil', 'badge_mision_1', 'votante_activo']],
            ['name' => 'Gabriel Castillo', 'email' => 'gabriel@montecarmelo.edu.ve', 'grade' => '5° Año Media General', 'section' => 'Única', 'avatar' => '🦾', 'xp' => 920, 'level' => 4, 'badges' => ['bienvenida_tia', 'pionero_ia', 'badge_mision_1']],
        ];

        foreach ($sampleStudents as $st) {
            User::updateOrCreate(
                ['email' => $st['email']],
                [
                    'name' => $st['name'],
                    'password' => Hash::make('carmelo2026'),
                    'role' => 'alumno',
                    'grade' => $st['grade'],
                    'section' => $st['section'],
                    'avatar' => $st['avatar'],
                    'xp_points' => $st['xp'],
                    'level' => $st['level'],
                    'badges' => $st['badges'],
                ]
            );
        }

        // 2. Las Misiones del Club T.I.A. (Misión 00 Fundacional + 5 Islas ERCA)
        
        // Misión 00: Ciudadanía Digital & Ética de la IA (Eje Transversal No Negociable)
        ClassLesson::updateOrCreate(
            ['slug' => 'ciudadania-digital-y-etica'],
            [
                'island_number' => 0,
                'title' => 'Misión 00: Ciudadanía Digital & Ética de la IA',
                'subtitle' => 'Eje Transversal No Negociable: Curaduría Crítica, Huella Digital Inviolable y Copiloto Ético',
                'icon' => '🛡️',
                'badge_name' => 'Eje Transversal No Negociable 🛡️',
                'is_unlocked' => true,
                'xp_reward' => 100,
                'duration_minutes' => 45,
                'description' => 'La tecnología sin ética ni pensamiento crítico es ciega. Esta misión fundacional establece las reglas sagradas del semillero: verificación rigurosa de fuentes, protección inviolable de la huella digital y redacción afirmativa con honestidad académica.',
                'content' => [
                    'curaduria_guidance' => [
                        'title' => 'Radar de Curaduría & Verificación de Fuentes',
                        'badge' => 'Nivel 1: Detector de Desinformación',
                        'search_queries' => [
                            'como verificar fuentes de informacion en internet estudiantes',
                            'que es una noticia falsa y como detectarla fact checking',
                            'derechos de autor y licencias de uso en la escuela',
                        ],
                        'guiding_questions' => [
                            '¿Por qué nunca debemos copiar y pegar el primer resultado que nos da un buscador o un chat de IA?',
                            '¿Qué huellas delatan una imagen o texto generado para desinformar?',
                        ],
                        'key_takeaway' => 'La Curaduría Crítica es el hábito de contrastar información en al menos tres fuentes fiables antes de creerla o compartirla.',
                    ],
                    'privacy_vault_guidance' => [
                        'title' => 'Bóveda de Privacidad & Huella Digital Inviolable',
                        'badge' => 'Nivel 2: Clasificador de Datos Seguros vs Privados',
                        'description' => 'Tu huella digital es permanente. Clasifica cada dato antes de que sea expuesto a un modelo de lenguaje o a internet.',
                    ],
                ],
            ]
        );

        // Isla 1: El Despegue de la IA (Activa)
        ClassLesson::updateOrCreate(
            ['slug' => 'el-despegue-de-la-ia'],
            [
                'island_number' => 1,
                'title' => 'Misión 01: El Despegue de la IA',
                'subtitle' => 'Fundamentos Teóricos, Búsqueda Web & Minijuegos de Entrenamiento',
                'icon' => '🚀',
                'badge_name' => 'Insignia Pionero IA 🌟',
                'is_unlocked' => true,
                'xp_reward' => 100,
                'duration_minutes' => 50,
                'description' => '¡Inicia la travesía escolar! Investiga en la web qué es la IA por definición científica, descubre cómo aprenden las máquinas con datos vs. reglas, y domina el arte del prompt con 3 niveles de minijuegos interactivos.',
                'content' => [
                    'level1_webquest' => [
                        'title' => 'Búsqueda Guiada: ¿Qué es la Inteligencia Artificial?',
                        'badge' => 'Nivel 1: Verdad vs Ficción',
                        'search_queries' => [
                            'definicion de inteligencia artificial unesco',
                            'diferencia entre inteligencia artificial estrecha y general',
                            'quien fue alan turing test de turing para ninos',
                        ],
                        'guiding_questions' => [
                            '¿La IA tiene conciencia y emociones como en las películas, o es un sistema que calcula patrones matemáticos?',
                            '¿Qué diferencia a una "IA Estrecha" (como un traductor o ChatGPT) de una "IA General" ficticia?',
                        ],
                        'key_takeaway' => 'La IA no es magia ni tiene sentimientos: es un campo de las ciencias de la computación que diseña sistemas capaces de resolver problemas complejos calculando probabilidades sobre millones de datos.',
                    ],
                    'game_rounds' => [
                        [
                            'id' => 1,
                            'type' => 'text',
                            'prompt' => 'Lee este breve verso: "En los cables susurra el viento de cristal, un pájaro de silicio vuela sobre el mar digital."',
                            'question' => '¿Quién escribió este verso?',
                            'options' => ['👨‍🎨 Poeta Humano', '🤖 Inteligencia Artificial'],
                            'correct' => 1,
                            'explanation' => '¡Correcto! Fue generado por un modelo de lenguaje en 0.5 segundos combinando patrones de rima y metáforas tecnológicas.',
                        ],
                        [
                            'id' => 2,
                            'type' => 'fact',
                            'prompt' => 'Para que una computadora reconozca la foto de un gato entre miles de imágenes:',
                            'question' => '¿Qué método utiliza la Inteligencia Artificial moderna?',
                            'options' => [
                                'Regla fija escrita a mano: Si tiene 2 orejas triangulares y bigotes',
                                'Aprendizaje Automático: Analiza 10.000 fotos de gatos para aprender patrones visuales',
                            ],
                            'correct' => 1,
                            'explanation' => '¡Exacto! El Machine Learning no depende de reglas rígidas escritas por humanos, sino de encontrar patrones estadísticos en grandes volúmenes de datos.',
                        ],
                        [
                            'id' => 3,
                            'type' => 'text',
                            'prompt' => 'Un asistente de voz (como Siri o Alexa) te responde: "¡Hoy hace un día soleado, me alegra que salgas a jugar!"',
                            'question' => '¿Qué significa esa respuesta?',
                            'options' => [
                                'El asistente siente alegría real en su corazón mecánico',
                                'Es un guión programado con procesamiento de lenguaje natural (NLP) para sonar amigable',
                            ],
                            'correct' => 1,
                            'explanation' => 'Las máquinas simulan amabilidad mediante patrones de lenguaje, pero carecen de emociones, conciencia o estados de ánimo.',
                        ],
                        [
                            'id' => 4,
                            'type' => 'logic',
                            'prompt' => 'Si le pides a una calculadora o modelo de IA que multiplique 4.582 x 9.873:',
                            'question' => '¿Por qué lo hace en una milésima de segundo?',
                            'options' => [
                                'Ejecuta miles de millones de operaciones lógicas de conmutación electrónica',
                                'Tiene un cerebro biológico miniaturizado de silicio',
                            ],
                            'correct' => 0,
                            'explanation' => 'La velocidad de las computadoras proviene del flujo de electricidad a través de transistores microscópicos, no de un cerebro biológico.',
                        ],
                    ],
                    'level2_webquest' => [
                        'title' => 'Búsqueda Guiada: Algoritmos y Datos (Machine Learning)',
                        'badge' => 'Nivel 2: Datos vs Reglas',
                        'search_queries' => [
                            'que es un algoritmo explicacion sencilla para estudiantes',
                            'diferencia entre programacion tradicional y machine learning',
                            'que es un dataset o conjunto de datos de entrenamiento',
                        ],
                        'guiding_questions' => [
                            '¿Qué es un algoritmo en la vida real? (Ej: Una receta para preparar una torta paso a paso).',
                            '¿Por qué si entrenas a una IA con fotos de perros de un solo color, no sabrá reconocer a los demás?',
                        ],
                        'key_takeaway' => 'En la Programación Clásica el humano escribe las reglas (SI/ENTONCES). En el Machine Learning, la computadora examina miles de datos (Dataset) y descubre las reglas por sí misma.',
                    ],
                    'level3_webquest' => [
                        'title' => 'Búsqueda Guiada: Anatomía del Prompt & Alucinaciones',
                        'badge' => 'Nivel 3: El Arte del Lenguaje',
                        'search_queries' => [
                            'que es un prompt en inteligencia artificial y como escribirlo',
                            'que es una alucinacion en inteligencia artificial',
                            'como verificar informacion generada por ia tecnicas de fact checking',
                        ],
                        'guiding_questions' => [
                            '¿Cuáles son las 4 partes esenciales de un prompt de calidad profesional? (Rol + Contexto + Tarea + Formato).',
                            '¿Por qué un modelo de lenguaje puede afirmar con total seguridad un dato falso que nunca ocurrió?',
                        ],
                        'key_takeaway' => 'Un Prompt es la brújula con la que diriges a la IA. Si la instrucción es vaga, la IA "alucina" inventando datos; si el prompt tiene Rol, Contexto y Formato, la IA se convierte en un copiloto extraordinario.',
                    ],
                    'prompt_challenges' => [
                        [
                            'id' => 1,
                            'title' => 'Desafío 1: El Resumen de Ciencias',
                            'scenario' => 'Un estudiante de 5° grado quiere preparar una exposición sobre el Sistema Solar.',
                            'broken_prompt' => 'Dime cosas del espacio.',
                            'flaw' => 'Es demasiado genérico: no define el grado escolar, no especifica planetas ni el formato de entrega.',
                            'blocks' => [
                                ['id' => 'b1', 'label' => 'Rol Experto', 'text' => 'Actúa como un profesor de astronomía para primaria.', 'is_essential' => true],
                                ['id' => 'b2', 'label' => 'Contexto', 'text' => 'Para una clase de 5° grado en Puerto Ordaz.', 'is_essential' => true],
                                ['id' => 'b3', 'label' => 'Instrucción Específica', 'text' => 'Explica los 3 planetas más cercanos al Sol y un dato curioso de cada uno.', 'is_essential' => true],
                                ['id' => 'b4', 'label' => 'Formato de Salida', 'text' => 'En 3 viñetas breves con emojis y lenguaje divertido.', 'is_essential' => true],
                                ['id' => 'b5', 'label' => 'Distractor Innecesario', 'text' => 'Escribe una carta a la NASA en inglés.', 'is_essential' => false],
                            ],
                            'correct_selection' => ['b1', 'b2', 'b3', 'b4'],
                            'repaired_prompt' => 'Actúa como un profesor de astronomía para primaria. Para una clase de 5° grado en Puerto Ordaz, explica los 3 planetas más cercanos al Sol y un dato curioso de cada uno en 3 viñetas breves con emojis.',
                            'ai_output_bad' => 'El espacio es grande. Tiene estrellas, agujeros negros y galaxias lejanas...',
                            'ai_output_good' => "☀️ ¡Hola exploradores de Monte Carmelo! Aquí están nuestros vecinos espaciales:\n\n1. 🪨 Mercurio: El más cercano al Sol. ¡En el día es un horno a 430°C y en la noche se congela a -180°C!\n2. ☁️ Venus: Es el planeta más caliente de todos porque su atmósfera atrapa el calor como una olla de presión gigante.\n3. 🌍 Tierra: ¡Nuestro hogar! El único lugar conocido con agua líquida y vida.",
                            'explanation' => 'Al asignarle Rol ("Profesor de astronomía") y Formato ("3 viñetas breves"), la respuesta pasa de ser un párrafo aburrido a una guía perfecta para estudiar.',
                        ],
                        [
                            'id' => 2,
                            'title' => 'Desafío 2: Detective Histórico de Puerto Ordaz',
                            'scenario' => 'Un estudiante de 2° año de Media General necesita investigar los orígenes de la hidroeléctrica de Guri.',
                            'broken_prompt' => 'Cuéntame de Guri.',
                            'flaw' => 'La IA puede empezar a inventar fechas o responder con una poesía en lugar de datos históricos verificables.',
                            'blocks' => [
                                ['id' => 'b1', 'label' => 'Rol', 'text' => 'Actúa como un historiador de la ingeniería venezolana.', 'is_essential' => true],
                                ['id' => 'b2', 'label' => 'Tarea Precisa', 'text' => 'Indica en qué río está ubicada, en qué año inició operaciones y cuánta energía aporta al país.', 'is_essential' => true],
                                ['id' => 'b3', 'label' => 'Regla Anti-Alucinación', 'text' => 'Cita solo datos oficiales verificados; si no estás seguro de un número, indícalo.', 'is_essential' => true],
                                ['id' => 'b4', 'label' => 'Distractor Inútil', 'text' => 'Inventa una fábula de peces que hablan.', 'is_essential' => false],
                            ],
                            'correct_selection' => ['b1', 'b2', 'b3'],
                            'repaired_prompt' => 'Actúa como un historiador de la ingeniería venezolana. Indica en qué río está ubicada la Central Hidroeléctrica Simón Bolívar (Guri), en qué año inició operaciones y su relevancia energética, citando solo datos oficiales verificados.',
                            'ai_output_bad' => 'Guri es una represa que queda en Bolívar. Es muy bonita y tiene agua...',
                            'ai_output_good' => "⚡ Central Hidroeléctrica Simón Bolívar (Guri):\n\n• Ubicación: Cañón de Necuima sobre el Río Caroní, estado Bolívar, Venezuela.\n• Inauguración: Su primera etapa se inauguró en 1968 y la etapa final en 1986.\n• Aporte Nacional: Genera cerca del 70% de la energía eléctrica consumida en toda Venezuela gracias a su potente embalse.",
                            'explanation' => 'La instrucción "Cita solo datos verificados" reduce drásticamente las alucinaciones del modelo de lenguaje.',
                        ],
                    ],
                    'glossary' => [
                        [
                            'term' => 'Inteligencia Artificial 🤖',
                            'category' => 'Ciencia & Fundamento',
                            'def' => 'Disciplina de la computación que crea programas capaces de realizar tareas complejas (como traducir, reconocer fotos o jugar ajedrez) calculando patrones matemáticos.',
                            'example' => 'El filtro de spam de tu correo o las recomendaciones de videos en YouTube.',
                            'self_test' => '¿La IA tiene conciencia propia? (No, solo procesa datos y probabilidades).',
                        ],
                        [
                            'term' => 'Algoritmo 📝',
                            'category' => 'Lógica & Código',
                            'def' => 'Conjunto ordenado y finito de instrucciones paso a paso para resolver un problema específico de principio a fin.',
                            'example' => 'Una receta para hornear galletas o los pasos para atarse los cordones de los zapatos.',
                            'self_test' => '¿Qué pasa si cambias el orden de los pasos en un algoritmo? (El resultado final falla o es inesperado).',
                        ],
                        [
                            'term' => 'Machine Learning 🧠',
                            'category' => 'Aprendizaje Automático',
                            'def' => 'Subcampo de la IA donde la computadora "aprende" por sí misma detectando patrones en miles de ejemplos, en lugar de recibir reglas escritas a mano.',
                            'example' => 'Una app que reconoce perros y gatos tras ver 50.000 fotos de animales.',
                            'self_test' => '¿Qué necesita el Machine Learning para ser preciso? (Gran cantidad de datos limpios de entrenamiento).',
                        ],
                        [
                            'term' => 'Prompt 💬',
                            'category' => 'Ingeniería del Lenguaje',
                            'def' => 'El texto o instrucción estructurada que un ser humano le envía a un modelo de IA para indicarle qué rol asumir, qué tarea hacer y cómo presentar la respuesta.',
                            'example' => '"Actúa como un profesor de 5° grado y explica la fotosíntesis con una fábula corta."',
                            'self_test' => '¿Cuáles son las 4 partes de un prompt élite? (Rol + Contexto + Tarea + Formato).',
                        ],
                        [
                            'term' => 'Dataset (Datos de Entrenamiento) 📊',
                            'category' => 'Alimentación del Modelo',
                            'def' => 'El conjunto de miles o millones de ejemplos (textos, imágenes, audios) utilizados para entrenar a un modelo de IA.',
                            'example' => 'Los millones de libros y artículos de internet con los que se entrenó un modelo de lenguaje.',
                            'self_test' => '¿Qué pasa si un dataset tiene errores? (La IA aprenderá esos mismos errores y sesgos).',
                        ],
                        [
                            'term' => 'Alucinación 😵‍💫',
                            'category' => 'Seguridad & Verificación',
                            'def' => 'Fenómeno donde un modelo de lenguaje inventa hechos, nombres o fechas inexistentes y los presenta con total seguridad gramatical.',
                            'example' => 'Cuando una IA inventa un libro que ningún autor escribió jamás.',
                            'self_test' => '¿Cómo se combate una alucinación? (Pidiendo fuentes directas y verificando con búsqueda web o RAG).',
                        ],
                        [
                            'term' => 'Token 🧩',
                            'category' => 'Procesamiento de Lenguaje',
                            'def' => 'El fragmento más pequeño en que una IA divide las palabras (aproximadamente 4 caracteres o media palabra) para poder calcularlas matemáticamente.',
                            'example' => 'La palabra "computadora" puede dividirse en los tokens ["compu", "tadora"].',
                            'self_test' => '¿Las computadoras leen letras como nosotros? (No, las convierten en números llamados tokens).',
                        ],
                    ],
                ]
            ]
        );

        // Isla 2: El Detective de Libros (Bloqueada)
        ClassLesson::updateOrCreate(
            ['slug' => 'el-detective-de-libros'],
            [
                'island_number' => 2,
                'title' => 'Misión 02: El Detective de Libros',
                'subtitle' => 'Comprensión Lectora Aumentada y Análisis Crítico con NotebookLM',
                'icon' => '🔍',
                'badge_name' => 'Insignia Detective Literario 📖',
                'is_unlocked' => false,
                'xp_reward' => 120,
                'duration_minutes' => 50,
                'description' => 'Sinergia directa con el Plan Lector. Utiliza modelos RAG para hacerle preguntas a obras clásicas, extraer citas textuales y debatir sin alucinaciones.',
                'content' => [],
            ]
        );

        // Isla 3: Los Secretos de la Web (Bloqueada)
        ClassLesson::updateOrCreate(
            ['slug' => 'los-secretos-de-la-web'],
            [
                'island_number' => 3,
                'title' => 'Misión 03: Los Secretos de la Web',
                'subtitle' => 'Crea tu Primera Página con HTML5, Tailwind CSS y JavaScript',
                'icon' => '🌐',
                'badge_name' => 'Insignia Arquitecto Web 💻',
                'is_unlocked' => false,
                'xp_reward' => 150,
                'duration_minutes' => 60,
                'description' => 'Aprende a construir las páginas del Club T.I.A. Diseña interfaces arcade, manipula el DOM y publica tus proyectos digitales para toda la comunidad.',
                'content' => [],
            ]
        );

        // Isla 4: El Gimnasio Matemático (Bloqueada)
        ClassLesson::updateOrCreate(
            ['slug' => 'el-gimnasio-matematico'],
            [
                'island_number' => 4,
                'title' => 'Misión 04: El Gimnasio Matemático',
                'subtitle' => 'Lógica, Patrones y Entrenamiento para la Olimpiada Canguro',
                'icon' => '🧠',
                'badge_name' => 'Insignia Canguro de Oro 🦘',
                'is_unlocked' => false,
                'xp_reward' => 180,
                'duration_minutes' => 60,
                'description' => 'Desafíos de ingenio, acertijos numéricos y descomposición de problemas. La algoritmia como superpoder para triunfar en la Olimpiada Canguro y competencias científicas.',
                'content' => [],
            ]
        );

        // Isla 5: Entrena a tu Mascota Robot (Bloqueada)
        ClassLesson::updateOrCreate(
            ['slug' => 'entrena-a-tu-mascota-robot'],
            [
                'island_number' => 5,
                'title' => 'Misión 05: Entrena a tu Mascota Robot',
                'subtitle' => 'Visión Artificial con Cámara Web y Google Teachable Machine',
                'icon' => '🐾',
                'badge_name' => 'Insignia Domador de Redes 👁️',
                'is_unlocked' => false,
                'xp_reward' => 200,
                'duration_minutes' => 60,
                'description' => 'Enseña a tu computadora a ver el mundo. Captura fotos con la cámara web del laboratorio, entrena una red neuronal convolucional en 30 segundos y clasifica materiales de reciclaje.',
                'content' => [],
            ]
        );

        // 3. Encuesta en Vivo Lista para la Clase Demostrativa
        $poll = Poll::first();
        if (!$poll) {
            $poll = Poll::create([
                'question' => '¿Para qué te gustaría usar la Inteligencia Artificial en el Colegio Monte Carmelo?',
                'category' => 'Clase Demostrativa',
                'is_active' => true,
                'options' => [
                    [
                        'id' => 'opt_1',
                        'text' => 'Tutor Personal de Estudio (explicar temas paso a paso)',
                        'emoji' => '🧠',
                        'color' => '#8b5cf6', // Morado tech
                    ],
                    [
                        'id' => 'opt_2',
                        'text' => 'Crear Videojuegos y Páginas Web propias',
                        'emoji' => '🎮',
                        'color' => '#06b6d4', // Cyan
                    ],
                    [
                        'id' => 'opt_3',
                        'text' => 'Entrenar para la Olimpiada Canguro Matemático',
                        'emoji' => '🏆',
                        'color' => '#f59e0b', // Ámbar
                    ],
                    [
                        'id' => 'opt_4',
                        'text' => 'Clasificar Reciclaje y Ciencias con Cámara Web',
                        'emoji' => '♻️',
                        'color' => '#10b981', // Esmeralda
                    ],
                ],
            ]);
        }

        // Semillero de Votos Reales vinculados a estudiantes del colegio
        if (PollVote::count() === 0 && $poll) {
            $studentsForVotes = User::where('role', 'alumno')->take(6)->get();
            $options = ['opt_1', 'opt_2', 'opt_1', 'opt_3', 'opt_2', 'opt_4'];
            foreach ($studentsForVotes as $idx => $student) {
                PollVote::create([
                    'poll_id' => $poll->id,
                    'option_id' => $options[$idx % count($options)],
                    'user_id' => $student->id,
                    'voter_name' => $student->name,
                    'ip_address' => '127.0.0.1',
                ]);
            }
        }

        // 4. Configuración Institucional del Club T.I.A. (Misión, Visión, Valores)
        \App\Models\ClubSetting::set('mision', 'Acercar la tecnología de la información y la inteligencia artificial a los estudiantes del Colegio Monte Carmelo, transformándolos de consumidores pasivos a creadores de software, entrenadores de algoritmos y pensadores críticos con ética digital.', $facilitador->id);
        
        \App\Models\ClubSetting::set('vision', 'Consolidar al Club T.I.A. como el living lab escolar de referencia en pensamiento computacional e inteligencia artificial de Ciudad Guayana, integrando ConTech, modelos de lenguaje (NotebookLM) y desarrollo web de vanguardia.', $facilitador->id);

        \App\Models\ClubSetting::set('bienvenida', '¡Bienvenidos al Club T.I.A. de la U. E. Colegio Monte Carmelo! Dejamos de ser consumidores pasivos de pantallas para convertirnos en creadores de software, entrenadores de algoritmos y pensadores críticos.', $facilitador->id);

        \App\Models\ClubSetting::set('valores', json_encode([
            'Democratización y Alfabetización Tecnológica',
            'Pensamiento Computacional y Lógica Deductiva',
            'Ética en Inteligencia Artificial y Cero Alucinaciones',
            'Curiosidad Científica y Aprendizaje Activo (Ciclo ERCA)',
            'Trabajo Colaborativo y Liderazgo Estudiantil'
        ]), $facilitador->id);
    }
}
