import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { Lesson } from '../../types';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, Sparkles, HelpCircle, Trophy, Play } from 'lucide-react';

interface LessonProps {
    lesson: Lesson;
    allLessons: Lesson[];
    onOpenRegister?: () => void;
}

export default function LessonPage({ lesson, allLessons, onOpenRegister }: LessonProps) {
    const rounds = lesson.content?.game_rounds || [];
    const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [earnedReward, setEarnedReward] = useState<{ xp: number; badge: string } | null>(null);

    const currentRound = rounds[currentRoundIdx];

    const handleSelectOption = (idx: number) => {
        if (hasAnswered) return;
        setSelectedOption(idx);
        setHasAnswered(true);

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
            finishLesson();
        }
    };

    const finishLesson = async () => {
        setCompleted(true);
        setSaving(true);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch(`/mision/${lesson.slug}/completar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setEarnedReward({ xp: data.new_xp, badge: data.badge });
                try {
                    confetti({
                        particleCount: 100,
                        spread: 80,
                        origin: { y: 0.6 },
                        colors: ['#8b5cf6', '#06b6d4', '#fbbf24', '#10b981'],
                    });
                } catch (e) {}
            } else if (res.status === 401) {
                // User is not logged in, ask to register to save progress
                if (onOpenRegister) onOpenRegister();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AppLayout>
            <Head title={`${lesson.title} · Club T.I.A.`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Back Nav */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Regresar al Mapa de Islas</span>
                    </Link>

                    <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        Isla {lesson.island_number} de 5
                    </span>
                </div>

                {/* Lesson Header Card */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-purple-500/20 shadow-lg flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
                        {lesson.icon}
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                            {lesson.title}
                        </h1>
                        <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mt-1">
                            {lesson.subtitle}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                            {lesson.description}
                        </p>
                    </div>
                    <div className="text-center bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-[120px]">
                        <span className="block text-2xl font-black text-amber-500 font-display">
                            +{lesson.xp_reward} XP
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                            Recompensa
                        </span>
                    </div>
                </div>

                {/* Interactive Game / Challenge Area */}
                {rounds.length > 0 && !completed ? (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
                        {/* Progress */}
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                            <span>Pregunta {currentRoundIdx + 1} de {rounds.length}</span>
                            <span>Aciertos: {score}</span>
                        </div>

                        {/* Question Prompt */}
                        <div className="bg-purple-50 dark:bg-purple-950/20 p-5 rounded-2xl border border-purple-200 dark:border-purple-800/40">
                            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                                Caso de Estudio
                            </p>
                            <p className="text-base text-slate-800 dark:text-slate-200 font-medium italic">
                                "{currentRound.prompt}"
                            </p>
                            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-3">
                                {currentRound.question}
                            </h3>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentRound.options.map((opt, idx) => {
                                const isCorrect = idx === currentRound.correct;
                                const isSelected = selectedOption === idx;

                                let btnStyle = 'bg-slate-50 dark:bg-slate-900 hover:border-purple-500 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';

                                if (hasAnswered) {
                                    if (isCorrect) {
                                        btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                                    } else if (isSelected) {
                                        btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={hasAnswered}
                                        onClick={() => handleSelectOption(idx)}
                                        className={`p-4 rounded-2xl border-2 text-sm font-semibold text-left transition-all ${btnStyle}`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation & Next */}
                        {hasAnswered && (
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-fadeIn">
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    💡 <strong>Explicación:</strong> {currentRound.explanation}
                                </p>
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={handleNextRound}
                                        className="btn-arcade btn-arcade-purple px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5"
                                    >
                                        <span>{currentRoundIdx + 1 < rounds.length ? 'Siguiente Pregunta' : 'Completar Misión'}</span>
                                        <Play size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Completion Banner */
                    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 rounded-3xl p-8 text-white text-center shadow-xl space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur mx-auto flex items-center justify-center text-3xl">
                            🏆
                        </div>
                        <h2 className="font-display font-extrabold text-3xl">
                            ¡Misión Completada con Éxito!
                        </h2>
                        <p className="text-sm text-purple-100 max-w-md mx-auto">
                            Has ganado tus puntos de experiencia y la medalla: <strong>{lesson.badge_name}</strong>.
                        </p>
                        <div className="pt-4 flex justify-center gap-4">
                            <Link
                                href="/"
                                className="px-6 py-3 rounded-2xl bg-white text-purple-700 font-bold font-display text-sm shadow-md hover:bg-purple-50 transition-all"
                            >
                                Regresar al Inicio
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 rounded-2xl bg-purple-900/60 hover:bg-purple-900 text-white font-bold font-display text-sm border border-white/20 transition-all"
                            >
                                Ver mi Dashboard
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
