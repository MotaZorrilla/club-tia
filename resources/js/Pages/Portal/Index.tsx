import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import LivePolling from '../../Components/LivePolling';
import { Lesson, Poll, SharedProps } from '../../types';
import { Sparkles, Trophy, BookOpen, Calculator, Library, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface IndexProps {
    lessons: Lesson[];
    activePoll: Poll | null;
    communityStats: {
        total_explorers: number;
        completed_missions: number;
        badges_awarded: number;
        active_islands: number;
    };
    leaderboard: Array<{
        id: number;
        name: string;
        avatar_emoji: string;
        grade: string;
        xp_points: number;
        level: number;
        rank: string;
    }>;
    onOpenRegister?: (option?: { id: string; text: string; emoji: string }) => void;
}

export default function Index({ lessons, activePoll, communityStats, leaderboard, onOpenRegister }: IndexProps) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    return (
        <AppLayout>
            <Head title="Portal Oficial · Club T.I.A." />

            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left Column: Heading & CTA */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        {/* School Badge Pill */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-black uppercase tracking-wider">
                            <Sparkles size={14} className="text-amber-500" />
                            <span>U.E. Colegio Monte Carmelo · Living Lab Escolar</span>
                        </div>

                        {/* Title */}
                        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-tight">
                            Dejamos de ver pantallas.{' '}
                            <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                                ¡Creamos el futuro con IA!
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
                            Bienvenido al <strong className="text-purple-600 dark:text-purple-400">Club T.I.A.</strong> (Tecnologías de la Información & Inteligencia Artificial). Desarrolla videojuegos, entrena modelos de visión computacional y potencia tu pensamiento crítico con costo US$ 0 en equipamiento.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                            <a
                                href="#islas"
                                className="btn-arcade btn-arcade-purple px-6 py-3.5 rounded-2xl text-white font-bold font-display text-base flex items-center gap-2 shadow-lg hover:shadow-purple-500/30"
                            >
                                <span>Explorar las 5 Islas</span>
                                <ArrowRight size={18} />
                            </a>

                            <Link
                                href="/nosotros"
                                className="btn-arcade btn-arcade-cyan px-6 py-3.5 rounded-2xl text-white font-bold font-display text-base flex items-center gap-2 shadow-lg"
                            >
                                <BookOpen size={18} />
                                <span>Misión & Visión</span>
                            </Link>

                            {!user && (
                                <button
                                    type="button"
                                    onClick={() => onOpenRegister && onOpenRegister()}
                                    className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-dashed border-purple-400/50 hover:border-purple-500 text-purple-600 dark:text-purple-300 font-bold text-sm transition-all"
                                >
                                    ✨ Registro (+100 XP Gratis)
                                </button>
                            )}
                        </div>

                        {/* Telemetry Stats Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                                <span className="block text-2xl font-black text-purple-600 dark:text-purple-400 font-display">
                                    {communityStats.total_explorers}
                                </span>
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                                    Exploradores
                                </span>
                            </div>
                            <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                                <span className="block text-2xl font-black text-cyan-600 dark:text-cyan-400 font-display">
                                    {communityStats.active_islands}
                                </span>
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                                    Islas ERCA
                                </span>
                            </div>
                            <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                                <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400 font-display">
                                    {communityStats.completed_missions}
                                </span>
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                                    Misiones Hechas
                                </span>
                            </div>
                            <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                                <span className="block text-2xl font-black text-amber-500 font-display">
                                    {communityStats.badges_awarded}
                                </span>
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                                    Medallas T.I.A.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: LIVE POLLING COMPONENT */}
                    <div className="lg:col-span-5">
                        <div className="transform hover:-translate-y-1 transition-transform duration-300">
                            <LivePolling
                                poll={activePoll}
                                onOpenRegister={(opt) => onOpenRegister && onOpenRegister(opt)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* LAS 5 ISLAS DE FORMACIÓN ERCA */}
            <section id="islas" className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-50/80 dark:bg-slate-950/50 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-black uppercase mb-3">
                            <Cpu size={14} />
                            <span>Metodología ERCA: Experiencia, Reflexión, Conceptualización y Aplicación</span>
                        </div>
                        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
                            Las 5 Islas de Misión del Club T.I.A.
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
                            Cada isla desbloquea un superpoder digital práctico con retos interactivos y recompensas de puntos XP.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                                    lesson.is_unlocked
                                        ? 'bg-white dark:bg-slate-800/90 border-purple-500/30 shadow-lg hover:shadow-purple-500/10 hover:border-purple-500'
                                        : 'bg-slate-100/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-70'
                                }`}
                            >
                                <div>
                                    {/* Island Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center text-3xl shadow-inner">
                                            {lesson.icon}
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                                                +{lesson.xp_reward} XP
                                            </span>
                                            <span className="block text-[10px] text-slate-400 mt-1 font-semibold">
                                                ⏱️ {lesson.duration_minutes} min
                                            </span>
                                        </div>
                                    </div>

                                    {/* Island Title */}
                                    <span className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                                        Isla {lesson.island_number}
                                    </span>
                                    <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">
                                        {lesson.title}
                                    </h3>
                                    <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">
                                        {lesson.subtitle}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                                        {lesson.description}
                                    </p>
                                </div>

                                {/* Island Footer Action */}
                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-amber-500">
                                        🎖️ {lesson.badge_name}
                                    </span>

                                    {lesson.is_unlocked ? (
                                        <Link
                                            href={`/mision/${lesson.slug}`}
                                            className="btn-arcade btn-arcade-purple px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
                                        >
                                            <span>Jugar Misión</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                    ) : (
                                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-xl">
                                            🔒 Próximamente
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RADAR DE SINERGIAS PEDAGÓGICAS */}
            <section className="py-14 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
                            Articulación Transversal
                        </span>
                        <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white mt-2">
                            Sinergias con el Colegio Monte Carmelo
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                                <Calculator size={24} />
                            </div>
                            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                                Olimpiada Canguro Matemático
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                                Entrenamos la resolución de problemas lógicos y combinatoria mediante algoritmos en Python y descomposición estructurada.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                                Plan Lector y Humanidades
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                                Utilizamos Google NotebookLM con fuentes verificadas de libros para análisis semántico, mapas conceptuales y síntesis crítica.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
                                <Library size={24} />
                            </div>
                            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                                Biblioteca Digital & Ciencias
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                                Clasificación visual de muestras botánicas y reciclaje escolar mediante visión computacional en Google Teachable Machine.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TABLA DE POSICIONES (LEADERBOARD) */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Trophy size={22} className="text-amber-500" />
                            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                                Cuadro de Honor · Top Exploradores
                            </h2>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Puntos XP en Tiempo Real
                        </span>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                            {leaderboard.map((student, idx) => (
                                <div key={student.id} className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                                    <div className="flex items-center gap-3.5">
                                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                                            idx === 0
                                                ? 'bg-amber-400 text-slate-900 shadow-md shadow-amber-400/30'
                                                : idx === 1
                                                ? 'bg-slate-300 text-slate-800'
                                                : idx === 2
                                                ? 'bg-amber-700/30 text-amber-600 dark:text-amber-400'
                                                : 'text-slate-400'
                                        }`}>
                                            #{idx + 1}
                                        </span>
                                        <span className="text-2xl">{student.avatar_emoji}</span>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                                {student.name}
                                            </h4>
                                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                                {student.grade} · {student.rank}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-black text-purple-600 dark:text-purple-400 font-display text-base">
                                            {student.xp_points} XP
                                        </span>
                                        <span className="block text-[10px] text-slate-400 font-bold uppercase">
                                            Nivel {student.level}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
