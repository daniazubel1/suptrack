import React from 'react';
import { useSup } from '../context/SupContext';
import { cn } from '../lib/utils';
import { Check, X } from 'lucide-react';

export default function History() {
    const { supplements, history } = useSup();

    // Generate last 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const getDayConsistency = (date) => {
        if (supplements.length === 0) return 0;
        const logs = history[date] || [];
        // Count unique supplements taken that day (in case of duplicates, though logic prevents it)
        const takenCount = new Set(logs.map(l => l.supplementId)).size;
        // Calculate percentage based on current supplements (Note: this is a slight inaccuracy if history changes, but good enough for MVP)
        return Math.round((takenCount / supplements.length) * 100);
    };

    return (
        <div className="space-y-8 pb-20">
            <h2 className="text-2xl font-bold text-white">History</h2>

            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 overflow-x-auto">
                <h3 className="text-sm font-medium text-zinc-400 mb-4">Last 7 Days Consistency</h3>
                <div className="flex justify-between items-end gap-2 min-w-[280px]">
                    {dates.map(date => {
                        const consistency = getDayConsistency(date);
                        const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                        const isToday = date === new Date().toISOString().split('T')[0];

                        return (
                            <div key={date} className="flex flex-col items-center gap-2 flex-1">
                                <div className="relative w-full flex justify-center h-32 items-end group">
                                    <div
                                        className={cn(
                                            "w-full max-w-[12px] rounded-full transition-all duration-500",
                                            consistency === 100 ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" :
                                                consistency > 50 ? "bg-indigo-500/60" :
                                                    consistency > 0 ? "bg-indigo-500/30" : "bg-zinc-800"
                                        )}
                                        style={{ height: `${Math.max(consistency, 5)}%` }}
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 z-10">
                                        {consistency}%
                                    </div>
                                </div>
                                <span className={cn("text-xs font-medium", isToday ? "text-white" : "text-zinc-600")}>
                                    {dayLabel}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Daily Details</h3>
                {dates.slice().reverse().map(date => {
                    const logs = history[date] || [];
                    const consistency = getDayConsistency(date);

                    return (
                        <div key={date} className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-zinc-300 font-medium">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full",
                                    consistency === 100 ? "bg-emerald-500/10 text-emerald-400" :
                                        consistency > 0 ? "bg-amber-500/10 text-amber-400" : "bg-zinc-800 text-zinc-500"
                                )}>{consistency}%</span>
                            </div>
                            {logs.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {logs.map(log => {
                                        const sup = supplements.find(s => s.id === log.supplementId);
                                        if (!sup) return null; // Supplement might have been deleted
                                        return (
                                            <span key={log.supplementId} className="text-xs bg-black/20 text-zinc-400 px-2 py-1 rounded border border-white/5">
                                                {sup.name}
                                            </span>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-600 italic">No activity recorded.</p>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
