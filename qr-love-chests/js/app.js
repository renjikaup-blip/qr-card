/**
 * 🌟 MAIN APP CONTROLLER
 */

// ── Full-Screen Photo Lightbox ──────────────────────────────
window.openLightbox = (src, caption) => {
  const overlay = document.getElementById('lightboxOverlay');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  if (!overlay || !img) return;
  img.src = src;
  if (cap) cap.innerText = caption || '';
  overlay.style.display = 'flex';
};

window.closeLightbox = () => {
  const overlay = document.getElementById('lightboxOverlay');
  if (overlay) overlay.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
  const config = window.GAME_CONFIG;

  // 1. Ambient Floating Hearts
  window.particleEngine.startFloatingHearts();

  // 2. Audio & Music Mute Toggle
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  if (musicToggleBtn) {
    musicToggleBtn.onclick = () => {
      window.soundEngine.init();
      const isMuted = window.soundEngine.toggleMute();
      musicToggleBtn.innerText = isMuted ? '🔇' : '🎵';
    };
  }

  // Start background ambient music on first user interaction anywhere
  const startAudioOnFirstClick = () => {
    window.soundEngine.init();
    if (config.music && config.music.enabled) {
      window.soundEngine.startAmbientMusic();
    }
    document.removeEventListener('click', startAudioOnFirstClick);
    document.removeEventListener('touchstart', startAudioOnFirstClick, { once: true });
  };
  document.addEventListener('click', startAudioOnFirstClick, { once: true });
  document.addEventListener('touchstart', startAudioOnFirstClick, { once: true });

  // 3. Passcode Screen Management
  let enteredPin = '';
  const pinDots = document.querySelectorAll('.pin-dot');
  const lockScreen = document.getElementById('lockScreen');

  const updatePinDisplay = () => {
    pinDots.forEach((dot, idx) => {
      if (idx < enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled', 'error');
      }
    });
  };

  const startRPGGame = () => {
    // Hide lock screen, show game
    if (lockScreen) {
      lockScreen.style.display = 'none';
    }
    const gameScreen = document.getElementById('rpgGameScreen');
    if (gameScreen) {
      gameScreen.style.display = '';
    }
    if (window.romanticRPGGame) {
      window.romanticRPGGame.start();
    }
  };

  // Always force lock screen visible on page load
  if (lockScreen) {
    lockScreen.style.display = 'flex';
  }

  const checkPin = () => {
    if (enteredPin === config.passcode.code) {
      // Success!
      window.soundEngine.playFanfare();
      window.particleEngine.confettiExplosion();
      setTimeout(() => {
        startRPGGame();
      }, 500);
    } else {
      // Error
      window.soundEngine.playError();
      pinDots.forEach(dot => dot.classList.add('error'));
      setTimeout(() => {
        enteredPin = '';
        updatePinDisplay();
      }, 600);
    }
  };

  // Keypad click listeners
  const keypadButtons = document.querySelectorAll('.key-btn');
  keypadButtons.forEach(btn => {
    btn.onclick = () => {
      const val = btn.dataset.val;
      window.soundEngine.playPop();

      const targetLength = (config.passcode && config.passcode.code) ? config.passcode.code.length : 6;
      if (val === 'clear') {
        enteredPin = '';
        updatePinDisplay();
      } else if (val === 'back') {
        enteredPin = enteredPin.slice(0, -1);
        updatePinDisplay();
      } else if (val !== undefined && enteredPin.length < targetLength) {
        enteredPin += val;
        updatePinDisplay();
        if (enteredPin.length === targetLength) {
          setTimeout(checkPin, 150);
        }
      }
    };
  });

  // Check if Passcode is enabled
  if (!config.passcode || !config.passcode.enabled) {
    startRPGGame();
  }

  // 4. Photo Uploader Manager Modal
  const photoUploadBtn = document.getElementById('photoUploadBtn');
  const photoUploadModal = document.getElementById('photoUploadModal');
  const photoUploadList = document.getElementById('photoUploadList');

  const renderPhotoUploadList = () => {
    if (!photoUploadList) return;
    photoUploadList.innerHTML = '';

    const stops = (window.RPG_CONFIG && window.RPG_CONFIG.memoryRoad) ? window.RPG_CONFIG.memoryRoad.stops : [];
    stops.forEach((stop, index) => {
      const savedPhoto = localStorage.getItem(`qr_memory_photo_${index}`) || stop.image;
      const card = document.createElement('div');
      card.style.cssText = 'background:#FFF5F7; border:1.5px solid #FFD1DC; border-radius:14px; padding:12px; display:flex; align-items:center; gap:12px;';

      card.innerHTML = `
        <img id="preview_photo_${index}" src="${savedPhoto}" style="width:54px; height:54px; object-fit:cover; border-radius:10px; border:1px solid #FF8FAB; background:white; cursor:zoom-in;" onclick="window.openLightbox(this.src, '${stop.title.replace(/'/g, "\\'")}')">
        <div style="flex:1;">
          <div style="font-weight:700; font-size:12px; color:#4A3E5C; margin-bottom:2px;">${stop.title}</div>
          <div style="font-size:10px; color:#8E80A0;">${stop.date}</div>
          <label style="display:inline-block; margin-top:6px; background:#FF6B8B; color:white; font-size:10px; font-weight:700; padding:4px 10px; border-radius:12px; cursor:pointer;">
            📷 Choose Photo
            <input type="file" accept="image/*" data-index="${index}" class="photo-file-input" style="display:none;">
          </label>
        </div>
      `;
      photoUploadList.appendChild(card);
    });

    // Attach file change listeners
    document.querySelectorAll('.photo-file-input').forEach(input => {
      input.onchange = (e) => {
        const file = e.target.files[0];
        const idx = e.target.dataset.index;
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          // Compress the image via canvas before saving to localStorage
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 800; // max width/height in px
            let w = img.width;
            let h = img.height;
            if (w > h && w > MAX_SIZE) { h = Math.round(h * MAX_SIZE / w); w = MAX_SIZE; }
            else if (h > MAX_SIZE) { w = Math.round(w * MAX_SIZE / h); h = MAX_SIZE; }
            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.75);

            try {
              localStorage.setItem(`qr_memory_photo_${idx}`, compressed);
              const preview = document.getElementById(`preview_photo_${idx}`);
              if (preview) preview.src = compressed;
              window.soundEngine.playCoin();
              window.particleEngine.burstAt(window.innerWidth / 2, window.innerHeight / 2, 6);
            } catch (err) {
              alert('❌ Photo too large to save! Try a smaller image.');
            }
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      };
    });
  };

  if (photoUploadBtn && photoUploadModal) {
    photoUploadBtn.onclick = () => {
      window.soundEngine.playPop();
      renderPhotoUploadList();
      photoUploadModal.classList.add('open');
    };
  }

  // 5. Modal Close Buttons
  document.querySelectorAll('.modal-close').forEach(el => {
    el.onclick = () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
      window.soundEngine.playPop();
      if (window.miniGameEngine) window.miniGameEngine.stop();
    };
  });

  document.querySelectorAll('.modal-overlay').forEach(el => {
    el.onclick = (e) => {
      if (e.target === el) {
        el.classList.remove('open');
        window.soundEngine.playPop();
        if (window.miniGameEngine) window.miniGameEngine.stop();
      }
    };
  });
});
