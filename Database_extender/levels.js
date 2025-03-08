// Database_extender/levels.js
// Erweiterung der Levels 11-19 für RoughType

// Erweiterte Gegnertypen für Level 11-19
const extendedEnemyTypes = {
    11: [
        { name: 'Necromancer', health: 22, goldReward: 6, icon: '🧙‍♂️' },
        { name: 'Banshee', health: 22, goldReward: 6, icon: '👻' },
        { name: 'Wraith', health: 22, goldReward: 6, icon: '👤' },
        { name: 'Specter', health: 22, goldReward: 6, icon: '👻' },
        { name: 'Revenant', health: 22, goldReward: 6, icon: '💀' }
    ],
    12: [
        { name: 'Golem', health: 24, goldReward: 6, icon: '🗿' },
        { name: 'Titan', health: 24, goldReward: 6, icon: '🏛️' },
        { name: 'Colossus', health: 24, goldReward: 6, icon: '🗽' },
        { name: 'Juggernaut', health: 24, goldReward: 6, icon: '🛡️' },
        { name: 'Sentinel', health: 24, goldReward: 6, icon: '🤖' }
    ],
    13: [
        { name: 'Sorcerer', health: 26, goldReward: 7, icon: '🧙' },
        { name: 'Warlock', health: 26, goldReward: 7, icon: '🧙‍♂️' },
        { name: 'Enchanter', health: 26, goldReward: 7, icon: '✨' },
        { name: 'Conjurer', health: 26, goldReward: 7, icon: '🔮' },
        { name: 'Illusionist', health: 26, goldReward: 7, icon: '🎭' }
    ],
    14: [
        { name: 'Assassin', health: 28, goldReward: 7, icon: '🗡️' },
        { name: 'Rogue', health: 28, goldReward: 7, icon: '👤' },
        { name: 'Ninja', health: 28, goldReward: 7, icon: '🥷' },
        { name: 'Thief', health: 28, goldReward: 7, icon: '💰' },
        { name: 'Shadow', health: 28, goldReward: 7, icon: '🌑' }
    ],
    15: [
        { name: 'Paladin', health: 30, goldReward: 8, icon: '🛡️' },
        { name: 'Crusader', health: 30, goldReward: 8, icon: '⚔️' },
        { name: 'Templar', health: 30, goldReward: 8, icon: '✝️' },
        { name: 'Guardian', health: 30, goldReward: 8, icon: '🛡️' },
        { name: 'Defender', health: 30, goldReward: 8, icon: '🏰' }
    ],
    16: [
        { name: 'Berserker', health: 32, goldReward: 8, icon: '⚔️' },
        { name: 'Barbarian', health: 32, goldReward: 8, icon: '🪓' },
        { name: 'Marauder', health: 32, goldReward: 8, icon: '💢' },
        { name: 'Gladiator', health: 32, goldReward: 8, icon: '🏆' },
        { name: 'Warlord', health: 32, goldReward: 8, icon: '👑' }
    ],
    17: [
        { name: 'Archangel', health: 34, goldReward: 9, icon: '👼' },
        { name: 'Seraphim', health: 34, goldReward: 9, icon: '🔆' },
        { name: 'Cherubim', health: 34, goldReward: 9, icon: '✨' },
        { name: 'Dominion', health: 34, goldReward: 9, icon: '👑' },
        { name: 'Virtue', health: 34, goldReward: 9, icon: '🌟' }
    ],
    18: [
        { name: 'Archdemon', health: 36, goldReward: 9, icon: '👿' },
        { name: 'Fiend', health: 36, goldReward: 9, icon: '🔥' },
        { name: 'Hellion', health: 36, goldReward: 9, icon: '🔥' },
        { name: 'Abyssal', health: 36, goldReward: 9, icon: '🌑' },
        { name: 'Infernal', health: 36, goldReward: 9, icon: '🔥' }
    ],
    19: [
        { name: 'Demigod', health: 38, goldReward: 10, icon: '🌠' },
        { name: 'Ascendant', health: 38, goldReward: 10, icon: '⬆️' },
        { name: 'Celestial', health: 38, goldReward: 10, icon: '🌌' },
        { name: 'Transcendent', health: 38, goldReward: 10, icon: '✨' },
        { name: 'Ethereal', health: 38, goldReward: 10, icon: '🌈' }
    ]
};

// Erweiterte Boss-Definitionen
const extendedBosses = {
    30: {
        name: 'PHOENIX',
        health: 40,
        goldReward: 60,
        special: 'resurrect',
        resurrectHealth: 10
    },
    40: {
        name: 'KRAKEN',
        health: 50,
        goldReward: 80,
        special: 'tentacles',
        splitWords: ['TENTA', 'CLE', 'CRUSH', 'GRAB', 'SQUEEZE']
    },
    50: {
        name: 'CHIMERA',
        health: 60,
        goldReward: 100,
        special: 'multihead',
        heads: ['LION', 'GOAT', 'SNAKE']
    }
};

// Spezieller Boss für Level 15
const level15Boss = {
    name: 'CHRONOS',
    health: 15, // 15 Worte zum Besiegen
    goldReward: 150,
    maxProjectiles: 3, // Drei Worte gleichzeitig
    wordPool: [
        'TIME', 'CLOCK', 'HOUR', 'MINUTE', 'SECOND', 
        'PAST', 'FUTURE', 'PRESENT', 'WARP', 'FLOW',
        'SPACE', 'CONTINUUM', 'RIFT', 'VORTEX', 'PORTAL',
        'DIMENSION', 'REALITY', 'PARADOX', 'ETERNAL', 'INFINITY'
    ],
    special: 'timeshift', // Spezialfähigkeit: Zeitverschiebung
    timeshiftInterval: 10000, // Alle 10 Sekunden
    speedMultiplier: 1.3 // Reduzierter Geschwindigkeitsmultiplikator
};

// Spezieller Boss für Level 19
const level19Boss = {
    name: 'NEMESIS',
    health: 20, // 20 Worte zum Besiegen
    goldReward: 200,
    maxProjectiles: 4, // Vier Worte gleichzeitig
    wordPool: [
        'VENGEANCE', 'RETRIBUTION', 'JUSTICE', 'BALANCE', 'KARMA', 
        'FATE', 'DESTINY', 'DOOM', 'JUDGMENT', 'RECKONING',
        'PUNISHMENT', 'SENTENCE', 'VERDICT', 'TRIAL', 'EXECUTION',
        'WRATH', 'FURY', 'ANGER', 'HATRED', 'MALICE'
    ],
    special: 'mirror', // Spezialfähigkeit: Spiegelt Worte
    mirrorChance: 0.3, // 30% Chance, ein Wort zu spiegeln
    damageReflect: 0.2 // 20% des Schadens wird reflektiert
};

// Exportiere die Daten
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extendedEnemyTypes,
        extendedBosses,
        level15Boss,
        level19Boss
    };
} 