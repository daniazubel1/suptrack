import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { enrichSupplement } from '../data/supplementDB';

const SupContext = createContext();

export function SupProvider({ children }) {
    const [supplements, setSupplements] = useLocalStorage('suptrack-supplements', []);
    const [history, setHistory] = useLocalStorage('suptrack-history', {});
    const [lifestyle, setLifestyle] = useLocalStorage('suptrack-lifestyle', {});
    const [userProfile, setUserProfile] = useLocalStorage('suptrack-profile', {
        name: 'Guest User',
        age: 30,
        gender: 'male',
        height: 175, // cm
        weight: 75, // kg
        activityLevel: 'moderate', // sedentary, light, moderate, active, very_active
        goal: 'health',
        achievements: {} // { 'first_step': '2024-02-14T10:00:00.000Z' }
    });
    // lifestyle: { "YYYY-MM-DD": { sleepHours: 7.5, workout: { type: "Gym", duration: 60 } } }

    // Auto-enrich data on load
    useEffect(() => {
        setSupplements(prevSups => {
            let hasChanges = false;
            const enrichedSups = prevSups.map(sup => {
                if (!sup.description || !sup.benefits) {
                    const enriched = enrichSupplement(sup);
                    if (enriched.description !== sup.description) {
                        hasChanges = true;
                        return enriched;
                    }
                }
                return sup;
            });
            return hasChanges ? enrichedSups : prevSups;
        });
    }, []);

    const addSupplement = (supplement) => {
        const enriched = enrichSupplement(supplement);
        setSupplements((prev) => [...prev, { ...enriched, id: crypto.randomUUID() }]);
    };

    const updateSupplement = (id, updatedData) => {
        const current = supplements.find(s => s.id === id);
        let dataToSave = updatedData;
        if (current && current.name !== updatedData.name) {
            dataToSave = enrichSupplement(updatedData);
        }
        setSupplements((prev) => prev.map((sup) => (sup.id === id ? { ...sup, ...dataToSave } : sup)));
    };

    const deleteSupplement = (id) => {
        setSupplements((prev) => prev.filter((sup) => sup.id !== id));
    };

    // Updated to support detailed logging and Inventory Tracking
    const toggleLog = (date, supplementId, details = null) => {
        // 1. Update History
        setHistory((prev) => {
            const dayLogs = prev[date] || [];
            const existingLogIndex = dayLogs.findIndex((log) => log.supplementId === supplementId);

            if (existingLogIndex >= 0) {
                // Remove if already taken (toggle off) -> Increment Inventory
                const newDayLogs = [...dayLogs];
                newDayLogs.splice(existingLogIndex, 1);

                // Update Inventory (Increment)
                setSupplements(prevSups =>
                    prevSups.map(sup => {
                        if (sup.id === supplementId && sup.servingsLeft !== undefined) {
                            return { ...sup, servingsLeft: sup.servingsLeft + 1 };
                        }
                        return sup;
                    })
                );

                return { ...prev, [date]: newDayLogs };
            } else {
                // Add log with details -> Decrement Inventory
                // Update Inventory (Decrement)
                setSupplements(prevSups =>
                    prevSups.map(sup => {
                        if (sup.id === supplementId && sup.servingsLeft !== undefined && sup.servingsLeft > 0) {
                            return { ...sup, servingsLeft: sup.servingsLeft - 1 };
                        }
                        return sup;
                    })
                );

                return {
                    ...prev,
                    [date]: [...dayLogs, {
                        supplementId,
                        time: details?.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                        context: details?.context || 'with-food',
                        status: 'taken'
                    }]
                };
            }
        });
    };

    const refillSupplement = (id) => {
        setSupplements(prev => prev.map(sup => {
            if (sup.id === id && sup.servingsPerContainer) {
                return { ...sup, servingsLeft: sup.servingsPerContainer };
            }
            return sup;
        }));
    };

    const updateLifestyle = (date, type, value) => {
        setLifestyle(prev => ({
            ...prev,
            [date]: {
                ...prev[date],
                [type]: value
            }
        }));
    };

    const updateProfile = (data) => {
        setUserProfile(prev => ({ ...prev, ...data }));
    };

    const exportData = () => {
        const data = {
            supplements,
            history,
            lifestyle,
            userProfile,
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    };

    const importData = (jsonString) => {
        try {
            const data = JSON.parse(jsonString);

            let importedSups = [];

            // Handle raw array (legacy/manual export)
            if (Array.isArray(data)) {
                importedSups = data;
            } else if (data.supplements) {
                importedSups = data.supplements;
                if (data.history) setHistory(data.history);
                if (data.lifestyle) setLifestyle(data.lifestyle);
                if (data.userProfile) setUserProfile(data.userProfile);
            }

            if (importedSups.length > 0) {
                // Fix known data issues (e.g. bad copy-paste descriptions)
                const cleanSups = importedSups.map(sup => {
                    // Check if Ashwagandha has Omega 3 description (fatty acids)
                    if (sup.name.toLowerCase().includes('ashwagandha') && sup.description && sup.description.toLowerCase().includes('fatty acids')) {
                        // Force re-enrich for broken Ashwagandha
                        const fixed = enrichSupplement({ ...sup, description: '', benefits: [] });
                        return fixed;
                    }
                    return sup;
                });
                setSupplements(cleanSups);
                return { success: true, count: cleanSups.length };
            }

            return { success: false, error: "No supplements found in data." };
        } catch (e) {
            console.error("Import failed:", e);
            return { success: false, error: e.message };
        }
    };

    // Gamification Logic
    const checkAchievements = (currentHistory, currentSupplements, currentProfile) => {
        const newUnlocks = {};
        const now = new Date();
        const existingUnlocks = currentProfile.achievements || {};

        // 1. First Step
        if (!existingUnlocks['first_step']) {
            const hasAnyLog = Object.values(currentHistory).some(day => day.length > 0);
            if (hasAnyLog) newUnlocks['first_step'] = now.toISOString();
        }

        // 2. Supp Master (5+ supplements)
        if (!existingUnlocks['supp_master']) {
            if (currentSupplements.length >= 5) newUnlocks['supp_master'] = now.toISOString();
        }

        // 3. Early Bird (Morning stack before 9am)
        if (!existingUnlocks['early_bird']) {
            const todayStr = now.toISOString().split('T')[0];
            const morningSups = currentSupplements.filter(s => s.timing === 'morning');
            if (morningSups.length > 0) {
                const todaysLogs = currentHistory[todayStr] || [];
                const allMorningTaken = morningSups.every(s => todaysLogs.some(l => l.supplementId === s.id));
                const currentHour = now.getHours();

                if (allMorningTaken && currentHour < 9) {
                    newUnlocks['early_bird'] = now.toISOString();
                }
            }
        }

        // 4. Night Owl (Night stack)
        if (!existingUnlocks['night_owl']) {
            const todayStr = now.toISOString().split('T')[0];
            const nightSups = currentSupplements.filter(s => s.timing === 'night');
            if (nightSups.length > 0) {
                const todaysLogs = currentHistory[todayStr] || [];
                const allNightTaken = nightSups.every(s => todaysLogs.some(l => l.supplementId === s.id));

                if (allNightTaken) {
                    newUnlocks['night_owl'] = now.toISOString();
                }
            }
        }

        // Apply Unlocks
        if (Object.keys(newUnlocks).length > 0) {
            setUserProfile(prev => ({
                ...prev,
                achievements: { ...(prev.achievements || {}), ...newUnlocks }
            }));
            // In a real app, we'd trigger a Toast here. For now, the UI will just update.
            // console.log("New Achievement Unlocked!", newUnlocks);
        }
    };

    // Data Migration: Ensure achievements object exists
    useEffect(() => {
        if (userProfile && !userProfile.achievements) {
            setUserProfile(prev => ({ ...prev, achievements: {} }));
        }
    }, [userProfile, setUserProfile]);

    // Trigger checks on key actions
    useEffect(() => {
        const timeout = setTimeout(() => {
            checkAchievements(history, supplements, userProfile);
        }, 1000); // Debounce check
        return () => clearTimeout(timeout);
    }, [history, supplements]); // Re-run when history/supplements change

    return (
        <SupContext.Provider value={{ supplements, history, lifestyle, userProfile, addSupplement, updateSupplement, deleteSupplement, toggleLog, refillSupplement, updateLifestyle, updateProfile, exportData, importData }}>
            {children}
        </SupContext.Provider>
    );
}

export function useSup() {
    return useContext(SupContext);
}
