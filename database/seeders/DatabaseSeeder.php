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
        // 1. Usuarios Iniciales (Facilitador, Coordinadora, Estudiantes)
        $facilitador = User::create([
            'name' => 'Ing. Héctor Mota Zorrilla',
            'email' => 'hector@motazorrilla.com',
            'password' => Hash::make('carmelo2026'),
            'role' => 'facilitador',
            'grade' => 'Docente / Mentor Técnico',
            'avatar' => 'coder',
            'xp_points' => 2500,
            'level' => 10,
            'badges' => ['fundador_tia', 'mentor_estrella', 'maestro_algoritmo', 'live_host'],
        ]);

        $coordinadora = User::create([
            'name' => 'Prof. Milagros',
            'email' => 'milagros@montecarmelo.edu.ve',
            'password' => Hash::make('carmelo2026'),
            'role' => 'colaborador',
            'grade' => 'Coordinación Académica',
            'avatar' => 'scientist',
            'xp_points' => 1200,
            'level' => 5,
            'badges' => ['lider_academico', 'pionera_educativa'],
        ]);

        $estudiante1 = User::create([
            'name' => 'Sofía Carmelo',
            'email' => 'sofia@montecarmelo.edu.ve',
            'password' => Hash::make('carmelo2026'),
            'role' => 'alumno',
            'grade' => '5° Grado Primaria',
            'avatar' => 'robot',
            'xp_points' => 350,
            'level' => 2,
            'badges' => ['primera_mision', 'votante_activo'],
        ]);

        $estudiante2 = User::create([
            'name' => 'Mateo Guayana',
            'email' => 'mateo@montecarmelo.edu.ve',
            'password' => Hash::make('carmelo2026'),
            'role' => 'alumno',
            'grade' => '2° Año Media General',
            'avatar' => 'astronaut',
            'xp_points' => 480,
            'level' => 3,
            'badges' => ['primera_mision', 'curioso_digital'],
        ]);

        // 2. Las 5 Islas en el orden exacto solicitado por el usuario
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
                        'options' => ['Tiene sentimientos y se cansa', 'Ejecuta operaciones matemáticas lógicas a la velocidad de la luz'],
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
            'subtitle' => 'Enseñar a Pensar: Tracker y Plan Lector con Google NotebookLM',
            'icon' => '🔍',
            'badge_name' => 'Insignia Detective Lector 🕵️',
            'is_unlocked' => false,
            'xp_reward' => 120,
            'duration_minutes' => 50,
            'description' => '¡Conviértete en un detective de textos! Aprende a usar el Notebook de Gemini para investigar libros del Plan Lector de la Prof. Andrea, formular preguntas socráticas y obtener citas exactas sin alucinaciones.',
            'content' => [],
        ]);

        // Isla 3: Los Secretos de la Web (Bloqueada)
        ClassLesson::create([
            'island_number' => 3,
            'slug' => 'los-secretos-de-la-web',
            'title' => 'Misión 03: Los Secretos de la Web',
            'subtitle' => 'Código Creativo en HTML5 & CSS3 para el Portal del Club',
            'icon' => '🌐',
            'badge_name' => 'Insignia Coder Web 💻',
            'is_unlocked' => false,
            'xp_reward' => 150,
            'duration_minutes' => 55,
            'description' => 'Aprende el oficio digital de la maquetación web. Diseña botones arcade, organiza tarjetas en CSS Grid y aporta tus propias líneas de código al portal del Club TIA.',
            'content' => [],
        ]);

        // Isla 4: El Gimnasio Matemático (Bloqueada)
        ClassLesson::create([
            'island_number' => 4,
            'slug' => 'el-gimnasio-matematico',
            'title' => 'Misión 04: El Gimnasio Matemático',
            'subtitle' => 'Lógica Deductiva, Patrones y Entrenamiento para la Olimpiada Canguro',
            'icon' => '🧠',
            'badge_name' => 'Insignia Canguro de Oro 🏆',
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

        // 3. Encuesta en Vivo Lista para la Clase Demostrativa
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

        // Votos iniciales para que la gráfica tenga datos vivos al primer render
        PollVote::create(['poll_id' => $poll->id, 'option_id' => 'opt_1', 'voter_name' => 'Sofia C.', 'ip_address' => '127.0.0.1']);
        PollVote::create(['poll_id' => $poll->id, 'option_id' => 'opt_1', 'voter_name' => 'Prof. Milagros', 'ip_address' => '127.0.0.1']);
        PollVote::create(['poll_id' => $poll->id, 'option_id' => 'opt_2', 'voter_name' => 'Mateo G.', 'ip_address' => '127.0.0.1']);
        PollVote::create(['poll_id' => $poll->id, 'option_id' => 'opt_3', 'voter_name' => 'Equipo Canguro', 'ip_address' => '127.0.0.1']);
        PollVote::create(['poll_id' => $poll->id, 'option_id' => 'opt_4', 'voter_name' => 'Eco-Brigada', 'ip_address' => '127.0.0.1']);
    }
}
