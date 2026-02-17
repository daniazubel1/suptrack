import { Zap, Sunrise, Moon, Trophy, Target, Award, Flame, Star } from 'lucide-react';

export const ACHIEVEMENTS = [
    {
        id: 'first_step',
        title: 'First Step',
        description: 'Log your first supplement.',
        icon: Star,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
        id: 'streak_3',
        title: 'Momentum',
        description: 'Achieve a 3-day consistency streak.',
        icon: Flame,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10 border-orange-500/20'
    },
    {
        id: 'streak_7',
        title: 'Unstoppable',
        description: 'Achieve a 7-day consistency streak.',
        icon: Zap,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10 border-yellow-500/20'
    },
    {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Complete your morning stack before 9 AM.',
        icon: Sunrise,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Complete your night stack.',
        icon: Moon,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
        id: 'gym_rat',
        title: 'Gym Rat',
        description: 'Log a workout 3 days in a row.',
        icon: Trophy,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/20'
    },
    {
        id: 'perfect_week',
        title: 'Perfect Week',
        description: '100% adherence for 7 days straight.',
        icon: Award,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
        id: 'supp_master',
        title: 'Supp Master',
        description: 'Have 5 or more supplements in your stack.',
        icon: Target,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border-blue-500/20'
    }
];
