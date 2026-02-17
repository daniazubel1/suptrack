import React from 'react';
import { LayoutDashboard, Pill, Calendar, BarChart, Settings, LogOut, User, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout({ children, activeTab, onTabChange }) {
    const navItems = [
        { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
        { id: 'supplements', label: 'My Stack', icon: Pill },
        { id: 'supinfo', label: 'Sup Info', icon: BookOpen },
        { id: 'analytics', label: 'Stats', icon: BarChart },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 flex overflow-x-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl h-screen sticky top-0">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-2xl font-bold bg-gradient-to-tr from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Suptrack
                    </h1>
                    <p className="text-xs text-zinc-500 mt-1 font-medium tracking-wide">DAILY OPTIMIZATION</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                                    isActive
                                        ? "bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                                        : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                                )}
                            >
                                <Icon size={20} className={cn("transition-colors", isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                                {item.label}
                            </button>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => onTabChange('profile')}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/5 w-full hover:bg-white/5 transition-colors text-left group"
                    >
                        <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors">
                            <User size={20} className="text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">My Profile</p>
                            <p className="text-xs text-zinc-500 truncate">View Stats</p>
                        </div>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 pb-24 md:pb-0 relative min-h-[100dvh]">
                {/* Mobile Header */}
                <header className="md:hidden p-6 sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-lg border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-tr from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                Suptrack
                            </h1>
                            <p className="text-xs text-zinc-500 mt-0.5 font-medium tracking-wide">DAILY OPTIMIZATION</p>
                        </div>
                        <button
                            onClick={() => onTabChange('profile')}
                            className="h-9 w-9 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 active:scale-95 transition-transform"
                        >
                            <User size={18} className="text-indigo-400" />
                        </button>
                    </div>
                </header>

                <div className="p-4 md:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
                    <div className="flex justify-around items-center h-16 px-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onTabChange(item.id)}
                                    className={cn(
                                        "flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative group",
                                        isActive ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    {isActive && (
                                        <span className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                    )}
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={cn("transition-transform duration-300", isActive && "scale-110 -translate-y-0.5")} />
                                    <span className={cn("text-[10px] mt-1 font-medium transition-opacity duration-300", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </main>
        </div>
    );
}
