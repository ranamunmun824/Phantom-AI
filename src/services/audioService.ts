class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  isAudioEnabled(): boolean {
    return !this.isMuted;
  }

  toggleSound(enable?: boolean): boolean {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (enable !== undefined) {
      this.isMuted = !enable;
    } else {
      this.isMuted = !this.isMuted;
    }

    if (this.isMuted) {
      this.stopAtmosphere();
    } else {
      this.startAtmosphere();
    }

    return !this.isMuted;
  }

  // Soft atmospheric eerie drone (60Hz + 63Hz subtle binaural frequency)
  private startAtmosphere() {
    if (this.isMuted || !this.ctx) return;
    this.stopAtmosphere();

    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      // Gentle fade in
      this.ambientGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(58.5, this.ctx.currentTime); // Slight detune for haunting pulse

      this.osc1.connect(this.ambientGain);
      this.osc2.connect(this.ambientGain);
      this.ambientGain.connect(filter);
      filter.connect(this.ctx.destination);

      this.osc1.start();
      this.osc2.start();
    } catch (err) {
      console.warn('Audio synthesis note:', err);
    }
  }

  private stopAtmosphere() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      } catch {
        // noop
      }
    }
    setTimeout(() => {
      try {
        this.osc1?.stop();
        this.osc2?.stop();
      } catch {
        // noop
      }
      this.osc1 = null;
      this.osc2 = null;
      this.ambientGain = null;
    }, 600);
  }

  // Key click sound for terminal and typing effects
  playKeyClick() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // noop
    }
  }

  // Peaceful soft glass bell for remembrance card actions
  playRemembranceChime() {
    if (this.isMuted || !this.ctx) return;
    try {
      const frequencies = [528, 660, 792]; // Solfeggio / meditative notes
      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.08 + 2.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 2.6);
      });
    } catch {
      // noop
    }
  }

  // Sudden chilling static pulse for summoning
  playSpectralPulse() {
    if (this.isMuted || !this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(this.ctx.currentTime + 0.25);
    } catch {
      // noop
    }
  }
}

export const audioService = new AudioService();
