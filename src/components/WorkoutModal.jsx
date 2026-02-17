import React, { useState } from 'react';
import { X, Dumbbell, Activity, Bike, Footprints, Waves, User, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

export default function WorkoutModal({ isOpen, onClose, currentWorkout, onSave, date }) {
    if (!isOpen) return null;

    const [selectedType, setSelectedType] = useState(
        typeof currentWorkout === 'object' ? currentWorkout.type : (currentWorkout ? 'Gym' : null)
    );

    const workoutTypes = [
        { id: 'Gym', label: 'Gym / Weights', icon: Dumbbell, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
        { id: 'Run', label: 'Running', icon: Activity, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
        { id: 'Swim', label: 'Swimming', icon: Waves, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
        { id: 'CrossFit', label: 'CrossFit / HIIT', icon: Trophy, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
        { id: 'Walk', label: 'Walking', icon: Footprints, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
        { id: 'Cycle', label: 'Cycling', icon: Bike, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
        { id: 'Yoga', label: 'Yoga / Pilates', icon: User, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    ];

    const handleSelect = (typeId) => {
        setSelectedType(typeId);
    };

    const handleSave = () => {
        if (selectedType) {
            onSave(date, 'workout', { type: selectedType, completed: true });
        } else {
            // If nothing selected, maybe they want to clear it? assume yes if they click save without selection
            onSave(date, 'workout', false);
        }
        onClose();
    };

    const handleClear = () => {
        onSave(date, 'workout', false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-emerald-400" /> Log Workout
                    </h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    {workoutTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = selectedType === type.id;

                        return (
                            <button
                                key={type.id}
                                onClick={() => handleSelect(type.id)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                                    isSelected
                                        ? "bg-white/10 border-white/20 ring-1 ring-white/20"
                                        : "bg-zinc-900/40 border-white/5 hover:bg-white/5 hover:border-white/10"
                                )}
                            >
                                <div className={cn("p-2 rounded-lg border", type.color)}>
                                    <Icon size={18} />
                                </div>
                                <span className={cn("text-base font-medium", isSelected ? "text-white" : "text-zinc-400")}>
                                    {type.label.split(' / ')[0]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-3">
                    {currentWorkout && (
                        <button
                            onClick={handleClear}
                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-3 rounded-xl transition-all"
                        >
                            Clear
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                    >
                        Start Workout
                    </button>
                </div>
            </div>
        </div>
    );
}
