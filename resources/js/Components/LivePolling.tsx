import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedProps, PollStats } from '../types';
import confetti from 'canvas-confetti';
import { BarChart3, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { appUrl } from '../lib/route';

interface LivePollingProps {
    poll: {
        id: number;
        question: string;
        category?: string;
        options: Array<{
            id: string;
            text: string;
            emoji: string;
            color: string;
            votes?: number;
            percentage?: number;
        }>;
        stats?: PollStats | null;
    } | null;
    onOpenRegister: (option: { id: string; text: string; emoji: string }) => void;
}

export default function LivePolling({ poll: initialPoll, onOpenRegister }: LivePollingProps) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    const [stats, setStats] = useState<PollStats | null>(
        initialPoll?.stats || (initialPoll ? {
            id: initialPoll.id,
            question: initialPoll.question,
            category: initialPoll.category,
            total_votes: initialPoll.options.reduce((sum, o) => sum + (o.votes || 0), 0),
            options: initialPoll.options.map(o => ({
                id: o.id,
                text: o.text,
                emoji: o.emoji,
                color: o.color,
                votes: o.votes || 0,
                percentage: o.percentage || 0,
            })),
        } : null)
    );

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    // Silent background polling to refresh live results
    useEffect(() => {
        if (!initialPoll) return;
        const interval = setInterval(async () => {
            try {
                const res = await fetch(appUrl('/api/polls/active'));
                if (res.ok) {
                    const data: PollStats = await res.json();
                    setStats(data);
                }
            } catch (e) {}
        }, 8000);

        return () => clearInterval(interval);
    }, [initialPoll?.id]);

    if (!initialPoll || !stats) {
        return (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 font-medium">No hay encuestas activas en este momento.</p>
            </div>
        );
    }

    const handleVote = async (option: { id: string; text: string; emoji: string }) => {
        // If user is guest, trigger 1-step registration modal with preselected option
        if (!user) {
            onOpenRegister(option);
            return;
        }

        setSubmitting(true);
        setSelectedOption(option.id);
        setFeedback(null);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch(appUrl(`/api/polls/${stats.id}/vote`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ option_id: option.id }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStats(data.stats);
                setFeedback(data.message);

                try {
                    confetti({
                        particleCount: 60,
                        spread: 60,
                        origin: { y: 0.7 },
                        colors: ['#8b5cf6', '#06b6d4', '#fbbf24'],
                    });
                } catch (e) {}
            } else {
                setFeedback(data.message || 'Error al emitir el voto.');
            }
        } catch (e) {
            setFeedback('No se pudo conectar con el servidor.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-purple-500/20 shadow-xl p-6 sm:p-8 transition-colors duration-200">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <BarChart3 size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                {stats.category || 'Clase Demostrativa'}
                            </span>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                En Vivo
                            </span>
                        </div>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white mt-1">
                            {stats.question}
                        </h3>
                    </div>
                </div>

                {/* Total Votes Counter */}
                <div className="text-right bg-slate-50 dark:bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="text-xl font-black text-purple-600 dark:text-purple-400">
                        {stats.total_votes}
                    </span>
                    <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                        Votos Escolares
                    </span>
                </div>
            </div>

            {/* Voting Feedback Notice */}
            {feedback && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 size={16} />
                    <span>{feedback}</span>
                </div>
            )}

            {/* Options List */}
            <div className="space-y-3.5">
                {stats.options.map((option) => {
                    const isSelected = selectedOption === option.id;
                    const pct = Math.round(option.percentage || 0);

                    return (
                        <div
                            key={option.id}
                            className={`group relative overflow-hidden rounded-2xl border transition-all ${
                                isSelected
                                    ? 'border-purple-500 ring-2 ring-purple-400/40'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-800'
                            } bg-slate-50/50 dark:bg-slate-800/40 p-4`}
                        >
                            {/* Animated Background Progress Bar */}
                            <div
                                className="absolute inset-y-0 left-0 opacity-15 dark:opacity-20 transition-all duration-700 ease-out"
                                style={{
                                    width: `${pct}%`,
                                    backgroundColor: option.color || '#8b5cf6',
                                }}
                            />

                            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                {/* Option Info */}
                                <div className="flex items-center gap-3.5 flex-1">
                                    <span className="text-2xl sm:text-3xl flex-shrink-0">
                                        {option.emoji}
                                    </span>
                                    <div>
                                        <h4 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                            {option.text}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                {option.votes} {option.votes === 1 ? 'voto' : 'votos'}
                                            </span>
                                            <span>•</span>
                                            <span className="font-black text-purple-600 dark:text-purple-400">
                                                {pct}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Vote Action Button */}
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => handleVote(option)}
                                    className={`btn-arcade px-4 py-2 rounded-xl text-xs font-bold font-display text-white shadow-sm flex items-center justify-center gap-1.5 transition-transform ${
                                        isSelected
                                            ? 'btn-arcade-emerald'
                                            : 'btn-arcade-purple hover:scale-105'
                                    } disabled:opacity-50`}
                                >
                                    <Sparkles size={14} />
                                    <span>{isSelected ? '¡Votado!' : '¡Votar!'}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Notice */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span>
                    💡 <strong className="text-slate-700 dark:text-slate-300">Cada voto suma +15 XP</strong> a tu carnet de explorador del Club T.I.A.
                </span>
                {!user && (
                    <button
                        type="button"
                        onClick={() => onOpenRegister(stats.options[0])}
                        className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                    >
                        ¿No tienes cuenta? Regístrate en 3 segundos
                    </button>
                )}
            </div>
        </div>
    );
}
