// Database_extender/mechanics.js
// Erweiterte Spielmechaniken für Level 11-19

// Funktion zum Initialisieren des Level 15 Bosses (CHRONOS)
function initLevel15Boss() {
    console.log('Initialisiere Level 15 Boss...');
    
    // Setze den Boss-Status
    gameState.level15BossActive = true;
    gameState.bossActive = true;
    
    // Initialisiere den Boss
    window.level15Boss = {
        health: 10,
        maxHealth: 10,
        gold: 500,
        activeWords: [],
        maxProjectiles: 5,
        wordPool: ["ZEIT", "PORTAL", "CHRONOS", "STUNDE", "MINUTE", "SEKUNDE", "UHRWERK", "PENDEL", "SANDUHR", "EWIGKEIT", "MOMENT", "PRESENT", "PAST", "FUTURE", "RIFT"],
        element: null,
        lastSpawnTime: 0,
        spawnInterval: 2000 // 2 Sekunden zwischen Wortspawns
    };
    
    // Erstelle das Boss-Element
    const gameContainer = document.getElementById('gameContainer');
    const bossElement = document.createElement('div');
    bossElement.id = 'level15Boss';
    bossElement.className = 'boss';
    bossElement.innerHTML = `
        <div class="boss-name">CHRONOS</div>
        <div class="boss-health-bar">
            <div class="boss-health-fill" style="width: 100%"></div>
        </div>
    `;
    
    // Positioniere den Boss
    bossElement.style.position = 'absolute';
    bossElement.style.top = '50px';
    bossElement.style.left = '50%';
    bossElement.style.transform = 'translateX(-50%)';
    bossElement.style.width = '200px';
    bossElement.style.height = '100px';
    bossElement.style.backgroundColor = 'rgba(148, 0, 211, 0.7)'; // Lila Farbe
    bossElement.style.color = 'white';
    bossElement.style.fontWeight = 'bold';
    bossElement.style.textAlign = 'center';
    bossElement.style.padding = '10px';
    bossElement.style.borderRadius = '10px';
    bossElement.style.boxShadow = '0 0 20px #9400d3';
    bossElement.style.zIndex = '100';
    
    // Füge den Boss zum Spielcontainer hinzu
    gameContainer.appendChild(bossElement);
    
    // Speichere das Boss-Element
    level15Boss.element = bossElement;
    
    // Füge einen Eintrag zum Kampflog hinzu
    addCombatLogEntry('boss', 'CHRONOS erscheint! "ICH BIN DER HERR DER ZEIT!"');
    
    // Aktualisiere die Gesundheitsanzeige
    updateLevel15BossHealth();
    
    console.log('Level 15 Boss erfolgreich initialisiert!');
}

// Funktion zum Erstellen eines Wortes für den Level 15 Boss
function spawnLevel15BossWord() {
    // Wenn der Boss nicht aktiv ist oder bereits genug Projektile hat, beende die Funktion
    if (!gameState.level15BossActive || level15Boss.activeWords.length >= level15Boss.maxProjectiles) {
        return;
    }
    
    // Wähle ein zufälliges Wort aus dem Wortpool
    const wordIndex = Math.floor(Math.random() * level15Boss.wordPool.length);
    const word = level15Boss.wordPool[wordIndex];
    
    console.log('Erstelle neues Wort für Level 15 Boss:', word);
    
    // Erstelle ein DOM-Element für das Wort
    const wordElement = document.createElement('div');
    wordElement.textContent = word;
    wordElement.className = 'level15-boss-word';
    wordElement.id = 'level15-boss-word-' + Date.now();
    
    // Stelle sicher, dass das Wort vollständig im Container sichtbar ist
    const gameContainer = document.getElementById('gameContainer');
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;
    
    // Positioniere das Wort zufällig im oberen Bereich des Spielfelds
    const x = Math.random() * (containerWidth - 100) + 50;
    const y = Math.random() * 100 + 100;
    
    // Setze die CSS-Eigenschaften für das Wort
    wordElement.style.position = 'absolute';
    wordElement.style.left = x + 'px';
    wordElement.style.top = y + 'px';
    wordElement.style.color = '#9932CC'; // Lila Farbe
    wordElement.style.fontWeight = 'bold';
    wordElement.style.fontSize = '24px';
    wordElement.style.textShadow = '0 0 5px #fff, 0 0 10px #fff';
    wordElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    wordElement.style.padding = '5px 10px';
    wordElement.style.borderRadius = '5px';
    wordElement.style.zIndex = '1000'; // Hoher z-index, um sicherzustellen, dass es über anderen Elementen liegt
    wordElement.style.pointerEvents = 'none'; // Verhindert, dass das Wort Mausklicks blockiert
    
    // Füge das Wort zum Spielcontainer hinzu
    gameContainer.appendChild(wordElement);
    
    // Berechne die Richtung und Geschwindigkeit des Wortes zum Spieler
    const playerElement = document.getElementById('player');
    let playerX = containerWidth / 2;
    let playerY = containerHeight - 100;
    
    if (playerElement) {
        const playerRect = playerElement.getBoundingClientRect();
        const containerRect = gameContainer.getBoundingClientRect();
        playerX = playerRect.left - containerRect.left + playerRect.width / 2;
        playerY = playerRect.top - containerRect.top + playerRect.height / 2;
    }
    
    // Berechne den Richtungsvektor zum Spieler
    const dx = playerX - x;
    const dy = playerY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalisiere den Richtungsvektor und multipliziere mit der Geschwindigkeit
    const speed = 1.0;
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;
    
    // Erstelle ein Wortobjekt und füge es zur Liste der aktiven Wörter hinzu
    const wordObj = {
        word: word,
        element: wordElement,
        x: x,
        y: y,
        vx: vx,
        vy: vy
    };
    
    level15Boss.activeWords.push(wordObj);
    level15Boss.lastSpawnTime = Date.now();
}

// Funktion zum Entfernen eines Wortes des Level 15 Bosses
function removeLevel15BossWord(index) {
    // Stelle sicher, dass der Index gültig ist
    if (index < 0 || index >= level15Boss.activeWords.length) {
        console.error('Ungültiger Index für removeLevel15BossWord:', index);
        return;
    }
    
    // Hole das Wortobjekt
    const wordObj = level15Boss.activeWords[index];
    
    console.log('Entferne Wort:', wordObj.word);
    
    // Entferne das DOM-Element, wenn es existiert
    if (wordObj.element && wordObj.element.parentNode) {
        wordObj.element.parentNode.removeChild(wordObj.element);
    }
    
    // Entferne das Wortobjekt aus dem Array
    level15Boss.activeWords.splice(index, 1);
}

// Funktion zum Aktualisieren der Gesundheitsanzeige des Level 15 Bosses
function updateLevel15BossHealth() {
    // Stelle sicher, dass der Boss aktiv ist
    if (!gameState.level15BossActive) {
        return;
    }
    
    // Stelle sicher, dass das Boss-Element existiert
    if (!level15Boss.element) {
        console.error('Boss-Element nicht gefunden!');
        return;
    }
    
    // Finde die Gesundheitsanzeige
    const healthFill = level15Boss.element.querySelector('.boss-health-fill');
    if (!healthFill) {
        console.error('Gesundheitsanzeige nicht gefunden!');
        return;
    }
    
    // Berechne den Prozentsatz der verbleibenden Gesundheit
    const healthPercent = (level15Boss.health / level15Boss.maxHealth) * 100;
    
    // Aktualisiere die Breite der Gesundheitsanzeige
    healthFill.style.width = healthPercent + '%';
    
    // Ändere die Farbe der Gesundheitsanzeige basierend auf dem Gesundheitszustand
    if (healthPercent > 66) {
        healthFill.style.backgroundColor = '#00ff00'; // Grün
    } else if (healthPercent > 33) {
        healthFill.style.backgroundColor = '#ffff00'; // Gelb
    } else {
        healthFill.style.backgroundColor = '#ff0000'; // Rot
    }
    
    // Aktualisiere den Text der Boss-Anzeige
    const bossName = level15Boss.element.querySelector('.boss-name');
    if (bossName) {
        bossName.textContent = `CHRONOS (${level15Boss.health}/${level15Boss.maxHealth})`;
    }
}

// Funktion zum Besiegen des Level 15 Bosses
function defeatLevel15Boss() {
    console.log('Level 15 Boss besiegt!');
    
    // Stelle sicher, dass der Boss aktiv ist
    if (!gameState.level15BossActive) {
        console.error('Level 15 Boss ist nicht aktiv!');
        return;
    }
    
    // Deaktiviere den Boss
    gameState.level15BossActive = false;
    gameState.bossActive = false;
    
    // Entferne alle aktiven Wörter
    while (level15Boss.activeWords.length > 0) {
        removeLevel15BossWord(0);
    }
    
    // Entferne das Boss-Element
    if (level15Boss.element && level15Boss.element.parentNode) {
        level15Boss.element.parentNode.removeChild(level15Boss.element);
    }
    
    // Füge Gold hinzu
    gameState.gold += level15Boss.gold;
    
    // Füge einen Eintrag zum Kampflog hinzu
    addCombatLogEntry('victory', `Du hast CHRONOS besiegt! +${level15Boss.gold} Gold!`);
    
    // Aktualisiere die Anzeige
    updateDisplay();
    
    // Speichere den Spielstand
    saveGameState();
    
    // Prüfe, ob der Spieler das Level abgeschlossen hat
    if (gameState.level === 15) {
        // Erhöhe das Level
        levelUp();
    }
}

// Funktion zum Aktualisieren der Wörter des Level 15 Bosses
function updateLevel15BossWords() {
    // Wenn der Boss nicht aktiv ist, beende die Funktion
    if (!gameState.level15BossActive) {
        return;
    }
    
    // Hole die Dimensionen des Spielcontainers
    const gameContainer = document.getElementById('gameContainer');
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;
    
    // Hole die Position des Spielers
    const playerElement = document.getElementById('player');
    let playerX = containerWidth / 2;
    let playerY = containerHeight - 100;
    
    if (playerElement) {
        const playerRect = playerElement.getBoundingClientRect();
        const containerRect = gameContainer.getBoundingClientRect();
        playerX = playerRect.left - containerRect.left + playerRect.width / 2;
        playerY = playerRect.top - containerRect.top + playerRect.height / 2;
    }
    
    // Durchlaufe alle aktiven Wörter rückwärts, um sie sicher entfernen zu können
    for (let i = level15Boss.activeWords.length - 1; i >= 0; i--) {
        const wordObj = level15Boss.activeWords[i];
        
        // Aktualisiere die Position des Wortes
        wordObj.x += wordObj.vx;
        wordObj.y += wordObj.vy;
        
        // Aktualisiere die Position des DOM-Elements
        wordObj.element.style.left = wordObj.x + 'px';
        wordObj.element.style.top = wordObj.y + 'px';
        
        // Überprüfe, ob das Wort den Spieler getroffen hat
        const wordWidth = wordObj.element.offsetWidth;
        const wordHeight = wordObj.element.offsetHeight;
        const wordCenterX = wordObj.x + wordWidth / 2;
        const wordCenterY = wordObj.y + wordHeight / 2;
        
        // Berechne den Abstand zwischen dem Wort und dem Spieler
        const dx = wordCenterX - playerX;
        const dy = wordCenterY - playerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Wenn das Wort den Spieler getroffen hat
        if (distance < 30) { // Angenommener Kollisionsradius
            console.log('Spieler wurde von Wort getroffen:', wordObj.word);
            
            // Füge einen Eintrag zum Kampflog hinzu
            addCombatLogEntry('damage', `Du wurdest von "${wordObj.word}" getroffen!`);
            
            // Füge Schaden hinzu
            takeDamage(10);
            
            // Entferne das Wort
            removeLevel15BossWord(i);
            continue;
        }
        
        // Überprüfe, ob das Wort außerhalb des Spielbereichs ist
        if (wordObj.x < -wordWidth || wordObj.x > containerWidth || 
            wordObj.y < -wordHeight || wordObj.y > containerHeight) {
            console.log('Wort außerhalb des Spielbereichs:', wordObj.word);
            
            // Entferne das Wort
            removeLevel15BossWord(i);
            continue;
        }
    }
    
    // Wenn der Boss aktiv ist und nicht genug Wörter hat, erstelle ein neues Wort
    if (gameState.level15BossActive && level15Boss.activeWords.length < level15Boss.maxProjectiles) {
        const currentTime = Date.now();
        if (currentTime - level15Boss.lastSpawnTime > level15Boss.spawnInterval) {
            spawnLevel15BossWord();
        }
    }
}

// Funktion zum Aktualisieren der Level 15 Boss Mechanik im Game Loop
function updateLevel15Boss() {
    // Wenn der Boss nicht aktiv ist, beende die Funktion
    if (!gameState.level15BossActive) {
        return;
    }
    
    // Aktualisiere die Wörter des Bosses
    updateLevel15BossWords();
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
        updateLevel19Boss,
        updateLevel15BossWords
    };
} 