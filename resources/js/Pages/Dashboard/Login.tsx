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
    users?: UserItem[];
    onOpenRegister?: () => void;
}

export default function DashboardLogin({ users = [], onOpenRegister }: LoginProps) {
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Register Modal state
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [registerRole, setRegisterRole] = useState<'alumno' | 'colaborador'>('alumno');

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

                    {/* SIDE PANEL: INSTITUTIONAL SECURITY & PRIVACY (Right 5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Security Assurance Card */}
                        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 dark:from-slate-800 dark:via-slate-850 dark:to-purple-950/30 rounded-3xl p-6 border-2 border-indigo-500/30 shadow-lg space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shadow-inner">
                                    <ShieldCheck size={26} />
                                </div>
                                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                    🛡️ Privacidad Garantizada
                                </span>
                            </div>

                            <div>
                                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                                    Identidad Escolar & Privacidad
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                    El Colegio Monte Carmelo protege la privacidad de sus estudiantes bajo el Eje Transversal de Ciudadanía Digital. Las credenciales son personales e intransferibles.
                                </p>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                    <span className="text-indigo-500 shrink-0 font-bold">✓</span>
                                    <span><strong>Cuentas individuales:</strong> Cada explorador acumula XP, medallas y carnet propio de forma segura.</span>
                                </div>
                                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                    <span className="text-indigo-500 shrink-0 font-bold">✓</span>
                                    <span><strong>Cifrado criptográfico:</strong> Contraseñas resguardadas con algoritmos seguros (Argon2 / Bcrypt).</span>
                                </div>
                                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                    <span className="text-indigo-500 shrink-0 font-bold">✓</span>
                                    <span><strong>Trazabilidad formativa:</strong> Avance curricular conforme a la metodología ERCA.</span>
                                </div>
                            </div>
                        </div>

                        {/* Lab Support & Assistance Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl">
                                    <School size={20} />
                                </div>
                                <div>
                                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                                        Mesa de Ayuda del Club T.I.A.
                                    </h4>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Soporte Técnico en el Aula
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                Si olvidaste tu contraseña o necesitas vincular tu carnet escolar, acércate al facilitador técnico en las sesiones presenciales:
                            </p>

                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                <span>📅</span>
                                <span>Martes, Miércoles y Jueves · Aula Técnica</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => openRegisterWithRole('alumno')}
                                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                            >
                                <UserPlus size={16} />
                                <span>Crear Nueva Cuenta de Explorador (+100 XP)</span>
                            </button>
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
