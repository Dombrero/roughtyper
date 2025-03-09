// Database_extender/loader.js
// Lädt die Datenbankerweiterung in das Hauptspiel

// Funktion zum Laden der erweiterten Level-Daten
function loadExtendedLevels() {
    console.log('Lade erweiterte Level-Daten (11-20)...');
    
    // Erweiterte Gegnertypen zu den bestehenden hinzufügen
    Object.keys(extendedEnemyTypes).forEach(level => {
        enemyTypes[level] = extendedEnemyTypes[level];
    });
    
    // Erweiterte Bosse zu den bestehenden hinzufügen
    Object.keys(extendedBosses).forEach(level => {
        bosses[level] = extendedBosses[level];
    });
    
    // Füge die speziellen Bosse zum gameState hinzu
    gameState.level20BossActive = false;
    
    console.log('Erweiterte Level-Daten erfolgreich geladen!');
}

// Funktion zum Laden der erweiterten CSS-Stile
function loadExtendedStyles() {
    console.log('Lade erweiterte CSS-Stile...');
    
    // Erstelle ein neues Style-Element
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Stile für Level 20 Boss (CHRONOS) */
        .enemy-entity.level20boss {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #4b0082, #9400d3);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 20px #9400d3;
            animation: pulse 2s infinite alternate;
        }

        .level20boss .boss-icon {
            font-size: 40px;
            margin-bottom: 5px;
        }

        .level20boss .boss-name {
            font-size: 16px;
            font-weight: bold;
            color: white;
        }

        .enemy-word.level20boss-word {
            color: #9400d3;
            font-weight: bold;
            text-shadow: 0 0 3px #4b0082;
            font-size: 18px;
            transition: color 0.3s, text-shadow 0.3s;
        }

        /* Animationen */
        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            100% {
                transform: scale(1.1);
            }
        }

        @keyframes float {
            0% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
            100% {
                transform: translateY(0);
            }
        }

        /* Stile für erweiterte Gegner */
        .enemy-entity[data-level="11"],
        .enemy-entity[data-level="12"],
        .enemy-entity[data-level="13"],
        .enemy-entity[data-level="14"],
        .enemy-entity[data-level="15"],
        .enemy-entity[data-level="16"],
        .enemy-entity[data-level="17"],
        .enemy-entity[data-level="18"],
        .enemy-entity[data-level="19"],
        .enemy-entity[data-level="20"] {
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            transition: transform 0.3s;
        }

        .enemy-entity[data-level="11"] {
            background: linear-gradient(135deg, #4b0082, #8a2be2);
        }

        .enemy-entity[data-level="12"] {
            background: linear-gradient(135deg, #006400, #32cd32);
        }

        .enemy-entity[data-level="13"] {
            background: linear-gradient(135deg, #8b4513, #d2691e);
        }

        .enemy-entity[data-level="14"] {
            background: linear-gradient(135deg, #191970, #4169e1);
        }

        .enemy-entity[data-level="15"] {
            background: linear-gradient(135deg, #800080, #da70d6);
        }

        .enemy-entity[data-level="16"] {
            background: linear-gradient(135deg, #8b0000, #ff4500);
        }

        .enemy-entity[data-level="17"] {
            background: linear-gradient(135deg, #ffd700, #ffff00);
        }

        .enemy-entity[data-level="18"] {
            background: linear-gradient(135deg, #2f4f4f, #5f9ea0);
        }

        .enemy-entity[data-level="19"] {
            background: linear-gradient(135deg, #000000, #696969);
        }

        .enemy-entity[data-level="20"] {
            background: linear-gradient(135deg, #4b0082, #9400d3);
        }
    `;
    
    // Füge das Style-Element zum Dokument hinzu
    document.head.appendChild(styleElement);
    
    console.log('Erweiterte CSS-Stile erfolgreich geladen!');
}

// Funktion zum Erweitern des Game Loops
function extendGameLoop() {
    console.log('Erweitere Game Loop...');
    
    // Speichere die ursprüngliche gameLoop-Funktion
    const originalGameLoop = window.gameLoop;
    
    // Überschreibe die gameLoop-Funktion
    window.gameLoop = function(timestamp) {
        // Rufe die ursprüngliche gameLoop-Funktion auf
        originalGameLoop(timestamp);
        
        // Aktualisiere den Level 20 Boss, wenn er aktiv ist
        if (gameState.level20BossActive) {
            updateLevel20Boss();
        }
    };
    
    console.log('Game Loop erfolgreich erweitert!');
}

// Funktion zum Erweitern der initGame-Funktion
function extendInitGame() {
    console.log('Erweitere initGame-Funktion...');
    
    // Speichere die ursprüngliche initGame-Funktion
    const originalInitGame = window.initGame;
    
    // Überschreibe die initGame-Funktion
    window.initGame = function() {
        // Rufe die ursprüngliche initGame-Funktion auf
        originalInitGame();
        
        // Prüfe, ob Level 20 erreicht ist
        if (gameState.level === 20) {
            initLevel20Boss();
        }
    };
    
    console.log('initGame-Funktion erfolgreich erweitert!');
}

// Funktion zum Erweitern der Eingabeverarbeitung
function extendInputHandling() {
    console.log('Erweitere Eingabeverarbeitung...');
    
    // Speichere die ursprüngliche Eingabeverarbeitung
    const originalInputHandler = document.getElementById('typingInput').oninput;
    
    // Überschreibe die Eingabeverarbeitung
    document.getElementById('typingInput').oninput = function(e) {
        const typed = validateInput(e.target.value);
        
        // Debug-Ausgabe für jede Eingabe
        console.log('Eingabe erkannt:', typed);
        
        // Wenn der Spieler nichts eingegeben hat, beende die Funktion
        if (!typed || typed.length === 0) {
            // Rufe den ursprünglichen Handler auf und beende
            originalInputHandler.call(this, e);
            return;
        }
        
        // Prüfe zuerst auf den "menu"-Befehl
        if (typed === 'menu') {
            console.log('Menu-Befehl erkannt');
            // Rufe den ursprünglichen Handler auf, um zum Menü zurückzukehren
            originalInputHandler.call(this, e);
            return;
        }
        
        // Prüfe auf Level 20 Boss
        if (gameState.level20BossActive && window.level20Boss) {
            console.log('Level 20 Boss aktiv, prüfe Eingabe:', typed);
            
            // Prüfe, ob ein Wort des Level 20 Bosses getroffen wurde
            let targetWordIndex = -1;
            
            // Durchlaufe alle aktiven Wörter und prüfe auf exakte Übereinstimmung
            for (let i = 0; i < level20Boss.activeWords.length; i++) {
                const word = level20Boss.activeWords[i];
                if (word && word.word && word.word.toLowerCase() === typed.toLowerCase()) {
                    targetWordIndex = i;
                    break;
                }
            }
            
            if (targetWordIndex !== -1) {
                // Wort getroffen
                const targetWord = level20Boss.activeWords[targetWordIndex];
                console.log('Wort getroffen:', targetWord.word);
                addCombatLogEntry('hit', `Du hast "${targetWord.word}" getroffen!`);
                
                // Entferne das Wort
                removeLevel20BossWord(targetWordIndex);
                
                // Reduziere die Boss-Gesundheit
                level20Boss.health--;
                updateLevel20BossHealth();
                
                // Prüfe, ob der Boss besiegt ist
                if (level20Boss.health <= 0) {
                    defeatLevel20Boss();
                }
                
                // Leere das Eingabefeld
                e.target.value = '';
                return; // Beende die Funktion, um doppelte Verarbeitung zu vermeiden
            }
            
            // Wenn wir hier ankommen, wurde kein Wort vollständig getroffen
            // Rufe den ursprünglichen Handler nicht auf, um doppelte Verarbeitung zu vermeiden
            return;
        }
        
        // Wenn keine spezielle Verarbeitung stattgefunden hat, rufe den ursprünglichen Handler auf
        originalInputHandler.call(this, e);
    };
    
    // Füge einen Event-Listener für keydown hinzu, um die Eingabe zu überwachen
    document.getElementById('typingInput').addEventListener('keydown', function(e) {
        // Wenn die Eingabetaste gedrückt wird
        if (e.key === 'Enter') {
            const typed = validateInput(this.value);
            console.log('Enter-Taste gedrückt mit Eingabe:', typed);
            
            // Prüfe auf Level 20 Boss
            if (gameState.level20BossActive && level20Boss && level20Boss.activeWords && level20Boss.activeWords.length > 0) {
                // Prüfe, ob ein Wort des Level 20 Bosses getroffen wurde
                for (let i = 0; i < level20Boss.activeWords.length; i++) {
                    const word = level20Boss.activeWords[i];
                    if (word && word.word && word.word.toLowerCase() === typed.toLowerCase()) {
                        console.log('Wort getroffen durch Enter-Taste:', word.word);
                        
                        // Entferne das Wort
                        removeLevel20BossWord(i);
                        
                        // Reduziere die Boss-Gesundheit
                        level20Boss.health--;
                        updateLevel20BossHealth();
                        
                        // Prüfe, ob der Boss besiegt ist
                        if (level20Boss.health <= 0) {
                            defeatLevel20Boss();
                        }
                        
                        // Leere das Eingabefeld
                        this.value = '';
                        e.preventDefault(); // Verhindere die Standardaktion
                        return false;
                    }
                }
            }
        }
    });
    
    console.log('Eingabeverarbeitung erfolgreich erweitert!');
}

// Funktion zum Erweitern der levelUp-Funktion
function extendLevelUp() {
    console.log('Erweitere levelUp-Funktion...');
    
    // Speichere die ursprüngliche levelUp-Funktion
    const originalLevelUp = window.levelUp;
    
    // Überschreibe die levelUp-Funktion
    window.levelUp = function() {
        // Rufe die ursprüngliche levelUp-Funktion auf
        originalLevelUp();
        
        // Prüfe, ob Level 20 erreicht ist
        if (gameState.level === 20) {
            initLevel20Boss();
        }
    };
    
    console.log('levelUp-Funktion erfolgreich erweitert!');
}

// Funktion zum Erweitern der Spielmechanik
function extendGameMechanics() {
    console.log('Erweitere Spielmechanik...');
    
    // Erweitere die checkLevelUp-Funktion, um spezielle Bosse zu aktivieren
    const originalCheckLevelUp = window.checkLevelUp;
    window.checkLevelUp = function() {
        // Rufe die ursprüngliche Funktion auf
        originalCheckLevelUp();
        
        // Prüfe, ob der Spieler Level 20 erreicht hat
        if (gameState.level === 20 && gameState.monstersKilled >= 10 && !gameState.level20BossActive && !gameState.bossActive) {
            console.log('Level 20 Boss wird aktiviert...');
            initLevel20Boss();
        }
    };
    
    console.log('Spielmechanik erfolgreich erweitert!');
}

// Funktion zum Laden aller Erweiterungen
function loadDatabaseExtender() {
    console.log('Lade Database Extender...');
    
    // Lade die erweiterten Level-Daten
    loadExtendedLevels();
    
    // Lade die erweiterten CSS-Stile
    loadExtendedStyles();
    
    // Erweitere den Game Loop
    extendGameLoop();
    
    // Erweitere die initGame-Funktion
    extendInitGame();
    
    // Erweitere die Eingabeverarbeitung
    extendInputHandling();
    
    // Erweitere die levelUp-Funktion
    extendLevelUp();
    
    // Erweitere die Spielmechanik
    extendGameMechanics();
    
    console.log('Database Extender erfolgreich geladen!');
    
    // Füge eine Nachricht zum Combat Log hinzu
    if (typeof addCombatLogEntry === 'function') {
        addCombatLogEntry('info', 'Erweiterte Level 11-20 wurden geladen!');
    }
}

// Funktion zum Initialisieren aller Erweiterungen
function initExtensions() {
    console.log('Initialisiere Erweiterungen...');
    
    // Lade die Level-Definitionen
    loadLevels();
    
    // Erweitere die Eingabeverarbeitung
    extendInputHandling();
    
    // Erweitere den Game Loop
    extendGameLoop();
    
    // Erweitere die Spielmechanik
    extendGameMechanics();
    
    console.log('Erweiterungen erfolgreich initialisiert!');
}

// Exportiere die Funktionen
window.loadLevels = loadLevels;
window.extendInputHandling = extendInputHandling;
window.extendGameLoop = extendGameLoop;
window.extendGameMechanics = extendGameMechanics;
window.initExtensions = initExtensions;

// Exportiere die Level 20 Boss-Funktionen
window.initLevel20Boss = initLevel20Boss;
window.updateLevel20Boss = updateLevel20Boss;
window.updateLevel20BossWords = updateLevel20BossWords;
window.spawnLevel20BossWord = spawnLevel20BossWord;
window.removeLevel20BossWord = removeLevel20BossWord;
window.updateLevel20BossHealth = updateLevel20BossHealth;
window.defeatLevel20Boss = defeatLevel20Boss; 