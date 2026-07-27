// VoiceSynthesisService.ts - Natural Human Speech Synthesis Manager

import { textToSpeechService, TTSCallbacks, TTSConfig } from './TextToSpeechService';

export class VoiceSynthesisService {
  public isSupported(): boolean {
    return textToSpeechService.isSupported();
  }

  public speak(text: string, config?: Partial<TTSConfig>, callbacks?: TTSCallbacks) {
    const defaultConfig: TTSConfig = {
      gender: config?.gender || 'female',
      rate: config?.rate ?? 1.0,
      pitch: config?.pitch ?? 1.0,
      lang: config?.lang || 'ur-PK',
    };
    textToSpeechService.speak(text, defaultConfig, callbacks);
  }

  public stop() {
    textToSpeechService.stop();
  }

  public isSpeaking(): boolean {
    return textToSpeechService.isSpeaking();
  }
}

export const voiceSynthesisService = new VoiceSynthesisService();
