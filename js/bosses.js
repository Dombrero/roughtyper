/**
 * bosses.js - Bosse für RoughType
 * Enthält die Funktionen für die Bosse des Spiels
 */

// Level 10 Boss (TYPEREX)
const level10Boss = {
    health: 10,
    activeWords: [],
    element: null,
    healthBarElement: null,
    lastSpawnTime: 0,
    maxProjectiles: 5,
    goldReward: 50,
    wordPool: [
        'fire', 'ice', 'thunder', 'earth', 'wind', 'water', 'light', 'dark',
        'blade', 'arrow', 'shield', 'magic', 'poison', 'heal', 'death', 'life'
    ]
};

/**
 * Initialisiert den Level 10 Boss
 */
function initLevel10Boss() {
    gameState.level10BossActive = true;
    level10Boss.health = 10; // Reset boss health
    level10Boss.activeWords = []; // Reset active words
    level10Boss.lastSpawnTime = 0;
    
    // Boss-Element erstellen
    const gameScene = document.getElementById('gameScene');
    const bossElement = document.createElement('div');
    bossElement.className = 'enemy-entity level10boss';
    bossElement.style.left = '100px';
    bossElement.style.top = '50px';
    bossElement.innerHTML = `<div class="enemy-word">TYPEREX</div>`;
    gameScene.appendChild(bossElement);
    level10Boss.element = bossElement;
    
    // Boss Health Bar erstellen
    const healthBar = document.createElement('div');
    healthBar.className = 'boss-health-bar';
    healthBar.innerHTML = `
        <div class="boss-health-fill"></div>
        <div class="boss-health-text">TYPEREX: 10/10</div>
    `;
    gameScene.appendChild(healthBar);
    level10Boss.healthBarElement = healthBar;
    
    // Erste Worte spawnen
    spawnBossWord();
    
    addCombatLogEntry('info', 'TYPEREX has appeared! Type the falling words to defeat it!');
}

/**
 * Spawnt ein Wort für den Level 10 Boss
 */
function spawnBossWord() {
    if (!gameState.level10BossActive || level10Boss.activeWords.length >= level10Boss.maxProjectiles) {
        return;
    }
    
    const gameScene = document.getElementById('gameScene');
    
    // Zufälliges Wort aus dem Pool auswählen
    const randomIndex = Math.floor(Math.random() * level10Boss.wordPool.length);
    const word = level10Boss.wordPool[randomIndex];
    
    // Projektil erstellen
    const projectile = document.createElement('div');
    projectile.className = 'boss-projectile';
    
    // Position unter dem Boss
    const bossRect = level10Boss.element.getBoundingClientRect();
    const gameSceneRect = gameScene.getBoundingClientRect();
    
    const startX = bossRect.left + bossRect.width / 2 - gameSceneRect.left;
    const startY = bossRect.top + bossRect.height - gameSceneRect.top;
    
    projectile.style.left = `${startX}px`;
    projectile.style.top = `${startY}px`;
    
    gameScene.appendChild(projectile);
    
    // Wort-Element erstellen
    const wordElement = document.createElement('div');
    wordElement.className = 'enemy-word';
    wordElement.textContent = word;
    wordElement.style.top = '-25px';
    projectile.appendChild(wordElement);
    
    // Wort zum aktiven Array hinzufügen
    level10Boss.activeWords.push({
        word: word.toLowerCase(),
        element: projectile,
        wordElement: wordElement,
        position: { x: startX, y: startY },
        speed: 40 + Math.random() * 20
    });
    
    // Nächstes Wort spawnen, wenn weniger als maxProjectiles aktiv sind
    if (level10Boss.activeWords.length < level10Boss.maxProjectiles) {
        setTimeout(spawnBossWord, 1000);
    }
}

/**
 * Entfernt ein Wort des Level 10 Bosses
 * @param {number} index - Der Index des Wortes im Array
 */
function removeBossWord(index) {
    const word = level10Boss.activeWords[index];
    if (word.element) {
        word.element.remove();
    }
    level10Boss.activeWords.splice(index, 1);
    
    // Neues Wort spawnen
    setTimeout(spawnBossWord, 500);
    
    // Boss-Gesundheit aktualisieren
    level10Boss.health--;
    updateBossHealthBar();
    
    // Prüfen, ob der Boss besiegt wurde
    if (level10Boss.health <= 0) {
        defeatLevel10Boss();
    }
}

/**
 * Aktualisiert die Gesundheitsanzeige des Level 10 Bosses
 */
function updateBossHealthBar() {
    if (!level10Boss.healthBarElement) return;
    
    const healthPercent = (level10Boss.health / 10) * 100;
    const healthFill = level10Boss.healthBarElement.querySelector('.boss-health-fill');
    const healthText = level10Boss.healthBarElement.querySelector('.boss-health-text');
    
    healthFill.style.width = `${healthPercent}%`;
    healthText.textContent = `TYPEREX: ${level10Boss.health}/10`;
}

/**
 * Besiegt den Level 10 Boss
 */
function defeatLevel10Boss() {
    gameState.level10BossActive = false;
    
    // Boss-Element entfernen
    if (level10Boss.element) {
        level10Boss.element.remove();
        level10Boss.element = null;
    }
    
    // Health Bar entfernen
    if (level10Boss.healthBarElement) {
        level10Boss.healthBarElement.remove();
        level10Boss.healthBarElement = null;
    }
    
    // Alle aktiven Worte entfernen
    level10Boss.activeWords.forEach(word => {
        if (word.element) {
            word.element.remove();
        }
    });
    level10Boss.activeWords = [];
    
    // Belohnungen
    gameState.gold += level10Boss.goldReward;
    gameState.score += 100;
    
    // Level erhöhen
    gameState.level++;
    gameState.maxLevel = Math.max(gameState.level, gameState.maxLevel);
    gameState.monstersKilled = 0;
    
    // Benachrichtigungen
    addCombatLogEntry('kill', `You defeated TYPEREX! Earned ${level10Boss.goldReward} gold!`);
    alert(`Boss defeated! You are now Level ${gameState.level}!`);
    
    // Nächstes Level starten
    spawnEnemy();
    updateDisplay();
    saveGameState();
}

/**
 * Aktualisiert den Level 10 Boss
 * @param {number} deltaTime - Die vergangene Zeit seit dem letzten Update
 */
function updateLevel10Boss(deltaTime) {
    // Bewege die aktiven Worte
    level10Boss.activeWords.forEach((word, index) => {
        // Bewege das Wort nach unten
        word.position.y += word.speed * (deltaTime / 1000);
        word.element.style.top = `${word.position.y}px`;
        
        // Prüfe, ob das Wort den Spieler erreicht hat
        const gameScene = document.getElementById('gameScene');
        const sceneHeight = gameScene.clientHeight;
        
        if (word.position.y > sceneHeight - 100) {
            // Spieler nimmt Schaden
            const damage = Math.max(1, 20 - gameState.defense);
            gameState.playerHealth -= damage;
            
            // Entferne das Wort
            word.element.remove();
            level10Boss.activeWords.splice(index, 1);
            
            // Spawne ein neues Wort
            setTimeout(spawnBossWord, 500);
            
            // Füge einen Eintrag zum Kampfprotokoll hinzu
            addCombatLogEntry('damage', `A boss projectile hit you! You take ${damage} damage.`);
            
            // Prüfe, ob der Spieler gestorben ist
            if (gameState.playerHealth <= 0) {
                gameOver();
            }
            
            // Aktualisiere die Anzeige
            updateDisplay();
        }
    });
}

/**
 * Verarbeitet die Eingabe für den Level 10 Boss
 * @param {string} typed - Der eingegebene Text
 * @param {Event} e - Das Eingabe-Event
 * @returns {boolean} - Gibt zurück, ob die Eingabe verarbeitet wurde
 */
function handleLevel10BossInput(typed, e) {
    if (typed.length === 0) return false;
    
    // Suche nach einem passenden Wort
    let targetWordIndex = -1;
    
    level10Boss.activeWords.forEach((word, index) => {
        if (word.word.startsWith(typed)) {
            // Markiere die korrekt eingegebenen Buchstaben
            let html = '';
            for (let i = 0; i < word.word.length; i++) {
                if (i < typed.length) {
                    html += `<span class="correct">${word.word[i]}</span>`;
                } else {
                    html += word.word[i];
                }
            }
            word.wordElement.innerHTML = html;
            
            // Wenn das Wort vollständig eingegeben wurde
            if (typed === word.word) {
                targetWordIndex = index;
            }
        } else {
            // Setze das Wort zurück
            word.wordElement.textContent = word.word;
        }
    });
    
    // Wenn ein Wort getroffen wurde
    if (targetWordIndex !== -1) {
        // Füge Punkte hinzu
        gameState.score += level10Boss.activeWords[targetWordIndex].word.length;
        
        // Füge einen Eintrag zum Kampfprotokoll hinzu
        addCombatLogEntry('kill', `You destroyed the boss projectile "${level10Boss.activeWords[targetWordIndex].word}"!`);
        
        // Entferne das Wort
        removeBossWord(targetWordIndex);
        
        // Leere das Eingabefeld
        e.target.value = '';
        
        return true;
    } else if (typed.length > 0) {
        // Falsche Eingabe - Schaden direkt mit Verteidigung reduzieren
        const baseDamage = 5; // Basis-Schaden bei Tippfehler (reduziert für Boss)
        const damage = Math.max(1, baseDamage - gameState.defense); // Verteidigung reduziert den Schaden direkt, mindestens 1 Schaden
        gameState.playerHealth -= damage;
        
        // Füge einen Eintrag zum Kampfprotokoll hinzu
        addCombatLogEntry('damage', `Wrong input! You take ${damage} damage.`);
        
        // Leere das Eingabefeld
        e.target.value = '';
        
        // Setze alle Wortanzeigen zurück
        level10Boss.activeWords.forEach(word => {
            word.wordElement.textContent = word.word;
        });
        
        // Prüfe, ob der Spieler gestorben ist
        if (gameState.playerHealth <= 0) {
            gameOver();
        }
        
        // Aktualisiere die Anzeige
        updateDisplay();
        
        return true;
    }
    
    return false;
} 