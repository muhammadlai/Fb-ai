import { AvatarType } from '../components/ThreeDAvatarCanvas';

export class AvatarVoiceEngine {
  private static instance: AvatarVoiceEngine;
  private isSpeaking = false;
  private speechUtterance: SpeechSynthesisUtterance | null = null;
  private volumeInterval: any = null;

  public onStateChange?: (isSpeaking: boolean, volume: number) => void;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Warmup voices
      window.speechSynthesis.getVoices();
    }
  }

  public static getInstance(): AvatarVoiceEngine {
    if (!AvatarVoiceEngine.instance) {
      AvatarVoiceEngine.instance = new AvatarVoiceEngine();
    }
    return AvatarVoiceEngine.instance;
  }

  public speak(text: string, avatarType: AvatarType, onEndCallback?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEndCallback) onEndCallback();
      return;
    }

    // Cancel current speech
    this.stop();

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.speechUtterance = utterance;

    // Apply pitch & rate based on avatarType
    if (avatarType === 'professional_female') {
      utterance.pitch = 1.25;
      utterance.rate = 1.0;
    } else if (avatarType === 'professional_male') {
      utterance.pitch = 0.85;
      utterance.rate = 0.98;
    } else if (avatarType === 'futuristic_robot') {
      utterance.pitch = 0.5;
      utterance.rate = 1.1;
    } else if (avatarType === 'holographic_ai') {
      utterance.pitch = 1.4;
      utterance.rate = 1.05;
    }

    // Match best voice persona
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const isFemale = avatarType === 'professional_female' || avatarType === 'holographic_ai';
      const matchedVoice = voices.find((v) =>
        v.lang.startsWith('en') &&
        (isFemale
          ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('google us english')
          : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('alex') || v.name.toLowerCase().includes('daniel'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (matchedVoice) utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStateChange) this.onStateChange(true, 0.5);

      // Simulate dynamic volume pulses for mouth lip sync
      this.volumeInterval = setInterval(() => {
        if (this.isSpeaking && this.onStateChange) {
          const simulatedVol = 0.2 + Math.random() * 0.8;
          this.onStateChange(true, simulatedVol);
        }
      }, 120);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.volumeInterval) clearInterval(this.volumeInterval);
      if (this.onStateChange) this.onStateChange(false, 0);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (this.volumeInterval) clearInterval(this.volumeInterval);
      if (this.onStateChange) this.onStateChange(false, 0);
      if (onEndCallback) onEndCallback();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis trigger blocked or failed:', err);
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    if (this.volumeInterval) clearInterval(this.volumeInterval);
    if (this.onStateChange) this.onStateChange(false, 0);
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}
