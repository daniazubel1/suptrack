import React, { useState } from 'react';
import { useSup } from '../context/SupContext';
import { cn } from '../lib/utils';
import { Check, Circle, Sun, Moon, Dumbbell, Clock, Utensils, Ban, ChevronLeft, ChevronRight, Calendar as CalendarIcon, BedDouble, Activity, Bike, Footprints, Waves, User, Trophy } from 'lucide-react';
import LogModal from './LogModal';
import SleepModal from './SleepModal';
import WorkoutModal from './WorkoutModal';

export default function Dashboard() {
    const { supplements, history, lifestyle, toggleLog, updateLifestyle, userProfile } = useSup();

    // State for selected date (YYYY-MM-DD)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
    const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
    const [selectedSup, setSelectedSup] = useState(null);

    const today = new Date().toISOString().split('T')[0];
    const isToday = selectedDate === today;

    // Initial lifestyle values or defaults
    const currentLifestyle = lifestyle[selectedDate] || { sleepHours: 0, workout: false };

    // Parse workout data (handle boolean legacy)
    const workoutData = currentLifestyle.workout;
    const isWorkoutDone = !!workoutData;
    const workoutType = typeof workoutData === 'object' ? workoutData.type : (workoutData ? 'Gym' : null);

    // Helper to format date for display
    const formatDateDisplay = (dateStr) => {
        const date = new Date(dateStr);
        if (dateStr === today) return "Today's Sup";

        // Check if yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (dateStr === yesterday.toISOString().split('T')[0]) return "Yesterday's Sup";

        // Check if tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (dateStr === tomorrow.toISOString().split('T')[0]) return "Tomorrow's Sup";

        // Fallback to Day Name
        return `${date.toLocaleDateString('en-US', { weekday: 'long' })}'s Sup`;
    };

    const fullDateDisplay = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const handlePrevDay = () => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() - 1);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    const handleNextDay = () => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + 1);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    const handleJumpToToday = () => {
        setSelectedDate(today);
    };

    const currentLogs = history[selectedDate] || [];

    const handleSupClick = (sup) => {
        const isTaken = currentLogs.some(log => log.supplementId === sup.id);
        if (isTaken) {
            toggleLog(selectedDate, sup.id);
        } else {
            setSelectedSup(sup);
            setIsModalOpen(true);
        }
    };

    const handleLogSubmit = (date, id, details) => {
        toggleLog(date, id, details);
    };

    const sections = [
        { id: 'morning', label: 'Morning', icon: Sun, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
        { id: 'pre-workout', label: 'Pre-Workout', icon: Dumbbell, color: 'text-red-400 bg-red-400/10 border-red-400/20' },
        { id: 'intra-workout', label: 'Intra-Workout', icon: Dumbbell, color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
        { id: 'post-workout', label: 'Post-Workout', icon: Dumbbell, color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
        { id: 'night', label: 'Night', icon: Moon, color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
        { id: 'any', label: 'Anytime', icon: Clock, color: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20' },
    ];

    // Helper to get Icon for workout
    const getWorkoutIcon = (type) => {
        switch (type) {
            case 'Run': return Activity;
            case 'Swim': return Waves;
            case 'Walk': return Footprints;
            case 'Cycle': return Bike;
            case 'Yoga': return User;
            case 'CrossFit': return Trophy;
            default: return Activity;
        }
    };

    const WorkoutIcon = isWorkoutDone ? getWorkoutIcon(workoutType) : Activity;

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            {/* Header with Greeting (Desktop hidden as sidebar handles it, but good for mobile context) */}
            <div className="md:hidden">
                <h1 className="text-2xl font-bold text-white">Hi, {userProfile.name.split(' ')[0]}</h1>
                <p className="text-zinc-400 text-sm">Let's hit your goals today.</p>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center justify-between bg-zinc-900/50 backdrop-blur-sm p-3 rounded-2xl border border-white/5 shadow-sm">
                <button onClick={handlePrevDay} className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                </button>

                <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleJumpToToday}>
                    <CalendarIcon size={20} className="text-indigo-400" />
                    <span className="text-base font-semibold text-zinc-200">{fullDateDisplay}</span>
                </div>

                <button onClick={handleNextDay} className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-colors">
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Low Stock Warning */}
            {supplements.some(s => s.servingsLeft !== undefined && s.servingsLeft <= 5) && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-amber-500/20 p-2 rounded-full shrink-0">
                        <Activity size={20} className="text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-amber-200 font-bold text-sm">Low Stock Alert</h3>
                        <p className="text-amber-400/80 text-xs mt-1">
                            {supplements.filter(s => s.servingsLeft !== undefined && s.servingsLeft <= 5).map(s => s.name).join(', ')}
                            {supplements.filter(s => s.servingsLeft !== undefined && s.servingsLeft <= 5).length === 1 ? ' is' : ' are'} running low.
                        </p>
                    </div>
                </div>
            )}

            {/* Hero / Vitals Section */}
            <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5 p-7 animate-in fade-in slide-in-from-top-4">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">{formatDateDisplay(selectedDate)}</h2>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Sleep Button (Modal Trigger) */}
                        <button
                            onClick={() => setIsSleepModalOpen(true)}
                            className="bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors text-left group"
                        >
                            <div className="flex items-center gap-2.5 mb-2">
                                <BedDouble size={20} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                                <span className="text-base font-medium text-zinc-300">Sleep</span>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-bold text-white">
                                    {currentLifestyle.sleepHours || 0}
                                </span>
                                <span className="text-base text-zinc-500 font-medium">hrs</span>
                            </div>
                        </button>

                        {/* Workout Toggle / Modal Trigger */}
                        <button
                            onClick={() => setIsWorkoutModalOpen(true)}
                            className={cn(
                                "p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left group",
                                isWorkoutDone
                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                    : "bg-black/20 border-white/5 hover:border-white/10"
                            )}
                        >
                            <div className="flex items-center gap-2.5 mb-2">
                                <WorkoutIcon size={20} className={cn(isWorkoutDone ? "text-emerald-400" : "text-zinc-500", "group-hover:scale-110 transition-transform")} />
                                <span className={cn("text-base font-medium", isWorkoutDone ? "text-emerald-300" : "text-zinc-300")}>Workout</span>
                            </div>
                            <div>
                                <span className={cn("text-xl font-bold", isWorkoutDone ? "text-white" : "text-zinc-600")}>
                                    {isWorkoutDone ? workoutType : "Rest Day"}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {supplements.length === 0 && (
                <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                    <p className="text-xl font-medium text-zinc-400 mb-2">No supplements added yet.</p>
                    <p className="text-base">Go to "My Stack" to configure your daily routine.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map(section => {
                    const sectionSupplements = supplements.filter(s => s.timing === section.id || (section.id === 'any' && !['morning', 'pre-workout', 'intra-workout', 'post-workout', 'night'].includes(s.timing)));

                    if (sectionSupplements.length === 0) return null;

                    const Icon = section.icon;

                    return (
                        <div key={section.id} className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 animate-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
                                <div className={cn("p-2 rounded-xl border", section.color)}>
                                    <Icon size={18} />
                                </div>
                                <h3 className="font-bold text-zinc-200 text-base tracking-wide uppercase">{section.label}</h3>
                            </div>

                            <div className="space-y-3.5">
                                {sectionSupplements.map(sup => {
                                    const log = currentLogs.find(log => log.supplementId === sup.id);
                                    const isTaken = !!log;

                                    return (
                                        <button
                                            key={sup.id}
                                            onClick={() => handleSupClick(sup)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                                                isTaken
                                                    ? "bg-indigo-500/10 border-indigo-500/30"
                                                    : "bg-black/20 border-white/5 hover:border-white/10 hover:bg-black/40"
                                            )}
                                        >
                                            <div className="text-left relative z-10">
                                                <p className={cn("font-semibold text-base transition-colors", isTaken ? "text-indigo-300" : "text-zinc-200")}>{sup.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {isTaken ? (
                                                        <>
                                                            <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                                                                <Clock size={12} /> {log.time}
                                                            </span>
                                                            {log.context === 'with-food' && <Utensils size={12} className="text-blue-400" />}
                                                            {log.context === 'fasted' && <Ban size={12} className="text-rose-400" />}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{sup.dosage}</p>
                                                            {sup.foodReq === 'with-food' && (
                                                                <span className="text-xs flex items-center gap-1 text-blue-400/70 font-medium"><Utensils size={10} /> Food</span>
                                                            )}
                                                            {sup.foodReq === 'empty-stomach' && (
                                                                <span className="text-xs flex items-center gap-1 text-rose-400/70 font-medium"><Ban size={10} /> Fasted</span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                            </div>

                                            <div className={cn(
                                                "h-6 w-6 rounded-full border flex items-center justify-center transition-all duration-300 relative z-10",
                                                isTaken
                                                    ? "bg-indigo-500 border-indigo-500"
                                                    : "border-zinc-700 bg-zinc-900 group-hover:border-zinc-500"
                                            )}>
                                                {isTaken && <Check size={14} className="text-white stroke-[3px]" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <LogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                supplement={selectedSup}
                date={selectedDate}
                checkLog={handleLogSubmit}
            />

            <SleepModal
                isOpen={isSleepModalOpen}
                onClose={() => setIsSleepModalOpen(false)}
                currentSleep={currentLifestyle.sleepHours}
                onSave={updateLifestyle}
                date={selectedDate}
            />

            <WorkoutModal
                isOpen={isWorkoutModalOpen}
                onClose={() => setIsWorkoutModalOpen(false)}
                currentWorkout={currentLifestyle.workout}
                onSave={updateLifestyle}
                date={selectedDate}
            />
        </div>
    );
}
