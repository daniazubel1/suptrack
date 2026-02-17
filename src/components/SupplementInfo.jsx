import React, { useState } from 'react';
import { supplementDB } from '../data/supplementDB';
import { Search, Info, Clock, AlertTriangle, Pill, Check, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSup } from '../context/SupContext';

export default function SupplementInfo() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { supplements, addSupplement } = useSup();

    const categories = ['All', ...new Set(supplementDB.map(s => s.category))];

    const filteredSups = supplementDB.filter(sup => {
        const matchesSearch = sup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sup.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'All' || sup.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const isAdded = (name) => supplements.some(s => s.name.toLowerCase() === name.toLowerCase());

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="text-indigo-400" />
                    Supplement Info
                </h2>
                <p className="text-zinc-400 text-sm mt-1">
                    Detailed guide on dosages, timing, and benefits.
                </p>
            </div>

            {/* Search & Filter */}
            <div className="space-y-3">
                <div className="relative">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        placeholder="Search supplements or benefits..."
                        className="w-full min-w-0 bg-zinc-900 border border-white/5 rounded-xl py-3 pl-11 pr-5 text-base text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                selectedCategory === cat
                                    ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-300"
                                    : "bg-zinc-900 border-white/5 text-zinc-400 hover:bg-zinc-800"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                {filteredSups.map(sup => (
                    <div key={sup.id} className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-4 md:p-5 hover:border-white/10 transition-colors overflow-hidden">
                        <div className="flex justify-between items-start mb-3 gap-2">
                            <div className="min-w-0 flex-1">
                                <h3 className="text-lg font-bold text-zinc-100 break-words leading-tight">{sup.name}</h3>
                                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded mt-1 inline-block">
                                    {sup.category}
                                </span>
                            </div>
                            {isAdded(sup.name) && (
                                <span className="shrink-0 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full flex items-center gap-1">
                                    <Check size={12} /> In Stack
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-zinc-300 leading-relaxed mb-4 break-words">
                            {sup.description}
                        </p>

                        <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center gap-2 text-indigo-400 mb-1">
                                        <Pill size={14} />
                                        <span className="text-xs font-semibold">Dosage</span>
                                    </div>
                                    <p className="text-sm text-zinc-200 font-medium break-words">{sup.dosage || 'See label'}</p>
                                </div>
                                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                                        <Clock size={14} />
                                        <span className="text-xs font-semibold">Timing</span>
                                    </div>
                                    <p className="text-sm text-zinc-200 font-medium break-words">{sup.bestTime}</p>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="flex flex-wrap gap-1.5">
                                {sup.benefits.map((b, i) => (
                                    <span key={i} className="text-xs text-zinc-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                                        {b}
                                    </span>
                                ))}
                            </div>

                            {/* Warning */}
                            {sup.warning && (
                                <div className="flex items-start gap-2 text-xs text-amber-500/90 bg-amber-500/5 px-3 py-2.5 rounded-xl border border-amber-500/10 mt-2">
                                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                    <span>{sup.warning}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {filteredSups.length === 0 && (
                    <div className="col-span-full text-center py-10 text-zinc-500">
                        <Info size={40} className="mx-auto mb-3 opacity-20" />
                        <p>No supplements found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
