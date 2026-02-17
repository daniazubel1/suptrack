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

    // Notification Logic
    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications");
            return false;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // Initialize default granular settings if they don't exist
            setUserProfile(prev => ({
                ...prev,
                notifications: {
                    ...(prev.notifications || {}),
                    morning: prev.notifications?.morning || { enabled: true, time: "08:00" },
                    night: prev.notifications?.night || { enabled: true, time: "21:00" },
                    workout: prev.notifications?.workout || { enabled: false, time: "17:00" }
                }
            }));
            new Notification("Notifications Enabled", {
                body: "You can now customize your reminders in Profile.",
                icon: '/pwa-192x192.png'
            });
            return true;
        } else {
            return false;
        }
    };

    // Notification Scheduler
    useEffect(() => {
        // If no notifications object or permission not granted (implicit check via enabled states), skip
        if (!userProfile?.notifications) return;

        const checkReminders = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMin = now.getMinutes();
            const currentDay = now.getDay(); // 0 = Sun, 6 = Sat
            const todayStr = now.toISOString().split('T')[0];
            const logsToday = history[todayStr] || [];

            // Helper to parse "HH:MM"
            const parseTime = (timeStr) => {
                const [h, m] = (timeStr || "00:00").split(':').map(Number);
                return { h, m };
            };

            // Helper: Is now within 3 hours of target?
            const isTimeWindow = (targetTimeStr) => {
                const { h, m } = parseTime(targetTimeStr);
                const targetVal = h * 60 + m;
                const nowVal = currentHour * 60 + currentMin;
                return nowVal >= targetVal && nowVal < (targetVal + 180);
            };

            // Helper: Get missing supplements for a timing category
            const getMissingSups = (timingCategory) => {
                const targetSups = supplements.filter(s => s.timing === timingCategory);
                if (targetSups.length === 0) return [];
                return targetSups.filter(s => !logsToday.some(l => l.supplementId === s.id));
            };

            // 1. Morning Check
            const morningSettings = userProfile.notifications.morning;
            if (morningSettings?.enabled && isTimeWindow(morningSettings.time)) {
                if (morningSettings.lastRun !== todayStr) {
                    const missing = getMissingSups('morning');
                    if (missing.length > 0) {
                        const items = missing.map(s => s.name).join(', ');
                        new Notification("Morning Stack Reminder", {
                            body: `Missing: ${items}`,
                            icon: '/pwa-192x192.png'
                        });
                        // Update lastRun
                        setUserProfile(prev => ({
                            ...prev,
                            notifications: {
                                ...prev.notifications,
                                morning: { ...prev.notifications.morning, lastRun: todayStr }
                            }
                        }));
                    }
                }
            }

            // 2. Night Check
            const nightSettings = userProfile.notifications.night;
            if (nightSettings?.enabled && isTimeWindow(nightSettings.time)) {
                if (nightSettings.lastRun !== todayStr) {
                    const missing = getMissingSups('night');
                    if (missing.length > 0) {
                        const items = missing.map(s => s.name).join(', ');
                        new Notification("Night Stack Reminder", {
                            body: `Time to sleep! Missing: ${items}`,
                            icon: '/pwa-192x192.png'
                        });
                        setUserProfile(prev => ({
                            ...prev,
                            notifications: {
                                ...prev.notifications,
                                night: { ...prev.notifications.night, lastRun: todayStr }
                            }
                        }));
                    }
                }
            }

            // 3. Workout Check
            const workoutSettings = userProfile.notifications.workout;
            const workoutDays = userProfile.schedule?.workoutDays || [];

            // Only check if today is a workout day
            if (workoutSettings?.enabled && workoutDays.includes(currentDay) && isTimeWindow(workoutSettings.time)) {
                if (workoutSettings.lastRun !== todayStr) {
                    // Detect "Workout" or "Pre-workout" supplements (custom logic or timing='workout')
                    // Currently DB uses timing='morning'/'night'/'any'. 
                    // We might need to rely on 'bestTime' from DB or User defined timing. 
                    // For now, let's search for "Work" in timing or name/category? 
                    // Actually, let's look for supplements with timing='workout' (we need to add this option if not exists, 
                    // but for now user might have 'any'. Let's Assume user categorizes Pre-workouts as 'any' or we add 'workout' timing).

                    // Simple approach: Check for supplements containing "Creatine" or "Pre" or timing "workout" if we add it.
                    // BETTER: Let's assume user puts them in 'any' or strict 'workout' timing.
                    // For this MVP, let's filter for timing === 'workout'. We need to ensure AddSup allows this.
                    const missing = supplements.filter(s =>
                        (s.timing === 'workout' || s.name.toLowerCase().includes('creatine') || s.name.toLowerCase().includes('pre'))
                        && !logsToday.some(l => l.supplementId === s.id)
                    );

                    if (missing.length > 0) {
                        const items = missing.map(s => s.name).join(', ');
                        new Notification("Workout Fuel Reminder", {
                            body: `Crush your workout! Missing: ${items}`,
                            icon: '/pwa-192x192.png'
                        });
                        setUserProfile(prev => ({
                            ...prev,
                            notifications: {
                                ...prev.notifications,
                                workout: { ...prev.notifications.workout, lastRun: todayStr }
                            }
                        }));
                    }
                }
            }
        };

        const interval = setInterval(checkReminders, 60000); // Check every minute
        checkReminders(); // Run immediately on load

        return () => clearInterval(interval);
    }, [userProfile, supplements, history]);

    return (
        <SupContext.Provider value={{ supplements, history, lifestyle, userProfile, addSupplement, updateSupplement, deleteSupplement, toggleLog, refillSupplement, updateLifestyle, updateProfile, exportData, importData, requestNotificationPermission }}>
            {children}
        </SupContext.Provider>
    );
}

export function useSup() {
    return useContext(SupContext);
}
