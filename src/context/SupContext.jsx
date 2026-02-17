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
        goal: 'health'
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

    // Updated to support detailed logging
    const toggleLog = (date, supplementId, details = null) => {
        setHistory((prev) => {
            const dayLogs = prev[date] || [];
            const existingLogIndex = dayLogs.findIndex((log) => log.supplementId === supplementId);

            if (existingLogIndex >= 0) {
                // Remove if already taken (toggle off)
                const newDayLogs = [...dayLogs];
                newDayLogs.splice(existingLogIndex, 1);
                return { ...prev, [date]: newDayLogs };
            } else {
                // Add log with details
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

    return (
        <SupContext.Provider value={{ supplements, history, lifestyle, userProfile, addSupplement, updateSupplement, deleteSupplement, toggleLog, updateLifestyle, updateProfile, exportData, importData }}>
            {children}
        </SupContext.Provider>
    );
}

export function useSup() {
    return useContext(SupContext);
}
