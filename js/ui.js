/**
 * ui.js - Benutzeroberfläche für RoughType
 * Enthält die Funktionen für die Benutzeroberfläche
 */

/**
 * Verarbeitet die Eingabe im Hauptmenü
 * @param {string} input - Der eingegebene Text
 * @returns {boolean} - Gibt zurück, ob die Eingabe verarbeitet wurde
 */
function handleMenuInput(input) {
    const menuOptions = document.querySelectorAll('.menu-option');
    let matchFound = false;
    
    menuOptions.forEach(option => {
        const optionText = option.textContent.toLowerCase();
        
        // Wenn die Eingabe mit einer Option beginnt
        if (optionText.startsWith(input)) {
            // Hervorhebe den eingegebenen Teil
            option.innerHTML = `<span class="correct">${input}</span>${optionText.slice(input.length)}`;
            matchFound = true;
            
            // Wenn die Eingabe exakt mit einer Option übereinstimmt
            if (input === optionText) {
                // Führe die entsprechende Aktion aus
                switch (optionText) {
                    case 'enter dungeon':
                        startGame();
                        break;
                    case 'practice mode':
                        startPracticeMode();
                        break;
                    case 'inventory':
                        showInventory();
                        break;
                    case 'shop':
                        showShop();
                        break;
                    case 'select level':
                        showLevelSelect();
                        break;
                    case 'new game':
                        if (confirm('Are you sure you want to start a new game? All progress will be lost.')) {
                            resetGameState();
                            saveGameState();
                            updateDisplay();
                        }
                        break;
                }
                
                // Leere das Eingabefeld
                document.getElementById('typingInput').value = '';
            }
        } else {
            // Setze den Text zurück, wenn er nicht mehr passt
            option.textContent = optionText;
        }
    });
    
    return matchFound;
}

/**
 * Zeigt das Inventar an
 */
function showInventory() {
    gameState.currentScreen = 'inventory';
    mainMenu.classList.add('hidden');
    gameContainer.style.display = 'block';
    
    const gameScene = document.getElementById('gameScene');
    
    // Erstelle das Inventar-HTML
    gameScene.innerHTML = `
        <div class="menu-container">
            <h2>Inventory</h2>
            <div class="inventory-grid">
                <div class="inventory-section">
                    <h2>Items</h2>
                    <div class="game-stats">
                        <div>Gold: ${gameState.gold}</div>
                        <div>Health: ${gameState.playerHealth}/1000</div>
                        <div>Defense: ${gameState.defense}</div>
                    </div>
                    <div class="inventory-instructions">
                        <p>Type the command to use an item:</p>
                        <p><span class="item-action">drink small/medium/large</span> - Use a health potion</p>
                        <p><span class="item-action">use shield</span> - Equip a shield</p>
                    </div>
                    <div class="items-container">
                        ${gameState.inventory.length === 0 ? 
                            '<div>No items</div>' :
                            gameState.inventory.map(item => {
                                let description = '';
                                let action = '';
                                
                                switch(item.type) {
                                    case 'potion':
                                        let healAmount = 0;
                                        switch(item.name) {
                                            case 'small': healAmount = 30; break;
                                            case 'medium': healAmount = 60; break;
                                            case 'large': healAmount = 100; break;
                                        }
                                        description = `Heals ${healAmount} HP`;
                                        action = `drink ${item.name}`;
                                        break;
                                    case 'equipment':
                                        if (item.name === 'shield') {
                                            description = 'Adds 5 Defense';
                                            action = item.equipped ? 'Equipped' : 'use shield';
                                        }
                                        break;
                                }
                                
                                return `
                                    <div class="inventory-item">
                                        <div class="item-name">${item.name} ${item.type}</div>
                                        <div class="item-effect">${description}</div>
                                        ${!item.equipped ? `<div class="item-action">${action}</div>` : '<div class="item-action">Equipped</div>'}
                                    </div>
                                `;
                            }).join('')
                        }
                    </div>
                </div>
                <div class="materials-section">
                    <h2>Materials</h2>
                    <div class="materials-container">
                        ${gameState.materials.length === 0 ? 
                            '<div>No materials</div>' :
                            gameState.materials.map(material => 
                                `<div class="material-item">${material.name} x${material.amount}</div>`
                            ).join('')
                        }
                        
                        <!-- Deutlicher Hinweis direkt im Materials-Container -->
                        <div style="background-color: #4CAF50; color: white; padding: 10px; margin-top: 15px; border-radius: 5px; text-align: center; font-weight: bold; font-size: 16px;">
                            💰 Type "sell all materials" to sell all materials (5 gold each) 💰
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Sell All Materials Button -->
            <div class="menu-option sell-all-button">sell all materials</div>
            
            <div class="menu-option">menu</div>
        </div>
    `;

    // Event-Listener für den Sell All Materials Button hinzufügen
    const sellAllButton = document.querySelector('.sell-all-button');
    if (sellAllButton) {
        sellAllButton.addEventListener('click', () => {
            sellAllMaterials();
        });
        debugLog('Sell All Materials Button gefunden und Event-Listener hinzugefügt');
    } else {
        debugLog('Sell All Materials Button nicht gefunden!', 'warning');
    }

    updateDisplay();
    refreshVirtualKeyboard();
}

/**
 * Verarbeitet die Eingabe im Inventar
 * @param {string} input - Der eingegebene Text
 * @returns {boolean} - Gibt zurück, ob die Eingabe verarbeitet wurde
 */
function handleInventoryInput(input) {
    debugLog(`Processing inventory input: "${input}"`);
    
    // Definiere die möglichen Befehle
    const commands = {
        'sell all materials': () => {
            debugLog('Befehl "sell all materials" erkannt');
            sellAllMaterials();
            return true;
        },
        'drink small': () => {
            if (gameState.playerHealth >= 1000) {
                alert('You already have full health!');
                return false;
            }
            const smallPotion = gameState.inventory.findIndex(item => 
                item.name === 'small' && item.type === 'potion'
            );
            if (smallPotion !== -1) {
                gameState.playerHealth = Math.min(1000, gameState.playerHealth + 30);
                gameState.inventory.splice(smallPotion, 1);
                updateDisplay();
                addCombatLogEntry('info', 'You drank a small potion and healed 30 HP!');
                alert('30 HP healed!');
                showInventory();
                return true;
            }
            alert('No small health potion in inventory!');
            return false;
        },
        'drink medium': () => {
            if (gameState.playerHealth >= 1000) {
                alert('You already have full health!');
                return false;
            }
            const mediumPotion = gameState.inventory.findIndex(item => 
                item.name === 'medium' && item.type === 'potion'
            );
            if (mediumPotion !== -1) {
                gameState.playerHealth = Math.min(1000, gameState.playerHealth + 60);
                gameState.inventory.splice(mediumPotion, 1);
                updateDisplay();
                addCombatLogEntry('info', 'You drank a medium potion and healed 60 HP!');
                alert('60 HP healed!');
                showInventory();
                return true;
            }
            alert('No medium health potion in inventory!');
            return false;
        },
        'drink large': () => {
            if (gameState.playerHealth >= 1000) {
                alert('You already have full health!');
                return false;
            }
            const largePotion = gameState.inventory.findIndex(item => 
                item.name === 'large' && item.type === 'potion'
            );
            if (largePotion !== -1) {
                gameState.playerHealth = Math.min(1000, gameState.playerHealth + 100);
                gameState.inventory.splice(largePotion, 1);
                updateDisplay();
                addCombatLogEntry('info', 'You drank a large potion and healed 100 HP!');
                alert('100 HP healed!');
                showInventory();
                return true;
            }
            alert('No large health potion in inventory!');
            return false;
        },
        'use shield': () => {
            const shield = gameState.inventory.find(item => 
                item.name === 'shield' && item.type === 'equipment' && !item.equipped
            );
            if (shield) {
                shield.equipped = true;
                gameState.defense += 5; // Direkt Defense erhöhen
                updateDisplay();
                addCombatLogEntry('info', 'You equipped a shield and increased your defense by 5!');
                alert('Shield equipped! Defense increased by 5');
                showInventory(); // Aktualisiere die Anzeige
                return true;
            }
            alert('No shield available to equip!');
            return false;
        },
        'menu': () => {
            returnToMenu();
            return true;
        }
    };
    
    // Finde den passenden Befehl
    const matchingCommand = Object.keys(commands).find(cmd => cmd.startsWith(input));
    
    // Markiere die passenden Befehle
    const menuOptions = document.querySelectorAll('.menu-option');
    menuOptions.forEach(option => {
        // Suche nach der item-action Klasse für Befehle
        const actionElement = option.querySelector('.item-action');
        if (actionElement) {
            const actionText = actionElement.textContent.toLowerCase();
            
            // Wenn der Befehl mit der Eingabe beginnt
            if (actionText.startsWith(input)) {
                // Hervorhebe den eingegebenen Teil
                actionElement.innerHTML = `<span class="correct">${input}</span>${actionText.slice(input.length)}`;
            } else {
                // Setze den Text zurück, wenn er nicht mehr passt
                actionElement.textContent = actionText;
            }
        } 
        // Prüfe auf die "menu" Option oder "sell all materials" Option
        else if ((option.textContent.toLowerCase() === 'menu' && 'menu'.startsWith(input)) ||
                 (option.textContent.toLowerCase() === 'sell all materials' && 'sell all materials'.startsWith(input))) {
            const text = option.textContent.toLowerCase();
            option.innerHTML = `<span class="correct">${input}</span>${text.slice(input.length)}`;
        }
    });
    
    // Wenn ein vollständiger Befehl eingegeben wurde, führe ihn aus
    if (matchingCommand && input === matchingCommand) {
        debugLog(`Führe Befehl aus: ${matchingCommand}`);
        document.getElementById('typingInput').value = '';
        return commands[matchingCommand]();
    }

    return false;
}

/**
 * Verkauft alle Materialien
 */
function sellAllMaterials() {
    debugLog('sellAllMaterials-Funktion aufgerufen');
    
    if (gameState.materials.length === 0) {
        alert('You have no materials to sell!');
        return;
    }
    
    let totalGold = 0;
    let soldItems = 0;
    
    // Berechne den Wert aller Materialien (5 Gold pro Material)
    gameState.materials.forEach(material => {
        totalGold += material.amount * 5;
        soldItems += material.amount;
    });
    
    // Füge Gold hinzu und leere das Materials-Array
    gameState.gold += totalGold;
    gameState.materials = [];
    
    // Aktualisiere die Anzeige
    updateDisplay();
    
    // Zeige eine Erfolgsmeldung an
    addCombatLogEntry('success', `Sold ${soldItems} materials for ${totalGold} gold!`);
    alert(`Sold ${soldItems} materials for ${totalGold} gold!`);
    
    // Aktualisiere das Inventar
    showInventory();
}

/**
 * Zeigt den Shop an
 */
function showShop() {
    gameState.currentScreen = 'shop';
    mainMenu.classList.add('hidden');
    gameContainer.style.display = 'block';
    
    const gameScene = document.getElementById('gameScene');
    
    // Definiere die Shop-Artikel
    const shopItems = [
        { name: 'small', type: 'potion', cost: 20, description: 'Small Health Potion (Heals 30 HP)' },
        { name: 'medium', type: 'potion', cost: 40, description: 'Medium Health Potion (Heals 60 HP)' },
        { name: 'large', type: 'potion', cost: 60, description: 'Large Health Potion (Heals 100 HP)' },
        { name: 'shield', type: 'equipment', cost: 100, description: 'Shield (Adds 5 Defense)' }
    ];
    
    // Erstelle das Shop-HTML
    gameScene.innerHTML = `
        <div class="menu-container">
            <h2>Shop</h2>
            <div class="game-stats">
                <div>Gold: ${gameState.gold}</div>
                <div>Health: ${gameState.playerHealth}/1000</div>
                <div>Defense: ${gameState.defense}</div>
            </div>
            <div class="shop-items">
                ${shopItems.map(item => `
                    <div class="shop-item" data-name="${item.name}" data-type="${item.type}" data-cost="${item.cost}">
                        <div>
                            <div class="shop-item-name">${item.description}</div>
                            <div class="shop-item-price">${item.cost} gold</div>
                        </div>
                        <div class="menu-option buy-button">buy ${item.name}</div>
                    </div>
                `).join('')}
            </div>
            <div class="menu-option">menu</div>
        </div>
    `;
    
    // Event-Listener für die Kauf-Buttons hinzufügen
    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemElement = this.closest('.shop-item');
            const itemName = itemElement.getAttribute('data-name');
            const itemType = itemElement.getAttribute('data-type');
            const itemCost = parseInt(itemElement.getAttribute('data-cost'));
            
            buyItem(itemName, itemType, itemCost);
        });
    });
    
    updateDisplay();
    refreshVirtualKeyboard();
}

/**
 * Verarbeitet die Eingabe im Shop
 * @param {string} input - Der eingegebene Text
 * @returns {boolean} - Gibt zurück, ob die Eingabe verarbeitet wurde
 */
function handleShopInput(input) {
    // Prüfe auf "menu" Befehl
    if (input === 'menu') {
        returnToMenu();
        document.getElementById('typingInput').value = '';
        return true;
    }
    
    // Prüfe auf Kauf-Befehle
    const buyCommands = ['buy small', 'buy medium', 'buy large', 'buy shield'];
    const matchingCommand = buyCommands.find(cmd => cmd === input);
    
    // Markiere die passenden Befehle
    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
        const buttonText = button.textContent.toLowerCase();
        
        if (buttonText.startsWith(input)) {
            button.innerHTML = `<span class="correct">${input}</span>${buttonText.slice(input.length)}`;
        } else {
            button.textContent = buttonText;
        }
    });
    
    // Prüfe auf "menu" Option
    const menuOption = document.querySelector('.menu-option:not(.buy-button)');
    if (menuOption && 'menu'.startsWith(input)) {
        menuOption.innerHTML = `<span class="correct">${input}</span>${'menu'.slice(input.length)}`;
    } else if (menuOption) {
        menuOption.textContent = 'menu';
    }
    
    // Wenn ein vollständiger Befehl eingegeben wurde, führe ihn aus
    if (matchingCommand) {
        const itemName = matchingCommand.split(' ')[1];
        let itemType = '';
        let itemCost = 0;
        
        switch (itemName) {
            case 'small':
                itemType = 'potion';
                itemCost = 20;
                break;
            case 'medium':
                itemType = 'potion';
                itemCost = 40;
                break;
            case 'large':
                itemType = 'potion';
                itemCost = 60;
                break;
            case 'shield':
                itemType = 'equipment';
                itemCost = 100;
                break;
        }
        
        document.getElementById('typingInput').value = '';
        buyItem(itemName, itemType, itemCost);
        return true;
    }
    
    return false;
}

/**
 * Kauft einen Gegenstand
 * @param {string} itemName - Der Name des Gegenstands
 * @param {string} itemType - Der Typ des Gegenstands
 * @param {number} itemCost - Die Kosten des Gegenstands
 */
function buyItem(itemName, itemType, itemCost) {
    // Prüfe, ob der Spieler genug Gold hat
    if (gameState.gold < itemCost) {
        alert(`Not enough gold! You need ${itemCost} gold.`);
        return;
    }
    
    // Prüfe, ob der Spieler bereits einen Schild ausgerüstet hat
    if (itemName === 'shield' && itemType === 'equipment') {
        const hasShield = gameState.inventory.some(item => 
            item.name === 'shield' && item.type === 'equipment' && item.equipped
        );
        
        if (hasShield) {
            alert('You already have a shield equipped!');
            return;
        }
    }
    
    // Ziehe die Kosten ab
    gameState.gold -= itemCost;
    
    // Füge den Gegenstand zum Inventar hinzu
    gameState.inventory.push({
        name: itemName,
        type: itemType,
        equipped: false
    });
    
    // Aktualisiere die Anzeige
    updateDisplay();
    
    // Zeige eine Erfolgsmeldung an
    addCombatLogEntry('success', `Bought ${itemName} ${itemType} for ${itemCost} gold!`);
    alert(`Bought ${itemName} ${itemType} for ${itemCost} gold!`);
    
    // Aktualisiere den Shop
    showShop();
}

/**
 * Zeigt die Level-Auswahl an
 */
function showLevelSelect() {
    gameState.currentScreen = 'levelSelect';
    mainMenu.classList.add('hidden');
    gameContainer.style.display = 'block';
    
    const gameScene = document.getElementById('gameScene');
    
    // Erstelle eine Liste aller verfügbaren Level
    let levelOptions = '';
    
    // Füge Level 1-10 hinzu
    for (let i = 1; i <= 10; i++) {
        levelOptions += `<div class="menu-option level-option" data-level="${i}">Level ${i}${i <= gameState.maxLevel ? '' : ' (locked)'}</div>`;
    }
    
    // Füge erweiterte Level 11-20 hinzu, wenn verfügbar
    if (typeof window.extendedEnemyTypes !== 'undefined') {
        for (let i = 11; i <= 20; i++) {
            levelOptions += `<div class="menu-option level-option" data-level="${i}">Level ${i}${i <= gameState.maxLevel ? '' : ' (locked)'}</div>`;
        }
    }
    
    gameScene.innerHTML = `
        <div class="menu-container">
            <h2>Select Level</h2>
            <p>Choose a level to play (max level reached: ${gameState.maxLevel})</p>
            <div class="level-select-grid">
                ${levelOptions}
            </div>
            <div class="menu-option">menu</div>
        </div>
    `;
    
    // Füge Event-Listener für die Level-Optionen hinzu
    const levelButtons = document.querySelectorAll('.level-option');
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const level = parseInt(this.getAttribute('data-level'));
            if (level <= gameState.maxLevel) {
                selectLevel(level);
            } else {
                alert(`Level ${level} is locked. You need to reach it first.`);
            }
        });
    });
    
    updateDisplay();
    refreshVirtualKeyboard();
}

/**
 * Verarbeitet die Eingabe in der Level-Auswahl
 * @param {string} input - Der eingegebene Text
 * @returns {boolean} - Gibt zurück, ob die Eingabe verarbeitet wurde
 */
function handleLevelSelectInput(input) {
    // Prüfe auf "menu" Befehl
    if (input === 'menu') {
        returnToMenu();
        document.getElementById('typingInput').value = '';
        return true;
    }
    
    // Prüfe, ob die Eingabe eine Zahl ist
    const level = parseInt(input);
    if (!isNaN(level) && level >= 1 && level <= gameState.maxLevel) {
        selectLevel(level);
        document.getElementById('typingInput').value = '';
        return true;
    }
    
    // Markiere die passenden Level-Optionen
    const levelOptions = document.querySelectorAll('.level-option');
    levelOptions.forEach(option => {
        const levelText = option.textContent.toLowerCase();
        if (levelText.startsWith(input)) {
            const level = parseInt(option.getAttribute('data-level'));
            if (level <= gameState.maxLevel) {
                option.innerHTML = `<span class="correct">${input}</span>${levelText.slice(input.length)}`;
            }
        } else {
            option.textContent = levelText;
        }
    });
    
    // Prüfe auf "menu" Option
    const menuOption = document.querySelector('.menu-option:not(.level-option)');
    if (menuOption && 'menu'.startsWith(input)) {
        menuOption.innerHTML = `<span class="correct">${input}</span>${'menu'.slice(input.length)}`;
    } else if (menuOption) {
        menuOption.textContent = 'menu';
    }
    
    return false;
}

/**
 * Wählt ein Level aus
 * @param {number} level - Das ausgewählte Level
 */
function selectLevel(level) {
    if (level > gameState.maxLevel) {
        alert(`Level ${level} is locked. You need to reach it first.`);
        return;
    }
    
    // Setze das Level
    gameState.level = level;
    gameState.monstersKilled = 0;
    
    // Aktualisiere die Anzeige
    updateDisplay();
    
    // Starte das Spiel
    startGame();
    
    // Füge eine Nachricht zum Combat Log hinzu
    addCombatLogEntry('info', `Level ${level} selected.`);
} 