import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import RegisterModal from '../../Components/RegisterModal';
import { ShieldCheck, UserCheck, Sparkles, UserPlus, ChevronRight, Lock, Eye, EyeOff, X, School, LogIn } from 'lucide-react';
import { appUrl } from '../../lib/route';

interface UserItem {
    id: number;
    name: string;
    role: string;
    grade?: string;
    section?: string;
    specialty?: string;
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
    const [activeUserForAuth, setActiveUserForAuth] = useState<UserItem | null>(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Internal Register Modal state
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [registerRole, setRegisterRole] = useState<'alumno' | 'colaborador'>('alumno');

    const facilitador = users.find(u => u.role === 'facilitador');
    const colaboradores = users.filter(u => u.role === 'colaborador');
    const students = users.filter(u => u.role === 'alumno');

    const openAuthModal = (targetUser: UserItem) => {
        setActiveUserForAuth(targetUser);
        setPassword('');
        setError(null);
        setShowPassword(false);
    };

    const handleStudentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedStudentId) {
            const student = students.find(s => s.id === Number(selectedStudentId));
            if (student) {
                openAuthModal(student);
            }
        }
    };

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeUserForAuth) return;

        setLoading(true);
        setError(null);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch(appUrl('/usuarios/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    user_id: activeUserForAuth.id,
                    password,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Navigate to dashboard
                router.visit(appUrl('/dashboard'));
            } else {
                setError(data.message || 'Clave de acceso incorrecta. Inténtalo nuevamente.');
            }
        } catch (err) {
            setError('Error de comunicación con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    const openRegisterWithRole = (role: 'alumno' | 'colaborador') => {
        setRegisterRole(role);
        if (onOpenRegister) {
            onOpenRegister();
        } else {
            setIsRegisterOpen(true);
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
                        <span>Colegio Monte Carmelo · Acceso Seguro a Dashboards</span>
                    </div>

                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
                        ¿Cómo deseas ingresar al Club T.I.A.?
                    </h1>

                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                        Selecciona tu perfil e introduce tu clave de acceso personal para ingresar a tu panel interactivo.
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
                                    Acceso completo a la <strong>telemetría escolar</strong>, <strong>directorio de inscritos con edición de perfiles</strong>, gestor de la encuesta en vivo, asignación de méritos (+XP) y editor de Misión/Visión.
                                </p>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="button"
                                    onClick={() => openAuthModal(facilitador)}
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
                                Consulta tu puntuación de XP, vitrina de medallas e insignias, y actualiza tu avatar.
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
                                            {st.avatar_emoji} {st.name} ({st.grade}{st.section ? ` · Sec. ${st.section}` : ''} · {st.xp_points} XP)
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="submit"
                                    disabled={!selectedStudentId}
                                    className="w-full btn-arcade btn-arcade-cyan py-3 px-4 rounded-2xl text-white font-bold font-display text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                                >
                                    <UserCheck size={18} />
                                    <span>Continuar con mi Clave de Acceso</span>
                                </button>
                            </form>
                        </div>

                        {/* Register links */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-4 text-center space-y-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400 block">
                                ¿Eres un nuevo miembro?
                            </span>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    type="button"
                                    onClick={() => openRegisterWithRole('alumno')}
                                    className="flex-1 py-2 px-3 rounded-xl border border-dashed border-purple-400 hover:border-purple-600 text-purple-600 dark:text-purple-400 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <UserPlus size={15} />
                                    <span>Registrar Alumno (+100 XP)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => openRegisterWithRole('colaborador')}
                                    className="flex-1 py-2 px-3 rounded-xl border border-dashed border-amber-400 hover:border-amber-600 text-amber-600 dark:text-amber-400 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <School size={15} />
                                    <span>Registrar Docente (+200 XP)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. COORDINACIÓN / DOCENTES */}
                {colaboradores.length > 0 && (
                    <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
                            Acompañamiento Docente y Coordinación Escolar
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {colaboradores.map((colab) => (
                                <div
                                    key={colab.id}
                                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 hover:border-amber-400/50 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{colab.avatar_emoji}</span>
                                        <div>
                                            <span className="font-bold text-sm text-slate-900 dark:text-white block">
                                                {colab.name}
                                            </span>
                                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                                {colab.specialty || colab.grade || 'Docente Acompañante'}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => openAuthModal(colab)}
                                        className="btn-arcade btn-arcade-amber px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1 shrink-0"
                                    >
                                        <span>Entrar</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* PASSWORD AUTH MODAL */}
            {activeUserForAuth && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-purple-500/30 overflow-hidden transform transition-all">
                        {/* Header */}
                        <div className="relative p-6 pb-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white">
                            <button
                                onClick={() => setActiveUserForAuth(null)}
                                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-all"
                                aria-label="Cerrar"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl shadow-inner">
                                    {activeUserForAuth.avatar_emoji}
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                                        {activeUserForAuth.role === 'facilitador'
                                            ? 'Administrador'
                                            : activeUserForAuth.role === 'colaborador'
                                            ? 'Docente'
                                            : 'Estudiante'}
                                    </span>
                                    <h3 className="text-xl font-bold font-display mt-0.5">
                                        {activeUserForAuth.name}
                                    </h3>
                                    <p className="text-xs text-purple-100">
                                        {activeUserForAuth.grade} {activeUserForAuth.section ? `· Sec. ${activeUserForAuth.section}` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handlePasswordLogin} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-medium">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                                    <Lock size={14} className="text-purple-500" />
                                    <span>Introduce tu Clave de Acceso</span>
                                </label>

                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoFocus
                                        placeholder="Ingresa tu clave secreta"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                                        title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Educational / Demo Hint */}
                            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-xs text-purple-700 dark:text-purple-300 space-y-1">
                                <div className="font-bold flex items-center gap-1">
                                    <span>🔐 Educación en Ciberseguridad Escolar</span>
                                </div>
                                <p className="text-[11px] leading-relaxed text-purple-600 dark:text-purple-300/80">
                                    Tu clave es personal. Cuídala como la llave de tu casillero escolar.
                                </p>
                                <p className="text-[11px] font-semibold text-purple-800 dark:text-purple-200">
                                    💡 Nota de prueba: Para las cuentas predeterminadas del colegio, la clave es <code className="bg-purple-200 dark:bg-purple-900 px-1.5 py-0.5 rounded text-purple-900 dark:text-purple-100 font-mono">carmelo2026</code>.
                                </p>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveUserForAuth(null)}
                                    className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !password}
                                    className="flex-2 w-full py-3 px-6 rounded-2xl font-bold font-display text-white text-sm btn-arcade btn-arcade-purple flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                                >
                                    <LogIn size={16} />
                                    <span>{loading ? 'Verificando...' : 'Entrar al Dashboard 🚀'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* REGISTER MODAL */}
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                initialRole={registerRole}
            />
        </AppLayout>
    );
}
