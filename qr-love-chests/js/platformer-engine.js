/**
 * 🍄 MARIO & TERRARIA RETRO PLATFORMER ENGINE
 * 2D Side-scrolling physics, jumping, question mark [?] blocks, coins, parallax background, and 3 chests.
 */

class RetroPlatformerGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.config = window.RPG_CONFIG;
    this.currentWorld = 'meadow'; // 'meadow', 'memoryStage'

    // Camera
    this.camera = { x: 0, y: 0, width: 0, height: 0 };

    // Player
    this.player = {
      x: 100,
      y: 400,
      width: 32,
      height: 40,
      vx: 0,
      vy: 0,
      speed: 2.8, // Calibrated slower, cozy movement speed
      jumpForce: -6.4, // Anti-gravity floating jump
      gravity: 0.16, // Super low gravity float
      isGrounded: false,
      facing: 'right',
      walkFrame: 0,
      emoji: this.config.characterEmoji || '👧🏻',
      coins: 0,
      score: 0
    };

    // Level Dimensions
    this.worldWidth = 3200;
    this.worldHeight = 800;

    // Blocks, Platforms & Objects
    this.blocks = [];
    this.chests = [];
    this.coins = [];
    this.scenery = [];
    this.floatingPops = [];

    // Inputs
    this.keys = {};
    this.touchLeft = false;
    this.touchRight = false;
    this.touchJump = false;
    this.nearbyChest = null;
    this.nearbyStop = null;
  }

  start() {
    this.canvas = document.getElementById('rpgCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.setupInputListeners();
    this.buildWorld();

    // Start Loop
    requestAnimationFrame((t) => this.loop(t));
  }

  resize() {
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.camera.width = this.canvas.width;
    this.camera.height = this.canvas.height;
  }

  // ──────────────────────────────────────────────
  // BUILD WORLD TILES (Mario & Terraria Style)
  // ──────────────────────────────────────────────
  buildWorld() {
    this.blocks = [];
    this.chests = [];
    this.scenery = [];
    this.coins = [];

    const groundY = 620;

    // 1. Continuous Ground Floor (Terraria Grass/Dirt)
    for (let x = 0; x < this.worldWidth; x += 40) {
      this.blocks.push({ x, y: groundY, width: 40, height: 180, type: 'ground' });
    }

    // 2. Terraria Floating Islands & Mario Question Blocks [?]
    // First cluster near spawn
    this.addQuestionBlock(300, groundY - 140, 'heart');
    this.addQuestionBlock(350, groundY - 140, 'coin');
    this.addQuestionBlock(400, groundY - 140, 'coin');
    this.addQuestionBlock(450, groundY - 140, 'star');

    // 🌸 Chest #1 Platform (The Memory Road)
    this.addIsland(650, groundY - 100, 180);
    this.chests.push({
      id: 1,
      x: 720,
      y: groundY - 142,
      width: 44,
      height: 40,
      emoji: '🌸',
      title: 'Chest 1: Memory Adventure'
    });

    // Mid-level Floating Platforms & Mario Pipe / Stairs
    this.addIsland(950, groundY - 130, 140);
    this.addQuestionBlock(1150, groundY - 160, 'coin');
    this.addQuestionBlock(1200, groundY - 160, 'heart');
    this.addQuestionBlock(1250, groundY - 160, 'coin');

    // 🎮 Chest #2 Cloud Island (Catch My Love)
    this.addIsland(1450, groundY - 180, 200, 'cloud');
    this.chests.push({
      id: 2,
      x: 1530,
      y: groundY - 222,
      width: 44,
      height: 40,
      emoji: '🎮',
      title: 'Chest 2: Love Arcade'
    });

    // Bridge / Stepping Stone Islands (Terraria Vine islands)
    this.addIsland(1800, groundY - 120, 120);
    this.addIsland(2000, groundY - 160, 120);
    this.addIsland(2200, groundY - 200, 140);

    // Memory Stops along the world!
    const stops = this.config.memoryRoad.stops;
    const stopPositions = [550, 1050, 1700, 2150, 2600];
    stops.forEach((stop, i) => {
      if (stopPositions[i]) {
        this.scenery.push({
          type: 'memoryShrine',
          x: stopPositions[i],
          y: groundY - 45,
          stopData: stop,
          stopIndex: i,
          emoji: stop.icon || '🌸',
          title: stop.title
        });
      }
    });

    // 🎁 Chest #3 Peach's Castle / Romantic Gazebo at End of Level
    this.addIsland(2700, groundY - 80, 300);
    this.chests.push({
      id: 3,
      x: 2820,
      y: groundY - 122,
      width: 48,
      height: 44,
      emoji: '🎁',
      title: 'Chest 3: Secret Vault'
    });

    // Castle Scenery at End
    this.scenery.push({ type: 'castle', x: 2950, y: groundY - 160, emoji: '🏰' });

    // Decorative Trees, Campfires, Lanterns (Terraria vibe)
    for (let x = 80; x < this.worldWidth; x += 180) {
      this.scenery.push({
        type: 'decor',
        x: x + Math.random() * 40,
        y: groundY - 30,
        emoji: ['🌸', '🌲', '🏮', '🔥', '🌷', '🍄', '🌻'][Math.floor(Math.random() * 7)]
      });
    }
  }

  addIsland(x, y, width, style = 'grass') {
    for (let bx = 0; bx < width; bx += 40) {
      this.blocks.push({ x: x + bx, y, width: 40, height: 35, type: style });
    }
  }

  addQuestionBlock(x, y, reward = 'coin') {
    this.blocks.push({
      x,
      y,
      width: 36,
      height: 36,
      type: 'questionBlock',
      reward,
      bumpOffset: 0,
      used: false
    });
  }

  // ──────────────────────────────────────────────
  // INPUT HANDLING (Mobile Buttons & Keyboard)
  // ──────────────────────────────────────────────
  setupInputListeners() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      this.keys[k] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) {
        e.preventDefault();
      }
      if (k === ' ' || k === 'w' || k === 'arrowup') {
        this.jump();
      }
      if (k === 'e' || k === 'enter') {
        this.interact();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Mobile On-Screen Controls
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnJump = document.getElementById('btnJump');
    const btnAction = document.getElementById('rpgActionBtn');

    if (btnLeft) {
      btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); this.touchLeft = true; });
      btnLeft.addEventListener('touchend', () => { this.touchLeft = false; });
      btnLeft.addEventListener('mousedown', () => { this.touchLeft = true; });
      btnLeft.addEventListener('mouseup', () => { this.touchLeft = false; });
    }

    if (btnRight) {
      btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); this.touchRight = true; });
      btnRight.addEventListener('touchend', () => { this.touchRight = false; });
      btnRight.addEventListener('mousedown', () => { this.touchRight = true; });
      btnRight.addEventListener('mouseup', () => { this.touchRight = false; });
    }

    if (btnJump) {
      btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); this.jump(); });
      btnJump.addEventListener('mousedown', () => { this.jump(); });
    }

    if (btnAction) {
      btnAction.onclick = () => this.interact();
    }
  }

  jump() {
    if (this.player.isGrounded) {
      this.player.vy = this.player.jumpForce;
      this.player.isGrounded = false;
      window.soundEngine.playJump();
    }
  }

  interact() {
    window.soundEngine.playPop();

    // 1. If near a Chest
    if (this.nearbyChest) {
      const id = this.nearbyChest.id;
      window.soundEngine.playChestOpen();
      window.particleEngine.confettiExplosion();

      if (id === 1) {
        // Show dialogue & hint to explore the world
        alert("🌸 Chest 1 Unlocked: Jump across the world to discover all our memory shrines!");
      } else if (id === 2) {
        // Open Chest 2 Love Quiz Modal
        window.loveQuizEngine.init();
        const modal = document.getElementById('quizModalOverlay');
        if (modal) modal.classList.add('open');
      } else if (id === 3) {
        // Open Chest 3 Vault Modal
        window.vaultEngine.init();
        const modal = document.getElementById('vaultModalOverlay');
        if (modal) modal.classList.add('open');
      }
      return;
    }

    // 2. If near a Memory Shrine Stop
    if (this.nearbyStop) {
      const stop = this.nearbyStop.stopData;
      const stopIndex = this.nearbyStop.stopIndex || 0;
      const customPhoto = localStorage.getItem(`qr_memory_photo_${stopIndex}`);
      const displayImage = customPhoto || stop.image;

      window.soundEngine.playCoin();
      window.particleEngine.burstAt(window.innerWidth / 2, window.innerHeight / 2, 10);

      const modal = document.getElementById('polaroidModal');
      const photoFrame = document.getElementById('polaroidPhotoFrame');
      const tag = document.getElementById('polaroidTag');
      const title = document.getElementById('polaroidTitle');
      const desc = document.getElementById('polaroidDesc');

      tag.innerText = stop.date;
      title.innerText = stop.title;
      desc.innerText = `"${stop.text}"`;
      photoFrame.innerHTML = `<img class="polaroid-img" src="${displayImage}" alt="${stop.title}" style="cursor:zoom-in;" onclick="window.openLightbox('${displayImage.replace(/'/g, "\\'")}', '${stop.title.replace(/'/g, "\\'")}')">`;

      modal.classList.add('open');
    }
  }

  // ──────────────────────────────────────────────
  // UPDATE LOOP (Platformer Physics & Collisions)
  // ──────────────────────────────────────────────
  update() {
    // 1. Horizontal Movement
    this.player.vx = 0;
    if (this.keys['arrowleft'] || this.keys['a'] || this.touchLeft) {
      this.player.vx = -this.player.speed;
      this.player.facing = 'left';
    }
    if (this.keys['arrowright'] || this.keys['d'] || this.touchRight) {
      this.player.vx = this.player.speed;
      this.player.facing = 'right';
    }

    // Walk animation frame
    if (this.player.vx !== 0 && this.player.isGrounded) {
      this.player.walkFrame += 0.22;
    }

    // Apply Gravity
    this.player.vy += this.player.gravity;

    // Update X position & check collisions
    this.player.x += this.player.vx;
    this.player.x = Math.max(20, Math.min(this.worldWidth - 50, this.player.x));

    // Update Y position & check ground/platform collisions
    this.player.y += this.player.vy;
    this.player.isGrounded = false;

    // Check collisions with all solid blocks
    this.blocks.forEach((b) => {
      // Check if hitting Question Block from underneath
      if (
        b.type === 'questionBlock' &&
        this.player.vy < 0 &&
        this.player.x + this.player.width > b.x &&
        this.player.x < b.x + b.width &&
        this.player.y <= b.y + b.height &&
        this.player.y >= b.y
      ) {
        this.player.vy = 2; // Bounce player back down
        this.hitBlock(b);
      }

      // Check Landing on top of blocks/ground
      if (
        this.player.x + this.player.width > b.x &&
        this.player.x < b.x + b.width &&
        this.player.y + this.player.height >= b.y &&
        this.player.y + this.player.height <= b.y + 20 &&
        this.player.vy >= 0
      ) {
        this.player.y = b.y - this.player.height;
        this.player.vy = 0;
        this.player.isGrounded = true;
      }
    });

    // Update Floating Popups
    for (let i = this.floatingPops.length - 1; i >= 0; i--) {
      const p = this.floatingPops[i];
      p.y -= 1.8;
      p.opacity -= 0.02;
      if (p.opacity <= 0) this.floatingPops.splice(i, 1);
    }

    // Update Camera Follow (Side-Scrolling)
    const targetCamX = this.player.x - this.camera.width * 0.35;
    this.camera.x += (Math.max(0, Math.min(this.worldWidth - this.camera.width, targetCamX)) - this.camera.x) * 0.12;

    // Check Proximity to Chests and Shrines
    this.checkProximities();
  }

  hitBlock(b) {
    if (b.used) {
      window.soundEngine.playBlockBump();
      return;
    }

    b.used = true;
    b.bumpOffset = -10;
    setTimeout(() => { b.bumpOffset = 0; }, 150);

    if (b.reward === 'coin') {
      window.soundEngine.playCoin();
      this.player.coins++;
      this.player.score += 100;
      this.spawnFloatingPop(b.x + 10, b.y - 20, '🪙 +100');
    } else if (b.reward === 'heart') {
      window.soundEngine.playPowerUp();
      this.player.score += 250;
      this.spawnFloatingPop(b.x + 10, b.y - 20, '💖 LOVE UP!');
    } else if (b.reward === 'star') {
      window.soundEngine.playFanfare();
      this.player.score += 500;
      this.spawnFloatingPop(b.x + 10, b.y - 20, '⭐ SUPER STAR!');
    }

    this.updateHUD();
  }

  spawnFloatingPop(x, y, text) {
    this.floatingPops.push({ x, y, text, opacity: 1 });
  }

  updateHUD() {
    const coinEl = document.getElementById('retroCoinCount');
    const scoreEl = document.getElementById('retroScoreCount');
    if (coinEl) coinEl.innerText = `🪙 x ${String(this.player.coins).padStart(2, '0')}`;
    if (scoreEl) scoreEl.innerText = `SCORE: ${String(this.player.score).padStart(5, '0')}`;
  }

  checkProximities() {
    let nearChest = null;
    this.chests.forEach(c => {
      const dist = Math.hypot(this.player.x - c.x, this.player.y - c.y);
      if (dist < 60) nearChest = c;
    });
    this.nearbyChest = nearChest;

    let nearStop = null;
    this.scenery.forEach(s => {
      if (s.type === 'memoryShrine') {
        const dist = Math.hypot(this.player.x - s.x, this.player.y - s.y);
        if (dist < 60) nearStop = s;
      }
    });
    this.nearbyStop = nearStop;

    const actionBtn = document.getElementById('rpgActionBtn');
    if (actionBtn) {
      if (nearChest) {
        actionBtn.classList.add('pulse');
        actionBtn.innerHTML = '<span>OPEN</span><span style="font-size:9px; opacity:0.9;">[E]</span>';
      } else if (nearStop) {
        actionBtn.classList.add('pulse');
        actionBtn.innerHTML = '<span>READ</span><span style="font-size:9px; opacity:0.9;">[E]</span>';
      } else {
        actionBtn.classList.remove('pulse');
        actionBtn.innerHTML = '<span>ACTION</span><span style="font-size:9px; opacity:0.9;">[E]</span>';
      }
    }
  }

  // ──────────────────────────────────────────────
  // RENDER (Pixel Parallax & Platformer Graphics)
  // ──────────────────────────────────────────────
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Parallax Retro Sky & Clouds
    this.drawParallaxSky();

    this.ctx.save();
    this.ctx.translate(-this.camera.x, 0);

    // 2. Draw Scenery (Castle, Trees, Shrines)
    this.scenery.forEach(s => this.drawScenery(s));

    // 3. Draw Blocks & Floating Islands
    this.blocks.forEach(b => this.drawBlock(b));

    // 4. Draw Chests
    this.chests.forEach(c => this.drawChest(c));

    // 5. Draw Player Sprite
    this.drawPlayer();

    // 6. Draw Floating Point Popups
    this.floatingPops.forEach(p => {
      this.ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity})`;
      this.ctx.font = 'bold 16px "Press Start 2P", monospace, sans-serif';
      this.ctx.fillText(p.text, p.x, p.y);
    });

    this.ctx.restore();
  }

  drawParallaxSky() {
    // Sky Gradient (Sunset Pastel Mario / Terraria Sky)
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    skyGrad.addColorStop(0, '#70A5FF');
    skyGrad.addColorStop(0.6, '#BCE4FF');
    skyGrad.addColorStop(1, '#FFE3EC');
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Parallax Mountain Silhouettes
    this.ctx.fillStyle = 'rgba(167, 139, 250, 0.35)';
    for (let i = 0; i < 10; i++) {
      const mx = i * 400 - (this.camera.x * 0.2) % 400;
      this.ctx.beginPath();
      this.ctx.moveTo(mx, 600);
      this.ctx.lineTo(mx + 200, 380);
      this.ctx.lineTo(mx + 400, 600);
      this.ctx.fill();
    }

    // Parallax Pixel Clouds
    this.ctx.font = '48px sans-serif';
    for (let i = 0; i < 8; i++) {
      const cx = i * 450 - (this.camera.x * 0.4) % 450;
      this.ctx.fillText('☁️', cx, 120 + (i % 3) * 40);
    }
  }

  drawBlock(b) {
    this.ctx.save();
    const y = b.y + (b.bumpOffset || 0);

    if (b.type === 'ground' || b.type === 'grass') {
      // Terraria Grassy Dirt Block
      this.ctx.fillStyle = '#5A3D28'; // Rich Dirt
      this.ctx.fillRect(b.x, y, b.width, b.height);

      // Lush Green Top Grass
      this.ctx.fillStyle = '#48BB78';
      this.ctx.fillRect(b.x, y, b.width, 10);
      this.ctx.fillStyle = '#38A169';
      this.ctx.fillRect(b.x, y + 8, b.width, 4);
    } 
    else if (b.type === 'cloud') {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.roundRect(b.x, y, b.width, b.height, 12);
      this.ctx.fill();
      this.ctx.strokeStyle = '#E2E8F0';
      this.ctx.stroke();
    }
    else if (b.type === 'questionBlock') {
      // Mario Question Block [?]
      this.ctx.fillStyle = b.used ? '#A0AEC0' : '#ECC94B';
      this.ctx.fillRect(b.x, y, b.width, b.height);

      this.ctx.strokeStyle = b.used ? '#718096' : '#B7791F';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(b.x, y, b.width, b.height);

      // Question Mark
      this.ctx.fillStyle = b.used ? '#4A5568' : '#744210';
      this.ctx.font = 'bold 18px "Press Start 2P", monospace, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(b.used ? '•' : '?', b.x + b.width / 2, y + b.height / 2);
    }

    this.ctx.restore();
  }

  drawChest(c) {
    this.ctx.save();
    const bob = Math.sin(Date.now() * 0.005 + c.id) * 4;

    // Glowing Platform Pedestal
    this.ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
    this.ctx.beginPath();
    this.ctx.ellipse(c.x + 22, c.y + 35, 26, 10, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Chest Emoji
    this.ctx.font = '38px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(c.emoji, c.x + 22, c.y + 20 + bob);

    // Chest Banner Label
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 11px "Press Start 2P", monospace, sans-serif';
    this.ctx.fillText(`[${c.id}]`, c.x + 22, c.y - 10 + bob);

    this.ctx.restore();
  }

  drawScenery(s) {
    this.ctx.save();
    this.ctx.font = s.type === 'castle' ? '80px sans-serif' : '34px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'bottom';
    this.ctx.fillText(s.emoji, s.x, s.y);

    if (s.type === 'memoryShrine') {
      this.ctx.fillStyle = '#831843';
      this.ctx.font = 'bold 10px "Press Start 2P", monospace, sans-serif';
      this.ctx.fillText(s.title.substring(0, 10) + '..', s.x, s.y - 40);
    }
    this.ctx.restore();
  }

  drawPlayer() {
    this.ctx.save();

    // Shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.beginPath();
    this.ctx.ellipse(this.player.x + this.player.width / 2, this.player.y + this.player.height, 16, 6, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Jump / Walk Pose
    const bounce = this.player.isGrounded ? Math.sin(this.player.walkFrame) * 4 : -4;

    this.ctx.font = '36px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Flip sprite if facing left
    if (this.player.facing === 'left') {
      this.ctx.translate(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2 + bounce);
      this.ctx.scale(-1, 1);
      this.ctx.fillText(this.player.emoji, 0, 0);
    } else {
      this.ctx.fillText(this.player.emoji, this.player.x + this.player.width / 2, this.player.y + this.player.height / 2 + bounce);
    }

    // Name tag above player
    this.ctx.restore();
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 10px "Press Start 2P", monospace, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.config.herName, this.player.x + this.player.width / 2, this.player.y - 12);
  }

  loop(t) {
    this.update();
    this.render();
    requestAnimationFrame((time) => this.loop(time));
  }
}

window.romanticRPGGame = new RetroPlatformerGame();
