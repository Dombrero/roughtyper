/**
 * compat.js - Kompatibilitätsschicht für RoughType
 * Verbindet die alten Database_extender-Dateien mit der neuen Struktur
 */

// Fehlerbehandlung für Erweiterungen
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Fehler in der Erweiterung:', message, 'in', source, 'Zeile', lineno);
    return true; // Verhindern, dass der Fehler an die Konsole weitergegeben wird
};

// Initialisierung nach dem vollständigen Laden der Seite
window.addEventListener('load', function() {
    console.log('Initialisiere Kompatibilitätsschicht...');
    
    try {
        // Stelle sicher, dass die gameState-Variable global verfügbar ist
        window.gameState = gameState;
        
        // Füge die Bosse aus dem neuen Code zum window-Objekt hinzu
        window.level10Boss = level10Boss;
        
        // Exportiere die wichtigen Funktionen aus dem neuen Code an das window-Objekt
        // für die Kompatibilität mit dem alten Code
        window.initGame = initGame;
        window.gameLoop = gameLoop;
        window.updateEnemies = updateEnemies;
        window.spawnEnemy = spawnEnemy;
        window.removeEnemy = removeEnemy;
        window.handleGameInput = handleGameInput;
        window.handleNormalGameInput = handleNormalGameInput;
        window.createProjectile = createProjectile;
        window.levelUp = levelUp;
        window.gameOver = gameOver;
        window.addMaterial = addMaterial;
        
        // Boss-Funktionen
        window.initLevel10Boss = initLevel10Boss;
        window.spawnBossWord = spawnBossWord;
        window.removeBossWord = removeBossWord;
        window.updateBossHealthBar = updateBossHealthBar;
        window.defeatLevel10Boss = defeatLevel10Boss;
        window.updateLevel10Boss = updateLevel10Boss;
        window.handleLevel10BossInput = handleLevel10BossInput;
        
        // UI-Funktionen
        window.returnToMenu = returnToMenu;
        window.saveGameState = saveGameState;
        window.loadGameState = loadGameState;
        window.resetGameState = resetGameState;
        window.updateDisplay = updateDisplay;
        window.addCombatLogEntry = addCombatLogEntry;
        window.debugLog = debugLog;
        window.focusInput = focusInput;
        window.refreshVirtualKeyboard = refreshVirtualKeyboard;
        window.showInventory = showInventory;
        window.handleInventoryInput = handleInventoryInput;
        window.sellAllMaterials = sellAllMaterials;
        window.showShop = showShop;
        window.handleShopInput = handleShopInput;
        window.buyItem = buyItem;
        window.showLevelSelect = showLevelSelect;
        window.handleLevelSelectInput = handleLevelSelectInput;
        window.selectLevel = selectLevel;
        
        // Practice-Funktionen
        window.startPracticeMode = startPracticeMode;
        window.initPracticeMode = initPracticeMode;
        window.generatePracticeWord = generatePracticeWord;
        window.updatePracticeScore = updatePracticeScore;
        window.handlePracticeInput = handlePracticeInput;
        
        // Daten-Export
        window.enemyTypes = enemyTypes;
        window.bosses = bosses;
        window.shopItems = shopItems;
        
        // Prüfe, ob die Erweiterungen erfolgreich geladen wurden
        if (typeof extendedEnemyTypes !== 'undefined') {
            console.log('Database_extender-Dateien erfolgreich geladen');
            
            // Initialisiere die Erweiterungen
            if (typeof initExtensions === 'function') {
                console.log('Initialisiere Erweiterungen...');
                try {
                    initExtensions();
                    console.log('Erweiterungen erfolgreich initialisiert');
                } catch (error) {
                    console.error('Fehler beim Initialisieren der Erweiterungen:', error);
                }
            } else {
                console.warn('initExtensions-Funktion nicht gefunden');
            }
        } else {
            console.warn('Database_extender-Dateien nicht gefunden');
        }
        
        console.log('Kompatibilitätsschicht erfolgreich initialisiert');
    } catch (error) {
        console.error('Fehler beim Initialisieren der Kompatibilitätsschicht:', error);
    }
}); 