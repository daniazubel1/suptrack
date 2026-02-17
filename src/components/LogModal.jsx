import React, { useState, useEffect } from 'react';
import { X, Clock, Utensils, Ban, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LogModal({ isOpen, onClose, checkLog, supplement, date }) {
    if (!isOpen || !supplement) return null;

    const now = new Date();
    const [time, setTime] = useState(now.toTimeString().slice(0, 5));
    const [context, setContext] = useState('with-food'); // 'fasted', 'with-food', 'pre-workout', 'post-workout'

    // Reset to default when opening
    useEffect(() => {
        if (isOpen) {
            const currentHour = new Date().getHours().toString().padStart(2, '0');
            setTime(`${currentHour}:00`);
            setContext(supplement.foodReq === 'empty-stomach' ? 'fasted' : 'with-food');
        }
    }, [isOpen, supplement]);

    const handleSubmit = (e) => {
        e.preventDefault();
        checkLog(date, supplement.id, { time, context });
        onClose();
    };

    const contexts = [
        { id: 'fasted', label: 'Fasted / Empty Stomach', icon: Ban, color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
        { id: 'with-food', label: 'With Food', icon: Utensils, color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
        { id: 'pre-workout', label: 'Pre-Workout', icon: Clock, color: 'text-red-400 bg-red-400/10 border-red-400/20' },
        { id: 'post-workout', label: 'Post-Workout', icon: Clock, color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white">{supplement.name}</h3>
                        <p className="text-sm text-zinc-400">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Time Taken (Hour)</label>
                        <select
                            value={time.split(':')[0]}
                            onChange={(e) => setTime(`${e.target.value}:00`)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xl font-mono appearance-none"
                        >
                            {Array.from({ length: 24 }).map((_, i) => {
                                const hour = i.toString().padStart(2, '0');
                                return (
                                    <option key={hour} value={hour} className="bg-zinc-900">
                                        {hour}:00
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Context</label>
                        <div className="grid grid-cols-1 gap-2">
                            {contexts.map(ctx => (
                                <button
                                    key={ctx.id}
                                    type="button"
                                    onClick={() => setContext(ctx.id)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                                        context === ctx.id
                                            ? `border-white/20 ring-1 ring-white/20 ${ctx.color} bg-opacity-20`
                                            : "bg-black/20 border-white/5 hover:bg-white/5 text-zinc-400"
                                    )}
                                >
                                    <div className={cn("p-1.5 rounded-lg", context === ctx.id ? "bg-black/20" : "bg-white/5")}>
                                        <ctx.icon size={16} />
                                    </div>
                                    <span className={cn("text-sm font-medium", context === ctx.id ? "text-white" : "")}>{ctx.label}</span>
                                    {context === ctx.id && <Check size={16} className="ml-auto" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        Log Supplement
                    </button>
                </form>
            </div>
        </div>
    );
}
