import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { SharedProps } from '../types';
import Navbar from '../Components/Navbar';
import RegisterModal from '../Components/RegisterModal';
import { CheckCircle2, AlertCircle, Info, Heart } from 'lucide-react';
import { appUrl } from '../lib/route';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { flash } = usePage<SharedProps>().props;
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [voteOptionToRegister, setVoteOptionToRegister] = useState<{ id: string; text: string; emoji: string } | null>(null);

    const openRegisterModal = (option?: { id: string; text: string; emoji: string }) => {
        setVoteOptionToRegister(option || null);
        setRegisterModalOpen(true);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100 selection:bg-purple-500 selection:text-white transition-colors duration-200">
            {/* Ambient Background Glowing Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/15 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Navbar */}
            <Navbar onOpenRegister={() => openRegisterModal()} />

            {/* Flash Messages */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4 space-y-2">
                {flash.success && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold text-sm flex items-center gap-2.5 animate-fadeIn shadow-sm">
                        <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash.error && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-semibold text-sm flex items-center gap-2.5 animate-fadeIn shadow-sm">
                        <AlertCircle size={18} className="text-rose-500 flex-shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}
                {flash.info && (
                    <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 font-semibold text-sm flex items-center gap-2.5 animate-fadeIn shadow-sm">
                        <Info size={18} className="text-cyan-500 flex-shrink-0" />
                        <span>{flash.info}</span>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1">
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child as React.ReactElement<any>, {
                            onOpenRegister: openRegisterModal,
                        });
                    }
                    return child;
                })}
            </main>

            {/* Global Register Modal */}
            <RegisterModal
                isOpen={registerModalOpen}
                onClose={() => setRegisterModalOpen(false)}
                voteOption={voteOptionToRegister}
            />

            {/* Footer */}
            <footer className="relative z-10 bg-white/60 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-slate-700 dark:text-slate-300">
                            🤖 Club T.I.A.
                        </span>
                        <span>·</span>
                        <span>U.E. Colegio Monte Carmelo (Puerto Ordaz)</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href={appUrl('/nosotros')} className="hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-colors">
                            Misión & Visión
                        </Link>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                            Hecho con <Heart size={12} className="text-rose-500 fill-rose-500" /> por el Ing. Héctor Mota
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
