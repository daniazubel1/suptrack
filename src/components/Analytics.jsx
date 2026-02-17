import React, { useState } from 'react';
import { useSup } from '../context/SupContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { subDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getHours } from 'date-fns';
import { Activity, BedDouble, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Analytics() {
    const { supplements, history, lifestyle } = useSup();
    const [view, setView] = useState('weekly');

    const colors = ['#818cf8', '#34d399', '#f472b6', '#fbbf24', '#60a5fa', '#a78bfa', '#f87171', '#fb923c'];

    // 1. Prepare Last 7 Days Data
    const getLast7DaysData = () => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayLogs = history[dateStr] || [];
            const dayLifestyle = lifestyle[dateStr] || { sleepHours: 0 };

            // Base data
            const dayData = {
                name: format(date, 'EEE'), // Mon, Tue
                fullDate: dateStr,
                sleep: dayLifestyle.sleepHours || 0,
                workout: dayLifestyle.workout
            };

            // Add status for each supplement (1 for taken, 0 for not)
            supplements.forEach(sup => {
                const isTaken = dayLogs.some(log => log.supplementId === sup.id);
                dayData[sup.id] = isTaken ? 1 : 0;
            });

            // Still calculate avg consistency for the summary card
            const consistency = supplements.length > 0
                ? Math.round((dayLogs.length / supplements.length) * 100)
                : 0;
            dayData.consistency = consistency;

            data.push(dayData);
        }
        return data;
    };

    const getWeeklyData = getLast7DaysData; // Alias for clarity
    const weeklyData = getLast7DaysData();

    // 2. Monthly Data (Last 30 Days)
    const getMonthlyData = () => {
        const data = [];
        for (let i = 29; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayLogs = history[dateStr] || [];
            const dayLifestyle = lifestyle[dateStr] || { sleepHours: 0 };

            const dayData = {
                name: format(date, 'd'),
                fullDate: dateStr,
                sleep: dayLifestyle.sleepHours || 0,
                workout: dayLifestyle.workout
            };

            supplements.forEach(sup => {
                const isTaken = dayLogs.some(log => log.supplementId === sup.id);
                dayData[sup.id] = isTaken ? 1 : 0;
            });

            dayData.consistency = supplements.length > 0
                ? Math.round((dayLogs.length / supplements.length) * 100)
                : 0;

            data.push(dayData);
        }
        return data;
    };

    // 3. Daily Data (Hourly logs for Today)
    const getDailyData = () => {
        const data = [];
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const todaysLogs = history[todayStr] || [];

        for (let i = 0; i < 24; i++) {
            const hourLabel = `${i.toString().padStart(2, '0')}:00`;
            const hourData = {
                name: i.toString(),
                fullLabel: hourLabel,
                count: 0 // Keep total count for potential usage
            };

            todaysLogs.forEach(log => {
                if (log.time) {
                    const logHour = parseInt(log.time.split(':')[0], 10);
                    if (logHour === i) {
                        hourData.count++;
                        // Add supplement to stack
                        hourData[log.supplementId] = 1;
                    }
                }
            });

            data.push(hourData);
        }
        return data;
    };

    let chartData = [];
    if (view === 'weekly') chartData = weeklyData;
    if (view === 'monthly') chartData = getMonthlyData();
    if (view === 'daily') chartData = getDailyData();


    // 4. Supplement Breakdown (Global)
    const getSupPerformance = () => {
        const counts = {};
        Object.keys(history).forEach(date => {
            history[date].forEach(log => {
                counts[log.supplementId] = (counts[log.supplementId] || 0) + 1;
            });
        });

        return supplements.map((sup, index) => ({
            name: sup.name,
            count: counts[sup.id] || 0,
            color: colors[index % colors.length]
        })).sort((a, b) => b.count - a.count);
    };

    const supPerformance = getSupPerformance();

    // Custom Tooltip (Stacked)
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // Filter for items with value > 0 (actually taken in stack)
            const takenItems = payload.filter(p => p.value > 0 && p.dataKey !== 'sleep');

            // Access raw data from the first payload item
            const data = payload[0]?.payload || {};
            const { sleep, workout } = data;

            const dateLabel = view === 'daily'
                ? `Hour: ${label}:00`
                : data.fullDate || label;

            return (
                <div className="bg-zinc-900 border border-white/10 p-3 rounded-xl shadow-xl min-w-[200px]">
                    <p className="text-zinc-400 text-xs mb-2 border-b border-white/5 pb-1">{dateLabel}</p>

                    <div className="space-y-1">
                        <p className="text-xs text-indigo-400 font-medium mb-1">Supplements:</p>
                        {takenItems.length > 0 ? (
                            takenItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.fill }} />
                                    <span className="text-white text-xs">{item.name}</span>
                                </div>
                            ))
                        ) : (
                            <span className="text-zinc-500 text-xs italic">None taken</span>
                        )}

                        {view !== 'daily' && (
                            <div className="pt-2 mt-2 border-t border-white/5 space-y-1">
                                {sleep > 0 && (
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1.5 text-emerald-400">
                                            <BedDouble size={12} />
                                            <span className="text-xs font-medium">Sleep</span>
                                        </div>
                                        <span className="text-white text-xs font-bold">{sleep}h</span>
                                    </div>
                                )}
                                {workout && (
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1.5 text-orange-400">
                                            <Activity size={12} />
                                            <span className="text-xs font-medium">Workout</span>
                                        </div>
                                        <span className="text-white text-xs font-bold capitalize">
                                            {typeof workout === 'string' ? workout : (workout.type || 'Yes')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };





    return (
        <div className="space-y-8 pb-20">
            {/* View Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">Analytics</h2>
                <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5 w-full md:w-auto">
                    {['daily', 'weekly', 'monthly'].map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={cn(
                                "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                                view === v ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Cards */}
            {view !== 'daily' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2 text-indigo-400">
                            <TrendingUp size={20} />
                            <span className="text-sm font-medium">Avg Consistency</span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {Math.round(chartData.reduce((acc, curr) => acc + (curr.consistency || 0), 0) / chartData.length)}%
                        </p>
                        <p className="text-xs text-zinc-500 capitalize">{view} Avg</p>
                    </div>
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                            <BedDouble size={20} />
                            <span className="text-sm font-medium">Avg Sleep</span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {(chartData.reduce((acc, curr) => acc + (curr.sleep || 0), 0) / chartData.length).toFixed(1)} <span className="text-sm font-normal text-zinc-500">hrs</span>
                        </p>
                        <p className="text-xs text-zinc-500 capitalize">{view} Avg</p>
                    </div>
                </div>
            )}

            {/* Main Chart */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 md:p-6">
                <h3 className="text-lg font-semibold text-white mb-6 capitalize">{view} Activity</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#71717a"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                interval={view === 'monthly' ? 2 : 0}
                            />
                            <YAxis
                                stroke="#71717a"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {/* Legend Removed as requested */}

                            {/* Stacked Bars for each Supplement */}
                            {supplements.map((sup, index) => (
                                <Bar
                                    key={sup.id}
                                    dataKey={sup.id}
                                    name={sup.name}
                                    stackId="a"
                                    fill={colors[index % colors.length]}
                                    radius={view === 'daily' ? [2, 2, 2, 2] : [0, 0, 0, 0]} // Slight radius for visual separation if needed
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Sleep Chart - Only for Weekly/Monthly */}
            {view !== 'daily' && (
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Sleep Trends</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} domain={[4, 12]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="sleep" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Supplement Breakdown */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Top Supplements</h3>
                <div className="space-y-4">
                    {supPerformance.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <span className="text-sm text-zinc-400 w-32 truncate">{item.name}</span>
                            <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${(item.count / 30) * 100}%`, backgroundColor: colors[index % colors.length] }}
                                />
                            </div>
                            <span className="text-xs text-zinc-500 w-12 text-right">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
