// TextToSpeechService.ts - Web SpeechSynthesis Engine with Lip Sync Events

export interface TTSCallbacks {
  onStart?: () => void;
  onBoundary?: (charIndex: number, length: number) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onLipSyncFrame?: (volume: number) => void;
}

export interface TTSConfig {
  gender: 'female' | 'male';
  rate: number;
  pitch: number;
  lang: string;
}

class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private animFrameId: number | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return Boolean(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }

  public speak(
    text: string,
    config: TTSConfig = { gender: 'female', rate: 1.0, pitch: 1.0, lang: 'en-US' },
    callbacks: TTSCallbacks = {}
  ) {
    if (!this.synth) {
      if (callbacks.onError) callbacks.onError('SpeechSynthesis is not supported.');
      return;
    }

    this.stop();

    // Clean text for speech output
    const cleanText = text
      .replace(/[*#`_~]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/```[\s\S]*?```/g, 'Code block generated and displayed on screen.');

    if (!cleanText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.lang = config.lang;

    // Detect if text contains Urdu script or common Roman Urdu keywords
    const isUrduText =
      /[\u0600-\u06FF]/.test(cleanText) ||
      /\b(main|aap|sir|aitzaz|assalam|kaise|hoon|hai|kya|madad|karun|theek|bilkul|ji|karta|shukriya|bohot|khuda|hafiz|subah|shaam)\b/i.test(
        cleanText
      );

    const targetLang = config.lang || (isUrduText ? 'ur-PK' : 'en-US');
    utterance.lang = targetLang;

    // Load available voices and pick best natural Pakistani / Urdu / closest Hindi / soft voice match
    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      if (isUrduText || targetLang.startsWith('ur')) {
        // Priority 1: Exact Pakistani Urdu voice (ur-PK)
        let selectedVoice = voices.find(
          (v) => v.lang.toLowerCase() === 'ur-pk' || v.lang.toLowerCase().startsWith('ur')
        );

        // Priority 2: Hindi voice (hi-IN / hi) which phonetically pronounces Roman Urdu/Urdu accurately and smoothly
        if (!selectedVoice) {
          selectedVoice = voices.find(
            (v) => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi')
          );
        }

        // Priority 3: Indian English (en-IN) or UK English (en-GB) which pronounces South Asian honorifics/names smoothly
        if (!selectedVoice) {
          selectedVoice = voices.find(
            (v) => v.lang.toLowerCase().includes('in') || v.lang.toLowerCase().includes('gb')
          );
        }

        // Priority 4: Soft female/male natural voice
        if (!selectedVoice) {
          selectedVoice = voices.find((v) =>
            config.gender === 'female'
              ? v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google')
              : v.name.toLowerCase().includes('david')
          );
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      } else {
        // Standard English voice search
        const matchesGender = voices.find((v) =>
          config.gender === 'female'
            ? v.name.toLowerCase().includes('natural') ||
              v.name.toLowerCase().includes('zira') ||
              v.name.toLowerCase().includes('samantha') ||
              v.name.toLowerCase().includes('google us english')
            : v.name.toLowerCase().includes('male') ||
              v.name.toLowerCase().includes('david') ||
              v.name.toLowerCase().includes('alex')
        );
        if (matchesGender) utterance.voice = matchesGender;
      }
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
      if (callbacks.onStart) callbacks.onStart();
      this.startSimulatedLipSync(callbacks);
    };

    utterance.onboundary = (e) => {
      if (callbacks.onBoundary) callbacks.onBoundary(e.charIndex, e.charLength || 1);
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.stopSimulatedLipSync();
      if (callbacks.onEnd) callbacks.onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('TTS Speech error:', e);
      this.isSpeakingState = false;
      this.stopSimulatedLipSync();
      if (callbacks.onError) callbacks.onError('Speech playback failed.');
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  private startSimulatedLipSync(callbacks: TTSCallbacks) {
    if (!callbacks.onLipSyncFrame) return;

    const animate = () => {
      if (!this.isSpeakingState) return;
      // Generate realistic mouth opening volume curve for 3D/2D Avatar mouth sync
      const time = Date.now() / 120;
      const vol = Math.abs(Math.sin(time) * 0.7 + Math.cos(time * 2.3) * 0.3);
      callbacks.onLipSyncFrame?.(vol);
      this.animFrameId = requestAnimationFrame(animate);
    };
    this.animFrameId = requestAnimationFrame(animate);
  }

  private stopSimulatedLipSync() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public stop() {
    this.stopSimulatedLipSync();
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeakingState = false;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const textToSpeechService = new TextToSpeechService();
