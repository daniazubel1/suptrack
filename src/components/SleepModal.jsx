import React, { useState, useEffect } from 'react';
import { X, Moon, BedDouble } from 'lucide-react';

export default function SleepModal({ isOpen, onClose, currentSleep, onSave, date }) {
    if (!isOpen) return null;

    const [hours, setHours] = useState(currentSleep || 7);

    useEffect(() => {
        setHours(currentSleep || 7);
    }, [currentSleep, isOpen]);

    const handleSave = () => {
        onSave(date, 'sleepHours', hours);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Moon className="text-indigo-400" /> Sleep Log
                    </h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center mb-10 space-y-4">
                    <div className="relative">
                        <BedDouble size={48} className="text-zinc-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
                        <span className="text-6xl font-bold text-white tracking-tighter">{hours}</span>
                        <span className="text-xl text-zinc-500 ml-1 font-medium">hrs</span>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="12"
                        step="0.5"
                        value={hours}
                        onChange={(e) => setHours(parseFloat(e.target.value))}
                        className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                    />
                    <div className="flex justify-between w-full text-xs text-zinc-600 font-mono px-1">
                        <span>0h</span>
                        <span>6h</span>
                        <span>12h</span>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-6">
                    {[6, 7, 7.5, 8].map(h => (
                        <button
                            key={h}
                            onClick={() => setHours(h)}
                            className={`py-2 rounded-lg text-sm font-medium transition-colors border ${hours === h ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5'}`}
                        >
                            {h}h
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                >
                    Save Sleep
                </button>
            </div>
        </div>
    );
}
