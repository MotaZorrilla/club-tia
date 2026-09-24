export interface User {
    id: number;
    name: string;
    email: string;
    role: 'alumno' | 'colaborador' | 'facilitador';
    grade?: string;
    section?: string;
    specialty?: string;
    avatar: string;
    avatar_emoji: string;
    xp_points: number;
    level: number;
    rank: string;
    badges: string[];
    created_at?: string;
}

export interface PollOption {
    id: string;
    text: string;
    emoji: string;
    color: string;
    votes?: number;
    percentage?: number;
}

export interface PollStats {
    id: number;
    question: string;
    category?: string;
    total_votes: number;
    options: Array<{
        id: string;
        text: string;
        emoji: string;
        color: string;
        votes: number;
        percentage: number;
    }>;
}

export interface Poll {
    id: number;
    question: string;
    category?: string;
    options: PollOption[];
    stats?: PollStats | null;
}

export interface GameRound {
    id: number;
    type: string;
    prompt: string;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

export interface Lesson {
    id: number;
    island_number: number;
    slug: string;
    title: string;
    subtitle: string;
    icon: string;
    badge_name: string;
    is_unlocked: boolean;
    xp_reward: number;
    duration_minutes: number;
    description: string;
    content?: {
        game_rounds?: GameRound[];
    };
}

export interface ClubSettings {
    mision: string;
    vision: string;
    bienvenida: string;
    valores: string[];
}

export interface SharedProps {
    auth: {
        user: User | null;
    };
    flash: {
        success?: string;
        error?: string;
        info?: string;
    };
    available_avatars: Array<{
        emoji: string;
        name: string;
    }>;
    [key: string]: any;
}
