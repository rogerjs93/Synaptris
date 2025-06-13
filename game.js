// =============================================================================
// SOUND GENERATOR (This part is correct and unchanged)
// =============================================================================
class SoundGenerator {
    constructor(soundManager) { this.sound = soundManager; }
    play(key) {
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
    preload() { console.log('BootScene: No assets to load, generating textures...'); }
    create() {
        const particleGraphics = this.make.graphics();
        particleGraphics.fillStyle(0x00bcd4);
        particleGraphics.fillCircle(4, 4, 4);
        particleGraphics.generateTexture('neural_particle', 8, 8);
        particleGraphics.destroy();
        console.log('BootScene: Done. Transitioning to StartScene.');
        this.scene.start('StartScene');
    }
}

// =============================================================================
// SCENE 1: START SCREEN (Unchanged)
// =============================================================================
class StartScene extends Phaser.Scene {
    constructor() { super({ key: 'StartScene' }); }
    create() {
        this.add.text(325, 50, 'Synaptetris', { fontSize: '48px', fill: '#00bcd4' }).setOrigin(0.5); const infoStyle = { fontSize: '16px', fill: '#e0e0e0', align: 'left', wordWrap: { width: 550 } }; this.add.text(50, 120, 'OBJECTIVE:', { fontSize: '20px', fill: '#ffff00' }); this.add.text(50, 150, 'Fit falling neurotransmitter vesicles to complete rows, representing successful synaptic transmission.', infoStyle); this.add.text(50, 220, 'MECHANICS:', { fontSize: '20px', fill: '#ffff00' }); this.add.text(50, 250, `■ SYNAPTIC CONGESTION: Gaps in your stack slow down transmission (and the game!). Efficient play speeds it up.\n\n` + `■ REUPTAKE FAILURE: Sometimes, cleared lines leave behind a "stuck" neurotransmitter, blocking the space.\n\n` + `■ POWER-UP (White Block): This special vesicle acts as a reuptake inhibitor, clearing random blocks from the cleft.`, infoStyle); this.add.text(50, 420, 'CONTROLS:', { fontSize: '20px', fill: '#ffff00' }); this.add.text(50, 450, '← →: Move | ↑: Rotate | ↓: Soft Drop | SPACE: Hard Drop', infoStyle); const startButton = this.add.text(325, 550, 'Click to Begin Transmission', { fontSize: '24px', fill: '#8bc34a', backgroundColor: '#333', padding: { x: 20, y: 10 } }).setOrigin(0.5).setInteractive();
        startButton.on('pointerdown', () => { if (this.sound.context.state === 'suspended') { this.sound.context.resume(); } this.cameras.main.fadeOut(500, 0, 0, 0); this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => { this.scene.start('GameScene'); }); });
        startButton.on('pointerover', () => startButton.setStyle({ fill: '#fff' })); startButton.on('pointerout', () => startButton.setStyle({ fill: '#8bc34a' }));
    }
}

// =============================================================================
// SCENE 2: THE MAIN GAME (Completely revised visual structure)
// =============================================================================
class GameScene extends Phaser.Scene {
    constructor() { super({ key: 'GameScene' }); }
    init() {
        this.BOARD_WIDTH = 10; this.BOARD_HEIGHT = 20; this.BLOCK_SIZE = 30; this.board = []; this.currentPiece = null; this.nextPiece = null; this.score = 0; this.lines = 0; this.gameOver = false; this.congestion = 0; this.baseDropDelay = 1000; this.currentDropDelay = 1000;
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
        this.nextPieceGraphics = this.add.graphics({ x: 420, y: 100 });
        this.add.text(400, 20, 'Synaptetris', { fontSize: '28px', fill: '#00bcd4' }); this.add.text(400, 70, 'Next Vesicle:', { fontSize: '18px', fill: '#e0e0e0' }); this.scoreText = this.add.text(400, 250, 'Score: 0', { fontSize: '20px', fill: '#e0e0e0' }); this.linesText = this.add.text(400, 280, 'Lines Cleared: 0', { fontSize: '20px', fill: '#e0e0e0' }); this.congestionText = this.add.text(400, 310, 'Congestion: 0%', { fontSize: '20px', fill: '#ff5555' }); this.add.text(20, 620, '← → Move | ↑ Rotate | ↓ Soft Drop | SPACE Hard Drop', { fontSize: '14px', fill: '#cccccc' });
        
        // --- Game Logic Setup ---
        for (let y = 0; y < this.BOARD_HEIGHT; y++) { this.board[y] = Array(this.BOARD_WIDTH).fill(0); }
        this.soundGenerator = new SoundGenerator(this.sound);
        this.shapes = [ { shape: [[1, 1, 1, 1]], color: 0x00bcd4 }, { shape: [[1, 0, 0], [1, 1, 1]], color: 0xffeb3b }, { shape: [[0, 0, 1], [1, 1, 1]], color: 0x8bc34a }, { shape: [[1, 1], [1, 1]], color: 0xf44336 }, { shape: [[0, 1, 1], [1, 1, 0]], color: 0xff9800 }, { shape: [[0, 1, 0], [1, 1, 1]], color: 0x9c27b0 }, { shape: [[1, 1, 0], [0, 1, 1]], color: 0x3f51b5 } ];
        this.powerUpShape = { shape: [[1]], color: 0xffffff, isPowerUp: true };
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', this.hardDrop, this);
        this.spawnNewPiece(); this.updateDropTimer();
        this.draw();
    }
    update() {
        if (this.gameOver) return;
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) { if (this.movePiece(-1, 0)) this.soundGenerator.play('move'); } 
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) { if (this.movePiece(1, 0)) this.soundGenerator.play('move'); } 
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { if (this.movePiece(0, 1)) this.soundGenerator.play('move'); } 
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) { this.rotatePiece(); }
    }
    
    draw() {
        // We only need to clear and redraw the pieces that move.
        this.pieceGraphics.clear();

        // Draw locked pieces. NOTE: The size is BLOCK_SIZE - 1 to reveal the grid.
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x]) {
                    this.pieceGraphics.fillStyle(this.board[y][x], 1);
                    this.pieceGraphics.fillRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE - 1, this.BLOCK_SIZE - 1);
                }
            }
        }

        // Draw current falling piece, also slightly smaller.
        if (this.currentPiece) {
            const { x, y, shape, color } = this.currentPiece;
            this.pieceGraphics.fillStyle(color, 1);
            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        this.pieceGraphics.fillRect((x + col) * this.BLOCK_SIZE, (y + row) * this.BLOCK_SIZE, this.BLOCK_SIZE - 1, this.BLOCK_SIZE - 1);
                    }
                }
            }
        }
        
        // --- UI Drawing ---
        this.nextPieceGraphics.clear();
        if (this.nextPiece) {
            const { shape, color } = this.nextPiece; this.nextPieceGraphics.fillStyle(color, 1);
            for (let r = 0; r < shape.length; r++) { for (let c = 0; c < shape[r].length; c++) { if (shape[r][c]) this.nextPieceGraphics.fillRect(c * this.BLOCK_SIZE, r * this.BLOCK_SIZE, this.BLOCK_SIZE - 1, this.BLOCK_SIZE - 1); } }
        }
        this.scoreText.setText('Score: ' + this.score); this.linesText.setText('Lines Cleared: ' + this.lines); this.congestionText.setText('Congestion: ' + Math.floor(this.congestion * 100) + '%');
    }
    
    // --- The rest of the game logic calls this.draw() whenever a change occurs. ---
    movePiece(dx, dy) { if (!this.checkCollision(this.currentPiece.x + dx, this.currentPiece.y + dy, this.currentPiece.shape)) { this.currentPiece.x += dx; this.currentPiece.y += dy; this.draw(); return true; } return false; }
    rotatePiece() { if (this.currentPiece.isPowerUp) return; const shape = this.currentPiece.shape; const newShape = []; for (let y = 0; y < shape[0].length; y++) { newShape[y] = []; for (let x = 0; x < shape.length; x++) { newShape[y][x] = shape[shape.length - 1 - x][y]; } } let didRotate = false; if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y, newShape)) { this.currentPiece.shape = newShape; didRotate = true; } else if (!this.checkCollision(this.currentPiece.x + 1, this.currentPiece.y, newShape)) { this.currentPiece.x++; this.currentPiece.shape = newShape; didRotate = true; } else if (!this.checkCollision(this.currentPiece.x - 1, this.currentPiece.y, newShape)) { this.currentPiece.x--; this.currentPiece.shape = newShape; didRotate = true; } if (didRotate) { this.soundGenerator.play('rotate'); } this.draw(); }
    hardDrop() { while (this.movePiece(0, 1)) {} this.lockPiece(); }
    drop() { if (!this.movePiece(0, 1)) { this.lockPiece(); } }
    lockPiece() { this.soundGenerator.play('lock'); const { x, y, shape, color } = this.currentPiece; if (this.currentPiece.isPowerUp) { this.activatePowerUp(); } else { for (let row = 0; row < shape.length; row++) { for (let col = 0; col < shape[row].length; col++) { if (shape[row][col] && y + row >= 0) { this.board[y + row][x + col] = color; } } } } this.clearLines(); this.calculateCongestion(); this.updateDropTimer(); this.spawnNewPiece(); this.draw(); }
    checkCollision(x, y, shape) { for (let row = 0; row < shape.length; row++) { for (let col = 0; col < shape[row].length; col++) { if (shape[row][col]) { const newX = x + col, newY = y + row; if (newX < 0 || newX >= this.BOARD_WIDTH || newY >= this.BOARD_HEIGHT) return true; if (newY >= 0 && this.board[newY] && this.board[newY][newX]) return true; } } } return false; }
    spawnNewPiece() { this.currentPiece = this.nextPiece || this.getRandomPiece(); this.nextPiece = this.getRandomPiece(); this.currentPiece.x = Math.floor(this.BOARD_WIDTH / 2) - 1; this.currentPiece.y = 0; if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) { this.gameOver = true; this.dropTimer.remove(); this.soundGenerator.play('gameover'); this.cameras.main.fade(1000, 30, 0, 0, false, (cam, progress) => { if (progress === 1) { this.scene.start('GameOverScene', { score: this.score, lines: this.lines }); } }); } }
    getRandomPiece() { if (Math.random() < 0.1 && this.lines > 2) return { ...this.powerUpShape }; const piece = Phaser.Utils.Array.GetRandom(this.shapes); return { shape: piece.shape, color: piece.color, x: 0, y: 0, isPowerUp: false }; }
    clearLines() { let linesCleared = 0; for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) { if (this.board[y].every(cell => cell > 0)) { linesCleared++; this.board.splice(y, 1); this.board.unshift(Array(this.BOARD_WIDTH).fill(0)); y++; } } if (linesCleared > 0) { this.lines += linesCleared; this.score += linesCleared * 100 * linesCleared; this.soundGenerator.play('clear'); this.showActivationMessage(); if (Math.random() < 0.25) { this.reuptakeFailure(); } } }
    activatePowerUp() { this.soundGenerator.play('powerup'); this.showFloatingText('Reuptake Inhibitor!', '#ffffff'); const filledCells = []; for (let y = 0; y < this.BOARD_HEIGHT; y++) { for (let x = 0; x < this.BOARD_WIDTH; x++) { if (this.board[y][x]) filledCells.push({x, y}); } } Phaser.Utils.Array.Shuffle(filledCells); for(let i = 0; i < Math.min(5, filledCells.length); i++) { const cell = filledCells[i]; this.board[cell.y][cell.x] = 0; } }
    reuptakeFailure() { this.soundGenerator.play('reuptake_fail'); this.showFloatingText('Reuptake Failure!', '#ff5555'); for (let y = this.BOARD_HEIGHT - 1; y >= this.BOARD_HEIGHT - 5; y--) { const emptyCols = []; for (let x = 0; x < this.BOARD_WIDTH; x++) { if (this.board[y][x] === 0) emptyCols.push(x); } if (emptyCols.length > 0) { const randomX = Phaser.Utils.Array.GetRandom(emptyCols); this.board[y][randomX] = 0x888888; return; } } }
    showFloatingText(text, color) { const msg = this.add.text(this.BOARD_WIDTH * this.BLOCK_SIZE / 2, 120, text, { fontSize: '24px', fill: color, align: 'center', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5); this.tweens.add({ targets: msg, alpha: 0, y: '-=30', duration: 2000, ease: 'Power2', onComplete: () => msg.destroy() }); }
    showActivationMessage() { this.showFloatingText('Receptors Activated!', '#ffff00'); }
    calculateCongestion() { let h = this.BOARD_HEIGHT, e = 0, t = 0; for (let y = 0; y < this.BOARD_HEIGHT; y++) { if (this.board[y].some(c => c > 0)) { h = y; break; } } if (h === this.BOARD_HEIGHT) { this.congestion = 0; return; } for (let y = h; y < this.BOARD_HEIGHT; y++) { for (let x = 0; x < this.BOARD_WIDTH; x++) { if (this.board[y][x] === 0) e++; t++; } } this.congestion = t > 0 ? e / t : 0; }
    updateDropTimer() { const c = this.congestion * 1500, e = this.lines * 10; this.currentDropDelay = Math.max(100, this.baseDropDelay + c - e); if (this.dropTimer) this.dropTimer.remove(); this.dropTimer = this.time.addEvent({ delay: this.currentDropDelay, callback: this.drop, callbackScope: this, loop: true }); }
}


// =============================================================================
// SCENE 3: GAME OVER SCREEN (Unchanged)
// =============================================================================
class GameOverScene extends Phaser.Scene {
    constructor() { super({ key: 'GameOverScene' }); }
    init(data) { this.finalScore = data.score; this.finalLines = data.lines; }
    create() { this.cameras.main.fadeIn(500, 30, 0, 0); this.add.text(325, 150, 'GAME OVER', { fontSize: '64px', fill: '#ff0000', align: 'center' }).setOrigin(0.5); this.add.text(325, 220, 'Synaptic Failure', { fontSize: '32px', fill: '#ff5555', align: 'center' }).setOrigin(0.5); this.add.text(325, 300, `Final Score: ${this.finalScore}`, { fontSize: '24px', fill: '#e0e0e0', align: 'center' }).setOrigin(0.5); this.add.text(325, 340, `Lines Cleared: ${this.finalLines}`, { fontSize: '24px', fill: '#e0e0e0', align: 'center' }).setOrigin(0.5); const restartButton = this.add.text(325, 450, 'Restart Transmission', { fontSize: '24px', fill: '#8bc34a', backgroundColor: '#333', padding: { x: 20, y: 10 } }).setOrigin(0.5).setInteractive();
        restartButton.on('pointerdown', () => { this.cameras.main.fadeOut(500, 0, 0, 0); this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => { this.scene.start('GameScene'); }); });
        restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#fff' })); restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#8bc34a' }));
    }
}


// =============================================================================
// PHASER GAME CONFIGURATION (Unchanged)
// =============================================================================
const config = {
    type: Phaser.AUTO,
    width: 650,
    height: 650,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    scene: [BootScene, StartScene, GameScene, GameOverScene]
};
const game = new Phaser.Game(config);