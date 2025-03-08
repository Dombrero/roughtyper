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
        
        // Füge die Logik für die speziellen Bosse hinzu
        if (gameState.level15BossActive) {
            // Verhindere das Spawnen normaler Gegner während des Level 15 Bosskampfes
            gameState.spawnTimer = 0; // Setze den Spawn-Timer zurück
            
            // Aktualisiere den Level 15 Boss
            updateLevel15Boss(timestamp);
        }
        
        if (gameState.level19BossActive) {
            // Verhindere das Spawnen normaler Gegner während des Level 19 Bosskampfes
            gameState.spawnTimer = 0; // Setze den Spawn-Timer zurück
            
            // Aktualisiere den Level 19 Boss
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
        
        // Wenn der Spieler nichts eingegeben hat, beende die Funktion
        if (!typed || typed.length === 0) {
            // Rufe den ursprünglichen Handler auf und beende
            originalInputHandler.call(this, e);
            return;
        }
        
        // Prüfe zuerst auf Level 15 Boss
        if (gameState.level15BossActive && level15Boss.activeWords && level15Boss.activeWords.length > 0) {
            console.log('Level 15 Boss aktiv, prüfe Eingabe:', typed);
            console.log('Aktive Wörter:', level15Boss.activeWords.map(w => w.word));
            
            // Prüfe, ob ein Wort des Level 15 Bosses getroffen wurde
            const targetWordIndex = level15Boss.activeWords.findIndex(
                word => word.word && word.word.toLowerCase() === typed.toLowerCase()
            );
            
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
            let matchFound = false;
            for (let i = 0; i < level15Boss.activeWords.length; i++) {
                const word = level15Boss.activeWords[i];
                if (word.word && word.word.toLowerCase().startsWith(typed.toLowerCase()) && typed.length > 0) {
                    console.log('Teilübereinstimmung gefunden:', typed, 'für Wort:', word.word);
                    matchFound = true;
                    
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
                } else if (word.element) {
                    // Setze das Wort zurück, wenn es nicht mehr übereinstimmt
                    word.element.textContent = word.word;
                }
            }
            
            if (matchFound) {
                // Rufe den ursprünglichen Handler nicht auf, um doppelte Verarbeitung zu vermeiden
                return;
            }
            
            // Wenn keine Übereinstimmung gefunden wurde, leere das Eingabefeld
            // Dies verhindert, dass normale Gegner während des Bosskampfes getroffen werden
            e.target.value = '';
            return;
        }
        
        // Prüfe auf Level 19 Boss
        if (gameState.level19BossActive && level19Boss.activeWords && level19Boss.activeWords.length > 0) {
            // Prüfe, ob ein Wort des Level 19 Bosses getroffen wurde
            const targetWordIndex = level19Boss.activeWords.findIndex(
                word => word.word && word.word.toLowerCase() === typed.toLowerCase()
            );
            
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
            
            // Wenn keine Übereinstimmung gefunden wurde, leere das Eingabefeld
            // Dies verhindert, dass normale Gegner während des Bosskampfes getroffen werden
            e.target.value = '';
            return;
        }
        
        // Wenn keine spezielle Verarbeitung stattgefunden hat, rufe den ursprünglichen Handler auf
        originalInputHandler.call(this, e);
    };
    
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
    
    console.log('Database Extender erfolgreich geladen!');
    
    // Füge eine Nachricht zum Combat Log hinzu
    if (typeof addCombatLogEntry === 'function') {
        addCombatLogEntry('info', 'Erweiterte Level 11-19 wurden geladen!');
    }
}

// Exportiere die Funktionen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadDatabaseExtender
    };
} 