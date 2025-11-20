import { Arena, ArenaId, CoachTone, ArenaReward } from '../types';

/**
 * Complete Arena System - PRD Specification
 * 8 Arenas representing the user's transformation journey
 */

export const ARENAS: Record<ArenaId, Arena> = {
    [ArenaId.DESPERTAR]: {
        id: ArenaId.DESPERTAR,
        name: 'El Despertar',
        description: 'No naces listo. Te haces listo.',
        trophyMin: 0,
        trophyMax: 99,
        coachTone: CoachTone.GUIDE,
        unlocksAt: 0,
        rewards: [
            { type: 'CARD', id: 'card_arranque', name: 'Carta: Arranque' },
            { type: 'RITUAL', id: 'ritual_basico', name: 'Ritual Básico' },
            { type: 'CHEST', id: 'chest_despertar', name: 'Cofre del Despertar' }
        ]
    },

    [ArenaId.DISCIPLINA]: {
        id: ArenaId.DISCIPLINA,
        name: 'La Disciplina Primaria',
        description: 'Aquí se construyen cimientos. Aquí se decide continuar.',
        trophyMin: 100,
        trophyMax: 299,
        coachTone: CoachTone.GUIDE,
        unlocksAt: 100,
        bossName: 'El Guardián de la Constancia',
        rewards: [
            { type: 'CARD', id: 'card_compromiso', name: 'Carta: Compromiso' },
            { type: 'CHEST', id: 'chest_disciplina', name: 'Cofre de Disciplina' }
        ]
    },

    [ArenaId.FOCO_ENERGIA]: {
        id: ArenaId.FOCO_ENERGIA,
        name: 'Foco y Energía',
        description: 'Aquí matas la dispersión. Aquí te defines bajo presión.',
        trophyMin: 300,
        trophyMax: 599,
        coachTone: CoachTone.FIRM,
        unlocksAt: 300,
        bossName: 'El Guardián del Foco',
        rewards: [
            { type: 'CARD', id: 'card_cierre_mental', name: 'Carta: Cierre Mental' },
            { type: 'RITUAL', id: 'peak_state_basic', name: 'Peak State Automático' },
            { type: 'CHEST', id: 'chest_foco', name: 'Cofre de Foco' }
        ]
    },

    [ArenaId.PODER_PERSONAL]: {
        id: ArenaId.PODER_PERSONAL,
        name: 'Poder Personal',
        description: 'Aquí mandas tú o mandan tus emociones.',
        trophyMin: 600,
        trophyMax: 999,
        coachTone: CoachTone.FIRM,
        unlocksAt: 600,
        bossName: 'El Guardián del Poder',
        rewards: [
            { type: 'CARD', id: 'card_identidad_nivel_1', name: 'Carta Legendaria Nivel 1' },
            { type: 'CHEST', id: 'chest_poder', name: 'Cofre Poder Personal' },
            { type: 'RITUAL', id: 'reprogramacion_mental', name: 'Reprogramación Mental Avanzada' }
        ]
    },

    [ArenaId.EJECUCION]: {
        id: ArenaId.EJECUCION,
        name: 'Ejecución Profesional',
        description: 'Sueños sin ejecución son fantasías. Aquí se ejecuta.',
        trophyMin: 1000,
        trophyMax: 1499,
        coachTone: CoachTone.FIRM,
        unlocksAt: 1000,
        bossName: 'El Espectro de la Procrastinación',
        rewards: [
            { type: 'CARD', id: 'card_tarea_nuclear', name: 'Carta: Tarea Nuclear' },
            { type: 'CARD', id: 'card_ritual_prioridad', name: 'Carta: Ritual de Prioridad' },
            { type: 'CHEST', id: 'chest_ejecucion', name: 'Cofre de Ejecución' }
        ]
    },

    [ArenaId.PRESENCIA]: {
        id: ArenaId.PRESENCIA,
        name: 'Presencia y Carisma',
        description: 'Tu energía entra al cuarto antes que tú.',
        trophyMin: 1500,
        trophyMax: 2199,
        coachTone: CoachTone.BEAST,
        unlocksAt: 1500,
        bossName: 'La Sombra de la Validación',
        rewards: [
            { type: 'CARD', id: 'card_frame_inquebrantable', name: 'Carta: Frame Inquebrantable' },
            { type: 'RITUAL', id: 'presencia_social', name: 'Entrenamiento de Presencia' },
            { type: 'CHEST', id: 'chest_presencia', name: 'Cofre de Presencia' }
        ]
    },

    [ArenaId.MONSTRUO]: {
        id: ArenaId.MONSTRUO,
        name: 'El Monstruo',
        description: 'Aquí juegan los que ya no negocian consigo mismos.',
        trophyMin: 2200,
        trophyMax: 2999,
        coachTone: CoachTone.BEAST,
        unlocksAt: 2200,
        bossName: 'El Guardián del Dolor',
        rewards: [
            { type: 'CARD', id: 'card_modo_bestia_real', name: 'Carta: Modo Bestia Real' },
            { type: 'CHEST', id: 'chest_legendary', name: 'Cofre Legendario' },
            { type: 'BOOSTER', id: 'booster_beast', name: 'Ritual Beast Mejorado' }
        ]
    },

    [ArenaId.LEYENDA]: {
        id: ArenaId.LEYENDA,
        name: 'La Leyenda',
        description: 'Este no es un nivel. Es un legado.',
        trophyMin: 3000,
        trophyMax: 999999,
        coachTone: CoachTone.LEGENDARY,
        unlocksAt: 3000,
        bossName: 'Tu Yo del Futuro',
        rewards: [
            { type: 'CARD', id: 'card_inevitabilidad', name: 'Carta: Inevitabilidad' },
            { type: 'CHEST', id: 'chest_divino', name: 'Cofre Divino' },
            { type: 'RITUAL', id: 'modo_leyenda', name: 'Modo Leyenda' }
        ]
    }
};

/**
 * Get arena based on trophy count
 */
export function getArenaByTrophies(trophies: number): Arena {
    const arenas = Object.values(ARENAS);

    for (const arena of arenas) {
        if (trophies >= arena.trophyMin && trophies <= arena.trophyMax) {
            return arena;
        }
    }

    // Fallback to Arena 1 if something goes wrong
    return ARENAS[ArenaId.DESPERTAR];
}

/**
 * Get next arena
 */
export function getNextArena(currentArenaId: ArenaId): Arena | null {
    const arenaOrder = [
        ArenaId.DESPERTAR,
        ArenaId.DISCIPLINA,
        ArenaId.FOCO_ENERGIA,
        ArenaId.PODER_PERSONAL,
        ArenaId.EJECUCION,
        ArenaId.PRESENCIA,
        ArenaId.MONSTRUO,
        ArenaId.LEYENDA
    ];

    const currentIndex = arenaOrder.indexOf(currentArenaId);
    if (currentIndex === -1 || currentIndex === arenaOrder.length - 1) {
        return null; // Already at highest arena
    }

    return ARENAS[arenaOrder[currentIndex + 1]];
}

/**
 * Calculate trophy multiplier based on streak
 */
export function getTrophyMultiplier(streakDays: number): number {
    if (streakDays >= 30) return 1.50;
    if (streakDays >= 10) return 1.30;
    if (streakDays >= 5) return 1.20;
    if (streakDays >= 2) return 1.10;
    return 1.0;
}

/**
 * Calculate XP multiplier based on various factors
 */
export function getXPMultiplier(
    streakDays: number,
    peakStateUsed: boolean,
    speedBonus: boolean
): number {
    let multiplier = 1.0;

    // Streak multiplier
    if (streakDays >= 30) multiplier += 0.50;
    else if (streakDays >= 10) multiplier += 0.30;
    else if (streakDays >= 5) multiplier += 0.20;
    else if (streakDays >= 2) multiplier += 0.10;

    // Peak State bonus
    if (peakStateUsed) multiplier += 0.10;

    // Speed bonus (completed card quickly)
    if (speedBonus) multiplier += 0.15;

    return multiplier;
}
