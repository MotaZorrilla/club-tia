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

                {/* LOS 6 PILARES DE FORMACIÓN */}
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="text-xs font-black uppercase text-amber-500 tracking-wider">
                            Plan Formativo Integral
                        </span>
                        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
                            Los 6 Pilares del Club T.I.A.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {/* 1. ANTIGUO 6: PENSAMIENTO CRÍTICO & ÉTICA */}
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-indigo-500/40 shadow-sm">
                            <span className="text-2xl">🛡️</span>
                            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">
                                1. Pensamiento Crítico & Ética
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                Formación en ciudadanía digital, verificación rigurosa de fuentes y uso responsable de la IA.
                            </p>
                        </div>

                        {/* 2. ANTIGUO 4: DESARROLLO WEB FRONT-END */}
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <span className="text-2xl">🌐</span>
                            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">
                                2. Desarrollo Web Front-End
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                HTML5, Tailwind CSS y JavaScript para publicar proyectos reales.
                            </p>
                        </div>

                        {/* 3. ANTIGUO 3: RAG & NOTEBOOKLM */}
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <span className="text-2xl">📚</span>
                            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">
                                3. RAG & NotebookLM
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                Articulación con el Plan Lector mediante IA grounded con cero alucinaciones.
                            </p>
                        </div>

                        {/* 4. ANTIGUO 5: VISIÓN ARTIFICIAL */}
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <span className="text-2xl">👁️</span>
                            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">
                                4. Visión Artificial
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                Google Teachable Machine con la cámara web del laboratorio de computación.
                            </p>
                        </div>

                        {/* 5. ANTIGUO 2: PYTHON & ALGORITMIA */}
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <span className="text-2xl">🐍</span>
                            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">
                                5. Python & Algoritmia
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                Lógica deductiva y preparación para la Olimpiada Canguro Matemático.
                            </p>
                        </div>

                        {/* 6. ANTIGUO 1: CONTECH & GEMELOS DIGITALES */}
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <span className="text-2xl">🏗️</span>
                            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">
                                6. ConTech & Gemelos Digitales
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                Visores 3D en navegador, conceptos BIM y arquitectura digital interactiva.
                            </p>
                        </div>
                    </div>
                </div>

                {/* PROYECTOS POR LAPSO ASOCIADOS A CONCURSOS Y PRODUCTOS REALES */}
                <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 dark:from-slate-900 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-3xl p-8 border-2 border-indigo-500/30 space-y-8 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-500/20 pb-5">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-indigo-500/20">
                                <span>🏆 Hoja de Ruta Competitiva · Año Escolar 2026-2027</span>
                            </div>
                            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
                                Proyectos por Lapso Asociados a Concursos
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                Entregables en 3 formatos concretos: <strong>Simuladores</strong>, <strong>Videojuegos</strong> y <strong>Páginas Web</strong> con el hito insignia del <strong>Bot Escolar</strong>.
                            </p>
                        </div>

                        <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 shadow-sm self-start md:self-auto">
                            📅 Martes, Miércoles y Jueves
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* LAPSO 1 */}
                        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border-2 border-purple-500/30 shadow-md space-y-4 flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-black uppercase px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300">
                                        1° Lapso · Oct - Dic
                                    </span>
                                    <span className="text-2xl">🧮</span>
                                </div>
                                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                                    Simulador: Canguro Matemático
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Desarrollo de un simulador web interactivo con retos de lógica deductiva, series numéricas y geometría para preparar a los estudiantes de Monte Carmelo de cara a las olimpiadas matemáticas del 2do lapso.
                                </p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[11px] font-semibold text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                🛠️ Formato: Simulador Web & Lógica Python
                            </div>
                        </div>

                        {/* LAPSO 2 */}
                        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border-2 border-cyan-500/30 shadow-md space-y-4 flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-black uppercase px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                                        2° Lapso · Ene - Mar
                                    </span>
                                    <span className="text-2xl">🔭</span>
                                </div>
                                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                                    Astronomía & Bot Asistente
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Articulación con el Club de Astronomía para simular órbitas y cuerpos celestes, complementado con la construcción del primer <strong>Bot Conversacional Escolar</strong> entrenado con Procesamiento de Lenguaje Natural (NLP).
                                </p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-[11px] font-semibold text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                                🛠️ Formato: Bot (NLP) & Visualizador Espacial
                            </div>
                        </div>

                        {/* LAPSO 3 */}
                        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border-2 border-emerald-500/30 shadow-md space-y-4 flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                                        3° Lapso · Abr - Jul
                                    </span>
                                    <span className="text-2xl">🎮</span>
                                </div>
                                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                                    Videojuegos & Páginas Web
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Creación de videojuegos 2D/3D educativos con motores gráficos ligeros y accesibles, con enfoque en apoyo a la neurodiversidad y publicación de portales web para la Feria Tecnológica Institucional.
                                </p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                🛠️ Formato: Videojuegos & Apps Web Escolares
                            </div>
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
