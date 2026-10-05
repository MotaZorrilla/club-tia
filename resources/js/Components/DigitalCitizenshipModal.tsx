import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Lock, Eye, BookOpen, MessageSquare, Sparkles, X, Award, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DigitalCitizenshipModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CITIZENSHIP_PILLARS = [
    {
        id: 'curaduria',
        icon: Eye,
        title: '1. Curaduría & Pensamiento Crítico',
        subtitle: 'No creas todo a ciegas: Sé un detective de la verdad',
        color: 'purple',
        badge: 'Anti-Alucinaciones',
        desc: 'Los modelos de lenguaje no "saben", calculan probabilidades. Cuando una IA responda sobre fechas históricas, ciencia o datos locales de Puerto Ordaz, tu deber es contrastar con fuentes oficiales, libros o enciclopedias.',
        rule: 'Regla de Oro: Si no puedes verificar la fuente primaria, no uses el dato en tu proyecto escolar.',
    },
    {
        id: 'privacidad',
        icon: Lock,
        title: '2. Privacidad & Huella Digital Segura',
        subtitle: 'Tus datos valen oro: Protégelos de la nube',
        color: 'cyan',
        badge: 'Cero Datos Personales',
        desc: 'Nunca ingreses nombres completos de familiares, tu dirección de casa, tu número de teléfono, fotos privadas ni contraseñas en prompts de IA pública.',
        rule: 'Regla de Oro: Lo que subes a una IA en la nube puede ser almacenado en servidores de entrenamiento para siempre.',
    },
    {
        id: 'honestidad',
        icon: BookOpen,
        title: '3. Honestidad Académica & Modo Copiloto',
        subtitle: 'La IA es tu tutora de estudio, no tu reemplazo',
        color: 'emerald',
        badge: 'Uso Ético Escolar',
        desc: 'Copiar y pegar un ensayo o código generado sin entenderlo no te hace más inteligente. En el Colegio Monte Carmelo usamos la IA como copiloto: para pedir explicaciones paso a paso, generar ideas creativas y debatir.',
        rule: 'Regla de Oro: Si la IA te ayudó en una investigación, decláralo con orgullo: "Asistido por IA para lluvia de ideas".',
    },
    {
        id: 'sesgos',
        icon: Shield,
        title: '4. Detección de Sesgos en Datasets',
        subtitle: 'Las máquinas heredan los prejuicios humanos',
        color: 'amber',
        badge: 'Justicia Algorítmica',
        desc: 'Si un modelo de visión artificial fue entrenado solo con fotos de autos de carreras, dudará al ver un carrito de helados. Si un texto refleja estereotipos culturales, la máquina los repetirá mecánicamente.',
        rule: 'Regla de Oro: La empatía, el juicio ético y el sentido de justicia son 100% humanos; las máquinas no los tienen.',
    },
    {
        id: 'positivo',
        icon: MessageSquare,
        title: '5. Redacción Constructiva en Positivo',
        subtitle: 'Lenguaje claro, constructivo y de respeto mutuo',
        color: 'rose',
        badge: 'Positive Prompting',
        desc: 'Tanto al comunicarte con otras personas en internet como al escribir prompts para la IA, exprésate en positivo. En lugar de prohibiciones confusas ("no hagas esto"), da instrucciones claras de lo que SÍ deseas construir.',
        rule: 'Regla de Oro: La tecnología debe servir para unir personas, resolver problemas del entorno y elevar la comunidad.',
    },
];

export default function DigitalCitizenshipModal({ isOpen, onClose }: DigitalCitizenshipModalProps) {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [pledgeCompleted, setPledgeCompleted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('tia_citizenship_pledge');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setCheckedItems(parsed);
                if (parsed.length >= CITIZENSHIP_PILLARS.length) {
                    setPledgeCompleted(true);
                }
            } catch (e) {}
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleItem = (id: string) => {
        const next = checkedItems.includes(id)
            ? checkedItems.filter(i => i !== id)
            : [...checkedItems, id];

        setCheckedItems(next);
        localStorage.setItem('tia_citizenship_pledge', JSON.stringify(next));

        if (next.length >= CITIZENSHIP_PILLARS.length) {
            setPledgeCompleted(true);
            try {
                confetti({
                    particleCount: 80,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
                });
            } catch (e) {}
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div
                className="bg-white dark:bg-slate-900 border-2 border-purple-500/30 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
                role="dialog"
                aria-modal="true"
            >
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white p-6 relative flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-white/20">
                            <Shield size={12} className="text-cyan-400" />
                            <span>Eje Transversal Oficial · Colegio Monte Carmelo</span>
                        </div>
                        <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-wide flex items-center gap-2">
                            <span>Ciudadanía Digital & Ética de la IA</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300">
                            Los 5 principios no negociables para usar la tecnología con sabiduría, responsabilidad y honor escolar.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors flex-shrink-0"
                        title="Cerrar ventana"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content - Scrollable */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-100">
                    {/* Barra de Compromiso */}
                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                                📜
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                                    Compromiso del Explorador T.I.A.
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Marca cada principio conforme lo comprendas en clase ({checkedItems.length} de {CITIZENSHIP_PILLARS.length} dominados)
                                </p>
                            </div>
                        </div>

                        <div className="w-full sm:w-48 bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-300"
                                style={{ width: `${(checkedItems.length / CITIZENSHIP_PILLARS.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {pledgeCompleted && (
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-3 animate-fadeIn">
                            <Award size={24} className="text-emerald-500 shrink-0" />
                            <span>
                                ¡Excelente! Has completado el compromiso de Ciudadanía Digital del Colegio Monte Carmelo. Llevas el estandarte de la innovación responsable.
                            </span>
                        </div>
                    )}

                    {/* Los 5 Pilares */}
                    <div className="space-y-4">
                        {CITIZENSHIP_PILLARS.map((p) => {
                            const IconComponent = p.icon;
                            const isChecked = checkedItems.includes(p.id);

                            return (
                                <div
                                    key={p.id}
                                    className={`p-5 rounded-2xl border transition-all duration-200 ${
                                        isChecked
                                            ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-500/40 shadow-sm'
                                            : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                                                <IconComponent size={20} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                                                        {p.title}
                                                    </h3>
                                                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                                        {p.badge}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    {p.subtitle}
                                                </p>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                                                    {p.desc}
                                                </p>
                                                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border-l-4 border-amber-500 mt-2">
                                                    {p.rule}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => toggleItem(p.id)}
                                            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                                                isChecked
                                                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                                            }`}
                                        >
                                            <CheckCircle2 size={16} />
                                            <span className="hidden sm:inline">
                                                {isChecked ? '¡Entendido!' : 'Comprendido'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Horario Extracurricular: Martes, Miércoles y Jueves
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-arcade btn-arcade-purple px-5 py-2.5 rounded-2xl text-white font-bold text-xs shadow-md"
                    >
                        Entendido, Volver a la Misión
                    </button>
                </div>
            </div>
        </div>
    );
}
