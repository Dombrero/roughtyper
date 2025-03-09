// Database_extender/mechanics.js
// Erweiterte Spielmechaniken für Level 11-20

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

// Funktion zum Initialisieren des Level 20 Bosses (CHRONOS)
function initLevel20Boss() {
    console.log('Initialisiere Level 20 Boss...');
    
    // Setze den Boss-Status
    gameState.level20BossActive = true;
    gameState.bossActive = true;
    
    // Initialisiere den Boss
    window.level20Boss = {
        name: 'CHRONOS',
        health: 10, // 10 Worte zum Besiegen
        maxHealth: 10,
        goldReward: 500,
        activeWords: [],
        maxProjectiles: 2, // Zwei Worte gleichzeitig
        wordPool: [
            'ZEIT', 'PORTAL', 'CHRONOS', 'STUNDE', 'MINUTE', 'SEKUNDE', 'UHRWERK', 'PENDEL', 'SANDUHR', 'EWIGKEIT', 'MOMENT', 'PRESENT', 'PAST', 'FUTURE', 'RIFT'
        ],
        element: null,
        healthBarElement: null,
        direction: 1,
        position: { x: 100, y: 50 },
        lastSpawnTime: 0,
        timeReversalActive: false,
        lastTimeReversal: 0,
        timeReversalInterval: 5000 // 5 Sekunden zwischen globalen Zeitumkehrungen
    };
    
    // Erstelle das Boss-Element
    const gameScene = document.getElementById('gameScene');
    if (!gameScene) {
        console.error('gameScene nicht gefunden!');
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            // Erstelle gameScene, falls es nicht existiert
            const newGameScene = document.createElement('div');
            newGameScene.id = 'gameScene';
            newGameScene.style.width = '100%';
            newGameScene.style.height = '100%';
            newGameScene.style.position = 'relative';
            gameContainer.appendChild(newGameScene);
            console.log('gameScene erstellt');
        } else {
            console.error('Auch gameContainer nicht gefunden!');
            return;
        }
    }
    
    const sceneElement = document.getElementById('gameScene') || document.getElementById('gameContainer');
    
    const bossElement = document.createElement('div');
    bossElement.className = 'enemy-entity boss level20-boss';
    bossElement.style.width = '120px';
    bossElement.style.height = '120px';
    bossElement.style.backgroundColor = '#9400d3'; // Lila Farbe
    bossElement.style.borderRadius = '50%';
    bossElement.style.position = 'absolute';
    bossElement.style.top = '50px';
    bossElement.style.left = '100px';
    bossElement.style.display = 'flex';
    bossElement.style.justifyContent = 'center';
    bossElement.style.alignItems = 'center';
    bossElement.style.color = 'white';
    bossElement.style.fontWeight = 'bold';
    bossElement.style.fontSize = '24px';
    bossElement.style.boxShadow = '0 0 20px #9400d3';
    bossElement.style.zIndex = '100';
    bossElement.innerHTML = 'CHRONOS';
    
    // Füge den Boss zum Spielfeld hinzu
    sceneElement.appendChild(bossElement);
    level20Boss.element = bossElement;
    
    // Erstelle die Gesundheitsanzeige
    const healthBar = document.createElement('div');
    healthBar.className = 'boss-health-bar';
    healthBar.style.position = 'absolute';
    healthBar.style.top = '10px';
    healthBar.style.left = '50%';
    healthBar.style.transform = 'translateX(-50%)';
    healthBar.style.width = '80%';
    healthBar.style.height = '20px';
    healthBar.style.backgroundColor = '#333';
    healthBar.style.borderRadius = '10px';
    healthBar.style.overflow = 'hidden';
    healthBar.style.zIndex = '101';
    
    const healthFill = document.createElement('div');
    healthFill.className = 'boss-health-fill';
    healthFill.style.width = '100%';
    healthFill.style.height = '100%';
    healthFill.style.backgroundColor = '#00ff00';
    healthFill.style.transition = 'width 0.3s';
    
    const healthText = document.createElement('div');
    healthText.className = 'boss-health-text';
    healthText.style.position = 'absolute';
    healthText.style.top = '0';
    healthText.style.left = '0';
    healthText.style.width = '100%';
    healthText.style.height = '100%';
    healthText.style.display = 'flex';
    healthText.style.justifyContent = 'center';
    healthText.style.alignItems = 'center';
    healthText.style.color = 'white';
    healthText.style.fontWeight = 'bold';
    healthText.style.textShadow = '1px 1px 2px black';
    healthText.textContent = 'CHRONOS: 10/10';
    
    healthBar.appendChild(healthFill);
    healthBar.appendChild(healthText);
    sceneElement.appendChild(healthBar);
    level20Boss.healthBarElement = healthBar;
    
    // Füge einen Eintrag zum Kampflog hinzu
    addCombatLogEntry('boss', 'CHRONOS erscheint! "ICH BIN DER HERR DER ZEIT!"');
    addCombatLogEntry('info', 'BOSS BATTLE! Besiege CHRONOS, indem du alle Wörter tippst, die er auf dich wirft!');
    
    // Starte das Spawnen von Wörtern
    spawnLevel20BossWord();
    
    console.log('Level 20 Boss erfolgreich initialisiert!');
}

// Funktion zum Erstellen eines Wortes für den Level 20 Boss
function spawnLevel20BossWord() {
    if (!gameState.level20BossActive || !level20Boss) {
        console.error('Level 20 Boss ist nicht aktiv oder nicht definiert!');
        return;
    }
    
    if (level20Boss.activeWords.length >= level20Boss.maxProjectiles) {
        return;
    }
    
    // Wähle ein zufälliges Wort aus dem Wortpool
    const wordIndex = Math.floor(Math.random() * level20Boss.wordPool.length);
    const word = level20Boss.wordPool[wordIndex];
    
    console.log('Erstelle neues Wort für Level 20 Boss:', word);
    
    // Finde das gameScene-Element
    const sceneElement = document.getElementById('gameScene') || document.getElementById('gameContainer');
    if (!sceneElement) {
        console.error('Kein gameScene oder gameContainer gefunden!');
        return;
    }
    
    // Erstelle das Wort-Element
    const wordElement = document.createElement('div');
    wordElement.className = 'enemy-word level20-boss-word';
    wordElement.textContent = word;
    wordElement.style.position = 'absolute';
    wordElement.style.color = 'white';
    wordElement.style.fontWeight = 'bold';
    wordElement.style.fontSize = '20px';
    wordElement.style.backgroundColor = 'rgba(148, 0, 211, 0.7)'; // Lila Farbe mit Transparenz
    wordElement.style.padding = '5px 10px';
    wordElement.style.borderRadius = '5px';
    wordElement.style.boxShadow = '0 0 10px #9400d3';
    wordElement.style.zIndex = '99';
    
    // Positioniere das Wort beim Boss
    let startX = 100;
    let startY = 100;
    
    if (level20Boss.element) {
        const bossRect = level20Boss.element.getBoundingClientRect();
        const sceneRect = sceneElement.getBoundingClientRect();
        startX = bossRect.left - sceneRect.left + bossRect.width / 2;
        startY = bossRect.top - sceneRect.top + bossRect.height / 2;
    }
    
    wordElement.style.left = startX + 'px';
    wordElement.style.top = startY + 'px';
    
    sceneElement.appendChild(wordElement);
    
    // Berechne die Richtung zum Spieler
    const playerElement = document.getElementById('player');
    let targetX = sceneElement.offsetWidth / 2;
    let targetY = sceneElement.offsetHeight - 100;
    
    if (playerElement) {
        const playerRect = playerElement.getBoundingClientRect();
        const sceneRect = sceneElement.getBoundingClientRect();
        targetX = playerRect.left - sceneRect.left + playerRect.width / 2;
        targetY = playerRect.top - sceneRect.top + playerRect.height / 2;
    }
    
    // Berechne den Richtungsvektor
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalisiere den Vektor und setze die Geschwindigkeit
    const speed = 1.0; // Langsame Geschwindigkeit
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;
    
    // Füge das Wort zur Liste der aktiven Wörter hinzu
    level20Boss.activeWords.push({
        word: word,
        element: wordElement,
        position: { x: startX, y: startY },
        velocity: { x: vx, y: vy },
        originalVelocity: { x: vx, y: vy },
        reverseTime: 0,
        isReversing: false,
        lastReverseTime: 0
    });
    
    // Aktualisiere den Zeitpunkt des letzten Spawns
    level20Boss.lastSpawnTime = Date.now();
    
    // Spawne ein weiteres Wort nach kurzer Zeit
    if (level20Boss.activeWords.length < level20Boss.maxProjectiles) {
        setTimeout(spawnLevel20BossWord, 500); // Schnell hintereinander (500ms)
    }
}

// Funktion zum Entfernen eines Wortes des Level 20 Bosses
function removeLevel20BossWord(index) {
    const word = level20Boss.activeWords[index];
    
    // Entferne das DOM-Element
    if (word.element && word.element.parentNode) {
        word.element.parentNode.removeChild(word.element);
    }
    
    // Entferne das Wort aus dem Array
    level20Boss.activeWords.splice(index, 1);
    
    // Spawne ein neues Wort nach einer kurzen Verzögerung
    setTimeout(() => {
        if (gameState.level20BossActive && level20Boss.activeWords.length < level20Boss.maxProjectiles) {
            spawnLevel20BossWord();
        }
    }, 1000);
}

// Funktion zum Aktualisieren der Gesundheitsanzeige des Level 20 Bosses
function updateLevel20BossHealth() {
    if (!level20Boss.healthBarElement) return;
    
    // Berechne den Prozentsatz der verbleibenden Gesundheit
    const healthPercent = (level20Boss.health / level20Boss.maxHealth) * 100;
    
    // Aktualisiere die Breite der Gesundheitsanzeige
    const healthFill = level20Boss.healthBarElement.querySelector('.boss-health-fill');
    if (healthFill) {
        healthFill.style.width = healthPercent + '%';
        
        // Ändere die Farbe basierend auf der Gesundheit
        if (healthPercent > 66) {
            healthFill.style.backgroundColor = '#00ff00'; // Grün
        } else if (healthPercent > 33) {
            healthFill.style.backgroundColor = '#ffff00'; // Gelb
        } else {
            healthFill.style.backgroundColor = '#ff0000'; // Rot
        }
    }
    
    // Aktualisiere den Text
    const healthText = level20Boss.healthBarElement.querySelector('.boss-health-text');
    if (healthText) {
        healthText.textContent = `CHRONOS: ${level20Boss.health}/${level20Boss.maxHealth}`;
    }
}

// Funktion zum Besiegen des Level 20 Bosses
function defeatLevel20Boss() {
    console.log('Level 20 Boss besiegt!');
    
    // Deaktiviere den Boss
    gameState.level20BossActive = false;
    gameState.bossActive = false;
    
    // Entferne alle aktiven Wörter
    level20Boss.activeWords.forEach(word => {
        if (word.element && word.element.parentNode) {
            word.element.parentNode.removeChild(word.element);
        }
    });
    level20Boss.activeWords = [];
    
    // Entferne das Boss-Element
    if (level20Boss.element && level20Boss.element.parentNode) {
        level20Boss.element.parentNode.removeChild(level20Boss.element);
    }
    
    // Entferne die Gesundheitsanzeige
    if (level20Boss.healthBarElement && level20Boss.healthBarElement.parentNode) {
        level20Boss.healthBarElement.parentNode.removeChild(level20Boss.healthBarElement);
    }
    
    // Füge Gold hinzu
    gameState.gold += level20Boss.goldReward;
    
    // Füge einen Eintrag zum Kampflog hinzu
    addCombatLogEntry('victory', `Du hast CHRONOS besiegt! +${level20Boss.goldReward} Gold!`);
    
    // Aktualisiere die Anzeige
    updateDisplay();
    
    // Speichere den Spielstand
    saveGameState();
    
    // Erhöhe das Level
    if (gameState.level === 20) {
        levelUp();
    }
}

// Funktion zum Aktualisieren des Level 20 Bosses im Game Loop
function updateLevel20Boss() {
    if (!gameState.level20BossActive || !level20Boss) {
        return;
    }
    
    // Finde das gameScene-Element
    const sceneElement = document.getElementById('gameScene') || document.getElementById('gameContainer');
    if (!sceneElement) {
        console.error('Kein gameScene oder gameContainer gefunden!');
        return;
    }
    
    // Bewege den Boss hin und her
    const bossElement = level20Boss.element;
    if (bossElement) {
        // Hole die Dimensionen des Spielfelds
        const gameWidth = sceneElement.offsetWidth;
        
        // Aktualisiere die Position des Bosses
        level20Boss.position.x += level20Boss.direction * 2; // 2 Pixel pro Frame
        
        // Ändere die Richtung, wenn der Boss den Rand erreicht
        if (level20Boss.position.x > gameWidth - 150 || level20Boss.position.x < 30) {
            level20Boss.direction *= -1;
        }
        
        // Aktualisiere die Position des DOM-Elements
        bossElement.style.left = level20Boss.position.x + 'px';
    }
    
    const currentTime = Date.now();
    
    // Prüfe, ob eine globale Zeitumkehrung aktiviert werden soll
    if (!level20Boss.timeReversalActive && 
        currentTime - level20Boss.lastTimeReversal > level20Boss.timeReversalInterval) {
        
        // Aktiviere die Zeitumkehrung für alle Wörter
        level20Boss.timeReversalActive = true;
        level20Boss.lastTimeReversal = currentTime;
        
        // Füge einen Eintrag zum Kampflog hinzu
        addCombatLogEntry('boss', 'CHRONOS: "ZEIT, SPULE ZURÜCK!"');
        
        // Kehre die Geschwindigkeit aller Wörter um
        for (let i = 0; i < level20Boss.activeWords.length; i++) {
            const word = level20Boss.activeWords[i];
            word.isReversing = true;
            word.reverseTime = currentTime;
            
            // Kehre die Geschwindigkeit um
            word.velocity.x = -word.originalVelocity.x * 0.7;
            word.velocity.y = -word.originalVelocity.y * 0.7;
            
            // Visueller Effekt
            if (word.element) {
                word.element.style.backgroundColor = 'rgba(0, 255, 255, 0.7)';
                word.element.style.boxShadow = '0 0 15px cyan';
            }
        }
        
        // Deaktiviere die Zeitumkehrung nach 1 Sekunde
        setTimeout(() => {
            level20Boss.timeReversalActive = false;
            
            // Stelle die ursprüngliche Geschwindigkeit aller Wörter wieder her
            for (let i = 0; i < level20Boss.activeWords.length; i++) {
                const word = level20Boss.activeWords[i];
                word.isReversing = false;
                
                // Stelle die ursprüngliche Geschwindigkeit wieder her
                word.velocity.x = word.originalVelocity.x;
                word.velocity.y = word.originalVelocity.y;
                
                // Stelle das ursprüngliche Aussehen wieder her
                if (word.element) {
                    word.element.style.backgroundColor = 'rgba(148, 0, 211, 0.7)';
                    word.element.style.boxShadow = '0 0 10px #9400d3';
                }
            }
            
            // Füge einen Eintrag zum Kampflog hinzu
            addCombatLogEntry('info', 'CHRONOS: "Die Zeit fließt wieder normal."');
        }, 1000);
    }
    
    // Bewege die aktiven Wörter
    for (let i = level20Boss.activeWords.length - 1; i >= 0; i--) {
        const word = level20Boss.activeWords[i];
        
        // Aktualisiere die Position
        word.position.x += word.velocity.x;
        word.position.y += word.velocity.y;
        
        // Aktualisiere das DOM-Element
        if (word.element) {
            word.element.style.left = word.position.x + 'px';
            word.element.style.top = word.position.y + 'px';
        }
        
        // Prüfe, ob das Wort den Spieler getroffen hat
        const playerElement = document.getElementById('player');
        if (playerElement) {
            const playerRect = playerElement.getBoundingClientRect();
            const wordRect = word.element.getBoundingClientRect();
            
            // Einfache Kollisionserkennung
            if (wordRect.left < playerRect.right &&
                wordRect.right > playerRect.left &&
                wordRect.top < playerRect.bottom &&
                wordRect.bottom > playerRect.top) {
                
                // Spieler nimmt Schaden
                takeDamage(10);
                
                // Füge einen Eintrag zum Kampflog hinzu
                addCombatLogEntry('damage', `Du wurdest von "${word.word}" getroffen! -10 HP`);
                
                // Entferne das Wort
                removeLevel20BossWord(i);
            }
        }
        
        // Prüfe, ob das Wort außerhalb des Spielfelds ist
        const gameWidth = sceneElement.offsetWidth;
        const gameHeight = sceneElement.offsetHeight;
        
        if (word.position.x < -100 || word.position.x > gameWidth + 100 ||
            word.position.y < -100 || word.position.y > gameHeight + 100) {
            removeLevel20BossWord(i);
        }
    }
    
    // Spawne neue Wörter, wenn nötig
    if (level20Boss.activeWords.length < level20Boss.maxProjectiles &&
        currentTime - level20Boss.lastSpawnTime > 2000) { // Alle 2 Sekunden
        spawnLevel20BossWord();
    }
}

// Exportiere die Funktionen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initLevel20Boss,
        spawnLevel20BossWord,
        removeLevel20BossWord,
        updateLevel20BossHealth,
        defeatLevel20Boss,
        updateLevel20Boss
    };
} else {
    // Exportiere die Funktionen für den Browser
    window.initLevel20Boss = initLevel20Boss;
    window.spawnLevel20BossWord = spawnLevel20BossWord;
    window.removeLevel20BossWord = removeLevel20BossWord;
    window.updateLevel20BossHealth = updateLevel20BossHealth;
    window.defeatLevel20Boss = defeatLevel20Boss;
    window.updateLevel20Boss = updateLevel20Boss;
} 