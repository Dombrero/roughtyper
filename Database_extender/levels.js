// Database_extender/levels.js
// Erweiterte Level-Definitionen für Level 11-20

// Erweiterte Gegnertypen für Level 11-20
const extendedEnemyTypes = {
    // Level 11: Schnelle Gegner
    11: {
        name: 'SWIFT',
        health: 1,
        speed: 2.5,
        gold: 15,
        color: '#8a2be2'
    },
    // Level 12: Starke Gegner
    12: {
        name: 'BRUTE',
        health: 3,
        speed: 1.2,
        gold: 20,
        color: '#32cd32'
    },
    // Level 13: Ausgewogene Gegner
    13: {
        name: 'BALANCED',
        health: 2,
        speed: 1.8,
        gold: 25,
        color: '#d2691e'
    },
    // Level 14: Schnelle, schwache Gegner
    14: {
        name: 'DASHER',
        health: 1,
        speed: 3.0,
        gold: 30,
        color: '#4169e1'
    },
    // Level 15: Normale Gegner vor dem Boss
    15: {
        name: 'TIMEKEEPER',
        health: 2,
        speed: 2.0,
        gold: 35,
        color: '#da70d6'
    },
    // Level 16: Starke, langsame Gegner
    16: {
        name: 'TANK',
        health: 4,
        speed: 1.0,
        gold: 40,
        color: '#ff4500'
    },
    // Level 17: Schnelle, mittelstarke Gegner
    17: {
        name: 'HUNTER',
        health: 2,
        speed: 2.5,
        gold: 45,
        color: '#ffff00'
    },
    // Level 18: Sehr starke Gegner
    18: {
        name: 'ELITE',
        health: 5,
        speed: 1.5,
        gold: 50,
        color: '#5f9ea0'
    },
    // Level 19: Ausgewogene, herausfordernde Gegner
    19: {
        name: 'CHALLENGER',
        health: 3,
        speed: 2.2,
        gold: 55,
        color: '#696969'
    },
    // Level 20: Normale Gegner vor dem Boss
    20: {
        name: 'SCRIBE',
        health: 2,
        speed: 2.0,
        gold: 60,
        color: '#000000'
    }
};

// Erweiterte Bosse für Level 11-20
const extendedBosses = {
    // Level 11 Boss: ECHO
    11: {
        name: 'ECHO',
        health: 12,
        gold: 100,
        special: 'repeat' // Wiederholt Worte
    },
    // Level 12 Boss: GOLIATH
    12: {
        name: 'GOLIATH',
        health: 15,
        gold: 120,
        special: 'armor' // Reduziert Schaden
    },
    // Level 13 Boss: HYDRA
    13: {
        name: 'HYDRA',
        health: 18,
        gold: 140,
        special: 'multiply' // Spawnt zusätzliche Gegner
    },
    // Level 14 Boss: PHANTOM
    14: {
        name: 'PHANTOM',
        health: 20,
        gold: 160,
        special: 'invisible' // Worte werden zeitweise unsichtbar
    },
    // Level 15 Boss: CHRONOS (Spezieller Boss)
    15: {
        name: 'CHRONOS',
        health: 10,
        gold: 500,
        special: 'timeshift' // Spezialfähigkeit: Zeitverschiebung
    },
    // Level 16 Boss: TITAN
    16: {
        name: 'TITAN',
        health: 25,
        gold: 200,
        special: 'shockwave' // Erzeugt Schockwellen
    },
    // Level 17 Boss: PHOENIX
    17: {
        name: 'PHOENIX',
        health: 28,
        gold: 220,
        special: 'rebirth' // Kann wiederauferstehen
    },
    // Level 18 Boss: ORACLE
    18: {
        name: 'ORACLE',
        health: 30,
        gold: 240,
        special: 'predict' // Sagt Worte voraus
    },
    // Level 19 Boss: GUARDIAN
    19: {
        name: 'GUARDIAN',
        health: 32,
        gold: 260,
        special: 'shield' // Schützt sich mit einem Schild
    },
    // Level 20 Boss: SCRIPTUM (Spezieller Boss)
    20: {
        name: 'SCRIPTUM',
        health: 100,
        gold: 1000,
        special: 'text' // Spezialfähigkeit: Langer Text
    }
};

// Spezieller Boss für Level 15
const level15Boss = {
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

// Spezieller Boss für Level 20
const level20Boss = {
    name: 'SCRIPTUM',
    health: 100, // 100 Zeichen zum Besiegen
    goldReward: 1000,
    text: `In einer Welt voller Tasten und Zeichen, wo Buchstaben tanzen und Wörter sich formen, begann die Reise eines Helden. Mit flinken Fingern und scharfem Verstand kämpfte er gegen die Mächte der Ungenauigkeit und Langsamkeit. Jeder Tastendruck ein Schlag, jedes Wort ein Sieg. Die Dunkelheit der Fehler versuchte ihn zu umhüllen, doch sein Wille war stärker. Durch Level um Level, Gegner um Gegner, stieg er auf, immer höher, immer schneller. Nun steht er vor der letzten Prüfung, dem ultimativen Test seiner Fähigkeiten. Kann er den Text bezwingen, bevor die Zeit abläuft? Kann er die Worte meistern, bevor sie ihn verschlingen? Das Schicksal der digitalen Welt liegt in seinen Händen, in jedem Buchstaben, den er tippt, in jedem Wort, das er vollendet. Die Zeit läuft, die Herausforderung wartet. Tippe, Held, tippe für dein Leben!`,
    special: 'text', // Spezialfähigkeit: Langer Text
    speed: 0.5 // Geschwindigkeit des Textes (Pixel pro Frame)
};

// Exportiere die Daten
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extendedEnemyTypes,
        extendedBosses,
        level15Boss,
        level20Boss
    };
} else {
    // Exportiere die Daten für den Browser
    window.extendedEnemyTypes = extendedEnemyTypes;
    window.extendedBosses = extendedBosses;
    window.level15Boss = level15Boss;
    window.level20Boss = level20Boss;
} 