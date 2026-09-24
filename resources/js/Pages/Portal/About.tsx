import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { ClubSettings } from '../../types';
import { Target, Compass, Sparkles, Cpu, Shield, Award, Edit3, Save, CheckCircle2 } from 'lucide-react';
import { appUrl } from '../../lib/route';

interface AboutProps {
    settings: ClubSettings;
    isFacilitador: boolean;
}

export default function About({ settings: initialSettings, isFacilitador }: AboutProps) {
    const [settings, setSettings] = useState(initialSettings);
    const [editing, setEditing] = useState(false);
    const [misionText, setMisionText] = useState(initialSettings.mision);
    const [visionText, setVisionText] = useState(initialSettings.vision);
    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState(false);

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch(appUrl('/dashboard/mision-vision'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    mision: misionText,
                    vision: visionText,
                }),
            });

            if (res.ok) {
                setSettings({
                    ...settings,
                    mision: misionText,
                    vision: visionText,
                });
                setEditing(false);
                setSavedMsg(true);
                setTimeout(() => setSavedMsg(false), 4000);
            }
        } catch (e) {
            alert('Error al guardar la configuración.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AppLayout>
            <Head>
                <title>Misión, Visión e Ideario · Club T.I.A. Monte Carmelo</title>
                <meta name="description" content="Conoce la Misión, Visión y los 5 Pilares de Formación del Club de Tecnologías de la Información e Inteligencia Artificial del Colegio Monte Carmelo en Puerto Ordaz." />
                <meta property="og:title" content="Misión & Visión · Club T.I.A. Monte Carmelo" />
                <meta property="og:description" content="Nuestra propuesta formativa en inteligencia artificial, desarrollo web y pensamiento computacional para estudiantes de primaria y bachillerato." />
            </Head>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Header Banner */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-black uppercase tracking-wider">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>Ideario Institucional · Colegio Monte Carmelo</span>
                    </div>

                    <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 dark:text-white">
                        Misión, Visión & Filosofía
                    </h1>

                    <p className="text-base text-slate-600 dark:text-slate-300">
                        Los cimientos pedagógicos, éticos y técnicos que impulsan al <strong>Club de Tecnologías de la Información & Inteligencia Artificial (T.I.A.)</strong>.
                    </p>

                    {isFacilitador && (
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setEditing(!editing)}
                                className="btn-arcade btn-arcade-amber px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm inline-flex items-center gap-1.5"
                            >
                                <Edit3 size={14} />
                                <span>{editing ? 'Cancelar Edición' : '✏️ Editar Misión y Visión'}</span>
                            </button>
                        </div>
                    )}

                    {savedMsg && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 animate-fadeIn">
                            <CheckCircle2 size={16} />
                            <span>¡Textos institucionales actualizados con éxito en la base de datos!</span>
                        </div>
                    )}
                </div>

                {/* Edit Form for Facilitator */}
                {editing && isFacilitador && (
                    <form onSubmit={handleSaveSettings} className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-3xl border-2 border-purple-500/40 space-y-4 animate-fadeIn">
                        <h3 className="font-display font-bold text-lg text-purple-900 dark:text-purple-200 flex items-center gap-2">
                            <span>✏️ Editor Institucional (Exclusivo Facilitador)</span>
                        </h3>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                Misión del Club T.I.A.
                            </label>
                            <textarea
                                rows={3}
                                value={misionText}
                                onChange={(e) => setMisionText(e.target.value)}
                                className="w-full p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                                Visión del Club T.I.A.
                            </label>
                            <textarea
                                rows={3}
                                value={visionText}
                                onChange={(e) => setVisionText(e.target.value)}
                                className="w-full p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-arcade btn-arcade-purple px-5 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                            >
                                <Save size={14} />
                                <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
                            </button>
                        </div>
                    </form>
                )}

                {/* MISIÓN & VISIÓN CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* MISIÓN */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-purple-500/20 shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                            <Target size={28} />
                        </div>
                        <span className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                            Propósito Fundamental
                        </span>
                        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1 mb-4">
                            Misión
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                            {settings.mision}
                        </p>
                    </div>

                    {/* VISIÓN */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-cyan-500/20 shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-6">
                            <Compass size={28} />
                        </div>
                        <span className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider">
                            Horizonte 2026-2027
                        </span>
                        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1 mb-4">
                            Visión
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                            {settings.vision}
                        </p>
                    </div>
                </div>

                {/* LOS 5 PILARES DE FORMACIÓN */}
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="text-xs font-black uppercase text-amber-500 tracking-wider">
                            Plan Formativo Integral
                        </span>
                        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
                            Los 5 Pilares del Club T.I.A.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <span className="text-2xl">🏗️</span>
                            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">
                                1. ConTech & Gemelos Digitales
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                Visores 3D en navegador, conceptos BIM y arquitectura digital interactiva.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <span className="text-2xl">🐍</span>
                            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">
                                2. Python & Algoritmia
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                Lógica deductiva y preparación para la Olimpiada Canguro Matemático.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <span className="text-2xl">📚</span>
                            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">
                                3. RAG & NotebookLM
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                Articulación con el Plan Lector mediante IA grounded con cero alucinaciones.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <span className="text-2xl">🌐</span>
                            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">
                                4. Desarrollo Web Front-End
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                HTML5, Tailwind CSS y JavaScript para publicar proyectos reales.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <span className="text-2xl">👁️</span>
                            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">
                                5. Visión Artificial
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                Google Teachable Machine con la cámara web del laboratorio de computación.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <span className="text-2xl">🛡️</span>
                            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">
                                6. Pensamiento Crítico & Ética
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                Formación en ciudadanía digital, verificación rigurosa de fuentes y uso responsable de la IA.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back to Home CTA */}
                <div className="text-center pt-4">
                    <Link
                        href={appUrl('/')}
                        className="btn-arcade btn-arcade-purple px-6 py-3 rounded-2xl text-white font-bold font-display text-sm inline-flex items-center gap-2 shadow-lg"
                    >
                        <span>🚀 Regresar a las Islas de Misión</span>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
