/**
 * 🎮 2D TOP-DOWN CONTROLLABLE RPG ENGINE
 * Smooth player controls, virtual joystick, camera follow, interactive chests & walking trails.
 */

class RomanticRPGGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.config = window.RPG_CONFIG;
    this.currentMap = 'garden'; // 'garden', 'memoryRoad', 'miniGame'

    // Camera
    this.camera = { x: 0, y: 0, width: 0, height: 0 };

    // Player Character
    this.player = {
      x: 350,
      y: 400,
      radius: 18,
      speed: 3.8,
      dirX: 0,
      dirY: 0,
      facing: 'down',
      walkFrame: 0,
      isMoving: false,
      targetX: null,
      targetY: null,
      emoji: this.config.characterEmoji || '👧🏻'
    };

    // World Maps Data
    this.maps = {
      garden: {
        width: 1000,
        height: 800,
        name: "🌸 The Secret Garden",
        spawn: { x: 350, y: 550 },
        objects: [
          // 3 Treasure Chests
          { id: 'chest1', type: 'chest', chestNum: 1, x: 220, y: 320, name: "Chest 1: The Memory Road", emoji: "🌸", color: "#FF6B8B", state: 'closed' },
          { id: 'chest2', type: 'chest', chestNum: 2, x: 500, y: 280, name: "Chest 2: Catch My Love", emoji: "🎮", color: "#A78BFA", state: 'closed' },
          { id: 'chest3', type: 'chest', chestNum: 3, x: 780, y: 320, name: "Chest 3: The Secret Vault", emoji: "🎁", color: "#FFB703", state: 'closed' },
          // Scenery & Decor
          { type: 'tree', x: 100, y: 150, emoji: '🌸', size: 54 },
          { type: 'tree', x: 280, y: 120, emoji: '🌸', size: 54 },
          { type: 'tree', x: 700, y: 120, emoji: '🌸', size: 54 },
          { type: 'tree', x: 880, y: 150, emoji: '🌸', size: 54 },
          { type: 'bench', x: 500, y: 480, emoji: '🪑', label: 'Cozy Bench for Two 💕' },
          { type: 'fountain', x: 500, y: 640, emoji: '⛲', label: 'Wishing Fountain ✨' },
          { type: 'flowers', x: 200, y: 500, emoji: '🌷' },
          { type: 'flowers', x: 800, y: 500, emoji: '🌼' }
        ]
      },
      memoryRoad: {
        width: 2600,
        height: 1800,
        name: "🌸 Walk Down Memory Lane",
        spawn: { x: 200, y: 1200 },
        objects: []
      }
    };

    // Populate Memory Road stops from config
    this.initMemoryRoadStops();

    // Input States
    this.keys = {};
    this.joystick = { active: false, startX: 0, startY: 0, curX: 0, curY: 0, deltaX: 0, deltaY: 0, maxRadius: 46 };
    this.nearbyObject = null;
    this.activeDialogue = null;
    this.dialogueIndex = 0;
    this.goldenKeyUnlocked = localStorage.getItem('qr_game_key_unlocked') === 'true';

    // Particle FX
    this.worldParticles = [];
  }

  initMemoryRoadStops() {
    const stops = this.config.memoryRoad.stops;
    stops.forEach((stop, idx) => {
      this.maps.memoryRoad.objects.push({
        id: `stop-${idx}`,
        type: 'memoryStop',
        x: stop.x,
        y: stop.y,
        name: stop.title,
        data: stop,
        emoji: stop.icon || '🌸',
        visited: false
      });
    });

    // Add romantic road decor (trees, streetlamps, flowers)
    for (let x = 100; x < 2500; x += 180) {
      this.maps.memoryRoad.objects.push({
        type: 'scenery',
        x: x + (Math.random() * 60 - 30),
        y: 850 + (Math.random() * 600),
        emoji: ['🌸', '✨', '🌲', '💡', '🌷', '💐'][Math.floor(Math.random() * 6)]
      });
    }

    // Portal back to garden
    this.maps.memoryRoad.objects.push({
      id: 'returnPortal',
      type: 'portal',
      x: 100,
      y: 1200,
      name: "Return to Garden 🏰",
      targetMap: 'garden'
    });
  }

  start() {
    this.canvas = document.getElementById('rpgCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.setupKeyboardInput();
    this.setupTouchJoystick();
    this.setupActionButtons();

    // Spawn Player
    this.loadMap('garden');

    // Ambient floating petals in the world
    this.initWorldParticles();

    // Show initial sweet welcome guide
    setTimeout(() => {
      this.showDialogue(this.config.introDialogue);
    }, 600);

    // Start Game Loop
    requestAnimationFrame((time) => this.loop(time));
  }

  resize() {
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.camera.width = this.canvas.width;
    this.camera.height = this.canvas.height;
  }

  loadMap(mapName, customSpawn = null) {
    this.currentMap = mapName;
    const map = this.maps[mapName];
    const spawn = customSpawn || map.spawn;
    this.player.x = spawn.x;
    this.player.y = spawn.y;
    this.player.targetX = null;
    this.player.targetY = null;

    const mapTitle = document.getElementById('rpgLocationBadge');
    if (mapTitle) mapTitle.innerText = map.name;

    window.soundEngine.playChime(1.2);
    window.particleEngine.confettiExplosion();
  }

  // ──────────────────────────────────────────────
  // INPUT CONTROLS (Joystick, Tap, Keyboard)
  // ──────────────────────────────────────────────
  setupKeyboardInput() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === ' ' || e.key.toLowerCase() === 'e' || e.key.toLowerCase() === 'enter') {
        this.handleActionPress();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  setupTouchJoystick() {
    const joystickZone = document.getElementById('joystickZone');
    const joystickHandle = document.getElementById('joystickHandle');
    if (!joystickZone || !joystickHandle) return;

    const onStart = (clientX, clientY) => {
      const rect = joystickZone.getBoundingClientRect();
      this.joystick.startX = rect.left + rect.width / 2;
      this.joystick.startY = rect.top + rect.height / 2;
      this.joystick.active = true;
      this.player.targetX = null; // Cancel tap navigation
      onMove(clientX, clientY);
    };

    const onMove = (clientX, clientY) => {
      if (!this.joystick.active) return;
      let dx = clientX - this.joystick.startX;
      let dy = clientY - this.joystick.startY;
      const dist = Math.hypot(dx, dy);

      if (dist > this.joystick.maxRadius) {
        dx = (dx / dist) * this.joystick.maxRadius;
        dy = (dy / dist) * this.joystick.maxRadius;
      }

      this.joystick.deltaX = dx / this.joystick.maxRadius;
      this.joystick.deltaY = dy / this.joystick.maxRadius;

      joystickHandle.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const onEnd = () => {
      this.joystick.active = false;
      this.joystick.deltaX = 0;
      this.joystick.deltaY = 0;
      joystickHandle.style.transform = `translate(0px, 0px)`;
    };

    // Touch
    joystickZone.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.joystick.active && e.touches.length > 0) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', onEnd);

    // Mouse drag support on joystick zone
    joystickZone.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => { if (this.joystick.active) onMove(e.clientX, e.clientY); });
    window.addEventListener('mouseup', onEnd);

    // Tap-to-walk on canvas
    this.canvas.addEventListener('click', (e) => {
      // Convert screen click to world coordinates
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left + this.camera.x;
      const clickY = e.clientY - rect.top + this.camera.y;

      this.player.targetX = clickX;
      this.player.targetY = clickY;

      window.particleEngine.burstAt(e.clientX, e.clientY, 4);
    });
  }

  setupActionButtons() {
    const actionBtn = document.getElementById('rpgActionBtn');
    if (actionBtn) {
      actionBtn.onclick = () => this.handleActionPress();
    }

    const dialogueNextBtn = document.getElementById('dialogueNextBtn');
    if (dialogueNextBtn) {
      dialogueNextBtn.onclick = () => this.advanceDialogue();
    }
  }

  handleActionPress() {
    // If dialogue is open, advance it
    if (this.activeDialogue) {
      this.advanceDialogue();
      return;
    }

    // If near an interactive object
    if (this.nearbyObject) {
      this.interactWith(this.nearbyObject);
    }
  }

  // ──────────────────────────────────────────────
  // INTERACTION LOGIC (Chests, Stops, Portals)
  // ──────────────────────────────────────────────
  interactWith(obj) {
    window.soundEngine.playPop();

    if (obj.type === 'chest') {
      window.soundEngine.playChestOpen();
      window.particleEngine.burstAt(window.innerWidth / 2, window.innerHeight / 2, 10);

      if (obj.chestNum === 1) {
        // Open Chest 1: Transport to the Memory Road!
        this.showDialogue([
          "✨ Chest 1 Unlocked: The Memory Road!",
          "Walk forward along the winding road with your character to visit all our special moments! 🌸"
        ], () => {
          this.loadMap('memoryRoad');
        });
      } else if (obj.chestNum === 2) {
        // Open Chest 2: Mini-Game Arcade Modal
        window.miniGameEngine.init();
        window.miniGameEngine.start();
        const modal = document.getElementById('arcadeModalOverlay');
        if (modal) modal.classList.add('open');
      } else if (obj.chestNum === 3) {
        // Open Chest 3: The Secret Vault Modal
        window.vaultEngine.init();
        const modal = document.getElementById('vaultModalOverlay');
        if (modal) modal.classList.add('open');
      }
    } else if (obj.type === 'memoryStop') {
      // Opened a Memory Stop on the road
      obj.visited = true;
      window.soundEngine.playChime(1.3);
      window.particleEngine.confettiExplosion();

      const modal = document.getElementById('polaroidModal');
      const photoFrame = document.getElementById('polaroidPhotoFrame');
      const tag = document.getElementById('polaroidTag');
      const title = document.getElementById('polaroidTitle');
      const desc = document.getElementById('polaroidDesc');

      tag.innerText = obj.data.date;
      title.innerText = obj.data.title;
      desc.innerText = `"${obj.data.text}"`;
      photoFrame.innerHTML = `<img class="polaroid-img" src="${obj.data.image}" alt="${obj.data.title}">`;

      modal.classList.add('open');
    } else if (obj.type === 'portal') {
      this.loadMap(obj.targetMap);
    } else if (obj.label) {
      this.showDialogue([`${obj.emoji} ${obj.label}`]);
    }
  }

  showDialogue(lines, onComplete = null) {
    this.activeDialogue = { lines, onComplete };
    this.dialogueIndex = 0;

    const box = document.getElementById('rpgDialogueBox');
    const textEl = document.getElementById('rpgDialogueText');
    if (box && textEl) {
      textEl.innerText = lines[0];
      box.classList.add('open');
      window.soundEngine.playChime(1.1);
    }
  }

  advanceDialogue() {
    if (!this.activeDialogue) return;
    this.dialogueIndex++;

    if (this.dialogueIndex < this.activeDialogue.lines.length) {
      const textEl = document.getElementById('rpgDialogueText');
      textEl.innerText = this.activeDialogue.lines[this.dialogueIndex];
      window.soundEngine.playPop();
    } else {
      // Close Dialogue
      const box = document.getElementById('rpgDialogueBox');
      if (box) box.classList.remove('open');
      const cb = this.activeDialogue.onComplete;
      this.activeDialogue = null;
      if (cb) cb();
    }
  }

  // ──────────────────────────────────────────────
  // UPDATE LOOP (Movement, Physics, Camera)
  // ──────────────────────────────────────────────
  update() {
    const map = this.maps[this.currentMap];
    let vx = 0;
    let vy = 0;

    // 1. Joystick input
    if (this.joystick.active) {
      vx = this.joystick.deltaX * this.player.speed;
      vy = this.joystick.deltaY * this.player.speed;
    } 
    // 2. Keyboard Input
    else if (this.keys['arrowleft'] || this.keys['a']) vx -= this.player.speed;
    if (this.keys['arrowright'] || this.keys['d']) vx += this.player.speed;
    if (this.keys['arrowup'] || this.keys['w']) vy -= this.player.speed;
    if (this.keys['arrowdown'] || this.keys['s']) vy += this.player.speed;

    // 3. Tap to walk destination
    if (!this.joystick.active && this.player.targetX !== null && this.player.targetY !== null) {
      const tdx = this.player.targetX - this.player.x;
      const tdy = this.player.targetY - this.player.y;
      const dist = Math.hypot(tdx, tdy);

      if (dist > 4) {
        vx = (tdx / dist) * this.player.speed;
        vy = (tdy / dist) * this.player.speed;
      } else {
        this.player.targetX = null;
        this.player.targetY = null;
      }
    }

    // Apply Movement & Clamp to Map boundaries
    if (vx !== 0 || vy !== 0) {
      this.player.isMoving = true;
      this.player.x = Math.max(30, Math.min(map.width - 30, this.player.x + vx));
      this.player.y = Math.max(30, Math.min(map.height - 30, this.player.y + vy));

      // Walking bounce frame
      this.player.walkFrame += 0.18;

      if (Math.abs(vx) > Math.abs(vy)) {
        this.player.facing = vx > 0 ? 'right' : 'left';
      } else {
        this.player.facing = vy > 0 ? 'down' : 'up';
      }
    } else {
      this.player.isMoving = false;
    }

    // Update Camera Follow with Lerp
    const targetCamX = this.player.x - this.camera.width / 2;
    const targetCamY = this.player.y - this.camera.height / 2;
    this.camera.x += (Math.max(0, Math.min(map.width - this.camera.width, targetCamX)) - this.camera.x) * 0.1;
    this.camera.y += (Math.max(0, Math.min(map.height - this.camera.height, targetCamY)) - this.camera.y) * 0.1;

    // Check Proximity to Objects
    this.checkNearbyObjects(map);
  }

  checkNearbyObjects(map) {
    let closestObj = null;
    let minDist = 75;

    map.objects.forEach((obj) => {
      if (['chest', 'memoryStop', 'portal', 'bench', 'fountain'].includes(obj.type)) {
        const dist = Math.hypot(this.player.x - obj.x, this.player.y - obj.y);
        if (dist < minDist) {
          closestObj = obj;
          minDist = dist;
        }
      }
    });

    this.nearbyObject = closestObj;

    const actionBtn = document.getElementById('rpgActionBtn');
    const promptBubble = document.getElementById('rpgInteractPrompt');

    if (closestObj) {
      if (actionBtn) {
        actionBtn.classList.add('pulse');
        actionBtn.innerText = closestObj.type === 'chest' ? 'Open 🎁' : 'Inspect ✨';
      }
      if (promptBubble) {
        promptBubble.style.display = 'block';
        promptBubble.innerText = `Tap to open ${closestObj.name || ''}`;
      }
    } else {
      if (actionBtn) {
        actionBtn.classList.remove('pulse');
        actionBtn.innerText = '💖';
      }
      if (promptBubble) promptBubble.style.display = 'none';
    }
  }

  // ──────────────────────────────────────────────
  // RENDER LOOP (Canvas Graphics)
  // ──────────────────────────────────────────────
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    // Offset by camera
    this.ctx.translate(-this.camera.x, -this.camera.y);

    const map = this.maps[this.currentMap];

    // 1. Draw World Ground Grass / Cobblestone Path
    this.drawGround(map);

    // 2. Draw World Objects
    map.objects.forEach(obj => this.drawObject(obj));

    // 3. Draw Player Character
    this.drawPlayer();

    // 4. Draw Ambient World Floating Petals
    this.drawWorldParticles();

    this.ctx.restore();
  }

  drawGround(map) {
    // Base Grass / Pastel Meadow
    this.ctx.fillStyle = this.currentMap === 'garden' ? '#E8F5E9' : '#FFF0F5';
    this.ctx.fillRect(0, 0, map.width, map.height);

    // Draw Cobblestone Path
    this.ctx.fillStyle = '#FFE4E6';
    if (this.currentMap === 'garden') {
      // Cross paths connecting the chests and fountain
      this.ctx.fillRect(200, 310, 600, 50);
      this.ctx.fillRect(475, 200, 50, 500);
    } else if (this.currentMap === 'memoryRoad') {
      // Winding Road connecting stops
      this.ctx.beginPath();
      this.ctx.lineWidth = 60;
      this.ctx.strokeStyle = '#FED7E2';
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      this.ctx.moveTo(200, 1200);
      const stops = this.config.memoryRoad.stops;
      stops.forEach(s => this.ctx.lineTo(s.x, s.y));
      this.ctx.stroke();
    }
  }

  drawObject(obj) {
    this.ctx.save();
    this.ctx.font = `${obj.size || 42}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Highlight glowing pedestal for chests
    if (obj.type === 'chest') {
      this.ctx.fillStyle = 'rgba(255, 182, 193, 0.4)';
      this.ctx.beginPath();
      this.ctx.ellipse(obj.x, obj.y + 15, 36, 18, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Floating gentle bobbing
      const bob = Math.sin(Date.now() * 0.004 + obj.chestNum) * 4;
      this.ctx.fillText(obj.emoji, obj.x, obj.y + bob);

      // Label
      this.ctx.fillStyle = '#4A3E5C';
      this.ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      this.ctx.fillText(obj.name, obj.x, obj.y + 36);
    } 
    else if (obj.type === 'memoryStop') {
      // Shimmering Polaroid Stop Marker
      this.ctx.fillStyle = obj.visited ? '#EDE9FE' : '#FFE4E6';
      this.ctx.beginPath();
      this.ctx.arc(obj.x, obj.y, 30, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#FF6B8B';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      this.ctx.fillText(obj.emoji, obj.x, obj.y);

      this.ctx.fillStyle = '#831843';
      this.ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      this.ctx.fillText(obj.name, obj.x, obj.y + 44);
    }
    else {
      // Trees, flowers, decor
      this.ctx.fillText(obj.emoji, obj.x, obj.y);
    }

    this.ctx.restore();
  }

  drawPlayer() {
    this.ctx.save();

    // Shadow beneath player
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    this.ctx.beginPath();
    this.ctx.ellipse(this.player.x, this.player.y + 12, 16, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Player bounce animation when walking
    const bounce = this.player.isMoving ? Math.sin(this.player.walkFrame) * 4 : 0;

    // Draw Character Emoji Sprite
    this.ctx.font = '40px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.player.emoji, this.player.x, this.player.y - 6 + bounce);

    // Player Name Tag
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    this.ctx.fillText(this.config.herName, this.player.x, this.player.y - 32);

    this.ctx.restore();
  }

  initWorldParticles() {
    for (let i = 0; i < 35; i++) {
      this.worldParticles.push({
        x: Math.random() * 2500,
        y: Math.random() * 1800,
        speedX: Math.random() * 1 + 0.5,
        speedY: Math.random() * 0.8 + 0.3,
        emoji: ['🌸', '✨', '💕', '💫'][Math.floor(Math.random() * 4)],
        size: Math.random() * 8 + 14
      });
    }
  }

  drawWorldParticles() {
    this.worldParticles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x > 2600) p.x = 0;
      if (p.y > 1800) p.y = 0;

      this.ctx.font = `${p.size}px sans-serif`;
      this.ctx.fillText(p.emoji, p.x, p.y);
    });
  }

  loop(timestamp) {
    this.update();
    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }
}

window.romanticRPGGame = new RomanticRPGGame();
