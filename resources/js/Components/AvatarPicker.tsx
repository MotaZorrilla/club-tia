import React from 'react';

export const DEFAULT_AVATARS = [
    { emoji: '🤖', name: 'Robot' },
    { emoji: '🚀', name: 'Cohete' },
    { emoji: '🧠', name: 'Cerebro' },
    { emoji: '🐱', name: 'Gato Hacker' },
    { emoji: '🦊', name: 'Zorro Astuto' },
    { emoji: '⚡', name: 'Relámpago' },
    { emoji: '🎨', name: 'Artista Digital' },
    { emoji: '🔬', name: 'Científico' },
    { emoji: '👾', name: 'Gamer 8-Bit' },
    { emoji: '🌟', name: 'Estrella' },
    { emoji: '🦾', name: 'Ciborg' },
    { emoji: '💻', name: 'Programador' },
    { emoji: '🦉', name: 'Búho Sabio' },
    { emoji: '🦖', name: 'Dino Tech' },
    { emoji: '🧙‍♂️', name: 'Mago Digital' },
];

interface AvatarPickerProps {
    selected: string;
    onSelect: (emoji: string) => void;
    size?: 'sm' | 'md' | 'lg';
}

export default function AvatarPicker({ selected, onSelect, size = 'md' }: AvatarPickerProps) {
    const sizeClasses = {
        sm: 'w-10 h-10 text-xl',
        md: 'w-12 h-12 text-2xl',
        lg: 'w-16 h-16 text-3xl',
    };

    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Selecciona tu Avatar Emoji
            </label>
            <div className="grid grid-cols-5 gap-2.5 max-h-56 overflow-y-auto p-2 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                {DEFAULT_AVATARS.map((item) => {
                    const isSelected = selected === item.emoji;
                    return (
                        <button
                            key={item.emoji}
                            type="button"
                            onClick={() => onSelect(item.emoji)}
                            className={`flex flex-col items-center justify-center rounded-xl p-1.5 transition-all transform active:scale-95 ${
                                isSelected
                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 scale-105 ring-2 ring-purple-400 ring-offset-2 dark:ring-offset-slate-900'
                                    : 'bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:scale-105'
                            }`}
                            title={item.name}
                        >
                            <span className={`${sizeClasses[size]} flex items-center justify-center`}>
                                {item.emoji}
                            </span>
                            <span className="text-[10px] font-semibold truncate max-w-full px-0.5">
                                {item.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
