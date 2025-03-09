/**
 * game.js - Spiellogik für RoughType
 * Enthält die Funktionen für das Spielgeschehen
 */

/**
 * Startet das Spiel
 */
function startGame() {
    gameState.currentScreen = 'game';
    mainMenu.classList.add('hidden');
    gameContainer.style.display = 'block';
    initGame();
    refreshVirtualKeyboard();
}

/**
 * Initialisiert das Spiel
 */
function initGame() {
    debugLog('Initialisiere Spiel...');
    gameState.enemies = [];
    gameState.currentScreen = 'game';
    gameState.level10BossActive = false;

    const gameScene = document.getElementById('gameScene');
    gameScene.innerHTML = `<div class="player" id="player"></div>`;

    if (gameState.gameLoop) {
        cancelAnimationFrame(gameState.gameLoop);
    }
    gameState.gameLoop = requestAnimationFrame(gameLoop);

    // Prüfe, ob ein Boss-Level erreicht wurde
    if (gameState.level === 10) {
        initLevel10Boss();
    } else if (gameState.level === 15 && typeof initLevel15Boss === 'function') {
        initLevel15Boss();
    } else if (gameState.level === 20 && typeof initLevel20Boss === 'function') {
        initLevel20Boss();
    } else {
        spawnEnemy();
    }
    
    updateDisplay();

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

    // Combat Log initialisieren
    const combatLog = document.getElementById('combatLog');
    if (combatLog) {
        // Füge eine Nachricht hinzu, dass die Etage zurückgesetzt wurde
        addCombatLogEntry('info', `Du betrittst Etage ${gameState.level}. Dein Fortschritt wurde zurückgesetzt.`);
        addCombatLogEntry('info', 'Type "menu" to return to the main menu.');
        
        // Spezielle Nachricht für Boss-Level
        if (gameState.level === 10) {
            addCombatLogEntry('info', 'BOSS BATTLE! Defeat TYPEREX by typing all the words it throws at you!');
        } else if (gameState.level === 15 && typeof initLevel15Boss === 'function') {
            addCombatLogEntry('info', 'BOSS BATTLE! Defeat WORDSMITH by typing all the words it creates!');
        } else if (gameState.level === 20 && typeof initLevel20Boss === 'function') {
            addCombatLogEntry('info', 'BOSS BATTLE! Defeat CHRONOS by typing the words before time runs out!');
        }
    }
}

/**
 * Hauptspielschleife
 * @param {number} timestamp - Der aktuelle Zeitstempel
 */
function gameLoop(timestamp) {
    // Berechne die vergangene Zeit seit dem letzten Update
    const deltaTime = timestamp - gameState.lastUpdate;
    gameState.lastUpdate = timestamp;
    
    // Aktualisiere die Gegner
    updateEnemies(deltaTime);
    
    // Aktualisiere den Level 10 Boss, wenn aktiv
    if (gameState.level10BossActive) {
        updateLevel10Boss(deltaTime);
    }
    
    // Aktualisiere den Level 15 Boss, wenn aktiv
    if (gameState.level === 15 && typeof updateLevel15Boss === 'function') {
        updateLevel15Boss(timestamp);
    }
    
    // Aktualisiere den Level 20 Boss, wenn aktiv
    if (gameState.level === 20 && typeof updateLevel20Boss === 'function') {
        updateLevel20Boss(timestamp);
    }
    
    // Spawne neue Gegner, wenn nötig
    gameState.spawnTimer += deltaTime;
    if (gameState.spawnTimer > 2000 && gameState.enemies.length < 5 && !gameState.level10BossActive) {
        spawnEnemy();
        gameState.spawnTimer = 0;
    }
    
    // Setze die Spielschleife fort
    gameState.gameLoop = requestAnimationFrame(gameLoop);
}

/**
 * Aktualisiert die Gegner
 * @param {number} deltaTime - Die vergangene Zeit seit dem letzten Update
 */
function updateEnemies(deltaTime) {
    gameState.enemies.forEach(enemy => {
        // Bewege den Gegner nach unten
        enemy.position.y += enemy.speed * (deltaTime / 1000);
        enemy.element.style.top = `${enemy.position.y}px`;
        
        // Prüfe, ob der Gegner den Spieler erreicht hat
        const gameScene = document.getElementById('gameScene');
        const sceneHeight = gameScene.clientHeight;
        
        if (enemy.position.y > sceneHeight - 100) {
            // Spieler nimmt Schaden
            const damage = Math.max(1, 20 - gameState.defense);
            gameState.playerHealth -= damage;
            
            // Entferne den Gegner
            removeEnemy(gameState.enemies.indexOf(enemy));
            
            // Füge einen Eintrag zum Kampfprotokoll hinzu
            addCombatLogEntry('damage', `Ein Gegner hat dich erreicht! Du nimmst ${damage} Schaden.`);
            
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
 * Spawnt einen neuen Gegner
 */
function spawnEnemy() {
    // Bestimme den Gegnertyp basierend auf dem aktuellen Level
    let enemyTypes = window.enemyTypes || {};
    
    // Verwende erweiterte Gegnertypen, wenn verfügbar
    if (gameState.level > 10 && typeof window.extendedEnemyTypes !== 'undefined') {
        enemyTypes = window.extendedEnemyTypes;
    }
    
    // Wähle einen zufälligen Gegnertyp aus dem aktuellen Level
    const levelEnemies = enemyTypes[gameState.level] || [];
    if (levelEnemies.length === 0) {
        debugLog(`Keine Gegner für Level ${gameState.level} gefunden`, 'warning');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * levelEnemies.length);
    const enemyType = levelEnemies[randomIndex];
    
    // Erstelle das Gegner-Element
    const gameScene = document.getElementById('gameScene');
    const enemy = document.createElement('div');
    enemy.className = 'enemy-entity';
    enemy.setAttribute('data-level', gameState.level);
    
    // Positioniere den Gegner zufällig
    const sceneWidth = gameScene.clientWidth - 60;
    const xPos = Math.random() * sceneWidth;
    const yPos = -60;
    
    enemy.style.left = `${xPos}px`;
    enemy.style.top = `${yPos}px`;
    
    // Füge das Wort hinzu
    const wordElement = document.createElement('div');
    wordElement.className = 'enemy-word';
    wordElement.textContent = enemyType.name;
    enemy.appendChild(wordElement);
    
    // Füge den Gegner zur Szene hinzu
    gameScene.appendChild(enemy);
    
    // Füge den Gegner zum Spielstatus hinzu
    gameState.enemies.push({
        element: enemy,
        wordElement: wordElement,
        word: enemyType.name.toLowerCase(),
        position: { x: xPos, y: yPos },
        speed: 30 + Math.random() * 20,
        health: enemyType.health || 1,
        goldReward: enemyType.goldReward || 5,
        isBoss: false,
        dropLoot: function() {
            // 30% Chance, ein Material zu droppen
            if (Math.random() < 0.3) {
                const materials = ['wood', 'stone', 'iron', 'gold', 'crystal'];
                const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
                
                addMaterial(randomMaterial);
                addCombatLogEntry('success', `${enemyType.name} dropped ${randomMaterial}!`);
                
                return randomMaterial;
            }
            return null;
        },
        takeDamage: function() {
            this.element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                if (this.element) {
                    this.element.style.transform = 'scale(1)';
                }
            }, 100);
        }
    });
    
    debugLog(`Gegner gespawnt: ${enemyType.name}`);
}

/**
 * Entfernt einen Gegner
 * @param {number} index - Der Index des Gegners im Array
 */
function removeEnemy(index) {
    if (index < 0 || index >= gameState.enemies.length) return;
    
    const enemy = gameState.enemies[index];
    if (enemy.element) {
        enemy.element.remove();
    }
    
    gameState.enemies.splice(index, 1);
}

/**
 * Verarbeitet die Spieleingabe
 * @param {Event} e - Das Eingabe-Event
 */
function handleGameInput(e) {
    try {
        if (!e || !e.target) {
            console.error('Ungültiges Event-Objekt in handleGameInput');
            return;
        }
        
        const typed = e.target.value.toLowerCase();
        debugLog(`Verarbeite Eingabe: "${typed}" im Bildschirm: ${gameState.currentScreen}`);
        
        // Wenn wir im Hauptmenü sind
        if (gameState.currentScreen === 'menu') {
            handleMenuInput(typed);
        }
        // Wenn wir im Inventar sind
        else if (gameState.currentScreen === 'inventory') {
            handleInventoryInput(typed);
        }
        // Wenn wir im Shop sind
        else if (gameState.currentScreen === 'shop') {
            handleShopInput(typed);
        }
        // Wenn wir in der Level-Auswahl sind
        else if (gameState.currentScreen === 'levelSelect') {
            handleLevelSelectInput(typed);
        }
        // Wenn wir im Übungsmodus sind
        else if (gameState.currentScreen === 'practice') {
            handlePracticeInput(typed);
        }
        // Wenn wir im Spiel sind
        else if (gameState.currentScreen === 'game') {
            // Prüfe zuerst auf "menu" Befehl
            if (typed === 'menu') {
                returnToMenu();
                e.target.value = '';
                return;
            }
            
            // Prüfe auf Level 10 Boss
            if (gameState.level10BossActive) {
                handleLevel10BossInput(typed, e);
                return;
            }
            
            // Prüfe auf Level 15 Boss
            if (gameState.level === 15 && typeof handleLevel15BossInput === 'function') {
                try {
                    if (handleLevel15BossInput(typed, e)) {
                        return;
                    }
                } catch (error) {
                    console.error('Fehler bei handleLevel15BossInput:', error);
                }
            }
            
            // Prüfe auf Level 20 Boss
            if (gameState.level === 20 && typeof handleLevel20BossInput === 'function') {
                try {
                    if (handleLevel20BossInput(typed, e)) {
                        return;
                    }
                } catch (error) {
                    console.error('Fehler bei handleLevel20BossInput:', error);
                }
            }
            
            // Normale Spieleingabe verarbeiten
            handleNormalGameInput(typed, e);
        } else {
            console.warn(`Unbekannter Bildschirm: ${gameState.currentScreen}`);
        }
    } catch (error) {
        console.error('Fehler bei der Verarbeitung der Spieleingabe:', error);
    }
}

/**
 * Verarbeitet die normale Spieleingabe
 * @param {string} typed - Der eingegebene Text
 * @param {Event} e - Das Eingabe-Event
 */
function handleNormalGameInput(typed, e) {
    if (typed.length === 0) return;
    
    // Suche nach einem passenden Gegner
    let targetEnemyIndex = -1;
    let targetEnemy = null;
    
    gameState.enemies.forEach((enemy, index) => {
        if (enemy.word.startsWith(typed)) {
            // Markiere die korrekt eingegebenen Buchstaben
            const wordElement = enemy.element.querySelector('.enemy-word');
            let html = '';
            for (let i = 0; i < enemy.word.length; i++) {
                if (i < typed.length) {
                    html += `<span class="correct">${enemy.word[i]}</span>`;
                } else {
                    html += enemy.word[i];
                }
            }
            wordElement.innerHTML = html;
            
            // Wenn das Wort vollständig eingegeben wurde
            if (typed === enemy.word) {
                targetEnemyIndex = index;
                targetEnemy = enemy;
            }
        } else {
            // Setze das Wort zurück
            const wordElement = enemy.element.querySelector('.enemy-word');
            wordElement.textContent = enemy.word;
        }
    });
    
    // Wenn ein Gegner besiegt wurde
    if (targetEnemy) {
        // Erstelle ein Projektil
        createProjectile(targetEnemy);
        
        // Füge Punkte hinzu
        gameState.score += targetEnemy.word.length;
        
        // Füge Gold hinzu
        gameState.gold += targetEnemy.goldReward;
        
        // Füge einen Eintrag zum Kampfprotokoll hinzu
        addCombatLogEntry('kill', `Du hast ${targetEnemy.word} besiegt und ${targetEnemy.goldReward} Gold erhalten!`);
        
        // Füge Materialien-Drop hinzu
        const droppedItem = targetEnemy.dropLoot();
        
        // Level-Up Logik
        gameState.monstersKilled++;
        
        // Für die ersten 3 Level nur 4 Monster benötigen
        const monstersNeeded = gameState.level <= 3 ? 4 : 10;
        if (gameState.monstersKilled >= monstersNeeded) {
            levelUp();
        }
        
        // Entferne den Gegner nach einer kurzen Verzögerung
        setTimeout(() => {
            removeEnemy(targetEnemyIndex);
            e.target.value = '';
        }, 300);
        
        // Aktualisiere die Anzeige
        updateDisplay();
    } else if (typed.length > 0) {
        // Falsche Eingabe - Schaden direkt mit Verteidigung reduzieren
        const baseDamage = 10; // Basis-Schaden bei Tippfehler
        const damage = Math.max(1, baseDamage - gameState.defense); // Verteidigung reduziert den Schaden direkt, mindestens 1 Schaden
        gameState.playerHealth -= damage;
        
        // Füge einen Eintrag zum Kampfprotokoll hinzu
        addCombatLogEntry('damage', `Falsche Eingabe! Du nimmst ${damage} Schaden.`);
        
        // Leere das Eingabefeld
        e.target.value = '';
        
        // Setze alle Wortanzeigen zurück
        gameState.enemies.forEach(enemy => {
            const wordElement = enemy.element.querySelector('.enemy-word');
            wordElement.textContent = enemy.word;
        });
        
        // Prüfe, ob der Spieler gestorben ist
        if (gameState.playerHealth <= 0) {
            gameOver();
        }
        
        // Aktualisiere die Anzeige
        updateDisplay();
    }
}

/**
 * Erstellt und animiert ein Projektil
 * @param {Object} targetEnemy - Der Zielgegner
 */
function createProjectile(targetEnemy) {
    const gameScene = document.getElementById('gameScene');
    const player = document.getElementById('player');
    const projectile = document.createElement('div');
    projectile.className = 'projectile';
    
    // Startposition (Spieler)
    const playerRect = player.getBoundingClientRect();
    const gameSceneRect = gameScene.getBoundingClientRect();
    
    const startX = playerRect.left + playerRect.width / 2 - gameSceneRect.left;
    const startY = playerRect.top + playerRect.height / 2 - gameSceneRect.top;
    
    // Zielposition (Gegner)
    const enemyRect = targetEnemy.element.getBoundingClientRect();
    const targetX = enemyRect.left + enemyRect.width / 2 - gameSceneRect.left;
    const targetY = enemyRect.top + enemyRect.height / 2 - gameSceneRect.top;
    
    projectile.style.left = `${startX}px`;
    projectile.style.top = `${startY}px`;
    
    gameScene.appendChild(projectile);
    
    // Animation
    const duration = 200; // ms
    const startTime = performance.now();
    
    function animateProjectile(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentX = startX + (targetX - startX) * progress;
        const currentY = startY + (targetY - startY) * progress;
        
        projectile.style.left = `${currentX}px`;
        projectile.style.top = `${currentY}px`;
        
        if (progress < 1) {
            requestAnimationFrame(animateProjectile);
        } else {
            // Treffer-Animation auslösen
            targetEnemy.takeDamage();
            
            // Projektil ausblenden und entfernen
            projectile.style.animation = 'projectileFade 0.2s forwards';
            setTimeout(() => {
                if (projectile.parentNode) {
                    projectile.parentNode.removeChild(projectile);
                }
            }, 200);
        }
    }
    
    requestAnimationFrame(animateProjectile);
}

/**
 * Führt ein Level-Up durch
 */
function levelUp() {
    // Erhöhe das Level
    gameState.level++;
    gameState.maxLevel = Math.max(gameState.level, gameState.maxLevel);
    gameState.monstersKilled = 0;
    
    // Füge einen Eintrag zum Kampfprotokoll hinzu
    addCombatLogEntry('success', `Level Up! Du bist jetzt Level ${gameState.level}.`);
    
    // Zeige eine Benachrichtigung an
    alert(`Level Up! Du bist jetzt Level ${gameState.level}.`);
    
    // Starte das nächste Level
    initGame();
}

/**
 * Beendet das Spiel
 */
function gameOver() {
    // Stoppe die Spielschleife
    if (gameState.gameLoop) {
        cancelAnimationFrame(gameState.gameLoop);
        gameState.gameLoop = null;
    }
    
    // Zeige eine Benachrichtigung an
    alert(`Game Over! Du hast Level ${gameState.level} erreicht und ${gameState.score} Punkte erzielt.`);
    
    // Setze den Spieler zurück
    gameState.playerHealth = 1000;
    gameState.monstersKilled = 0;
    
    // Kehre zum Hauptmenü zurück
    returnToMenu();
    
    // Aktualisiere die Anzeige
    updateDisplay();
}

/**
 * Fügt ein Material zum Inventar hinzu
 * @param {string} material - Das Material, das hinzugefügt werden soll
 */
function addMaterial(material) {
    const existingMaterial = gameState.materials.find(m => m.name === material);
    if (existingMaterial) {
        existingMaterial.amount++;
    } else {
        gameState.materials.push({ name: material, amount: 1 });
    }
    
    // Aktualisiere die Anzeige
    updateDisplay();
    
    debugLog(`Material hinzugefügt: ${material}`);
} 