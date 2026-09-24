import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { ShieldCheck, UserCheck, Sparkles, ArrowRight, UserPlus, GraduationCap, ChevronRight } from 'lucide-react';

interface UserItem {
    id: number;
    name: string;
    role: string;
    grade?: string;
    avatar_emoji: string;
    xp_points: number;
    level: number;
    rank: string;
}

interface LoginProps {
    users: UserItem[];
    onOpenRegister?: () => void;
}

export default function DashboardLogin({ users, onOpenRegister }: LoginProps) {
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');

    const facilitador = users.find(u => u.role === 'facilitador');
    const colaborador = users.find(u => u.role === 'colaborador');
    const students = users.filter(u => u.role === 'alumno');

    const handleLoginAs = (userId: number) => {
        router.post(`/usuarios/cambiar/${userId}`);
    };

    const handleStudentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedStudentId) {
            handleLoginAs(Number(selectedStudentId));
        }
    };

    return (
        <AppLayout>
            <Head title="Acceso al Dashboard · Club T.I.A." />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fadeIn">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-black uppercase tracking-wider">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>Colegio Monte Carmelo · Acceso a Dashboards</span>
                    </div>

                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
                        ¿Cómo deseas ingresar al Club T.I.A.?
                    </h1>

                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                        Selecciona tu perfil para ingresar a tu panel de control correspondiente.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1. ACCESO ADMINISTRADOR / FACILITADOR */}
                    {facilitador && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border-2 border-purple-500/30 shadow-xl flex flex-col justify-between group hover:border-purple-500 transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-3xl shadow-inner">
                                        {facilitador.avatar_emoji}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                                        Administrador
                                    </span>
                                </div>

                                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                                    {facilitador.name}
                                </h2>
                                <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 block mt-0.5">
                                    Facilitador · Mentor Técnico
                                </span>

                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                                    Acceso a la <strong>telemetría escolar</strong>, <strong>directorio de inscritos</strong>, gestor de la encuesta en vivo, asignación de méritos (+XP) y editor de Misión/Visión.
                                </p>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="button"
                                    onClick={() => handleLoginAs(facilitador.id)}
                                    className="w-full btn-arcade btn-arcade-purple py-3 px-4 rounded-2xl text-white font-bold font-display text-sm flex items-center justify-center gap-2 shadow-md"
                                >
                                    <ShieldCheck size={18} />
                                    <span>Ingresar a mi Dashboard de Administrador</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 2. ACCESO ESTUDIANTE / EXPLORADOR */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-3xl shadow-inner">
                                    🧑‍🎓
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                                    Estudiantes ({students.length})
                                </span>
                            </div>

                            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                                Acceso Alumno / Explorador
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Consulta tu puntuación de XP, vitrina de medallas e insignias, y cambia tu avatar emoji.
                            </p>

                            <form onSubmit={handleStudentSubmit} className="mt-4 space-y-3">
                                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                                    Selecciona tu Nombre:
                                </label>
                                <select
                                    value={selectedStudentId}
                                    onChange={(e) => setSelectedStudentId(e.target.value)}
                                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                >
                                    <option value="">-- Elige tu usuario de explorador --</option>
                                    {students.map((st) => (
                                        <option key={st.id} value={st.id}>
                                            {st.avatar_emoji} {st.name} ({st.grade} · {st.xp_points} XP)
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="submit"
                                    disabled={!selectedStudentId}
                                    className="w-full btn-arcade btn-arcade-cyan py-3 px-4 rounded-2xl text-white font-bold font-display text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                                >
                                    <UserCheck size={18} />
                                    <span>Ingresar a mi Dashboard de Estudiante</span>
                                </button>
                            </form>
                        </div>

                        {/* Register link */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-4 text-center">
                            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2">
                                ¿No estás en la lista?
                            </span>
                            <button
                                type="button"
                                onClick={() => onOpenRegister && onOpenRegister()}
                                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-purple-400 hover:border-purple-600 text-purple-600 dark:text-purple-400 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                            >
                                <UserPlus size={16} />
                                <span>Registrarme como Nuevo Alumno (+100 XP)</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. COORDINACIÓN / COLABORADOR */}
                {colaborador && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{colaborador.avatar_emoji}</span>
                            <div>
                                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                                    {colaborador.name} (Coordinación Académica)
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Acompañamiento docente y sinergias curriculares
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleLoginAs(colaborador.id)}
                            className="btn-arcade btn-arcade-amber px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1"
                        >
                            <span>Ingresar como Docente</span>
                            <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
