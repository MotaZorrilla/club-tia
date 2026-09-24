import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import AvatarPicker from '../../Components/AvatarPicker';
import { User, Poll, ClubSettings, Lesson } from '../../types';
import confetti from 'canvas-confetti';
import {
    LayoutDashboard,
    Award,
    Users,
    BarChart3,
    Edit3,
    Save,
    RotateCcw,
    PlusCircle,
    CheckCircle2,
    Shield,
    BookOpen,
    Sparkles,
    Check,
} from 'lucide-react';

interface DashboardProps {
    user: User;
    kpis: {
        total_students: number;
        total_votes: number;
        total_xp_awarded: number;
        total_lessons: number;
    };
    students: User[];
    activePoll: (Poll & { stats: any }) | null;
    settings: ClubSettings;
    lessons: Lesson[];
}

export default function DashboardIndex({ user: initialUser, kpis, students: initialStudents, activePoll: initialPoll, settings: initialSettings, lessons }: DashboardProps) {
    const [user, setUser] = useState(initialUser);
    const [students, setStudents] = useState(initialStudents);
    const [activePoll, setActivePoll] = useState(initialPoll);
    const [settings, setSettings] = useState(initialSettings);

    // Active tab for facilitator
    const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'poll' | 'students'>('overview');

    // Facilitator settings edit
    const [mision, setMision] = useState(settings.mision);
    const [vision, setVision] = useState(settings.vision);
    const [savingSettings, setSavingSettings] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);

    // Award XP Modal
    const [awardModalStudent, setAwardModalStudent] = useState<User | null>(null);
    const [awardAmount, setAwardAmount] = useState(25);
    const [awardReason, setAwardReason] = useState('Participación destacada en clase');
    const [awarding, setAwarding] = useState(false);

    // Poll Question Editor
    const [pollQuestion, setPollQuestion] = useState(activePoll?.question || '');
    const [updatingPoll, setUpdatingPoll] = useState(false);

    // Avatar Update
    const [updatingAvatar, setUpdatingAvatar] = useState(false);

    const showNotice = (msg: string) => {
        setNotice(msg);
        setTimeout(() => setNotice(null), 4000);
    };

    const handleUpdateAvatar = async (newEmoji: string) => {
        setUpdatingAvatar(true);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch('/usuarios/avatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ avatar: newEmoji }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setUser({ ...user, avatar: data.avatar, avatar_emoji: data.avatar_emoji });
                showNotice('¡Avatar emoji actualizado!');
                try {
                    confetti({ particleCount: 30, spread: 40 });
                } catch (e) {}
            }
        } catch (e) {
            alert('Error al actualizar avatar');
        } finally {
            setUpdatingAvatar(false);
        }
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingSettings(true);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch('/dashboard/mision-vision', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ mision, vision }),
            });

            if (res.ok) {
                setSettings({ ...settings, mision, vision });
                showNotice('¡Misión y Visión actualizadas!');
            }
        } catch (e) {
            alert('Error al guardar');
        } finally {
            setSavingSettings(false);
        }
    };

    const handleResetPoll = async () => {
        if (!activePoll || !confirm('¿Estás seguro de reiniciar los votos de la encuesta?')) return;
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch(`/api/polls/${activePoll.id}/reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setActivePoll({ ...activePoll, stats: data.stats });
                showNotice('Encuesta reiniciada con éxito');
            }
        } catch (e) {
            alert('Error al reiniciar');
        }
    };

    const handleUpdatePollQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activePoll) return;
        setUpdatingPoll(true);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch(`/api/polls/${activePoll.id}/question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ question: pollQuestion }),
            });
            const data = await res.json();
            if (res.ok) {
                setActivePoll({ ...activePoll, question: pollQuestion, stats: data.stats });
                showNotice('Pregunta de la encuesta actualizada');
            }
        } catch (e) {
            alert('Error al actualizar pregunta');
        } finally {
            setUpdatingPoll(false);
        }
    };

    const handleAwardXp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!awardModalStudent) return;
        setAwarding(true);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch('/dashboard/award-xp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    student_id: awardModalStudent.id,
                    xp_amount: awardAmount,
                    reason: awardReason,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStudents(students.map(s => s.id === data.student_id ? { ...s, xp_points: data.new_xp, level: data.new_level } : s));
                showNotice(data.message);
                setAwardModalStudent(null);
                try {
                    confetti({ particleCount: 50, spread: 60 });
                } catch (e) {}
            }
        } catch (e) {
            alert('Error al otorgar XP');
        } finally {
            setAwarding(false);
        }
    };

    return (
        <AppLayout>
            <Head title={`Dashboard de ${user.role} · Club T.I.A.`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Header Welcome Card */}
                <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
                            {user.avatar_emoji}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white">
                                    Rol: {user.role}
                                </span>
                                <span className="text-xs font-bold text-cyan-200">
                                    {user.grade}
                                </span>
                            </div>
                            <h1 className="font-display font-extrabold text-2xl sm:text-3xl mt-1">
                                {user.name}
                            </h1>
                            <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
                                {user.role === 'facilitador'
                                    ? 'Panel de Control Maestro · Gestión Escolar y Telemetría'
                                    : user.role === 'colaborador'
                                    ? 'Supervisión Pedagógica y Sinergias de Aula'
                                    : 'Carnet Digital de Explorador T.I.A. · Colegio Monte Carmelo'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/20 min-w-[100px]">
                            <span className="block text-2xl font-black font-display text-amber-300">
                                {user.xp_points}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-white/80">
                                Puntos XP
                            </span>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/20 min-w-[100px]">
                            <span className="block text-2xl font-black font-display text-cyan-300">
                                Nv. {user.level}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-white/80">
                                {user.rank}
                            </span>
                        </div>
                    </div>
                </div>

                {notice && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 size={18} />
                        <span>{notice}</span>
                    </div>
                )}

                {/* 1. DASHBOARD DE ALUMNO (EXPLORADOR) */}
                {user.role === 'alumno' && (
                    <div className="space-y-8">
                        {/* Avatar Picker Section */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                                🎨 Cambia tu Avatar Emoji en 1 Clic
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                Haz clic en cualquiera de los 15 personajes para lucirlo de inmediato en tus votos y carnet.
                            </p>
                            <AvatarPicker
                                selected={user.avatar_emoji}
                                onSelect={handleUpdateAvatar}
                                size="md"
                            />
                        </div>

                        {/* Badges Showcase */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Award size={20} className="text-amber-500" />
                                <span>Vitrina de Insignias Escolares</span>
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 text-center">
                                    <span className="text-3xl">🌟</span>
                                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-2">
                                        Bienvenida T.I.A.
                                    </h4>
                                    <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                                        Desbloqueada (+100 XP)
                                    </span>
                                </div>

                                <div className={`p-4 rounded-2xl text-center border ${
                                    user.badges.includes('votante_activo')
                                        ? 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-800/40'
                                        : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                                }`}>
                                    <span className="text-3xl">🗳️</span>
                                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-2">
                                        Voz Democrática
                                    </h4>
                                    <span className="text-[10px] text-purple-600 font-semibold block mt-1">
                                        {user.badges.includes('votante_activo') ? 'Desbloqueada (+15 XP)' : 'Vota en la encuesta'}
                                    </span>
                                </div>

                                <div className={`p-4 rounded-2xl text-center border ${
                                    user.badges.some(b => b.startsWith('badge_mision_'))
                                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                                        : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                                }`}>
                                    <span className="text-3xl">🚀</span>
                                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-2">
                                        Pionero ERCA
                                    </h4>
                                    <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                                        {user.badges.some(b => b.startsWith('badge_mision_')) ? 'Misión 1 Superada' : 'Completa Isla 1'}
                                    </span>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 opacity-60 text-center">
                                    <span className="text-3xl">🦘</span>
                                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-2">
                                        Canguro de Oro
                                    </h4>
                                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                                        Olimpiada Matemática
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Missions Progress */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
                                🗺️ Progreso en las 5 Islas de Formación
                            </h3>
                            <div className="space-y-3">
                                {lessons.map((l) => (
                                    <div key={l.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{l.icon}</span>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                                    Isla {l.island_number}: {l.title}
                                                </h4>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    +{l.xp_reward} XP · {l.badge_name}
                                                </span>
                                            </div>
                                        </div>
                                        {l.is_unlocked ? (
                                            <Link
                                                href={`/mision/${l.slug}`}
                                                className="btn-arcade btn-arcade-purple px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm"
                                            >
                                                Jugar
                                            </Link>
                                        ) : (
                                            <span className="text-xs text-slate-400 font-bold">Bloqueada</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. DASHBOARD DE FACILITADOR (ING. HÉCTOR MOTA) */}
                {user.role === 'facilitador' && (
                    <div className="space-y-8">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <span className="text-xs font-bold uppercase text-slate-400">Alumnos Inscritos</span>
                                <span className="block text-3xl font-black font-display text-purple-600 dark:text-purple-400 mt-1">
                                    {kpis.total_students}
                                </span>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <span className="text-xs font-bold uppercase text-slate-400">Votos en Vivo</span>
                                <span className="block text-3xl font-black font-display text-cyan-600 dark:text-cyan-400 mt-1">
                                    {kpis.total_votes}
                                </span>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <span className="text-xs font-bold uppercase text-slate-400">Puntos XP Emitidos</span>
                                <span className="block text-3xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1">
                                    {kpis.total_xp_awarded}
                                </span>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <span className="text-xs font-bold uppercase text-slate-400">Islas ERCA</span>
                                <span className="block text-3xl font-black font-display text-amber-500 mt-1">
                                    {kpis.total_lessons}
                                </span>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                            <button
                                type="button"
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    activeTab === 'overview'
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                            >
                                👥 Exploradores & Puntos XP
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('poll')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    activeTab === 'poll'
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                            >
                                📊 Gestor de Encuestas en Vivo
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('settings')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    activeTab === 'settings'
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                            >
                                🎯 Misión & Visión Institucional
                            </button>
                        </div>

                        {/* Tab Content: Exploradores */}
                        {activeTab === 'overview' && (
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                                        Directorio de Estudiantes & Otorgamiento de Méritos
                                    </h3>
                                    <span className="text-xs text-slate-400 font-semibold">
                                        Total: {students.length} miembros
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-bold">
                                                <th className="pb-3">Explorador</th>
                                                <th className="pb-3">Grado</th>
                                                <th className="pb-3">Nivel / Rango</th>
                                                <th className="pb-3">XP Total</th>
                                                <th className="pb-3 text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                                            {students.map((st) => (
                                                <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                                    <td className="py-3 flex items-center gap-2">
                                                        <span className="text-2xl">{st.avatar_emoji}</span>
                                                        <div>
                                                            <span className="font-bold text-slate-900 dark:text-white block">
                                                                {st.name}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">
                                                                {st.email}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-slate-600 dark:text-slate-300">
                                                        {st.grade || '—'}
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="font-bold text-amber-500">Nv.{st.level}</span> · {st.rank}
                                                    </td>
                                                    <td className="py-3 font-bold font-display text-purple-600 dark:text-purple-400">
                                                        {st.xp_points} XP
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => setAwardModalStudent(st)}
                                                            className="btn-arcade btn-arcade-emerald px-3 py-1 rounded-xl text-[11px] font-bold text-white shadow-sm inline-flex items-center gap-1"
                                                        >
                                                            <PlusCircle size={12} />
                                                            <span>+XP Mérito</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Poll Manager */}
                        {activeTab === 'poll' && activePoll && (
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                                        Control de la Encuesta en Vivo (Live Polling)
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={handleResetPoll}
                                        className="btn-arcade btn-arcade-rose px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm inline-flex items-center gap-1.5"
                                    >
                                        <RotateCcw size={14} />
                                        <span>Reiniciar Votos</span>
                                    </button>
                                </div>

                                <form onSubmit={handleUpdatePollQuestion} className="space-y-3">
                                    <label className="block text-xs font-bold uppercase text-slate-500">
                                        Pregunta Activa en el Portal
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={pollQuestion}
                                            onChange={(e) => setPollQuestion(e.target.value)}
                                            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-semibold"
                                        />
                                        <button
                                            type="submit"
                                            disabled={updatingPoll}
                                            className="btn-arcade btn-arcade-purple px-4 py-2 rounded-xl text-xs font-bold text-white"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </form>

                                <div className="space-y-2">
                                    <span className="text-xs font-bold uppercase text-slate-500">
                                        Opciones Activas ({activePoll.options.length})
                                    </span>
                                    {activePoll.options.map((opt) => (
                                        <div key={opt.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{opt.emoji}</span>
                                                <span className="text-xs font-bold">{opt.text}</span>
                                            </div>
                                            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                                                {opt.votes || 0} votos
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Institutional Settings */}
                        {activeTab === 'settings' && (
                            <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                                    Editor de Identidad del Club T.I.A. (Misión y Visión)
                                </h3>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                                        Misión Institucional
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={mision}
                                        onChange={(e) => setMision(e.target.value)}
                                        className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                                        Visión Institucional
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={vision}
                                        onChange={(e) => setVision(e.target.value)}
                                        className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                                    />
                                </div>
                                <div className="text-right">
                                    <button
                                        type="submit"
                                        disabled={savingSettings}
                                        className="btn-arcade btn-arcade-purple px-6 py-2.5 rounded-xl text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
                                    >
                                        <Save size={14} />
                                        <span>{savingSettings ? 'Guardando...' : 'Guardar Textos Oficiales'}</span>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {/* 3. DASHBOARD DE COLABORADOR (DOCENTE) */}
                {user.role === 'colaborador' && (
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                                👩‍🏫 Acompañamiento Pedagógico de Grados
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                Reconoce la participación activa y otorga puntos de mérito para la Olimpiada Canguro y Plan Lector.
                            </p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-bold">
                                            <th className="pb-3">Estudiante</th>
                                            <th className="pb-3">Grado</th>
                                            <th className="pb-3">XP</th>
                                            <th className="pb-3 text-right">Mérito</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                                        {students.filter(s => s.role === 'alumno').map((st) => (
                                            <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                                <td className="py-3 flex items-center gap-2">
                                                    <span className="text-2xl">{st.avatar_emoji}</span>
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        {st.name}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-slate-600 dark:text-slate-300">
                                                    {st.grade}
                                                </td>
                                                <td className="py-3 font-bold text-purple-600 dark:text-purple-400">
                                                    {st.xp_points} XP
                                                </td>
                                                <td className="py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => setAwardModalStudent(st)}
                                                        className="btn-arcade btn-arcade-amber px-3 py-1 rounded-xl text-[11px] font-bold text-white shadow-sm inline-flex items-center gap-1"
                                                    >
                                                        <PlusCircle size={12} />
                                                        <span>+25 XP Aula</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* AWARD XP MODAL */}
                {awardModalStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-purple-500/30 shadow-2xl space-y-4">
                            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <span>⭐ Otorgar XP de Mérito</span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Asignando puntos a: <strong>{awardModalStudent.name}</strong> ({awardModalStudent.grade})
                            </p>

                            <form onSubmit={handleAwardXp} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                                        Puntos XP a Otorgar
                                    </label>
                                    <div className="flex gap-2">
                                        {[15, 25, 50, 100].map((amt) => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => setAwardAmount(amt)}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                                                    awardAmount === amt
                                                        ? 'bg-purple-600 text-white border-purple-600 shadow'
                                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                                }`}
                                            >
                                                +{amt} XP
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                                        Motivo del Reconocimiento
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={awardReason}
                                        onChange={(e) => setAwardReason(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setAwardModalStudent(null)}
                                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={awarding}
                                        className="btn-arcade btn-arcade-emerald px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md"
                                    >
                                        {awarding ? 'Otorgando...' : 'Confirmar Mérito ⭐'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
