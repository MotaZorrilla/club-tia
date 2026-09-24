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
} from 'lucide-react';
import { appUrl } from '../../lib/route';

interface LessonProps {
    lesson: Lesson;
    allLessons: Lesson[];
    onOpenRegister?: () => void;
}

function playSfx(type: 'pop' | 'success') {
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
        } else if (type === 'success') {
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        }
    } catch (e) {}
}

export default function LessonPage({ lesson, allLessons, onOpenRegister }: LessonProps) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    const rounds = lesson.content?.game_rounds || [];
    const glossary = lesson.content?.glossary || [];

    // Minigame State (Paso 1)
    const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    // Simulator State (Paso 4)
    const [simInput, setSimInput] = useState('');
    const [simResult, setSimResult] = useState<{
        category: string;
        confidence: string;
        color: 'emerald' | 'cyan' | 'amber';
    } | null>(null);

    // Final Completion State (Paso 5)
    const [saving, setSaving] = useState(false);
    const [claimedReward, setClaimedReward] = useState<{ xp: number; badge: string } | null>(null);

    const currentRound = rounds[currentRoundIdx];

    const handleSelectOption = (idx: number) => {
        if (hasAnswered) return;
        setSelectedOption(idx);
        setHasAnswered(true);
        playSfx('pop');

        if (currentRound && idx === currentRound.correct) {
            setScore(score + 1);
        }
    };

    const handleNextRound = () => {
        if (currentRoundIdx + 1 < rounds.length) {
            setCurrentRoundIdx(currentRoundIdx + 1);
            setSelectedOption(null);
            setHasAnswered(false);
        } else {
            setGameCompleted(true);
            try {
                confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
            } catch (e) {}
        }
    };

    // AI Prediction Simulator
    const handleSimulate = (wordToTest?: string) => {
        const query = (wordToTest !== undefined ? wordToTest : simInput).trim().toLowerCase();
        if (!query) return;

        playSfx('pop');

        const fruitKeywords = ['piña', 'uva', 'sandia', 'sandía', 'pera', 'mango', 'manzana', 'cambur', 'platano', 'plátano', 'fresa', 'limon', 'limón', 'comida', 'fruta', 'aguacate', 'lechuga', 'tomate', 'naranja', 'guayaba', 'melon', 'melón'];
        const vehicleKeywords = ['moto', 'submarino', 'tren', 'carro', 'auto', 'camioneta', 'barco', 'patineta', 'cohete', 'nave', 'vehiculo', 'vehículo', 'transporte', 'avion', 'avión', 'camion', 'camión', 'bicicleta', 'bici', 'helicoptero', 'helicóptero'];

        const isFruit = fruitKeywords.some(k => query.includes(k));
        const isVehicle = vehicleKeywords.some(k => query.includes(k));

        if (isFruit) {
            setSimResult({
                category: '🍎 Clase A: Fruta o Alimento',
                confidence: '97.8% de coincidencia',
                color: 'emerald',
            });
        } else if (isVehicle) {
            setSimResult({
                category: '🚗 Clase B: Vehículo o Transporte',
                confidence: '98.5% de coincidencia',
                color: 'cyan',
            });
        } else {
            setSimResult({
                category: '❓ Patrón No Concluyente',
                confidence: '43.2% (¡Se necesitan más datos de entrenamiento!)',
                color: 'amber',
            });
        }
    };

    // Final Mission Completion Call
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
                playSfx('success');
                setClaimedReward({ xp: data.new_xp, badge: data.badge });
                try {
                    confetti({
                        particleCount: 120,
                        spread: 90,
                        origin: { y: 0.5 },
                        colors: ['#8b5cf6', '#06b6d4', '#fbbf24', '#10b981'],
                    });
                } catch (e) {}
            }
        } catch (e) {
            alert('Error al registrar la misión');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AppLayout>
            <Head>
                <title>{`${lesson.title} · Club T.I.A. Monte Carmelo`}</title>
                <meta name="description" content={lesson.description} />
                <meta property="og:title" content={`${lesson.title} · Club T.I.A.`} />
                <meta property="og:description" content={lesson.description} />
            </Head>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
                {/* 1. TOP BAR & BREADCRUMBS */}
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href={appUrl('/')}
                        className="btn-arcade bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors"
                    >
                        <ArrowLeft size={14} />
                        <span>Volver al Mapa de Islas</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30 border">
                            Isla 0{lesson.island_number} de 05
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 border">
                            ⭐ +{lesson.xp_reward} XP
                        </span>
                    </div>
                </div>

                {/* 2. MISSION HEADER HERO */}
                <div className="rounded-3xl bg-gradient-to-r from-purple-100 via-indigo-50 to-white dark:from-purple-900/60 dark:via-slate-900 dark:to-indigo-900/60 border border-purple-200 dark:border-purple-500/30 p-8 sm:p-10 relative overflow-hidden shadow-xl dark:shadow-2xl transition-colors">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white border border-purple-300 dark:bg-purple-600/40 dark:border-purple-400 flex items-center justify-center text-4xl shadow-xl shadow-purple-600/30 shrink-0 animate-float">
                            {lesson.icon}
                        </div>
                        <div className="space-y-2 text-center sm:text-left flex-1">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                                Misión Gamificada · Ciclo Pedagógico ERCA
                            </span>
                            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                                {lesson.title}
                            </h1>
                            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium">
                                {lesson.subtitle}
                            </p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                                <span>⏱️ Duración: {lesson.duration_minutes} min</span>
                                <span>·</span>
                                <span className="text-purple-700 dark:text-purple-300 font-bold">🎖️ {lesson.badge_name}</span>
                                <span>·</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● 100% Interactivo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MOMENTO 1 (EXPERIENCIA): MINIJUEGO INTERACTIVO "¿IA O HUMANO?" */}
                <section className="rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 p-6 sm:p-8 space-y-6 shadow-xl transition-colors">
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center text-lg font-black font-display shadow-sm">
                                1
                            </span>
                            <div>
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                    Desafío 1: ¿Inteligencia Artificial o Humano? 🎨
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Momento de Experiencia: Pon a prueba tu intuición para detectar patrones generados por algoritmos.
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-mono bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-xl border border-purple-200 dark:border-purple-500/30 font-bold">
                            {gameCompleted ? '¡Rondas Completadas!' : `Ronda ${currentRoundIdx + 1} de ${rounds.length}`}
                        </span>
                    </div>

                    {!gameCompleted && currentRound ? (
                        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-5">
                            {/* Prompt text */}
                            <div className="bg-white dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm sm:text-base italic leading-relaxed shadow-sm">
                                "{currentRound.prompt}"
                            </div>
                            <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                {currentRound.question}
                            </h3>

                            {/* Option buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                {currentRound.options.map((opt, idx) => {
                                    const isCorrect = idx === currentRound.correct;
                                    const isSelected = selectedOption === idx;

                                    let btnStyle = 'bg-white hover:bg-slate-100 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border-slate-200 dark:border-slate-700 shadow-sm';

                                    if (hasAnswered) {
                                        if (isCorrect) {
                                            btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-md';
                                        } else if (isSelected) {
                                            btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 font-bold shadow-md';
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            disabled={hasAnswered}
                                            onClick={() => handleSelectOption(idx)}
                                            className={`btn-arcade p-4 rounded-2xl border-2 text-sm font-bold flex items-center justify-center gap-3 transition-all ${btnStyle}`}
                                        >
                                            <span>{opt}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Feedback & Next Button */}
                            {hasAnswered && (
                                <div className="mt-4 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-3 animate-fadeIn">
                                    <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                                        💡 <strong>Explicación:</strong> {currentRound.explanation}
                                    </div>
                                    <div className="text-right">
                                        <button
                                            type="button"
                                            onClick={handleNextRound}
                                            className="btn-arcade btn-arcade-purple px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5"
                                        >
                                            <span>{currentRoundIdx + 1 < rounds.length ? 'Siguiente Pregunta' : 'Finalizar Desafío 1'}</span>
                                            <Play size={13} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/40 rounded-2xl p-6 text-center space-y-2">
                            <span className="text-3xl">🎯</span>
                            <h4 className="font-display font-bold text-lg text-emerald-800 dark:text-emerald-300">
                                ¡Desafío 1 Completado! ({score} de {rounds.length} aciertos)
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                                Has demostrado agudeza para distinguir la creatividad artificial de la humana. ¡Continúa con el Momento 2!
                            </p>
                        </div>
                    )}
                </section>

                {/* 4. MOMENTO 2 (REFLEXIÓN): ¿CÓMO PIENSA UNA MÁQUINA? */}
                <section className="rounded-3xl bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-xl transition-colors">
                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <span className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-lg font-black font-display shadow-sm">
                            2
                        </span>
                        <div>
                            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                Momento 2: ¿Cómo Piensa una Máquina? 🤖
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Reflexión Crítica: La diferencia fundamental entre memorizar reglas y aprender a partir de datos.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Programación Tradicional */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3 shadow-sm">
                            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-bold text-sm">
                                <span>💻</span>
                                <span>Programación Clásica (Reglas Fijas)</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                Un humano programa cada instrucción explícita:
                                <code className="text-cyan-800 dark:text-cyan-300 font-mono bg-white dark:bg-slate-950 px-3 py-2 rounded-xl block mt-2 border border-slate-200 dark:border-slate-800 text-[11px]">
                                    SI fruta == 'amarilla' Y forma == 'curva':<br />
                                    &nbsp;&nbsp;ES 'Plátano'
                                </code>
                            </p>
                            <div className="text-[11px] text-amber-800 dark:text-amber-400 font-mono bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200 dark:border-amber-500/20">
                                ⚠️ Problema: ¡Si el plátano está verde o cortado en rodajas, el programa falla por completo!
                            </div>
                        </div>

                        {/* Machine Learning */}
                        <div className="bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/40 rounded-2xl p-5 space-y-3 shadow-sm">
                            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-sm">
                                <span>🧠</span>
                                <span>Aprendizaje Automático (Machine Learning)</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                Le entregamos a la computadora <strong>5.000 fotos de plátanos</strong> de todos los colores, ángulos y tamaños. La computadora descubre los patrones estadísticos sola.
                            </p>
                            <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                                ✅ Ventaja: Reconoce el plátano aunque esté verde, maduro o en un batido licuado.
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. MOMENTO 3 (CONCEPTUALIZACIÓN): GLOSARIO MÁGICO DE LA IA */}
                <section className="rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-xl transition-colors">
                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center text-lg font-black font-display shadow-sm">
                            3
                        </span>
                        <div>
                            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                Glosario Mágico de la Inteligencia Artificial 📚
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Conceptualización: Cuatro conceptos indispensables para hablar con propiedad científica en el Club.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {glossary.map((g, idx) => (
                            <div
                                key={idx}
                                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400/60 transition-all space-y-2 shadow-sm"
                            >
                                <h3 className="font-display font-bold text-amber-700 dark:text-amber-300 text-base flex items-center gap-2">
                                    {g.term}
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {g.def}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. MOMENTO 4 (APLICACIÓN): LABORATORIO DE ENTRENAMIENTO & SIMULADOR */}
                <section className="rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/30 p-6 sm:p-8 space-y-6 shadow-xl transition-colors">
                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <span className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-lg font-black font-display shadow-sm">
                            4
                        </span>
                        <div>
                            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                Laboratorio de Entrenamiento: Tu Primer Mini-Modelo 🧪
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Aplicación Práctica: Alimenta datos de prueba y observa cómo la IA predice la categoría en tiempo real.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6 shadow-inner">
                        {/* Classes explanation */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-500/40 space-y-1 shadow-sm">
                                <span className="font-bold text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                                    <span>🍎</span> Clase A: Frutas y Alimentos
                                </span>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Patrones aprendidos: piña, manzana, uva, sandía, plátano, fresa, naranja.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-cyan-200 dark:border-cyan-500/40 space-y-1 shadow-sm">
                                <span className="font-bold text-sm text-cyan-700 dark:text-cyan-300 flex items-center gap-2">
                                    <span>🚗</span> Clase B: Vehículos y Transporte
                                </span>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Patrones aprendidos: carro, moto, bicicleta, avión, barco, submarino, cohete.
                                </p>
                            </div>
                        </div>

                        {/* Interactive Predictor Input */}
                        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                                Prueba con una nueva palabra en el modelo:
                            </label>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSimulate();
                                }}
                                className="flex flex-col sm:flex-row gap-2"
                            >
                                <input
                                    type="text"
                                    value={simInput}
                                    onChange={(e) => setSimInput(e.target.value)}
                                    placeholder="Ej: piña, moto, submarino, sandía, cohete..."
                                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 font-sans shadow-sm"
                                />
                                <button
                                    type="submit"
                                    className="btn-arcade btn-arcade-emerald text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md"
                                >
                                    ⚡ ¡Clasificar!
                                </button>
                            </form>

                            {/* Quick Test Pills */}
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                                <span className="text-slate-400 text-[11px]">Probar rápido:</span>
                                {['🍓 Fresa', '🚀 Cohete', '🍕 Pizza', '⛵ Barco', '🥑 Aguacate', '🛸 Ovni'].map((pill, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            const clean = pill.split(' ')[1] || pill;
                                            setSimInput(clean);
                                            handleSimulate(clean);
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors border border-slate-200 dark:border-slate-700"
                                    >
                                        {pill}
                                    </button>
                                ))}
                            </div>

                            {/* Simulation Prediction Output */}
                            {simResult && (
                                <div className={`mt-3 p-4 rounded-xl border text-xs font-mono space-y-1 animate-fadeIn ${
                                    simResult.color === 'emerald'
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-600/40 text-emerald-800 dark:text-emerald-200'
                                        : simResult.color === 'cyan'
                                        ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-600/40 text-cyan-800 dark:text-cyan-200'
                                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-600/40 text-amber-800 dark:text-amber-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <span>
                                            Predicción de la Red: <strong>{simResult.category}</strong>
                                        </span>
                                        <span className="font-bold">
                                            {simResult.confidence}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 7. PASO 5: COMPLETAR MISIÓN Y RECLAMAR RECOMPENSA */}
                <div className="text-center p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-purple-100 via-indigo-50 to-white dark:from-purple-950/40 dark:to-slate-900 border border-purple-200 dark:border-purple-500/40 space-y-4 shadow-xl dark:shadow-2xl transition-colors">
                    <div className="text-4xl animate-bounce">🏆</div>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        ¡Has explorado todos los momentos de la Misión 01!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                        Al completar esta clase, recibirás tu <strong>Insignia Despegue IA 🌟</strong> y sumarás <strong>+{lesson.xp_reward} Puntos de Experiencia (XP)</strong> a tu carnet de explorador.
                    </p>

                    {claimedReward ? (
                        <div className="p-6 max-w-md mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-600/50 space-y-3 animate-fadeIn">
                            <span className="text-2xl">🎖️</span>
                            <h4 className="font-display font-bold text-lg text-emerald-800 dark:text-emerald-300">
                                ¡Misión Superada con Éxito!
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                                Tienes ahora <strong>{claimedReward.xp} XP acumulados</strong> en el Club T.I.A.
                            </p>
                            <div className="flex justify-center gap-3 pt-2">
                                <Link
                                    href={appUrl('/')}
                                    className="btn-arcade bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200"
                                >
                                    Ir al Mapa
                                </Link>
                                <Link
                                    href={appUrl('/dashboard')}
                                    className="btn-arcade btn-arcade-purple px-4 py-2 rounded-xl text-xs font-bold text-white"
                                >
                                    Ver Mi Dashboard
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="pt-2">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleCompleteMission}
                                className="btn-arcade btn-arcade-purple px-8 py-4 rounded-2xl text-white font-bold font-display text-base shadow-xl shadow-purple-600/40 hover:scale-105 transition-transform"
                            >
                                {saving ? '⏳ Verificando logros...' : `🎉 ¡Reclamar +${lesson.xp_reward} XP y Medalla!`}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
