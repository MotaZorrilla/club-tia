import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import confetti from 'canvas-confetti';
import AvatarPicker, { DEFAULT_AVATARS } from './AvatarPicker';
import { X, Sparkles, Rocket } from 'lucide-react';
import { appUrl } from '../lib/route';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    voteOption?: { id: string; text: string; emoji: string } | null;
    onRegistered?: (userData: any, newStats?: any) => void;
}

export default function RegisterModal({ isOpen, onClose, voteOption, onRegistered }: RegisterModalProps) {
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('5° Grado Primaria');
    const [avatar, setAvatar] = useState(DEFAULT_AVATARS[0].emoji);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Por favor escribe tu nombre o alias');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch(appUrl('/usuarios/registro'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    name: name.trim(),
                    grade,
                    avatar,
                    vote_option_id: voteOption ? voteOption.id : null,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Trigger celebratory confetti
                try {
                    confetti({
                        particleCount: 80,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#8b5cf6', '#06b6d4', '#fbbf24', '#10b981'],
                    });
                } catch (err) {}

                if (onRegistered) {
                    onRegistered(data.user, data.stats);
                } else {
                    router.reload();
                }
                onClose();
            } else {
                setError(data.message || 'Ocurrió un error al registrarte.');
            }
        } catch (err) {
            setError('Error de conexión con el servidor escolar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-purple-500/30 overflow-hidden transform transition-all">
                {/* Header */}
                <div className="relative p-6 pb-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-all"
                        aria-label="Cerrar"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl shadow-inner">
                            {voteOption ? voteOption.emoji : '🚀'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-display tracking-wide">
                                {voteOption ? '¡Vota y Únete al Club T.I.A.!' : '¡Identifícate como Explorador T.I.A.!'}
                            </h2>
                            <p className="text-xs text-purple-100 font-medium mt-0.5">
                                {voteOption
                                    ? `Estás a un paso de votar por: "${voteOption.text}"`
                                    : 'Colegio Monte Carmelo · Registro en 1 paso'}
                            </p>
                        </div>
                    </div>

                    {/* XP Bonus Pill */}
                    <div className="mt-3.5 inline-flex items-center gap-2 bg-yellow-400 text-slate-900 text-xs font-black px-3.5 py-1.5 rounded-full shadow-md">
                        <Sparkles size={14} className="text-amber-700 animate-spin" />
                        <span>Recompensa Inicial: {voteOption ? '+115 XP (Bienvenida + Voto)' : '+100 XP de Bienvenida'}</span>
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-medium">
                            {error}
                        </div>
                    )}

                    {/* Name Input */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            Tu Nombre o Alias Escolar
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ej. Lucas Silva o ValenTech"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Grade Selector */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            Grado / Año
                        </label>
                        <select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                        >
                            <option value="4° Grado Primaria">4° Grado Primaria</option>
                            <option value="5° Grado Primaria">5° Grado Primaria</option>
                            <option value="6° Grado Primaria">6° Grado Primaria</option>
                            <option value="1° Año Media General">1° Año Media General</option>
                            <option value="2° Año Media General">2° Año Media General</option>
                            <option value="3° Año Media General">3° Año Media General</option>
                            <option value="4° Año Media General">4° Año Media General</option>
                            <option value="5° Año Media General">5° Año Media General</option>
                            <option value="Docente / Colaborador">Docente / Colaborador</option>
                        </select>
                    </div>

                    {/* Avatar Picker */}
                    <AvatarPicker selected={avatar} onSelect={setAvatar} />

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-6 rounded-2xl font-bold font-display text-white text-base btn-arcade btn-arcade-purple flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-60"
                        >
                            <Rocket size={18} />
                            <span>
                                {loading
                                    ? 'Iniciando sesión...'
                                    : voteOption
                                    ? '¡Registrarme y Emitir mi Voto! 🌟'
                                    : '¡Unirme al Club T.I.A.! 🌟'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
