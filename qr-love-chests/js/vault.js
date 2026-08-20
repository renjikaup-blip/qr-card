/**
 * 🎁 CHEST 3: THE SECRET VAULT, LOVE LETTER & SCRATCH COUPONS
 */
class VaultEngine {
  constructor() {
    this.letterOpened = false;
    this.coupons = [];
  }

  init() {
    const config = window.GAME_CONFIG.vault;
    this.coupons = config.coupons || [];

    this.renderLetter();
    this.renderCoupons();
  }

  renderLetter() {
    const letterConfig = window.GAME_CONFIG.vault.letter;
    if (!letterConfig) return;

    const heading = document.getElementById('letterHeading');
    const date = document.getElementById('letterDate');
    const body = document.getElementById('letterBody');
    const signoff = document.getElementById('letterSignoff');

    if (heading) heading.innerText = letterConfig.heading;
    if (date) date.innerText = letterConfig.date;
    if (signoff) signoff.innerText = letterConfig.signoff;

    if (body && Array.isArray(letterConfig.body)) {
      body.innerHTML = letterConfig.body
        .map(p => `<p class="letter-paragraph">${p}</p>`)
        .join('');
    }

    const envelope = document.getElementById('envelopeCard');
    const letterSheet = document.getElementById('letterSheet');

    if (envelope && letterSheet) {
      envelope.onclick = () => {
        if (!this.letterOpened) {
          this.letterOpened = true;
          window.soundEngine.playChestOpen();
          window.particleEngine.burstAt(window.innerWidth / 2, window.innerHeight / 2, 12);
          envelope.style.display = 'none';
          letterSheet.style.display = 'block';
        }
      };
    }
  }

  renderCoupons() {
    const container = document.getElementById('couponsGrid');
    if (!container) return;
    container.innerHTML = '';

    this.coupons.forEach((coupon, index) => {
      const card = document.createElement('div');
      card.className = 'scratch-card';
      card.id = `scratch-card-${index}`;

      card.innerHTML = `
        <div class="scratch-reward">
          <div class="scratch-reward-icon">${coupon.icon || '🎁'}</div>
          <div class="scratch-reward-info">
            <div class="scratch-reward-title">${coupon.title}</div>
            <div class="scratch-reward-sub">${coupon.subtitle}</div>
          </div>
          <div class="scratch-redeemed-stamp">VALID ANYTIME ✨</div>
        </div>
        <canvas class="scratch-canvas" id="scratch-canvas-${index}"></canvas>
      `;

      container.appendChild(card);
      // Initialize scratch canvas on next frame
      requestAnimationFrame(() => {
        this.setupScratchCanvas(index);
      });
    });
  }

  setupScratchCanvas(index) {
    const canvas = document.getElementById(`scratch-canvas-${index}`);
    const card = document.getElementById(`scratch-card-${index}`);
    if (!canvas || !card) return;

    const ctx = canvas.getContext('2d');
    const rect = card.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw Metallic Scratch Coating (Silver / Holographic Rose Gold)
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#E2E8F0');
    grad.addColorStop(0.3, '#CBD5E1');
    grad.addColorStop(0.6, '#FBCFE8');
    grad.addColorStop(1, '#E2E8F0');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Overlay text on scratch coating
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Scratch with finger to reveal ✨', canvas.width / 2, canvas.height / 2);

    let isDrawing = false;
    let scratchedPixels = 0;
    let isRevealed = false;

    const scratch = (clientX, clientY) => {
      if (isRevealed) return;
      const cRect = canvas.getBoundingClientRect();
      const x = clientX - cRect.left;
      const y = clientY - cRect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      window.soundEngine.playPop();

      // Check percentage scratched every few strokes
      scratchedPixels++;
      if (scratchedPixels % 12 === 0) {
        this.checkScratchedPercent(ctx, canvas, () => {
          isRevealed = true;
          card.classList.add('revealed');
          canvas.style.opacity = '0';
          setTimeout(() => { canvas.style.display = 'none'; }, 400);
          window.soundEngine.playChime(1.3);
          window.particleEngine.burstAt(clientX, clientY, 10);
        });
      }
    };

    // Events
    canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e.clientX, e.clientY); });
    window.addEventListener('mouseup', () => { isDrawing = false; });
    canvas.addEventListener('mousemove', (e) => { if (isDrawing) scratch(e.clientX, e.clientY); });

    canvas.addEventListener('touchstart', (e) => {
      isDrawing = true;
      if (e.touches.length > 0) scratch(e.touches[0].clientX, e.touches[0].clientY);
    });
    window.addEventListener('touchend', () => { isDrawing = false; });
    canvas.addEventListener('touchmove', (e) => {
      if (isDrawing && e.touches.length > 0) {
        e.preventDefault();
        scratch(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });
  }

  checkScratchedPercent(ctx, canvas, onComplete) {
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let clearCount = 0;
      const sampleStep = 8; // Performance optimization

      for (let i = 3; i < data.length; i += sampleStep * 4) {
        if (data[i] === 0) {
          clearCount++;
        }
      }

      const totalSampled = data.length / (sampleStep * 4);
      const percent = clearCount / totalSampled;

      if (percent > 0.40) { // 40% cleared triggers full reward reveal
        onComplete();
      }
    } catch (e) {
      // In case of any cross-origin canvas security flag fallback
      onComplete();
    }
  }
}

window.vaultEngine = new VaultEngine();
