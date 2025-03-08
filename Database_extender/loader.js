// Database_extender/loader.js
// Lädt die Datenbankerweiterung in das Hauptspiel

// Funktion zum Laden der erweiterten Level-Daten
function loadExtendedLevels() {
    console.log('Lade erweiterte Level-Daten (11-19)...');
    
    // Erweiterte Gegnertypen zu den bestehenden hinzufügen
    Object.keys(extendedEnemyTypes).forEach(level => {
        enemyTypes[level] = extendedEnemyTypes[level];
    });
    
    // Erweiterte Bosse zu den bestehenden hinzufügen
    Object.keys(extendedBosses).forEach(level => {
        bosses[level] = extendedBosses[level];
    });
    
    // Füge die speziellen Bosse zum gameState hinzu
    gameState.level15BossActive = false;
    gameState.level19BossActive = false;
    
    console.log('Erweiterte Level-Daten erfolgreich geladen!');
}

// Funktion zum Laden der erweiterten CSS-Stile
function loadExtendedStyles() {
    console.log('Lade erweiterte CSS-Stile...');
    
    // Erstelle ein neues Style-Element
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Stile für Level 15 Boss (CHRONOS) */
        .enemy-entity.level15boss {
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

        .level15boss .boss-icon {
            font-size: 40px;
            margin-bottom: 5px;
        }

        .level15boss .boss-name {
            font-size: 16px;
            font-weight: bold;
            color: white;
        }

        .enemy-word.level15boss-word {
            color: #9400d3;
            font-weight: bold;
            text-shadow: 0 0 3px #4b0082;
            font-size: 18px;
            transition: color 0.3s, text-shadow 0.3s;
        }

        /* Stile für Level 19 Boss (NEMESIS) */
        .enemy-entity.level19boss {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #800000, #ff0000);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 20px #ff0000;
            animation: float 3s infinite alternate;
        }

        .level19boss .boss-icon {
            font-size: 40px;
            margin-bottom: 5px;
        }

        .level19boss .boss-name {
            font-size: 16px;
            font-weight: bold;
            color: white;
        }

        .enemy-word.level19boss-word {
            color: #ff0000;
            font-weight: bold;
            text-shadow: 0 0 3px #800000;
            font-size: 18px;
        }

        .enemy-word.level19boss-word.mirrored {
            color: #ff6600;
            text-shadow: 0 0 5px #ff6600;
            transform: scaleX(-1);
            display: inline-block;
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
        .enemy-entity[data-level="19"] {
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
        
        // Aktualisiere den Level 15 Boss, wenn er aktiv ist
        if (gameState.level15BossActive) {
            updateLevel15Boss();
        }
        
        // Aktualisiere den Level 19 Boss, wenn er aktiv ist
        if (gameState.level19BossActive) {
            updateLevel19Boss(timestamp);
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
        
        // Prüfe, ob Level 15 oder 19 erreicht ist
        if (gameState.level === 15) {
            initLevel15Boss();
        } else if (gameState.level === 19) {
            initLevel19Boss();
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
        
        // Prüfe auf Level 15 Boss
        if (gameState.level15BossActive && window.level15Boss) {
            console.log('Level 15 Boss aktiv, prüfe Eingabe:', typed);
            
            // Prüfe, ob ein Wort des Level 15 Bosses getroffen wurde
            let targetWordIndex = -1;
            
            // Durchlaufe alle aktiven Wörter und prüfe auf exakte Übereinstimmung
            for (let i = 0; i < level15Boss.activeWords.length; i++) {
                const word = level15Boss.activeWords[i];
                if (word && word.word && word.word.toLowerCase() === typed.toLowerCase()) {
                    targetWordIndex = i;
                    break;
                }
            }
            
            if (targetWordIndex !== -1) {
                // Wort getroffen
                const targetWord = level15Boss.activeWords[targetWordIndex];
                console.log('Wort getroffen:', targetWord.word);
                addCombatLogEntry('hit', `Du hast "${targetWord.word}" getroffen!`);
                
                // Entferne das Wort
                removeLevel15BossWord(targetWordIndex);
                
                // Reduziere die Boss-Gesundheit
                level15Boss.health--;
                updateLevel15BossHealth();
                
                // Prüfe, ob der Boss besiegt ist
                if (level15Boss.health <= 0) {
                    defeatLevel15Boss();
                }
                
                // Leere das Eingabefeld
                e.target.value = '';
                return; // Beende die Funktion, um doppelte Verarbeitung zu vermeiden
            }
            
            // Prüfe auch, ob das Wort mit einem der aktiven Wörter beginnt (für Teilübereinstimmungen)
            for (let i = 0; i < level15Boss.activeWords.length; i++) {
                const word = level15Boss.activeWords[i];
                if (word && word.word && word.word.toLowerCase().startsWith(typed.toLowerCase()) && typed.length > 0) {
                    console.log('Teilübereinstimmung gefunden:', typed, 'für Wort:', word.word);
                    
                    // Markiere das Wort visuell, um Feedback zu geben
                    if (word.element) {
                        // Erstelle HTML für die Markierung der korrekten Buchstaben
                        let html = '';
                        for (let j = 0; j < word.word.length; j++) {
                            if (j < typed.length) {
                                html += `<span style="color: #00ff00;">${word.word[j]}</span>`;
                            } else {
                                html += word.word[j];
                            }
                        }
                        word.element.innerHTML = html;
                    }
                    
                    // Wenn die Eingabe vollständig ist, aber der Fall nicht übereinstimmt
                    if (typed.length === word.word.length && typed.toLowerCase() === word.word.toLowerCase()) {
                        console.log('Vollständige Übereinstimmung mit unterschiedlicher Groß-/Kleinschreibung:', typed, 'für Wort:', word.word);
                        
                        // Entferne das Wort
                        removeLevel15BossWord(i);
                        
                        // Reduziere die Boss-Gesundheit
                        level15Boss.health--;
                        updateLevel15BossHealth();
                        
                        // Prüfe, ob der Boss besiegt ist
                        if (level15Boss.health <= 0) {
                            defeatLevel15Boss();
                        }
                        
                        // Leere das Eingabefeld
                        e.target.value = '';
                        return; // Beende die Funktion, um doppelte Verarbeitung zu vermeiden
                    }
                } else if (word && word.element) {
                    // Setze das Wort zurück, wenn es nicht mehr übereinstimmt
                    word.element.textContent = word.word;
                }
            }
            
            // Wenn wir hier ankommen, wurde kein Wort vollständig getroffen
            // Rufe den ursprünglichen Handler nicht auf, um doppelte Verarbeitung zu vermeiden
            return;
        }
        
        // Prüfe auf Level 19 Boss
        if (gameState.level19BossActive) {
            // Stelle sicher, dass level19Boss.activeWords existiert und ein Array ist
            if (!level19Boss.activeWords || !Array.isArray(level19Boss.activeWords)) {
                console.error('level19Boss.activeWords ist nicht definiert oder kein Array!');
                level19Boss.activeWords = [];
            }
            
            // Prüfe, ob ein Wort des Level 19 Bosses getroffen wurde
            let targetWordIndex = -1;
            
            // Durchlaufe alle aktiven Wörter und prüfe auf exakte Übereinstimmung
            for (let i = 0; i < level19Boss.activeWords.length; i++) {
                const word = level19Boss.activeWords[i];
                if (word && word.word && word.word.toLowerCase() === typed.toLowerCase()) {
                    targetWordIndex = i;
                    break;
                }
            }
            
            if (targetWordIndex !== -1) {
                // Wort getroffen
                const targetWord = level19Boss.activeWords[targetWordIndex];
                
                // Gespiegelte Worte geben mehr Punkte
                if (targetWord.isMirrored) {
                    addCombatLogEntry('hit', `Du hast das gespiegelte Wort "${targetWord.word}" getroffen! +2 Punkte!`);
                    gameState.score += 2;
                } else {
                    addCombatLogEntry('hit', `Du hast "${targetWord.word}" getroffen!`);
                }
                
                // Entferne das Wort
                removeLevel19BossWord(targetWordIndex);
                
                // Reduziere die Boss-Gesundheit
                level19Boss.health--;
                updateLevel19BossHealth();
                
                // Prüfe, ob der Boss besiegt ist
                if (level19Boss.health <= 0) {
                    defeatLevel19Boss();
                }
                
                // Leere das Eingabefeld
                e.target.value = '';
                return; // Beende die Funktion, um doppelte Verarbeitung zu vermeiden
            }
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
            
            // Prüfe auf Level 15 Boss
            if (gameState.level15BossActive && level15Boss && level15Boss.activeWords && level15Boss.activeWords.length > 0) {
                // Prüfe, ob ein Wort des Level 15 Bosses getroffen wurde
                for (let i = 0; i < level15Boss.activeWords.length; i++) {
                    const word = level15Boss.activeWords[i];
                    if (word && word.word && word.word.toLowerCase() === typed.toLowerCase()) {
                        console.log('Wort getroffen durch Enter-Taste:', word.word);
                        
                        // Entferne das Wort
                        removeLevel15BossWord(i);
                        
                        // Reduziere die Boss-Gesundheit
                        level15Boss.health--;
                        updateLevel15BossHealth();
                        
                        // Prüfe, ob der Boss besiegt ist
                        if (level15Boss.health <= 0) {
                            defeatLevel15Boss();
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
        
        // Prüfe, ob Level 15 oder 19 erreicht ist
        if (gameState.level === 15) {
            initLevel15Boss();
        } else if (gameState.level === 19) {
            initLevel19Boss();
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
        
        // Prüfe, ob der Spieler Level 15 erreicht hat
        if (gameState.level === 15 && gameState.monstersKilled >= 10 && !gameState.level15BossActive && !gameState.bossActive) {
            console.log('Level 15 Boss wird aktiviert...');
            initLevel15Boss();
        }
        
        // Prüfe, ob der Spieler Level 19 erreicht hat
        if (gameState.level === 19 && gameState.monstersKilled >= 10 && !gameState.level19BossActive && !gameState.bossActive) {
            console.log('Level 19 Boss wird aktiviert...');
            initLevel19Boss();
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
        addCombatLogEntry('info', 'Erweiterte Level 11-19 wurden geladen!');
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

// Exportiere die Level 15 Boss-Funktionen
window.initLevel15Boss = initLevel15Boss;
window.updateLevel15Boss = updateLevel15Boss;
window.updateLevel15BossWords = updateLevel15BossWords;
window.spawnLevel15BossWord = spawnLevel15BossWord;
window.removeLevel15BossWord = removeLevel15BossWord;
window.updateLevel15BossHealth = updateLevel15BossHealth;
window.defeatLevel15Boss = defeatLevel15Boss;

// Exportiere die Level 19 Boss-Funktionen
window.initLevel19Boss = initLevel19Boss;
window.updateLevel19Boss = updateLevel19Boss;
window.spawnLevel19BossWord = spawnLevel19BossWord;
window.removeLevel19BossWord = removeLevel19BossWord;
window.updateLevel19BossHealth = updateLevel19BossHealth;
window.defeatLevel19Boss = defeatLevel19Boss; 