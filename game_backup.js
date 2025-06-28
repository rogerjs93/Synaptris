// =============================================================================
// ENHANCED SOUND & MUSIC MANAGER
// =============================================================================
class SoundGenerator {
    constructor(soundManager, scene) { 
        this.sound = soundManager; 
        this.scene = scene;
        this.backgroundMusic = null;
        this.basePitch = 1.0;
        this.baseVolume = 0.7;
        this.isMusicPlaying = false;
    }
    
    startBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
        
        if (this.scene.registry.get('musicEnabled')) {
            this.backgroundMusic = this.sound.add('backgroundMusic', {
                volume: this.baseVolume,
                loop: true,
                rate: this.basePitch
            });
            this.backgroundMusic.play();
            this.isMusicPlaying = true;
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
            this.isMusicPlaying = false;
        }
    }
    
    toggleMusic() {
        const musicEnabled = this.scene.registry.get('musicEnabled');
        this.scene.registry.set('musicEnabled', !musicEnabled);
        
        if (!musicEnabled && !this.isMusicPlaying) {
            this.startBackgroundMusic();
        } else if (musicEnabled && this.isMusicPlaying) {
            this.stopBackgroundMusic();
        }
    }
    
    toggleSound() {
        const soundEnabled = this.scene.registry.get('soundEnabled');
        this.scene.registry.set('soundEnabled', !soundEnabled);
    }
    
    // Apply brain state effects to music
    applyBrainStateToMusic(moodDescription) {
        if (!this.backgroundMusic || !this.scene.registry.get('musicEnabled')) return;
        
        let targetPitch = this.basePitch;
        let targetVolume = this.baseVolume;
        
        // Map the new mood descriptions to music effects
        if (moodDescription.includes('Optimal Neural State')) {
            targetPitch = 1.1;
            targetVolume = 0.8;
        } else if (moodDescription.includes('Dopamine Rush')) {
            targetPitch = 1.25;
            targetVolume = 0.9;
        } else if (moodDescription.includes('Hyperfocused State')) {
            targetPitch = 1.4;
            targetVolume = 0.95;
        } else if (moodDescription.includes('Over-Sedated')) {
            targetPitch = 0.6;
            targetVolume = 0.4;
        } else if (moodDescription.includes('Peak Motivation')) {
            targetPitch = 1.3;
            targetVolume = 0.85;
        } else if (moodDescription.includes('Laser Focus')) {
            targetPitch = 1.2;
            targetVolume = 0.8;
        } else if (moodDescription.includes('Neural Depression')) {
            targetPitch = 0.7;
            targetVolume = 0.3;
        } else if (moodDescription.includes('Anxiety Spike')) {
            targetPitch = 1.15;
            targetVolume = 0.75;
        } else if (moodDescription.includes('Neural Fatigue')) {
            targetPitch = 0.65;
            targetVolume = 0.45;
        } else if (moodDescription.includes('Chemical Chaos')) {
            targetPitch = 0.9;
            targetVolume = 0.6;
        } else {
            // Fallback for any other states
            targetPitch = 1.0;
            targetVolume = 0.7;
        }
        
        // Smooth transition to new pitch and volume
        if (this.scene.tweens) {
            this.scene.tweens.add({
                targets: this.backgroundMusic,
                rate: targetPitch,
                volume: targetVolume,
                duration: 2000,
                ease: 'Power2'
            });
        } else {
            this.backgroundMusic.setRate(targetPitch);
            this.backgroundMusic.setVolume(targetVolume);
        }
    }
    
    play(key) {
        if (!this.scene.registry.get('soundEnabled')) return;
        
        if (this.sound.context.state === 'suspended') { this.sound.context.resume(); }
        const context = this.sound.context; const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.connect(gain); gain.connect(context.destination); let now = context.currentTime;
        switch (key) {
            case 'move': case 'rotate': gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1); oscillator.frequency.setValueAtTime(440, now); oscillator.type = 'square'; oscillator.start(now); oscillator.stop(now + 0.1); break;
            case 'lock': gain.gain.setValueAtTime(0.4, now); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15); oscillator.frequency.setValueAtTime(220, now); oscillator.type = 'triangle'; oscillator.start(now); oscillator.stop(now + 0.15); break;
            case 'clear': gain.gain.setValueAtTime(0.4, now); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4); oscillator.type = 'sawtooth'; oscillator.frequency.setValueAtTime(523, now); oscillator.frequency.linearRampToValueAtTime(1046, now + 0.3); oscillator.start(now); oscillator.stop(now + 0.4); break;
            case 'reuptake_fail': gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3); oscillator.type = 'sawtooth'; oscillator.frequency.setValueAtTime(160, now); oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.25); oscillator.start(now); oscillator.stop(now + 0.3); break;
            case 'powerup': gain.gain.setValueAtTime(0.4, now); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5); oscillator.type = 'triangle'; oscillator.frequency.setValueAtTime(587, now); oscillator.frequency.setValueAtTime(783, now + 0.1); oscillator.frequency.setValueAtTime(1174, now + 0.2); oscillator.start(now); oscillator.stop(now + 0.5); break;
            case 'gameover': gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0); oscillator.type = 'sawtooth'; oscillator.frequency.setValueAtTime(440, now); oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.8); oscillator.start(now); oscillator.stop(now + 1.0); break;
        }
    }
}

// =============================================================================
// SCENE 0: BOOT SCENE (Unchanged)
// =============================================================================
class BootScene extends Phaser.Scene {
    constructor() { super({ key: 'BootScene' }); }
    preload() { 
        console.log('BootScene: Loading assets...');
        // Load background music
        this.load.audio('backgroundMusic', 'song.mp3');
        
        // Create loading text
        const loadingText = this.add.text(450, 360, 'Loading Neural Networks...', {
            fontSize: '24px',
            fill: '#00bcd4',
            fontFamily: 'Inter, sans-serif'
        }).setOrigin(0.5);
        
        // Add loading progress
        this.load.on('progress', (value) => {
            loadingText.setText(`Loading Neural Networks... ${Math.floor(value * 100)}%`);
        });
    }
    create() {
        const particleGraphics = this.make.graphics();
        particleGraphics.fillStyle(0x00bcd4);
        particleGraphics.fillCircle(4, 4, 4);
        particleGraphics.generateTexture('neural_particle', 8, 8);
        particleGraphics.destroy();
        
        // Initialize global audio settings
        this.registry.set('soundEnabled', true);
        this.registry.set('musicEnabled', true);
        
        console.log('BootScene: Done. Transitioning to StartScene.');
        this.scene.start('StartScene');
    }
}

// =============================================================================
// SCENE 1: START SCREEN (Enhanced with better UI)
// =============================================================================
class StartScene extends Phaser.Scene {
    constructor() { super({ key: 'StartScene' }); }
    create() {
        // Enhanced background with neural network animation
        this.createNeuralBackground();
        
        // Initialize sound system
        this.soundGenerator = new SoundGenerator(this.sound, this);
        this.soundGenerator.startBackgroundMusic();
        
        // Main title with advanced styling (centered for new 900px width)
        const title = this.add.text(450, 80, 'SYNAPTETRIS', { 
            fontSize: '56px', 
            fill: '#00bcd4',
            fontFamily: 'Orbitron, monospace',
            fontWeight: '900'
        }).setOrigin(0.5);
        
        title.setStroke('#003366', 6);
        title.setShadow(0, 0, '#00bcd4', 15, true, true);
        
        // Subtitle
        this.add.text(450, 120, 'Neural Transmission Puzzle Game', { 
            fontSize: '18px', 
            fill: '#8bc34a',
            fontFamily: 'Orbitron, monospace',
            fontWeight: '400'
        }).setOrigin(0.5);
        
        // Create elegant panels for information
        this.createInfoPanels();
        
        // Enhanced start button
        this.createStartButton();
        
        // Add floating neural particles
        this.createMenuParticles();
    }
    
    createNeuralBackground() {
        // Create animated neural network pattern
        const networkGraphics = this.add.graphics();
        networkGraphics.lineStyle(1, 0x00bcd4, 0.3);
        
        // Draw interconnected nodes (updated for new canvas width)
        const nodes = [];
        for (let i = 0; i < 18; i++) { // More nodes for wider canvas
            nodes.push({
                x: Phaser.Math.Between(50, 850), // Updated for 900px width
                y: Phaser.Math.Between(50, 600),
                connections: []
            });
        }
        
        // Connect nearby nodes
        nodes.forEach((node, i) => {
            nodes.forEach((otherNode, j) => {
                if (i !== j) {
                    const dist = Phaser.Math.Distance.Between(node.x, node.y, otherNode.x, otherNode.y);
                    if (dist < 150) {
                        networkGraphics.lineBetween(node.x, node.y, otherNode.x, otherNode.y);
                    }
                }
            });
            
            // Draw nodes
            networkGraphics.fillStyle(0x00bcd4, 0.6);
            networkGraphics.fillCircle(node.x, node.y, 3);
        });
        
        // Animate the network
        this.tweens.add({
            targets: networkGraphics,
            alpha: 0.8,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createInfoPanels() {
        const panelGraphics = this.add.graphics();
        panelGraphics.fillStyle(0x0a0a15, 0.9);
        panelGraphics.lineStyle(2, 0x00bcd4, 0.6);
        
        // Create panels with enhanced visual effects (updated for 900px width)
        const panels = [
            { x: 60, y: 160, w: 360, h: 130 },    // Objective panel (wider)
            { x: 480, y: 160, w: 360, h: 130 },   // Mechanics panel (moved right)
            { x: 60, y: 300, w: 360, h: 130 },    // Power-ups panel (wider)
            { x: 480, y: 300, w: 360, h: 130 }    // Controls panel (moved right)
        ];
        
        panels.forEach((panel, index) => {
            panelGraphics.fillRoundedRect(panel.x, panel.y, panel.w, panel.h, 10);
            panelGraphics.strokeRoundedRect(panel.x, panel.y, panel.w, panel.h, 10);
            
            // Add subtle glow animation to each panel
            const glowGraphics = this.add.graphics();
            glowGraphics.lineStyle(1, 0x00bcd4, 0.3);
            glowGraphics.strokeRoundedRect(panel.x - 2, panel.y - 2, panel.w + 4, panel.h + 4, 10);
            
            this.tweens.add({
                targets: glowGraphics,
                alpha: 0.8,
                duration: 2000 + index * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        const headerStyle = { fontSize: '18px', fill: '#00bcd4', fontFamily: 'Orbitron, monospace', fontWeight: '700' };
        const bodyStyle = { fontSize: '14px', fill: '#e0e0e0', fontFamily: 'Inter, sans-serif', align: 'left', wordWrap: { width: 340 }, fontWeight: '400', lineSpacing: 3 }; // More readable font
        
        // Enhanced content with more scientific detail (updated positioning)
        
        // Objective
        const objectiveHeader = this.add.text(70, 170, '🎯 OBJECTIVE', headerStyle);
        this.add.text(70, 195, 'Manage synaptic vesicle trafficking in neural pathways. Complete lines to trigger calcium-mediated exocytosis and maintain optimal neurotransmission efficiency!', bodyStyle);
        
        // Mechanics with more scientific accuracy
        this.add.text(490, 170, '⚗️ NEURAL MECHANICS', headerStyle);
        this.add.text(490, 195, 'Synaptic congestion reduces action potential propagation! Efficient vesicle docking optimizes signal transduction. Experience authentic neuropharmacological dynamics!', bodyStyle);
        
        // Enhanced power-ups description
        this.add.text(70, 310, '💊 NEUROPHARMACOLOGY', headerStyle);
        this.add.text(70, 335, 'Advanced drug mechanisms: Reuptake Inhibitors • MAO Inhibitors • NMDA Modulators • Cholinesterase Inhibitors • Calcium Channel Blockers • and more!', bodyStyle);
        
        // Controls with additional features
        this.add.text(490, 310, '🎮 CONTROLS', headerStyle);
        this.add.text(490, 335, '← → Move vesicles | ↑ Rotate | ↓ Soft Drop\nSPACE Hard Drop | P Pause | H Comprehensive Help\n👻 Ghost piece shows optimal docking position', bodyStyle);
        
        // Add floating particles around headers for extra visual appeal
        [objectiveHeader].forEach((header, index) => {
            for (let i = 0; i < 3; i++) {
                const particle = this.add.graphics();
                particle.fillStyle(0x00bcd4, 0.6);
                particle.fillCircle(0, 0, 2);
                particle.x = header.x + header.width + 10 + i * 15;
                particle.y = header.y + header.height / 2;
                
                this.tweens.add({
                    targets: particle,
                    y: particle.y - 5,
                    alpha: 0.3,
                    duration: 1500 + i * 200,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
        
        // Add audio control buttons in bottom right
        this.createAudioControls();
    }
    
    createAudioControls() {
        const controlsX = 720;
        const controlsY = 450;
        
        // Sound toggle button
        const soundButton = this.add.graphics();
        soundButton.fillStyle(0x1a1a2e, 0.9);
        soundButton.lineStyle(2, 0x00bcd4, 0.8);
        soundButton.fillRoundedRect(controlsX, controlsY, 70, 40, 8);
        soundButton.strokeRoundedRect(controlsX, controlsY, 70, 40, 8);
        
        this.soundButtonText = this.add.text(controlsX + 35, controlsY + 20, '🔊 SFX', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600'
        }).setOrigin(0.5);
        
        // Music toggle button
        const musicButton = this.add.graphics();
        musicButton.fillStyle(0x1a1a2e, 0.9);
        musicButton.lineStyle(2, 0x00bcd4, 0.8);
        musicButton.fillRoundedRect(controlsX + 80, controlsY, 70, 40, 8);
        musicButton.strokeRoundedRect(controlsX + 80, controlsY, 70, 40, 8);
        
        this.musicButtonText = this.add.text(controlsX + 115, controlsY + 20, '🎵 BGM', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600'
        }).setOrigin(0.5);
        
        // Make buttons interactive
        const soundHitArea = new Phaser.Geom.Rectangle(controlsX, controlsY, 70, 40);
        const musicHitArea = new Phaser.Geom.Rectangle(controlsX + 80, controlsY, 70, 40);
        
        soundButton.setInteractive(soundHitArea, Phaser.Geom.Rectangle.Contains);
        musicButton.setInteractive(musicHitArea, Phaser.Geom.Rectangle.Contains);
        
        // Sound button interactions
        soundButton.on('pointerdown', () => {
            this.soundGenerator.toggleSound();
            this.updateAudioButtonTexts();
        });
        
        soundButton.on('pointerover', () => {
            soundButton.clear();
            soundButton.fillStyle(0x2a2a3e, 0.9);
            soundButton.lineStyle(2, 0x00bcd4, 1);
            soundButton.fillRoundedRect(controlsX, controlsY, 70, 40, 8);
            soundButton.strokeRoundedRect(controlsX, controlsY, 70, 40, 8);
        });
        
        soundButton.on('pointerout', () => {
            soundButton.clear();
            soundButton.fillStyle(0x1a1a2e, 0.9);
            soundButton.lineStyle(2, 0x00bcd4, 0.8);
            soundButton.fillRoundedRect(controlsX, controlsY, 70, 40, 8);
            soundButton.strokeRoundedRect(controlsX, controlsY, 70, 40, 8);
        });
        
        // Music button interactions
        musicButton.on('pointerdown', () => {
            this.soundGenerator.toggleMusic();
            this.updateAudioButtonTexts();
        });
        
        musicButton.on('pointerover', () => {
            musicButton.clear();
            musicButton.fillStyle(0x2a2a3e, 0.9);
            musicButton.lineStyle(2, 0x00bcd4, 1);
            musicButton.fillRoundedRect(controlsX + 80, controlsY, 70, 40, 8);
            musicButton.strokeRoundedRect(controlsX + 80, controlsY, 70, 40, 8);
        });
        
        musicButton.on('pointerout', () => {
            musicButton.clear();
            musicButton.fillStyle(0x1a1a2e, 0.9);
            musicButton.lineStyle(2, 0x00bcd4, 0.8);
            musicButton.fillRoundedRect(controlsX + 80, controlsY, 70, 40, 8);
            musicButton.strokeRoundedRect(controlsX + 80, controlsY, 70, 40, 8);
        });
        
        this.updateAudioButtonTexts();
    }
    
    updateAudioButtonTexts() {
        const soundEnabled = this.registry.get('soundEnabled');
        const musicEnabled = this.registry.get('musicEnabled');
        
        this.soundButtonText.setText(soundEnabled ? '🔊 SFX' : '🔇 SFX');
        this.soundButtonText.setColor(soundEnabled ? '#ffffff' : '#888888');
        
        this.musicButtonText.setText(musicEnabled ? '🎵 BGM' : '🎵 BGM');
        this.musicButtonText.setColor(musicEnabled ? '#ffffff' : '#888888');
    }
    
    createStartButton() {
        const buttonGraphics = this.add.graphics();
        buttonGraphics.fillStyle(0x8bc34a, 0.8);
        buttonGraphics.lineStyle(3, 0x8bc34a, 1);
        buttonGraphics.fillRoundedRect(350, 480, 200, 60, 15); // Centered for 900px width
        buttonGraphics.strokeRoundedRect(350, 480, 200, 60, 15);
        
        // Add pulsing glow effect to button
        const buttonGlow = this.add.graphics();
        buttonGlow.lineStyle(2, 0x8bc34a, 0.6);
        buttonGlow.strokeRoundedRect(348, 478, 204, 64, 15);
        
        this.tweens.add({
            targets: buttonGlow,
            alpha: 0.3,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        const startButton = this.add.text(450, 510, 'BEGIN TRANSMISSION', { // Centered for 900px width
            fontSize: '18px', 
            fill: '#ffffff', 
            fontFamily: 'Orbitron, monospace',
            fontWeight: '700'
        }).setOrigin(0.5).setInteractive();
        
        // Enhanced button hover effects
        startButton.on('pointerover', () => {
            startButton.setScale(1.08);
            buttonGraphics.clear();
            buttonGraphics.fillStyle(0xaed581, 0.95);
            buttonGraphics.lineStyle(4, 0x8bc34a, 1);
            buttonGraphics.fillRoundedRect(350, 480, 200, 60, 15); // Updated position
            buttonGraphics.strokeRoundedRect(350, 480, 200, 60, 15);
            
            // Add sparkle effect on hover
            for (let i = 0; i < 5; i++) {
                const sparkle = this.add.graphics();
                sparkle.fillStyle(0xffffff, 0.8);
                sparkle.fillCircle(0, 0, 2);
                sparkle.x = 350 + Math.random() * 200; // Updated position
                sparkle.y = 480 + Math.random() * 60;
                
                this.tweens.add({
                    targets: sparkle,
                    alpha: 0,
                    scaleX: 2,
                    scaleY: 2,
                    duration: 800,
                    ease: 'Power2',
                    onComplete: () => sparkle.destroy()
                });
            }
        });
        
        startButton.on('pointerout', () => {
            startButton.setScale(1);
            buttonGraphics.clear();
            buttonGraphics.fillStyle(0x8bc34a, 0.8);
            buttonGraphics.lineStyle(3, 0x8bc34a, 1);
            buttonGraphics.fillRoundedRect(350, 480, 200, 60, 15); // Updated position
            buttonGraphics.strokeRoundedRect(350, 480, 200, 60, 15);
        });
        
        startButton.on('pointerdown', () => { 
            if (this.sound.context.state === 'suspended') { 
                this.sound.context.resume(); 
            } 
            
            // Enhanced transition effect with neural pulse
            const transitionEffect = this.add.graphics();
            transitionEffect.fillStyle(0x00bcd4, 0.3);
            transitionEffect.fillCircle(450, 510, 10); // Updated position for center
            
            this.tweens.add({
                targets: transitionEffect,
                scaleX: 50,
                scaleY: 50,
                alpha: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => transitionEffect.destroy()
            });
            
            // Stop music in start scene before transitioning
            if (this.soundGenerator) {
                this.soundGenerator.stopBackgroundMusic();
            }
            
            this.cameras.main.fadeOut(1000, 0, 50, 100); 
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => { 
                this.scene.start('GameScene'); 
            }); 
        });
        
        // Pulsing glow effect for the button
        this.tweens.add({
            targets: startButton,
            alpha: 0.7,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createMenuParticles() {
        const particles = this.add.particles(0, 0, 'neural_particle', {
            speed: { min: 3, max: 8 }, 
            angle: { min: 0, max: 360 }, 
            scale: { start: 0.8, end: 0 },
            alpha: { start: 0, end: 0.6, ease: 'Quad.easeIn' }, 
            lifespan: 8000, 
            frequency: 150, 
            blendMode: 'ADD',
            tint: [0x00bcd4, 0x8bc34a, 0xff9800]
        });
        
        particles.setEmitZone({ source: new Phaser.Geom.Rectangle(0, 0, 650, 650) });
    }
}

// =============================================================================
// SCENE 2: THE MAIN GAME (Completely revised visual structure)
// =============================================================================
class GameScene extends Phaser.Scene {
    constructor() { super({ key: 'GameScene' }); }
    init() {
        this.BOARD_WIDTH = 10; this.BOARD_HEIGHT = 20; this.BLOCK_SIZE = 35; this.board = []; this.currentPiece = null; this.nextPiece = null; this.nextPieces = []; this.score = 0; this.lines = 0; this.gameOver = false; this.congestion = 0; this.baseDropDelay = 1000; this.currentDropDelay = 1000; this.isPaused = false; this.showHelp = false; this.wasAlreadyPaused = false; this.speedBoostActive = false; this.gabaActive = false; this.brainBarrierActive = false; this.memoryEnhanced = false; this.memoryBoostCount = 0; this.alertnessBoostActive = false; this.monoaminePreserved = false;
        
        // Neurotransmitter Balance & Mood System
        this.neurotransmitterLevels = {
            dopamine: 50,    // Motivation, pleasure
            serotonin: 50,   // Happiness, mood
            gaba: 50,        // Calmness, anxiety control
            glutamate: 50,   // Alertness, learning
            acetylcholine: 50, // Focus, memory
            norepinephrine: 50, // Energy, arousal
            endorphin: 50    // Pleasure, pain relief
        };
        
        this.moodState = {
            happiness: 50,
            calmness: 50,
            alertness: 50,
            motivation: 50,
            focus: 50,
            pleasure: 50,
            learning: 50
        };
        
        this.currentMoodDescription = "🧠 Balanced";
        this.neurotransmitterChoices = []; // 3 choices for next piece
        this.selectedChoice = 0; // Which of the 3 choices is highlighted
        this.homeostasisBonus = 0;
        this.waitingForChoice = false; // Flag to pause game until player chooses
        this.activeFloatingTexts = []; // Track active floating texts to prevent overlap
    }
    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // 1. DYNAMIC BACKGROUND (created first, so it's on the bottom layer)
        const particles = this.add.particles(0, 0, 'neural_particle', {
            speed: { min: 5, max: 15 }, angle: { min: 0, max: 360 }, scale: { start: 1, end: 0 },
            alpha: { start: 0, end: 0.5, ease: 'Quad.easeIn' }, lifespan: 6000, frequency: 80, blendMode: 'ADD'
        });
        particles.setEmitZone({ source: new Phaser.Geom.Rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height) });

        // 2. PERMANENT SEMI-TRANSPARENT BACKGROUND & GRID
        // This is a much better way to handle the background visuals.
        const boardWidthPx = this.BOARD_WIDTH * this.BLOCK_SIZE;
        const boardHeightPx = this.BOARD_HEIGHT * this.BLOCK_SIZE;
        
        // We create a permanent graphics object for the static background and grid.
        const staticGraphics = this.add.graphics();
        // Draw the semi-transparent rectangle. This is the key for the background effect.
        staticGraphics.fillStyle(0x0d0d1a, 0.8);
        staticGraphics.fillRect(0, 0, boardWidthPx, boardHeightPx);
        // Draw the complete grid lines on top of the transparent rectangle.
        staticGraphics.lineStyle(1, 0x2a2a3e, 0.5);
        for (let i = 0; i <= this.BOARD_WIDTH; i++) {
            staticGraphics.lineBetween(i * this.BLOCK_SIZE, 0, i * this.BLOCK_SIZE, boardHeightPx);
        }
        for (let i = 0; i <= this.BOARD_HEIGHT; i++) {
            staticGraphics.lineBetween(0, i * this.BLOCK_SIZE, boardWidthPx, i * this.BLOCK_SIZE);
        }

        // 3. DYNAMIC GRAPHICS FOR PIECES
        // This object is for drawing the moving pieces and is cleared every frame.
        this.pieceGraphics = this.add.graphics();
        
        // 4. UI ELEMENTS (created last, so they are on top of everything)
        this.createUIElements();
        
        // --- Game Logic Setup ---
        for (let y = 0; y < this.BOARD_HEIGHT; y++) { this.board[y] = Array(this.BOARD_WIDTH).fill(0); }
        this.soundGenerator = new SoundGenerator(this.sound, this);
        this.soundGenerator.startBackgroundMusic(); // Start music in game scene too
        this.shapes = [ 
            { shape: [[1, 1, 1, 1]], color: 0x00bcd4, name: 'Dopamine', gradient: [0x00bcd4, 0x4dd0e1] }, 
            { shape: [[1, 0, 0], [1, 1, 1]], color: 0xffeb3b, name: 'Serotonin', gradient: [0xffeb3b, 0xfff176] }, 
            { shape: [[0, 0, 1], [1, 1, 1]], color: 0x8bc34a, name: 'GABA', gradient: [0x8bc34a, 0xaed581] }, 
            { shape: [[1, 1], [1, 1]], color: 0xf44336, name: 'Glutamate', gradient: [0xf44336, 0xef5350] }, 
            { shape: [[0, 1, 1], [1, 1, 0]], color: 0xff9800, name: 'Acetylcholine', gradient: [0xff9800, 0xffb74d] }, 
            { shape: [[0, 1, 0], [1, 1, 1]], color: 0x9c27b0, name: 'Norepinephrine', gradient: [0x9c27b0, 0xba68c8] }, 
            { shape: [[1, 1, 0], [0, 1, 1]], color: 0x3f51b5, name: 'Endorphin', gradient: [0x3f51b5, 0x7986cb] } 
        ];
        this.powerUpShape = { shape: [[1]], color: 0xffffff, name: 'Reuptake Inhibitor', isPowerUp: true };
        this.currentNeurotransmitter = 'Mixed';
        
        // Enhanced power-up system with comprehensive neuropharmacological variety
        this.powerUps = [
            {
                shape: [[1]], 
                color: 0xffffff, 
                name: 'Reuptake Inhibitor', 
                description: 'Blocks reuptake transporters, clearing random vesicles (like SSRIs)',
                effect: 'clearRandom',
                isPowerUp: true
            },
            {
                shape: [[1]], 
                color: 0xff1744, 
                name: 'Neural Stimulant', 
                description: 'Increases action potential frequency and propagation speed',
                effect: 'speedBoost',
                isPowerUp: true
            },
            {
                shape: [[1]], 
                color: 0x4caf50, 
                name: 'GABA Enhancer', 
                description: 'Potentiates inhibitory signaling, reduces neural hyperactivity',
                effect: 'calmSystem',
                isPowerUp: true
            },
            {
                shape: [[1]], 
                color: 0x9c27b0, 
                name: 'Synaptic Plasticity', 
                description: 'Induces LTP/LTD, reorganizes neural pathways',
                effect: 'reorganize',
                isPowerUp: true
            },
            {
                shape: [[1]], 
                color: 0xff9800, 
                name: 'Neurotrophic Factor', 
                description: 'BDNF release promotes synaptic growth and strength',
                effect: 'bonusPoints',
                isPowerUp: true
            },
            {
                shape: [[1]], 
                color: 0x00e676, 
                name: 'Calcium Channel Blocker', 
                description: 'Reduces Ca²⁺ influx, decreases vesicle release rate',
                effect: 'slowDown',
                isPowerUp: true
            },
            {
                shape: [[1]], 
                color: 0x2196f3, 
                name: 'Myelin Booster', 
                description: 'Oligodendrocyte activation, enhanced signal conduction',
                effect: 'clearColumns',
                isPowerUp: true
            },
            {
                shape: [[1]], 
                color: 0xe91e63, 
                name: 'Astrocyte Support', 
                description: 'Glial metabolic support and neurotransmitter uptake',
                effect: 'clearBottom',
                isPowerUp: true
            },
            {
                shape: [[1]], 
                color: 0x795548, 
                name: 'Microglia Activation', 
                description: 'CNS immune response, clears damaged synapses',
                effect: 'clearDamaged',
                isPowerUp: true
            },
            {
                shape: [[1]], 
                color: 0x607d8b, 
                name: 'Blood-Brain Barrier', 
                description: 'Tight junction protection against toxins',
                effect: 'protection',
                isPowerUp: true
            },
            {
                shape: [[1]], 
                color: 0xffc107, 
                name: 'Cholinesterase Inhibitor', 
                description: 'Blocks ACh breakdown, enhances memory pathways',
                effect: 'enhanceMemory',
                isPowerUp: true
            },
            {
                shape: [[1]], 
                color: 0x3f51b5, 
                name: 'NMDA Receptor Modulator', 
                description: 'Regulates glutamate signaling and synaptic plasticity',
                effect: 'modulateGlutamate',
                isPowerUp: true
            },
            {
                shape: [[1]], 
                color: 0x8bc34a, 
                name: 'Adenosine Receptor Antagonist', 
                description: 'Blocks adenosine (like caffeine), increases alertness',
                effect: 'increaseAlertness',
                isPowerUp: true
            },
            {
                shape: [[1]], 
                color: 0xff5722, 
                name: 'Monoamine Oxidase Inhibitor', 
                description: 'Prevents breakdown of dopamine, serotonin, norepinephrine',
                effect: 'preserveMonoamines',
                isPowerUp: true
            }
        ];
        
        // Enhanced particle system for neural activity
        this.setupEnhancedParticles();
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', this.hardDrop, this);
        this.input.keyboard.on('keydown-P', this.togglePause, this);
        this.input.keyboard.on('keydown-ESC', this.togglePause, this);
        this.input.keyboard.on('keydown-H', this.toggleHelp, this);
        
        // Neurotransmitter choice keys
        this.input.keyboard.on('keydown-ONE', () => this.selectNeurotransmitterChoice(0), this);
        this.input.keyboard.on('keydown-TWO', () => this.selectNeurotransmitterChoice(1), this);
        this.input.keyboard.on('keydown-THREE', () => this.selectNeurotransmitterChoice(2), this);
        
        // Audio control keys
        this.input.keyboard.on('keydown-S', () => {
            this.soundGenerator.toggleSound();
            this.updateGameAudioButtonTexts();
        }, this);
        this.input.keyboard.on('keydown-M', () => {
            this.soundGenerator.toggleMusic();
            this.updateGameAudioButtonTexts();
        }, this);
        
        // Initialize the choice system - player always chooses first
        this.generateNeurotransmitterChoices();
        this.waitingForChoice = true; // Start by waiting for first choice
        // Auto-select the first choice to ensure player always has something highlighted
        this.selectedChoice = 0;
        // Don't start drop timer until first piece is spawned
        this.draw();
    }
    update() {
        if (this.gameOver) return;
        
        // Handle help when open
        if (this.showHelp) {
            return; // Don't process game controls when help is open
        }
        
        // Allow help toggle even when paused, but not other controls
        if (this.isPaused) return;
        
        // Allow piece movement even when waiting for neurotransmitter choice
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) { if (this.movePiece(-1, 0)) this.soundGenerator.play('move'); } 
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) { if (this.movePiece(1, 0)) this.soundGenerator.play('move'); } 
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { if (this.movePiece(0, 1)) this.soundGenerator.play('move'); } 
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) { this.rotatePiece(); }
    }
    
    draw() {
        // We only need to clear and redraw the pieces that move.
        this.pieceGraphics.clear();
        
        // Update particle effects based on game state
        this.updateParticleEffects();

        // Draw locked pieces with 3D effects
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x]) {
                    // Find the shape that matches this color for gradient
                    const matchingShape = this.shapes.find(shape => shape.color === this.board[y][x]);
                    const gradient = matchingShape ? matchingShape.gradient : null;
                    this.draw3DBlock(this.pieceGraphics, x, y, this.BLOCK_SIZE, this.board[y][x], gradient);
                }
            }
        }

        // Draw ghost piece with enhanced transparency effect
        if (this.currentPiece && !this.isPaused) {
            const ghostY = this.getGhostPieceY();
            if (ghostY !== this.currentPiece.y) {
                const { x, shape, color } = this.currentPiece;
                const matchingShape = this.shapes.find(s => s.color === color);
                const gradient = matchingShape ? matchingShape.gradient : null;
                
                for (let row = 0; row < shape.length; row++) {
                    for (let col = 0; col < shape[row].length; col++) {
                        if (shape[row][col]) {
                            this.draw3DBlock(this.pieceGraphics, x + col, ghostY + row, this.BLOCK_SIZE, color, gradient, 0.3);
                            // Add ghost outline
                            this.pieceGraphics.lineStyle(2, color, 0.6);
                            this.pieceGraphics.strokeRect((x + col) * this.BLOCK_SIZE, (ghostY + row) * this.BLOCK_SIZE, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
                            this.pieceGraphics.lineStyle();
                        }
                    }
                }
            }
        }

        // Draw current falling piece with enhanced 3D effects
        if (this.currentPiece && !this.isPaused) {
            const { x, y, shape, color } = this.currentPiece;
            const matchingShape = this.shapes.find(s => s.color === color);
            const gradient = matchingShape ? matchingShape.gradient : null;
            
            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        this.draw3DBlock(this.pieceGraphics, x + col, y + row, this.BLOCK_SIZE, color, gradient);
                        
                        // Add special glow for active piece
                        this.pieceGraphics.lineStyle(1, color, 0.8);
                        this.pieceGraphics.strokeRect((x + col) * this.BLOCK_SIZE + 2, (y + row) * this.BLOCK_SIZE + 2, this.BLOCK_SIZE - 6, this.BLOCK_SIZE - 6);
                        this.pieceGraphics.lineStyle();
                    }
                }
            }
        }
        
        // --- UI Drawing ---
        this.drawNextPieces();
        
        // Update all UI text with cleaner formatting
        this.scoreText.setText(`Score: ${this.score.toLocaleString()}`); 
        this.linesText.setText(`Lines: ${this.lines}`); 
        this.congestionText.setText(`Congestion: ${Math.floor(this.congestion * 100)}%`);
        
        // Update neurotransmitter display
        if (this.neurotransmitterText) {
            this.neurotransmitterText.setText(`Current: ${this.currentNeurotransmitter}`);
        }
        
        // Update mood and homeostasis displays
        if (this.moodText) {
            this.moodText.setText(this.currentMoodDescription || '🧠 Balanced Brain');
        }
        
        if (this.homeostasisText) {
            this.homeostasisText.setText(`Balance Bonus: ${this.homeostasisBonus}`);
        }
        
        // Update waiting indicator
        if (this.waitingIndicator) {
            this.waitingIndicator.setVisible(this.waitingForChoice);
        }
        
        // Update neurotransmitter level bars
        this.updateNeurotransmitterBars();
        
        // Update congestion color based on level
        const congestionLevel = this.congestion * 100;
        if (congestionLevel < 20) {
            this.congestionText.setColor('#8bc34a'); // Green - good
        } else if (congestionLevel < 50) {
            this.congestionText.setColor('#ff9800'); // Orange - warning
        } else {
            this.congestionText.setColor('#ff5555'); // Red - critical
        }
        
        // Calculate and display level
        const level = Math.floor(this.lines / 10) + 1;
        if (this.levelText) {
            this.levelText.setText(`Level: ${level}`);
        }
        
        // Draw pause overlay
        if (this.isPaused && !this.showHelp) {
            this.drawPauseOverlay();
        }
        
        // Draw help overlay (should be persistent and on top)
        if (this.showHelp) {
            // Only draw help if it doesn't already exist
            if (!this.helpOverlay || !this.helpDisplay) {
                this.drawHelpOverlay();
            }
        }
    }
    
    // --- New helper methods for enhanced functionality ---
    createUIElements() {
        // Create enhanced background for the game area first
        this.createGameAreaBackground();
        
        const uiX = 400; // Moved right to accommodate larger game board (350px + 50px margin)
        const panelBg = this.add.graphics();
        
        // Create clean UI background panels
        panelBg.fillStyle(0x0a0a15, 0.9);
        panelBg.lineStyle(2, 0x00bcd4, 0.6);
        
        // Main UI panel - much wider to efficiently use canvas space
        panelBg.fillRoundedRect(uiX + 30, 40, 420, 570, 10);
        panelBg.strokeRoundedRect(uiX + 30, 40, 420, 570, 10);
        
        // Title with glow effect (centered in wider panel)
        const title = this.add.text(uiX + 240, 70, 'SYNAPTETRIS', { 
            fontSize: '32px', 
            fill: '#00bcd4',
            fontFamily: 'Orbitron, monospace',
            fontWeight: '900'
        }).setOrigin(0.5);
        title.setStroke('#003366', 3);
        title.setShadow(0, 0, '#00bcd4', 8, true, true);
        
        // === NEUROTRANSMITTER SELECTION SECTION ===
        this.add.text(uiX + 240, 105, 'CHOOSE NEUROTRANSMITTER', { 
            fontSize: '16px', 
            fill: '#ffff00',
            fontFamily: 'Orbitron, monospace',
            fontWeight: '700'
        }).setOrigin(0.5);
        
        // Waiting indicator (moved above buttons to avoid overlap)
        this.waitingIndicator = this.add.text(uiX + 240, 115, 'WAITING FOR CHOICE...', { 
            fontSize: '14px', 
            fill: '#ff6600',
            fontFamily: 'Orbitron, monospace',
            fontWeight: '700'
        }).setOrigin(0.5);
        this.waitingIndicator.setVisible(false);
        
        // Create 3 clean choice buttons in a row (better spaced across wider panel)
        this.nextPieceGraphics = this.add.graphics({ x: uiX + 50, y: 125 });
        this.choiceButtons = [];
        for (let i = 0; i < 3; i++) {
            const buttonX = uiX + 120 + (i * 80); // Much better spacing across wider panel
            const buttonY = 130;
            
            const button = this.add.graphics();
            button.fillStyle(0x1a1a2e, 0.9);
            button.lineStyle(2, 0x00bcd4, 0.8);
            button.fillRoundedRect(buttonX, buttonY, 60, 60, 8); // Even larger buttons
            button.strokeRoundedRect(buttonX, buttonY, 60, 60, 8);
            
            const buttonText = this.add.text(buttonX + 30, buttonY + 30, (i + 1).toString(), {
                fontSize: '22px', // Larger text
                fill: '#ffffff',
                fontFamily: 'Orbitron, monospace',
                fontWeight: '700'
            }).setOrigin(0.5);
            
            this.choiceButtons.push({ graphics: button, text: buttonText });
        }
        
        // Keys hint (moved below buttons with proper spacing)
        this.add.text(uiX + 240, 210, 'Press 1, 2, or 3 to select', { 
            fontSize: '14px', 
            fill: '#888888',
            fontFamily: 'Orbitron, monospace'
        }).setOrigin(0.5);
        
        // === BRAIN STATE SECTION (Left side of wider panel) ===
        this.add.text(uiX + 60, 220, '🧠 BRAIN STATE', { 
            fontSize: '16px', 
            fill: '#ff9800',
            fontFamily: 'Orbitron, monospace',
            fontWeight: '700'
        });
        
        this.moodText = this.add.text(uiX + 60, 245, '🧠 Balanced Brain', { 
            fontSize: '14px', 
            fill: '#e0e0e0',
            fontFamily: 'Inter, Arial, sans-serif',
            wordWrap: { width: 180 }
        });
        
        this.homeostasisText = this.add.text(uiX + 60, 265, 'Balance Bonus: 0', { 
            fontSize: '13px', 
            fill: '#8bc34a',
            fontFamily: 'Inter, Arial, sans-serif'
        });
        
        // === GAME STATS SECTION (Right side of wider panel) ===
        this.add.text(uiX + 280, 220, '📊 GAME STATS', { 
            fontSize: '16px', 
            fill: '#00bcd4',
            fontFamily: 'Orbitron, monospace',
            fontWeight: '700'
        });
        
        // Stats in organized layout
        this.scoreText = this.add.text(uiX + 280, 245, 'Score: 0', { 
            fontSize: '14px', 
            fill: '#e0e0e0',
            fontFamily: 'JetBrains Mono, monospace'
        });
        
        this.linesText = this.add.text(uiX + 280, 260, 'Lines: 0', { 
            fontSize: '14px', 
            fill: '#e0e0e0',
            fontFamily: 'JetBrains Mono, monospace'
        });
        
        this.levelText = this.add.text(uiX + 280, 275, 'Level: 1', { 
            fontSize: '14px', 
            fill: '#e0e0e0',
            fontFamily: 'JetBrains Mono, monospace'
        });
        
        this.neurotransmitterText = this.add.text(uiX + 280, 290, 'Current: Mixed', { 
            fontSize: '14px', 
            fill: '#e91e63',
            fontFamily: 'Inter, Arial, sans-serif'
        });
        
        // === NEUROTRANSMITTER LEVELS SECTION (Full width) ===
        this.add.text(uiX + 240, 320, '🧬 NEUROTRANSMITTER LEVELS', { 
            fontSize: '16px', 
            fill: '#e91e63',
            fontFamily: 'Orbitron, monospace',
            fontWeight: '700'
        }).setOrigin(0.5);
        
        // Create neurotransmitter level bars (centered in wider panel)
        this.createNeurotransmitterBars(uiX + 60, 345);
        
        // === CONTROLS SECTION (Left side) ===
        this.add.text(uiX + 60, 470, '🎮 CONTROLS', { 
            fontSize: '14px', 
            fill: '#9c27b0',
            fontFamily: 'Orbitron, monospace',
            fontWeight: '700'
        });
        
        // Control list with better spacing
        this.add.text(uiX + 60, 490, '← → ↑ ↓ : Move/Rotate', { 
            fontSize: '12px', 
            fill: '#cccccc',
            fontFamily: 'Inter, Arial, sans-serif'
        });
        
        this.add.text(uiX + 60, 505, 'SPACE: Drop | 1,2,3: Choose', { 
            fontSize: '12px', 
            fill: '#cccccc',
            fontFamily: 'Inter, Arial, sans-serif'
        });
        
        this.add.text(uiX + 60, 520, 'P: Pause | H: Help | S: Sound | M: Music', { 
            fontSize: '12px', 
            fill: '#cccccc',
            fontFamily: 'Inter, Arial, sans-serif'
        });
        
        // === STATUS SECTION (Right side) ===
        this.add.text(uiX + 280, 470, '⚡ STATUS', { 
            fontSize: '14px', 
            fill: '#ff9800',
            fontFamily: 'Orbitron, monospace',
            fontWeight: '700'
        });
        
        // Status indicators with better spacing
        this.congestionText = this.add.text(uiX + 280, 490, 'Congestion: 0%', { 
            fontSize: '13px', 
            fill: '#ff5555',
            fontFamily: 'Orbitron, monospace'
        });
        
        this.speedText = this.add.text(uiX + 280, 505, 'Speed: Normal', { 
            fontSize: '13px', 
            fill: '#e0e0e0',
            fontFamily: 'Orbitron, monospace'
        });
        
        // === AUDIO CONTROLS SECTION (Bottom of panel) ===
        this.createGameAudioControls(uiX);
    }
    
    createGameAudioControls(uiX) {
        const controlsY = 565;  // Moved down from 540 to 555
        
        // Audio controls header
        this.add.text(uiX + 240, 550, '🎧 AUDIO', {  // Moved down from 535 to 550
            fontSize: '14px', 
            fill: '#ff5722',
            fontFamily: 'Orbitron, monospace',
            fontWeight: '700'
        }).setOrigin(0.5);
        
        // Sound toggle button
        const soundButton = this.add.graphics();
        soundButton.fillStyle(0x1a1a2e, 0.9);
        soundButton.lineStyle(2, 0x00bcd4, 0.8);
        soundButton.fillRoundedRect(uiX + 160, controlsY, 70, 35, 6);
        soundButton.strokeRoundedRect(uiX + 160, controlsY, 70, 35, 6);
        
        this.gameSoundButtonText = this.add.text(uiX + 195, controlsY + 17, '🔊 SFX', {
            fontSize: '11px',
            fill: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600'
        }).setOrigin(0.5);
        
        // Music toggle button
        const musicButton = this.add.graphics();
        musicButton.fillStyle(0x1a1a2e, 0.9);
        musicButton.lineStyle(2, 0x00bcd4, 0.8);
        musicButton.fillRoundedRect(uiX + 250, controlsY, 70, 35, 6);
        musicButton.strokeRoundedRect(uiX + 250, controlsY, 70, 35, 6);
        
        this.gameMusicButtonText = this.add.text(uiX + 285, controlsY + 17, '🎵 BGM', {
            fontSize: '11px',
            fill: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600'
        }).setOrigin(0.5);
        
        // Make buttons interactive
        const soundHitArea = new Phaser.Geom.Rectangle(uiX + 160, controlsY, 70, 35);
        const musicHitArea = new Phaser.Geom.Rectangle(uiX + 250, controlsY, 70, 35);
        
        soundButton.setInteractive(soundHitArea, Phaser.Geom.Rectangle.Contains);
        musicButton.setInteractive(musicHitArea, Phaser.Geom.Rectangle.Contains);
        
        // Sound button interactions
        soundButton.on('pointerdown', () => {
            this.soundGenerator.toggleSound();
            this.updateGameAudioButtonTexts();
        });
        
        soundButton.on('pointerover', () => {
            soundButton.clear();
            soundButton.fillStyle(0x2a2a3e, 0.9);
            soundButton.lineStyle(2, 0x00bcd4, 1);
            soundButton.fillRoundedRect(uiX + 160, controlsY, 70, 35, 6);
            soundButton.strokeRoundedRect(uiX + 160, controlsY, 70, 35, 6);
        });
        
        soundButton.on('pointerout', () => {
            soundButton.clear();
            soundButton.fillStyle(0x1a1a2e, 0.9);
            soundButton.lineStyle(2, 0x00bcd4, 0.8);
            soundButton.fillRoundedRect(uiX + 160, controlsY, 70, 35, 6);
            soundButton.strokeRoundedRect(uiX + 160, controlsY, 70, 35, 6);
        });
        
        // Music button interactions
        musicButton.on('pointerdown', () => {
            this.soundGenerator.toggleMusic();
            this.updateGameAudioButtonTexts();
        });
        
        musicButton.on('pointerover', () => {
            musicButton.clear();
            musicButton.fillStyle(0x2a2a3e, 0.9);
            musicButton.lineStyle(2, 0x00bcd4, 1);
            musicButton.fillRoundedRect(uiX + 250, controlsY, 70, 35, 6);
            musicButton.strokeRoundedRect(uiX + 250, controlsY, 70, 35, 6);
        });
        
        musicButton.on('pointerout', () => {
            musicButton.clear();
            musicButton.fillStyle(0x1a1a2e, 0.9);
            musicButton.lineStyle(2, 0x00bcd4, 0.8);
            musicButton.fillRoundedRect(uiX + 250, controlsY, 70, 35, 6);
            musicButton.strokeRoundedRect(uiX + 250, controlsY, 70, 35, 6);
        });
        
        this.updateGameAudioButtonTexts();
    }
    
    updateGameAudioButtonTexts() {
        const soundEnabled = this.registry.get('soundEnabled');
        const musicEnabled = this.registry.get('musicEnabled');
        
        if (this.gameSoundButtonText) {
            this.gameSoundButtonText.setText(soundEnabled ? '🔊 SFX' : '🔇 SFX');
            this.gameSoundButtonText.setColor(soundEnabled ? '#ffffff' : '#888888');
        }
        
        if (this.gameMusicButtonText) {
            this.gameMusicButtonText.setText(musicEnabled ? '🎵 BGM' : '🎵 BGM');
            this.gameMusicButtonText.setColor(musicEnabled ? '#ffffff' : '#888888');
        }
    }
    
    setupEnhancedParticles() {
        // Create multiple particle emitters for different effects
        this.neuralParticles = this.add.particles(0, 0, 'neural_particle', {
            speed: { min: 10, max: 25 }, 
            angle: { min: 0, max: 360 }, 
            scale: { start: 1.5, end: 0 },
            alpha: { start: 0, end: 0.8, ease: 'Quad.easeIn' }, 
            lifespan: 4000, 
            frequency: 100, 
            blendMode: 'ADD'
        });
        
        // Congestion particles (red, slower when congested)
        this.congestionParticles = this.add.particles(0, 0, 'neural_particle', {
            speed: { min: 2, max: 8 }, 
            angle: { min: 0, max: 360 }, 
            scale: { start: 0.8, end: 0 },
            alpha: { start: 0, end: 0.6 }, 
            lifespan: 8000, 
            frequency: 50, 
            blendMode: 'ADD',
            tint: 0xff3333
        });
        
        // Set emit zones
        const gameWidth = this.BOARD_WIDTH * this.BLOCK_SIZE;
        const gameHeight = this.BOARD_HEIGHT * this.BLOCK_SIZE;
        this.neuralParticles.setEmitZone({ source: new Phaser.Geom.Rectangle(0, 0, gameWidth, gameHeight) });
        this.congestionParticles.setEmitZone({ source: new Phaser.Geom.Rectangle(0, 0, gameWidth, gameHeight) });
        
        // Initially pause congestion particles
        this.congestionParticles.pause();
    }
    
    draw3DBlock(graphics, x, y, size, color, gradient = null, alpha = 1) {
        const blockX = x * this.BLOCK_SIZE;
        const blockY = y * this.BLOCK_SIZE;
        const blockSize = size - 2;
        
        // Main block face
        graphics.fillStyle(color, alpha);
        graphics.fillRect(blockX + 1, blockY + 1, blockSize, blockSize);
        
        // Add gradient effect if provided
        if (gradient && gradient.length >= 2) {
            graphics.fillGradientStyle(gradient[0], gradient[1], gradient[0], gradient[1], alpha);
            graphics.fillRect(blockX + 1, blockY + 1, blockSize, blockSize);
        }
        
        // 3D depth effect - right edge (darker)
        const darkerColor = Phaser.Display.Color.Interpolate.ColorWithColor(
            Phaser.Display.Color.ValueToColor(color),
            { r: 0, g: 0, b: 0 },
            3,
            0.7
        );
        graphics.fillStyle(Phaser.Display.Color.GetColor(darkerColor.r, darkerColor.g, darkerColor.b), alpha * 0.8);
        graphics.fillRect(blockX + blockSize - 2, blockY + 1, 4, blockSize);
        
        // 3D depth effect - bottom edge (darker)
        graphics.fillRect(blockX + 1, blockY + blockSize - 2, blockSize, 4);
        
        // Top highlight (lighter)
        const lighterColor = Phaser.Display.Color.Interpolate.ColorWithColor(
            Phaser.Display.Color.ValueToColor(color),
            { r: 255, g: 255, b: 255 },
            3,
            0.3
        );
        graphics.fillStyle(Phaser.Display.Color.GetColor(lighterColor.r, lighterColor.g, lighterColor.b), alpha * 0.9);
        graphics.fillRect(blockX + 1, blockY + 1, blockSize, 2);
        graphics.fillRect(blockX + 1, blockY + 1, 2, blockSize);
        
        // Subtle inner glow for vesicle effect
        graphics.lineStyle(1, color, alpha * 0.3);
        graphics.strokeRect(blockX + 3, blockY + 3, blockSize - 6, blockSize - 6);
        graphics.lineStyle(); // Reset
    }
    
    updateParticleEffects() {
        // Update particle effects based on game state
        const congestionLevel = this.congestion;
        
        if (congestionLevel > 0.3) {
            this.congestionParticles.resume();
            this.congestionParticles.setFrequency(congestionLevel * 200);
        } else {
            this.congestionParticles.pause();
        }
        
        // Adjust neural activity based on speed
        const speedFactor = 1000 / Math.max(this.currentDropDelay, 100);
        this.neuralParticles.setFrequency(80 + (speedFactor * 30));
    }
    
    getGhostPieceY() {
        if (!this.currentPiece) return 0;
        let ghostY = this.currentPiece.y;
        while (!this.checkCollision(this.currentPiece.x, ghostY + 1, this.currentPiece.shape)) {
            ghostY++;
        }
        return ghostY;
    }
    
    togglePause() {
        if (this.gameOver) return;
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            if (this.dropTimer) this.dropTimer.paused = true;
        } else {
            if (this.dropTimer) this.dropTimer.paused = false;
        }
        this.draw();
    }
    
    toggleHelp() {
        this.showHelp = !this.showHelp;
        
        if (this.showHelp) {
            // When opening help, pause the game if it wasn't already paused
            this.wasAlreadyPaused = this.isPaused;
            if (!this.isPaused) {
                this.isPaused = true;
                if (this.dropTimer) this.dropTimer.paused = true;
            }
            // Draw the help overlay
            this.drawHelpOverlay();
        } else {
            // When closing help, clean up help elements and handle pause state
            if (this.helpOverlay) {
                this.helpOverlay.destroy();
                this.helpOverlay = null;
            }
            if (this.helpDisplay) {
                this.helpDisplay.destroy();
                this.helpDisplay = null;
            }
            if (this.helpContainer) {
                this.helpContainer.destroy();
                this.helpContainer = null;
            }
            
            // Only unpause if game wasn't paused before opening help
            if (!this.wasAlreadyPaused) {
                this.isPaused = false;
                if (this.dropTimer) this.dropTimer.paused = false;
            }
        }
        
        this.draw();
    }
    
    createGameAreaBackground() {
        // Create main game area background with neural network pattern
        const gameAreaBg = this.add.graphics();
        
        // Main background with gradient effect
        gameAreaBg.fillGradientStyle(0x0f1419, 0x0f1419, 0x1a1a2e, 0x1a1a2e, 1);
        gameAreaBg.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        // Add subtle grid pattern
        gameAreaBg.lineStyle(1, 0x00bcd4, 0.1);
        for (let x = 0; x <= this.BOARD_WIDTH; x++) {
            gameAreaBg.moveTo(x * this.BLOCK_SIZE, 0);
            gameAreaBg.lineTo(x * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        }
        for (let y = 0; y <= this.BOARD_HEIGHT; y++) {
            gameAreaBg.moveTo(0, y * this.BLOCK_SIZE);
            gameAreaBg.lineTo(this.BOARD_WIDTH * this.BLOCK_SIZE, y * this.BLOCK_SIZE);
        }
        gameAreaBg.strokePath();
        
        // Add neural network pattern overlay
        const neuralBg = this.add.graphics();
        neuralBg.lineStyle(1, 0x00bcd4, 0.2);
        
        // Create neural node connections
        const nodes = [];
        for (let i = 0; i < 12; i++) {
            nodes.push({
                x: (i % 4) * (this.BOARD_WIDTH * this.BLOCK_SIZE / 3) + 40,
                y: Math.floor(i / 4) * (this.BOARD_HEIGHT * this.BLOCK_SIZE / 3) + 50
            });
        }
        
        // Draw connections between nearby nodes
        nodes.forEach((node, i) => {
            nodes.forEach((otherNode, j) => {
                if (i !== j) {
                    const distance = Phaser.Math.Distance.Between(node.x, node.y, otherNode.x, otherNode.y);
                    if (distance < 120) {
                        neuralBg.lineBetween(node.x, node.y, otherNode.x, otherNode.y);
                    }
                }
            });
            
            // Draw node
            neuralBg.fillStyle(0x00bcd4, 0.3);
            neuralBg.fillCircle(node.x, node.y, 3);
        });
        
        // Add subtle animation to the neural network
        this.tweens.add({
            targets: neuralBg,
            alpha: 0.6,
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Add border around game area
        const borderGraphics = this.add.graphics();
        borderGraphics.lineStyle(3, 0x00bcd4, 0.8);
        borderGraphics.strokeRect(-2, -2, this.BOARD_WIDTH * this.BLOCK_SIZE + 4, this.BOARD_HEIGHT * this.BLOCK_SIZE + 4);
        
        // Add corner accents
        const cornerSize = 15;
        borderGraphics.lineStyle(2, 0x8bc34a, 1);
        // Top-left corner
        borderGraphics.moveTo(0, cornerSize);
        borderGraphics.lineTo(0, 0);
        borderGraphics.lineTo(cornerSize, 0);
        // Top-right corner
        borderGraphics.moveTo(this.BOARD_WIDTH * this.BLOCK_SIZE - cornerSize, 0);
        borderGraphics.lineTo(this.BOARD_WIDTH * this.BLOCK_SIZE, 0);
        borderGraphics.lineTo(this.BOARD_WIDTH * this.BLOCK_SIZE, cornerSize);
        // Bottom-left corner
        borderGraphics.moveTo(0, this.BOARD_HEIGHT * this.BLOCK_SIZE - cornerSize);
        borderGraphics.lineTo(0, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        borderGraphics.lineTo(cornerSize, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        // Bottom-right corner
        borderGraphics.moveTo(this.BOARD_WIDTH * this.BLOCK_SIZE - cornerSize, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        borderGraphics.lineTo(this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        borderGraphics.lineTo(this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE - cornerSize);
        borderGraphics.strokePath();
        
        // Set depths to ensure proper layering
        gameAreaBg.setDepth(-100);
        neuralBg.setDepth(-90);
        borderGraphics.setDepth(-80);
    }
    
    drawNextPieces() {
        // Clear any existing next piece graphics
        if (this.nextPieceGraphics) {
            this.nextPieceGraphics.clear();
        }
        
        // Draw the 3 neurotransmitter choices with much larger, cleaner visualization
        if (this.neurotransmitterChoices && this.neurotransmitterChoices.length === 3) {
            for (let i = 0; i < 3; i++) {
                const choice = this.neurotransmitterChoices[i];
                if (!choice) continue;
                
                const { shape, color, name } = choice.shape;
                
                // Position the buttons in the UI panel (updated coordinates for bigger buttons)
                const baseX = 430; // Starting X position (relative to canvas, not UI panel)
                const buttonX = baseX + 120 + (i * 80);
                const buttonY = 130;
                
                // Update button appearance based on selection
                const button = this.choiceButtons[i];
                if (button) {
                    button.graphics.clear();
                    
                    // Enhanced highlight for selected choice
                    const isSelected = (i === this.selectedChoice);
                    const borderColor = isSelected ? 0xffff00 : 0x00bcd4;
                    const bgColor = isSelected ? 0x3a3a4e : 0x1a1a2e;
                    const borderWidth = isSelected ? 4 : 2;
                    const glowAlpha = isSelected ? 0.8 : 0.4;
                    
                    // Main button background
                    button.graphics.fillStyle(bgColor, 0.95);
                    button.graphics.lineStyle(borderWidth, borderColor, 1.0);
                    button.graphics.fillRoundedRect(buttonX, buttonY, 60, 60, 8);
                    button.graphics.strokeRoundedRect(buttonX, buttonY, 60, 60, 8);
                    
                    // Add glow effect for selected button
                    if (isSelected) {
                        button.graphics.lineStyle(2, borderColor, 0.3);
                        button.graphics.strokeRoundedRect(buttonX - 2, buttonY - 2, 64, 64, 10);
                        button.graphics.lineStyle(1, borderColor, 0.2);
                        button.graphics.strokeRoundedRect(buttonX - 4, buttonY - 4, 68, 68, 12);
                    }
                    
                    // Draw piece shape preview with much larger blocks
                    if (shape && shape.length > 0) {
                        const blockSize = 10; // Much bigger blocks for better visibility
                        const shapeWidth = shape[0].length * blockSize;
                        const shapeHeight = shape.length * blockSize;
                        const startX = buttonX + 30 - (shapeWidth / 2);
                        const startY = buttonY + 20 - (shapeHeight / 2);
                        
                        for (let r = 0; r < shape.length; r++) {
                            for (let c = 0; c < shape[r].length; c++) {
                                if (shape[r][c]) {
                                    // Main block
                                    button.graphics.fillStyle(color, 1);
                                    button.graphics.fillRoundedRect(
                                        startX + (c * blockSize),
                                        startY + (r * blockSize),
                                        blockSize - 1,
                                        blockSize - 1,
                                        2
                                    );
                                    
                                    // Add 3D highlight effect
                                    const lighterColor = Phaser.Display.Color.Interpolate.ColorWithColor(
                                        Phaser.Display.Color.ValueToColor(color),
                                        { r: 255, g: 255, b: 255 },
                                        3, 0.3
                                    );
                                    button.graphics.fillStyle(
                                        Phaser.Display.Color.GetColor(lighterColor.r, lighterColor.g, lighterColor.b), 
                                        0.7
                                    );
                                    button.graphics.fillRect(
                                        startX + (c * blockSize),
                                        startY + (r * blockSize),
                                        blockSize - 1,
                                        2
                                    );
                                    button.graphics.fillRect(
                                        startX + (c * blockSize),
                                        startY + (r * blockSize),
                                        2,
                                        blockSize - 1
                                    );
                                }
                            }
                        }
                    }
                    
                    // Show neurotransmitter name below piece with better styling
                    const shortName = name.substring(0, 4).toUpperCase();
                    button.text.setText(shortName);
                    button.text.setPosition(buttonX + 30, buttonY + 45);
                    button.text.setStyle({ 
                        fontSize: '10px',
                        fill: isSelected ? '#ffff00' : '#ffffff',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '600'
                    });
                }
            }
        }
    }
    
    drawPauseOverlay() {
        // Create semi-transparent overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        // Add pause text
        const pauseText = this.add.text(
            (this.BOARD_WIDTH * this.BLOCK_SIZE) / 2, 
            (this.BOARD_HEIGHT * this.BLOCK_SIZE) / 2,
            'PAUSED\n\nPress P or ESC to Resume\nPress H for Help',
            { 
                fontSize: '32px', 
                fill: '#ffffff', 
                align: 'center',
                stroke: '#000000',
                strokeThickness: 2,
                fontFamily: 'Inter, sans-serif',
                fontWeight: '700',
                lineSpacing: 8
            }
        ).setOrigin(0.5);
        
        // Auto-cleanup after redraw
        this.time.delayedCall(50, () => {
            overlay.destroy();
            pauseText.destroy();
        });
    }
    
    drawHelpOverlay() {
        // Clean up any existing help elements first
        if (this.helpOverlay) {
            this.helpOverlay.destroy();
        }
        if (this.helpDisplay) {
            this.helpDisplay.destroy();
        }
        if (this.helpContainer) {
            this.helpContainer.destroy();
        }
        
        // Create semi-transparent overlay that fills entire canvas for perfect alignment
        this.helpOverlay = this.add.graphics();
        this.helpOverlay.fillStyle(0x000020, 0.95);
        this.helpOverlay.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);
        
        // More concise help text that fits better
        const helpText = '🧬 SYNAPTETRIS - NEUROSCIENCE GUIDE 🧬\n\n' +
            '🎮 CONTROLS:\n' +
            '   ← → Arrows: Move  |  ↑ Arrow: Rotate  |  ↓ Arrow: Soft drop\n' +
            '   SPACE: Hard drop  |  P/ESC: Pause  |  H: Toggle help\n' +
            '   S: Toggle sound  |  M: Toggle music  |  1,2,3: Choose neurotransmitter\n\n' +
            
            '🎵 BRAIN STATE MUSIC:\n' +
            '   Music changes with your brain state! Experience how neurotransmitters affect perception:\n' +
            '   • Hyperalert: Fast, high-pitched  •  Drowsy: Slow, low-pitched  •  Balanced: Optimal tempo\n\n' +
            
            '🧪 NEUROTRANSMITTER SYSTEM:\n' +
            '   Choose from 3 options before each piece! Each affects brain chemistry:\n' +
            '   • DOPAMINE: Motivation + pleasure (reward system)\n' +
            '   • SEROTONIN: Happiness + mood stability\n' +
            '   • GABA: Calmness but reduces alertness (inhibitory)\n' +
            '   • GLUTAMATE: Alertness + learning (excitatory)\n' +
            '   • ACETYLCHOLINE: Focus + memory formation\n' +
            '   • NOREPINEPHRINE: Energy + motivation (fight/flight)\n' +
            '   • ENDORPHIN: Pleasure + happiness (natural opioids)\n\n' +
            
            '⚡ LINE CLEAR EFFECTS:\n' +
            '   Clearing lines triggers 5X neurotransmitter surge (like real synaptic firing)!\n' +
            '   Achieve HOMEOSTASIS (all levels 40-60) for bonus points!\n\n' +
            
            '💊 POWER-UPS (Neuropharmacology):\n' +
            '   • Reuptake Inhibitor: Clears random blocks (like antidepressants)\n' +
            '   • Neural Stimulant: Speeds up game (like caffeine)\n' +
            '   • GABA Enhancer: Reduces congestion (like Xanax)\n' +
            '   • Synaptic Plasticity: Reorganizes board (neuroplasticity)\n' +
            '   • Plus many more scientifically accurate drug effects!\n\n' +
            
            '🧠 GAMEPLAY MECHANICS:\n' +
            '   • Brain state dramatically affects speed and scoring multipliers\n' +
            '   • Synaptic congestion slows transmission (affects drop speed)\n' +
            '   • Reuptake failures create stuck "gray" blocks\n' +
            '   • Maintain chemical balance for optimal performance!\n\n' +
            
            '💡 PRO TIPS:\n' +
            '   • Neurotransmitter bars keep consistent colors - learn them!\n' +
            '   • Use GABA when overwhelmed, Glutamate when you need focus\n' +
            '   • Balanced brain state = optimal speed and scoring\n\n' +
            
            'Press H again to close and return to the game!';

        // Create help text and position it to fill the entire canvas area efficiently
        this.helpDisplay = this.add.text(
            this.sys.game.config.width / 2,  // Center within the full canvas
            25,                              // Start from near the top
            helpText,
            {
                fontSize: '12px',  // Start with smaller font size
                fill: '#ffffff',
                align: 'left',
                backgroundColor: 'rgba(0, 20, 40, 0.9)',
                padding: { x: 30, y: 15 },
                wordWrap: { width: 950 }, // Maximum text wrapping to use nearly full canvas width
                fontFamily: 'Inter, sans-serif',
                fontWeight: '400',
                lineSpacing: 1  // Tight line spacing to fit within canvas height
            }
        ).setOrigin(0.5, 0);  // Set origin to top-center so text flows downward
        
        // Ensure text fits within the canvas bounds
        const textBounds = this.helpDisplay.getBounds();
        if (textBounds.height > this.sys.game.config.height - 50) {
            // Further reduce font size and adjust formatting to fit canvas height
            this.helpDisplay.setStyle({ 
                fontSize: '11px', 
                lineSpacing: 0,
                padding: { x: 25, y: 12 },
                wordWrap: { width: 970 } // Maximum width to use nearly the full canvas
            });
        }
        
        // Set depth to ensure it's always on top
        this.helpOverlay.setDepth(1000);
        this.helpDisplay.setDepth(1001);
    }

    // --- The rest of the game logic calls this.draw() whenever a change occurs. ---
    movePiece(dx, dy) { if (!this.currentPiece) return false; if (!this.checkCollision(this.currentPiece.x + dx, this.currentPiece.y + dy, this.currentPiece.shape)) { this.currentPiece.x += dx; this.currentPiece.y += dy; this.draw(); return true; } return false; }
    rotatePiece() { if (!this.currentPiece || this.currentPiece.isPowerUp) return; const shape = this.currentPiece.shape; const newShape = []; for (let y = 0; y < shape[0].length; y++) { newShape[y] = []; for (let x = 0; x < shape.length; x++) { newShape[y][x] = shape[shape.length - 1 - x][y]; } } let didRotate = false; if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y, newShape)) { this.currentPiece.shape = newShape; didRotate = true; } else if (!this.checkCollision(this.currentPiece.x + 1, this.currentPiece.y, newShape)) { this.currentPiece.x++; this.currentPiece.shape = newShape; didRotate = true; } else if (!this.checkCollision(this.currentPiece.x - 1, this.currentPiece.y, newShape)) { this.currentPiece.x--; this.currentPiece.shape = newShape; didRotate = true; } if (didRotate) { this.soundGenerator.play('rotate'); } this.draw(); }
    hardDrop() { if (!this.currentPiece) return; while (this.movePiece(0, 1)) {} this.lockPiece(); }
    drop() { if (!this.currentPiece) return; if (!this.movePiece(0, 1)) { this.lockPiece(); } }
    lockPiece() { 
        this.soundGenerator.play('lock'); 
        const { x, y, shape, color } = this.currentPiece; 
        
        if (this.currentPiece.isPowerUp) { 
            this.activatePowerUp(this.currentPiece.effect, this.currentPiece.name); 
        } else { 
            // Update current neurotransmitter type
            const matchingShape = this.shapes.find(s => s.color === color);
            if (matchingShape) {
                this.currentNeurotransmitter = matchingShape.name;
            }
            
            for (let row = 0; row < shape.length; row++) { 
                for (let col = 0; col < shape[row].length; col++) { 
                    if (shape[row][col] && y + row >= 0) { 
                        this.board[y + row][x + col] = color;
                        
                        // Add landing effect for each block
                        this.createLandingEffect(x + col, y + row, color);
                    } 
                } 
            } 
        } 
        
        this.clearLines(); 
        this.calculateCongestion(); 
        this.updateDropTimer(); 
        
        // Generate new choices and wait for player selection
        this.generateNeurotransmitterChoices();
        this.waitingForChoice = true;
        
        this.draw(); 
    }
    
    createLandingEffect(x, y, color) {
        // Create a brief flash effect when vesicle "docks"
        const blockX = x * this.BLOCK_SIZE + this.BLOCK_SIZE / 2;
        const blockY = y * this.BLOCK_SIZE + this.BLOCK_SIZE / 2;
        
        // Ripple effect
        const ripple = this.add.graphics();
        ripple.lineStyle(2, color, 1);
        ripple.strokeCircle(blockX, blockY, 5);
        
        this.tweens.add({
            targets: ripple,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => ripple.destroy()
        });
        
        // Spark particles
        const sparkEmitter = this.add.particles(blockX, blockY, 'neural_particle', {
            speed: { min: 20, max: 40 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 200,
            quantity: 3,
            tint: color
        });
        
        this.time.delayedCall(200, () => sparkEmitter.destroy());
    }
    checkCollision(x, y, shape) { for (let row = 0; row < shape.length; row++) { for (let col = 0; col < shape[row].length; col++) { if (shape[row][col]) { const newX = x + col, newY = y + row; if (newX < 0 || newX >= this.BOARD_WIDTH || newY >= this.BOARD_HEIGHT) return true; if (newY >= 0 && this.board[newY] && this.board[newY][newX]) return true; } } } return false; }
    spawnNewPiece() { 
        // Use the player-selected neurotransmitter piece
        if (this.nextPiece && this.nextPiece.neurotransmitter) {
            this.currentPiece = this.nextPiece;
            this.currentNeurotransmitter = this.nextPiece.neurotransmitter;
            // Apply base neurotransmitter effects (not surge)
            this.applyNeurotransmitterEffects(this.currentNeurotransmitter, false);
        } else {
            // This should not happen anymore since we always wait for choice
            console.warn("No neurotransmitter piece selected - this shouldn't happen!");
            this.currentPiece = this.getRandomPiece();
            this.currentNeurotransmitter = 'Mixed';
        }
        
        // Clear the next piece - player must select new one
        this.nextPiece = null; 
        
        this.currentPiece.x = Math.floor(this.BOARD_WIDTH / 2) - 1; 
        this.currentPiece.y = 0; 
        
        // Start the drop timer for the new piece
        this.updateDropTimer();
        
        if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) { 
            this.gameOver = true; 
            this.dropTimer.remove(); 
            this.soundGenerator.play('gameover'); 
            this.cameras.main.fade(1000, 30, 0, 0, false, (cam, progress) => { 
                if (progress === 1) { 
                    this.scene.start('GameOverScene', { score: this.score, lines: this.lines }); 
                } 
            }); 
        } 
    }
    getRandomPiece() { 
        if (Math.random() < 0.12 && this.lines > 2) {
            // Select random power-up
            const powerUp = Phaser.Utils.Array.GetRandom(this.powerUps);
            return { ...powerUp };
        }
        const piece = Phaser.Utils.Array.GetRandom(this.shapes); 
        return { 
            shape: piece.shape, 
            color: piece.color, 
            name: piece.name,
            gradient: piece.gradient,
            x: 0, 
            y: 0, 
            isPowerUp: false 
        }; 
    }
    clearLines() { 
        let linesCleared = 0; 
        const clearedRows = [];
        
        for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) { 
            if (this.board[y].every(cell => cell > 0)) { 
                linesCleared++; 
                clearedRows.push(y);
                this.board.splice(y, 1); 
                this.board.unshift(Array(this.BOARD_WIDTH).fill(0)); 
                y++; 
            } 
        } 
        
        if (linesCleared > 0) { 
            this.lines += linesCleared; 
            let scoreBonus = linesCleared * 100 * linesCleared;
            
            // BRAIN STATE EFFECTS ON SCORING - Make mood states significantly impact points
            const { happiness, calmness, alertness, motivation, focus, pleasure } = this.moodState;
            let brainStateScoreMultiplier = 1.0;
            let brainStateBonus = '';
            
            if (this.isBalanced()) {
                brainStateScoreMultiplier = 1.5; // 50% bonus when balanced
                brainStateBonus = 'BALANCED BRAIN BONUS!';
            } else if (motivation > 80) {
                brainStateScoreMultiplier = 1.4; // 40% bonus when highly motivated
                brainStateBonus = 'MOTIVATION BONUS!';
            } else if (focus > 80) {
                brainStateScoreMultiplier = 1.3; // 30% bonus with tunnel vision
                brainStateBonus = 'FOCUS BONUS!';
            } else if (pleasure > 80) {
                brainStateScoreMultiplier = 1.2; // 20% bonus when euphoric
                brainStateBonus = 'EUPHORIA BONUS!';
            } else if (alertness > 80) {
                brainStateScoreMultiplier = 1.25; // 25% bonus when hyperalert
                brainStateBonus = 'HYPERALERT BONUS!';
            } else if (happiness < 30) {
                brainStateScoreMultiplier = 0.7; // 30% penalty when melancholic
                brainStateBonus = 'MELANCHOLY PENALTY';
            } else if (alertness < 30) {
                brainStateScoreMultiplier = 0.8; // 20% penalty when drowsy
                brainStateBonus = 'DROWSINESS PENALTY';
            } else if (calmness > 80) {
                brainStateScoreMultiplier = 0.9; // 10% penalty when too sedated
                brainStateBonus = 'SEDATION PENALTY';
            }
            
            scoreBonus = Math.round(scoreBonus * brainStateScoreMultiplier);
            
            // Show brain state effect on scoring
            if (brainStateBonus && brainStateScoreMultiplier !== 1.0) {
                const bonusColor = brainStateScoreMultiplier > 1.0 ? '#00ff00' : '#ff6600';
                this.showFloatingText(brainStateBonus, bonusColor);
            }
            
            // Apply memory enhancement bonus
            if (this.memoryEnhanced && this.memoryBoostCount > 0) {
                scoreBonus *= 2; // Double points for memory-enhanced line clears
                this.memoryBoostCount--;
                this.showFloatingText('MEMORY BONUS! x2 POINTS!', '#ffc107');
                
                if (this.memoryBoostCount <= 0) {
                    this.memoryEnhanced = false;
                }
            }
            
            // NEUROTRANSMITTER SURGE - Apply massive effects when line is cleared
            if (this.currentNeurotransmitter && this.currentNeurotransmitter !== 'Mixed') {
                this.applyNeurotransmitterEffects(this.currentNeurotransmitter, true);
                scoreBonus += this.homeostasisBonus; // Add homeostasis bonus to score
                this.homeostasisBonus = 0; // Reset bonus after use
            }
            
            this.score += scoreBonus;
            this.soundGenerator.play('clear'); 
            this.showActivationMessage(); 
            this.showLineClearEffect(clearedRows, linesCleared);
            
            // Generate new neurotransmitter choices for next piece
            this.generateNeurotransmitterChoices();
            this.waitingForChoice = true; // Wait for player to choose
            
            // Reduce reuptake failure chance if blood-brain barrier is active
            const failureChance = this.brainBarrierActive ? 0.1 : 0.25;
            if (Math.random() < failureChance) { 
                this.reuptakeFailure(); 
            } 
        } 
    }
    activatePowerUp(effect, name) { 
        this.soundGenerator.play('powerup'); 
        this.showFloatingText(name + '!', '#ffffff'); 
        
        // Create dramatic screen-wide effect
        const powerUpGraphics = this.add.graphics();
        
        switch(effect) {
            case 'clearRandom':
                this.executeReuptakeInhibitor(powerUpGraphics);
                break;
            case 'speedBoost':
                this.executeNeuralStimulant(powerUpGraphics);
                break;
            case 'calmSystem':
                this.executeGABAEnhancer(powerUpGraphics);
                break;
            case 'reorganize':
                this.executeSynapticPlasticity(powerUpGraphics);
                break;
            case 'bonusPoints':
                this.executeNeurotrophicFactor(powerUpGraphics);
                break;
            case 'slowDown':
                this.executeCalciumBlocker(powerUpGraphics);
                break;
            case 'clearColumns':
                this.executeMyelinBooster(powerUpGraphics);
                break;
            case 'clearBottom':
                this.executeAstrocyteSupport(powerUpGraphics);
                break;
            case 'clearDamaged':
                this.executeMicrogliaActivation(powerUpGraphics);
                break;
            case 'protection':
                this.executeBloodBrainBarrier(powerUpGraphics);
                break;
            case 'enhanceMemory':
                this.executeCholinesteraseInhibitor(powerUpGraphics);
                break;
            case 'modulateGlutamate':
                this.executeNMDAModulator(powerUpGraphics);
                break;
            case 'increaseAlertness':
                this.executeAdenosineAntagonist(powerUpGraphics);
                break;
            case 'preserveMonoamines':
                this.executeMAOInhibitor(powerUpGraphics);
                break;
            default:
                this.executeReuptakeInhibitor(powerUpGraphics);
        }
    }
    
    executeReuptakeInhibitor(graphics) {
        graphics.fillStyle(0xffffff, 0.3);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => graphics.destroy()
        });
        
        const filledCells = []; 
        for (let y = 0; y < this.BOARD_HEIGHT; y++) { 
            for (let x = 0; x < this.BOARD_WIDTH; x++) { 
                if (this.board[y][x]) filledCells.push({x, y}); 
            } 
        } 
        
        Phaser.Utils.Array.Shuffle(filledCells); 
        const cellsToRemove = Math.min(6, filledCells.length);
        
        for(let i = 0; i < cellsToRemove; i++) { 
            const cell = filledCells[i]; 
            const cellColor = this.board[cell.y][cell.x];
            this.board[cell.y][cell.x] = 0;
            this.createPowerUpExplosion(cell.x, cell.y, cellColor, i);
        }
    }
    
    executeNeuralStimulant(graphics) {
        graphics.fillStyle(0xff1744, 0.3);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => graphics.destroy()
        });
        
        // Temporarily boost speed for 10 seconds
        this.speedBoostActive = true;
        this.time.delayedCall(10000, () => {
            this.speedBoostActive = false;
            this.updateDropTimer();
        });
        
        this.showFloatingText('NEURAL ACCELERATION!', '#ff1744');
    }
    
    executeGABAEnhancer(graphics) {
        graphics.fillStyle(0x4caf50, 0.3);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => graphics.destroy()
        });
        
        // Calm the system - reduce congestion effect temporarily
        this.gabaActive = true;
        this.time.delayedCall(8000, () => {
            this.gabaActive = false;
        });
        
        this.showFloatingText('NEURAL CALMING!', '#4caf50');
    }
    
    executeSynapticPlasticity(graphics) {
        graphics.fillStyle(0x9c27b0, 0.4);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => graphics.destroy()
        });
        
        // Reorganize bottom 3 rows to be more efficient
        for (let y = this.BOARD_HEIGHT - 3; y < this.BOARD_HEIGHT; y++) {
            if (y >= 0) {
                const filledCells = [];
                const emptyCells = [];
                
                for (let x = 0; x < this.BOARD_WIDTH; x++) {
                    if (this.board[y][x]) {
                        filledCells.push(this.board[y][x]);
                    }
                    this.board[y][x] = 0;
                }
                
                // Redistribute cells more efficiently
                Phaser.Utils.Array.Shuffle(filledCells);
                for (let i = 0; i < filledCells.length && i < this.BOARD_WIDTH; i++) {
                    this.board[y][i] = filledCells[i];
                }
            }
        }
        
        this.showFloatingText('SYNAPTIC REORGANIZATION!', '#9c27b0');
    }
    
    executeNeurotrophicFactor(graphics) {
        graphics.fillStyle(0xff9800, 0.3);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => graphics.destroy()
        });
        
        // Award bonus points based on current connections
        let connections = 0;
        for (let y = 0; y < this.BOARD_HEIGHT - 1; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x] && this.board[y + 1][x]) {
                    connections++;
                }
            }
        }
        
        const bonusPoints = connections * 50;
        this.score += bonusPoints;
        this.showFloatingText(`+${bonusPoints} GROWTH BONUS!`, '#ff9800');
    }
    
    executeCalciumBlocker(graphics) {
        graphics.fillStyle(0x00e676, 0.3);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => graphics.destroy()
        });
        
        // Slow down piece falling for 15 seconds
        this.calciumBlockActive = true;
        this.time.delayedCall(15000, () => {
            this.calciumBlockActive = false;
            this.updateDropTimer();
        });
        
        this.showFloatingText('CALCIUM CHANNELS BLOCKED!', '#00e676');
    }
    
    executeMyelinBooster(graphics) {
        graphics.fillStyle(0x2196f3, 0.4);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => graphics.destroy()
        });
        
        // Clear 2 random columns completely
        const columnsToTreat = [];
        while (columnsToTreat.length < 2) {
            const col = Phaser.Math.Between(0, this.BOARD_WIDTH - 1);
            if (!columnsToTreat.includes(col)) {
                columnsToTreat.push(col);
            }
        }
        
        columnsToTreat.forEach((col, index) => {
            for (let row = 0; row < this.BOARD_HEIGHT; row++) {
                if (this.board[row][col]) {
                    const cellColor = this.board[row][col];
                    this.board[row][col] = 0;
                    this.createPowerUpExplosion(col, row, cellColor, index * 2);
                }
            }
        });
        
        this.showFloatingText('MYELIN PATHWAYS ENHANCED!', '#2196f3');
    }
    
    executeAstrocyteSupport(graphics) {
        graphics.fillStyle(0xe91e63, 0.3);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => graphics.destroy()
        });
        
        // Clear bottom row if it has blocks
        const bottomRow = this.BOARD_HEIGHT - 1;
        let clearedBlocks = 0;
        for (let x = 0; x < this.BOARD_WIDTH; x++) {
            if (this.board[bottomRow][x]) {
                const cellColor = this.board[bottomRow][x];
                this.board[bottomRow][x] = 0;
                this.createPowerUpExplosion(x, bottomRow, cellColor, clearedBlocks);
                clearedBlocks++;
            }
        }
        
        this.showFloatingText('ASTROCYTE CLEANUP!', '#e91e63');
    }
    
    executeMicrogliaActivation(graphics) {
        graphics.fillStyle(0x795548, 0.3);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 900,
            ease: 'Power2',
            onComplete: () => graphics.destroy()
        });
        
        // Clear all gray "damaged" blocks (reuptake failures)
        let clearedCount = 0;
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x] === 0x888888) { // Gray blocks from reuptake failure
                    this.board[y][x] = 0;
                    this.createPowerUpExplosion(x, y, 0x888888, clearedCount);
                    clearedCount++;
                }
            }
        }
        
        if (clearedCount > 0) {
            this.showFloatingText(`MICROGLIA CLEARED ${clearedCount} DAMAGED!`, '#795548');
        } else {
            this.showFloatingText('MICROGLIA PATROL ACTIVE!', '#795548');
        }
    }
    
    executeBloodBrainBarrier(graphics) {
        graphics.fillStyle(0x607d8b, 0.3);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => graphics.destroy()
        });
        
        // Protect against reuptake failures for 30 seconds
        this.brainBarrierActive = true;
        this.time.delayedCall(30000, () => {
            this.brainBarrierActive = false;
        });
        
        this.showFloatingText('BLOOD-BRAIN BARRIER PROTECTED!', '#607d8b');
    }
    
    executeCholinesteraseInhibitor(graphics) {
        graphics.fillStyle(0xffc107, 0.4);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        // Create memory enhancement visual effect
        for (let i = 0; i < 20; i++) {
            const memoryParticle = this.add.graphics();
            memoryParticle.fillStyle(0xffc107, 0.8);
            memoryParticle.fillCircle(0, 0, 3);
            memoryParticle.x = Phaser.Math.Between(0, this.BOARD_WIDTH * this.BLOCK_SIZE);
            memoryParticle.y = Phaser.Math.Between(0, this.BOARD_HEIGHT * this.BLOCK_SIZE);
            
            this.tweens.add({
                targets: memoryParticle,
                scaleX: 3,
                scaleY: 3,
                alpha: 0,
                duration: 1500,
                delay: i * 50,
                ease: 'Power2',
                onComplete: () => memoryParticle.destroy()
            });
        }
        
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => graphics.destroy()
        });
        
        // Enhance memory pathways - bonus score for next few line clears
        this.memoryEnhanced = true;
        this.memoryBoostCount = 5;
        this.showFloatingText('MEMORY PATHWAYS ENHANCED!', '#ffc107');
    }
    
    executeNMDAModulator(graphics) {
        graphics.fillStyle(0x3f51b5, 0.4);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        // Create glutamate regulation pattern
        const waveGraphics = this.add.graphics();
        waveGraphics.lineStyle(4, 0x3f51b5, 0.8);
        
        for (let y = 0; y < this.BOARD_HEIGHT; y += 4) {
            waveGraphics.moveTo(0, y * this.BLOCK_SIZE);
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                const waveY = y * this.BLOCK_SIZE + Math.sin(x * 0.5) * 10;
                waveGraphics.lineTo(x * this.BLOCK_SIZE, waveY);
            }
        }
        
        this.tweens.add({
            targets: [graphics, waveGraphics],
            alpha: 0,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => {
                graphics.destroy();
                waveGraphics.destroy();
            }
        });
        
        // Modulate glutamate signaling - clear vesicles of glutamate (red) type
        let clearedCount = 0;
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x] === 0xff4444) { // Glutamate color
                    this.board[y][x] = 0;
                    this.createPowerUpExplosion(x, y, 0xff4444, clearedCount);
                    clearedCount++;
                }
            }
        }
        
        this.showFloatingText(`GLUTAMATE MODULATED: ${clearedCount} CLEARED!`, '#3f51b5');
    }
    
    executeAdenosineAntagonist(graphics) {
        graphics.fillStyle(0x8bc34a, 0.4);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        // Create alertness burst effect
        const alertnessEmitter = this.add.particles(
            this.BOARD_WIDTH * this.BLOCK_SIZE / 2, 
            this.BOARD_HEIGHT * this.BLOCK_SIZE / 2, 
            'neural_particle', 
            {
                speed: { min: 100, max: 200 },
                scale: { start: 2, end: 0 },
                alpha: { start: 1, end: 0 },
                lifespan: 800,
                quantity: 30,
                tint: 0x8bc34a,
                blendMode: 'ADD'
            }
        );
        
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                graphics.destroy();
                alertnessEmitter.destroy();
            }
        });
        
        // Increase alertness - temporarily reduce drop delay significantly
        this.alertnessBoostActive = true;
        this.time.delayedCall(15000, () => {
            this.alertnessBoostActive = false;
            this.updateDropTimer();
        });
        
        this.showFloatingText('ADENOSINE BLOCKED! MAXIMUM ALERTNESS!', '#8bc34a');
    }
    
    executeMAOInhibitor(graphics) {
        graphics.fillStyle(0xff5722, 0.4);
        graphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        // Create monoamine preservation visual
        const preservationEffect = this.add.graphics();
        preservationEffect.lineStyle(3, 0xff5722, 0.8);
        
        // Draw connecting lines between blocks of monoamine colors
        const monoamineColors = [0x00bcd4, 0xffeb3b, 0x9c27b0]; // Dopamine, Serotonin, Norepinephrine
        for (let color of monoamineColors) {
            const blocks = [];
            for (let y = 0; y < this.BOARD_HEIGHT; y++) {
                for (let x = 0; x < this.BOARD_WIDTH; x++) {
                    if (this.board[y][x] === color) {
                        blocks.push({ x: x * this.BLOCK_SIZE + this.BLOCK_SIZE/2, y: y * this.BLOCK_SIZE + this.BLOCK_SIZE/2 });
                    }
                }
            }
            
            // Connect nearby blocks with lines
            for (let i = 0; i < blocks.length - 1; i++) {
                for (let j = i + 1; j < blocks.length; j++) {
                    const dist = Phaser.Math.Distance.Between(blocks[i].x, blocks[i].y, blocks[j].x, blocks[j].y);
                    if (dist < 80) {
                        preservationEffect.lineBetween(blocks[i].x, blocks[i].y, blocks[j].x, blocks[j].y);
                    }
                }
            }
        }
        
        this.tweens.add({
            targets: [graphics, preservationEffect],
            alpha: 0,
            duration: 1400,
            ease: 'Power2',
            onComplete: () => {
                graphics.destroy();
                preservationEffect.destroy();
            }
        });
        
        // Preserve monoamines - give bonus points and slow degradation
        this.monoaminePreserved = true;
        this.time.delayedCall(20000, () => {
            this.monoaminePreserved = false;
        });
        
        this.score += 500; // Immediate bonus for preservation
        this.showFloatingText('MONOAMINES PRESERVED! +500 POINTS!', '#ff5722');
    }
    
    createPowerUpExplosion(x, y, color, delay) {
        const explosionX = x * this.BLOCK_SIZE + this.BLOCK_SIZE / 2;
        const explosionY = y * this.BLOCK_SIZE + this.BLOCK_SIZE / 2;
        
        const explosionEmitter = this.add.particles(explosionX, explosionY, 'neural_particle', {
            speed: { min: 40, max: 80 },
            scale: { start: 1.5, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 600,
            quantity: 8,
            tint: color,
            blendMode: 'ADD'
        });
        
        this.time.delayedCall(600, () => explosionEmitter.destroy());
        
        const shockwave = this.add.graphics();
        shockwave.lineStyle(3, 0xffffff, 1);
        shockwave.strokeCircle(explosionX, explosionY, 5);
        
        this.tweens.add({
            targets: shockwave,
            scaleX: 4,
            scaleY: 4,
            alpha: 0,
            duration: 400,
            delay: delay * 100,
            ease: 'Power2',
            onComplete: () => shockwave.destroy()
        });
    }
    reuptakeFailure() { this.soundGenerator.play('reuptake_fail'); this.showFloatingText('Reuptake Failure!', '#ff5555'); for (let y = this.BOARD_HEIGHT - 1; y >= this.BOARD_HEIGHT - 5; y--) { const emptyCols = []; for (let x = 0; x < this.BOARD_WIDTH; x++) { if (this.board[y][x] === 0) emptyCols.push(x); } if (emptyCols.length > 0) { const randomX = Phaser.Utils.Array.GetRandom(emptyCols); this.board[y][randomX] = 0x888888; return; } } }
    showFloatingText(text, color = '#ffffff') {
        // Calculate the y position to stack messages vertically
        const baseY = this.BOARD_HEIGHT * this.BLOCK_SIZE / 2;
        const spacing = 35; // Vertical spacing between messages
        const yOffset = this.activeFloatingTexts.length * spacing;
        
        const floatingText = this.add.text(
            this.BOARD_WIDTH * this.BLOCK_SIZE / 2,
            baseY + yOffset,
            text,
            {
                fontSize: '22px',
                fill: color,
                fontFamily: 'Inter, sans-serif',
                fontWeight: '700',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        // Add to active texts list
        this.activeFloatingTexts.push(floatingText);
        
        // Animate the floating text
        this.tweens.add({
            targets: floatingText,
            y: floatingText.y - 100,
            alpha: 0,
            scale: 1.2,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                floatingText.destroy();
                // Remove from active texts list
                const index = this.activeFloatingTexts.indexOf(floatingText);
                if (index > -1) {
                    this.activeFloatingTexts.splice(index, 1);
                }
            }
        });
    }
    
    showLineClearEffect(clearedRows, count) {
        // Create signal propagation effect for cleared lines
        clearedRows.forEach((row, index) => {
            // Lightning-like signal propagation
            const signalGraphics = this.add.graphics();
            signalGraphics.lineStyle(3, 0x00ffff, 1);
            
            // Draw zigzag signal across the row
            const startX = 0;
            const endX = this.BOARD_WIDTH * this.BLOCK_SIZE;
            const y = row * this.BLOCK_SIZE + this.BLOCK_SIZE / 2;
            
            signalGraphics.moveTo(startX, y);
            for (let x = 0; x < endX; x += 20) {
                const offsetY = (Math.random() - 0.5) * 8;
                signalGraphics.lineTo(x, y + offsetY);
            }
            signalGraphics.lineTo(endX, y);
            
            // Animate the signal
            signalGraphics.setAlpha(0);
            this.tweens.add({
                targets: signalGraphics,
                alpha: 1,
                duration: 100,
                delay: index * 50,
                yoyo: true,
                repeat: 2,
                onComplete: () => signalGraphics.destroy()
            });
            
            // Create intense flash effect
            const flashGraphics = this.add.graphics();
            flashGraphics.fillStyle(0xffffff, 0.9);
            flashGraphics.fillRect(0, row * this.BLOCK_SIZE, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BLOCK_SIZE);
            
            // Flash animation with color transitions
            this.tweens.add({
                targets: flashGraphics,
                alpha: 0,
                duration: 400,
                delay: index * 30,
                ease: 'Power3',
                onComplete: () => flashGraphics.destroy()
            });
            
            // Neural activation particles along the line
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                const particleX = x * this.BLOCK_SIZE + this.BLOCK_SIZE / 2;
                const particleY = row * this.BLOCK_SIZE + this.BLOCK_SIZE / 2;
                
                const burstEmitter = this.add.particles(particleX, particleY, 'neural_particle', {
                    speed: { min: 30, max: 60 },
                    scale: { start: 1.2, end: 0 },
                    alpha: { start: 1, end: 0 },
                    lifespan: 500,
                    quantity: 4,
                    tint: [0x00ffff, 0xffffff, 0x00ff00],
                    blendMode: 'ADD'
                });
                
                this.time.delayedCall(500, () => burstEmitter.destroy());
            }
        });
        
        // Show combo text for multiple lines with enhanced effects
        if (count > 1) {
            const comboText = count === 4 ? 'NEURAL TETRIS!' : `${count} SIGNALS!`;
            const comboColor = count === 4 ? '#ff00ff' : '#00ff00';
            
            const comboDisplay = this.add.text(
                this.BOARD_WIDTH * this.BLOCK_SIZE / 2, 
                100, 
                comboText,
                { 
                    fontSize: count === 4 ? '32px' : '24px', 
                    fill: comboColor, 
                    align: 'center',
                    stroke: '#000000',
                    strokeThickness: 3,
                    fontFamily: 'Orbitron, monospace',
                    fontWeight: '900'
                }
            ).setOrigin(0.5);
            
            // Spectacular combo animation
            comboDisplay.setScale(0);
            this.tweens.add({
                targets: comboDisplay,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 200,
                ease: 'Back.easeOut'
            });
            
            this.tweens.add({
                targets: comboDisplay,
                alpha: 0,
                y: '-=50',
                scaleX: 0.8,
                scaleY: 0.8,
                duration: 2000,
                delay: 500,
                ease: 'Power2',
                onComplete: () => comboDisplay.destroy()
            });
        }
    }
    showActivationMessage() { this.showFloatingText('Receptors Activated!', '#ffff00'); }
    calculateCongestion() { 
        let h = this.BOARD_HEIGHT, e = 0, t = 0; 
        for (let y = 0; y < this.BOARD_HEIGHT; y++) { 
            if (this.board[y].some(c => c > 0)) { 
                h = y; 
                break; 
            } 
        } 
        
        if (h === this.BOARD_HEIGHT) { 
            this.congestion = 0; 
            return; 
        } 
        
        for (let y = h; y < this.BOARD_HEIGHT; y++) { 
            for (let x = 0; x < this.BOARD_WIDTH; x++) { 
                if (this.board[y][x] === 0) e++; 
                t++; 
            } 
        } 
        
        const oldCongestion = this.congestion;
        this.congestion = t > 0 ? e / t : 0; 
        
        // Show congestion warning if it increases significantly
        if (this.congestion > 0.6 && oldCongestion <= 0.6) {
            this.showCongestionWarning();
        }
    }
    
    showCongestionWarning() {
        // Create red overlay effect for high congestion
        const warningGraphics = this.add.graphics();
        warningGraphics.fillStyle(0xff0000, 0.2);
        warningGraphics.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        // Pulsing warning
        this.tweens.add({
            targets: warningGraphics,
            alpha: 0,
            duration: 1000,
            yoyo: true,
            repeat: 2,
            onComplete: () => warningGraphics.destroy()
        });
        
        // Warning text
        this.showFloatingText('SYNAPTIC CONGESTION!', '#ff0000');
    }
    updateDropTimer() { 
        let c = this.congestion * 1500;
        const e = this.lines * 10; 
        
        // Apply power-up effects
        if (this.speedBoostActive) {
            c *= 0.3; // Reduce congestion effect during speed boost
        }
        if (this.gabaActive) {
            c *= 0.5; // GABA reduces congestion effect
        }
        if (this.alertnessBoostActive) {
            c *= 0.1; // Adenosine antagonist provides extreme alertness
        }
        
        // MAJOR BRAIN STATE EFFECTS - Make mood states significantly impact gameplay
        const { happiness, calmness, alertness, motivation, focus, pleasure } = this.moodState;
        let brainStateMultiplier = 1.0;
        let brainStateText = '';
        
        if (this.isBalanced()) {
            brainStateMultiplier = 0.8; // 20% faster when balanced
            brainStateText = ' 🧠BALANCED';
        } else if (alertness > 80) {
            brainStateMultiplier = 0.4; // VERY fast when hyperalert
            brainStateText = ' ⚡HYPERALERT';
        } else if (alertness < 30) {
            brainStateMultiplier = 2.5; // VERY slow when drowsy
            brainStateText = ' 😵DROWSY';
        } else if (calmness > 80) {
            brainStateMultiplier = 1.8; // Slow when too calm/sedated
            brainStateText = ' 😴SEDATED';
        } else if (calmness < 30) {
            brainStateMultiplier = 0.7; // Faster when anxious (jittery)
            brainStateText = ' 😰ANXIOUS';
        } else if (motivation > 80) {
            brainStateMultiplier = 0.6; // Fast when highly motivated
            brainStateText = ' 🔥MOTIVATED';
        } else if (focus > 80) {
            brainStateMultiplier = 0.7; // Faster with tunnel vision
            brainStateText = ' 🎯FOCUSED';
        } else if (pleasure > 80) {
            brainStateMultiplier = 0.9; // Slightly faster when euphoric
            brainStateText = ' 😍EUPHORIC';
        } else if (happiness < 30) {
            brainStateMultiplier = 1.4; // Slower when melancholic
            brainStateText = ' 😔MELANCHOLIC';
        } else {
            brainStateMultiplier = 1.2; // Slightly slower with chemical imbalance
            brainStateText = ' 🧪IMBALANCED';
        }
        
        this.currentDropDelay = Math.max(100, (this.baseDropDelay + c - e) * brainStateMultiplier); 
        
        // Update speed display with brain state info
        let speedText = 'Speed: ';
        if (this.currentDropDelay < 300) speedText += 'Very Fast';
        else if (this.currentDropDelay < 500) speedText += 'Fast';
        else if (this.currentDropDelay < 800) speedText += 'Normal';
        else speedText += 'Slow';
        
        // Add power-up indicators
        if (this.speedBoostActive) speedText += ' ⚡';
        if (this.gabaActive) speedText += ' 🧘';
        if (this.alertnessBoostActive) speedText += ' 🔥';
        if (this.memoryEnhanced) speedText += ' 🧠';
        if (this.monoaminePreserved) speedText += ' 💊';
        
        // Add brain state indicator
        speedText += brainStateText;
        
        if (this.speedText) {
            this.speedText.setText(speedText);
            this.speedText.setColor(this.currentDropDelay < 400 ? '#00ff00' : this.currentDropDelay > 800 ? '#ff5555' : '#e0e0e0');
        }
        
        if (this.dropTimer) this.dropTimer.remove(); 
        
        // Only start drop timer if there's a current piece
        if (this.currentPiece) {
            this.dropTimer = this.time.addEvent({ 
                delay: this.currentDropDelay, 
                callback: this.drop, 
                callbackScope: this, 
                loop: true 
            });
        } 
    }
    
    // Neurotransmitter & Mood Management System
    generateNeurotransmitterChoices() {
        // Generate 3 strategic choices based on current mood state
        const ntTypes = [
            { name: 'dopamine', shape: this.shapes[0], effects: { motivation: 3, pleasure: 2 } },
            { name: 'serotonin', shape: this.shapes[1], effects: { happiness: 4, calmness: 1 } },
            { name: 'gaba', shape: this.shapes[2], effects: { calmness: 4, alertness: -2 } },
            { name: 'glutamate', shape: this.shapes[3], effects: { alertness: 3, learning: 2 } },
            { name: 'acetylcholine', shape: this.shapes[4], effects: { focus: 3, learning: 2 } },
            { name: 'norepinephrine', shape: this.shapes[5], effects: { alertness: 4, motivation: 2 } },
            { name: 'endorphin', shape: this.shapes[6], effects: { pleasure: 4, happiness: 2 } }
        ];
        
        // Smart choice generation: always include one that helps balance
        this.neurotransmitterChoices = [];
        
        // Add a balancing choice (find what's most needed)
        const needsBalancing = this.findMostNeededNeurotransmitter();
        this.neurotransmitterChoices.push(ntTypes.find(nt => nt.name === needsBalancing));
        
        // Add two random choices
        const remaining = ntTypes.filter(nt => nt.name !== needsBalancing);
        for (let i = 0; i < 2; i++) {
            const randomChoice = Phaser.Utils.Array.RemoveRandomElement(remaining);
            this.neurotransmitterChoices.push(randomChoice);
        }
        
        // Shuffle the array so the balancing choice isn't always first
        Phaser.Utils.Array.Shuffle(this.neurotransmitterChoices);
        this.selectedChoice = 0;
    }
    
    findMostNeededNeurotransmitter() {
        // Find which neurotransmitter would best help achieve balance
        let lowestLevel = 100;
        let mostNeeded = 'dopamine';
        
        for (const [nt, level] of Object.entries(this.neurotransmitterLevels)) {
            if (level < lowestLevel) {
                lowestLevel = level;
                mostNeeded = nt;
            }
        }
        
        return mostNeeded;
    }
    
    selectNeurotransmitterChoice(choiceIndex) {
        if (choiceIndex >= 0 && choiceIndex < this.neurotransmitterChoices.length) {
            this.selectedChoice = choiceIndex;
            const choice = this.neurotransmitterChoices[choiceIndex];
            
            // Create the next piece based on selected choice
            this.nextPiece = {
                ...choice.shape,
                neurotransmitter: choice.name,
                effects: choice.effects
            };
            
            // Resume game immediately if we were waiting for choice
            if (this.waitingForChoice) {
                this.waitingForChoice = false;
                this.spawnNewPiece();
            }
            
            this.showFloatingText(`${choice.name.toUpperCase()} SELECTED!`, '#00ff00');
            this.draw();
        }
    }
    
    applyNeurotransmitterEffects(neurotransmitter, isLineCompleted = false) {
        const choice = this.neurotransmitterChoices.find(c => c.name === neurotransmitter);
        if (!choice) return;
        
        // Base effect multiplier
        let multiplier = 1;
        
        // MASSIVE RELEASE when line is completed (like real synaptic firing)
        if (isLineCompleted) {
            multiplier = 5; // 5x neurotransmitter release!
            this.showFloatingText(`${neurotransmitter.toUpperCase()} SURGE!`, '#ffff00');
            this.createNeurotransmitterSurgeEffect(neurotransmitter);
        }
        
        // Update neurotransmitter levels
        this.neurotransmitterLevels[neurotransmitter] = Math.min(100, 
            this.neurotransmitterLevels[neurotransmitter] + (10 * multiplier));
        
        // Apply mood effects
        for (const [mood, change] of Object.entries(choice.effects)) {
            this.moodState[mood] = Phaser.Math.Clamp(
                this.moodState[mood] + (change * multiplier), 0, 100);
        }
        
        // Natural decay of other neurotransmitters (homeostasis)
        for (const [nt, level] of Object.entries(this.neurotransmitterLevels)) {
            if (nt !== neurotransmitter) {
                this.neurotransmitterLevels[nt] = Math.max(0, level - 2);
            }
        }
        
        this.updateMoodDescription();
        this.checkHomeostasis();
    }
    
    updateMoodDescription() {
        const { happiness, calmness, alertness, motivation, focus, pleasure } = this.moodState;
        const previousMood = this.currentMoodDescription;
        
        // Determine dominant mood state with more dramatic descriptions and emoticons
        if (this.isBalanced()) {
            this.currentMoodDescription = "🧠✨ Optimal Neural State";
        } else if (pleasure > 80) {
            this.currentMoodDescription = "😍🚀 Dopamine Rush";
        } else if (alertness > 80) {
            this.currentMoodDescription = "⚡🎯 Hyperfocused State";
        } else if (calmness > 80) {
            this.currentMoodDescription = "😴💤 Over-Sedated";
        } else if (motivation > 80) {
            this.currentMoodDescription = "🔥💪 Peak Motivation";
        } else if (focus > 80) {
            this.currentMoodDescription = "🎯🔬 Laser Focus";
        } else if (happiness < 30) {
            this.currentMoodDescription = "😔☁️ Neural Depression";
        } else if (calmness < 30) {
            this.currentMoodDescription = "😰⚠️ Anxiety Spike";
        } else if (alertness < 30) {
            this.currentMoodDescription = "😵🔋 Neural Fatigue";
        } else {
            this.currentMoodDescription = "🧪⚡ Chemical Chaos";
        }
        
        // Show dramatic visual feedback when mood state changes
        if (previousMood && previousMood !== this.currentMoodDescription) {
            this.createMoodChangeEffect();
            
            // Apply music effects based on brain state
            this.soundGenerator.applyBrainStateToMusic(this.currentMoodDescription);
            
            // Show specific gameplay effect message
            if (this.isBalanced()) {
                this.showFloatingText('NEURAL OPTIMIZATION! +50% SPEED & SCORE!', '#00ff00');
            } else if (alertness > 80) {
                this.showFloatingText('HYPERALERT! MAXIMUM SPEED!', '#ffff00');
            } else if (alertness < 30) {
                this.showFloatingText('DROWSY! SLOW REACTIONS!', '#ff6600');
            } else if (motivation > 80) {
                this.showFloatingText('PEAK MOTIVATION! +40% SCORE!', '#ff9800');
            } else if (focus > 80) {
                this.showFloatingText('TUNNEL VISION! +30% SCORE!', '#9c27b0');
            }
        }
    }
    
    createMoodChangeEffect() {
        // Create dramatic screen effect when mood state changes
        const moodEffect = this.add.graphics();
        const { happiness, calmness, alertness, motivation, focus, pleasure } = this.moodState;
        
        let effectColor = 0x00bcd4; // Default blue
        let effectAlpha = 0.2;
        
        if (this.isBalanced()) {
            effectColor = 0x00ff00; // Green for balanced
            effectAlpha = 0.3;
        } else if (alertness > 80) {
            effectColor = 0xffff00; // Yellow for hyperalert
            effectAlpha = 0.25;
        } else if (alertness < 30) {
            effectColor = 0x666666; // Gray for drowsy
            effectAlpha = 0.4;
        } else if (motivation > 80) {
            effectColor = 0xff9800; // Orange for motivated
            effectAlpha = 0.25;
        } else if (happiness < 30) {
            effectColor = 0x3f51b5; // Dark blue for depression
            effectAlpha = 0.35;
        } else if (calmness < 30) {
            effectColor = 0xff1744; // Red for anxiety
            effectAlpha = 0.3;
        }
        
        moodEffect.fillStyle(effectColor, effectAlpha);
        moodEffect.fillRect(0, 0, this.BOARD_WIDTH * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
        
        // Pulsing effect
        this.tweens.add({
            targets: moodEffect,
            alpha: 0,
            duration: 1500,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.easeInOut',
            onComplete: () => moodEffect.destroy()
        });
        
        // Screen shake for dramatic brain state changes
        if (alertness > 80 || alertness < 30 || this.isBalanced()) {
            this.cameras.main.shake(200, 0.01);
        }
    }
    
    isBalanced() {
        // Check if all mood states are within healthy range (40-60)
        const moods = Object.values(this.moodState);
        return moods.every(mood => mood >= 40 && mood <= 60);
    }
    
    checkHomeostasis() {
        if (this.isBalanced()) {
            this.homeostasisBonus += 50;
            this.showFloatingText('HOMEOSTASIS ACHIEVED! +50', '#00ff00');
        }
    }
    
    createNeurotransmitterSurgeEffect(neurotransmitter) {
        // Visual effect for massive neurotransmitter release
        const colors = {
            dopamine: 0x00bcd4,
            serotonin: 0xffeb3b,
            gaba: 0x4caf50,
            glutamate: 0xff4444,
            acetylcholine: 0xff9800,
            norepinephrine: 0x9c27b0,
            endorphin: 0x2196f3
        };
        
        const color = colors[neurotransmitter] || 0xffffff;
        
        // Screen flash effect
        const flashEffect = this.add.graphics();
        flashEffect.fillStyle(color, 0.3);
        flashEffect.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);
        
        this.tweens.add({
            targets: flashEffect,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => flashEffect.destroy()
        });
        
        // Particle explosion
        if (this.neuralParticles) {
            this.neuralParticles.emitParticleAt(
                this.BOARD_WIDTH * this.BLOCK_SIZE / 2,
                this.BOARD_HEIGHT * this.BLOCK_SIZE / 2,
                50
            );
        }
    }
    
    createNeurotransmitterBars(startX, startY) {
        // Create visual bars for each neurotransmitter level (much wider for better readability)
        this.ntBars = {};
        this.ntBarGraphics = {};
        
        const barWidth = 200; // Slightly shorter to leave room for numbers
        const barHeight = 12; // Slightly taller
        const barSpacing = 17; // More spacing
        
        const ntColors = {
            dopamine: 0x00bcd4,
            serotonin: 0xffeb3b,
            gaba: 0x8bc34a,
            glutamate: 0xf44336,
            acetylcholine: 0xff9800,
            norepinephrine: 0x9c27b0,
            endorphin: 0x3f51b5
        };
        
        const ntShortNames = {
            dopamine: 'DOPAMINE',
            serotonin: 'SEROTONIN',
            gaba: 'GABA',
            glutamate: 'GLUTAMATE',
            acetylcholine: 'ACETYLCHOLINE',
            norepinephrine: 'NOREPINEPHRINE',
            endorphin: 'ENDORPHIN'
        };
        
        let barIndex = 0;
        for (const [nt, level] of Object.entries(this.neurotransmitterLevels)) {
            const y = startY + (barIndex * barSpacing);
            
            // Label (larger font, full name)
            this.add.text(startX, y - 2, ntShortNames[nt], {
                fontSize: '12px',
                fill: '#cccccc',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '600'
            });
            
            // Background bar
            const bgBar = this.add.graphics();
            bgBar.fillStyle(0x2a2a2a, 0.8);
            bgBar.fillRect(startX + 120, y, barWidth, barHeight);
            bgBar.lineStyle(1, 0x555555, 0.6);
            bgBar.strokeRect(startX + 120, y, barWidth, barHeight);
            
            // Level bar (will be updated dynamically)
            const levelBar = this.add.graphics();
            this.ntBarGraphics[nt] = levelBar;
            
            // Level text (positioned properly within the panel)
            const levelText = this.add.text(startX + 300, y + 1, level.toString(), {
                fontSize: '11px',
                fill: '#ffffff',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: '600'
            });
            this.ntBars[nt] = levelText;
            
            barIndex++;
        }
    }
    
    updateNeurotransmitterBars() {
        // Update the visual bars based on current levels (keeping consistent colors)
        const barWidth = 200; // Updated to match createNeurotransmitterBars
        const barHeight = 12; // Updated to match createNeurotransmitterBars
        const uiX = 400; // Same as in createUIElements
        const startX = uiX + 60; // Same as in createNeurotransmitterBars call: 400 + 60 = 460
        const startY = 345; // Updated to match new createNeurotransmitterBars call
        const barSpacing = 17; // Updated to match createNeurotransmitterBars
        
        // Keep consistent neurotransmitter colors - these should NEVER change
        const ntColors = {
            dopamine: 0x00bcd4,
            serotonin: 0xffeb3b,
            gaba: 0x8bc34a,
            glutamate: 0xf44336,
            acetylcholine: 0xff9800,
            norepinephrine: 0x9c27b0,
            endorphin: 0x3f51b5
        };
        
        let barIndex = 0;
        for (const [nt, level] of Object.entries(this.neurotransmitterLevels)) {
            const y = startY + (barIndex * barSpacing);
            const fillWidth = (level / 100) * barWidth;
            
            // Clear and redraw the level bar
            if (this.ntBarGraphics[nt]) {
                this.ntBarGraphics[nt].clear();
                
                // Always use the consistent neurotransmitter color
                const barColor = ntColors[nt];
                
                // Vary the transparency/intensity based on level instead of changing color
                const alpha = Math.max(0.3, Math.min(1.0, level / 100));
                
                this.ntBarGraphics[nt].fillStyle(barColor, alpha);
                this.ntBarGraphics[nt].fillRect(startX + 120, y, fillWidth, barHeight);
                
                // Add glow effect with the same color
                this.ntBarGraphics[nt].lineStyle(1, barColor, alpha * 0.6);
                this.ntBarGraphics[nt].strokeRect(startX + 120 - 1, y - 1, fillWidth + 2, barHeight + 2);
            }
            
            // Update level text
            if (this.ntBars[nt]) {
                this.ntBars[nt].setText(Math.round(level).toString());
                
                // Color code the text based on balance, not the bar color
                if (level >= 40 && level <= 60) {
                    this.ntBars[nt].setColor('#8bc34a'); // Green for balanced
                } else if (level < 30 || level > 70) {
                    this.ntBars[nt].setColor('#ff4444'); // Red for imbalanced
                } else {
                    this.ntBars[nt].setColor('#ffaa00'); // Orange for slightly off
                }
            }
            
            barIndex++;
        }
    }
}


// =============================================================================
// SCENE 3: GAME OVER SCREEN (Unchanged)
// =============================================================================
class GameOverScene extends Phaser.Scene {
    constructor() { super({ key: 'GameOverScene' }); }
    init(data) { this.finalScore = data.score; this.finalLines = data.lines; }
    create() { 
        this.cameras.main.fadeIn(500, 30, 0, 0); 
        
        this.add.text(450, 150, 'GAME OVER', { 
            fontSize: '64px', 
            fill: '#ff0000', 
            align: 'center',
            fontFamily: 'Orbitron, monospace',
            fontWeight: '900',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5); 
        
        this.add.text(450, 220, 'Synaptic Failure', { 
            fontSize: '32px', 
            fill: '#ff5555', 
            align: 'center',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600'
        }).setOrigin(0.5); 
        
        this.add.text(450, 300, `Final Score: ${this.finalScore}`, { 
            fontSize: '24px', 
            fill: '#e0e0e0', 
            align: 'center',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: '500'
        }).setOrigin(0.5); 
        
        this.add.text(450, 340, `Lines Cleared: ${this.finalLines}`, { 
            fontSize: '24px', 
            fill: '#e0e0e0', 
            align: 'center',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: '500'
        }).setOrigin(0.5); 
        
        const restartButton = this.add.text(450, 450, 'Restart Transmission', { 
            fontSize: '24px', 
            fill: '#8bc34a', 
            backgroundColor: '#333', 
            padding: { x: 20, y: 10 },
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600'
        }).setOrigin(0.5).setInteractive();
        restartButton.on('pointerdown', () => { this.cameras.main.fadeOut(500, 0, 0, 0); this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => { this.scene.start('GameScene'); }); });
        restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#fff' })); restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#8bc34a' }));
    }
}


// =============================================================================
// PHASER GAME CONFIGURATION (Unchanged)
// =============================================================================
const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    scene: [BootScene, StartScene, GameScene, GameOverScene]
};
const game = new Phaser.Game(config);