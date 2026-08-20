/**
 * 🎮 CHEST 2: 'CATCH MY HEART' MINI-GAME ARCADE ENGINE
 */
class MiniGameEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.score = 0;
    this.targetScore = 15;
    this.isRunning = false;

    // Basket / Player
    this.player = {
      x: 150,
      y: 0,
      width: 70,
      height: 40,
      emoji: '🧺'
    };

    this.items = [];
    this.lastSpawn = 0;
    this.spawnInterval = 750;
  }

  init() {
    this.canvas = document.getElementById('gameCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    const config = window.GAME_CONFIG.miniGame;
    this.targetScore = config.targetScore || 15;
    document.getElementById('arcadeTargetText').innerText = `Goal: ${this.targetScore} 💖`;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.setupControls();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.player.y = this.canvas.height - 70;
    if (this.player.x > this.canvas.width - this.player.width) {
      this.player.x = this.canvas.width / 2;
    }
  }

  setupControls() {
    const handleMove = (clientX) => {
      if (!this.isRunning || !this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, relativeX - this.player.width / 2));
    };

    // Touch support
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    });

    // Mouse support
    this.canvas.addEventListener('mousemove', (e) => {
      handleMove(e.clientX);
    });
  }

  start() {
    this.score = 0;
    this.items = [];
    this.isRunning = true;
    this.updateScoreUI();
    this.resize();
    this.lastSpawn = performance.now();
    this.loop(performance.now());
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  spawnItem() {
    const config = window.GAME_CONFIG.miniGame;
    const isObstacle = Math.random() < 0.18; // 18% obstacle chance

    if (isObstacle) {
      this.items.push({
        x: Math.random() * (this.canvas.width - 40) + 20,
        y: -30,
        speed: Math.random() * 2 + 3,
        emoji: config.obstacleEmoji || '⛈️',
        isObstacle: true,
        points: -2,
        size: 32
      });
    } else {
      const available = config.items || [{ emoji: '💖', points: 1 }];
      const itemConfig = available[Math.floor(Math.random() * available.length)];
      this.items.push({
        x: Math.random() * (this.canvas.width - 40) + 20,
        y: -30,
        speed: Math.random() * 2 + 2.5,
        emoji: itemConfig.emoji,
        isObstacle: false,
        points: itemConfig.points,
        size: 32
      });
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;

    if (timestamp - this.lastSpawn > this.spawnInterval) {
      this.spawnItem();
      this.lastSpawn = timestamp;
    }

    this.update();
    this.render();

    this.animationId = requestAnimationFrame((t) => this.loop(t));
  }

  update() {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.y += item.speed;

      // Check Collision with player basket
      if (
        item.y + item.size >= this.player.y &&
        item.y <= this.player.y + this.player.height &&
        item.x + item.size >= this.player.x &&
        item.x <= this.player.x + this.player.width
      ) {
        // Caught item!
        if (item.isObstacle) {
          window.soundEngine.playError();
          this.score = Math.max(0, this.score + item.points);
        } else {
          window.soundEngine.playChime(1 + this.score * 0.05);
          window.particleEngine.burstAt(this.player.x + this.player.width / 2, this.player.y, 6);
          this.score += item.points;
        }

        this.items.splice(i, 1);
        this.updateScoreUI();

        // Check Win Condition
        if (this.score >= this.targetScore) {
          this.winGame();
          return;
        }
        continue;
      }

      // Remove out-of-screen items
      if (item.y > this.canvas.height + 40) {
        this.items.splice(i, 1);
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Falling Items
    this.ctx.font = '32px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    this.items.forEach((item) => {
      this.ctx.fillText(item.emoji, item.x, item.y);
    });

    // Draw Basket Player
    this.ctx.font = '48px sans-serif';
    this.ctx.fillText(this.player.emoji, this.player.x + this.player.width / 2, this.player.y + 20);
  }

  updateScoreUI() {
    const scoreElem = document.getElementById('arcadeScoreText');
    if (scoreElem) {
      scoreElem.innerText = `Score: ${this.score}`;
    }
  }

  winGame() {
    this.stop();
    window.soundEngine.playFanfare();
    window.particleEngine.confettiExplosion();

    // Mark Golden Key as unlocked
    localStorage.setItem('qr_game_key_unlocked', 'true');
    const keyBadge = document.getElementById('keyStatusBadge');
    if (keyBadge) {
      keyBadge.innerHTML = '🗝️ Key Acquired! Chest 3 Ready';
      keyBadge.style.color = '#059669';
      keyBadge.style.background = '#D1FAE5';
    }

    const winModal = document.getElementById('gameWinModal');
    if (winModal) {
      winModal.classList.add('open');
    }
  }
}

window.miniGameEngine = new MiniGameEngine();
