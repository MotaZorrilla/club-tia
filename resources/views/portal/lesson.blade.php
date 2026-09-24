@extends('layouts.app')

@section('title', $lesson->title . ' · Club T.I.A.')

@section('content')
<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

    <!-- BREADCRUMBS & TOP BAR -->
    <div class="flex items-center justify-between gap-4">
        <a href="{{ route('portal.index') }}" class="btn-arcade bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700">
            <span>⬅️</span>
            <span>Volver al Mapa de Islas</span>
        </a>
        <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Isla 0{{ $lesson->island_number }} de 05
            </span>
            <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ⭐ Recompensa: +{{ $lesson->xp_reward }} XP
            </span>
        </div>
    </div>

    <!-- MISSION HEADER HERO -->
    <div class="rounded-3xl bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-900/60 border border-purple-500/30 p-8 sm:p-10 relative overflow-hidden shadow-2xl">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            <div class="w-20 h-20 rounded-3xl bg-purple-600/40 border border-purple-400 flex items-center justify-center text-4xl shadow-xl shadow-purple-600/30 shrink-0 animate-float">
                {{ $lesson->icon }}
            </div>
            <div class="space-y-2 text-center sm:text-left">
                <span class="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Misión Gamificada · Ciclo ERCA Escolar
                </span>
                <h1 class="font-display text-3xl sm:text-4xl font-bold text-white">
                    {{ $lesson->title }}
                </h1>
                <p class="text-sm sm:text-base text-slate-300 font-medium">
                    {{ $lesson->subtitle }}
                </p>
                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-mono text-slate-400">
                    <span>⏱️ Duración: {{ $lesson->duration_minutes }} min</span>
                    <span>·</span>
                    <span class="text-purple-300 font-bold">🎖️ {{ $lesson->badge_name }}</span>
                    <span>·</span>
                    <span class="text-emerald-400">● 100% Interactivo</span>
                </div>
            </div>
        </div>
    </div>

    <!-- PASO 1: MINIJUEGO INTERACTIVO "¿IA O HUMANO?" -->
    <section class="rounded-3xl bg-slate-900 border border-purple-500/30 p-6 sm:p-8 space-y-6 shadow-xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl font-bold">
                    1
                </span>
                <div>
                    <h2 class="font-display text-xl sm:text-2xl font-bold text-white">
                        Desafío 1: ¿Inteligencia Artificial o Humano? 🎨
                    </h2>
                    <p class="text-xs text-slate-400">Momento de Experiencia: Pon a prueba tu intuición para detectar patrones generados por algoritmos.</p>
                </div>
            </div>
            <span class="text-xs font-mono bg-purple-900/40 text-purple-300 px-3 py-1 rounded-xl border border-purple-500/30">
                Ronda 1 de 3
            </span>
        </div>

        <!-- Interactive Question Box -->
        <div id="gameCard" class="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
            <div class="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-slate-200 text-sm sm:text-base italic leading-relaxed">
                "En los cables susurra el viento de cristal, un pájaro de silicio vuela sobre el mar digital."
            </div>
            <p class="text-sm font-semibold text-white">¿Quién compuso este poema?</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button onclick="checkAnswer(0, false)" class="btn-arcade bg-slate-700 hover:bg-slate-600 text-white font-bold p-4 rounded-2xl flex items-center justify-center gap-3 border border-slate-600 shadow-md">
                    <span class="text-2xl">👨‍🎨</span>
                    <span>Un Poeta Humano</span>
                </button>
                <button onclick="checkAnswer(1, true)" class="btn-arcade btn-arcade-purple text-white font-bold p-4 rounded-2xl flex items-center justify-center gap-3 shadow-md">
                    <span class="text-2xl">🤖</span>
                    <span>Una Inteligencia Artificial</span>
                </button>
            </div>

            <!-- Feedback Alert (Hidden by default) -->
            <div id="gameFeedback" class="hidden mt-4 p-4 rounded-xl border text-sm space-y-1">
                <div id="feedbackTitle" class="font-bold flex items-center gap-2"></div>
                <div id="feedbackText" class="text-xs text-slate-300"></div>
            </div>
        </div>
    </section>

    <!-- PASO 2: EL DILEMA DEL ROBOT TONTO (REFLEXIÓN PEDAGÓGICA) -->
    <section class="rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-xl">
        <div class="flex items-center gap-3 border-b border-slate-800 pb-4">
            <span class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xl font-bold">
                2
            </span>
            <div>
                <h2 class="font-display text-xl sm:text-2xl font-bold text-white">
                    Momento 2: ¿Cómo Piensa una Máquina? 🤖
                </h2>
                <p class="text-xs text-slate-400">Reflexión Crítica: La diferencia entre memorizar reglas y aprender con datos.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Programación Tradicional -->
            <div class="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-3">
                <div class="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <span>💻</span>
                    <span>Programación Clásica (Reglas Fijas)</span>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed">
                    Un humano escribe cada regla matemática: <br>
                    <code class="text-cyan-300 font-mono bg-slate-950 px-2 py-1 rounded block mt-2">
                        SI fruta == 'amarilla' Y forma == 'curva':<br>
                        &nbsp;&nbsp;ES 'Plátano'
                    </code>
                </p>
                <div class="text-[11px] text-amber-400 font-mono bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
                    ⚠️ Problema: ¡Si el plátano está verde o cortado en rodajas, el programa falla!
                </div>
            </div>

            <!-- Machine Learning -->
            <div class="bg-purple-950/30 border border-purple-500/40 rounded-2xl p-5 space-y-3">
                <div class="flex items-center gap-2 text-purple-300 font-bold text-sm">
                    <span>🧠</span>
                    <span>Aprendizaje Automático (Machine Learning)</span>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed">
                    Le entregamos a la computadora <strong>5.000 fotos de plátanos</strong> de todos los colores, ángulos y tamaños. La computadora descubre los patrones estadísticos sola.
                </p>
                <div class="text-[11px] text-emerald-400 font-mono bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
                    ✅ Ventaja: Reconoce el plátano aunque esté verde, maduro o en un batido.
                </div>
            </div>
        </div>
    </section>

    <!-- PASO 3: GLOSARIO INTERACTIVO (CONCEPTUALIZACIÓN) -->
    <section class="rounded-3xl bg-slate-900 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-xl">
        <div class="flex items-center gap-3 border-b border-slate-800 pb-4">
            <span class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl font-bold">
                3
            </span>
            <div>
                <h2 class="font-display text-xl sm:text-2xl font-bold text-white">
                    Glosario Mágico de la Inteligencia Artificial 📚
                </h2>
                <p class="text-xs text-slate-400">Conceptualización: Cuatro términos indispensables para hablar como un verdadero científico digital.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            @if(isset($lesson->content['glossary']))
            @foreach($lesson->content['glossary'] as $g)
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-400/60 transition-all space-y-2">
                <h3 class="font-display font-bold text-amber-300 text-base flex items-center gap-1.5">
                    {{ $g['term'] }}
                </h3>
                <p class="text-xs text-slate-300 leading-relaxed">
                    {{ $g['def'] }}
                </p>
            </div>
            @endforeach
            @endif
        </div>
    </section>

    <!-- PASO 4: SIMULADOR DE ENTRENAMIENTO EN VIVO (APLICACIÓN) -->
    <section class="rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 sm:p-8 space-y-6 shadow-xl">
        <div class="flex items-center gap-3 border-b border-slate-800 pb-4">
            <span class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xl font-bold">
                4
            </span>
            <div>
                <h2 class="font-display text-xl sm:text-2xl font-bold text-white">
                    Laboratorio de Entrenamiento: Tu Primer Mini-Modelo 🧪
                </h2>
                <p class="text-xs text-slate-400">Aplicación Práctica: Alimenta datos de prueba y observa cómo la IA predice en tiempo real.</p>
            </div>
        </div>

        <div class="bg-slate-800/60 rounded-2xl p-6 border border-slate-700 space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <!-- Clase A: Frutas -->
                <div class="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/40 space-y-2">
                    <span class="font-bold text-sm text-emerald-300 flex items-center gap-2">
                        <span>🍎</span> Clase A: Frutas y Alimentos
                    </span>
                    <p class="text-[11px] text-slate-400">Datos aprendidos: manzana, plátano, fresa, naranja.</p>
                </div>

                <!-- Clase B: Vehículos -->
                <div class="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/40 space-y-2">
                    <span class="font-bold text-sm text-cyan-300 flex items-center gap-2">
                        <span>🚗</span> Clase B: Vehículos y Transporte
                    </span>
                    <p class="text-[11px] text-slate-400">Datos aprendidos: carro, bicicleta, avión, camión.</p>
                </div>
            </div>

            <!-- Interactive Predictor -->
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <label class="block text-xs font-mono text-slate-300">Prueba con una nueva palabra:</label>
                <div class="flex gap-2">
                    <input type="text" id="testWordInput" placeholder="Ej: piña, moto, submarino, sandía..." class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-sans">
                    <button onclick="simulatePrediction()" class="btn-arcade btn-arcade-emerald text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                        ⚡ ¡Clasificar!
                    </button>
                </div>

                <div id="simResult" class="hidden mt-3 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono">
                    <span class="text-slate-400">Predicción: </span>
                    <strong id="simClass" class="text-emerald-400 font-bold"></strong>
                    <span class="text-slate-500"> · Confianza: </span>
                    <strong id="simScore" class="text-amber-400 font-bold"></strong>
                </div>
            </div>
        </div>
    </section>

    <!-- PASO 5: COMPLETAR MISIÓN Y RECLAMAR RECOMPENSA -->
    <div class="text-center p-8 rounded-3xl bg-gradient-to-b from-purple-950/40 to-slate-900 border border-purple-500/40 space-y-4 shadow-2xl">
        <div class="text-4xl animate-bounce">🏆</div>
        <h3 class="font-display text-2xl font-bold text-white">¡Has explorado todos los momentos de la Misión 01!</h3>
        <p class="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Al completar esta clase, recibirás tu <strong>Insignia Despegue IA 🌟</strong> y sumarás <strong>+{{ $lesson->xp_reward }} Puntos de Experiencia (XP)</strong> a tu perfil escolar.
        </p>

        <form action="{{ route('portal.completeLesson', $lesson->slug) }}" method="POST">
            @csrf
            <button type="button" onclick="completeMissionAjax('{{ $lesson->slug }}')" id="completeBtn" class="btn-arcade btn-arcade-purple px-8 py-4 rounded-2xl text-white font-bold text-base shadow-xl shadow-purple-600/40">
                🎉 ¡Reclamar +{{ $lesson->xp_reward }} XP y Medalla!
            </button>
        </form>
    </div>

</div>
@endsection

@push('scripts')
<script>
    // Minigame Answer Check
    function checkAnswer(chosen, isCorrect) {
        const feedback = document.getElementById('gameFeedback');
        const title = document.getElementById('feedbackTitle');
        const text = document.getElementById('feedbackText');

        feedback.classList.remove('hidden');

        if (isCorrect) {
            playSfx('success');
            confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
            feedback.className = 'mt-4 p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-200 text-sm space-y-1';
            title.innerHTML = '🎉 ¡Excelente Deducción! (Respuesta Correcta)';
            text.innerHTML = '¡Correcto! Este poema fue generado por una IA en medio segundo. Los modelos de lenguaje analizan miles de millones de versos para recrear métricas y rimas automáticamente.';
        } else {
            playSfx('pop');
            feedback.className = 'mt-4 p-4 rounded-xl border border-amber-500/40 bg-amber-950/40 text-amber-200 text-sm space-y-1';
            title.innerHTML = '🤔 ¡Sorpresa! Parece humano, pero es IA';
            text.innerHTML = 'Ese es precisamente el poder de los modelos actuales: combinan palabras con tanta fluidez que engañan a nuestros sentidos. Por eso en el Club T.I.A. aprenderemos a evaluarlas con pensamiento crítico.';
        }
    }

    // Mini Training Simulator
    function simulatePrediction() {
        const input = document.getElementById('testWordInput').value.trim().toLowerCase();
        const resBox = document.getElementById('simResult');
        const simClass = document.getElementById('simClass');
        const simScore = document.getElementById('simScore');

        if (!input) return;

        playSfx('pop');
        resBox.classList.remove('hidden');

        const fruitKeywords = ['piña', 'uva', 'sandia', 'sandía', 'pera', 'mango', 'manzana', 'cambur', 'platano', 'fresa', 'limon', 'limón', 'comida', 'fruta'];
        const vehicleKeywords = ['moto', 'submarino', 'tren', 'carro', 'auto', 'camioneta', 'barco', 'patineta', 'cohete', 'nave', 'vehiculo', 'transporte'];

        let isFruit = fruitKeywords.some(k => input.includes(k));
        let isVehicle = vehicleKeywords.some(k => input.includes(k));

        if (isFruit) {
            simClass.innerText = '🍎 Clase A: Fruta o Alimento';
            simClass.className = 'text-emerald-400 font-bold';
            simScore.innerText = '96.8%';
        } else if (isVehicle) {
            simClass.innerText = '🚗 Clase B: Vehículo o Transporte';
            simClass.className = 'text-cyan-400 font-bold';
            simScore.innerText = '98.2%';
        } else {
            // General heuristic
            simClass.innerText = '❓ Patrón No Concluyente';
            simClass.className = 'text-amber-400 font-bold';
            simScore.innerText = '45.0% (¡Se necesitan más datos de entrenamiento!)';
        }
    }

    // AJAX Complete Mission
    async function completeMissionAjax(slug) {
        const btn = document.getElementById('completeBtn');
        btn.disabled = true;
        btn.innerText = '⏳ Verificando logros...';

        try {
            const res = await fetch(`mision/${slug}/completar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json'
                }
            });

            const data = await res.json();
            if (data.success) {
                playSfx('success');
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.5 }
                });
                btn.className = 'btn-arcade bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl';
                btn.innerText = '✅ ¡Misión Superada! (' + data.new_xp + ' XP Totales)';
                setTimeout(() => {
                    window.location.href = "{{ route('portal.index') }}";
                }, 2000);
            }
        } catch (e) {
            btn.disabled = false;
            btn.innerText = '🎉 ¡Reclamar Recompensa!';
        }
    }
</script>
@endpush
