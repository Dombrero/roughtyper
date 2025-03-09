/**
 * practice.js - Übungsmodus für RoughType
 * Enthält die Funktionen für den Übungsmodus
 */

/**
 * Startet den Übungsmodus
 */
function startPracticeMode() {
    gameState.currentScreen = 'practice';
    mainMenu.classList.add('hidden');
    gameContainer.style.display = 'block';
    initPracticeMode();
    refreshVirtualKeyboard();
}

/**
 * Initialisiert den Übungsmodus
 */
function initPracticeMode() {
    debugLog('Initialisiere Übungsmodus...');
    
    // Setze den Übungsmodus zurück
    gameState.practiceScore = 0;
    gameState.practiceWord = '';
    gameState.wrongChars = '';
    
    // Erstelle die Übungsmodus-Oberfläche
    const gameScene = document.getElementById('gameScene');
    gameScene.innerHTML = `
        <div class="practice-container">
            <h2>Practice Mode</h2>
            <div class="practice-score">Score: 0</div>
            <div class="practice-word"></div>
            <div class="wrong-chars"></div>
            <div class="next-monster-container">
                <div class="next-monster-label">Next Word:</div>
                <div class="next-monster-word"></div>
            </div>
        </div>
    `;
    
    // Generiere das erste Wort
    generatePracticeWord();
    
    // Entferne alten Hinweis falls vorhanden
    const oldHint = document.querySelector('.menu-hint');
    if (oldHint) {
        oldHint.remove();
    }

    // Füge verbesserten Menü-Hinweis hinzu
    const hint = document.createElement('div');
    hint.className = 'menu-hint-improved';
    hint.innerHTML = '⌨️ Type <strong>"menu"</strong> to return to the main menu';
    
    // Hinweis nach 5 Sekunden ausblenden
    setTimeout(() => {
        hint.style.opacity = '0';
        hint.style.transition = 'opacity 1s ease-out';
        
        // Nach dem Ausblenden entfernen
        setTimeout(() => {
            hint.remove();
        }, 1000);
    }, 5000);
    
    document.body.appendChild(hint);
}

/**
 * Generiert ein zufälliges Übungswort
 */
function generatePracticeWord() {
    // Sammle alle Monsterwörter aus allen Leveln
    let allMonsterWords = [];
    
    // Sammle Wörter aus den Standard-Leveln
    for (let level = 1; level <= 10; level++) {
        if (window.enemyTypes && window.enemyTypes[level]) {
            window.enemyTypes[level].forEach(enemy => {
                allMonsterWords.push({
                    word: enemy.name.toLowerCase(),
                    icon: enemy.icon || '👾'
                });
            });
        }
    }
    
    // Sammle Wörter aus den erweiterten Leveln
    if (typeof window.extendedEnemyTypes !== 'undefined') {
        for (let level = 11; level <= 20; level++) {
            if (window.extendedEnemyTypes[level]) {
                window.extendedEnemyTypes[level].forEach(enemy => {
                    allMonsterWords.push({
                        word: enemy.name.toLowerCase(),
                        icon: enemy.icon || '👾'
                    });
                });
            }
        }
    }
    
    // Füge auch Boss-Wörter hinzu
    if (window.bosses) {
        Object.values(window.bosses).forEach(boss => {
            allMonsterWords.push({
                word: boss.name.toLowerCase(),
                icon: '👑'
            });
            
            // Füge auch Split-Wörter hinzu, falls vorhanden
            if (boss.splitWords) {
                boss.splitWords.forEach(word => {
                    allMonsterWords.push({
                        word: word.toLowerCase(),
                        icon: '🔥'
                    });
                });
            }
        });
    }
    
    // Wenn es keine Wörter gibt, füge einige Standard-Wörter hinzu
    if (allMonsterWords.length === 0) {
        allMonsterWords = [
            { word: 'goblin', icon: '👹' },
            { word: 'orc', icon: '👺' },
            { word: 'dragon', icon: '🐉' },
            { word: 'skeleton', icon: '💀' },
            { word: 'zombie', icon: '🧟' },
            { word: 'ghost', icon: '👻' },
            { word: 'demon', icon: '😈' },
            { word: 'vampire', icon: '🧛' },
            { word: 'werewolf', icon: '🐺' },
            { word: 'witch', icon: '🧙' }
        ];
    }
    
    // Wenn es ein nächstes Monster gibt, verwende es als aktuelles Monster
    let currentMonster;
    if (gameState.nextMonster) {
        currentMonster = gameState.nextMonster;
    } else {
        // Wähle ein zufälliges Wort aus
        currentMonster = allMonsterWords[Math.floor(Math.random() * allMonsterWords.length)];
    }
    
    // Wähle ein neues zufälliges Wort für das nächste Monster aus
    // Stelle sicher, dass es nicht das gleiche Wort ist
    let nextMonster;
    do {
        nextMonster = allMonsterWords[Math.floor(Math.random() * allMonsterWords.length)];
    } while (nextMonster.word === currentMonster.word);
    
    // Aktualisiere den Spielstatus
    gameState.practiceWord = currentMonster.word;
    gameState.nextMonster = nextMonster;
    
    // Zeige das aktuelle Wort an
    const practiceWordElement = document.querySelector('.practice-word');
    if (practiceWordElement) {
        practiceWordElement.innerHTML = `${currentMonster.icon} ${currentMonster.word}`;
    }
    
    // Zeige das nächste Monster an
    const nextMonsterElement = document.querySelector('.next-monster-word');
    if (nextMonsterElement) {
        nextMonsterElement.innerHTML = `${nextMonster.icon} ${nextMonster.word}`;
    }
    
    // Setze falsch eingetippte Buchstaben zurück
    gameState.wrongChars = '';
    const wrongCharsElement = document.querySelector('.wrong-chars');
    if (wrongCharsElement) {
        wrongCharsElement.textContent = '';
    }
    
    debugLog(`Neues Übungswort generiert: ${currentMonster.word}`);
}

/**
 * Aktualisiert den Übungsmodus-Score
 */
function updatePracticeScore() {
    gameState.practiceScore++;
    const scoreElement = document.querySelector('.practice-score');
    if (scoreElement) {
        scoreElement.textContent = `Score: ${gameState.practiceScore}`;
    }
    
    // Füge einen Eintrag zum Combat Log hinzu
    addCombatLogEntry('kill', `You correctly typed "${gameState.practiceWord}"!`);
}

/**
 * Verarbeitet die Eingabe im Übungsmodus
 * @param {string} input - Der eingegebene Text
 * @returns {boolean} - Gibt zurück, ob die Eingabe verarbeitet wurde
 */
function handlePracticeInput(input) {
    // Prüfe auf "menu" Befehl
    if (input === 'menu') {
        returnToMenu();
        document.getElementById('typingInput').value = '';
        return true;
    }
    
    const practiceWord = gameState.practiceWord;
    
    // Wenn die Eingabe mit dem Übungswort beginnt
    if (practiceWord.startsWith(input)) {
        // Markiere die korrekt eingegebenen Buchstaben
        const practiceWordElement = document.querySelector('.practice-word');
        if (practiceWordElement) {
            let html = '';
            for (let i = 0; i < practiceWord.length; i++) {
                if (i < input.length) {
                    html += `<span class="correct">${practiceWord[i]}</span>`;
                } else {
                    html += practiceWord[i];
                }
            }
            practiceWordElement.innerHTML = `${gameState.nextMonster ? gameState.nextMonster.icon : '👾'} ${html}`;
        }
        
        // Wenn das Wort vollständig eingegeben wurde
        if (input === practiceWord) {
            // Erhöhe den Score
            updatePracticeScore();
            
            // Generiere ein neues Wort
            generatePracticeWord();
            
            // Leere das Eingabefeld
            document.getElementById('typingInput').value = '';
            
            return true;
        }
    } else if (input.length > 0) {
        // Falsche Eingabe
        const wrongChar = input[input.length - 1];
        gameState.wrongChars += wrongChar;
        
        // Zeige die falsch eingegebenen Buchstaben an
        const wrongCharsElement = document.querySelector('.wrong-chars');
        if (wrongCharsElement) {
            wrongCharsElement.textContent = `Wrong: ${gameState.wrongChars}`;
            wrongCharsElement.classList.add('error');
        }
        
        // Leere das Eingabefeld
        document.getElementById('typingInput').value = '';
        
        // Setze das Wort zurück
        const practiceWordElement = document.querySelector('.practice-word');
        if (practiceWordElement) {
            practiceWordElement.innerHTML = `${gameState.nextMonster ? gameState.nextMonster.icon : '👾'} ${practiceWord}`;
        }
    }
    
    return false;
} 