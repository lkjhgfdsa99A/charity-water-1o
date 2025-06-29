// Game navigation functions
function startGame() {
    // Clean up any existing win screen
    const existingWinScreen = document.getElementById('winScreen');
    if (existingWinScreen) {
        existingWinScreen.remove();
    }
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
    });
    
    // Show game screen
    document.getElementById('gameScreen').classList.add('active');
    document.getElementById('gameScreen').style.display = 'flex';
    
    initializeGame();
}

function goBack() {
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('startScreen').classList.add('active');
}

// Reset the entire game
function resetGame() {
    // Reset all game variables
    gameActive = false;
    waterDrops = [];
    dropCounter = 0;
    selectedDrop = null;
    followingDrop = null;
    currentProcessingTool = null;
    processingTimer = null;
    waterLevel = 0;
    currentRuleLevel = 1;
    dropsCollected = 0;
    availableWaterTypes = ['clean'];
    seenWaterTypes = new Set(['clean']);
    playerHasWon = false; // Reset win state
    gamePaused = false; // Reset pause state
    hasHadWaterAboveThreshold = false; // Reset threshold tracking
    hasClickedQuizBefore = false; // Reset quiz click tracking
    hasSeenTimeManagementRule = false; // Reset time management rule tracking
    
    // Reset milestone notifications
    milestoneNotifications = {
        lowWater: false,
        halfFull: false,
        almostFull: false
    };
    
    // Clear any active rule notifications
    if (window.currentRuleNotification) {
        window.currentRuleNotification.remove();
        window.currentRuleNotification = null;
    }
    
    // Timer system - REMOVED
    
    // Reset weather system
    if (evaporationTimer) {
        clearInterval(evaporationTimer);
        evaporationTimer = null;
    }
    currentWeather = 'Clear';
    
    // Clear any following drops
    if (followingDrop) {
        followingDrop.remove();
        followingDrop = null;
    }
    
    // Clear all temporary drops
    temporaryDrops.forEach(tempDrop => {
        if (tempDrop.element && tempDrop.element.parentNode) {
            tempDrop.element.remove();
        }
    });
    temporaryDrops = [];
    
    // Reset cursor
    document.body.style.cursor = 'default';
    
    // Clear tool drops
    toolDrops = {
        microscope: null,
        filter: null,
        'boiling-pot': null
    };
    
    // Close any open dialogs
    hideAllDialogs();
    
    // Clean up any dynamically created win screen
    const existingWinScreen = document.getElementById('winScreen');
    if (existingWinScreen) {
        existingWinScreen.remove();
    }
    
    // Hide all screens and show start screen
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
    });
    
    document.getElementById('startScreen').classList.add('active');
    document.getElementById('startScreen').style.display = 'flex';
}

// Secret dev function to fill reservoir instantly
function fillReservoir() {
    waterLevel = 20;
    dropsCollected = 20;
    updateWaterLevel();
    
    // Timer system - REMOVED
    
    setTimeout(() => {
        showWinScreen();
    }, 500);
}

// Secret drain function to drain all water from reservoir
function drainReservoir() {
    if (gameActive) {
        waterLevel = 0;
        dropsCollected = 0;
        updateWaterLevel();
        console.log('🌊 DEV: Reservoir drained! Water level set to 0');
        
        // Check if this triggers loss condition
        if (waterLevel <= 0) {
            console.log('🌊 DEV: Loss condition triggered by drain');
            showLossScreen();
        }
    } else {
        console.log('🌊 DEV: Game not active');
    }
}

// Secret function to set water level below 6 for testing quiz alert
function setLowWater() {
    if (gameActive) {
        // Set water to 5 drops (below 30% threshold)
        waterLevel = 5;
        dropsCollected = 5;
        // Mark that player has had water above threshold to trigger low water alert
        hasHadWaterAboveThreshold = true;
        updateWaterLevel();
        console.log('⚠️ DEV: Water level set to 5 drops for low water alert testing');
    } else {
        console.log('⚠️ DEV: Game not active');
    }
}

// Show win screen
function showWinScreen() {
    console.log('WIN: showWinScreen called');
    
    // Play win sound
    playWinSound();
    
    // Timer system - REMOVED
    
    // Stop game
    gameActive = false;
    playerHasWon = true; // Mark player as having won
    console.log('WIN: gameActive set to false');
    
    // Hide all existing screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
        console.log('WIN: Hidden screen', screen.id);
    });
    
    // Clear any following drops
    if (followingDrop) {
        followingDrop.remove();
        followingDrop = null;
    }
    
    // Reset cursor
    document.body.style.cursor = 'default';
    
    // Create and show win screen dynamically
    createWinScreen();
    
    // Trigger celebration effects
    setTimeout(() => {
        createConfettiCelebration();
        createCelebrationBurst();
    }, 500);
}

// Dynamically create win screen
function createWinScreen() {
    // Remove any existing win screen
    const existingWinScreen = document.getElementById('winScreen');
    if (existingWinScreen) {
        existingWinScreen.remove();
    }
    
    // Create win screen element
    const winScreen = document.createElement('div');
    winScreen.className = 'screen win-screen active';
    winScreen.id = 'winScreen';
    
    winScreen.innerHTML = `
        <div class="win-content">
            <!-- Mission Complete Header -->
            <div class="mission-complete-header">
                <div class="checkmark-icon">✓</div>
                <h1>Mission Complete!</h1>
                <p>You've secured clean water for your family</p>
                <img src="assets/icons/charitywater logo.png" alt="Charity Water" class="win-charity-logo">
            </div>
            
            <!-- Impact Card -->
            <div class="impact-card">
                <h2>Your Impact:</h2>
                <div class="impact-items">
                    <div class="impact-item">
                        <span class="impact-icon">💧</span>
                        <span class="impact-text">20 clean water drops collected</span>
                    </div>
                    <div class="impact-item">
                        <span class="impact-icon">✅</span>
                        <span class="impact-text">Family kept safe and hydrated</span>
                    </div>
                    <div class="impact-item">
                        <span class="impact-icon">🎓</span>
                        <span class="impact-text">Learned about water safety</span>
                    </div>
                </div>
                
                <div class="real-impact-section">
                    <h3>Real Impact:</h3>
                    <p>Every $30 donated to charity: water provides one person with clean water for life. <a href="https://charitywater.org" target="_blank">Learn more at charitywater.org</a></p>
                </div>
                
                <div class="action-buttons">
                    <button class="play-again-btn" onclick="resetGame()">Play Again</button>
                    <button class="learn-more-btn" onclick="window.open('https://charitywater.org', '_blank')">Learn More</button>
                </div>
            </div>
        </div>
        
        <!-- Game Logo - Bottom Left -->
        <img src="assets/icons/Gamelogo.png" alt="Thirst Game Logo" class="win-game-logo">
    `;
    
    // Add to body
    document.body.appendChild(winScreen);
    
    console.log('WIN: Win screen created and displayed');
}

// Create massive emoji confetti celebration effect
function createConfettiCelebration() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    confettiContainer.id = 'confettiContainer';
    
    // Celebration emojis - water themed and general celebration
    const celebrationEmojis = [
        '🎉', '🎊', '✨', '🌟', '⭐', '💫', '🎈', '🎁', '🏆', '🥳',
        '💧', '🌊', '💦', '🚰', '🏺', '🌍', '🌎', '🌏', '💙', '💎',
        '🎯', '✅', '🔥', '💪', '👏', '🙌', '🎵', '🎶', '🌈', '☀️',
        '🎭', '🎪', '🎨', '🎲', '🎸', '🎺', '🎻', '🥁', '🎤', '🎧'
    ];
    
    // Create 80 emoji confetti pieces for massive effect!
    for (let i = 0; i < 80; i++) {
        const emojiConfetti = document.createElement('div');
        emojiConfetti.className = 'emoji-confetti';
        
        // Random emoji
        const randomEmoji = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
        emojiConfetti.textContent = randomEmoji;
        
        // Random speed class
        const speeds = ['', 'fast', 'slow'];
        const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];
        if (randomSpeed) {
            emojiConfetti.classList.add(randomSpeed);
        }
        
        // Random horizontal position
        emojiConfetti.style.left = Math.random() * 100 + '%';
        
        // Random animation delay (spread over 4 seconds)
        emojiConfetti.style.animationDelay = Math.random() * 4 + 's';
        
        // Random size variation
        const sizes = ['20px', '24px', '28px', '32px', '36px'];
        emojiConfetti.style.fontSize = sizes[Math.floor(Math.random() * sizes.length)];
        
        confettiContainer.appendChild(emojiConfetti);
    }
    
    document.body.appendChild(confettiContainer);
    
    // Create multiple waves of confetti
    setTimeout(() => createSecondWave(confettiContainer), 2000);
    setTimeout(() => createThirdWave(confettiContainer), 4000);
    
    // Remove confetti after all animations complete
    setTimeout(() => {
        if (confettiContainer.parentNode) {
            confettiContainer.remove();
        }
    }, 12000);
}

// Create second wave of confetti
function createSecondWave(container) {
    const waveEmojis = ['🎉', '💧', '✨', '🌟', '🎊', '💦', '🏆', '🥳', '💙', '🌊'];
    
    for (let i = 0; i < 40; i++) {
        const emojiConfetti = document.createElement('div');
        emojiConfetti.className = 'emoji-confetti fast';
        
        const randomEmoji = waveEmojis[Math.floor(Math.random() * waveEmojis.length)];
        emojiConfetti.textContent = randomEmoji;
        
        emojiConfetti.style.left = Math.random() * 100 + '%';
        emojiConfetti.style.animationDelay = Math.random() * 2 + 's';
        emojiConfetti.style.fontSize = '30px';
        
        container.appendChild(emojiConfetti);
    }
}

// Create third wave of confetti
function createThirdWave(container) {
    const finalEmojis = ['🎉', '🎊', '🏆', '✨', '💧', '🌟', '💙', '🥳'];
    
    for (let i = 0; i < 30; i++) {
        const emojiConfetti = document.createElement('div');
        emojiConfetti.className = 'emoji-confetti slow';
        
        const randomEmoji = finalEmojis[Math.floor(Math.random() * finalEmojis.length)];
        emojiConfetti.textContent = randomEmoji;
        
        emojiConfetti.style.left = Math.random() * 100 + '%';
        emojiConfetti.style.animationDelay = Math.random() * 1 + 's';
        emojiConfetti.style.fontSize = '26px';
        
        container.appendChild(emojiConfetti);
    }
}

// Create celebration burst effect
function createCelebrationBurst() {
    const burstContainer = document.createElement('div');
    burstContainer.className = 'celebration-burst';
    
    // Create 12 burst particles
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'burst-particle';
        
        // Calculate random direction
        const angle = (i / 12) * 2 * Math.PI;
        const distance = 100 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.setProperty('--x', x + 'px');
        particle.style.setProperty('--y', y + 'px');
        
        // Random colors
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        burstContainer.appendChild(particle);
    }
    
    document.body.appendChild(burstContainer);
    
    // Remove burst after animation completes
    setTimeout(() => {
        if (burstContainer.parentNode) {
            burstContainer.remove();
        }
    }, 2000);
}

// Secret key combination to show dev button (Ctrl+Shift+D)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        const devButton = document.getElementById('secretDevButton');
        if (devButton.style.display === 'none' || devButton.style.display === '') {
            devButton.style.display = 'block';
            console.log('🎮 DEV: Secret dev button activated!');
        } else {
            devButton.style.display = 'none';
            console.log('🎮 DEV: Secret dev button hidden!');
        }
    }
    
    // Secret drain button toggle (Ctrl+Shift+T)
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        const secretDrainButton = document.getElementById('secretDrainButton');
        if (secretDrainButton.style.opacity === '0' || secretDrainButton.style.opacity === '') {
            secretDrainButton.style.opacity = '1';
            secretDrainButton.style.pointerEvents = 'auto';
            console.log('🌊 DEV: Secret drain button shown!');
        } else {
            secretDrainButton.style.opacity = '0';
            secretDrainButton.style.pointerEvents = 'none';
            console.log('🌊 DEV: Secret drain button hidden!');
        }
    }
    
    // Secret toxic water rule test (Ctrl+Shift+R)
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        const toxicRule = RULES.find(r => r.waterType === 'toxic-water');
        if (toxicRule) {
            console.log('🧪 DEV: Testing toxic water rule dialog');
            showRuleNotification(toxicRule);
        }
    }
    
    // Secret low water button toggle (Ctrl+Shift+L)
    if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        const secretLowWaterButton = document.getElementById('secretLowWaterButton');
        if (secretLowWaterButton.style.opacity === '0' || secretLowWaterButton.style.opacity === '') {
            secretLowWaterButton.style.opacity = '1';
            secretLowWaterButton.style.pointerEvents = 'auto';
            console.log('⚠️ DEV: Secret low water button shown!');
        } else {
            secretLowWaterButton.style.opacity = '0';
            secretLowWaterButton.style.pointerEvents = 'none';
            console.log('⚠️ DEV: Secret low water button hidden!');
        }
    }
});

// Game variables
let gameActive = false;
let waterDrops = [];
let dropCounter = 0;
let selectedDrop = null;
let followingDrop = null;
let currentProcessingTool = null;
let processingTimer = null;
let waterLevel = 0; // Current water level (0-20)
let currentWeather = 'Clear'; // Current weather condition
let weatherTimer = null;
let evaporationTimer = null;
let gamePaused = false; // Add game pause state
let hasHadWaterAboveThreshold = false; // Track if player has ever had water above 30%
let hasClickedQuizBefore = false; // Track if player has clicked quiz before
let hasSeenTimeManagementRule = false; // Track if time management rule has been shown

// Timer system - REMOVED - Timer functionality removed


// Progressive rule system
let currentRuleLevel = 1;
let dropsCollected = 0;
let availableWaterTypes = ['clean']; // Start with only clean water
let seenWaterTypes = new Set(['clean']); // Track which water types have been seen

// Catchment zone cooldown system
let slotCooldowns = [0, 0, 0, 0]; // Cooldown timers for each slot
let slotTimers = [null, null, null, null]; // Timer references for each slot
let gameHasStartedGenerating = false; // Track if game has started generating diverse water types

// Weather dice system - mandatory rolling every 3 drops
let dropsCollectedSinceLastRoll = 0;
let weatherRollRequired = false;
let firstDiceRoll = true;

// Track drops in tools - persists even when dialogs are closed
let toolDrops = {
    microscope: null,
    filter: null,
    'boiling-pot': null
};

// Water drop types and their properties
const WATER_TYPES = {
    clean: { name: 'Clean', canGoTo: ['reservoir', 'microscope'], color: '#4A90E2' },
    polluted: { name: 'Polluted', canGoTo: ['filter', 'microscope'], color: '#FF9800', needsTreatment: 'filter' },
    contaminated: { name: 'Contaminated', canGoTo: ['boiling-pot', 'microscope'], color: '#F44336', needsTreatment: 'boiling-pot' },
    'toxic-water': { name: 'Toxic Water', canGoTo: ['filter', 'microscope'], color: '#B8A080', needsTreatment: 'both', treatmentSteps: ['filter', 'boiling-pot'] },
    toxic: { name: 'Toxic', canGoTo: ['microscope'], color: '#9C27B0' }, // For fake clean water
    'suspicious-clean-polluted': { name: 'Suspicious Water', canGoTo: ['microscope'], color: '#4A90E2', actualType: 'polluted' },
    'suspicious-clean-contaminated': { name: 'Suspicious Water', canGoTo: ['microscope'], color: '#4A90E2', actualType: 'contaminated' },
    'suspicious-clean-toxic-water': { name: 'Suspicious Water', canGoTo: ['microscope'], color: '#4A90E2', actualType: 'toxic-water' }
};

// Calculated water type progression with MORE VARIETY early on
const WATER_TYPE_PHASES = {
    phase1: { // Drops 1-6: More variety with increased polluted water
        drops: [1, 6],
        probabilities: {
            clean: 50,              // Reduced from 70 to introduce more variety
            polluted: 45,           // Increased from 25 to give more polluted water early
            contaminated: 5         // Keep some contaminated water
        }
    },
    phase2: { // Drops 7-12: Intense challenge with good variety
        drops: [7, 12],
        probabilities: {
            clean: 25,              // Reduced from 35 for more challenge
            polluted: 35,           // Increased from 30 for consistent polluted water
            contaminated: 25,       // Increased from 20 for more variety
            'suspicious-clean-polluted': 10,    // Same as before
            'suspicious-clean-contaminated': 5  // Same as before
        }
    },
    phase3: { // Drops 13-20: Maximum challenge but still balanced
        drops: [13, 20],
        probabilities: {
            clean: 10,              // Reduced from 15 for extreme challenge
            polluted: 25,           // Same as before
            contaminated: 30,       // Same as before
            'suspicious-clean-polluted': 15,    // Same as before
            'suspicious-clean-contaminated': 15, // Increased from 10 for more suspicious water
            'toxic-water': 5        // Same as before
        }
    }
};

// Catchment zone cooldown rates by phase (AGGRESSIVE SCARCITY)
const CATCHMENT_COOLDOWNS = {
    phase1: { min: 5000, max: 10000 },   // 5-10 seconds (was 3-6)
    phase2: { min: 8000, max: 15000 },   // 8-15 seconds (was 4-8)
    phase3: { min: 12000, max: 20000 }   // 12-20 seconds (was 6-12)
};

// Add a global variable to track if the player has won
let playerHasWon = false;

// Track temporary drops placed on game area
let temporaryDrops = [];

// Milestone tracking
let milestoneNotifications = {
    lowWater: false,      // 30% (6/20)
    halfFull: false,      // 50% (10/20)
    almostFull: false     // 85% (17/20)
};

// Sound system
let winSound = null;
let lossSound = null;
let milestoneSound = null;
let soundEnabled = true;

// Initialize sound system
function initializeSounds() {
    try {
        // Initialize win sound
        winSound = new Audio('assets/sounds/8-bit-video-game-win-level-sound-version-1-145827.mp3');
        winSound.volume = 0.7;
        winSound.preload = 'auto';
        
        // Initialize loss sound
        lossSound = new Audio('assets/sounds/8-bit-video-game-fail-version-2-145478.mp3');
        lossSound.volume = 0.7;
        lossSound.preload = 'auto';
        
        // Initialize milestone sound
        milestoneSound = new Audio('assets/sounds/game-bonus-02-294436.mp3');
        milestoneSound.volume = 0.6; // Slightly quieter for milestones
        milestoneSound.preload = 'auto';
        
        // Handle sound loading errors gracefully
        [winSound, lossSound, milestoneSound].forEach((sound, index) => {
            const soundNames = ['Win', 'Loss', 'Milestone'];
            
            sound.addEventListener('error', (e) => {
                console.log(`${soundNames[index]} sound failed to load:`, e);
            });
            
            sound.addEventListener('canplaythrough', () => {
                console.log(`${soundNames[index]} sound loaded successfully`);
            });
        });
        
    } catch (error) {
        console.log('Sound initialization failed:', error);
        soundEnabled = false;
    }
}

// Play win sound
function playWinSound() {
    playSound(winSound, 'Win');
}

// Play loss sound
function playLossSound() {
    playSound(lossSound, 'Loss');
}

// Play milestone sound
function playMilestoneSound() {
    playSound(milestoneSound, 'Milestone');
}

// Generic sound play function
function playSound(sound, soundName) {
    if (soundEnabled && sound) {
        try {
            sound.currentTime = 0; // Reset to beginning
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log(`${soundName} sound played successfully`);
                }).catch((error) => {
                    console.log(`${soundName} sound play failed:`, error);
                });
            }
        } catch (error) {
            console.log(`Error playing ${soundName} sound:`, error);
        }
    }
}

// Initialize game
function initializeGame() {
    gameActive = true;
    
    // Reset progressive system
    currentRuleLevel = 1;
    dropsCollected = 0;
    availableWaterTypes = ['clean'];
    seenWaterTypes = new Set(['clean']);
    
    // Reset temporary drops
    temporaryDrops = [];
    
    // Reset catchment zone cooldowns
    slotCooldowns = [0, 0, 0, 0];
    slotTimers.forEach(timer => {
        if (timer) clearInterval(timer);
    });
    slotTimers = [null, null, null, null];
    gameHasStartedGenerating = false;
    
    // Reset weather dice system
    dropsCollectedSinceLastRoll = 0;
    weatherRollRequired = false;
    firstDiceRoll = true;
    
    // Initialize sound system
    initializeSounds();
    
    // Timer system - REMOVED
    
    // Initialize weather system
    initializeWeatherSystem();
    
    // Initialize dice button state
    updateDiceButtonState();
    
    // Initialize rules panel
    initializeRulesPanel();
    
    generateWaterDrops();
    
    // Add click listener to the whole document
    document.addEventListener('click', handleDocumentClick);
    
    // Add mouse move listener for following drop
    document.addEventListener('mousemove', handleMouseMove);
    
    // Initialize tool status displays
    updateToolStatus('microscope', 'Available');
    updateToolStatus('filter', 'Available');
    updateToolStatus('boiling-pot', 'Available');
    
    // Initialize water level display
    updateWaterLevel();
    
    // Initialize emergency quiz status
    updateEmergencyQuizStatus();
    
    // Add click handlers to tools for opening empty dialogs
    addToolClickHandlers();
}

// Generate all water drops in a horizontal row
function generateWaterDrops() {
    const catchmentZone = document.querySelector('.water-catchment-zone');
    
    // Clear any existing drops
    catchmentZone.innerHTML = '';
    waterDrops = [];
    
    // Create 4 water drops with random types (including fake clean water)
    for (let i = 0; i < 4; i++) {
        createRandomWaterDrop(i);
    }
}

// Get current game phase based on drops collected
function getCurrentPhase() {
    if (dropsCollected <= 6) return 'phase1';
    if (dropsCollected <= 12) return 'phase2';
    return 'phase3';
}

// Generate water type based on calculated probabilities
function getCalculatedWaterType() {
    // For the very first water generation (game start), only generate clean water
    // This prevents polluted water rule notification from showing immediately
    if (dropsCollected === 0 && !gameHasStartedGenerating) {
        return 'clean';
    }
    
    const currentPhase = getCurrentPhase();
    const phaseData = WATER_TYPE_PHASES[currentPhase];
    const probabilities = phaseData.probabilities;
    
    // Create weighted array
    const weightedTypes = [];
    for (const [type, weight] of Object.entries(probabilities)) {
        for (let i = 0; i < weight; i++) {
            weightedTypes.push(type);
        }
    }
    
    // Select random type from weighted array
    return weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
}

// Create a single random water drop at specified position
function createRandomWaterDrop(position) {
    const catchmentZone = document.querySelector('.water-catchment-zone');
    
    // Check if slot is on cooldown
    if (slotCooldowns[position] > Date.now()) {
        // Create empty slot with countdown
        createEmptySlot(position);
        return;
    }
    
    // Use calculated water type progression instead of random
    const randomType = getCalculatedWaterType();
    
    const drop = document.createElement('div');
    // Visual appearance: fake-clean types look clean, others show their actual type
    let visualClass = randomType;
    if (randomType.includes('suspicious-clean')) {
        visualClass = 'clean';
    }
    drop.className = `water-drop ${visualClass}`;
    drop.id = `drop-${position}`;
    drop.dataset.position = position;
    drop.dataset.actualType = randomType; // Store the actual type
    
    // Add click handler
    drop.addEventListener('click', (e) => {
        e.stopPropagation();
        selectWaterDrop(drop);
    });
    
    // Add to DOM
    catchmentZone.appendChild(drop);
    
    // Update waterDrops array
    waterDrops[position] = drop;
}

// Create empty slot with cooldown timer
function createEmptySlot(position) {
    const catchmentZone = document.querySelector('.water-catchment-zone');
    
    const emptySlot = document.createElement('div');
    emptySlot.className = 'water-drop empty-slot';
    emptySlot.id = `slot-${position}`;
    emptySlot.dataset.position = position;
    
    // Add cooldown display
    const cooldownDisplay = document.createElement('div');
    cooldownDisplay.className = 'cooldown-display';
    cooldownDisplay.textContent = Math.ceil((slotCooldowns[position] - Date.now()) / 1000) + 's';
    emptySlot.appendChild(cooldownDisplay);
    
    // Add to DOM
    catchmentZone.appendChild(emptySlot);
    
    // Update waterDrops array
    waterDrops[position] = emptySlot;
    
    // Start countdown timer
    if (slotTimers[position]) {
        clearInterval(slotTimers[position]);
    }
    
    slotTimers[position] = setInterval(() => {
        const remaining = Math.ceil((slotCooldowns[position] - Date.now()) / 1000);
        if (remaining <= 0) {
            clearInterval(slotTimers[position]);
            slotTimers[position] = null;
            // Replace empty slot with new water drop
            emptySlot.remove();
            createRandomWaterDrop(position);
        } else {
            cooldownDisplay.textContent = remaining + 's';
        }
    }, 1000);
}

// Handle selecting a water drop
function selectWaterDrop(drop) {
    // Prevent selecting a new drop if one is already following the mouse
    if (followingDrop) {
        return;
    }
    
    // Don't allow drop selection if game is paused (dialog open)
    if (gamePaused) {
        console.log(`🔧 DEBUG: Drop selection blocked - game is paused`);
        return;
    }
    
    // Check if weather roll is required before allowing drop selection
    if (weatherRollRequired) {
        showInvalidDropFeedback('weather_roll_required');
        return;
    }
    
    const position = parseInt(drop.dataset.position);
    const actualType = drop.dataset.actualType;
    
    // Check if this is a new water type being clicked for the first time
    checkForNewWaterType(actualType);
    
    selectedDrop = {
        type: actualType,
        visualType: drop.className.replace('water-drop ', ''),
        element: drop
    };
    

    
    // Remove the drop from catchment zone
    drop.remove();
    
    // Set cooldown for this slot based on current phase
    const currentPhase = getCurrentPhase();
    const cooldownRange = CATCHMENT_COOLDOWNS[currentPhase];
    const cooldownTime = Math.random() * (cooldownRange.max - cooldownRange.min) + cooldownRange.min;
    slotCooldowns[position] = Date.now() + cooldownTime;
    
    // Replace with new drop (will show cooldown if needed)
    createRandomWaterDrop(position);
    
    // Create a following drop that will follow the mouse
    createFollowingDrop();
    
    // Change cursor to indicate a drop is selected
    document.body.style.cursor = 'none';
}

// Handle document click to place the selected drop
function handleDocumentClick(e) {
    if (!selectedDrop) return;
    
    // Don't handle drop interactions if game is paused (dialog open)
    if (gamePaused) {
        console.log(`🔧 DEBUG: Drop interaction blocked - game is paused`);
        return;
    }
    
    // Ignore clicks on UI elements (buttons, dialogs, etc.)
    if (e.target.closest('button') || 
        e.target.closest('.dialog') || 
        e.target.closest('.tool-dialog') ||
        e.target.closest('.rules-panel') ||
        e.target.closest('.water-catchment-zone') ||
        e.target.closest('.dice-container')) {
        console.log(`🔧 DEBUG: Click on UI element ignored:`, e.target);
        return;
    }
    
    // Check if clicking on an existing water drop (temporary drops handle their own clicks now)
    if (e.target.classList.contains('water-drop')) {
        // Temporary drops have their own click handlers, so this shouldn't be reached for them
        console.log(`🔧 DEBUG: Click on water drop (not temporary):`, e.target);
        return;
    }
    
    const validDropZone = getValidDropZone(e.clientX, e.clientY);
    
    if (validDropZone) {
        // Check if this drop type can go to this zone
        if (!canDropGoToZone(selectedDrop.type, validDropZone)) {
            showInvalidDropFeedback('wrong_water_type');
            return;
        }
        
        // Handle the drop based on the zone
        const dropHandled = handleWaterDrop(validDropZone, e.clientX, e.clientY);
        
        // Only reset selection and remove following drop if drop was successfully handled
        if (dropHandled) {
            // Remove the following drop
            if (followingDrop) {
                followingDrop.remove();
                followingDrop = null;
            }
            selectedDrop = null;
            document.body.style.cursor = 'default';
        }
        // If drop wasn't handled (tool occupied), keep the drop following the mouse
    } else {
        // No valid drop zone found - place the drop temporarily on the game area
        placeTemporaryDrop(e.clientX, e.clientY);
    }
}

// Place a temporary drop on the game area that can be picked up later
function placeTemporaryDrop(x, y) {
    console.log(`Placing temporary ${selectedDrop.type} drop at (${x}, ${y})`);
    
    // Create the temporary drop element
    const tempDrop = document.createElement('div');
    tempDrop.className = `water-drop ${selectedDrop.visualType} temporary-drop`;
    tempDrop.style.position = 'absolute';
    tempDrop.style.left = (x - 30) + 'px';
    tempDrop.style.top = (y - 30) + 'px';
    tempDrop.style.zIndex = '100';
    tempDrop.style.cursor = 'pointer';
    tempDrop.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
    
    // Store temp drop data for easy access
    const tempDropData = {
        type: selectedDrop.type,
        visualType: selectedDrop.visualType,
        element: tempDrop,
        x: x,
        y: y,
        timestamp: Date.now()
    };
    
    // Add click handler to pick up the temporary drop
    tempDrop.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Don't pick up if already carrying a drop
        if (followingDrop || selectedDrop) {
            return;
        }
        
        // Don't pick up if game is paused
        if (gamePaused) {
            return;
        }
        
        // Set as selected drop
        selectedDrop = {
            type: tempDropData.type,
            visualType: tempDropData.visualType,
            element: tempDrop
        };
        
        // Remove from temporary drops array
        const tempDropIndex = temporaryDrops.findIndex(drop => drop.element === tempDrop);
        if (tempDropIndex !== -1) {
            temporaryDrops.splice(tempDropIndex, 1);
        }
        
        // Remove from DOM
        tempDrop.remove();
        
        // Create a following drop that will follow the mouse
        createFollowingDrop();
        
        // Change cursor to indicate a drop is selected
        document.body.style.cursor = 'none';
        
        console.log(`Picked up temporary drop. Remaining: ${temporaryDrops.length}`);
    });
    
    // Add to DOM
    document.body.appendChild(tempDrop);
    
    // Store in temporary drops array
    temporaryDrops.push(tempDropData);
    
    // Remove the following drop
    if (followingDrop) {
        followingDrop.remove();
        followingDrop = null;
    }
    
    // Reset selection
    selectedDrop = null;
    document.body.style.cursor = 'default';
    
    console.log(`Temporary drop placed. Total temporary drops: ${temporaryDrops.length}`);
}

// Check if a drop type can go to a specific zone
function canDropGoToZone(dropType, dropZone) {
    const waterTypeInfo = WATER_TYPES[dropType];
    if (!waterTypeInfo) return false;
    
    if (dropZone.type === 'reservoir') {
        return waterTypeInfo.canGoTo.includes('reservoir');
    } else if (dropZone.type === 'tool') {
        return waterTypeInfo.canGoTo.includes(dropZone.subType);
    }
    
    return false;
}

// Create a drop that follows the mouse cursor
function createFollowingDrop() {
    if (!selectedDrop) return;
    
    followingDrop = document.createElement('div');
    followingDrop.className = `water-drop ${selectedDrop.visualType}`;
    followingDrop.style.position = 'absolute';
    followingDrop.style.pointerEvents = 'none';
    followingDrop.style.zIndex = '9999';
    followingDrop.style.transition = 'none';
    
    document.body.appendChild(followingDrop);
}

// Handle mouse movement to make drop follow cursor
function handleMouseMove(e) {
    // Don't move following drop if game is paused (rule dialog open)
    if (gamePaused) {
        console.log(`🔧 DEBUG: Mouse move blocked - game is paused`);
        return;
    }
    
    if (followingDrop) {
        followingDrop.style.left = (e.clientX - 30) + 'px';
        followingDrop.style.top = (e.clientY - 30) + 'px';
        
        updateDropZoneHighlight(e.clientX, e.clientY);
    }
}

// Check if coordinates are in a valid drop zone
function getValidDropZone(x, y) {
    const reservoir = document.querySelector('.reservoir');
    
    // Check reservoir bounds
    if (reservoir) {
        const reservoirRect = reservoir.getBoundingClientRect();
        if (x >= reservoirRect.left && x <= reservoirRect.right &&
            y >= reservoirRect.top && y <= reservoirRect.bottom) {
            return { type: 'reservoir', element: reservoir };
        }
    }
    
    // Check individual tool bounds (excluding emergency quiz)
    const toolItems = document.querySelectorAll('.tool-item:not(.emergency)');
    for (let i = 0; i < toolItems.length; i++) {
        const tool = toolItems[i];
        const toolRect = tool.getBoundingClientRect();
        if (x >= toolRect.left && x <= toolRect.right &&
            y >= toolRect.top && y <= toolRect.bottom) {
            let toolType = 'microscope';
            const img = tool.querySelector('img');
            if (img) {
                if (img.src.includes('microscope')) toolType = 'microscope';
                else if (img.src.includes('filter')) toolType = 'filter';
                else if (img.src.includes('pot')) toolType = 'boiling-pot';
            }
            return { type: 'tool', subType: toolType, element: tool };
        }
    }
    
    return null;
}

// Handle water drop placement in valid zones
function handleWaterDrop(dropZone, x, y) {
    const waterType = selectedDrop.type;
    
    if (dropZone.type === 'reservoir') {
        handleReservoirDrop(waterType, x, y);
        return true; // Reservoir always accepts drops
    } else if (dropZone.type === 'tool') {
        return handleToolDrop(waterType, dropZone.subType, x, y);
    }
    
    return false;
}

// Handle dropping water into reservoir
function handleReservoirDrop(waterType, x, y) {
    console.log(`Dropped ${waterType} water into reservoir`);
    
    // Create visual feedback drop
    const newDrop = document.createElement('div');
    newDrop.className = `water-drop ${selectedDrop.visualType}`;
    newDrop.style.position = 'absolute';
    newDrop.style.left = (x - 30) + 'px';
    newDrop.style.top = (y - 30) + 'px';
    document.body.appendChild(newDrop);
    
    // Game logic based on water type
    if (waterType === 'clean') {
        console.log('Clean water added to reservoir!');
        waterLevel = Math.min(waterLevel + 1, 20); // Increase water level, max 20
        dropsCollected++; // Track total drops collected
        dropsCollectedSinceLastRoll++; // Track drops since last weather roll
        
        // Check if weather roll is required (every 3 drops)
        if (dropsCollectedSinceLastRoll >= 3) {
            weatherRollRequired = true;
            console.log('Weather roll now required! Must roll dice before collecting more drops.');
            updateDiceButtonState();
        }
        
        updateWaterLevel();
        
        // Check for rule progression
        checkRuleProgression();
        
        // Time management rule is now triggered when first opening a tool dialog
        
        // Check for win condition
        if (waterLevel >= 20 && !playerHasWon) {
            console.log('WIN CONDITION: waterLevel >= 20 - Manual collection');
            showWinScreen();
        }
    } else {
        console.log('Warning: Contaminated water added to reservoir!');
        // Could add negative effects here
    }
    
    // Remove visual drop after animation
    setTimeout(() => {
        if (newDrop.parentNode) {
            newDrop.remove();
        }
    }, 1500);
}

// Handle dropping water into specific tool
function handleToolDrop(waterType, toolType, x, y) {
    console.log(`🔧 DEBUG: Dropped ${waterType} water into ${toolType}`);
    console.log(`🔧 DEBUG: Current tool state for ${toolType}:`, toolDrops[toolType]);
    console.log(`🔧 DEBUG: Game state - active: ${gameActive}, paused: ${gamePaused}`);
    
    // Check if tool already has a drop (either processing or ready to collect)
    if (toolDrops[toolType]) {
        console.log(`🔧 DEBUG: Tool ${toolType} already has a drop - rejecting new drop`);
        console.log(`🔧 DEBUG: Existing drop details:`, toolDrops[toolType]);
        showInvalidDropFeedback('tool_occupied');
        return false; // Return false to indicate drop was not handled
    }
    
    // Store the drop in the tool
    toolDrops[toolType] = {
        type: waterType,
        visualType: selectedDrop.visualType,
        originalType: waterType === 'toxic-water' ? 'toxic-water' : waterType,
        timestamp: Date.now(),
        collected: false
    };
    
    // Update tool status to "In Use" when it has a drop
    updateToolStatus(toolType, 'In Use');
    
    // Show tool dialog based on tool type
    showToolDialog(toolType, waterType);
    
    return true; // Return true to indicate drop was successfully handled
}

// Simplified tool dialog system - drops persist until collected
function showToolDialog(toolType, waterType = null) {
    console.log(`🔧 DEBUG: showToolDialog called for ${toolType}, waterType: ${waterType}`);
    
    // Show time management rule on first tool dialog opening
    if (!hasSeenTimeManagementRule && waterType) {
        hasSeenTimeManagementRule = true;
        const timeRule = RULES.find(r => r.id === 1);
        if (timeRule) {
            addRule(timeRule.id);
            showRuleNotification(timeRule);
            return; // Don't show tool dialog yet, let user read the rule first
        }
    }
    
    hideAllDialogs();
    
    const dialogId = `${toolType}-dialog`;
    const dialog = document.getElementById(dialogId);
    if (!dialog) {
        console.log(`🔧 DEBUG: Dialog ${dialogId} not found!`);
        return;
    }
    
    // Check if there's already a drop in this tool
    const existingDrop = toolDrops[toolType];
    console.log(`🔧 DEBUG: existingDrop:`, existingDrop);
    
    if (waterType && !existingDrop) {
        console.log(`🔧 DEBUG: New drop being added`);
        // New drop being added
        addDropToSampleArea(dialogId, waterType);
        setupToolForProcessing(toolType, waterType);
    } else if (existingDrop) {
        console.log(`🔧 DEBUG: Showing existing drop and its current status`);
        // Show existing drop and its current status
        addDropToSampleArea(dialogId, existingDrop.type, existingDrop);
        if (existingDrop.treatmentComplete) {
            console.log(`🔧 DEBUG: Treatment complete, showing completed status`);
            showCompletedTreatmentStatus(toolType, existingDrop);
        } else if (existingDrop.processing) {
            console.log(`🔧 DEBUG: Processing in progress, showing processing status`);
            showProcessingStatus(toolType, existingDrop);
        } else {
            console.log(`🔧 DEBUG: Setting up tool for processing`);
            setupToolForProcessing(toolType, existingDrop.type);
        }
    } else {
        console.log(`🔧 DEBUG: Empty tool dialog`);
        // Empty tool dialog
        resetDialogToDefault(toolType);
    }
    
    console.log(`🔧 DEBUG: Displaying dialog ${dialogId}`);
    dialog.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Setup tool for processing a specific water type
function setupToolForProcessing(toolType, waterType) {
    const dialogId = `${toolType}-dialog`;
    const dialog = document.getElementById(dialogId);
    const collectBtn = dialog.querySelector('.collect-btn');
    
    if (toolType === 'microscope') {
        // Microscope analysis is instant
        showMicroscopeAnalysis(waterType);
        if (collectBtn) {
            collectBtn.textContent = 'Collect Sample';
            collectBtn.disabled = false;
            // Don't set onclick here - let showMicroscopeAnalysis handle it with proper analyzed type
        }
    } else if (toolType === 'filter') {
        if (waterType === 'polluted' || waterType === 'toxic-water') {
            showTreatmentStatus(toolType, waterType, 'ready');
            if (collectBtn) {
                collectBtn.textContent = 'Filter Water';
                collectBtn.disabled = false;
                collectBtn.onclick = () => startProcessing(toolType);
            }
        } else {
            // Wrong water type
            showTreatmentStatus(toolType, waterType, 'wrong-type');
            if (collectBtn) {
                collectBtn.textContent = 'Wrong Water Type';
                collectBtn.disabled = true;
            }
        }
    } else if (toolType === 'boiling-pot') {
        if (waterType === 'contaminated') {
            showTreatmentStatus(toolType, waterType, 'ready');
            if (collectBtn) {
                collectBtn.textContent = 'Start Boiling';
                collectBtn.disabled = false;
                collectBtn.onclick = () => startProcessing(toolType);
            }
        } else {
            // Wrong water type - including toxic-water which must be filtered first
            showTreatmentStatus(toolType, waterType, 'wrong-type');
            if (collectBtn) {
                if (waterType === 'toxic-water') {
                    collectBtn.textContent = 'Filter First!';
                } else {
                    collectBtn.textContent = 'Wrong Water Type';
                }
                collectBtn.disabled = true;
            }
        }
    }
}

// Start processing in a tool
function startProcessing(toolType) {
    const storedDrop = toolDrops[toolType];
    if (!storedDrop) return;
    
    // Mark as processing
    storedDrop.processing = true;
    storedDrop.startTime = Date.now();
    
    // Update UI
    showProcessingStatus(toolType, storedDrop);
    updateToolStatus(toolType, 'In Use');
    
    // Start background processing
            const processingTime = toolType === 'filter' ? 8000 : 12000; // 8s for filter, 12s for boiling (was 3s/5s)
    
    setTimeout(() => {
        if (toolDrops[toolType] && toolDrops[toolType].processing) {
            completeProcessing(toolType);
        }
    }, processingTime);
}

// Complete processing in a tool
function completeProcessing(toolType) {
    const storedDrop = toolDrops[toolType];
    if (!storedDrop) return;
    
    // Mark as complete and determine result type
    storedDrop.processing = false;
    storedDrop.treatmentComplete = true;
    
    if (toolType === 'filter') {
        if (storedDrop.type === 'polluted') {
            storedDrop.resultType = 'clean';
        } else if (storedDrop.type === 'toxic-water') {
            storedDrop.resultType = 'contaminated'; // Still needs boiling
        }
    } else if (toolType === 'boiling-pot') {
        storedDrop.resultType = 'clean'; // Boiling always produces clean water
    }
    
    // Update tool status
    updateToolStatus(toolType, 'Ready');
    
    // Update dialog if it's open
    const dialogId = `${toolType}-dialog`;
    const dialog = document.getElementById(dialogId);
    if (dialog && dialog.style.display === 'flex') {
        showCompletedTreatmentStatus(toolType, storedDrop);
    }
}

// Show processing status
function showProcessingStatus(toolType, storedDrop) {
    const dialogId = `${toolType}-dialog`;
    const dialog = document.getElementById(dialogId);
    const collectBtn = dialog.querySelector('.collect-btn');
    const processStatus = dialog.querySelector('.process-status span');
    const timeLabel = dialog.querySelector('.time-label');
    
    if (toolType === 'filter') {
        if (processStatus) processStatus.textContent = 'Filtering in progress...';
        if (timeLabel) timeLabel.textContent = 'Processing: 8 seconds';
        if (collectBtn) {
            collectBtn.textContent = 'Filtering...';
            collectBtn.disabled = true;
        }
    } else if (toolType === 'boiling-pot') {
        if (processStatus) processStatus.textContent = 'Boiling in progress...';
        if (timeLabel) timeLabel.textContent = 'Processing: 12 seconds';
        if (collectBtn) {
            collectBtn.textContent = 'Boiling...';
            collectBtn.disabled = true;
        }
    }
}

// Collect from tool (simplified)
function collectFromTool(toolType, resultType) {
    console.log(`🔧 DEBUG: collectFromTool called - toolType: ${toolType}, resultType: ${resultType}`);
    console.log(`🔧 DEBUG: Before collection - water level: ${waterLevel}, drops collected: ${dropsCollected}`);
    console.log(`🔧 DEBUG: Game state - active: ${gameActive}, paused: ${gamePaused}`);
    
    // Clear the tool
    toolDrops[toolType] = null;
    updateToolStatus(toolType, 'Available');
    console.log(`🔧 DEBUG: Tool ${toolType} cleared and status updated`);
    
    // Return drop to mouse
    returnDropToMouse(resultType);
    console.log(`🔧 DEBUG: Drop returned to mouse with type: ${resultType}`);
    
    // Close dialog
    closeDialog(`${toolType}-dialog`);
    console.log(`🔧 DEBUG: Dialog closed`);
    
    // Ensure mouse cursor is visible and game is interactive
    document.body.style.cursor = 'none'; // Hide default cursor since we have following drop
    console.log(`🔧 DEBUG: Cursor set to none for following drop`);
    
    // Make sure game is active and responsive
    if (!gameActive) {
        gameActive = true;
        console.log(`🔧 DEBUG: Game was inactive, reactivated`);
    }
    
    console.log(`🔧 DEBUG: collectFromTool completed successfully`);
}

// Show completed treatment status when reopening dialog
function showCompletedTreatmentStatus(toolType, storedDrop) {
    const dialogId = `${toolType}-dialog`;
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;
    
    const collectBtn = dialog.querySelector('.collect-btn');
    const processStatus = dialog.querySelector('.process-status span');
    const resultText = dialog.querySelector('.result-text');
    const progressFill = dialog.querySelector('.progress-fill');
    const timeLabel = dialog.querySelector('.time-label');
    
    if (toolType === 'filter') {
        if (processStatus) processStatus.textContent = 'Filtration Complete';
        if (resultText) resultText.textContent = 'Pollutants Successfully Removed';
        if (progressFill) progressFill.style.width = '100%';
        if (timeLabel) timeLabel.textContent = 'Ready to collect';
        
        if (collectBtn) {
            if (storedDrop.resultType === 'clean') {
                collectBtn.textContent = 'Collect Clean Water';
                collectBtn.onclick = () => collectFromTool(toolType, 'clean');
            } else if (storedDrop.resultType === 'contaminated') {
                collectBtn.textContent = 'Collect for Boiling';
                collectBtn.onclick = () => collectFromTool(toolType, 'contaminated');
            }
            collectBtn.disabled = false;
        }
    } else if (toolType === 'boiling-pot') {
        if (processStatus) processStatus.textContent = 'Boiling Complete';
        if (resultText) resultText.textContent = 'Bacteria & Germs Eliminated';
        if (progressFill) progressFill.style.width = '100%';
        if (timeLabel) timeLabel.textContent = 'Ready to collect';
        
        if (collectBtn) {
            collectBtn.textContent = 'Collect Clean Water';
            collectBtn.onclick = () => collectFromTool(toolType, 'clean');
            collectBtn.disabled = false;
        }
    }
}

// Add water drop to sample area in dialog
function addDropToSampleArea(dialogId, waterType, storedDrop = null) {
    const dialog = document.getElementById(dialogId);
    const sampleArea = dialog.querySelector('.sample-area .sample-drop');
    
    if (sampleArea) {
        // Clear existing content
        sampleArea.innerHTML = '';
        
        // Create the water drop
        const drop = document.createElement('div');
        // Use stored visual type if available, otherwise use current selectedDrop
        const visualType = storedDrop ? storedDrop.visualType : (selectedDrop ? selectedDrop.visualType : waterType);
        drop.className = `water-drop ${visualType}`;
        drop.dataset.actualType = waterType;
        drop.style.position = 'relative';
        drop.style.cursor = 'pointer';
        
        // Add click handler to collect the drop
        drop.addEventListener('click', () => {
            collectDropFromTool(dialogId, waterType);
        });
        
        sampleArea.appendChild(drop);
    }
}

// Missing function: Collect drop from tool by clicking on it in the sample area
function collectDropFromTool(dialogId, waterType) {
    console.log(`🔧 DEBUG: collectDropFromTool called - dialogId: ${dialogId}, waterType: ${waterType}`);
    console.log(`🔧 DEBUG: Current water level: ${waterLevel}, drops collected: ${dropsCollected}`);
    console.log(`🔧 DEBUG: Game active: ${gameActive}, game paused: ${gamePaused}`);
    
    // Extract tool type from dialog ID
    const toolType = dialogId.replace('-dialog', '');
    console.log(`🔧 DEBUG: Extracted tool type: ${toolType}`);
    
    // For microscope, return the analyzed water type
    if (toolType === 'microscope') {
        console.log(`🔧 DEBUG: Processing microscope collection`);
        // Check if it was suspicious clean water - if so, return the actual type
        if (waterType.includes('suspicious-clean')) {
            const actualType = WATER_TYPES[waterType].actualType;
            console.log(`🔧 DEBUG: Suspicious water detected, actual type: ${actualType}`);
            collectFromTool(toolType, actualType);
        } else {
            console.log(`🔧 DEBUG: Regular water type, collecting: ${waterType}`);
            collectFromTool(toolType, waterType);
        }
    } else {
        console.log(`🔧 DEBUG: Processing non-microscope tool: ${toolType}`);
        // For other tools, use their normal collection logic
        const storedDrop = toolDrops[toolType];
        console.log(`🔧 DEBUG: Stored drop:`, storedDrop);
        if (storedDrop && storedDrop.treatmentComplete) {
            console.log(`🔧 DEBUG: Treatment complete, collecting result: ${storedDrop.resultType}`);
            collectFromTool(toolType, storedDrop.resultType);
        } else {
            // Tool not ready yet
            console.log(`🔧 DEBUG: Tool ${toolType} not ready for collection - stored drop:`, storedDrop);
        }
    }
}

// Show microscope analysis results
function showMicroscopeAnalysis(waterType) {
    console.log(`🔧 DEBUG: showMicroscopeAnalysis called with waterType: ${waterType}`);
    console.log(`🔧 DEBUG: selectedDrop state:`, selectedDrop);
    
    const dialog = document.getElementById('microscope-dialog');
    if (!dialog) {
        console.log(`🔧 DEBUG: Microscope dialog not found`);
        return;
    }
    
    const processSection = dialog.querySelector('.process-section');
    if (!processSection) {
        console.log(`🔧 DEBUG: Process section not found in dialog`);
        return;
    }
    
    let analysisResult = '';
    let statusText = '';
    let treatmentText = '';
    let actualType = waterType;
    
    // Handle suspicious clean water - reveal true nature
    if (waterType.includes('suspicious-clean')) {
        actualType = WATER_TYPES[waterType].actualType;
        console.log(`🔧 DEBUG: Suspicious water analysis - actualType: ${actualType}`);
        analysisResult = `Suspicious Water Detected!`;
        statusText = `Actually: ${WATER_TYPES[actualType].name}`;
        
        if (actualType === 'toxic-water') {
            treatmentText = `Treatment: Filter First, Then Boil`;
        } else {
            treatmentText = `Treatment: ${actualType === 'polluted' ? 'Filtration Required' : 'Boiling Required'}`;
        }
        console.log(`🔧 DEBUG: Treatment text set to: ${treatmentText}`);
        
        // Update the drop in sample area to show true type
        const sampleDrop = dialog.querySelector('.sample-drop .water-drop');
        if (sampleDrop) {
            sampleDrop.className = `water-drop ${actualType}`;
            sampleDrop.dataset.actualType = actualType;
        }
        
        // Update selectedDrop for when it's returned to mouse (with null check)
        if (selectedDrop) {
            selectedDrop.type = actualType;
            selectedDrop.visualType = actualType;
        } else {
            console.log(`🔧 DEBUG: selectedDrop is null, creating new drop object`);
            selectedDrop = {
                type: actualType,
                visualType: actualType,
                element: null
            };
        }
    } else {
        console.log(`🔧 DEBUG: Regular water analysis for: ${waterType}`);
        analysisResult = `${WATER_TYPES[waterType].name} Water`;
        if (waterType === 'clean') {
            statusText = 'Safe for consumption';
            treatmentText = 'Treatment: None Required';
        } else if (waterType === 'toxic-water') {
            statusText = 'Requires filtration AND boiling';
            treatmentText = 'Treatment: Filter First, Then Boil';
        } else {
            statusText = `Requires ${waterType === 'polluted' ? 'filtration' : 'boiling'}`;
            treatmentText = `Treatment: ${waterType === 'polluted' ? 'Filtration Required' : 'Boiling Required'}`;
        }
        console.log(`🔧 DEBUG: Treatment text set to: ${treatmentText}`);
    }
    
    // Update the process section
    const h3 = processSection.querySelector('h3');
    const processStatus = processSection.querySelector('.process-status span');
    const resultText = processSection.querySelector('.result-text');
    
    if (h3) {
        h3.textContent = 'Analysis Results:';
        console.log(`🔧 DEBUG: Updated h3 to: ${h3.textContent}`);
    }
    if (processStatus) {
        processStatus.textContent = `Water Quality: ${analysisResult}`;
        console.log(`🔧 DEBUG: Updated process status to: ${processStatus.textContent}`);
    }
    if (resultText) {
        resultText.textContent = treatmentText;
        console.log(`🔧 DEBUG: Updated result text to: ${resultText.textContent}`);
    }
    
    // Update progress bar to show 100% analysis complete
    const progressFill = processSection.querySelector('.progress-fill');
    const timeLabel = processSection.querySelector('.time-label');
    if (progressFill) progressFill.style.width = '100%';
    if (timeLabel) timeLabel.textContent = 'Analysis: Complete';
    
    // Update the collect button text based on analysis results
    const collectBtn = dialog.querySelector('.collect-btn');
    if (collectBtn) {
        collectBtn.disabled = false; // Always enable the button after analysis
        
        if (waterType === 'clean' || (waterType.includes('suspicious-clean') && actualType === 'clean')) {
            collectBtn.textContent = 'Collect Clean Water';
        } else if (actualType === 'toxic-water' || waterType === 'toxic-water') {
            collectBtn.textContent = 'Collect for Treatment';
        } else if (actualType === 'polluted' || waterType === 'polluted') {
            collectBtn.textContent = 'Collect for Filtration';
        } else if (actualType === 'contaminated' || waterType === 'contaminated') {
            collectBtn.textContent = 'Collect for Boiling';
        } else {
            collectBtn.textContent = 'Collect Sample';
        }
        
        console.log(`🔧 DEBUG: Updated collect button text to: ${collectBtn.textContent}`);
        
        // Set the correct onclick handler with the analyzed type
        if (waterType.includes('suspicious-clean')) {
            collectBtn.onclick = () => collectFromTool('microscope', actualType);
            console.log(`🔧 DEBUG: Set onclick for suspicious water with actualType: ${actualType}`);
        } else {
            collectBtn.onclick = () => collectFromTool('microscope', waterType);
            console.log(`🔧 DEBUG: Set onclick for regular water with waterType: ${waterType}`);
        }
    }
}

// Show treatment status for filter and boiling pot
function showTreatmentStatus(toolType, waterType, status) {
    const dialogId = `${toolType}-dialog`;
    const dialog = document.getElementById(dialogId);
    const processSection = dialog.querySelector('.process-section');
    
    const h3 = processSection.querySelector('h3');
    const processStatus = processSection.querySelector('.process-status span');
    const resultText = processSection.querySelector('.result-text');
    const progressFill = processSection.querySelector('.progress-fill');
    const timeLabel = processSection.querySelector('.time-label');
    const collectBtn = dialog.querySelector('.collect-btn');
    
    if (status === 'ready') {
        if (h3) h3.textContent = `${toolType === 'filter' ? 'Filtration' : 'Boiling'} Results:`;
        if (processStatus) processStatus.textContent = `Status: Ready to ${toolType === 'filter' ? 'Filter' : 'Boil'}`;
        if (resultText) resultText.textContent = `Click "${toolType === 'filter' ? 'Filter Water' : 'Start Boiling'}" to begin`;
        if (progressFill) progressFill.style.width = '0%';
        if (timeLabel) timeLabel.textContent = 'Time: Ready';
        
        // Update button text and enable it
        if (collectBtn) {
            collectBtn.disabled = false;
            if (toolType === 'filter') {
                collectBtn.textContent = 'Filter Water';
            } else {
                collectBtn.textContent = 'Start Boiling';
            }
        }
    }
}

// Old complex treatment system - REMOVED - Using simplified startProcessing/completeProcessing system now

// Return drop to mouse cursor
function returnDropToMouse(waterType) {
    console.log(`🔧 DEBUG: returnDropToMouse called with waterType: ${waterType}`);
    
    // Clear any existing following drop
    if (followingDrop) {
        console.log(`🔧 DEBUG: Removing existing following drop`);
        followingDrop.remove();
        followingDrop = null;
    }
    
    selectedDrop = {
        type: waterType,
        visualType: waterType,
        element: null
    };
    console.log(`🔧 DEBUG: selectedDrop set:`, selectedDrop);
    
    createFollowingDrop();
    console.log(`🔧 DEBUG: Following drop created`);
    
    document.body.style.cursor = 'none';
    console.log(`🔧 DEBUG: Body cursor set to none`);
}

// Update tool status display
function updateToolStatus(toolType, status) {
    // Find the tool item
    const toolItems = document.querySelectorAll('.tool-item');
    let targetTool = null;
    
    toolItems.forEach(tool => {
        const img = tool.querySelector('img');
        if (img) {
            if ((toolType === 'microscope' && img.src.includes('microscope')) ||
                (toolType === 'filter' && img.src.includes('filter')) ||
                (toolType === 'boiling-pot' && img.src.includes('pot'))) {
                targetTool = tool;
            }
        }
    });
    
    if (targetTool) {
        const statusElement = targetTool.querySelector('.tool-status');
        if (statusElement) {
            statusElement.textContent = status;
            
            // Update status class
            statusElement.className = 'tool-status';
            if (status === 'Available' || status === 'Ready') {
                statusElement.classList.add('available');
            } else if (status === 'In Use') {
                statusElement.classList.add('in-use');
            }
        }
    }
}

// Show feedback for invalid drop attempts
function showInvalidDropFeedback(reason = 'invalid_zone') {
    console.log('Invalid drop zone! This water type cannot go there.');
    
    if (followingDrop) {
        followingDrop.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            if (followingDrop) {
                followingDrop.style.animation = '';
            }
        }, 500);
    }
    
    // Determine message based on reason
    let message = '';
    if (reason === 'tool_occupied') {
        message = 'Tool is occupied! Click on tool to collect existing drop first.';
    } else if (reason === 'wrong_water_type') {
        message = 'This water type cannot go to that tool!';
    } else if (reason === 'weather_roll_required') {
        message = 'Weather roll required! Click the dice button to roll weather before collecting more drops.';
    } else {
        message = 'Invalid drop zone! Try dropping on reservoir or appropriate tools.';
    }
    
    // Show brief visual feedback message
    const feedbackMsg = document.createElement('div');
    feedbackMsg.textContent = message;
    feedbackMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 107, 107, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        pointer-events: none;
        animation: fadeInOut 2s ease-in-out;
    `;
    
    // Add CSS animation if not already defined
    if (!document.querySelector('#feedbackAnimation')) {
        const style = document.createElement('style');
        style.id = 'feedbackAnimation';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(feedbackMsg);
    
    // Remove message after animation
    setTimeout(() => {
        if (feedbackMsg.parentNode) {
            feedbackMsg.remove();
        }
    }, 2000);
}

// Update visual feedback for drop zones
function updateDropZoneHighlight(x, y) {
    const validZone = getValidDropZone(x, y);
    const reservoir = document.querySelector('.reservoir');
    const toolsPanel = document.querySelector('.tools-panel');
    
    // Remove existing highlights
    if (reservoir) reservoir.style.filter = '';
    if (toolsPanel) toolsPanel.style.filter = '';
    
    // Check if the drop can actually go to this zone
    if (validZone && selectedDrop && canDropGoToZone(selectedDrop.type, validZone)) {
        if (validZone.type === 'reservoir') {
            validZone.element.style.filter = 'brightness(1.2) drop-shadow(0 0 10px #4A90E2)';
        }
    }
}

// Hide all tool dialogs
function hideAllDialogs() {
    const dialogs = document.querySelectorAll('.tool-dialog');
    dialogs.forEach(dialog => {
        dialog.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Close dialog when clicking outside or on close button
function closeDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (dialog) {
        dialog.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Resume the game when dialog is closed (including charity info dialog)
    resumeGame();
}

// Show charity water info dialog
function showCharityWaterInfo() {
    // Pause the game (same as rule dialogs)
    pauseGame();
    
    // Show the charity info dialog
    const dialog = document.getElementById('charity-info-dialog');
    if (dialog) {
        dialog.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Cancel tool operation and clear stored water
function cancelTool(toolType) {
    // Clear the tool storage
    toolDrops[toolType] = null;
    
    // Update tool status to available
    updateToolStatus(toolType, 'Available');
    
    // Close the dialog
    closeDialog(`${toolType}-dialog`);
}

// Add click handlers to tools for opening empty dialogs
function addToolClickHandlers() {
    const toolItems = document.querySelectorAll('.tool-item:not(.emergency)');
    
    toolItems.forEach(tool => {
        tool.addEventListener('click', (e) => {
            console.log(`🔧 DEBUG: Tool clicked, selectedDrop:`, selectedDrop);
            
            // Don't open dialog if a drop is being dragged
            if (selectedDrop) {
                console.log(`🔧 DEBUG: Drop is being dragged, ignoring tool click`);
                return;
            }
            
            const img = tool.querySelector('img');
            let toolType = 'microscope';
            
            if (img) {
                if (img.src.includes('microscope')) toolType = 'microscope';
                else if (img.src.includes('filter')) toolType = 'filter';
                else if (img.src.includes('pot')) toolType = 'boiling-pot';
            }
            
            console.log(`🔧 DEBUG: Tool type determined: ${toolType}`);
            
            // Show empty dialog
            showEmptyToolDialog(toolType);
        });
    });
    
    // Add emergency quiz handler
    const emergencyQuizTool = document.querySelector('.tool-item.emergency');
    if (emergencyQuizTool) {
        emergencyQuizTool.addEventListener('click', (e) => {
            // Don't open quiz if a drop is being dragged
            if (selectedDrop) return;
            
            // Show quiz rule on first click
            if (!hasClickedQuizBefore) {
                hasClickedQuizBefore = true;
                const quizRule = RULES.find(r => r.id === 8);
                if (quizRule) {
                    addRule(quizRule.id);
                    showRuleNotification(quizRule);
                    return; // Don't start quiz immediately, let user read the rule first
                }
            }
            
            // Start the emergency quiz
            startEmergencyQuiz();
        });
    }
}

// Show empty tool dialog
function showEmptyToolDialog(toolType) {
    console.log(`🔧 DEBUG: showEmptyToolDialog called for ${toolType}`);
    console.log(`🔧 DEBUG: toolDrops[${toolType}]:`, toolDrops[toolType]);
    
    // Check if there's already a drop in this tool
    if (toolDrops[toolType]) {
        console.log(`🔧 DEBUG: Tool ${toolType} has existing drop, showing tool dialog`);
        // Show dialog with existing drop
        showToolDialog(toolType);
        return;
    }
    
    console.log(`🔧 DEBUG: Tool ${toolType} is empty, showing empty dialog`);
    
    hideAllDialogs();
    
    const dialogId = `${toolType}-dialog`;
    const dialog = document.getElementById(dialogId);
    if (dialog) {
        // Clear the sample area
        const sampleArea = dialog.querySelector('.sample-area .sample-drop');
        if (sampleArea) {
            sampleArea.innerHTML = '';
        }
        
        // Reset the process section to default state
        resetDialogToDefault(toolType);
        
        dialog.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Reset dialog to default empty state
function resetDialogToDefault(toolType) {
    const dialogId = `${toolType}-dialog`;
    const dialog = document.getElementById(dialogId);
    const processSection = dialog.querySelector('.process-section');
    
    if (toolType === 'microscope') {
        const h3 = processSection.querySelector('h3');
        const processStatus = processSection.querySelector('.process-status span');
        const resultText = processSection.querySelector('.result-text');
        const progressFill = processSection.querySelector('.progress-fill');
        const timeLabel = processSection.querySelector('.time-label');
        const collectBtn = dialog.querySelector('.collect-btn');
        
        if (h3) h3.textContent = 'Analysis Results:';
        if (processStatus) processStatus.textContent = 'No sample loaded';
        if (resultText) resultText.textContent = 'Place a water drop to analyze';
        if (progressFill) progressFill.style.width = '0%';
        if (timeLabel) timeLabel.textContent = 'Ready for analysis';
        if (collectBtn) collectBtn.textContent = 'No Sample';
    } else if (toolType === 'filter') {
        const h3 = processSection.querySelector('h3');
        const processStatus = processSection.querySelector('.process-status span');
        const resultText = processSection.querySelector('.result-text');
        const progressFill = processSection.querySelector('.progress-fill');
        const timeLabel = processSection.querySelector('.time-label');
        const collectBtn = dialog.querySelector('.collect-btn');
        
        if (h3) h3.textContent = 'Filtration Results:';
        if (processStatus) processStatus.textContent = 'No polluted water loaded';
        if (resultText) resultText.textContent = 'Place polluted water to filter';
        if (progressFill) progressFill.style.width = '0%';
        if (timeLabel) timeLabel.textContent = 'Ready to filter';
        if (collectBtn) {
            collectBtn.textContent = 'No Sample';
            collectBtn.disabled = true;
        }
    } else if (toolType === 'boiling-pot') {
        const h3 = processSection.querySelector('h3');
        const processStatus = processSection.querySelector('.process-status span');
        const resultText = processSection.querySelector('.result-text');
        const progressFill = processSection.querySelector('.progress-fill');
        const timeLabel = processSection.querySelector('.time-label');
        const collectBtn = dialog.querySelector('.collect-btn');
        
        if (h3) h3.textContent = 'Boiling Results:';
        if (processStatus) processStatus.textContent = 'No contaminated water loaded';
        if (resultText) resultText.textContent = 'Place contaminated water to boil';
        if (progressFill) progressFill.style.width = '0%';
        if (timeLabel) timeLabel.textContent = 'Ready to boil';
        if (collectBtn) {
            collectBtn.textContent = 'No Sample';
            collectBtn.disabled = true;
        }
    }
}

// Add event listeners for treatment buttons - REMOVED - Using simpler onclick handlers now

// Weather system
const weatherConditions = [
    'Precipitation-free, Humid',
    'Light Rain, Cool',
    'Heavy Rain, Cold',
    'Sunny, Dry',
    'Cloudy, Mild',
    'Stormy, Windy',
    'Foggy, Damp',
    'Clear Skies, Warm'
];

// Weather System with Aggressive Evaporation Rates
const WEATHER_TYPES = {
    clear: {
        name: 'Clear',
        emoji: '☀️',
        evaporationRate: 12000, // 1 drop every 12 seconds (was 15)
        effect: 'normal',
        description: 'Steady evaporation - work with urgency'
    },
    drought: {
        name: 'Drought',
        emoji: '🌵',
        evaporationRate: 4000, // 1 drop every 4 seconds (was 6)
        effect: 'extreme_evaporation',
        description: 'CRITICAL water loss - emergency mode!'
    },
    rainy: {
        name: 'Rainy',
        emoji: '💧',
        evaporationRate: 0, // No evaporation
        effect: 'gain_water',
        waterGain: 1,
        description: 'No evaporation + bonus water'
    },
    hot: {
        name: 'Hot',
        emoji: '🔥',
        evaporationRate: 5000, // 1 drop every 5 seconds (was 8)
        effect: 'high_evaporation',
        description: 'Intense evaporation - race against time!'
    },
    stormy: {
        name: 'Stormy',
        emoji: '⛈️',
        evaporationRate: 7000, // 1 drop every 7 seconds (was 10)
        effect: 'moderate_evaporation',
        description: 'Heavy evaporation - work quickly!'
    }
};

function rollWeather() {
    const diceButton = document.getElementById('diceButton');
    if (!diceButton || diceButton.disabled) return;
    
    // Check if it's time to roll the dice
    if (!weatherRollRequired && !firstDiceRoll) {
        // Not time to roll - show vibration and notification
        diceButton.style.animation = 'shake 0.5s ease-in-out';
        showDiceNotAvailableNotification();
        setTimeout(() => {
            diceButton.style.animation = '';
        }, 500);
        return;
    }
    
    // Show weather rule dialog on first dice roll
    if (firstDiceRoll) {
        firstDiceRoll = false;
        const weatherRule = RULES.find(r => r.id === 7);
        if (weatherRule) {
            addRule(7);
            showRuleNotification(weatherRule);
            return; // Don't roll dice yet, let the dialog explain first
        }
    }
    
    // Animate dice roll
    diceButton.style.animation = 'spin 0.5s ease-in-out';
    diceButton.disabled = true;
    
    setTimeout(() => {
        // Select random weather
        const weatherKeys = Object.keys(WEATHER_TYPES);
        const randomWeather = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
        const weather = WEATHER_TYPES[randomWeather];
        
        // Update current weather
        currentWeather = weather.name;
        
        // Update weather display
        updateWeatherDisplay(weather);
        
        // Apply weather effects
        applyWeatherEffects(weather);
        
        // Create emoji rain effect
        createWeatherEmojiRain(weather.emoji);
        
        // Start evaporation timer
        startEvaporationTimer(weather);
        
        // Reset weather roll requirement
        weatherRollRequired = false;
        dropsCollectedSinceLastRoll = 0;
        
        // Re-enable dice button after animation
        diceButton.style.animation = '';
        diceButton.disabled = false;
        
        // Update dice button state
        updateDiceButtonState();
        
        console.log(`🌤️ Weather changed to: ${weather.name}`);
    }, 500);
}

function updateWeatherDisplay(weather) {
    const weatherStatus = document.getElementById('weatherStatus');
    if (weatherStatus) {
        weatherStatus.textContent = weather.name;
        weatherStatus.title = weather.description;
    }
}

function applyWeatherEffects(weather) {
    switch (weather.effect) {
        case 'gain_water':
            // Rainy weather - add water immediately
            if (waterLevel < 20) {
                waterLevel = Math.min(20, waterLevel + weather.waterGain);
                dropsCollected = Math.min(20, dropsCollected + weather.waterGain);
                updateWaterLevel();
                console.log(`🌧️ Rain added ${weather.waterGain} water drop(s)!`);
            }
            break;
            
        // Removed unfair dust storm contamination effect
        // All weather effects now focus on evaporation rates only
    }
}

function startEvaporationTimer(weather) {
    // Clear existing evaporation timer
    if (evaporationTimer) {
        clearInterval(evaporationTimer);
        evaporationTimer = null;
    }
    
    // Start new evaporation timer if weather causes evaporation
    if (weather.evaporationRate > 0) {
        evaporationTimer = setInterval(() => {
            // Check if game is paused
            if (gamePaused) {
                return; // Skip this update cycle
            }
            
            if (waterLevel > 0 && gameActive) {
                waterLevel--;
                dropsCollected--;
                updateWaterLevel();
                console.log(`💨 Evaporation: Lost 1 water drop (${weather.name})`);
                
                // Check for loss condition
                if (waterLevel <= 0) {
                    console.log('💀 Game Over: No water remaining due to evaporation');
                    showLossScreen();
                }
            }
        }, weather.evaporationRate);
    }
}

function createWeatherEmojiRain(emoji) {
    const weatherRainContainer = document.createElement('div');
    weatherRainContainer.className = 'weather-rain-container';
    weatherRainContainer.id = 'weatherRainContainer';
    
    // Create 15 emoji particles (much less than win screen's 80)
    for (let i = 0; i < 15; i++) {
        const emojiParticle = document.createElement('div');
        emojiParticle.className = 'weather-emoji';
        emojiParticle.textContent = emoji;
        
        // Random horizontal position
        emojiParticle.style.left = Math.random() * 100 + '%';
        
        // Random animation delay (spread over 2 seconds)
        emojiParticle.style.animationDelay = Math.random() * 2 + 's';
        
        weatherRainContainer.appendChild(emojiParticle);
    }
    
    document.body.appendChild(weatherRainContainer);
    
    // Remove after 5 seconds (matching the animation duration)
    setTimeout(() => {
        if (weatherRainContainer.parentNode) {
            weatherRainContainer.remove();
        }
    }, 5000);
}

function initializeWeatherSystem() {
    const diceButton = document.getElementById('diceButton');
    const weatherStatus = document.getElementById('weatherStatus');
    
    if (diceButton) {
        // Enable the dice button
        diceButton.disabled = false;
        diceButton.onclick = rollWeather;
        console.log('🎲 Weather system initialized - dice button enabled');
    }
    
    if (weatherStatus) {
        // Set initial weather
        weatherStatus.textContent = currentWeather;
        weatherStatus.title = 'Click the dice to change weather';
    }
    
    // Start evaporation immediately with default Clear weather
    const clearWeather = WEATHER_TYPES.clear;
    if (clearWeather) {
        startEvaporationTimer(clearWeather);
        console.log('🌤️ Started evaporation with Clear weather');
    }
}

// Water level system
function updateWaterLevel() {
    const waterLevelFill = document.getElementById('waterLevelFill');
    const waterLevelText = document.getElementById('waterLevelText');
    
    if (waterLevelFill && waterLevelText) {
        const percentage = (waterLevel / 20) * 100;
        waterLevelFill.style.width = `${percentage}%`;
        waterLevelText.textContent = `${waterLevel}/20 drops`;
        
        // Change color based on level
        if (waterLevel >= 15) {
            waterLevelFill.style.background = 'linear-gradient(90deg, #4CAF50, #45A049)'; // Green
        } else if (waterLevel >= 10) {
            waterLevelFill.style.background = 'linear-gradient(90deg, #4A90E2, #357ABD)'; // Blue
        } else if (waterLevel >= 5) {
            waterLevelFill.style.background = 'linear-gradient(90deg, #FF9800, #F57C00)'; // Orange
        } else {
            waterLevelFill.style.background = 'linear-gradient(90deg, #F44336, #D32F2F)'; // Red
        }
        
        // Check for milestone notifications
        checkMilestoneNotifications();
        
        // Update emergency quiz tool status based on water level
        updateEmergencyQuizStatus();
    }
}

// Check and show milestone notifications
function checkMilestoneNotifications() {
    const percentage = (waterLevel / 20) * 100;
    
    // Low water alert at 30% (6 drops)
    if (waterLevel >= 6 && !milestoneNotifications.lowWater) {
        milestoneNotifications.lowWater = true;
        showMilestoneNotification('lowWater', {
            icon: '⚠️',
            title: 'Water Supply Alert',
            message: 'Your family is building up water reserves. Keep collecting!',
            progressText: `${waterLevel}/20 drops collected`,
            type: 'warning'
        });
    }
    
    // Half full at 50% (10 drops)
    if (waterLevel >= 10 && !milestoneNotifications.halfFull) {
        milestoneNotifications.halfFull = true;
        showMilestoneNotification('halfFull', {
            icon: '🎉',
            title: 'Halfway There!',
            message: 'Excellent progress! Your reservoir is half full.',
            progressText: `${waterLevel}/20 drops collected`,
            celebrationText: 'Your family feels more secure with this water supply!',
            type: 'success'
        });
    }
    
    // Almost full at 85% (17 drops)
    if (waterLevel >= 17 && !milestoneNotifications.almostFull) {
        milestoneNotifications.almostFull = true;
        showMilestoneNotification('almostFull', {
            icon: '🌊',
            title: 'Almost Full!',
            message: 'Amazing work! Your reservoir is nearly full.',
            progressText: `${waterLevel}/20 drops collected`,
            celebrationText: 'Just a few more drops to complete your mission!',
            type: 'critical'
        });
    }
}

// Show milestone notification
function showMilestoneNotification(milestoneType, config) {
    // Don't show if game is paused or not active
    if (gamePaused || !gameActive) return;
    
    // Play milestone sound
    playMilestoneSound();
    
    // Remove any existing milestone notification
    const existingNotification = document.querySelector('.milestone-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `milestone-notification ${config.type}`;
    
    notification.innerHTML = `
        <span class="milestone-notification-icon">${config.icon}</span>
        <h3>${config.title}</h3>
        <p>${config.message}</p>
        <div class="progress-info">${config.progressText}</div>
        ${config.celebrationText ? `<div class="celebration-text">${config.celebrationText}</div>` : ''}
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    }, 4000);
    
    console.log(`Milestone notification shown: ${milestoneType}`);
}

// Update emergency quiz tool status based on water level
function updateEmergencyQuizStatus() {
    const emergencyTool = document.querySelector('.tool-item.emergency');
    if (emergencyTool) {
        const statusElement = emergencyTool.querySelector('.tool-status');
        const descElement = emergencyTool.querySelector('.tool-info p');
        
        if (statusElement && descElement) {
            // Track if player has ever had water above threshold
            if (waterLevel >= 6) {
                hasHadWaterAboveThreshold = true;
            }
            
            // Only show "Low Water Alert" if player has had water above threshold AND is now below
            if (waterLevel < 6 && hasHadWaterAboveThreshold) {
                statusElement.textContent = 'Low Water Alert';
                statusElement.className = 'tool-status alert';
                descElement.textContent = 'Get 3 Bonus Drops';
            } else {
                // Default to bonus drops (at start or when above threshold)
                statusElement.textContent = 'Bonus Drops';
                statusElement.className = 'tool-status available';
                descElement.textContent = 'Get 1 Bonus Drop';
            }
        }
    }
}

// Add CSS for dice roll animation
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

// Progressive Rule System
const RULES = [
    {
        id: 0,
        title: "Welcome to Thirst - The Water Struggle",
                    description: "Help a family collect 20 clean water drops to survive. Treat unsafe water with tools and manage aggressive evaporation rates.",
        icon: "🏠",
        color: "#2E7D32",
        triggerAt: 0, // Show immediately at game start
        waterType: 'game-intro',
        realWorldFact: "Every day, millions of families worldwide face the challenge of finding safe drinking water. This game simulates their daily struggle for survival."
    },
    {
        id: 1,
        title: "Time Management Tips",
        description: "Tool dialogs don't pause the game - evaporation continues! Drop water anywhere on screen for temporary storage.",
        icon: "⏰",
        color: "#FF6B35",
        triggerAt: 'first-tool-use', // Show when first opening a tool dialog
        waterType: 'time-management',
        realWorldFact: "In water-scarce regions, families must carefully manage their time and resources. Every minute spent on water collection is time away from work, school, or other essential activities."
    },
    {
        id: 2,
        title: "Fill reservoir to 20 drops",
        description: "Tap on clean water droplets to collect them. Tap again to drop into reservoir.",
        icon: "💧",
        color: "#4A90E2",
        triggerAt: 0, // Show immediately
        waterType: 'clean',
        realWorldFact: "Access to clean water is a basic human right, yet 2 billion people worldwide still lack safely managed drinking water at home."
    },

    {
        id: 3,
        title: "Polluted water exists",
        description: "Murky blue droplets are polluted. Use Filter Device to purify before collecting.",
        icon: "🌫️",
        color: "#5A9BD4",
        unlockAt: 3, // Unlock polluted water after collecting 3 drops
        waterType: 'polluted',
        realWorldFact: "Every day, 1,000 children under age 5 die from diarrhea caused by unsafe water, poor sanitation, and unsafe hygiene practices."
    },
    {
        id: 4,
        title: "Contaminated water exists",
        description: "Brown droplets with bacteria (🦠) are contaminated. Use Boiling Pot to sterilize before collecting.",
        icon: "🦠",
        color: "#8B4513",
        unlockAt: 6, // Unlock contaminated water after collecting 6 drops
        waterType: 'contaminated',
        realWorldFact: "Waterborne diseases like cholera, typhoid, and dysentery affect millions annually. Boiling water for 1 minute kills most disease-causing organisms."
    },
    {
        id: 5,
        title: "Suspicious water exists",
        description: "Some clean-looking water is suspicious! Use Microscope to inspect before collecting.",
        icon: "🔬",
        color: "#9C27B0",
        unlockAt: 9, // Unlock fake clean water after collecting 9 drops
        waterType: 'suspicious-clean',
        realWorldFact: "Clear water isn't always safe water. Invisible contaminants like bacteria, viruses, and chemicals can make seemingly clean water deadly."
    },
    {
        id: 6,
        title: "Toxic water exists",
        description: "Dark brown droplets (☢️) need BOTH filtering AND boiling. Filter first, then boil the result.",
        icon: "☢️",
        color: "#B8A080",
        unlockAt: 12, // Unlock toxic water after collecting 12 drops
        waterType: 'toxic-water',
        realWorldFact: "In crisis areas, water sources can be contaminated with multiple pollutants including chemicals, sewage, and disease-causing organisms, requiring multiple treatment steps."
    },
    {
        id: 7,
        title: "Weather affects water quality",
        description: "Roll weather dice every 3 drops collected! Weather changes water availability and evaporation rates.",
        icon: "🌦️",
        color: "#FF9800",
        triggerAt: 'first-dice-roll', // Show when dice is first used
        waterType: 'weather-system',
        realWorldFact: "Climate change and weather patterns dramatically affect water access. Droughts reduce water sources, while floods can contaminate clean water supplies."
    },
    {
        id: 8,
        title: "Emergency Quiz available",
        description: "Take the Emergency Quiz to earn bonus water drops! Rewards change based on your water level - more drops when you're in crisis.",
        icon: "🎓",
        color: "#9C27B0",
        triggerAt: 'first-quiz-click', // Show when quiz is first clicked
        waterType: 'emergency-quiz',
        realWorldFact: "Education about water safety and conservation is crucial for communities worldwide. Knowledge can literally save lives by teaching proper water treatment and hygiene practices."
    }
];

// Water type progression based on drops collected
const WATER_TYPE_PROGRESSION = [
    { dropsNeeded: 0, types: ['clean'] },
    { dropsNeeded: 3, types: ['clean', 'polluted'] },
    { dropsNeeded: 6, types: ['clean', 'polluted', 'contaminated'] },
    { dropsNeeded: 9, types: ['clean', 'polluted', 'contaminated', 'suspicious-clean-polluted', 'suspicious-clean-contaminated'] },
    { dropsNeeded: 12, types: ['clean', 'polluted', 'contaminated', 'toxic-water', 'suspicious-clean-polluted', 'suspicious-clean-contaminated', 'suspicious-clean-toxic-water'] }
];

function initializeRulesPanel() {
    const rulesPanel = document.querySelector('.rules-panel');
    if (rulesPanel) {
        rulesPanel.innerHTML = '<h3>RULES</h3><div class="rules-list"></div>';
        
        // Show game introduction first
        addRule(0);
        showRuleNotification(RULES.find(r => r.id === 0));
        
        // Show basic rule immediately
        addRule(2);
    }
}

function updateAvailableWaterTypes() {
    // Find the current progression level based on drops collected
    for (let i = WATER_TYPE_PROGRESSION.length - 1; i >= 0; i--) {
        if (dropsCollected >= WATER_TYPE_PROGRESSION[i].dropsNeeded) {
            availableWaterTypes = [...WATER_TYPE_PROGRESSION[i].types];
            break;
        }
    }
}

function checkForNewWaterType(waterType) {
    // Get the base water type (remove suspicious-clean prefix if present)
    let baseType = waterType;
    if (waterType.startsWith('suspicious-clean')) {
        baseType = 'suspicious-clean';
    }
    
    console.log(`Checking new water type: ${waterType}, base type: ${baseType}`);
    
    // If we haven't seen this water type before, show its rule
    if (!seenWaterTypes.has(baseType)) {
        seenWaterTypes.add(baseType);
        console.log(`New water type detected: ${baseType}`);
        
        // Find the rule for this water type
        const rule = RULES.find(r => r.waterType === baseType);
        if (rule) {
            console.log(`Found rule for ${baseType}:`, rule);
            addRule(rule.id);
            if (rule.id > currentRuleLevel) {
                currentRuleLevel = rule.id;
            }
            
            // Show rule notification immediately for any new water type when clicked
            // But only if it's not clean water (clean water has no rule dialog)
            if (baseType !== 'clean') {
                showRuleNotification(rule);
            }
        } else {
            console.log(`No rule found for water type: ${baseType}`);
        }
    } else {
        console.log(`Water type ${baseType} already seen`);
    }
}

function checkRuleProgression() {
    // This function is now called from handleReservoirDrop but doesn't add rules
    // Rules are only added when new water types are first seen in checkForNewWaterType
}

function addRule(ruleId) {
    const rule = RULES.find(r => r.id === ruleId);
    if (!rule) return;
    
    const rulesList = document.querySelector('.rules-list');
    if (!rulesList) return;
    
    const ruleElement = document.createElement('div');
    ruleElement.className = 'rule-item';
    ruleElement.innerHTML = `
        <div class="rule-icon" style="background-color: ${rule.color}">
            ${rule.icon}
        </div>
        <div class="rule-content">
            <h4>${rule.title}</h4>
            <p>${rule.description}</p>
        </div>
    `;
    
    // Add animation class
    ruleElement.style.opacity = '0';
    ruleElement.style.transform = 'translateY(-20px)';
    
    rulesList.appendChild(ruleElement);
    
    // Animate in
    setTimeout(() => {
        ruleElement.style.transition = 'all 0.5s ease-out';
        ruleElement.style.opacity = '1';
        ruleElement.style.transform = 'translateY(0)';
    }, 100);
}

function showRuleNotification(rule) {
    // Pause the entire game
    pauseGame();
    
    // Determine dialog title based on rule type
    let dialogTitle = "New Water Type Discovered!";
    if (rule.waterType === 'game-intro') {
        dialogTitle = "Welcome to the Game!";
    } else if (rule.waterType === 'weather-system') {
        dialogTitle = "Weather System Explained!";
    } else if (rule.waterType === 'emergency-quiz') {
        dialogTitle = "Emergency Quiz Available!";
    } else if (rule.waterType === 'time-management') {
        dialogTitle = "Time Management Tips!";
    }
    
    // Create enhanced notification dialog
    const notification = document.createElement('div');
    notification.className = 'rule-notification-dialog';
    notification.innerHTML = `
        <div class="notification-dialog-content">
            <div class="notification-dialog-header">
                <div class="notification-icon-large" style="background-color: ${rule.color}">
                    ${rule.icon}
                </div>
                <h2>${dialogTitle}</h2>
            </div>
            
            <div class="notification-dialog-body">
                <div class="water-type-info">
                    <h3>${rule.title}</h3>
                    <p class="water-description">${rule.description}</p>
                </div>
                
                <div class="tool-usage-section">
                    <h4>💡 How to Handle This Water:</h4>
                    ${getToolUsageInstructions(rule.waterType)}
                </div>
                
                <div class="time-saving-tips">
                    <h4>⚡ Pro Tips:</h4>
                    ${getProTips(rule.waterType)}
                </div>
                
                ${rule.realWorldFact ? `<div class="real-world-fact-enhanced">
                    <strong>🌍 Real World Impact:</strong> ${rule.realWorldFact}
                </div>` : ''}
            </div>
            
            <div class="notification-dialog-footer">
                <button class="got-it-button" onclick="dismissRuleNotification()">${rule.waterType === 'weather-system' ? 'Got It! Roll the Dice' : 'Got It! Resume Game'}</button>
            </div>
        </div>
    `;
    
    // Add to body and prevent clicking outside to dismiss
    document.body.appendChild(notification);
    
    // Store reference for dismissal
    window.currentRuleNotification = notification;
}

// Helper function to get tool usage instructions based on water type
function getToolUsageInstructions(waterType) {
    switch(waterType) {
        case 'polluted':
            return `
                <div class="tool-instruction">
                    <div class="tool-icon-small">
                        <img src="assets/icons/filter.png" alt="Filter">
                    </div>
                    <span>Drag polluted water to the <strong>Filter Device</strong> to remove pollutants</span>
                </div>
            `;
        case 'contaminated':
            return `
                <div class="tool-instruction">
                    <div class="tool-icon-small">
                        <img src="assets/icons/pot.png" alt="Boiling Pot">
                    </div>
                    <span>Drag contaminated water to the <strong>Boiling Pot</strong> to kill bacteria</span>
                </div>
            `;
        case 'suspicious-clean':
            return `
                <div class="tool-instruction">
                    <div class="tool-icon-small">
                        <img src="assets/icons/microscope.png" alt="Microscope">
                    </div>
                    <span>Drag suspicious clean water to the <strong>Microscope</strong> to reveal its true nature</span>
                </div>
            `;
        case 'toxic-water':
            return `
                <div class="tool-instruction">
                    <div class="tool-icon-small">
                        <img src="assets/icons/filter.png" alt="Filter">
                    </div>
                    <span><strong>Step 1:</strong> Drag to <strong>Filter Device</strong> first to remove pollutants</span>
                </div>
                <div class="tool-instruction">
                    <div class="tool-icon-small">
                        <img src="assets/icons/pot.png" alt="Boiling Pot">
                    </div>
                    <span><strong>Step 2:</strong> Then drag the filtered water to <strong>Boiling Pot</strong> to kill bacteria</span>
                </div>
            `;
        case 'game-intro':
            return `
                <div class="tool-instruction">
                    <span><strong>🎯 Goal:</strong> Collect 20 clean water drops to fill your family's reservoir</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>🚰 How to Play:</strong> Click water drops to select, then click reservoir to collect</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>🔧 Treatment:</strong> Use tools to clean unsafe water before collecting</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>🌦️ Weather:</strong> Roll dice every 3 drops - weather affects your water supply</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>⚠️ Danger:</strong> Some weather causes evaporation - you can lose water!</span>
                </div>
            `;
        case 'weather-system':
            return `
                <div class="tool-instruction">
                    <span><strong>☀️ Clear:</strong> Steady evaporation - lose 1 drop every 12 seconds</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>🌧️ Rainy:</strong> No evaporation + gain 1 bonus drop immediately</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>🔥 Hot:</strong> Intense evaporation - lose 1 drop every 5 seconds</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>⛈️ Stormy:</strong> Heavy evaporation - lose 1 drop every 7 seconds</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>🌵 Drought:</strong> CRITICAL evaporation - lose 1 drop every 4 seconds!</span>
                </div>
            `;
        case 'time-management':
            return `
                <div class="tool-instruction">
                    <span><strong>⏰ Tool Dialogs:</strong> Microscope, Filter, and Boiling Pot dialogs DON'T pause evaporation</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>💨 Evaporation Risk:</strong> Close tool dialogs quickly (by clicking away) to minimize water loss</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>🎯 Temporary Storage:</strong> Click empty space to drop water anywhere on screen for later pickup</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>📱 Strategy:</strong> Drop water temporarily while tools process, then collect when ready</span>
                </div>
            `;
        case 'emergency-quiz':
            return `
                <div class="tool-instruction">
                    <div class="tool-icon-small">
                        <img src="assets/icons/quizlogo.png" alt="Quiz">
                    </div>
                    <span><strong>🎓 Normal Mode:</strong> Click quiz button to earn 1 bonus drop (when water ≥ 30%)</span>
                </div>
                <div class="tool-instruction">
                    <div class="tool-icon-small">
                        <img src="assets/icons/quizlogo.png" alt="Quiz">
                    </div>
                    <span><strong>⚠️ Emergency Mode:</strong> Earn up to 3 drops when water falls below 30% (6 drops)</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>📚 Questions:</strong> Answer 3 questions about water crisis and charity: water's work</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>⏸️ Timer Pause:</strong> Game timer and evaporation pause during quiz - take your time!</span>
                </div>
                <div class="tool-instruction">
                    <span><strong>💡 Learning:</strong> Each question teaches you about global water challenges</span>
                </div>
            `;
        default:
            return `
                <div class="tool-instruction">
                    <div class="water-drop-small clean"></div>
                    <span>Drag clean water directly to the reservoir</span>
                </div>
            `;
    }
}

// Helper function to get unique pro tips for each water type
function getProTips(waterType) {
    const generalTip = `
        <li>💡 Tool dialogs DON'T pause the game - evaporation continues! Close dialogs (click away) to save time.</li>
        <li>🎯 You can drop water anywhere on screen as temporary storage and pick it up later!</li>
    `;
    
    switch(waterType) {
        case 'polluted':
            return `
                <ul>
                    <li>Filter treatment takes 8 seconds to complete</li>
                    <li>Look for murky blue drops to identify polluted water</li>
                    <li>Polluted water is common in urban areas with poor sanitation</li>
                    ${generalTip}
                </ul>
            `;
        case 'contaminated':
            return `
                <ul>
                    <li>Boiling takes 12 seconds - plan ahead for the timer</li>
                    <li>Look for the 🦠 bacteria symbol inside brown drops</li>
                    <li>Unsafe water often comes from natural sources</li>
                    ${generalTip}
                </ul>
            `;
        case 'suspicious-clean':
            return `
                <ul>
                    <li>Microscope analysis is instant and reveals true water type</li>
                    <li>Always inspect clean-looking water when in doubt</li>
                    <li>Some unsafe water can appear crystal clear</li>
                    ${generalTip}
                </ul>
            `;
        case 'toxic-water':
            return `
                <ul>
                    <li>Requires both tools - filter first, then boil the result</li>
                    <li>Look for the ☢️ radioactive symbol in dark brown drops</li>
                    <li>Most dangerous water type - needs maximum treatment</li>
                    <li>Plan for 20+ seconds total processing time</li>
                    ${generalTip}
                </ul>
            `;
        case 'game-intro':
            return `
                <ul>
                    <li><strong>Win Condition:</strong> Fill reservoir to 20/20 drops to complete your mission</li>
                    <li><strong>Loss Condition:</strong> If evaporation reduces your water to 0, your family faces crisis</li>
                    <li><strong>Strategy:</strong> Balance speed with safety - treat unsafe water properly</li>
                    <li><strong>Time Pressure:</strong> Aggressive evaporation rates create constant urgency</li>
                    <li><strong>Emergency Tool:</strong> Use quiz strategically when water drops below 30%</li>
                    <li><strong>Scarcity:</strong> Water sources have cooldowns - every drop counts!</li>
                </ul>
            `;
        case 'time-management':
            return `
                <ul>
                    <li><strong>Tool Timing:</strong> Processing continues even when tool dialogs are closed</li>
                    <li><strong>Multitasking:</strong> Start multiple tools processing, then close dialogs to save time</li>
                    <li><strong>Emergency Storage:</strong> Drop water on screen when evaporation is too fast</li>
                    <li><strong>Strategic Placement:</strong> Place water near tools for quick access during processing</li>
                    <li><strong>Time Awareness:</strong> Only quiz and rule dialogs pause the game - everything else continues</li>
                </ul>
            `;
        case 'emergency-quiz':
            return `
                <ul>
                    <li><strong>Smart Timing:</strong> Use quiz strategically when water is low for maximum reward</li>
                    <li><strong>Educational Value:</strong> Every question teaches real facts about water crisis</li>
                    <li><strong>No Penalties:</strong> Wrong answers don't hurt you - still earn drops for participation</li>
                    <li><strong>Emergency Lifeline:</strong> Quiz becomes most valuable when water drops below 30%</li>
                    <li><strong>Real Impact:</strong> Learn how charity: water helps communities worldwide</li>
                </ul>
            `;
        case 'weather-system':
            return `
                <ul>
                    <li><strong>Mandatory Rolling:</strong> Must roll dice every 3 drops collected</li>
                    <li><strong>Strategic Timing:</strong> Roll before collecting your 4th, 7th, 10th drops, etc.</li>
                    <li><strong>Rain Advantage:</strong> Try to roll when reservoir is low for maximum benefit</li>
                    <li><strong>Drought Crisis:</strong> Most dangerous weather - only 4 seconds per drop lost!</li>
                    <li><strong>Emergency Strategy:</strong> Use quiz when harsh weather hits to survive</li>
                </ul>
            `;
        default:
            return `
                <ul>
                    <li>Clean water goes directly to the reservoir</li>
                    <li>Look for clear blue drops with natural shine</li>
                    <li>No treatment needed - save time by collecting immediately</li>
                    ${generalTip}
                </ul>
            `;
    }
}

// Function to pause the entire game
function pauseGame() {
    gamePaused = true;
    
    // Hide and freeze the following drop if it exists
    if (followingDrop) {
        followingDrop.style.display = 'none';
        console.log(`🔧 DEBUG: Following drop hidden for rule dialog`);
    }
    
    // Pause any active treatment timers
    if (processingTimer) {
        clearInterval(processingTimer);
    }
    
    // Pause evaporation timer
    if (evaporationTimer) {
        clearInterval(evaporationTimer);
    }
    
    console.log('Game paused for rule notification');
}

// Function to resume the game
function resumeGame() {
    gamePaused = false;
    
    // Show the following drop again if it exists
    if (followingDrop) {
        followingDrop.style.display = 'block';
        console.log(`🔧 DEBUG: Following drop shown again after rule dialog`);
    }
    
    // Resume any active treatment timers if needed
    if (currentProcessingTool) {
        // Restart the processing timer for the current tool
        const toolData = toolDrops[currentProcessingTool];
        if (toolData && toolData.processing && !toolData.treatmentComplete) {
            // Resume treatment progress
            startProcessing(currentProcessingTool);
        }
    }
    
    // Resume evaporation timer
    if (gameActive && currentWeather) {
        // Get the weather object from WEATHER_TYPES using the currentWeather string
        const weatherKey = Object.keys(WEATHER_TYPES).find(key => WEATHER_TYPES[key].name === currentWeather);
        const weatherObject = weatherKey ? WEATHER_TYPES[weatherKey] : WEATHER_TYPES.clear;
        startEvaporationTimer(weatherObject);
    }
    
    console.log('Game resumed after rule notification');
}

// Function to update dice button visual state
function updateDiceButtonState() {
    const diceButton = document.getElementById('diceButton');
    if (!diceButton) return;
    
    if (weatherRollRequired || firstDiceRoll) {
        // Dice is available - make it more prominent
        diceButton.style.background = 'linear-gradient(135deg, #FF6B6B, #FF8E53)';
        diceButton.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4), 0 0 20px rgba(255, 107, 107, 0.3)';
        diceButton.style.transform = 'scale(1.05)';
        diceButton.style.cursor = 'pointer';
        diceButton.title = weatherRollRequired ? 'Roll required! Click to change weather' : 'Click to roll weather dice';
    } else {
        // Dice is not available - make it subdued
        diceButton.style.background = 'linear-gradient(135deg, #9E9E9E, #757575)';
        diceButton.style.boxShadow = '0 2px 8px rgba(158, 158, 158, 0.3)';
        diceButton.style.transform = 'scale(1)';
        diceButton.style.cursor = 'not-allowed';
        const dropsNeeded = 3 - dropsCollectedSinceLastRoll;
        diceButton.title = `Collect ${dropsNeeded} more drop${dropsNeeded > 1 ? 's' : ''} to roll weather`;
    }
}

// Function to show notification when dice is not available
function showDiceNotAvailableNotification() {
    const dropsNeeded = 3 - dropsCollectedSinceLastRoll;
    let message = '';
    
    if (dropsNeeded > 0) {
        message = `Collect ${dropsNeeded} more drop${dropsNeeded > 1 ? 's' : ''} before rolling weather dice!`;
    } else {
        message = 'Weather dice not available right now!';
    }
    
    // Show brief visual feedback message
    const feedbackMsg = document.createElement('div');
    feedbackMsg.textContent = message;
    feedbackMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 152, 0, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 16px;
        z-index: 10000;
        pointer-events: none;
        animation: diceNotificationFadeInOut 3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    // Add CSS animation if not already defined
    if (!document.querySelector('#diceNotificationAnimation')) {
        const style = document.createElement('style');
        style.id = 'diceNotificationAnimation';
        style.textContent = `
            @keyframes diceNotificationFadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                15% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
                85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(feedbackMsg);
    
    // Remove message after animation
    setTimeout(() => {
        if (feedbackMsg.parentNode) {
            feedbackMsg.remove();
        }
    }, 3000);
}

// Function to roll weather after dialog is dismissed
function rollWeatherAfterDialog() {
    const diceButton = document.getElementById('diceButton');
    if (!diceButton || diceButton.disabled) return;
    
    // Animate dice roll
    diceButton.style.animation = 'spin 0.5s ease-in-out';
    diceButton.disabled = true;
    
    setTimeout(() => {
        // Select random weather
        const weatherKeys = Object.keys(WEATHER_TYPES);
        const randomWeather = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
        const weather = WEATHER_TYPES[randomWeather];
        
        // Update current weather
        currentWeather = weather.name;
        
        // Update weather display
        updateWeatherDisplay(weather);
        
        // Apply weather effects
        applyWeatherEffects(weather);
        
        // Create emoji rain effect
        createWeatherEmojiRain(weather.emoji);
        
        // Start evaporation timer
        startEvaporationTimer(weather);
        
        // Reset weather roll requirement
        weatherRollRequired = false;
        dropsCollectedSinceLastRoll = 0;
        
        // Re-enable dice button after animation
        diceButton.style.animation = '';
        diceButton.disabled = false;
        
        // Update dice button state
        updateDiceButtonState();
        
        console.log(`🌤️ Weather changed to: ${weather.name}`);
    }, 500);
}

// Function to dismiss rule notification
function dismissRuleNotification() {
    const notification = window.currentRuleNotification;
    let wasWeatherDialog = false;
    let wasWelcomeDialog = false;
    
    // Check if this was the weather system dialog or welcome dialog
    if (notification) {
        const dialogHeader = notification.querySelector('h2');
        if (dialogHeader) {
            if (dialogHeader.textContent === 'Weather System Explained!') {
                wasWeatherDialog = true;
            } else if (dialogHeader.textContent === 'Welcome to Thirst - The Water Struggle') {
                wasWelcomeDialog = true;
            }
        }
    }
    
    if (notification && notification.parentNode) {
        notification.remove();
        window.currentRuleNotification = null;
    }
    
    // Resume the game
    resumeGame();
    
    // If this was the welcome dialog, enable diverse water generation
    if (wasWelcomeDialog) {
        gameHasStartedGenerating = true;
        console.log('🎮 Game now generating diverse water types - rule notifications enabled');
    }
    
    // If this was the weather dialog, automatically roll the dice
    if (wasWeatherDialog) {
        setTimeout(() => {
            rollWeatherAfterDialog();
        }, 500);
    }
}

// Timer System Functions
// Timer System Functions - REMOVED

// Override these functions to do nothing
function gameOver() {
    console.log('gameOver function called but disabled');
    // Do nothing - we don't want to show the loss screen
    return;
}

function showGameOverScreen() {
    console.log('showGameOverScreen function called but disabled');
    // Do nothing - we don't want to show the loss screen
    return;
}

function tryAgain() {
    // Reset and restart game
    resetGame();
    startGame();
}

function goToStart() {
    // Hide loss screen
    document.getElementById('lossScreen').classList.remove('active');
    
    // Go to start screen
    resetGame();
}

// Emergency Quiz System
const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "How many people worldwide lack access to clean water?",
        context: "According to the latest WHO/UNICEF data, the global water crisis affects hundreds of millions.",
        options: [
            { letter: "A", text: "500 million people", correct: false },
            { letter: "B", text: "703 million people", correct: true },
            { letter: "C", text: "1.2 billion people", correct: false }
        ],
        explanation: "703 million people worldwide lack access to clean water, down from 771 million in recent years due to global efforts."
    },
    {
        id: 2,
        question: "How many people lack safely managed drinking water services?",
        context: "Having water nearby doesn't always mean it's safe to drink or easily accessible.",
        options: [
            { letter: "A", text: "1.5 billion people", correct: false },
            { letter: "B", text: "2.2 billion people", correct: true },
            { letter: "C", text: "3 billion people", correct: false }
        ],
        explanation: "2.2 billion people still lack access to safely managed drinking water services at home."
    },
    {
        id: 3,
        question: "How far do women and children typically walk daily to collect water?",
        context: "In water-scarce regions, collecting water is primarily the responsibility of women and girls.",
        options: [
            { letter: "A", text: "1-2 miles", correct: false },
            { letter: "B", text: "3.7 miles on average", correct: true },
            { letter: "C", text: "Less than 1 mile", correct: false }
        ],
        explanation: "Women and children walk an average of 3.7 miles (6 kilometers) daily to collect water."
    },
    {
        id: 4,
        question: "How many children under 5 die daily from water-related diseases?",
        context: "Unsafe water and poor sanitation create deadly health risks for young children.",
        options: [
            { letter: "A", text: "500 children", correct: false },
            { letter: "B", text: "Over 1,000 children", correct: true },
            { letter: "C", text: "2,000 children", correct: false }
        ],
        explanation: "More than 1,000 children under 5 die every day from diseases related to lack of clean water, sanitation, and hygiene."
    },
    {
        id: 5,
        question: "How much time do women spend collecting water globally each day?",
        context: "Time spent collecting water prevents women from education and economic opportunities.",
        options: [
            { letter: "A", text: "125 million hours", correct: false },
            { letter: "B", text: "250 million hours", correct: true },
            { letter: "C", text: "400 million hours", correct: false }
        ],
        explanation: "Women and girls spend an estimated 250 million hours every day collecting water for their families."
    },
    {
        id: 6,
        question: "How many people lack access to basic sanitation facilities?",
        context: "Sanitation is as important as clean water for preventing disease and maintaining dignity.",
        options: [
            { letter: "A", text: "1.2 billion people", correct: false },
            { letter: "B", text: "1.69 billion people", correct: true },
            { letter: "C", text: "2.5 billion people", correct: false }
        ],
        explanation: "1.69 billion people live without access to adequate sanitation, and 419 million still practice open defecation."
    },
    {
        id: 7,
        question: "What is charity: water's unique funding model called?",
        context: "charity: water operates differently from most nonprofits to ensure transparency.",
        options: [
            { letter: "A", text: "The 100% Model", correct: true },
            { letter: "B", text: "Direct Impact Model", correct: false },
            { letter: "C", text: "Full Transparency Model", correct: false }
        ],
        explanation: "The 100% Model means 100% of public donations go directly to funding water projects, with operating costs covered separately."
    },
    {
        id: 8,
        question: "How many water projects has charity: water funded to date?",
        context: "charity: water has been building sustainable water projects since 2006.",
        options: [
            { letter: "A", text: "78,000+ projects", correct: false },
            { letter: "B", text: "186,000+ projects", correct: true },
            { letter: "C", text: "250,000+ projects", correct: false }
        ],
        explanation: "charity: water has funded over 186,000 water projects, serving more than 20 million people across 29 countries."
    },
    {
        id: 9,
        question: "In how many countries does charity: water currently work?",
        context: "charity: water partners with local organizations to build sustainable water projects.",
        options: [
            { letter: "A", text: "22 countries", correct: false },
            { letter: "B", text: "29 countries", correct: true },
            { letter: "C", text: "35 countries", correct: false }
        ],
        explanation: "charity: water currently works in 29 countries, focusing on areas with the greatest need."
    },
    {
        id: 10,
        question: "How much does it cost on average to bring clean water to one person?",
        context: "Different organizations have varying costs based on their approach and locations.",
        options: [
            { letter: "A", text: "$30-40", correct: true },
            { letter: "B", text: "$75-100", correct: false },
            { letter: "C", text: "$150-200", correct: false }
        ],
        explanation: "It costs approximately $30-40 to bring clean water to one person through sustainable water projects."
    },
    {
        id: 11,
        question: "What percentage of water-related diseases are preventable?",
        context: "Most water-related illnesses can be prevented with access to clean water and sanitation.",
        options: [
            { letter: "A", text: "60%", correct: false },
            { letter: "B", text: "80%", correct: false },
            { letter: "C", text: "Nearly 100%", correct: true }
        ],
        explanation: "Nearly 100% of water-related diseases are preventable with access to clean water and proper sanitation."
    },
    {
        id: 12,
        question: "How long can a person survive without water?",
        context: "Water is essential for human survival, more critical than food.",
        options: [
            { letter: "A", text: "3-5 days", correct: true },
            { letter: "B", text: "7-10 days", correct: false },
            { letter: "C", text: "2 weeks", correct: false }
        ],
        explanation: "A person can only survive 3-5 days without water, making it our most critical need."
    },
    {
        id: 13,
        question: "How many lives could be saved weekly with access to clean water and sanitation?",
        context: "Clean water and sanitation have profound impacts on global health outcomes.",
        options: [
            { letter: "A", text: "8,000 lives", correct: false },
            { letter: "B", text: "16,000 lives", correct: true },
            { letter: "C", text: "25,000 lives", correct: false }
        ],
        explanation: "Access to clean water and basic sanitation can save around 16,000 lives every week."
    },
    {
        id: 14,
        question: "What percentage of the world's population experiences severe water scarcity?",
        context: "Water scarcity affects both developed and developing regions around the world.",
        options: [
            { letter: "A", text: "25%", correct: false },
            { letter: "B", text: "50%", correct: true },
            { letter: "C", text: "75%", correct: false }
        ],
        explanation: "Roughly half of the world's population experiences severe water scarcity for at least part of the year."
    },
    {
        id: 15,
        question: "How much of global water withdrawal is used for agriculture?",
        context: "Agriculture is by far the largest consumer of freshwater resources globally.",
        options: [
            { letter: "A", text: "50%", correct: false },
            { letter: "B", text: "70%", correct: true },
            { letter: "C", text: "85%", correct: false }
        ],
        explanation: "Agriculture accounts for 70% of global water withdrawal, making efficient irrigation crucial for sustainability."
    },
    {
        id: 16,
        question: "What percentage of wastewater flows back into ecosystems untreated?",
        context: "Proper wastewater treatment is essential for protecting water sources and public health.",
        options: [
            { letter: "A", text: "60%", correct: false },
            { letter: "B", text: "80%", correct: true },
            { letter: "C", text: "95%", correct: false }
        ],
        explanation: "80% of wastewater flows back into the ecosystem without being treated or reused, causing environmental damage."
    },
    {
        id: 17,
        question: "How many people live in transboundary river and lake basins?",
        context: "Many of the world's water sources cross national borders, requiring international cooperation.",
        options: [
            { letter: "A", text: "25% of the population", correct: false },
            { letter: "B", text: "40% of the population", correct: true },
            { letter: "C", text: "60% of the population", correct: false }
        ],
        explanation: "Approximately 40% of the world's population lives in transboundary river and lake basins."
    },
    {
        id: 18,
        question: "How many healthcare facilities lack basic water services?",
        context: "Clean water in healthcare facilities is critical for preventing infections and safe medical procedures.",
        options: [
            { letter: "A", text: "1 in 4 facilities", correct: false },
            { letter: "B", text: "1 in 2 facilities", correct: true },
            { letter: "C", text: "1 in 6 facilities", correct: false }
        ],
        explanation: "About half of healthcare facilities in areas where charity: water works don't have clean water access."
    },
    {
        id: 19,
        question: "What is the UN Sustainable Development Goal for water?",
        context: "The United Nations has set specific goals for global water access by 2030.",
        options: [
            { letter: "A", text: "SDG 6: Clean Water and Sanitation", correct: true },
            { letter: "B", text: "SDG 3: Good Health and Well-being", correct: false },
            { letter: "C", text: "SDG 1: No Poverty", correct: false }
        ],
        explanation: "SDG 6 aims to ensure availability and sustainable management of water and sanitation for all by 2030."
    },
    {
        id: 20,
        question: "How many people have gained access to clean water since 1990?",
        context: "Global efforts have made significant progress in expanding water access over recent decades.",
        options: [
            { letter: "A", text: "1.5 billion people", correct: false },
            { letter: "B", text: "2.6 billion people", correct: true },
            { letter: "C", text: "4 billion people", correct: false }
        ],
        explanation: "About 2.6 billion people have gained access to clean water in the last 25 years, showing progress is possible."
    }
];

let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let quizScore = 0;
let selectedAnswer = null;

// Initialize Emergency Quiz
function startEmergencyQuiz() {
    // Pause the game first (important for evaporation timer)
    pauseGame();
    
    // Reset quiz state
    currentQuestionIndex = 0;
    quizScore = 0;
    selectedAnswer = null;
    
    // Select 3 random questions
    currentQuizQuestions = getRandomQuestions(3);
    
    // Update alert text and rewards text based on water level
    const alertText = document.getElementById('quiz-alert-text');
    const rewardsText = document.getElementById('quiz-rewards-text');
    
    if (waterLevel < 6 && hasHadWaterAboveThreshold) {
        // Low water alert mode
        if (alertText) {
            alertText.textContent = 'Your family is running low on water! Answer questions to earn 3 bonus drops.';
        }
        if (rewardsText) {
            rewardsText.textContent = 'Correct answer rewards: 💧 +1 each (max 3)';
        }
    } else {
        // Normal bonus mode
        if (alertText) {
            alertText.textContent = 'Test your water knowledge! Answer questions to earn 1 bonus drop.';
        }
        if (rewardsText) {
            rewardsText.textContent = 'Quiz completion reward: 💧 +1';
        }
    }
    
    // Show first question
    displayQuizQuestion();
    
    // Show quiz dialog (don't call pauseGame again since we already did)
    hideAllDialogs();
    const dialog = document.getElementById('emergency-quiz-dialog');
    if (dialog) {
        dialog.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Get random questions from the question bank
function getRandomQuestions(count) {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Display current quiz question
function displayQuizQuestion() {
    const question = currentQuizQuestions[currentQuestionIndex];
    const questionNumber = currentQuestionIndex + 1;
    
    // Update question number and progress dots
    document.querySelector('.question-number').textContent = `Question ${questionNumber} of 3`;
    updateProgressDots();
    
    // Update question content
    document.querySelector('.question-content h3').textContent = question.question;
    document.querySelector('.question-context').textContent = `Context: ${question.context}`;
    
    // Update answer options
    const answerOptions = document.querySelector('.answer-options');
    answerOptions.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('label');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <input type="radio" name="quiz-answer" value="${option.letter}">
            <span class="option-letter">${option.letter})</span>
            <span class="option-text">${option.text}</span>
        `;
        answerOptions.appendChild(optionElement);
        
        // Add click handler
        optionElement.addEventListener('click', () => selectQuizAnswer(option.letter));
    });
    
    // Reset selected answer
    selectedAnswer = null;
    updateSubmitButton();
}

// Update progress dots
function updateProgressDots() {
    const dots = document.querySelectorAll('.progress-dots .dot');
    dots.forEach((dot, index) => {
        if (index <= currentQuestionIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Handle answer selection
function selectQuizAnswer(answer) {
    selectedAnswer = answer;
    
    // Update radio button
    const radioButton = document.querySelector(`input[value="${answer}"]`);
    if (radioButton) {
        radioButton.checked = true;
    }
    
    updateSubmitButton();
}

// Update submit button state
function updateSubmitButton() {
    const submitButton = document.querySelector('#emergency-quiz-dialog .collect-btn');
    if (selectedAnswer) {
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
    } else {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.6';
    }
}

// Submit quiz answer
function submitQuizAnswer() {
    if (!selectedAnswer) return;
    
    const question = currentQuizQuestions[currentQuestionIndex];
    const correctOption = question.options.find(opt => opt.correct);
    const isCorrect = selectedAnswer === correctOption.letter;
    
    if (isCorrect) {
        quizScore++;
    }
    
    // Show answer feedback
    showQuizFeedback(isCorrect, question.explanation);
    
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < currentQuizQuestions.length) {
            // Next question
            displayQuizQuestion();
        } else {
            // Quiz complete
            completeQuiz();
        }
    }, 2500);
}

// Show answer feedback
function showQuizFeedback(isCorrect, explanation) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'quiz-feedback';
    feedbackDiv.innerHTML = `
        <div class="feedback-content">
            <div class="feedback-result ${isCorrect ? 'correct' : 'incorrect'}">
                <span class="feedback-icon">${isCorrect ? '✓' : '✗'}</span>
                <span class="feedback-text">${isCorrect ? 'Correct!' : 'Incorrect'}</span>
            </div>
            <p class="feedback-explanation">${explanation}</p>
        </div>
    `;
    
    const quizContainer = document.querySelector('.quiz-container');
    quizContainer.appendChild(feedbackDiv);
    
    // Hide question content temporarily
    document.querySelector('.question-section').style.opacity = '0.3';
    
    // Remove feedback after delay
    setTimeout(() => {
        feedbackDiv.remove();
        document.querySelector('.question-section').style.opacity = '1';
    }, 2500);
}

// Complete quiz and award drops
function completeQuiz() {
    let dropsEarned;
    
    // Check water level at quiz start to determine reward structure
    if (waterLevel < 6 && hasHadWaterAboveThreshold) {
        // Low water alert - full scoring system (1 drop per correct answer, max 3)
        dropsEarned = quizScore;
    } else {
        // Default bonus drops - only 1 bonus drop regardless of score
        dropsEarned = 1;
    }
    
    // Award drops to reservoir
    waterLevel = Math.min(20, waterLevel + dropsEarned);
    dropsCollected += dropsEarned;
    updateWaterLevel();
    
    // Show completion message
    showQuizCompletion(dropsEarned);
    
    // Close quiz after delay
    setTimeout(() => {
        closeDialog('emergency-quiz-dialog');
        
        // Ensure game is resumed (closeDialog should handle this, but let's be explicit)
        if (gamePaused) {
            resumeGame();
        }
        
        // Check if player won
        if (waterLevel >= 20) {
            setTimeout(() => {
                showWinScreen();
            }, 500);
        }
    }, 3000);
}

// Show quiz completion
function showQuizCompletion(dropsEarned) {
    const completionDiv = document.createElement('div');
    completionDiv.className = 'quiz-completion';
    completionDiv.innerHTML = `
        <div class="completion-content">
            <div class="completion-header">
                <span class="completion-icon">🎉</span>
                <h3>Quiz Complete!</h3>
            </div>
            <div class="completion-results">
                <p>You answered <strong>${quizScore} out of 3</strong> questions correctly!</p>
                <div class="drops-awarded">
                    <span class="drops-icon">💧</span>
                    <span class="drops-text">+${dropsEarned} drops earned</span>
                </div>
            </div>
            <p class="completion-message">Every correct answer helps your family and teaches you about the global water crisis!</p>
        </div>
    `;
    
    const quizDialog = document.querySelector('#emergency-quiz-dialog .quiz-container');
    quizDialog.innerHTML = '';
    quizDialog.appendChild(completionDiv);
}

// Skip quiz
function skipQuiz() {
    closeDialog('emergency-quiz-dialog');
    // Ensure game is resumed (closeDialog should handle this, but let's be explicit)
    if (gamePaused) {
        resumeGame();
    }
}

// Add a function to specifically show the loss screen
function showLossScreen() {
    console.log('Showing loss screen');
    
    // Play loss sound
    playLossSound();
    
    // Only show if player hasn't won
    if (playerHasWon) {
        console.log('Player has already won, not showing loss screen');
        return;
    }
    
    // Clean up any existing win screen
    const existingWinScreen = document.getElementById('winScreen');
    if (existingWinScreen) {
        existingWinScreen.remove();
    }
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
    });
    
    // Show loss screen
    const lossScreen = document.getElementById('lossScreen');
    lossScreen.style.display = 'flex';
    lossScreen.classList.add('active');
}