// Sound system for cyberpunk themes
export class CyberpunkSoundSystem {
  private audioContext: AudioContext | null = null;
  private readonly sounds: Map<string, AudioBuffer> = new Map();
  private volume: number = 0.7;
  private enabled: boolean = true;
  private initialized: boolean = false;

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeAudioContext();
      this.initialized = true;
    }
  }

  private async initializeAudioContext() {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  async loadSound(name: string, url: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(name, audioBuffer);
    } catch (error) {
      console.warn(`Failed to load sound ${name}:`, error);
    }
  }

  playSound(name: string, volume: number = 1): void {
    if (!this.enabled || !this.audioContext || !this.sounds.has(name)) return;

    const audioBuffer = this.sounds.get(name)!;
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = audioBuffer;
    gainNode.gain.value = this.volume * volume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start();
  }

  // Generate synthetic cyberpunk sounds
  playClickSound(): void {
    this.playSyntheticSound(800, 0.1, 'square');
  }

  playSuccessSound(): void {
    this.playSyntheticSound(600, 0.2, 'sine');
    setTimeout(() => this.playSyntheticSound(800, 0.2, 'sine'), 100);
  }

  playErrorSound(): void {
    this.playSyntheticSound(300, 0.3, 'sawtooth');
  }

  playNotificationSound(): void {
    this.playSyntheticSound(1000, 0.1, 'sine');
    setTimeout(() => this.playSyntheticSound(1200, 0.1, 'sine'), 150);
  }

  playTransactionSound(): void {
    // Coin-like sound
    this.playSyntheticSound(880, 0.15, 'sine');
    setTimeout(() => this.playSyntheticSound(1760, 0.1, 'sine'), 80);
  }

  playKeyboardClick(): void {
    this.playSyntheticSound(1200, 0.05, 'square');
  }

  private playSyntheticSound(
    frequency: number,
    duration: number,
    waveType: OscillatorType = 'sine'
  ): void {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, this.audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  // Ambient sound generation
  startAmbientLoop(theme: string): void {
    if (!this.enabled) return;

    const ambientSounds = {
      'blade-runner': () => this.generateRainSound(),
      'cyberpunk-2077': () => this.generateCitySound(),
      matrix: () => this.generateDataSound(),
      'ghost-shell': () => this.generateMinimalSound(),
    };

    const generator = ambientSounds[theme as keyof typeof ambientSounds];
    if (generator) {
      generator();
      // Restart after random interval
      setTimeout(() => this.startAmbientLoop(theme), 10000 + Math.random() * 20000);
    }
  }

  private generateRainSound(): void {
    // Simulate rain drops with white noise bursts
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playWhiteNoise(0.1, 0.05);
      }, Math.random() * 2000);
    }
  }

  private generateCitySound(): void {
    // Distant traffic-like low frequency
    this.playSyntheticSound(80, 1, 'sawtooth');
    setTimeout(() => this.playSyntheticSound(90, 0.8, 'sawtooth'), 1200);
  }

  private generateDataSound(): void {
    // Digital bleeps and bloops
    const frequencies = [440, 550, 660, 880];
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playSyntheticSound(freq, 0.1, 'square');
      }, index * 200);
    });
  }

  private generateMinimalSound(): void {
    // Subtle high-frequency tones
    this.playSyntheticSound(2000, 0.5, 'sine');
  }

  private playWhiteNoise(duration: number, volume: number): void {
    if (!this.audioContext) return;

    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    gainNode.gain.value = this.volume * volume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start();
  }
}

// Singleton instance
export const soundSystem = new CyberpunkSoundSystem();

// React hook for sound integration
export const useCyberpunkSound = () => {
  const playClick = () => soundSystem.playClickSound();
  const playSuccess = () => soundSystem.playSuccessSound();
  const playError = () => soundSystem.playErrorSound();
  const playNotification = () => soundSystem.playNotificationSound();
  const playTransaction = () => soundSystem.playTransactionSound();
  const playKeyboard = () => soundSystem.playKeyboardClick();

  return {
    playClick,
    playSuccess,
    playError,
    playNotification,
    playTransaction,
    playKeyboard,
    setVolume: (volume: number) => soundSystem.setVolume(volume),
    setEnabled: (enabled: boolean) => soundSystem.setEnabled(enabled),
    startAmbient: (theme: string) => soundSystem.startAmbientLoop(theme),
  };
};
