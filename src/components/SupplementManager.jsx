import React, { useState } from 'react';
import { useSup } from '../context/SupContext';
import { supplementDB } from '../data/supplementDB';
import { Plus, Trash2, Edit2, X, Check, Pill, GlassWater, Cookie, Search, Info, Utensils, Ban } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SupplementManager() {
    const { supplements, addSupplement, deleteSupplement, updateSupplement, refillSupplement } = useSup();
    const [activeTab, setActiveTab] = useState('stack'); // 'stack' or 'discover'
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        dosage: '',
        type: 'pill',
        timing: 'any',
        servingsPerContainer: '',
        servingsLeft: '',
        notes: ''
    });

    const resetForm = () => {
        setFormData({ name: '', brand: '', dosage: '', type: 'pill', timing: 'any', servingsPerContainer: '', servingsLeft: '', notes: '' });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSave = {
            ...formData,
            servingsPerContainer: formData.servingsPerContainer ? parseInt(formData.servingsPerContainer) : undefined,
            servingsLeft: (formData.servingsLeft !== undefined && formData.servingsLeft !== '')
                ? parseInt(formData.servingsLeft)
                : (formData.servingsPerContainer ? parseInt(formData.servingsPerContainer) : undefined)
        };

        if (editingId) {
            updateSupplement(editingId, dataToSave);
        } else {
            addSupplement(dataToSave);
        }
        resetForm();
        setActiveTab('stack');
    };

    const handleEdit = (sup) => {
        setFormData(sup);
        setEditingId(sup.id);
        setIsAdding(true);
        setActiveTab('stack');
    };

    const addFromDb = (dbSup) => {
        addSupplement({
            name: dbSup.name,
            brand: '',
            dosage: '',
            type: 'pill',
            timing: dbSup.bestTime === 'Morning' ? 'morning' : dbSup.bestTime === 'Night' ? 'night' : 'any',
            notes: ''
        });
        // Switch back to stack
        setActiveTab('stack');
    };

    const filteredDb = supplementDB.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6 pb-20">
            <div className="flex bg-zinc-900 p-1.5 rounded-xl border border-white/5">
                <button
                    onClick={() => setActiveTab('stack')}
                    className={cn("flex-1 py-3 text-base font-medium rounded-lg transition-all", activeTab === 'stack' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
                >
                    My Stack
                </button>
                <button
                    onClick={() => { setActiveTab('discover'); setIsAdding(false); }}
                    className={cn("flex-1 py-3 text-base font-medium rounded-lg transition-all", activeTab === 'discover' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
                >
                    Discover
                </button>
            </div>

            {activeTab === 'stack' && (
                <>
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-2xl font-bold text-white">Your Supplements</h2>
                        <button
                            onClick={() => {
                                if (isAdding) {
                                    resetForm();
                                } else {
                                    setIsAdding(true);
                                }
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-full transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            {isAdding ? <X size={24} /> : <Plus size={24} />}
                        </button>
                    </div>

                    {(isAdding || editingId) && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
                                <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
                                    <h3 className="text-xl font-bold text-white">
                                        {editingId ? 'Edit Supplement' : 'Add Supplement'}
                                    </h3>
                                    <button
                                        onClick={resetForm}
                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Name</label>
                                            <input
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-zinc-600 text-base"
                                                placeholder="e.g. Creatine Monohydrate"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                autoFocus
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Dosage</label>
                                                <input
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-zinc-600 text-base"
                                                    placeholder="e.g. 5g"
                                                    value={formData.dosage}
                                                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Timing</label>
                                                <select
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-base"
                                                    value={formData.timing}
                                                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                                                >
                                                    <option value="morning">Morning</option>
                                                    <option value="pre-workout">Pre-Workout</option>
                                                    <option value="intra-workout">Intra-Workout</option>
                                                    <option value="post-workout">Post-Workout</option>
                                                    <option value="night">Night</option>
                                                    <option value="any">Anytime</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Container Size (Full)</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-zinc-600 text-base"
                                                    placeholder="e.g. 60"
                                                    value={formData.servingsPerContainer}
                                                    onChange={(e) => setFormData({ ...formData, servingsPerContainer: e.target.value })}
                                                />
                                            </div>
                                            {editingId && (
                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Current Stock</label>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-zinc-600 text-base"
                                                        placeholder="Remaning..."
                                                        value={formData.servingsLeft ?? ''}
                                                        onChange={(e) => setFormData({ ...formData, servingsLeft: e.target.value })}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Type</label>
                                            <div className="flex gap-3">
                                                {['pill', 'powder', 'liquid', 'food'].map(type => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, type })}
                                                        className={cn(
                                                            "flex-1 py-3 rounded-lg text-sm font-medium border transition-all",
                                                            formData.type === type
                                                                ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                                                                : "bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5"
                                                        )}
                                                    >
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] text-base">
                                                {editingId ? 'Update Supplement' : 'Add to Stack'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {supplements.length === 0 && !isAdding && (
                            <div className="text-center py-10 text-zinc-500">
                                <Pill className="mx-auto mb-3 opacity-20" size={56} />
                                <p className="text-lg">Your stack is empty.</p>
                                <p className="text-base mt-2 text-indigo-400 cursor-pointer hover:underline" onClick={() => setActiveTab('discover')}>
                                    Browse recommendations
                                </p>
                            </div>
                        )}

                        {supplements.map((sup) => (
                            <div key={sup.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 group hover:border-white/10 transition-colors relative">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "h-14 w-14 rounded-full flex items-center justify-center border shrink-0",
                                            sup.type === 'pill' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                                sup.type === 'powder' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                                    "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                        )}>
                                            {sup.type === 'pill' && <Pill size={28} />}
                                            {sup.type === 'powder' && <Cookie size={28} />}
                                            {sup.type !== 'pill' && sup.type !== 'powder' && <GlassWater size={28} />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-zinc-100">{sup.name}</h3>
                                            <div className="text-sm text-zinc-400 flex flex-wrap gap-2.5 mt-1.5">
                                                <span className="bg-white/5 px-2 py-0.5 rounded flex items-center">{sup.dosage || 'N/A'}</span>
                                                <span className="bg-white/5 px-2 py-0.5 rounded flex items-center capitalize">{sup.timing}</span>
                                                {sup.servingsLeft !== undefined && (
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded flex items-center gap-1.5 border",
                                                        sup.servingsLeft <= 5
                                                            ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
                                                            : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                                    )}>
                                                        {sup.servingsLeft} left
                                                    </span>
                                                )}
                                                {sup.foodReq === 'with-food' && (
                                                    <span className="bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded flex items-center gap-1.5 border border-blue-500/20">
                                                        <Utensils size={14} /> Food
                                                    </span>
                                                )}
                                                {sup.foodReq === 'empty-stomach' && (
                                                    <span className="bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded flex items-center gap-1.5 border border-rose-500/20">
                                                        <Ban size={14} /> Fasted
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {(sup.servingsLeft !== undefined && sup.servingsLeft <= 5) && (
                                            <button
                                                onClick={() => refillSupplement(sup.id)}
                                                className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors"
                                            >
                                                Refill
                                            </button>
                                        )}
                                        <button onClick={() => handleEdit(sup)} className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full">
                                            <Edit2 size={20} />
                                        </button>
                                        <button onClick={() => deleteSupplement(sup.id)} className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-full">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Enriched Data Section */}
                                {(sup.description || (sup.benefits && sup.benefits.length > 0)) && (
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        {sup.description && <p className="text-base text-zinc-300 mb-3 leading-relaxed">{sup.description}</p>}
                                        {sup.benefits && (
                                            <div className="flex flex-wrap gap-2">
                                                {sup.benefits.map((b, i) => (
                                                    <span key={i} className="text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                                                        {b}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {sup.warning && (
                                            <div className="mt-3 text-sm text-amber-500/90 bg-amber-500/5 px-3 py-2 rounded-lg border border-amber-500/10 flex items-start gap-2">
                                                <Info size={16} className="shrink-0 mt-0.5" />
                                                {sup.warning}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'discover' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            placeholder="Search supplements..."
                            className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 pl-11 pr-5 text-base text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        {filteredDb.map(item => {
                            const isAdded = supplements.some(s => s.name.toLowerCase() === item.name.toLowerCase());
                            return (
                                <div key={item.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-zinc-200">{item.name}</h3>
                                            <span className="text-xs font-medium text-zinc-500 bg-white/5 px-2 py-0.5 rounded mt-1 inline-block">{item.category}</span>
                                        </div>
                                        {isAdded ? (
                                            <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                                <Check size={14} /> Added
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => addFromDb(item)}
                                                className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                                            >
                                                + Add
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {item.benefits.slice(0, 3).map((b, i) => (
                                            <span key={i} className="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded">
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
