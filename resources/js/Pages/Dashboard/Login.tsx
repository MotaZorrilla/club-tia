import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import RegisterModal from '../../Components/RegisterModal';
import { ShieldCheck, Sparkles, UserPlus, Lock, Eye, EyeOff, School, LogIn, ArrowLeft, KeyRound, Mail, User } from 'lucide-react';
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
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Register Modal state
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [registerRole, setRegisterRole] = useState<'alumno' | 'colaborador'>('alumno');

    const facilitador = users.find(u => u.role === 'facilitador');
    const colaboradores = users.filter(u => u.role === 'colaborador');

    const handleTraditionalLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginInput.trim()) {
            setError('Por favor ingresa tu correo escolar o nombre de usuario.');
            return;
        }
        if (!password) {
            setError('Por favor introduce tu clave de acceso.');
            return;
        }

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
                    login: loginInput.trim(),
                    password,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                window.location.href = appUrl('/dashboard');
            } else {
                setError(data.message || 'Credenciales incorrectas. Verifica tus datos.');
            }
        } catch (err) {
            setError('Error de comunicación con el servidor escolar.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickFill = (user: UserItem, defaultPass: string = 'carmelo2026') => {
        setLoginInput(user.name);
        setPassword(defaultPass);
        setError(null);
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
            <Head title="Iniciar Sesión · Club T.I.A. Monte Carmelo" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center justify-between">
                    <Link
                        href={appUrl('/')}
                        className="btn-arcade bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:border-purple-400"
                    >
                        <ArrowLeft size={14} />
                        <span>Volver a las Islas</span>
                    </Link>
                    <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                        Portal Escolar Club T.I.A. 2026-2027
                    </span>
                </div>

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-500/20">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>Colegio Monte Carmelo · Acceso Personalizado</span>
                    </div>

                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
                        Accede a tu Cuenta de Explorador
                    </h1>

                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                        Inicia sesión con tu correo escolar o usuario para consultar tu carnet, acumular XP y desbloquear misiones.
                    </p>
                </div>

                {/* Main Auth Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* TRADITIONAL LOGIN FORM (Center Left 7 cols) */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border-2 border-purple-500/30 shadow-2xl space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center text-2xl shadow-inner">
                                    <KeyRound size={24} />
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                                        Ingreso de Usuarios
                                    </h2>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Estudiantes, Docentes y Facilitadores
                                    </span>
                                </div>
                            </div>
                            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                Seguro SSL
                            </span>
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold animate-fadeIn">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleTraditionalLogin} className="space-y-4">
                            {/* Identifier Input */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                    <Mail size={13} className="text-purple-500" />
                                    <span>Correo Escolar o Nombre de Usuario</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    placeholder="Ej. sofia.carmelo o hector@motazorrilla.com"
                                    value={loginInput}
                                    onChange={(e) => setLoginInput(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm shadow-inner"
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                        <Lock size={13} className="text-purple-500" />
                                        <span>Contraseña Escolar</span>
                                    </label>
                                    <span className="text-[10px] text-slate-400">
                                        Mínimo 4 caracteres
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="Introduce tu clave secreta"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm shadow-inner"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                                        title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading || !loginInput || !password}
                                    className="w-full py-3.5 px-6 rounded-2xl font-bold font-display text-white text-sm btn-arcade btn-arcade-purple flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-[1.01] transition-transform disabled:opacity-50"
                                >
                                    <LogIn size={18} />
                                    <span>{loading ? 'Verificando credenciales...' : 'Iniciar Sesión en el Club T.I.A. 🚀'}</span>
                                </button>
                            </div>
                        </form>

                        {/* Register Callout */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 text-center space-y-3">
                            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                                ¿Aún no tienes cuenta registrada en el Semillero?
                            </span>
                            <div className="flex flex-col sm:flex-row gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => openRegisterWithRole('alumno')}
                                    className="flex-1 py-2.5 px-4 rounded-xl border-2 border-dashed border-cyan-400 dark:border-cyan-500/60 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                    <UserPlus size={15} />
                                    <span>Registrar Alumno (+100 XP)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => openRegisterWithRole('colaborador')}
                                    className="flex-1 py-2.5 px-4 rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-500/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-700 dark:text-amber-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                    <School size={15} />
                                    <span>Registrar Docente (+200 XP)</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SIDE PANEL: QUICK ACCESS & DEMO HELPER (Right 5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Facilitator Card */}
                        {facilitador && (
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 dark:from-slate-800 dark:to-purple-950/30 rounded-3xl p-6 border border-purple-200 dark:border-purple-500/30 shadow-md space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{facilitador.avatar_emoji}</span>
                                    <div>
                                        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                                            {facilitador.name}
                                        </h3>
                                        <span className="text-xs text-purple-700 dark:text-purple-300 font-semibold">
                                            Facilitador · Mentor Técnico
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Acceso a la consola de administración escolar, telemetría de misiones, asignación de méritos (+XP) y control del Live Polling.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleQuickFill(facilitador)}
                                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                                >
                                    <ShieldCheck size={16} />
                                    <span>Autocompletar como Facilitador</span>
                                </button>
                            </div>
                        )}

                        {/* Co-teachers / Coordination */}
                        {colaboradores.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                                    Acompañamiento Docente
                                </span>
                                {colaboradores.map((colab) => (
                                    <div
                                        key={colab.id}
                                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 gap-2"
                                    >
                                        <div className="flex items-center gap-2.5 truncate">
                                            <span className="text-xl">{colab.avatar_emoji}</span>
                                            <div className="truncate">
                                                <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                                                    {colab.name}
                                                </span>
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                                    {colab.specialty || colab.grade}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleQuickFill(colab)}
                                            className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 text-[11px] font-bold shrink-0 transition-colors"
                                        >
                                            Cargar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Security Info Card */}
                        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <span>🔒</span>
                                <span>Entorno de Aprendizaje Monte Carmelo</span>
                            </span>
                            <p className="text-[11px] leading-relaxed">
                                Cada estudiante cuenta con su propio perfil individual. Tus logros, medallas obtenidas en las 5 islas y votos se guardan de forma permanente.
                            </p>
                            <p className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
                                💡 Clave predeterminada de prueba: <strong>carmelo2026</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* REGISTER MODAL */}
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                initialRole={registerRole}
            />
        </AppLayout>
    );
}
