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
                'avatar' => '🔬',
                'xp_points' => 1200,
                'level' => 5,
                'badges' => ['lider_academico', 'pionera_educativa'],
            ]
        );

        // Estudiantes del Colegio Monte Carmelo con datos reales de semillero
        $sampleStudents = [
            ['name' => 'Sofía Carmelo', 'email' => 'sofia@montecarmelo.edu.ve', 'grade' => '5° Grado Primaria', 'avatar' => '🤖', 'xp' => 450, 'level' => 2, 'badges' => ['bienvenida_tia', 'votante_activo', 'badge_mision_1']],
            ['name' => 'Mateo Guayana', 'email' => 'mateo@montecarmelo.edu.ve', 'grade' => '1° Año Media General', 'avatar' => '🚀', 'xp' => 520, 'level' => 3, 'badges' => ['bienvenida_tia', 'explorador_canguro', 'badge_mision_1']],
            ['name' => 'Valeria Silva', 'email' => 'valeria@montecarmelo.edu.ve', 'grade' => '6° Grado Primaria', 'avatar' => '🧠', 'xp' => 380, 'level' => 2, 'badges' => ['bienvenida_tia', 'votante_activo']],
            ['name' => 'Lucas Mendoza', 'email' => 'lucas@montecarmelo.edu.ve', 'grade' => '4° Grado Primaria', 'avatar' => '🐱', 'xp' => 280, 'level' => 2, 'badges' => ['bienvenida_tia', 'curioso_digital']],
            ['name' => 'Camila Rivas', 'email' => 'camila@montecarmelo.edu.ve', 'grade' => '2° Año Media General', 'avatar' => '🦊', 'xp' => 610, 'level' => 3, 'badges' => ['bienvenida_tia', 'badge_mision_1', 'votante_activo']],
            ['name' => 'Andrés Caroní', 'email' => 'andres@montecarmelo.edu.ve', 'grade' => '3° Año Media General', 'avatar' => '⚡', 'xp' => 740, 'level' => 3, 'badges' => ['bienvenida_tia', 'maestro_algoritmo', 'badge_mision_1']],
            ['name' => 'Isabella Bolívar', 'email' => 'isabella@montecarmelo.edu.ve', 'grade' => '5° Grado Primaria', 'avatar' => '🎨', 'xp' => 320, 'level' => 2, 'badges' => ['bienvenida_tia', 'votante_activo']],
            ['name' => 'Diego Orinoco', 'email' => 'diego@montecarmelo.edu.ve', 'grade' => '1° Año Media General', 'avatar' => '👾', 'xp' => 490, 'level' => 2, 'badges' => ['bienvenida_tia', 'badge_mision_1']],
            ['name' => 'Mariana Torres', 'email' => 'mariana@montecarmelo.edu.ve', 'grade' => '4° Año Media General', 'avatar' => '🌟', 'xp' => 850, 'level' => 4, 'badges' => ['bienvenida_tia', 'lider_estudiantil', 'badge_mision_1', 'votante_activo']],
            ['name' => 'Gabriel Castillo', 'email' => 'gabriel@montecarmelo.edu.ve', 'grade' => '5° Año Media General', 'avatar' => '🦾', 'xp' => 920, 'level' => 4, 'badges' => ['bienvenida_tia', 'pionero_ia', 'badge_mision_1']],
        ];

        foreach ($sampleStudents as $st) {
            User::updateOrCreate(
                ['email' => $st['email']],
                [
                    'name' => $st['name'],
                    'password' => Hash::make('carmelo2026'),
                    'role' => 'alumno',
                    'grade' => $st['grade'],
                    'avatar' => $st['avatar'],
                    'xp_points' => $st['xp'],
                    'level' => $st['level'],
                    'badges' => $st['badges'],
                ]
            );
        }

        // 2. Las 5 Islas en el orden exacto solicitado
        if (ClassLesson::count() === 0) {
            // Isla 1: El Despegue de la IA (Activa)
            ClassLesson::create([
                'island_number' => 1,
                'slug' => 'el-despegue-de-la-ia',
                'title' => 'Misión 01: El Despegue de la IA',
                'subtitle' => '¿Qué es la Inteligencia Artificial? Conceptos, Datos y Minijuegos',
                'icon' => '🚀',
                'badge_name' => 'Insignia Despegue IA 🌟',
                'is_unlocked' => true,
                'xp_reward' => 100,
                'duration_minutes' => 45,
                'description' => '¡Comienza la aventura! Desmitifica cómo piensan las máquinas, descubre la diferencia entre código y datos, y pon a prueba tu intuición con el desafío "¿IA o Humano?".',
                'content' => [
                    'game_rounds' => [
                        [
                            'id' => 1,
                            'type' => 'text',
                            'prompt' => 'Lee este breve verso: "En los cables susurra el viento de cristal, un pájaro de silicio vuela sobre el mar digital."',
                            'question' => '¿Quién escribió este verso?',
                            'options' => ['👨‍🎨 Poeta Humano', '🤖 Inteligencia Artificial'],
                            'correct' => 1,
                            'explanation' => '¡Correcto! Fue generado por un modelo de lenguaje en 0.5 segundos combinando patrones de rima y palabras tecnológicas.',
                        ],
                        [
                            'id' => 2,
                            'type' => 'fact',
                            'prompt' => 'Para que una computadora reconozca la foto de un gato:',
                            'question' => '¿Qué método utiliza la Inteligencia Artificial moderna?',
                            'options' => [
                                'Regla fija: si tiene bigotes y orejas puntiagudas',
                                'Aprendizaje Automático: analiza 10.000 fotos de gatos para aprender patrones',
                            ],
                            'correct' => 1,
                            'explanation' => '¡Exacto! El Machine Learning no lee reglas fijas; extrae patrones matemáticos a partir de miles de datos de entrenamiento.',
                        ],
                        [
                            'id' => 3,
                            'type' => 'text',
                            'prompt' => 'Si le pides a una IA que calcule 254 x 839, ¿qué hace?',
                            'question' => '¿Cómo procesa la información?',
                            'options' => [
                                'Tiene sentimientos y se cansa',
                                'Ejecuta operaciones matemáticas lógicas a la velocidad de la luz',
                            ],
                            'correct' => 1,
                            'explanation' => 'Las máquinas procesan cálculos matemáticos pero no sienten ni tienen conciencia.',
                        ],
                    ],
                    'glossary' => [
                        ['term' => 'Algoritmo 📝', 'def' => 'Una lista paso a paso de instrucciones ordenadas para resolver un problema, como una receta de cocina.'],
                        ['term' => 'Machine Learning 🧠', 'def' => 'El método donde la computadora aprende por sí misma analizando muchos ejemplos en lugar de memorizar reglas.'],
                        ['term' => 'Prompt 💬', 'def' => 'La instrucción, pregunta o contexto que tú le das a una IA para obtener una respuesta útil y precisa.'],
                        ['term' => 'Alucinación 😵‍💫', 'def' => 'Cuando un modelo de lenguaje inventa datos falsos con total seguridad porque no tiene una fuente verificada (¡por eso usamos RAG!).'],
                    ],
                ],
            ]);

            // Isla 2: El Detective de Libros (Bloqueada)
            ClassLesson::create([
                'island_number' => 2,
                'slug' => 'el-detective-de-libros',
                'title' => 'Misión 02: El Detective de Libros',
                'subtitle' => 'Comprensión Lectora Aumentada y Análisis Crítico con NotebookLM',
                'icon' => '🔍',
                'badge_name' => 'Insignia Detective Literario 📖',
                'is_unlocked' => false,
                'xp_reward' => 120,
                'duration_minutes' => 50,
                'description' => 'Sinergia directa con el Plan Lector. Utiliza modelos RAG para hacerle preguntas a obras clásicas, extraer citas textuales y debatir sin alucinaciones.',
                'content' => [],
            ]);

            // Isla 3: Los Secretos de la Web (Bloqueada)
            ClassLesson::create([
                'island_number' => 3,
                'slug' => 'los-secretos-de-la-web',
                'title' => 'Misión 03: Los Secretos de la Web',
                'subtitle' => 'Crea tu Primera Página con HTML5, Tailwind CSS y JavaScript',
                'icon' => '🌐',
                'badge_name' => 'Insignia Arquitecto Web 💻',
                'is_unlocked' => false,
                'xp_reward' => 150,
                'duration_minutes' => 60,
                'description' => 'Aprende a construir las páginas del Club T.I.A. Diseña interfaces arcade, manipula el DOM y publica tus proyectos digitales para toda la comunidad.',
                'content' => [],
            ]);

            // Isla 4: El Gimnasio Matemático (Bloqueada)
            ClassLesson::create([
                'island_number' => 4,
                'slug' => 'el-gimnasio-matematico',
                'title' => 'Misión 04: El Gimnasio Matemático',
                'subtitle' => 'Lógica, Patrones y Entrenamiento para la Olimpiada Canguro',
                'icon' => '🧠',
                'badge_name' => 'Insignia Canguro de Oro 🦘',
                'is_unlocked' => false,
                'xp_reward' => 180,
                'duration_minutes' => 60,
                'description' => 'Desafíos de ingenio, acertijos numéricos y descomposición de problemas. La algoritmia como superpoder para triunfar en la Olimpiada Canguro y competencias científicas.',
                'content' => [],
            ]);

            // Isla 5: Entrena a tu Mascota Robot (Bloqueada)
            ClassLesson::create([
                'island_number' => 5,
                'slug' => 'entrena-a-tu-mascota-robot',
                'title' => 'Misión 05: Entrena a tu Mascota Robot',
                'subtitle' => 'Visión Artificial con Cámara Web y Google Teachable Machine',
                'icon' => '🐾',
                'badge_name' => 'Insignia Domador de Redes 👁️',
                'is_unlocked' => false,
                'xp_reward' => 200,
                'duration_minutes' => 60,
                'description' => 'Enseña a tu computadora a ver el mundo. Captura fotos con la cámara web del laboratorio, entrena una red neuronal convolucional en 30 segundos y clasifica materiales de reciclaje.',
                'content' => [],
            ]);
        }

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
