/**
 * data.js - Spieldaten für RoughType
 * Enthält die Daten für die Gegner und Bosse des Spiels
 */

// Gegnertypen für die Level 1-10
const enemyTypes = {
    1: [
        { name: 'Rat', health: 1, goldReward: 2, icon: '🐀' },
        { name: 'Bat', health: 1, goldReward: 2, icon: '🦇' },
        { name: 'Bug', health: 1, goldReward: 2, icon: '🐛' }
    ],
    2: [
        { name: 'Wolf', health: 1, goldReward: 3, icon: '🐺' },
        { name: 'Snake', health: 1, goldReward: 3, icon: '🐍' },
        { name: 'Spider', health: 1, goldReward: 3, icon: '🕷️' }
    ],
    3: [
        { name: 'Goblin', health: 1, goldReward: 4, icon: '👺' },
        { name: 'Orc', health: 1, goldReward: 4, icon: '👹' },
        { name: 'Troll', health: 1, goldReward: 4, icon: '👾' }
    ],
    4: [
        { name: 'Zombie', health: 1, goldReward: 5, icon: '🧟' },
        { name: 'Skeleton', health: 1, goldReward: 5, icon: '💀' },
        { name: 'Ghost', health: 1, goldReward: 5, icon: '👻' }
    ],
    5: [
        { name: 'Vampire', health: 1, goldReward: 6, icon: '🧛' },
        { name: 'Werewolf', health: 1, goldReward: 6, icon: '🐺' },
        { name: 'Witch', health: 1, goldReward: 6, icon: '🧙' }
    ],
    6: [
        { name: 'Golem', health: 1, goldReward: 7, icon: '🗿' },
        { name: 'Elemental', health: 1, goldReward: 7, icon: '🔥' },
        { name: 'Gargoyle', health: 1, goldReward: 7, icon: '🗿' }
    ],
    7: [
        { name: 'Harpy', health: 1, goldReward: 8, icon: '🦅' },
        { name: 'Minotaur', health: 1, goldReward: 8, icon: '🐂' },
        { name: 'Centaur', health: 1, goldReward: 8, icon: '🐎' }
    ],
    8: [
        { name: 'Chimera', health: 1, goldReward: 9, icon: '🦁' },
        { name: 'Hydra', health: 1, goldReward: 9, icon: '🐉' },
        { name: 'Cerberus', health: 1, goldReward: 9, icon: '🐕' }
    ],
    9: [
        { name: 'Demon', health: 1, goldReward: 10, icon: '😈' },
        { name: 'Devil', health: 1, goldReward: 10, icon: '👿' },
        { name: 'Fiend', health: 1, goldReward: 10, icon: '👹' }
    ],
    10: [
        { name: 'Dragon', health: 1, goldReward: 15, icon: '🐉' },
        { name: 'Wyvern', health: 1, goldReward: 15, icon: '🐲' },
        { name: 'Basilisk', health: 1, goldReward: 15, icon: '🦎' }
    ]
};

// Bosse für die Level 1-10
const bosses = {
    10: {
        name: 'TYPEREX',
        health: 10,
        goldReward: 50,
        icon: '👑',
        wordPool: [
            'fire', 'ice', 'thunder', 'earth', 'wind', 'water', 'light', 'dark',
            'blade', 'arrow', 'shield', 'magic', 'poison', 'heal', 'death', 'life'
        ]
    }
};

// Shop-Artikel
const shopItems = [
    { name: 'small', type: 'potion', cost: 20, description: 'Small Health Potion (Heals 30 HP)' },
    { name: 'medium', type: 'potion', cost: 40, description: 'Medium Health Potion (Heals 60 HP)' },
    { name: 'large', type: 'potion', cost: 60, description: 'Large Health Potion (Heals 100 HP)' },
    { name: 'shield', type: 'equipment', cost: 100, description: 'Shield (Adds 5 Defense)' }
]; 