@extends('layouts.app')

@section('title', 'Club T.I.A. · Portal de Misiones & Live Polling')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

    <!-- HERO SECTION -->
    <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-100/90 via-indigo-50/80 to-cyan-50/90 border-purple-200 dark:from-slate-900 dark:via-purple-950/70 dark:to-slate-900 border dark:border-purple-500/30 p-8 sm:p-12 shadow-2xl shadow-purple-500/10 transition-colors">
        <div class="absolute -right-10 -bottom-10 opacity-15 dark:opacity-20 pointer-events-none select-none text-[180px] leading-none">
            🤖
        </div>
        <div class="relative z-10 max-w-3xl space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 text-xs font-mono font-bold tracking-wide uppercase">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Plataforma Abierta de Aprendizaje Activo
            </div>
            <h1 class="font-display text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                ¡Bienvenidos al <span class="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">Club T.I.A.</span>! 🚀
            </h1>
            <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                El club escolar de <strong>Tecnologías de la Información &amp; Inteligencia Artificial</strong> de la U. E. Colegio Monte Carmelo. Dejamos de ser consumidores pasivos para convertirnos en creadores de software, entrenadores de algoritmos y pensadores críticos.
            </p>

            <div class="pt-2 flex flex-wrap items-center gap-4">
                <a href="{{ route('portal.lesson', 'el-despegue-de-la-ia') }}" class="btn-arcade btn-arcade-purple px-6 py-3.5 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-purple-600/30">
                    <span>🚀 Iniciar Misión 01: El Despegue de la IA</span>
                    <span class="text-xs font-mono bg-purple-900/50 px-2 py-0.5 rounded-lg text-purple-200">+100 XP</span>
                </a>
                <a href="#live-polling" class="btn-arcade btn-arcade-cyan px-6 py-3.5 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-cyan-600/30">
                    <span>📊 Votar en Vivo (Demo)</span>
                    <span class="text-xs font-mono bg-cyan-900/50 px-2 py-0.5 rounded-lg text-cyan-200">Stats en Tiempo Real</span>
                </a>
            </div>

            <!-- Quick Community Badges -->
            <div class="pt-4 flex flex-wrap gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                <span class="flex items-center gap-1.5"><strong class="text-purple-600 dark:text-purple-400 font-bold">5</strong> Islas de Aventura</span>
                <span>·</span>
                <span class="flex items-center gap-1.5"><strong class="text-amber-600 dark:text-amber-400 font-bold">3:00 a 5:30 PM</strong> Bloque Vespertino</span>
            </div>
        </div>
    </div>

    <!-- LIVE POLLING MODULE (ENCUESTA EN VIVO) -->
    <section id="live-polling" class="relative rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-cyan-200 dark:border-cyan-500/30 p-6 sm:p-10 shadow-xl shadow-cyan-500/5 transition-colors">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div class="space-y-1">
                <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 uppercase">
                        ⚡ Dinámica Interactiva de Clase
                    </span>
                    <span id="liveBadge" class="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Votación en Vivo
                    </span>
                </div>
                <h2 class="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>📊 Encuesta en Tiempo Real:</span>
                    <span class="text-slate-500 dark:text-slate-300 text-lg font-sans font-normal hidden sm:inline">Voz de la Comunidad</span>
                </h2>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                    Herramienta nativa para que el facilitador lance preguntas al proyector y los alumnos voten desde sus pantallas.
                </p>
            </div>

            <!-- Total votes counter and reset button -->
            <div class="flex items-center gap-3 self-start md:self-auto">
                <div class="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-center font-mono">
                    <span class="text-[10px] uppercase text-slate-500 dark:text-slate-400 block font-bold">Votos Emitidos</span>
                    <span id="totalVotesCount" class="text-xl font-bold text-cyan-600 dark:text-cyan-400 font-display">
                        {{ $pollStats['total_votes'] ?? 0 }}
                    </span>
                </div>
                @if(isset($currentUser) && $currentUser->isFacilitador())
                <button onclick="resetPoll({{ $activePoll->id ?? 1 }})" class="btn-arcade bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 text-xs font-bold px-3 py-3 rounded-2xl" title="Reiniciar votos para la demo">
                    🔄 Reiniciar
                </button>
                @endif
            </div>
        </div>

        @if($activePoll)
        <div class="space-y-6">
            <!-- Question Box -->
            <div class="bg-purple-50/90 dark:bg-gradient-to-r dark:from-purple-950/60 dark:to-slate-800/60 border border-purple-200 dark:border-purple-500/20 p-5 rounded-2xl">
                <h3 class="font-display text-lg sm:text-xl font-bold text-purple-900 dark:text-purple-200">
                    {{ $activePoll->question }}
                </h3>
            </div>

            <!-- Options Grid (Voting Buttons & Real-Time Bars) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @foreach($pollStats['options'] as $opt)
                <div class="group relative overflow-hidden rounded-2xl bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all p-5 flex flex-col justify-between shadow-sm">
                    <div class="flex items-start justify-between gap-3 mb-4">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl p-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 shadow-inner">
                                {{ $opt['emoji'] }}
                            </span>
                            <div>
                                <h4 class="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-snug">
                                    {{ $opt['text'] }}
                                </h4>
                                <span class="text-xs font-mono text-slate-500 dark:text-slate-400" id="votes-{{ $opt['id'] }}">
                                    {{ $opt['votes'] }} votos ({{ $opt['percentage'] }}%)
                                </span>
                            </div>
                        </div>
                        <button onclick="castVote({{ $activePoll->id }}, '{{ $opt['id'] }}')" class="btn-arcade px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 shadow-md" style="background-color: {{ $opt['color'] }}; box-shadow: 0 4px 0 rgba(0,0,0,0.3);">
                            ¡Votar! ✨
                        </button>
                    </div>

                    <!-- Animated Progress Bar -->
                    <div class="w-full bg-slate-200 dark:bg-slate-950 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-800">
                        <div id="bar-{{ $opt['id'] }}" class="h-full rounded-full transition-all duration-700 ease-out" style="width: {{ $opt['percentage'] }}%; background-color: {{ $opt['color'] }};"></div>
                    </div>
                </div>
                @endforeach
            </div>

            <div class="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 font-mono">
                💡 Cada voto otorga <strong>+15 XP</strong> al perfil del estudiante y actualiza las estadísticas en vivo instantáneamente vía AJAX.
            </div>
        </div>
        @endif
    </section>

    <!-- EL MAPA DE AVENTURAS: LAS 5 ISLAS DEL CLUB T.I.A. -->
    <section id="islas" class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/40 uppercase">
                        🗺️ Mapa Curricular Gamificado (World Map)
                    </span>
                </div>
                <h2 class="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                    Las 5 Misiones Troncales del Club T.I.A.
                </h2>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                    Ruta de aprendizaje progresivo por islas temáticas. ¡Completa misiones para desbloquear nuevos niveles y ganar medallas!
                </p>
            </div>
            <div class="text-xs font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <span>Progreso General: </span>
                <strong class="text-purple-600 dark:text-purple-400">1 de 5 Misiones Desbloqueadas (20%)</strong>
            </div>
        </div>

        <!-- The 5 Islands Grid in Exact Requested Order -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">

            @foreach($lessons as $index => $les)
            <div class="relative rounded-3xl p-5 border flex flex-col justify-between transition-all duration-300 {{ $les->is_unlocked ? 'bg-gradient-to-b from-purple-50 via-white to-white dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 border-purple-300 dark:border-purple-500/50 shadow-xl shadow-purple-500/10 hover:border-purple-500 dark:hover:border-purple-400 hover:-translate-y-1' : 'bg-slate-100/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-80 dark:opacity-75' }}">
                
                <!-- Card Header: Island Number & Status -->
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold uppercase {{ $les->is_unlocked ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700' }}">
                            {{ $les->is_unlocked ? '🔓 Disponible' : '🔒 Bloqueada' }}
                        </span>
                        <span class="text-xs font-mono font-bold text-amber-500 dark:text-amber-400">
                            ⭐ +{{ $les->xp_reward }} XP
                        </span>
                    </div>

                    <!-- Icon & Title -->
                    <div class="text-center py-4">
                        <div class="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-inner {{ $les->is_unlocked ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-purple-500/30 animate-float' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500' }}">
                            {{ $les->icon }}
                        </div>
                        <h3 class="font-display text-lg font-bold text-slate-900 dark:text-white leading-snug">
                            {{ $les->title }}
                        </h3>
                        <p class="text-xs font-mono text-purple-600 dark:text-purple-300 mt-1">
                            {{ $les->subtitle }}
                        </p>
                    </div>

                    <!-- Description -->
                    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-center">
                        {{ $les->description }}
                    </p>
                </div>

                <!-- Footer: Action Button -->
                <div class="pt-6 border-t border-slate-200 dark:border-slate-800/80 mt-4">
                    @if($les->is_unlocked)
                    <a href="{{ route('portal.lesson', $les->slug) }}" class="btn-arcade btn-arcade-purple w-full py-2.5 rounded-xl text-white font-bold text-xs text-center block shadow-md">
                        🎮 ¡Jugar Misión 01!
                    </a>
                    @else
                    <button disabled class="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-bold text-xs text-center cursor-not-allowed">
                        🔒 Requiere Misión 0{{ $les->island_number - 1 }}
                    </button>
                    @endif
                </div>
            </div>
            @endforeach

        </div>
    </section>

    <!-- SINERGIAS ACADÉMICAS DEL MONTE CARMELO -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Sinergia 1: Olimpiada Canguro -->
        <div class="bg-gradient-to-br from-amber-50 via-white to-amber-50/40 dark:from-amber-950/30 dark:to-slate-900 border border-amber-200 dark:border-amber-500/30 rounded-3xl p-6 space-y-3 shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center text-2xl">
                🏆
            </div>
            <h3 class="font-display text-xl font-bold text-amber-900 dark:text-amber-200">Olimpiada Canguro Matemático</h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Articulación con el área de Ciencias. El pensamiento algorítmico y la descomposición lógica preparan la mente para resolver acertijos y desafíos deductivos de alta competencia.
            </p>
            <span class="inline-block text-[11px] font-mono text-amber-700 dark:text-amber-400 font-bold">Misión 04 · Gimnasio Matemático</span>
        </div>

        <!-- Sinergia 2: Plan Lector con Prof. Andrea -->
        <div class="bg-gradient-to-br from-cyan-50 via-white to-cyan-50/40 dark:from-cyan-950/30 dark:to-slate-900 border border-cyan-200 dark:border-cyan-500/30 rounded-3xl p-6 space-y-3 shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/40 flex items-center justify-center text-2xl">
                📖
            </div>
            <h3 class="font-display text-xl font-bold text-cyan-900 dark:text-cyan-200">Plan Lector (Prof. Andrea)</h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Comprensión lectora asistida con Google NotebookLM (el Notebook de Gemini). Los estudiantes investigan libros, generan mapas conceptuales y formulan prompts sin alucinaciones.
            </p>
            <span class="inline-block text-[11px] font-mono text-cyan-700 dark:text-cyan-400 font-bold">Misión 02 · Detective de Libros</span>
        </div>

        <!-- Sinergia 3: Futura App de Biblioteca -->
        <div class="bg-gradient-to-br from-purple-50 via-white to-purple-50/40 dark:from-purple-950/30 dark:to-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 space-y-3 shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/40 flex items-center justify-center text-2xl">
                📱
            </div>
            <h3 class="font-display text-xl font-bold text-purple-900 dark:text-purple-200">App para la Biblioteca Escolar</h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Proyecto de mediano plazo en MIT App Inventor y SQLite. Una herramienta móvil creada por los propios estudiantes para la búsqueda y catalogación de lecturas del plantel.
            </p>
            <span class="inline-block text-[11px] font-mono text-purple-700 dark:text-purple-400 font-bold">Fase 2 · Desarrollo de Software</span>
        </div>

    </section>

    <!-- TABLA DE CLASIFICACIÓN (LEADERBOARD DE EXPLORADORES) -->
    <section class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
                <h3 class="font-display text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🌟 Salón de la Fama T.I.A.:</span>
                    <span class="text-slate-500 dark:text-slate-400 text-sm font-sans font-normal">Exploradores Activos</span>
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Puntos de experiencia acumulados mediante la participación en clase y retos superados.</p>
            </div>
            <button onclick="document.getElementById('userModal').classList.remove('hidden')" class="btn-arcade btn-arcade-purple px-4 py-2 rounded-xl text-white text-xs font-bold self-start shadow-md">
                + Registrar Nuevo Alumno
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead>
                    <tr class="border-b border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">
                        <th class="pb-3 pl-2">#</th>
                        <th class="pb-3">Explorador</th>
                        <th class="pb-3">Grado / Nivel</th>
                        <th class="pb-3">Rol</th>
                        <th class="pb-3 text-right pr-2">Experiencia (XP)</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono text-xs">
                    @foreach($allUsers->sortByDesc('xp_points') as $rank => $u)
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors {{ isset($currentUser) && $currentUser->id === $u->id ? 'bg-purple-50 dark:bg-purple-900/20 font-bold' : '' }}">
                        <td class="py-3 pl-2 text-slate-500 font-bold">
                            @if($rank === 0) 🥇 @elseif($rank === 1) 🥈 @elseif($rank === 2) 🥉 @else #{{ $rank + 1 }} @endif
                        </td>
                        <td class="py-3 flex items-center gap-2 font-sans font-semibold text-slate-800 dark:text-slate-200">
                            <span class="text-xl">{{ $u->getAvatarEmoji() }}</span>
                            <span>{{ $u->name }}</span>
                            @if(isset($currentUser) && $currentUser->id === $u->id)
                            <span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono">TÚ</span>
                            @endif
                        </td>
                        <td class="py-3 text-slate-600 dark:text-slate-400">{{ $u->grade ?? 'N/A' }}</td>
                        <td class="py-3">
                            <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold {{ $u->isFacilitador() ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30' : ($u->isColaborador() ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30') }}">
                                {{ $u->role }}
                            </span>
                        </td>
                        <td class="py-3 text-right pr-2 text-amber-500 dark:text-amber-400 font-bold">
                            ⭐ {{ $u->xp_points }} XP (Nivel {{ $u->level }})
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </section>

</div>
@endsection

@push('scripts')
<script>
    // AJAX Live Voting without full page reload
    async function castVote(pollId, optionId) {
        try {
            playSfx('success');
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 }
            });

            const response = await fetch(`api/polls/${pollId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ option_id: optionId })
            });

            const data = await response.json();
            if (data.success) {
                updatePollUI(data.stats);
            }
        } catch (error) {
            console.error('Error al emitir voto:', error);
        }
    }

    // Facilitator Reset Poll
    async function resetPoll(pollId) {
        if (!confirm('¿Deseas reiniciar los votos de la encuesta para la demostración?')) return;
        try {
            const response = await fetch(`api/polls/${pollId}/reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                updatePollUI(data.stats);
            }
        } catch (error) {
            console.error('Error al reiniciar:', error);
        }
    }

    // Update real-time stats visually
    function updatePollUI(stats) {
        document.getElementById('totalVotesCount').innerText = stats.total_votes;
        stats.options.forEach(opt => {
            const votesLabel = document.getElementById(`votes-${opt.id}`);
            const bar = document.getElementById(`bar-${opt.id}`);
            if (votesLabel) {
                votesLabel.innerText = `${opt.votes} votos (${opt.percentage}%)`;
            }
            if (bar) {
                bar.style.width = `${opt.percentage}%`;
            }
        });
    }

    // Auto-poll active stats every 5 seconds for live audience polling!
    setInterval(async () => {
        try {
            const res = await fetch('api/polls/active');
            if (res.ok) {
                const stats = await res.json();
                updatePollUI(stats);
            }
        } catch (e) {}
    }, 5000);
</script>
@endpush
