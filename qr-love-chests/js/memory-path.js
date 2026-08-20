/**
 * 🌸 CHEST 1: INTERACTIVE MEMORY WALKING PATH ENGINE
 */
class MemoryPathEngine {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 0;
    this.milestones = [];
    this.avatar = null;
    this.scrollArea = null;
    this.progressBar = null;
    this.progressText = null;
    this.isWalking = false;
  }

  init() {
    const config = window.GAME_CONFIG.memoryPath;
    this.milestones = config.milestones;
    this.totalSteps = this.milestones.length;

    this.scrollArea = document.getElementById('pathScrollArea');
    this.progressBar = document.getElementById('pathProgressBar');
    this.progressText = document.getElementById('pathProgressText');
    this.avatar = document.getElementById('walkingAvatar');

    this.renderTrail();
    this.updateProgress();

    // Event listener for Walk Button
    const walkBtn = document.getElementById('walkBtn');
    if (walkBtn) {
      walkBtn.onclick = () => this.stepForward();
    }
  }

  renderTrail() {
    const trailContainer = document.getElementById('trailContainer');
    if (!trailContainer) return;
    trailContainer.innerHTML = '';

    // Re-append avatar
    this.avatar = document.createElement('div');
    this.avatar.id = 'walkingAvatar';
    this.avatar.className = 'walking-avatar';
    this.avatar.innerHTML = '<div class="avatar-body">🚶‍♀️</div>';
    trailContainer.appendChild(this.avatar);

    const stepHeight = 220; // Vertical spacing between milestones
    trailContainer.style.height = `${(this.totalSteps + 1) * stepHeight + 100}px`;

    // Render Milestones with alternating left/right zig-zag
    this.milestones.forEach((m, idx) => {
      const topPos = (idx + 1) * stepHeight;
      const isLeft = idx % 2 === 0;
      const leftPos = isLeft ? 80 : 280;

      const node = document.createElement('div');
      node.className = `milestone-node ${idx === 0 ? 'active-target' : ''}`;
      node.id = `milestone-node-${idx}`;
      node.style.top = `${topPos}px`;
      node.style.left = `${leftPos}px`;

      node.innerHTML = `
        <div class="milestone-pin">
          <span>${m.sticker || '🌸'}</span>
          <div class="milestone-badge">${idx + 1}</div>
        </div>
        <div class="milestone-label">${m.title}</div>
      `;

      node.onclick = () => {
        this.walkToStep(idx);
        this.openPolaroid(idx);
      };

      trailContainer.appendChild(node);

      // Add cute decorative scenery nearby
      const decor = document.createElement('div');
      decor.className = 'scenery-decor';
      decor.innerText = ['🌸', '✨', '🌼', '🌷', '🌿', '☁️'][idx % 6];
      decor.style.top = `${topPos - 50}px`;
      decor.style.left = `${isLeft ? 260 : 60}px`;
      trailContainer.appendChild(decor);
    });

    // Position Avatar initially at start
    this.positionAvatarAt(0);
  }

  positionAvatarAt(stepIndex) {
    if (!this.avatar) return;
    const stepHeight = 220;
    const topPos = (stepIndex + 1) * stepHeight;
    const isLeft = stepIndex % 2 === 0;
    const leftPos = isLeft ? 80 : 280;

    this.avatar.style.top = `${topPos}px`;
    this.avatar.style.left = `${leftPos}px`;

    // Auto scroll the area to keep avatar in view
    if (this.scrollArea) {
      this.scrollArea.scrollTo({
        top: topPos - 200,
        behavior: 'smooth'
      });
    }
  }

  stepForward() {
    if (this.isWalking) return;
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.walkToStep(this.currentStep);
      this.openPolaroid(this.currentStep);
    } else {
      // Reached End of Path
      this.openCelebrationModal();
    }
  }

  walkToStep(stepIndex) {
    this.isWalking = true;
    this.currentStep = stepIndex;
    this.avatar.classList.add('walking');
    window.soundEngine.playStep();

    this.positionAvatarAt(stepIndex);
    this.updateProgress();

    setTimeout(() => {
      if (this.avatar) this.avatar.classList.remove('walking');
      this.isWalking = false;
    }, 600);
  }

  updateProgress() {
    const percent = Math.round(((this.currentStep + 1) / this.totalSteps) * 100);
    if (this.progressBar) this.progressBar.style.width = `${percent}%`;
    if (this.progressText) {
      this.progressText.innerText = `Step ${this.currentStep + 1} of ${this.totalSteps} (${percent}%)`;
    }

    // Highlight nodes
    this.milestones.forEach((_, idx) => {
      const node = document.getElementById(`milestone-node-${idx}`);
      if (node) {
        if (idx <= this.currentStep) {
          node.classList.add('visited');
          node.classList.remove('active-target');
        } else if (idx === this.currentStep + 1) {
          node.classList.add('active-target');
        } else {
          node.classList.remove('visited', 'active-target');
        }
      }
    });
  }

  openPolaroid(index) {
    const m = this.milestones[index];
    if (!m) return;

    window.soundEngine.playChime(1.1);
    window.particleEngine.burstAt(window.innerWidth / 2, window.innerHeight / 2, 10);

    const modal = document.getElementById('polaroidModal');
    const photoFrame = document.getElementById('polaroidPhotoFrame');
    const tag = document.getElementById('polaroidTag');
    const title = document.getElementById('polaroidTitle');
    const desc = document.getElementById('polaroidDesc');

    tag.innerText = m.date || `Memory #${index + 1}`;
    title.innerText = m.title;
    desc.innerText = `"${m.description}"`;
    photoFrame.innerHTML = `<img class="polaroid-img" src="${m.image}" alt="${m.title}">`;

    modal.classList.add('open');
  }

  openCelebrationModal() {
    window.soundEngine.playFanfare();
    window.particleEngine.confettiExplosion();

    const modal = document.getElementById('pathCompleteModal');
    if (modal) {
      modal.classList.add('open');
    }
  }
}

window.memoryPathEngine = new MemoryPathEngine();
