import React, { useState, useEffect } from 'react';
import { useSup } from '../context/SupContext';
import { User, Activity, Droplets, Scale, Ruler, Save, Sparkles, Plus, Check, X, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { supplementDB } from '../data/supplementDB';
import { ACHIEVEMENTS } from '../data/achievements';

export default function Profile() {
    const { userProfile, updateProfile, addSupplement, deleteSupplement, supplements } = useSup();

    const [formData, setFormData] = useState(userProfile);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setFormData(userProfile);
    }, [userProfile]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSave = () => {
        updateProfile(formData);
        setIsEditing(false);
    };

    // Calculations
    const calculateBMI = () => {
        if (!formData.height || !formData.weight) return 0;
        const h = formData.height / 100; // cm to m
        return (formData.weight / (h * h)).toFixed(1);
    };

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
        if (bmi < 25) return { label: 'Normal', color: 'text-emerald-400' };
        if (bmi < 30) return { label: 'Overweight', color: 'text-amber-400' };
        return { label: 'Obese', color: 'text-rose-400' };
    };

    const calculateWater = () => {
        if (!formData.weight) return 0;
        // Basic rule: 35ml per kg
        return (formData.weight * 0.035).toFixed(1);
    };

    const calculateBMR = () => {
        // Mifflin-St Jeor Equation
        if (!formData.weight || !formData.height || !formData.age) return 0;
        let bmr = (10 * formData.weight) + (6.25 * formData.height) - (5 * formData.age);
        bmr += formData.gender === 'male' ? 5 : -161;

        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };

        return Math.round(bmr * (activityMultipliers[formData.activityLevel] || 1.2));
    };


    const bmi = calculateBMI();
    const bmiCat = getBMICategory(bmi);
    const water = calculateWater();
    const tdee = calculateBMR();

    // Recommendation Engine
    const getRecommendations = () => {
        const recs = [];
        const { age, gender, goal } = formData;

        // Foundation
        recs.push({ name: 'Vitamin D3', reason: 'Essential for immune health and bone density.', benefits: ['Immunity', 'Bones'] });
        recs.push({ name: 'Multivitamin', reason: 'Covers nutritional gaps in daily diet.', benefits: ['General Health'] });
        recs.push({ name: 'Magnesium', reason: 'Supports sleep quality and muscle relaxation.', benefits: ['Sleep', 'Recovery'] });

        // Goal Based
        if (goal === 'muscle_gain') {
            recs.push({ name: 'Creatine Monohydrate', reason: 'Proven to increase muscle mass and strength.', benefits: ['Strength', 'Muscle'] });
            recs.push({ name: 'Whey Protein', reason: 'Fast-absorbing protein for post-workout recovery.', benefits: ['Recovery', 'Muscle'] });
        }

        if (goal === 'weight_loss') {
            recs.push({ name: 'Green Tea Extract', reason: 'May support metabolism and fat oxidation.', benefits: ['Metabolism'] });
            recs.push({ name: 'L-Carnitine', reason: 'Helps transport fatty acids for energy.', benefits: ['Energy', 'Fat Loss'] });
        }

        if (goal === 'energy') {
            recs.push({ name: 'Vitamin B12', reason: 'Crucial for energy production.', benefits: ['Energy'] });
            recs.push({ name: 'Iron', reason: 'Vital for oxygen transport (consult doctor first).', benefits: ['Energy'] });
        }

        // Age/Gender Specific
        if (age > 40) {
            recs.push({ name: 'Omega-3 Fish Oil', reason: 'Supports heart, joint, and brain health.', benefits: ['Heart', 'Joints'] });
            recs.push({ name: 'CoQ10', reason: 'Supports cellular energy and heart health.', benefits: ['Heart', 'Energy'] });
        }

        if (gender === 'female' && age < 50) {
            // Iron is already in energy, but could be specific here too. 
            // Keeping it simple for now.
        }

        // Remove duplicates if any (by name)
        return recs.filter((v, i, a) => a.findIndex(v2 => (v2.name === v.name)) === i);
    };

    const recommendations = getRecommendations();

    const handleAddRec = (rec) => {
        const existingSup = supplements.find(s => s.name.toLowerCase() === rec.name.toLowerCase());

        if (existingSup) {
            // Remove if exists
            deleteSupplement(existingSup.id);
        } else {
            // Add if doesn't exist
            const dbSup = supplementDB.find(s => s.name.toLowerCase() === rec.name.toLowerCase());

            addSupplement({
                name: rec.name,
                brand: '',
                dosage: dbSup ? dbSup.dosage : '',
                type: 'pill',
                timing: dbSup && dbSup.bestTime === 'Morning' ? 'morning' : 'any',
                notes: 'Added from recommendations'
            });
        }
    };


    if (!userProfile || !formData) return <div className="p-8 text-center text-zinc-500">Loading Profile...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center bg-zinc-900 border border-white/5 p-6 rounded-3xl">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{isEditing ? 'Edit Profile' : formData.name}</h2>
                        <p className="text-zinc-400 text-sm capitalize">{formData.goal ? formData.goal.replace('_', ' ') : 'Health'}</p>
                    </div>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={cn(
                        "px-4 py-2 rounded-xl font-medium transition-all",
                        isEditing
                            ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                            : "bg-white/10 hover:bg-white/20 text-white"
                    )}
                >
                    {isEditing ? <span className="flex items-center gap-2"><Save size={18} /> Save</span> : 'Edit Profile'}
                </button>
            </div>

            {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/50 border border-white/5 p-6 rounded-3xl animate-in fade-in">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Full Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Height (cm)</label>
                            <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Weight (kg)</label>
                            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Activity Level</label>
                            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500">
                                <option value="sedentary">Sedentary (Office job)</option>
                                <option value="light">Light Exercise (1-2 days/week)</option>
                                <option value="moderate">Moderate Exercise (3-5 days/week)</option>
                                <option value="active">Active (6-7 days/week)</option>
                                <option value="very_active">Athlete (2x per day)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Goal</label>
                            <select name="goal" value={formData.goal || 'health'} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500">
                                <option value="health">General Health</option>
                                <option value="muscle_gain">Muscle Gain</option>
                                <option value="weight_loss">Weight Loss</option>
                                <option value="energy">Energy & Focus</option>
                            </select>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl">
                        <p className="text-zinc-500 text-xs mb-1">Height</p>
                        <p className="text-xl font-bold text-white flex items-baseline gap-1">
                            {formData.height} <span className="text-sm font-normal text-zinc-600">cm</span>
                        </p>
                    </div>
                    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl">
                        <p className="text-zinc-500 text-xs mb-1">Weight</p>
                        <p className="text-xl font-bold text-white flex items-baseline gap-1">
                            {formData.weight} <span className="text-sm font-normal text-zinc-600">kg</span>
                        </p>
                    </div>
                    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl">
                        <p className="text-zinc-500 text-xs mb-1">Activity</p>
                        <p className="text-lg font-bold text-white capitalize">{(formData.activityLevel || 'moderate').replace('_', ' ')}</p>
                    </div>
                    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl">
                        <p className="text-zinc-500 text-xs mb-1">Goal</p>
                        <p className="text-lg font-bold text-white capitalize">{(formData.goal || 'health').replace('_', ' ')}</p>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <h3 className="text-xl font-bold text-white mt-8">Health Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* BMI Card */}
                <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Scale size={64} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-zinc-400 font-medium mb-2">BMI Score</p>
                        <p className="text-4xl font-bold text-white mb-2">{bmi}</p>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/5 ${bmiCat.color} border border-white/5`}>
                            {bmiCat.label}
                        </div>
                    </div>
                </div>

                {/* Calories Card */}
                <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Activity size={64} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-zinc-400 font-medium mb-2">Daily Calories (Maintenance)</p>
                        <p className="text-4xl font-bold text-white mb-2">{tdee.toLocaleString()}</p>
                        <p className="text-xs text-zinc-500">Based on your activity level</p>
                    </div>
                </div>

                {/* Water Card */}
                <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Droplets size={64} className="text-blue-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-zinc-400 font-medium mb-2">Water Goal</p>
                        <p className="text-4xl font-bold text-blue-400 mb-2">{water}<span className="text-lg text-blue-500/60">L</span></p>
                        <p className="text-xs text-zinc-500">Minimum recommended daily intake</p>
                    </div>
                </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <div className="flex items-center gap-2 mb-6 relative z-10">
                    <Trophy className="text-yellow-400" size={24} />
                    <h2 className="text-xl font-bold text-white">Achievements</h2>
                    <span className="ml-auto text-xs font-medium text-zinc-500 bg-white/5 px-2 py-1 rounded-full">
                        {Object.keys(userProfile.achievements || {}).length} / {ACHIEVEMENTS.length} Unlocked
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                    {ACHIEVEMENTS.map(achievement => {
                        const isUnlocked = userProfile.achievements && userProfile.achievements[achievement.id];
                        const Icon = achievement.icon;

                        return (
                            <div
                                key={achievement.id}
                                className={cn(
                                    "p-4 rounded-2xl border transition-all flex flex-col items-center text-center gap-3 relative overflow-hidden group",
                                    isUnlocked
                                        ? "bg-zinc-900/50 border-white/10 hover:border-white/20"
                                        : "bg-black/20 border-white/5 opacity-50 grayscale"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-full mb-1 transition-transform group-hover:scale-110 duration-300",
                                    isUnlocked ? achievement.bg : "bg-white/5 text-zinc-600"
                                )}>
                                    <Icon size={24} className={isUnlocked ? achievement.color : "text-zinc-600"} />
                                </div>
                                <div>
                                    <h3 className={cn("font-bold text-sm mb-1", isUnlocked ? "text-zinc-200" : "text-zinc-500")}>
                                        {achievement.title}
                                    </h3>
                                    <p className="text-[10px] leading-tight text-zinc-500 hidden md:block">
                                        {achievement.description}
                                    </p>
                                </div>
                                {isUnlocked && (
                                    <div className="absolute inset-0 border-2 border-white/5 rounded-2xl pointer-events-none" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recommendations Section */}
            <div className="mt-12">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="text-amber-400" size={24} />
                    <h3 className="text-xl font-bold text-white">Recommended for You</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((rec, i) => {
                        const isAdded = supplements.some(s => s.name.toLowerCase() === rec.name.toLowerCase());
                        return (
                            <div key={i} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex justify-between items-center group">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-zinc-200">{rec.name}</h4>
                                        {isAdded && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">In Stack</span>}
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-2">{rec.reason}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {rec.benefits.map((b, bi) => (
                                            <span key={bi} className="text-[10px] text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">{b}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <button
                                        onClick={() => handleAddRec(rec)}
                                        className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center transition-all shadow-sm group-hover:scale-105 active:scale-95",
                                            isAdded
                                                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                                : "bg-zinc-800 hover:bg-indigo-600 text-zinc-400 hover:text-white"
                                        )}
                                    >
                                        {isAdded ? <Check size={20} className="group-hover:hidden" /> : <Plus size={24} />}
                                        {isAdded && <X size={20} className="hidden group-hover:block" />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
