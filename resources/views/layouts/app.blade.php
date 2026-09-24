<!DOCTYPE html>
<html lang="es" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="{{ rtrim(url('/'), '/') }}/">
    <title>@yield('title', 'Club T.I.A. · Colegio Monte Carmelo')</title>
    <meta name="description" content="Portal Educativo Gamificado del Club de Tecnologías de la Información & Inteligencia Artificial de la U.E. Colegio Monte Carmelo (Puerto Ordaz).">
    
    <!-- Google Fonts: Fredoka (arcade/friendly) + Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS CDN for instant robust styling & zero build failure -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        display: ['"Fredoka"', 'cursive', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                    },
                    colors: {
                        tia: {
                            purple: '#8b5cf6',
                            purpleDark: '#6d28d9',
                            cyan: '#06b6d4',
                            cyanDark: '#0891b2',
                            yellow: '#fbbf24',
                            yellowDark: '#d97706',
                            emerald: '#10b981',
                            emeraldDark: '#059669',
                            rose: '#f43f5e',
                            roseDark: '#e11d48',
                            blue: '#3b82f6',
                            blueDark: '#1d4ed8',
                        }
                    }
                }
            }
        }
    </script>
    
    <!-- Canvas Confetti for Gamification Rewards -->
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>

    <style>
        .font-display { font-family: 'Fredoka', cursive, sans-serif; }
        
        /* 3D Tactile Arcade Buttons */
        .btn-arcade {
            transition: all 0.15s ease-out;
            cursor: pointer;
            user-select: none;
        }
        .btn-arcade:active {
            transform: translateY(4px);
        }

        .btn-arcade-purple {
            background-color: #8b5cf6;
            box-shadow: 0 6px 0 #5b21b6;
        }
        .btn-arcade-purple:active {
            box-shadow: 0 2px 0 #5b21b6;
        }

        .btn-arcade-cyan {
            background-color: #06b6d4;
            box-shadow: 0 6px 0 #0e7490;
        }
        .btn-arcade-cyan:active {
            box-shadow: 0 2px 0 #0e7490;
        }

        .btn-arcade-emerald {
            background-color: #10b981;
            box-shadow: 0 6px 0 #047857;
        }
        .btn-arcade-emerald:active {
            box-shadow: 0 2px 0 #047857;
        }

        .btn-arcade-amber {
            background-color: #f59e0b;
            box-shadow: 0 6px 0 #b45309;
        }
        .btn-arcade-amber:active {
            box-shadow: 0 2px 0 #b45309;
        }

        /* Float animations */
        @keyframes floatSlow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        .animate-float {
            animation: floatSlow 3.5s ease-in-out infinite;
        }

        @keyframes pulseGlow {
            0%, 100% { filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.4)); }
            50% { filter: drop-shadow(0 0 25px rgba(6, 182, 212, 0.7)); }
        }
        .glow-tia {
            animation: pulseGlow 3s ease-in-out infinite;
        }
    </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-purple-500 selection:text-white">

    <!-- Ambient glowing backdrop -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div class="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div class="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]"></div>
        <div class="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/15 rounded-full blur-[120px]"></div>
    </div>

    <!-- TOP NAVIGATION BAR -->
    <header class="relative z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
            
            <!-- Brand Logo & Identity -->
            <a href="{{ route('portal.index') }}" class="flex items-center gap-3 group">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
                    <div class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl">
                        🤖
                    </div>
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <span class="font-display text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                            CLUB T.I.A.
                        </span>
                        <span class="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                            Monte Carmelo
                        </span>
                    </div>
                    <p class="text-xs text-slate-400 font-medium hidden sm:block">Tecnologías de la Información &amp; Inteligencia Artificial</p>
                </div>
            </a>

            <!-- Right Controls: User Profile, XP Pill & Role Switcher -->
            <div class="flex items-center gap-3 sm:gap-4">
                
                <!-- Quick User Status -->
                @if(isset($currentUser))
                <div class="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-2xl p-1.5 sm:px-3 sm:py-1.5 shadow-sm">
                    <div class="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xl">
                        {{ $currentUser->getAvatarEmoji() }}
                    </div>
                    <div class="hidden sm:block text-left">
                        <div class="flex items-center gap-1.5">
                            <span class="text-xs font-bold text-slate-200 leading-tight">{{ $currentUser->name }}</span>
                            <span class="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase {{ $currentUser->isFacilitador() ? 'bg-amber-500/20 text-amber-300' : ($currentUser->isColaborador() ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-300') }}">
                                {{ $currentUser->role }}
                            </span>
                        </div>
                        <div class="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                            <span class="text-amber-400 font-bold flex items-center gap-0.5">
                                ⭐ {{ $currentUser->xp_points }} XP
                            </span>
                            <span>· Nivel {{ $currentUser->level }}</span>
                        </div>
                    </div>
                </div>
                @endif

                <!-- Demo Switcher Button -->
                <button onclick="document.getElementById('userModal').classList.remove('hidden')" class="btn-arcade bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm" title="Cambiar de usuario en la demo">
                    <span>👥</span>
                    <span class="hidden md:inline">Roles Demo</span>
                </button>

                <!-- Back to Aula Virtual Hub -->
                <a href="https://aula.motazorrilla.com/" target="_blank" class="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors">
                    <span>🏛️</span>
                    <span>Aula Virtual</span>
                </a>
            </div>
        </div>
    </header>

    <!-- MAIN CONTENT CONTAINER -->
    <main class="relative z-10 flex-1">
        @if(session('success'))
        <div class="max-w-7xl mx-auto px-4 mt-4">
            <div class="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 p-4 rounded-2xl flex items-center gap-3">
                <span class="text-2xl">🎉</span>
                <span class="text-sm font-semibold">{{ session('success') }}</span>
            </div>
        </div>
        @endif

        @if(session('info'))
        <div class="max-w-7xl mx-auto px-4 mt-4">
            <div class="bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 p-4 rounded-2xl flex items-center gap-3">
                <span class="text-2xl">ℹ️</span>
                <span class="text-sm font-semibold">{{ session('info') }}</span>
            </div>
        </div>
        @endif

        @yield('content')
    </main>

    <!-- FOOTER -->
    <footer class="relative z-10 border-t border-slate-800 bg-slate-950/80 py-8 mt-16 text-center text-xs text-slate-400">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2">
                <span class="text-lg">🤖</span>
                <span class="font-display font-bold text-slate-200 text-sm">Club T.I.A. Monte Carmelo</span>
                <span>· Puerto Ordaz, Venezuela</span>
            </div>
            <div class="flex items-center gap-4 text-slate-400">
                <span>Facilitador: Ing. Héctor Mota Zorrilla</span>
                <span>·</span>
                <span class="text-purple-400 font-semibold">Presupuesto US$ 0 · Software Libre</span>
            </div>
        </div>
    </footer>

    <!-- MODAL: CAMBIO RÁPIDO DE USUARIO / REGISTRO DE EXPLORADOR -->
    <div id="userModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <button onclick="document.getElementById('userModal').classList.add('hidden')" class="absolute top-4 right-4 text-slate-400 hover:text-white p-2 text-xl font-bold">
                ✕
            </button>
            
            <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
                    👥
                </div>
                <div>
                    <h3 class="font-display text-xl font-bold text-white">Selector de Roles (Para la Demo)</h3>
                    <p class="text-xs text-slate-400">Elige con qué perfil navegar el portal durante la presentación</p>
                </div>
            </div>

            <!-- Existing users list -->
            <div class="space-y-2 mb-6">
                @if(isset($allUsers))
                @foreach($allUsers as $u)
                <form action="{{ route('users.switch', $u->id) }}" method="POST">
                    @csrf
                    <button type="submit" class="w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between {{ isset($currentUser) && $currentUser->id === $u->id ? 'bg-purple-900/30 border-purple-500/80 text-white' : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800' }}">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl">{{ $u->getAvatarEmoji() }}</span>
                            <div>
                                <div class="text-sm font-bold">{{ $u->name }}</div>
                                <div class="text-xs text-slate-400">{{ $u->grade ?? 'Sin grado' }}</div>
                            </div>
                        </div>
                        <div class="text-right font-mono text-xs">
                            <span class="block px-2 py-0.5 rounded text-[10px] font-bold uppercase {{ $u->isFacilitador() ? 'bg-amber-500/20 text-amber-300' : ($u->isColaborador() ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-300') }}">
                                {{ $u->role }}
                            </span>
                            <span class="text-amber-400 font-bold">⭐ {{ $u->xp_points }} XP</span>
                        </div>
                    </button>
                </form>
                @endforeach
                @endif
            </div>

            <!-- Quick Register New Student -->
            <div class="border-t border-slate-800 pt-4">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Registrar Nuevo Alumno en Vivo</h4>
                <form action="{{ route('users.register') }}" method="POST" class="space-y-3">
                    @csrf
                    <input type="hidden" name="role" value="alumno">
                    <div class="grid grid-cols-2 gap-3">
                        <input type="text" name="name" placeholder="Nombre y Apellido" required class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500">
                        <select name="grade" class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500">
                            <option value="4° Primaria">4° Primaria</option>
                            <option value="5° Primaria" selected>5° Primaria</option>
                            <option value="6° Primaria">6° Primaria</option>
                            <option value="1° Año Media">1° Año Media</option>
                            <option value="2° Año Media">2° Año Media</option>
                            <option value="3° Año Media">3° Año Media</option>
                            <option value="4° Año Media">4° Año Media</option>
                            <option value="5° Año Media">5° Año Media</option>
                        </select>
                    </div>
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <label class="text-xs text-slate-400">Avatar:</label>
                            <select name="avatar" class="bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 text-sm text-white">
                                <option value="robot">🤖 Robot</option>
                                <option value="astronaut">🚀 Astronauta</option>
                                <option value="scientist">🔬 Científica</option>
                                <option value="coder">💻 Coder</option>
                                <option value="ninja">🥷 Ninja</option>
                                <option value="gamer">🎮 Gamer</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-arcade btn-arcade-purple text-white text-xs font-bold px-4 py-2 rounded-xl">
                            ¡Unirse (+100 XP)! 🌟
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Web Audio Synthesized Sound Effects for Gamification (Zero External Audio Files) -->
    <script>
        const playSfx = (type) => {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                if (type === 'success') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
                    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
                    osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
                    gain.gain.setValueAtTime(0.3, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.6);
                } else if (type === 'pop') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(400, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
                    gain.gain.setValueAtTime(0.2, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.15);
                }
            } catch (e) {
                console.log('Audio not supported or blocked');
            }
        };
    </script>

    @stack('scripts')
</body>
</html>
