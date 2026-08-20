/**
 * 🎵 RETRO 8-BIT & CHIPTUNE AUDIO SYNTHESIZER (Mario / Terraria Style)
 */
class RetroSoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmPlaying = false;
    this.bgmInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // 🎮 Classic 8-Bit Mario Jump Sound (Rising Square Wave)
  playJump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';

    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // 🪙 Classic Coin "B-Ling!" Sound (Two rapid high square notes)
  playCoin() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';

    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
    osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.07); // E6

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime + 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // 📦 Block Bump / Hit Sound
  playBlockBump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';

    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // 🍄 Power-Up / Level Up Jingle (Mario 1-Up arpeggio)
  playPowerUp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [330, 392, 659, 523, 587, 784];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.06 + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.06);
      osc.stop(this.ctx.currentTime + i * 0.06 + 0.1);
    });
  }

  // 🏰 Stage Clear / Chest Fanfare
  playFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const melody = [
      { freq: 523.25, time: 0.00, dur: 0.12 },
      { freq: 659.25, time: 0.14, dur: 0.12 },
      { freq: 783.99, time: 0.28, dur: 0.12 },
      { freq: 1046.5, time: 0.42, dur: 0.28 },
      { freq: 880.00, time: 0.72, dur: 0.14 },
      { freq: 1046.5, time: 0.88, dur: 0.50 }
    ];

    melody.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(n.freq, this.ctx.currentTime + n.time);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + n.time + n.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + n.time);
      osc.stop(this.ctx.currentTime + n.time + n.dur);
    });
  }

  playPop() {
    this.playBlockBump();
  }

  playChestOpen() {
    this.playPowerUp();
  }

  playChime() {
    this.playCoin();
  }

  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc.frequency.setValueAtTime(90, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);
  }

  // 8-Bit Chiptune Ambient BGM (Upbeat Mario / Terraria Day Theme)
  startAmbientMusic() {
    if (this.bgmPlaying || this.muted) return;
    this.init();
    if (!this.ctx) return;

    const pattern = [
      { f: 659.25, d: 0.1 }, { f: 659.25, d: 0.1 }, { f: 0, d: 0.1 }, { f: 659.25, d: 0.1 },
      { f: 0, d: 0.1 }, { f: 523.25, d: 0.1 }, { f: 659.25, d: 0.14 }, { f: 783.99, d: 0.2 },
      { f: 0, d: 0.2 }, { f: 392.00, d: 0.2 }
    ];

    let step = 0;
    this.bgmPlaying = true;

    const playNote = () => {
      if (!this.bgmPlaying || this.muted || !this.ctx) return;
      const note = pattern[step];
      if (note.f > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + note.d);
      }
      step = (step + 1) % pattern.length;
    };

    this.bgmInterval = setInterval(playNote, 160);
  }
}

window.soundEngine = new RetroSoundEngine();
