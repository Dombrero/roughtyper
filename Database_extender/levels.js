// Database_extender/levels.js
// Erweiterte Level-Definitionen für Level 11-20

// Erweiterte Gegnertypen für Level 11-20
const extendedEnemyTypes = {
    11: [
        { name: 'Wizard', health: 22, goldReward: 6, icon: '🧙‍♂️' },
        { name: 'Warlock', health: 22, goldReward: 6, icon: '🧙' },
        { name: 'Sorcerer', health: 22, goldReward: 6, icon: '✨' },
        { name: 'Mage', health: 22, goldReward: 6, icon: '🔮' },
        { name: 'Enchanter', health: 22, goldReward: 6, icon: '📚' }
    ],
    12: [
        { name: 'Golem', health: 24, goldReward: 7, icon: '🗿' },
        { name: 'Titan', health: 24, goldReward: 7, icon: '🏛️' },
        { name: 'Giant', health: 24, goldReward: 7, icon: '🏔️' },
        { name: 'Colossus', health: 24, goldReward: 7, icon: '🗽' },
        { name: 'Behemoth', health: 24, goldReward: 7, icon: '🦕' }
    ],
    13: [
        { name: 'Assassin', health: 26, goldReward: 8, icon: '🗡️' },
        { name: 'Ninja', health: 26, goldReward: 8, icon: '🥷' },
        { name: 'Rogue', health: 26, goldReward: 8, icon: '👤' },
        { name: 'Shadow', health: 26, goldReward: 8, icon: '🌑' },
        { name: 'Thief', health: 26, goldReward: 8, icon: '💰' }
    ],
    14: [
        { name: 'Paladin', health: 28, goldReward: 9, icon: '🛡️' },
        { name: 'Crusader', health: 28, goldReward: 9, icon: '⚔️' },
        { name: 'Templar', health: 28, goldReward: 9, icon: '✝️' },
        { name: 'Guardian', health: 28, goldReward: 9, icon: '🏰' },
        { name: 'Defender', health: 28, goldReward: 9, icon: '🛡️' }
    ],
    15: [
        { name: 'Necromancer', health: 30, goldReward: 10, icon: '💀' },
        { name: 'Lich', health: 30, goldReward: 10, icon: '☠️' },
        { name: 'Wraith', health: 30, goldReward: 10, icon: '👻' },
        { name: 'Specter', health: 30, goldReward: 10, icon: '👤' },
        { name: 'Revenant', health: 30, goldReward: 10, icon: '🧟' }
    ],
    16: [
        { name: 'Berserker', health: 32, goldReward: 11, icon: '⚔️' },
        { name: 'Barbarian', health: 32, goldReward: 11, icon: '🪓' },
        { name: 'Marauder', health: 32, goldReward: 11, icon: '💢' },
        { name: 'Gladiator', health: 32, goldReward: 11, icon: '🏆' },
        { name: 'Warlord', health: 32, goldReward: 11, icon: '👑' }
    ],
    17: [
        { name: 'Archangel', health: 34, goldReward: 12, icon: '👼' },
        { name: 'Seraphim', health: 34, goldReward: 12, icon: '🔆' },
        { name: 'Cherubim', health: 34, goldReward: 12, icon: '✨' },
        { name: 'Dominion', health: 34, goldReward: 12, icon: '👑' },
        { name: 'Virtue', health: 34, goldReward: 12, icon: '🌟' }
    ],
    18: [
        { name: 'Archdemon', health: 36, goldReward: 13, icon: '👿' },
        { name: 'Fiend', health: 36, goldReward: 13, icon: '🔥' },
        { name: 'Hellion', health: 36, goldReward: 13, icon: '🔥' },
        { name: 'Abyssal', health: 36, goldReward: 13, icon: '🌑' },
        { name: 'Infernal', health: 36, goldReward: 13, icon: '🔥' }
    ],
    19: [
        { name: 'Demigod', health: 38, goldReward: 14, icon: '🌠' },
        { name: 'Ascendant', health: 38, goldReward: 14, icon: '⬆️' },
        { name: 'Celestial', health: 38, goldReward: 14, icon: '🌌' },
        { name: 'Transcendent', health: 38, goldReward: 14, icon: '✨' },
        { name: 'Ethereal', health: 38, goldReward: 14, icon: '🌈' }
    ],
    20: [
        { name: 'Timekeeper', health: 40, goldReward: 15, icon: '⏰' },
        { name: 'Clockwork', health: 40, goldReward: 15, icon: '⏱️' },
        { name: 'Temporal', health: 40, goldReward: 15, icon: '⌛' },
        { name: 'Chronos', health: 40, goldReward: 15, icon: '🕰️' },
        { name: 'Infinity', health: 40, goldReward: 15, icon: '♾️' }
    ]
};

// Erweiterte Bosse für Level 11-20
const extendedBosses = {
    15: {
        name: 'PHOENIX',
        health: 30,
        goldReward: 150,
        special: 'rebirth',
        rebirthHealth: 10
    },
    20: {
        name: 'CHRONOS',
        health: 40,
        goldReward: 200,
        special: 'timeshift'
    }
};

// Spezieller Boss für Level 20
const level20Boss = {
    name: 'CHRONOS',
    health: 10, // 10 Worte zum Besiegen
    goldReward: 500,
    maxProjectiles: 5, // Fünf Worte gleichzeitig
    wordPool: [
        'ZEIT', 'PORTAL', 'CHRONOS', 'STUNDE', 'MINUTE', 'SEKUNDE', 'UHRWERK', 'PENDEL', 'SANDUHR', 'EWIGKEIT', 'MOMENT', 'PRESENT', 'PAST', 'FUTURE', 'RIFT'
    ],
    special: 'timeshift', // Spezialfähigkeit: Zeitverschiebung
    timeshiftInterval: 15000, // Alle 15 Sekunden (verlängert)
    speedMultiplier: 1.2 // Weiter reduzierter Geschwindigkeitsmultiplikator
};

// Exportiere die Daten
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extendedEnemyTypes,
        extendedBosses,
        level20Boss
    };
} else {
    // Exportiere die Daten für den Browser
    window.extendedEnemyTypes = extendedEnemyTypes;
    window.extendedBosses = extendedBosses;
    window.level20Boss = level20Boss;
} 