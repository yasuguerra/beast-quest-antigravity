import { UserProfile, ChestType, CardRarity, Card, CardType } from '../types';
import { updateUserProfile } from '../services/firebase';
import { addToInventory } from '../services/firebase';

export interface RewardResult {
    gold: number;
    gems: number;
    cards: Card[];
}

export class RewardEngine {

    static getChestConfig(type: ChestType) {
        switch (type) {
            case ChestType.COMMON:
                return { goldMin: 50, goldMax: 150, gemsMin: 0, gemsMax: 5, cardCount: 3, rareChance: 0.1, epicChance: 0.0 };
            case ChestType.RARE:
                return { goldMin: 150, goldMax: 300, gemsMin: 5, gemsMax: 15, cardCount: 5, rareChance: 0.3, epicChance: 0.05 };
            case ChestType.EPIC:
                return { goldMin: 400, goldMax: 800, gemsMin: 20, gemsMax: 50, cardCount: 8, rareChance: 0.8, epicChance: 0.2 };
            case ChestType.LEGENDARY:
                return { goldMin: 1000, goldMax: 2500, gemsMin: 100, gemsMax: 250, cardCount: 12, rareChance: 1.0, epicChance: 0.5 };
            default:
                return { goldMin: 10, goldMax: 50, gemsMin: 0, gemsMax: 0, cardCount: 1, rareChance: 0.0, epicChance: 0.0 };
        }
    }

    static async openChest(user: UserProfile, chestType: ChestType): Promise<RewardResult> {
        const config = this.getChestConfig(chestType);

        // 1. Calculate Currency Rewards
        const gold = Math.floor(Math.random() * (config.goldMax - config.goldMin + 1)) + config.goldMin;
        const gems = Math.floor(Math.random() * (config.gemsMax - config.gemsMin + 1)) + config.gemsMin;

        // 2. Generate Cards (Simplified for now - just generating mock cards based on rarity)
        const cards: Card[] = [];
        for (let i = 0; i < config.cardCount; i++) {
            const roll = Math.random();
            let rarity = CardRarity.COMMON;

            if (roll < config.epicChance) rarity = CardRarity.EPIC;
            else if (roll < config.rareChance) rarity = CardRarity.RARE;

            // In a real app, we'd fetch card templates from a DB. Here we mock.
            cards.push({
                id: `card_${Date.now()}_${i}`,
                title: `${rarity} Power`,
                description: "A powerful boost for your journey.",
                type: CardType.HABIT, // Default
                rarity: rarity,
                energyCost: 1,
                trophyReward: 5,
                durationMinutes: 10,
                xpReward: 10,
                goldReward: 5,
                isCompleted: false
            } as Card);
        }

        // 3. Persist Rewards
        // Update User Profile (Gold/Gems)
        await updateUserProfile(user.uid, {
            gold: user.gold + gold,
            gems: user.gems + gems
        });

        // Add Cards to Inventory
        await addToInventory(user.uid, cards);

        return { gold, gems, cards };
    }
}
