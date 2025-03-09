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
    
    // Theme-Wechsel initialisieren
    initThemeToggle();
    
    // Debug-Modus initialisieren
    initDebugMode();
    
    // Spielstand laden
    loadGameState();
    
    // Event-Listener für Eingabe hinzufügen
    typingInput.addEventListener('input', handleGameInput);
    
    // Event-Listener für Fokus hinzufügen
    document.addEventListener('click', focusInput);
    document.addEventListener('keydown', focusInput);
    
    // Anzeige aktualisieren
    updateDisplay();
    
    // Virtuelle Tastatur initialisieren
    refreshVirtualKeyboard();
    
    // Erweiterungen laden, wenn verfügbar
    if (typeof initExtensions === 'function') {
        initExtensions();
    }
    
    console.log('RoughType wurde erfolgreich initialisiert!');
});

/**
 * Initialisiert den Theme-Wechsel
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
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
    if (!gameState.debugMode) return;
    
    const debugLog = document.getElementById('debugLog');
    if (!debugLog) return;
    
    const entry = document.createElement('div');
    entry.className = `debug-entry debug-${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    
    debugLog.appendChild(entry);
    debugLog.scrollTop = debugLog.scrollHeight;
    
    console.log(`[DEBUG] ${message}`);
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
    keys.forEach(key => {
        key.classList.remove('active');
        
        key.addEventListener('click', function() {
            const keyValue = this.getAttribute('data-key');
            if (keyValue) {
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
    mainMenu.classList.remove('hidden');
    gameContainer.style.display = 'none';
    
    // Eingabefeld leeren
    typingInput.value = '';
    
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
        alert('Fehler beim Speichern des Spielstands!');
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
        alert('Fehler beim Laden des Spielstands!');
        
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
    
    // Speichere den zurückgesetzten Spielstand
    saveGameState();
    
    debugLog('Spielstand zurückgesetzt');
}

/**
 * Aktualisiert die Anzeige
 */
function updateDisplay() {
    // Aktualisiere die Sidebar-Anzeige
    document.getElementById('sidebarHealth').textContent = `${gameState.playerHealth}/1000`;
    document.getElementById('sidebarGold').textContent = gameState.gold;
    
    // Berechne die Anzahl der Monster, die für ein Level-Up benötigt werden
    const monstersNeeded = gameState.level <= 3 ? 4 : 10;
    
    // Aktualisiere die Level-Anzeige mit dem aktuellen Level und dem Fortschritt
    document.getElementById('sidebarLevel').textContent = `${gameState.level} (${gameState.monstersKilled}/${monstersNeeded})`;
    
    // Zeige die Verteidigung an, wenn sie größer als 0 ist
    if (gameState.defense > 0) {
        document.getElementById('sidebarDefenseContainer').style.display = 'flex';
        document.getElementById('sidebarDefense').textContent = gameState.defense;
    } else {
        document.getElementById('sidebarDefenseContainer').style.display = 'none';
    }
    
    document.getElementById('sidebarScore').textContent = gameState.score;
    document.getElementById('sidebarInventory').textContent = gameState.inventory.length;
    
    // Berechne die Gesamtzahl der Materialien
    let totalMaterials = 0;
    gameState.materials.forEach(material => {
        totalMaterials += material.amount;
    });
    document.getElementById('sidebarMaterials').textContent = totalMaterials;
    
    // Speichere den Spielstand
    saveGameState();
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