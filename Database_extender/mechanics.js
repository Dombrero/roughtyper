// Database_extender/mechanics.js
// Erweiterte Spielmechaniken für Level 11-19

// Funktion zum Initialisieren des Level 15 Bosses (CHRONOS)
function initLevel15Boss() {
    gameState.level15BossActive = true;
    level15Boss.health = 15; // Reset boss health
    level15Boss.activeWords = []; // Reset active words
    level15Boss.lastSpawnTime = 0;
    level15Boss.lastTimeshiftTime = 0;

    // Erstelle das Boss-Element
    const gameScene = document.getElementById('gameScene');
    const bossElement = document.createElement('div');
    bossElement.className = 'enemy-entity level15boss';
    bossElement.innerHTML = `
        <div class="boss-icon">⏳</div>
        <div class="boss-name">CHRONOS</div>
    `;
    bossElement.style.position = 'absolute';
    bossElement.style.top = '50px';
    bossElement.style.left = '50%';
    bossElement.style.transform = 'translateX(-50%)';
    gameScene.appendChild(bossElement);
    level15Boss.element = bossElement;

    // Erstelle die Health Bar
    const healthBar = document.createElement('div');
    healthBar.className = 'boss-health-bar';
    healthBar.innerHTML = `
        <div class="boss-health-fill" style="width: 100%;"></div>
        <div class="boss-health-text">CHRONOS: 15/15</div>
    `;
    healthBar.style.position = 'absolute';
    healthBar.style.top = '10px';
    healthBar.style.left = '50%';
    healthBar.style.transform = 'translateX(-50%)';
    healthBar.style.width = '80%';
    gameScene.appendChild(healthBar);
    level15Boss.healthBarElement = healthBar;

    // Füge eine Nachricht zum Combat Log hinzu
    addCombatLogEntry('boss', 'CHRONOS erscheint! Tippe die Worte, die er auf dich wirft!');
    addCombatLogEntry('info', 'CHRONOS kann die Zeit manipulieren und die Geschwindigkeit seiner Worte erhöhen!');
}

// Funktion zum Spawnen eines Wortes für den Level 15 Boss
function spawnLevel15BossWord() {
    if (!gameState.level15BossActive || level15Boss.activeWords.length >= level15Boss.maxProjectiles) {
        return;
    }

    // Wähle ein zufälliges Wort aus dem Wortpool
    const randomIndex = Math.floor(Math.random() * level15Boss.wordPool.length);
    const word = level15Boss.wordPool[randomIndex];

    // Erstelle das Wort-Element
    const gameScene = document.getElementById('gameScene');
    const gameContainer = document.getElementById('gameContainer');
    const wordElement = document.createElement('div');
    wordElement.className = 'enemy-word level15boss-word';
    wordElement.textContent = word;
    
    // Füge das Element zum DOM hinzu, um seine Größe zu messen
    wordElement.style.position = 'absolute';
    wordElement.style.visibility = 'hidden'; // Verstecke es zunächst
    gameScene.appendChild(wordElement);
    
    // Messe die Größe des Wortelements
    const wordRect = wordElement.getBoundingClientRect();
    const wordWidth = wordRect.width;
    
    // Positioniere das Wort beim Boss
    const bossRect = level15Boss.element.getBoundingClientRect();
    const bossCenter = bossRect.left + bossRect.width / 2;
    
    // Stelle sicher, dass das Wort vollständig im Spielfeld ist
    const minX = wordWidth / 2; // Mindestabstand vom linken Rand
    const maxX = gameContainer.offsetWidth - wordWidth / 2; // Maximalabstand vom linken Rand
    
    // Begrenze die X-Position, damit das Wort vollständig sichtbar ist
    const startX = Math.max(minX, Math.min(maxX, bossCenter));
    
    // Mache das Wort sichtbar und positioniere es
    wordElement.style.visibility = 'visible';
    wordElement.style.left = `${startX - wordWidth / 2}px`; // Zentriere das Wort
    wordElement.style.top = `${bossRect.bottom + 10}px`;

    // Berechne die Richtung zum Spieler
    const playerElement = document.getElementById('player');
    const playerRect = playerElement.getBoundingClientRect();
    const playerX = playerRect.left + playerRect.width / 2;
    const playerY = playerRect.top;
    
    // Berechne den Winkel zum Spieler
    const deltaX = playerX - startX;
    const deltaY = playerY - (bossRect.bottom + 10);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX);
    
    // Berechne die Geschwindigkeitskomponenten (noch langsamer)
    const baseSpeed = 0.3 + Math.random() * 0.2; // Stark reduzierte Basisgeschwindigkeit
    const speedX = Math.cos(angle) * baseSpeed;
    const speedY = Math.sin(angle) * baseSpeed;

    // Füge das Wort zur Liste der aktiven Worte hinzu
    level15Boss.activeWords.push({
        word: word,
        element: wordElement,
        position: { x: startX - wordWidth / 2, y: bossRect.bottom + 10 },
        velocity: { x: speedX, y: speedY }, // Geschwindigkeitsvektor
        speed: baseSpeed, // Basisgeschwindigkeit für Timeshift
        timeShifted: false,
        width: wordWidth // Speichere die Breite des Wortes
    });

    // Versuche, ein weiteres Wort zu spawnen, wenn noch Platz ist
    if (level15Boss.activeWords.length < level15Boss.maxProjectiles) {
        setTimeout(spawnLevel15BossWord, 1000 + Math.random() * 1000);
    }
}

// Funktion zum Entfernen eines Wortes des Level 15 Bosses
function removeLevel15BossWord(index) {
    const word = level15Boss.activeWords[index];
    if (word.element) {
        word.element.remove();
    }
    level15Boss.activeWords.splice(index, 1);
}

// Funktion zum Aktualisieren der Health Bar des Level 15 Bosses
function updateLevel15BossHealth() {
    if (!level15Boss.healthBarElement) return;

    const healthPercent = (level15Boss.health / 15) * 100;
    const healthFill = level15Boss.healthBarElement.querySelector('.boss-health-fill');
    const healthText = level15Boss.healthBarElement.querySelector('.boss-health-text');
    
    healthFill.style.width = `${healthPercent}%`;
    healthText.textContent = `CHRONOS: ${level15Boss.health}/15`;
}

// Funktion zum Besiegen des Level 15 Bosses
function defeatLevel15Boss() {
    gameState.level15BossActive = false;

    // Entferne das Boss-Element
    if (level15Boss.element) {
        level15Boss.element.remove();
        level15Boss.element = null;
    }

    // Entferne die Health Bar
    if (level15Boss.healthBarElement) {
        level15Boss.healthBarElement.remove();
        level15Boss.healthBarElement = null;
    }

    // Entferne alle aktiven Worte
    level15Boss.activeWords.forEach(word => {
        if (word.element) {
            word.element.remove();
        }
    });
    level15Boss.activeWords = [];

    // Belohne den Spieler
    gameState.gold += level15Boss.goldReward;
    gameState.score += 150;

    // Level Up
    gameState.level++;
    gameState.maxLevel = Math.max(gameState.level, gameState.maxLevel);
    gameState.monstersKilled = 0;

    // Benachrichtige den Spieler
    alert(`Boss besiegt! Du bist jetzt Level ${gameState.level}!`);
    addCombatLogEntry('kill', `Du hast CHRONOS besiegt! ${level15Boss.goldReward} Gold erhalten!`);

    // Speichere den Spielstand
    saveGameState();
}

// Funktion zum Initialisieren des Level 19 Bosses (NEMESIS)
function initLevel19Boss() {
    gameState.level19BossActive = true;
    level19Boss.health = 20; // Reset boss health
    level19Boss.activeWords = []; // Reset active words
    level19Boss.lastSpawnTime = 0;
    level19Boss.mirroredWords = []; // Liste der gespiegelten Worte

    // Erstelle das Boss-Element
    const gameScene = document.getElementById('gameScene');
    const bossElement = document.createElement('div');
    bossElement.className = 'enemy-entity level19boss';
    bossElement.innerHTML = `
        <div class="boss-icon">⚖️</div>
        <div class="boss-name">NEMESIS</div>
    `;
    bossElement.style.position = 'absolute';
    bossElement.style.top = '50px';
    bossElement.style.left = '50%';
    bossElement.style.transform = 'translateX(-50%)';
    gameScene.appendChild(bossElement);
    level19Boss.element = bossElement;

    // Erstelle die Health Bar
    const healthBar = document.createElement('div');
    healthBar.className = 'boss-health-bar';
    healthBar.innerHTML = `
        <div class="boss-health-fill" style="width: 100%;"></div>
        <div class="boss-health-text">NEMESIS: 20/20</div>
    `;
    healthBar.style.position = 'absolute';
    healthBar.style.top = '10px';
    healthBar.style.left = '50%';
    healthBar.style.transform = 'translateX(-50%)';
    healthBar.style.width = '80%';
    gameScene.appendChild(healthBar);
    level19Boss.healthBarElement = healthBar;

    // Füge eine Nachricht zum Combat Log hinzu
    addCombatLogEntry('boss', 'NEMESIS erscheint! Tippe die Worte, die sie auf dich wirft!');
    addCombatLogEntry('info', 'NEMESIS kann Worte spiegeln und Schaden reflektieren!');
}

// Funktion zum Spawnen eines Wortes für den Level 19 Boss
function spawnLevel19BossWord() {
    if (!gameState.level19BossActive || level19Boss.activeWords.length >= level19Boss.maxProjectiles) {
        return;
    }

    // Wähle ein zufälliges Wort aus dem Wortpool
    const randomIndex = Math.floor(Math.random() * level19Boss.wordPool.length);
    let word = level19Boss.wordPool[randomIndex];
    
    // Prüfe, ob das Wort gespiegelt werden soll
    const isMirrored = Math.random() < level19Boss.mirrorChance;
    if (isMirrored) {
        // Spiegele das Wort
        word = word.split('').reverse().join('');
        level19Boss.mirroredWords.push(word);
    }

    // Erstelle das Wort-Element
    const gameScene = document.getElementById('gameScene');
    const wordElement = document.createElement('div');
    wordElement.className = 'enemy-word level19boss-word';
    if (isMirrored) {
        wordElement.classList.add('mirrored');
    }
    wordElement.textContent = word;

    // Positioniere das Wort zufällig oben
    const bossRect = level19Boss.element.getBoundingClientRect();
    const startX = bossRect.left + bossRect.width / 2 - 50 + Math.random() * 100;
    
    wordElement.style.position = 'absolute';
    wordElement.style.left = `${startX}px`;
    wordElement.style.top = `${bossRect.bottom + 10}px`;
    gameScene.appendChild(wordElement);

    // Füge das Wort zur Liste der aktiven Worte hinzu
    level19Boss.activeWords.push({
        word: word,
        element: wordElement,
        position: { x: startX, y: bossRect.bottom + 10 },
        speed: 1 + Math.random() * 0.5, // Zufällige Geschwindigkeit
        isMirrored: isMirrored
    });

    // Versuche, ein weiteres Wort zu spawnen, wenn noch Platz ist
    if (level19Boss.activeWords.length < level19Boss.maxProjectiles) {
        setTimeout(spawnLevel19BossWord, 1000 + Math.random() * 1000);
    }
}

// Funktion zum Entfernen eines Wortes des Level 19 Bosses
function removeLevel19BossWord(index) {
    const word = level19Boss.activeWords[index];
    if (word.element) {
        word.element.remove();
    }
    level19Boss.activeWords.splice(index, 1);
}

// Funktion zum Aktualisieren der Health Bar des Level 19 Bosses
function updateLevel19BossHealth() {
    if (!level19Boss.healthBarElement) return;

    const healthPercent = (level19Boss.health / 20) * 100;
    const healthFill = level19Boss.healthBarElement.querySelector('.boss-health-fill');
    const healthText = level19Boss.healthBarElement.querySelector('.boss-health-text');
    
    healthFill.style.width = `${healthPercent}%`;
    healthText.textContent = `NEMESIS: ${level19Boss.health}/20`;
}

// Funktion zum Besiegen des Level 19 Bosses
function defeatLevel19Boss() {
    gameState.level19BossActive = false;

    // Entferne das Boss-Element
    if (level19Boss.element) {
        level19Boss.element.remove();
        level19Boss.element = null;
    }

    // Entferne die Health Bar
    if (level19Boss.healthBarElement) {
        level19Boss.healthBarElement.remove();
        level19Boss.healthBarElement = null;
    }

    // Entferne alle aktiven Worte
    level19Boss.activeWords.forEach(word => {
        if (word.element) {
            word.element.remove();
        }
    });
    level19Boss.activeWords = [];

    // Belohne den Spieler
    gameState.gold += level19Boss.goldReward;
    gameState.score += 200;

    // Level Up
    gameState.level++;
    gameState.maxLevel = Math.max(gameState.level, gameState.maxLevel);
    gameState.monstersKilled = 0;

    // Benachrichtige den Spieler
    alert(`Boss besiegt! Du bist jetzt Level ${gameState.level}!`);
    addCombatLogEntry('kill', `Du hast NEMESIS besiegt! ${level19Boss.goldReward} Gold erhalten!`);

    // Speichere den Spielstand
    saveGameState();
}

// Funktion zum Aktualisieren der Level 15 Boss Mechanik im Game Loop
function updateLevel15Boss(timestamp) {
    if (!gameState.level15BossActive) return;

    // Spawne neue Worte
    if (timestamp - level15Boss.lastSpawnTime > 3000 && level15Boss.activeWords.length < level15Boss.maxProjectiles) {
        spawnLevel15BossWord();
        level15Boss.lastSpawnTime = timestamp;
    }

    // Zeitverschiebung (Timeshift) - erhöht die Geschwindigkeit der Worte
    if (timestamp - level15Boss.lastTimeshiftTime > level15Boss.timeshiftInterval) {
        // Aktiviere Timeshift
        addCombatLogEntry('boss', 'CHRONOS manipuliert die Zeit! Die Worte bewegen sich schneller!');
        
        level15Boss.activeWords.forEach(word => {
            if (!word.timeShifted) {
                // Erhöhe die Geschwindigkeit
                word.velocity.x *= level15Boss.speedMultiplier;
                word.velocity.y *= level15Boss.speedMultiplier;
                word.timeShifted = true;
                
                // Visueller Effekt für Timeshift
                if (word.element) {
                    word.element.style.color = '#ff00ff';
                    word.element.style.textShadow = '0 0 5px #ff00ff';
                }
            }
        });
        
        level15Boss.lastTimeshiftTime = timestamp;
    }

    // Bewege die Worte
    for (let i = level15Boss.activeWords.length - 1; i >= 0; i--) {
        const word = level15Boss.activeWords[i];
        
        // Aktualisiere die Position basierend auf der Geschwindigkeit
        word.position.x += word.velocity.x;
        word.position.y += word.velocity.y;
        
        if (word.element) {
            word.element.style.left = `${word.position.x}px`;
            word.element.style.top = `${word.position.y}px`;
        }
        
        // Prüfe, ob das Wort den Spieler erreicht hat
        const playerElement = document.getElementById('player');
        const playerRect = playerElement.getBoundingClientRect();
        
        // Verbesserte Kollisionserkennung mit dem Spieler
        if (word.position.y + 20 > playerRect.top && // Wort ist unterhalb der Oberkante des Spielers
            word.position.y < playerRect.bottom && // Wort ist oberhalb der Unterkante des Spielers
            word.position.x + word.width > playerRect.left && // Rechte Kante des Wortes ist rechts von der linken Kante des Spielers
            word.position.x < playerRect.right) { // Linke Kante des Wortes ist links von der rechten Kante des Spielers
            
            // Spieler nimmt Schaden
            gameState.playerHealth -= 20;
            addCombatLogEntry('damage', `Du wurdest von "${word.word}" getroffen! -20 HP`);
            
            // Entferne das Wort
            removeLevel15BossWord(i);
            
            // Prüfe, ob der Spieler tot ist
            if (gameState.playerHealth <= 0) {
                gameOver();
                return;
            }
            
            // Aktualisiere die Anzeige
            updateDisplay();
            continue; // Überspringe den Rest der Schleife für dieses Wort
        }
        
        // Prüfe, ob das Wort außerhalb des Bildschirms ist
        const gameContainer = document.getElementById('gameContainer');
        const containerRect = gameContainer.getBoundingClientRect();
        
        // Verbesserte Erkennung für Wörter außerhalb des Spielfelds
        if (word.position.x + word.width < containerRect.left || // Wort ist links vom Spielfeld
            word.position.x > containerRect.right || // Wort ist rechts vom Spielfeld
            word.position.y + 30 < containerRect.top || // Wort ist oberhalb des Spielfelds
            word.position.y > containerRect.bottom) { // Wort ist unterhalb des Spielfelds
            
            // Entferne das Wort
            removeLevel15BossWord(i);
        }
    }
}

// Funktion zum Aktualisieren der Level 19 Boss Mechanik im Game Loop
function updateLevel19Boss(timestamp) {
    if (!gameState.level19BossActive) return;

    // Spawne neue Worte
    if (timestamp - level19Boss.lastSpawnTime > 3000 && level19Boss.activeWords.length < level19Boss.maxProjectiles) {
        spawnLevel19BossWord();
        level19Boss.lastSpawnTime = timestamp;
    }

    // Bewege die Worte
    for (let i = level19Boss.activeWords.length - 1; i >= 0; i--) {
        const word = level19Boss.activeWords[i];
        word.position.y += word.speed;
        
        if (word.element) {
            word.element.style.top = `${word.position.y}px`;
        }
        
        // Prüfe, ob das Wort den Spieler erreicht hat
        if (word.position.y > gameState.playerPosition.y - 40) {
            // Spieler nimmt Schaden
            let damage = 20;
            
            // Gespiegelte Worte verursachen mehr Schaden
            if (word.isMirrored) {
                damage = 30;
                addCombatLogEntry('damage', `Du wurdest von einem gespiegelten Wort "${word.word}" getroffen! -30 HP`);
            } else {
                addCombatLogEntry('damage', `Du wurdest von "${word.word}" getroffen! -20 HP`);
            }
            
            gameState.playerHealth -= damage;
            
            // Entferne das Wort
            removeLevel19BossWord(i);
            
            // Prüfe, ob der Spieler tot ist
            if (gameState.playerHealth <= 0) {
                gameOver();
                return;
            }
            
            // Aktualisiere die Anzeige
            updateDisplay();
        }
    }
}

// Exportiere die Funktionen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initLevel15Boss,
        spawnLevel15BossWord,
        removeLevel15BossWord,
        updateLevel15BossHealth,
        defeatLevel15Boss,
        initLevel19Boss,
        spawnLevel19BossWord,
        removeLevel19BossWord,
        updateLevel19BossHealth,
        defeatLevel19Boss,
        updateLevel15Boss,
        updateLevel19Boss
    };
} 