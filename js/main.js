/**
 * main.js - Hauptdatei für RoughType
 * Enthält die Initialisierung des Spiels und grundlegende Funktionen
 */

// Spielstatus
const gameState = {
    playerHealth: 1000,
    score: 0,
    gold: 100,
    level: 1,
    maxLevel: 1,
    defense: 0,
    inventory: [],
    materials: [],
    enemies: [],
    monstersKilled: 0,
    spawnTimer: 0,
    lastUpdate: 0,
    gameLoop: null,
    currentScreen: 'menu',
    level10BossActive: false,
    practiceWord: '',
    practiceScore: 0,
    wrongChars: '',
    nextMonster: null,
    debugMode: false
};

// DOM-Elemente
let mainMenu;
let gameContainer;
let typingInput;
let statsSidebar;

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
    console.log('RoughType wird initialisiert...');
    
    // DOM-Elemente initialisieren
    mainMenu = document.getElementById('mainMenu');
    gameContainer = document.getElementById('gameContainer');
    typingInput = document.getElementById('typingInput');
    statsSidebar = document.getElementById('statsSidebar');
    
    if (!mainMenu || !gameContainer || !typingInput || !statsSidebar) {
        console.error('Kritischer Fehler: Einige DOM-Elemente konnten nicht gefunden werden!');
        return;
    }
    
    // Theme-Wechsel initialisieren
    initThemeToggle();
    
    // Debug-Modus initialisieren
    initDebugMode();
    
    // Spielstand laden
    loadGameState();
    
    // Event-Listener für Eingabe hinzufügen
    typingInput.addEventListener('input', function(e) {
        handleGameInput(e);
    });
    
    // Event-Listener für Fokus hinzufügen
    document.addEventListener('click', focusInput);
    document.addEventListener('keydown', focusInput);
    
    // Anzeige aktualisieren
    updateDisplay();
    
    // Virtuelle Tastatur initialisieren
    refreshVirtualKeyboard();
    
    console.log('RoughType wurde erfolgreich initialisiert!');
});

/**
 * Initialisiert den Theme-Wechsel
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
        console.error('Theme Toggle nicht gefunden!');
        return;
    }
    
    // Gespeichertes Theme laden
    const savedTheme = localStorage.getItem('roughTypeTheme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
    
    // Event-Listener für Theme-Wechsel
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('roughTypeTheme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('roughTypeTheme', 'light');
        }
    });
}

/**
 * Initialisiert den Debug-Modus
 */
function initDebugMode() {
    const debugContainer = document.getElementById('debugContainer');
    const debugToggle = document.getElementById('debugToggle');
    
    if (!debugContainer || !debugToggle) {
        console.error('Debug-Container oder Toggle nicht gefunden!');
        return;
    }
    
    const debugLog = document.getElementById('debugLog');
    
    if (debugToggle) {
        debugToggle.addEventListener('change', function() {
            gameState.debugMode = this.checked;
            debugContainer.style.display = this.checked ? 'block' : 'none';
        });
    }
}

/**
 * Fügt einen Eintrag zum Debug-Log hinzu
 * @param {string} message - Die Nachricht, die zum Log hinzugefügt werden soll
 * @param {string} type - Der Typ der Nachricht (info, warning, error)
 */
function debugLog(message, type = 'info') {
    console.log(`[DEBUG] ${message}`);
    
    if (!gameState.debugMode) return;
    
    const debugLog = document.getElementById('debugLog');
    if (!debugLog) return;
    
    const entry = document.createElement('div');
    entry.className = `debug-entry debug-${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    
    debugLog.appendChild(entry);
    debugLog.scrollTop = debugLog.scrollHeight;
}

/**
 * Fokussiert das Eingabefeld
 */
function focusInput() {
    if (typingInput) {
        typingInput.focus();
    }
}

/**
 * Aktualisiert die virtuelle Tastatur
 */
function refreshVirtualKeyboard() {
    const keys = document.querySelectorAll('.key');
    if (!keys.length) {
        console.error('Virtuelle Tastatur nicht gefunden!');
        return;
    }
    
    keys.forEach(key => {
        key.classList.remove('active');
        
        // Entferne alte Event-Listener (falls vorhanden)
        const newKey = key.cloneNode(true);
        key.parentNode.replaceChild(newKey, key);
        
        // Füge neue Event-Listener hinzu
        newKey.addEventListener('click', function() {
            const keyValue = this.getAttribute('data-key');
            if (keyValue && typingInput) {
                typingInput.value += keyValue;
                typingInput.dispatchEvent(new Event('input'));
                typingInput.focus();
            }
        });
    });
}

/**
 * Kehrt zum Hauptmenü zurück
 */
function returnToMenu() {
    gameState.currentScreen = 'menu';
    
    // Spielschleife stoppen
    if (gameState.gameLoop) {
        cancelAnimationFrame(gameState.gameLoop);
        gameState.gameLoop = null;
    }
    
    // Gegner entfernen
    gameState.enemies = [];
    
    // UI aktualisieren
    if (mainMenu) mainMenu.classList.remove('hidden');
    if (gameContainer) gameContainer.style.display = 'none';
    
    // Eingabefeld leeren
    if (typingInput) typingInput.value = '';
    
    // Virtuelle Tastatur aktualisieren
    refreshVirtualKeyboard();
    
    debugLog('Zum Hauptmenü zurückgekehrt');
}

/**
 * Speichert den Spielstand
 */
function saveGameState() {
    const saveData = {
        gold: gameState.gold,
        level: gameState.level,
        maxLevel: gameState.maxLevel,
        defense: gameState.defense,
        inventory: gameState.inventory.map(item => ({
            ...item,
            element: null // DOM-Elemente nicht speichern
        })),
        playerHealth: gameState.playerHealth,
        monstersKilled: gameState.monstersKilled,
        score: gameState.score,
        materials: gameState.materials
    };
    
    try {
        localStorage.setItem('roughTypeGameState', JSON.stringify(saveData));
        debugLog('Spielstand erfolgreich gespeichert');
    } catch (error) {
        debugLog('Fehler beim Speichern des Spielstands: ' + error.message, 'error');
        console.error('Fehler beim Speichern des Spielstands:', error);
    }
}

/**
 * Lädt den Spielstand
 */
function loadGameState() {
    try {
        const savedData = localStorage.getItem('roughTypeGameState');
        if (savedData) {
            const data = JSON.parse(savedData);
            gameState.gold = data.gold || 100;
            gameState.level = data.level || 1;
            gameState.maxLevel = data.maxLevel || 1;
            gameState.defense = data.defense || 0;
            gameState.inventory = data.inventory || [];
            gameState.playerHealth = data.playerHealth || 1000;
            gameState.monstersKilled = data.monstersKilled || 0;
            gameState.score = data.score || 0;
            gameState.materials = data.materials || [];
            
            // Stelle ausgerüstete Items wieder her
            gameState.inventory.forEach(item => {
                if (item.type === 'equipment' && item.equipped) {
                    if (item.name === 'shield') {
                        gameState.defense = Math.max(gameState.defense, 5);
                    }
                }
            });
            
            debugLog('Spielstand erfolgreich geladen');
        } else {
            // Kein Spielstand vorhanden, starte neues Spiel
            gameState.gold = 100;
            gameState.level = 1;
            gameState.maxLevel = 1;
            gameState.defense = 0;
            gameState.inventory = [];
            gameState.playerHealth = 1000;
            gameState.monstersKilled = 0;
            gameState.score = 0;
            gameState.materials = [];
            
            debugLog('Neues Spiel gestartet (kein Spielstand vorhanden)');
        }
        
        // Aktualisiere die Anzeige
        updateDisplay();
    } catch (error) {
        debugLog('Fehler beim Laden des Spielstands: ' + error.message, 'error');
        console.error('Fehler beim Laden des Spielstands:', error);
        
        // Setze auf Standardwerte zurück bei Fehler
        gameState.gold = 100;
        gameState.level = 1;
        gameState.maxLevel = 1;
        gameState.defense = 0;
        gameState.inventory = [];
        gameState.playerHealth = 1000;
        gameState.monstersKilled = 0;
        gameState.score = 0;
        gameState.materials = [];
        
        updateDisplay();
    }
}

/**
 * Setzt den Spielstand zurück
 */
function resetGameState() {
    // Setze alle Werte auf Anfangszustand zurück
    gameState.playerHealth = 1000;
    gameState.score = 0;
    gameState.gold = 100;
    gameState.level = 1;
    gameState.maxLevel = 1;
    gameState.defense = 0;
    gameState.inventory = [];
    gameState.materials = [];
    gameState.monstersKilled = 0;
    gameState.enemies = [];
    
    // Speichere den zurückgesetzten Spielstand
    saveGameState();
    
    debugLog('Spielstand zurückgesetzt');
}

/**
 * Aktualisiert die Anzeige
 */
function updateDisplay() {
    try {
        // Aktualisiere die Sidebar-Anzeige
        const sidebarHealth = document.getElementById('sidebarHealth');
        if (sidebarHealth) sidebarHealth.textContent = `${gameState.playerHealth}/1000`;
        
        const sidebarGold = document.getElementById('sidebarGold');
        if (sidebarGold) sidebarGold.textContent = gameState.gold;
        
        // Berechne die Anzahl der Monster, die für ein Level-Up benötigt werden
        const monstersNeeded = gameState.level <= 3 ? 4 : 10;
        
        // Aktualisiere die Level-Anzeige mit dem aktuellen Level und dem Fortschritt
        const sidebarLevel = document.getElementById('sidebarLevel');
        if (sidebarLevel) sidebarLevel.textContent = `${gameState.level} (${gameState.monstersKilled}/${monstersNeeded})`;
        
        // Zeige die Verteidigung an, wenn sie größer als 0 ist
        const sidebarDefenseContainer = document.getElementById('sidebarDefenseContainer');
        const sidebarDefense = document.getElementById('sidebarDefense');
        
        if (sidebarDefenseContainer && sidebarDefense) {
            if (gameState.defense > 0) {
                sidebarDefenseContainer.style.display = 'flex';
                sidebarDefense.textContent = gameState.defense;
            } else {
                sidebarDefenseContainer.style.display = 'none';
            }
        }
        
        const sidebarScore = document.getElementById('sidebarScore');
        if (sidebarScore) sidebarScore.textContent = gameState.score;
        
        const sidebarInventory = document.getElementById('sidebarInventory');
        if (sidebarInventory) sidebarInventory.textContent = gameState.inventory.length;
        
        // Berechne die Gesamtzahl der Materialien
        let totalMaterials = 0;
        gameState.materials.forEach(material => {
            totalMaterials += material.amount;
        });
        
        const sidebarMaterials = document.getElementById('sidebarMaterials');
        if (sidebarMaterials) sidebarMaterials.textContent = totalMaterials;
        
        // Speichere den Spielstand
        saveGameState();
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Anzeige:', error);
    }
}

/**
 * Fügt einen Eintrag zum Kampfprotokoll hinzu
 * @param {string} type - Der Typ des Eintrags (info, damage, kill, success)
 * @param {string} message - Die Nachricht, die zum Protokoll hinzugefügt werden soll
 */
function addCombatLogEntry(type, message) {
    const combatLog = document.getElementById('combatLog');
    if (!combatLog) return;
    
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = message;
    
    combatLog.appendChild(entry);
    combatLog.scrollTop = combatLog.scrollHeight;
    
    debugLog(`Combat Log: ${message}`);
} 