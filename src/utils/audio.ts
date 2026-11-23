class MusicPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private audioCtx: AudioContext | null = null;
  private synthInterval: number | null = null;
  private isSynthesizing: boolean = false;
  private gainNode: GainNode | null = null;

  public init(musicSrc: string = '/music.mp3') {
    if (typeof window === 'undefined') return;
    if (!this.audio) {
      this.audio = new Audio(musicSrc);
      this.audio.loop = true;
      // Unduh musik hanya saat diputar (tombol buka undangan), hemat data transfer
      this.audio.preload = 'none';
    }
  }

  public async play(): Promise<boolean> {
    this.isPlaying = true;
    if (!this.audio) {
      this.init();
    }

    try {
      if (this.audio) {
        await this.audio.play();
        return true;
      }
    } catch {
      // Audio element failed or placeholder is not a playable mp3
      // Fallback gracefully to Web Audio romantic acoustic synth
      this.startAmbientRomanceSynth();
      return true;
    }
    return false;
  }

  public pause() {
    this.isPlaying = false;
    if (this.audio) {
      this.audio.pause();
    }
    this.stopAmbientRomanceSynth();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getPlayingStatus(): boolean {
    return this.isPlaying;
  }

  // Gentle romantic warm acoustic arpeggiator fallback
  private startAmbientRomanceSynth() {
    if (this.isSynthesizing) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      this.audioCtx = new AudioCtxClass();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      this.gainNode.connect(this.audioCtx.destination);

      this.isSynthesizing = true;

      // Romantic chord notes (frequencies in Hz): E major - G#m - A - B
      const chordProgressions = [
        [329.63, 392.00, 493.88, 659.25], // Em9
        [293.66, 370.00, 440.00, 587.33], // Dadd9
        [261.63, 329.63, 392.00, 523.25], // Cmaj7
        [246.94, 329.63, 370.00, 493.88], // Bm7
      ];

      let progIndex = 0;
      let noteIndex = 0;

      const playNextNote = () => {
        if (!this.isSynthesizing || !this.audioCtx || !this.gainNode) return;
        const currentChord = chordProgressions[progIndex];
        const freq = currentChord[noteIndex];

        const osc = this.audioCtx.createOscillator();
        const noteGain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        const now = this.audioCtx.currentTime;
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.05, now + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 1.9);

        noteIndex = (noteIndex + 1) % currentChord.length;
        if (noteIndex === 0) {
          progIndex = (progIndex + 1) % chordProgressions.length;
        }
      };

      playNextNote();
      this.synthInterval = window.setInterval(playNextNote, 600);
    } catch {
      // Ignore web audio limitations in restricted contexts
    }
  }

  private stopAmbientRomanceSynth() {
    this.isSynthesizing = false;
    if (this.synthInterval !== null) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.audioCtx && this.gainNode) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.3);
        setTimeout(() => {
          this.audioCtx?.close();
          this.audioCtx = null;
        }, 350);
      } catch {
        this.audioCtx = null;
      }
    }
  }
}

export const musicPlayer = new MusicPlayer();
