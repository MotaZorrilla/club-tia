import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { SharedProps } from '../types';
import { Sun, Moon, LogOut, LayoutDashboard, UserPlus, Sparkles, Shield } from 'lucide-react';
import { appUrl } from '../lib/route';

interface NavbarProps {
    onOpenRegister?: () => void;
    onOpenCitizenship?: () => void;
}

export default function Navbar({ onOpenRegister, onOpenCitizenship }: NavbarProps) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem('tia_theme');
        if (savedTheme === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        } else {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const nextTheme = !isDark;
        setIsDark(nextTheme);
        if (nextTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('tia_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('tia_theme', 'light');
        }
    };

    const handleLogout = async () => {
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            await fetch(appUrl('/usuarios/logout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
            window.location.href = appUrl('/dashboard');
        } catch (e) {
            router.post(appUrl('/usuarios/logout'));
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                {/* Logo & Branding */}
                <div className="flex items-center gap-3">
                    <Link href={appUrl('/')} className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-900 via-indigo-700 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-900/30 group-hover:scale-105 transition-transform duration-200 border border-white/20">
                                🤖
                            </div>
                            {/* Monte Carmelo Gold Star Pin */}
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-slate-900 shadow-sm" title="Colegio Monte Carmelo">
                                ★
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400 bg-clip-text text-transparent">
                                    CLUB T.I.A.
                                </span>
                                <span className="hidden sm:inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-900/10 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-800/20 dark:border-blue-500/30">
                                    Monte Carmelo
                                </span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                                Tecnologías e Inteligencia Artificial · Mar, Mié y Vie
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Center Navigation Links */}
                <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-sm font-semibold">
                    <Link
                        href={appUrl('/')}
                        className="px-3.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all"
                    >
                        🚀 Islas de Misión
                    </Link>
                    {onOpenCitizenship && (
                        <button
                            type="button"
                            onClick={onOpenCitizenship}
                            className="px-3.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
                        >
                            <span>🛡️ Ciudadanía Digital</span>
                            <span className="text-[10px] bg-cyan-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                                Eje
                            </span>
                        </button>
                    )}
                    <Link
                        href={appUrl('/nosotros')}
                        className="px-3.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
                    >
                        <span>🎯 Ideario & Proyectos</span>
                        <span className="text-[10px] bg-purple-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                            Oficial
                        </span>
                    </Link>
                </nav>

                {/* Right Controls: Theme + User / Dashboard */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                    {/* Mobile Citizenship Button */}
                    {onOpenCitizenship && (
                        <button
                            type="button"
                            onClick={onOpenCitizenship}
                            className="md:hidden w-10 h-10 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center transition-all border border-cyan-500/20"
                            title="Eje Transversal de Ciudadanía Digital"
                        >
                            <Shield size={18} />
                        </button>
                    )}

                    {/* Theme Toggle Button */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all border border-slate-200 dark:border-slate-700"
                        title={isDark ? 'Cambiar a modo Claro' : 'Cambiar a modo Oscuro'}
                        aria-label="Conmutar tema"
                    >
                        {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-purple-600" />}
                    </button>

                    {/* Authenticated User */}
                    {user ? (
                        <div className="flex items-center gap-2">
                            {/* Profile Chip */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <span className="text-2xl leading-none">{user.avatar_emoji}</span>
                                <div className="text-left">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">
                                            {user.name}
                                        </span>
                                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md ${
                                            user.role === 'facilitador'
                                                ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                                                : user.role === 'colaborador'
                                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                                                : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                                        <span className="font-black text-amber-500">Nv.{user.level}</span>
                                        <span>•</span>
                                        <span className="font-semibold">{user.xp_points} XP</span>
                                    </div>
                                </div>
                            </div>

                            {/* Direct Dashboard Link */}
                            <Link
                                href={appUrl('/dashboard')}
                                className="btn-arcade btn-arcade-purple px-4 py-2 rounded-2xl text-white font-bold font-display text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:shadow-purple-500/25"
                            >
                                <LayoutDashboard size={16} />
                                <span>Mi Dashboard</span>
                            </Link>

                            {/* Quick Logout */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                                title="Cerrar sesión"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        /* Unauthenticated / Guest View */
                        <div className="flex items-center gap-2">
                            <Link
                                href={appUrl('/dashboard')}
                                className="btn-arcade btn-arcade-purple px-4 py-2 rounded-2xl text-white font-bold font-display text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
                            >
                                <LayoutDashboard size={16} />
                                <span>Entrar al Dashboard</span>
                            </Link>
                            <button
                                type="button"
                                onClick={onOpenRegister}
                                className="hidden sm:inline-flex btn-arcade btn-arcade-cyan px-3.5 py-2 rounded-2xl text-white font-bold font-display text-xs sm:text-sm items-center gap-1.5 shadow-sm"
                            >
                                <UserPlus size={15} />
                                <span>Registrarme</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
