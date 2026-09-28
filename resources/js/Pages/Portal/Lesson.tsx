import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { Lesson, SharedProps, PromptChallenge, GlossaryItem } from '../../types';
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
    ShieldAlert,
    Radio,
    Award,
} from 'lucide-react';
import { appUrl } from '../../lib/route';

interface LessonProps {
    lesson: Lesson;
    allLessons: Lesson[];
    onOpenRegister?: () => void;
}

// Synthesized Sound FX via Web Audio API (Zero external assets)
function playSfx(type: 'pop' | 'success' | 'combo' | 'levelup') {
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
        }
    } catch (e) {}
}

export default function LessonPage({ lesson, allLessons, onOpenRegister }: LessonProps) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    const content = lesson.content || {};
    const rounds = content.game_rounds || [];
    const glossary: GlossaryItem[] = content.glossary || [];
    const promptChallenges: PromptChallenge[] = content.prompt_challenges || [];

    const level1Webquest = content.level1_webquest;
    const level2Webquest = content.level2_webquest;
    const level3Webquest = content.level3_webquest;

    // --- LEVEL 1 STATE (Humano vs Algoritmo) ---
    const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    const currentRound = rounds[currentRoundIdx];

    const handleSelectOption = (idx: number) => {
        if (hasAnswered) return;
        setSelectedOption(idx);
        setHasAnswered(true);

        const isCorrect = currentRound && idx === currentRound.correct;
        if (isCorrect) {
            setScore(prev => prev + 1);
            setStreak(prev => {
                const next = prev + 1;
                if (next >= 2) playSfx('combo');
                else playSfx('pop');
                return next;
            });
        } else {
            setStreak(0);
            playSfx('pop');
        }
    };

    const handleNextRound = () => {
        if (currentRoundIdx + 1 < rounds.length) {
            setCurrentRoundIdx(prev => prev + 1);
            setSelectedOption(null);
            setHasAnswered(false);
        } else {
            setGameCompleted(true);
            playSfx('levelup');
            try {
                confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
            } catch (e) {}
        }
    };

    const handleResetGame1 = () => {
        setCurrentRoundIdx(0);
        setSelectedOption(null);
        setHasAnswered(false);
        setScore(0);
        setStreak(0);
        setGameCompleted(false);
    };

    // --- LEVEL 2 STATE (Laboratorio de Entrenamiento y Confianza) ---
    const [simInput, setSimInput] = useState('');
    const [testedWordsCount, setTestedWordsCount] = useState(0);
    const [simResult, setSimResult] = useState<{
        category: string;
        confidence: string;
        percentage: number;
        color: 'emerald' | 'cyan' | 'amber';
        details: string;
    } | null>(null);

    const handleSimulate = (wordToTest?: string) => {
        const query = (wordToTest !== undefined ? wordToTest : simInput).trim().toLowerCase();
        if (!query) return;

        playSfx('pop');
        setTestedWordsCount(prev => prev + 1);

        const fruitKeywords = ['piña', 'uva', 'sandia', 'sandía', 'pera', 'mango', 'manzana', 'cambur', 'platano', 'plátano', 'fresa', 'limon', 'limón', 'comida', 'fruta', 'aguacate', 'lechuga', 'tomate', 'naranja', 'guayaba', 'melon', 'melón'];
        const vehicleKeywords = ['moto', 'submarino', 'tren', 'carro', 'auto', 'camioneta', 'barco', 'patineta', 'cohete', 'nave', 'vehiculo', 'vehículo', 'transporte', 'avion', 'avión', 'camion', 'camión', 'bicicleta', 'bici', 'helicoptero', 'helicóptero'];

        const isFruit = fruitKeywords.some(k => query.includes(k));
        const isVehicle = vehicleKeywords.some(k => query.includes(k));

        if (isFruit) {
            setSimResult({
                category: '🍎 Clase A: Fruta o Alimento Natural',
                confidence: '98.4% de certeza probabilística',
                percentage: 98,
                color: 'emerald',
                details: 'El modelo reconoció coincidencias estadísticas con el conjunto de frutas del dataset.',
            });
        } else if (isVehicle) {
            setSimResult({
                category: '🚗 Clase B: Vehículo o Transporte Mecánico',
                confidence: '99.1% de certeza probabilística',
                percentage: 99,
                color: 'cyan',
                details: 'El modelo detectó patrones asociados a transporte y velocidad en sus matrices de datos.',
            });
        } else {
            setSimResult({
                category: '❓ Patrón No Concluyente / Ambigüedad',
                confidence: '41.2% (Incertidumbre)',
                percentage: 41,
                color: 'amber',
                details: '¡Excelente caso de prueba! Esta palabra no estaba bien representada en el dataset inicial. Esto demuestra por qué una IA necesita millones de datos.',
            });
        }
    };

    // --- LEVEL 3 STATE (El Reparador de Prompts / Prompt Crafter) ---
    const [challengeIdx, setChallengeIdx] = useState(0);
    const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
    const [testedPrompt, setTestedPrompt] = useState(false);
    const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);

    const activeChallenge = promptChallenges[challengeIdx] || null;

    const toggleBlock = (blockId: string) => {
        playSfx('pop');
        setTestedPrompt(false);
        if (selectedBlocks.includes(blockId)) {
            setSelectedBlocks(selectedBlocks.filter(id => id !== blockId));
        } else {
            setSelectedBlocks([...selectedBlocks, blockId]);
        }
    };

    const handleTestPrompt = () => {
        if (!activeChallenge) return;
        setTestedPrompt(true);

        const correctSet = new Set(activeChallenge.correct_selection);
        const userSet = new Set(selectedBlocks);

        let isCorrect = correctSet.size === userSet.size && [...correctSet].every(x => userSet.has(x));

        if (isCorrect) {
            playSfx('success');
            if (!completedChallenges.includes(activeChallenge.id)) {
                setCompletedChallenges([...completedChallenges, activeChallenge.id]);
            }
        } else {
            playSfx('pop');
        }
    };

    const handleNextChallenge = () => {
        if (challengeIdx + 1 < promptChallenges.length) {
            setChallengeIdx(challengeIdx + 1);
            setSelectedBlocks([]);
            setTestedPrompt(false);
        }
    };

    // --- GLOSSARY STATE (Active Self-Review) ---
    const [revealedTerms, setRevealedTerms] = useState<number[]>([]);
    const [masteredTerms, setMasteredTerms] = useState<number[]>([]);

    const toggleRevealTerm = (idx: number) => {
        playSfx('pop');
        if (revealedTerms.includes(idx)) {
            setRevealedTerms(revealedTerms.filter(i => i !== idx));
        } else {
            setRevealedTerms([...revealedTerms, idx]);
        }
    };

    const toggleMasterTerm = (idx: number) => {
        if (masteredTerms.includes(idx)) {
            setMasteredTerms(masteredTerms.filter(i => i !== idx));
        } else {
            playSfx('success');
            setMasteredTerms([...masteredTerms, idx]);
        }
    };

    // --- FINAL COMPLETION STATE ---
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
                        particleCount: 120,
                        spread: 90,
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
                {/* 1. TOP BAR & PROGRESS SUMMARY */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link
                        href={appUrl('/')}
                        className="btn-arcade bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors self-start sm:self-auto"
                    >
                        <ArrowLeft size={14} />
                        <span>Volver al Mapa de Islas</span>
                    </Link>

                    {/* Progress Tracker Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30 border">
                            Isla 0{lesson.island_number} de 05
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 border">
                            ⭐ +{lesson.xp_reward} XP
                        </span>
                        {user && (
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30 border flex items-center gap-1">
                                <span>{user.avatar_emoji}</span>
                                <span>{user.name.split(' ')[0]}</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* 2. MISSION HERO HEADER */}
                <div className="rounded-3xl bg-gradient-to-r from-purple-100 via-indigo-50 to-white dark:from-purple-900/60 dark:via-slate-900 dark:to-indigo-900/60 border border-purple-200 dark:border-purple-500/30 p-6 sm:p-10 relative overflow-hidden shadow-xl dark:shadow-2xl transition-colors">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white border border-purple-300 dark:bg-purple-600/40 dark:border-purple-400 flex items-center justify-center text-4xl shadow-xl shadow-purple-600/30 shrink-0">
                            {lesson.icon}
                        </div>
                        <div className="space-y-2 text-center sm:text-left flex-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[11px] font-mono font-bold uppercase tracking-wider border border-purple-500/20">
                                <Sparkles size={12} className="text-amber-500" />
                                <span>Clase 01 · 3 Niveles de Teoría Intercalada + Minijuegos</span>
                            </div>
                            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                                {lesson.title}
                            </h1>
                            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                {lesson.subtitle}
                            </p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                                <span>⏱️ {lesson.duration_minutes} min de aula</span>
                                <span>·</span>
                                <span className="text-purple-700 dark:text-purple-300 font-bold">🎖️ {lesson.badge_name}</span>
                                <span>·</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">🔍 WebQuest + 3 Desafíos</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ============================================================== */}
                {/* NIVEL 1: DEFINICIÓN FORMAL vs FICCIÓN + MINIJUEGO 1 */}
                {/* ============================================================== */}
                <section className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-500/30 p-6 sm:p-8 space-y-6 shadow-xl transition-colors">
                    {/* Level 1 Header */}
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center text-lg font-black font-display shadow-sm">
                                1
                            </span>
                            <div>
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span>Nivel 1: ¿Qué es realmente la Inteligencia Artificial?</span>
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Fase de Investigación Web & Desafío de Detección (Realidad vs. Ficción)
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-bold">
                            🥉 Desafío Inicial
                        </span>
                    </div>

                    {/* 1.1 WebQuest Box */}
                    {level1Webquest && (
                        <div className="bg-gradient-to-br from-purple-50 via-indigo-50/40 to-slate-50 dark:from-purple-950/30 dark:via-slate-800/80 dark:to-slate-900 rounded-2xl p-5 sm:p-6 border border-purple-200 dark:border-purple-800/50 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2 text-xs font-bold font-mono text-purple-700 dark:text-purple-300 uppercase">
                                <Search size={15} />
                                <span>Misión de Búsqueda Web en Clase</span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                                    Abre una pestaña en tu navegador y busca en Google o consulta las siguientes frases exactas:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {level1Webquest.search_queries.map((q, idx) => (
                                        <a
                                            key={idx}
                                            href={`https://www.google.com/search?q=${encodeURIComponent(q)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-700/60 text-xs font-mono text-purple-700 dark:text-purple-300 hover:bg-purple-100 hover:border-purple-400 transition-all shadow-sm"
                                        >
                                            <span>"{q}"</span>
                                            <ExternalLink size={11} />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Key Takeaway */}
                            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                                <strong className="text-purple-700 dark:text-purple-400 block font-display">
                                    💡 Conclusión Científica del Nivel 1:
                                </strong>
                                <p className="leading-relaxed">
                                    {level1Webquest.key_takeaway}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 1.2 Minijuego 1: ¿Humano o Algoritmo? */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span>🎮 Minijuego 1: Detector de Inteligencia</span>
                                {streak >= 2 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono font-black animate-pulse">
                                        <Flame size={13} />
                                        <span>Racha x{streak}</span>
                                    </span>
                                )}
                            </h3>
                            <span className="text-xs font-mono text-purple-700 dark:text-purple-300 font-bold">
                                {gameCompleted ? '¡Rondas Completas!' : `Pregunta ${currentRoundIdx + 1} de ${rounds.length}`}
                            </span>
                        </div>

                        {!gameCompleted && currentRound ? (
                            <div className="space-y-4">
                                <div className="bg-white dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm italic leading-relaxed shadow-sm">
                                    "{currentRound.prompt}"
                                </div>
                                <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                    {currentRound.question}
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {currentRound.options.map((opt, idx) => {
                                        const isCorrect = idx === currentRound.correct;
                                        const isSelected = selectedOption === idx;

                                        let btnStyle = 'bg-white hover:bg-slate-100 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border-slate-200 dark:border-slate-700';

                                        if (hasAnswered) {
                                            if (isCorrect) {
                                                btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                                            } else if (isSelected) {
                                                btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                                            }
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                disabled={hasAnswered}
                                                onClick={() => handleSelectOption(idx)}
                                                className={`btn-arcade p-3.5 rounded-2xl border-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${btnStyle}`}
                                            >
                                                <span>{opt}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {hasAnswered && (
                                    <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-3 animate-fadeIn">
                                        <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                                            💡 <strong>Explicación:</strong> {currentRound.explanation}
                                        </div>
                                        <div className="text-right">
                                            <button
                                                type="button"
                                                onClick={handleNextRound}
                                                className="btn-arcade btn-arcade-purple px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5"
                                            >
                                                <span>{currentRoundIdx + 1 < rounds.length ? 'Siguiente Pregunta' : 'Completar Minijuego 1'}</span>
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
                                    ¡Nivel 1 Superado! ({score} de {rounds.length} aciertos)
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                                    Has afinado tu criterio para distinguir la simulación algorítmica de la creatividad biológica. ¡Avanza al Nivel 2!
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResetGame1}
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
                {/* NIVEL 2: ALGORITMOS Y DATOS VS REGLAS + MINIJUEGO 2 */}
                {/* ============================================================== */}
                <section className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-xl transition-colors">
                    {/* Level 2 Header */}
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-lg font-black font-display shadow-sm">
                                2
                            </span>
                            <div>
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                    Nivel 2: Algoritmos y Datos (Machine Learning)
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Comparativa Conceptual & Simulador de Certeza Probabilística
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
                            🥈 Desafío Intermedio
                        </span>
                    </div>

                    {/* 2.1 WebQuest Box */}
                    {level2Webquest && (
                        <div className="bg-gradient-to-br from-cyan-50 via-sky-50/40 to-slate-50 dark:from-cyan-950/30 dark:via-slate-800/80 dark:to-slate-900 rounded-2xl p-5 sm:p-6 border border-cyan-200 dark:border-cyan-800/50 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-700 dark:text-cyan-300 uppercase">
                                <Search size={15} />
                                <span>Misión de Búsqueda Web en Clase</span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                                    Investiga en la web cómo aprenden las computadoras:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {level2Webquest.search_queries.map((q, idx) => (
                                        <a
                                            key={idx}
                                            href={`https://www.google.com/search?q=${encodeURIComponent(q)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-700/60 text-xs font-mono text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 hover:border-cyan-400 transition-all shadow-sm"
                                        >
                                            <span>"{q}"</span>
                                            <ExternalLink size={11} />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Comparison Columns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                                    <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-bold text-xs">
                                        <Cpu size={14} />
                                        <span>Programación Clásica (Reglas Fijas)</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                        El programador escribe manualmente cada condición lógica:
                                    </p>
                                    <code className="text-[11px] text-cyan-800 dark:text-cyan-300 font-mono block bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                                        SI tiene ruedas Y motor == 'Auto'
                                    </code>
                                    <p className="text-[10px] text-amber-600 dark:text-amber-400">
                                        ⚠️ Frágil: ¡Si ve un triciclo o patineta eléctrica se confunde!
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 space-y-2 shadow-sm">
                                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-xs">
                                        <Sparkles size={14} />
                                        <span>Machine Learning (Patrones en Datos)</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Le mostramos 50.000 ejemplos con su etiqueta:
                                    </p>
                                    <code className="text-[11px] text-purple-800 dark:text-purple-300 font-mono block bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                                        Datos + Respuestas = Modelo de Aprendizaje
                                    </code>
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                        ✅ Robusto: Reconoce vehículos aunque estén modificados.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2.2 Minijuego 2: Laboratorio de Entrenamiento y Confianza */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FlaskConical size={18} className="text-cyan-500" />
                                <span>🎮 Minijuego 2: Laboratorio de Clasificación y Certeza</span>
                            </h3>
                            <span className="text-xs font-mono text-cyan-700 dark:text-cyan-300 font-bold">
                                Pruebas realizadas: {testedWordsCount}
                            </span>
                        </div>

                        <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
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
                                    placeholder="Prueba una palabra: piña, submarino, dron, sandía, cohete..."
                                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-sans shadow-sm"
                                />
                                <button
                                    type="submit"
                                    className="btn-arcade btn-arcade-cyan text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md"
                                >
                                    ⚡ ¡Clasificar en la Red!
                                </button>
                            </form>

                            {/* Quick Test Buttons */}
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                                <span className="text-slate-400 text-[11px]">Pruebas rápidas:</span>
                                {['🍓 Fresa', '🚀 Cohete', '🍕 Pizza', '⛵ Barco', '🛸 Ovni / Dron', '🥑 Aguacate'].map((pill, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            const clean = pill.split(' ')[1] || pill;
                                            setSimInput(clean);
                                            handleSimulate(clean);
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-cyan-100 text-slate-700 hover:text-cyan-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors border border-slate-200 dark:border-slate-700"
                                    >
                                        {pill}
                                    </button>
                                ))}
                            </div>

                            {/* Simulation Prediction Output */}
                            {simResult && (
                                <div className={`mt-3 p-4 rounded-xl border text-xs font-mono space-y-2 animate-fadeIn ${
                                    simResult.color === 'emerald'
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-600/40 text-emerald-800 dark:text-emerald-200'
                                        : simResult.color === 'cyan'
                                        ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-600/40 text-cyan-800 dark:text-cyan-200'
                                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-600/40 text-amber-800 dark:text-amber-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold">{simResult.category}</span>
                                        <span className="font-extrabold">{simResult.confidence}</span>
                                    </div>
                                    {/* Progress Bar of Confidence */}
                                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                simResult.color === 'emerald' ? 'bg-emerald-500' : simResult.color === 'cyan' ? 'bg-cyan-500' : 'bg-amber-500'
                                            }`}
                                            style={{ width: `${simResult.percentage}%` }}
                                        />
                                    </div>
                                    <p className="text-[11px] leading-relaxed pt-1">
                                        {simResult.details}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ============================================================== */}
                {/* NIVEL 3: ANATOMÍA DEL PROMPT & ALUCINACIONES + MINIJUEGO 3 */}
                {/* ============================================================== */}
                <section className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-xl transition-colors">
                    {/* Level 3 Header */}
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center text-lg font-black font-display shadow-sm">
                                3
                            </span>
                            <div>
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                    Nivel 3: El Arte del Prompt y el Control de Alucinaciones
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Ingeniería del Lenguaje & Minijuego: El Reparador de Prompts (Prompt Crafter)
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-bold">
                            🥇 Desafío Avanzado
                        </span>
                    </div>

                    {/* 3.1 WebQuest Box */}
                    {level3Webquest && (
                        <div className="bg-gradient-to-br from-amber-50 via-yellow-50/40 to-slate-50 dark:from-amber-950/30 dark:via-slate-800/80 dark:to-slate-900 rounded-2xl p-5 sm:p-6 border border-amber-200 dark:border-amber-800/50 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2 text-xs font-bold font-mono text-amber-800 dark:text-amber-300 uppercase">
                                <Search size={15} />
                                <span>Misión de Búsqueda Web en Clase</span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                                    Investiga cómo hablarle a la IA para evitar que invente información falsa:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {level3Webquest.search_queries.map((q, idx) => (
                                        <a
                                            key={idx}
                                            href={`https://www.google.com/search?q=${encodeURIComponent(q)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-700/60 text-xs font-mono text-amber-800 dark:text-amber-300 hover:bg-amber-100 hover:border-amber-400 transition-all shadow-sm"
                                        >
                                            <span>"{q}"</span>
                                            <ExternalLink size={11} />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* 4 Pillars of a Prompt */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-center">
                                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <span className="text-lg">🎭</span>
                                    <h4 className="font-bold text-xs text-purple-700 dark:text-purple-400">1. Rol</h4>
                                    <p className="text-[10px] text-slate-500">¿Quién es la IA?</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <span className="text-lg">🗺️</span>
                                    <h4 className="font-bold text-xs text-cyan-700 dark:text-cyan-400">2. Contexto</h4>
                                    <p className="text-[10px] text-slate-500">¿Para qué situación?</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <span className="text-lg">🎯</span>
                                    <h4 className="font-bold text-xs text-emerald-700 dark:text-emerald-400">3. Tarea</h4>
                                    <p className="text-[10px] text-slate-500">¿Qué debe hacer?</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <span className="text-lg">📄</span>
                                    <h4 className="font-bold text-xs text-amber-700 dark:text-amber-400">4. Formato</h4>
                                    <p className="text-[10px] text-slate-500">¿Cómo entregarlo?</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3.2 Minijuego 3: El Reparador de Prompts */}
                    {activeChallenge && (
                        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span>🎮 Minijuego 3: {activeChallenge.title}</span>
                                    {completedChallenges.includes(activeChallenge.id) && (
                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                                            ¡Reparado! ✔️
                                        </span>
                                    )}
                                </h3>
                                <span className="text-xs font-mono text-amber-800 dark:text-amber-300 font-bold">
                                    Desafío {challengeIdx + 1} de {promptChallenges.length}
                                </span>
                            </div>

                            {/* Broken Prompt Card */}
                            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800/50 space-y-1.5">
                                <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 font-bold">
                                    <span className="flex items-center gap-1.5">
                                        <ShieldAlert size={14} />
                                        <span>Prompt Deficiente Inicial:</span>
                                    </span>
                                    <span className="text-[10px] uppercase font-mono">Falla detectada</span>
                                </div>
                                <div className="font-mono text-xs sm:text-sm text-rose-950 dark:text-rose-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900">
                                    "{activeChallenge.broken_prompt}"
                                </div>
                                <p className="text-[11px] text-rose-700 dark:text-rose-400">
                                    ⚠️ {activeChallenge.flaw}
                                </p>
                            </div>

                            {/* Interactive Blocks Selector */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                                    Haz clic para activar los bloques esenciales de reparación:
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {activeChallenge.blocks.map((block) => {
                                        const isSelected = selectedBlocks.includes(block.id);
                                        return (
                                            <button
                                                key={block.id}
                                                type="button"
                                                onClick={() => toggleBlock(block.id)}
                                                className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                                                    isSelected
                                                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 shadow-sm'
                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 font-bold ${
                                                    isSelected ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                                }`}>
                                                    {isSelected ? '✓' : '+'}
                                                </div>
                                                <div>
                                                    <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                                        {block.label}
                                                    </span>
                                                    <span className="leading-snug">{block.text}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Test Button */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={handleTestPrompt}
                                    disabled={selectedBlocks.length === 0}
                                    className="flex-1 btn-arcade btn-arcade-amber py-3 px-4 rounded-xl text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                                >
                                    <Sparkles size={16} />
                                    <span>⚡ Simular Ejecución del Prompt en la IA</span>
                                </button>
                                {challengeIdx + 1 < promptChallenges.length && (
                                    <button
                                        type="button"
                                        onClick={handleNextChallenge}
                                        className="btn-arcade bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-4 py-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
                                    >
                                        Siguiente Caso →
                                    </button>
                                )}
                            </div>

                            {/* Side-by-side Result comparison */}
                            {testedPrompt && (
                                <div className="space-y-4 pt-2 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Output Bad */}
                                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 space-y-2">
                                            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase block">
                                                ❌ Respuesta con Prompt Roto:
                                            </span>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 italic whitespace-pre-line leading-relaxed">
                                                {activeChallenge.ai_output_bad}
                                            </p>
                                        </div>

                                        {/* Output Good */}
                                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-600 space-y-2 shadow-sm">
                                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">
                                                ✨ Respuesta con Prompt Reparado:
                                            </span>
                                            <p className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                                                {activeChallenge.ai_output_good}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-200 leading-relaxed">
                                        💡 <strong>Lección ConTech:</strong> {activeChallenge.explanation}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* ============================================================== */}
                {/* GLOSARIO DE REPASO ACTIVO & AUTOEVALUACIÓN */}
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
                                    Autoevaluación: Comprueba tu dominio de los 7 términos científicos de la clase.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
                            <span>Dominados: {masteredTerms.length} de {glossary.length}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {glossary.map((g, idx) => {
                            const isRevealed = revealedTerms.includes(idx);
                            const isMastered = masteredTerms.includes(idx);

                            return (
                                <div
                                    key={idx}
                                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                                        isMastered
                                            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-600/40'
                                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">
                                            {g.category || 'Concepto'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => toggleMasterTerm(idx)}
                                            className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-colors ${
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

                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {g.def}
                                    </p>

                                    {/* Real-world example & Self-Test toggle */}
                                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px] space-y-1.5">
                                        <button
                                            type="button"
                                            onClick={() => toggleRevealTerm(idx)}
                                            className="text-purple-600 dark:text-purple-400 hover:underline font-semibold flex items-center gap-1"
                                        >
                                            <Eye size={12} />
                                            <span>{isRevealed ? 'Ocultar ejemplo y autoevaluación' : 'Ver ejemplo real y pregunta clave'}</span>
                                        </button>

                                        {isRevealed && (
                                            <div className="mt-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/40 space-y-1 animate-fadeIn">
                                                {g.example && (
                                                    <p className="text-slate-600 dark:text-slate-400">
                                                        <strong>Ejemplo:</strong> {g.example}
                                                    </p>
                                                )}
                                                {g.self_test && (
                                                    <p className="text-purple-700 dark:text-purple-300 font-medium">
                                                        ❓ <strong>Reto mental:</strong> {g.self_test}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ============================================================== */}
                {/* CIERRE ÉPICO: CARNET, LOGROS & BOSS BATTLE (LIVE POLLING) */}
                {/* ============================================================== */}
                <div className="text-center p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-purple-100 via-indigo-50 to-white dark:from-purple-950/40 dark:to-slate-900 border-2 border-purple-500/40 space-y-6 shadow-2xl transition-colors">
                    <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-3xl shadow-xl shadow-amber-400/30 animate-bounce">
                        🏆
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            ¡Completaste los 3 Niveles de la Misión 01!
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                            Has construido bases científicas sólidas investigando en la web, desafiando a la máquina con datos y reparando prompts como un profesional de ConTech.
                        </p>
                    </div>

                    {/* Student Identity Card Preview */}
                    <div className="max-w-md mx-auto p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-700/60 shadow-md flex items-center justify-between gap-4 text-left">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{user ? user.avatar_emoji : '🧑‍🎓'}</span>
                            <div>
                                <span className="font-display font-bold text-sm text-slate-900 dark:text-white block">
                                    {user ? user.name : 'Explorador Invitado'}
                                </span>
                                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                                    {user ? `${user.grade} · Nivel ${user.level}` : 'Registra tu cuenta para guardar tu avance'}
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
                                ¡Insignia Pionero IA 🌟 Desbloqueada!
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
                                {saving ? '⏳ Guardando en tu carnet escolar...' : `🎉 Reclamar +${lesson.xp_reward} XP e Insignia`}
                            </button>
                        </div>
                    )}

                    {/* Classroom Boss Battle Live Polling Callout */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-base">
                                <Radio size={16} />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                    Dinámica de Cierre en Vivo
                                </span>
                                <span className="text-[11px] text-slate-500">
                                    Participa en la encuesta del aula en tiempo real
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
