import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { SharedProps } from '../types';
import { Sun, Moon, LogOut, LayoutDashboard, UserPlus, Sparkles } from 'lucide-react';

interface NavbarProps {
    onOpenRegister?: () => void;
}

export default function Navbar({ onOpenRegister }: NavbarProps) {
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

    const handleLogout = () => {
        router.post('/usuarios/logout');
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                {/* Logo & Branding */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-200">
                            🤖
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                                    CLUB T.I.A.
                                </span>
                                <span className="hidden sm:inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                                    Monte Carmelo
                                </span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                                Tecnologías de la Información & Inteligencia Artificial
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Center Navigation Links */}
                <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-sm font-semibold">
                    <Link
                        href="/"
                        className="px-3.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all"
                    >
                        🚀 Islas de Misión
                    </Link>
                    <Link
                        href="/nosotros"
                        className="px-3.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
                    >
                        <span>🎯 Misión & Visión</span>
                        <span className="text-[10px] bg-purple-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                            Oficial
                        </span>
                    </Link>
                </nav>

                {/* Right Controls: Theme + User / Dashboard */}
                <div className="flex items-center gap-2.5 sm:gap-3">
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
                                href="/dashboard"
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
                            <span className="hidden sm:inline-flex text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                                👤 Invitado
                            </span>
                            <button
                                type="button"
                                onClick={onOpenRegister}
                                className="btn-arcade btn-arcade-cyan px-4 py-2 rounded-2xl text-white font-bold font-display text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
                            >
                                <UserPlus size={16} />
                                <span>Registrarme / Entrar</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
