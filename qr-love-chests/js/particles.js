/**
 * ✨ ROMANTIC PARTICLE & CONFETTI ENGINE
 */
class ParticleEngine {
  constructor() {
    this.container = null;
  }

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'particle-container';
      this.container.style.position = 'fixed';
      this.container.style.inset = '0';
      this.container.style.pointerEvents = 'none';
      this.container.style.zIndex = '9999';
      this.container.style.overflow = 'hidden';
      document.body.appendChild(this.container);
    }
  }

  // Floating background ambient hearts
  startFloatingHearts() {
    this.init();
    setInterval(() => {
      if (document.hidden) return;
      this.createFloatingHeart();
    }, 1400);
  }

  createFloatingHeart() {
    const heart = document.createElement('div');
    const emojis = ['💖', '🌸', '✨', '💕', '🧸', '💫'];
    heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.position = 'absolute';
    heart.style.left = Math.random() * 95 + 'vw';
    heart.style.bottom = '-20px';
    heart.style.fontSize = (Math.random() * 14 + 14) + 'px';
    heart.style.opacity = Math.random() * 0.4 + 0.3;
    heart.style.transition = `transform ${Math.random() * 4 + 4}s linear, opacity 1s`;
    heart.style.transform = `translateY(0) rotate(0deg)`;

    this.container.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = `translateY(-110vh) rotate(${Math.random() * 360 - 180}deg)`;
    });

    setTimeout(() => {
      heart.remove();
    }, 7000);
  }

  // Tap/Click sparkle burst
  burstAt(x, y, count = 8) {
    this.init();
    const items = ['💖', '✨', '🌸', '⭐', '💕'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.innerText = items[Math.floor(Math.random() * items.length)];
      p.style.position = 'absolute';
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.fontSize = (Math.random() * 10 + 14) + 'px';
      p.style.userSelect = 'none';
      p.style.transform = 'translate(-50%, -50%) scale(1)';
      p.style.transition = 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      this.container.appendChild(p);

      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5);
      const dist = Math.random() * 70 + 40;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;

      requestAnimationFrame(() => {
        p.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`;
        p.style.opacity = '0';
      });

      setTimeout(() => p.remove(), 750);
    }
  }

  // Grand Confetti Explosion
  confettiExplosion() {
    this.init();
    const colors = ['#FF6B8B', '#FF8E53', '#FFAAA6', '#FFD3B6', '#A8E6CF', '#DED2F9', '#FFD166'];
    const count = 65;

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      const isCircle = Math.random() > 0.5;
      const size = Math.random() * 8 + 6;

      confetti.style.position = 'absolute';
      confetti.style.left = '50vw';
      confetti.style.top = '50vh';
      confetti.style.width = size + 'px';
      confetti.style.height = (isCircle ? size : size * 1.6) + 'px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = isCircle ? '50%' : '2px';
      confetti.style.transform = 'translate(-50%, -50%)';
      confetti.style.opacity = '1';
      confetti.style.transition = `all ${Math.random() * 1.5 + 1.2}s cubic-bezier(0.25, 1, 0.5, 1)`;

      this.container.appendChild(confetti);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 260 + 100;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 100; // slight upward bias
      const rot = Math.random() * 720 - 360;

      requestAnimationFrame(() => {
        confetti.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rot}deg)`;
        confetti.style.opacity = '0';
      });

      setTimeout(() => confetti.remove(), 2500);
    }
  }
}

window.particleEngine = new ParticleEngine();
