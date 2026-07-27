// VoiceRecognitionService.ts - Web Speech API Speech-to-Text Manager

export interface VoiceRecognitionCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

class VoiceRecognitionService {
  private recognition: any = null;
  private isListeningState = false;
  private callbacks: VoiceRecognitionCallbacks = {};
  private lang = 'en-US';

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API is not supported in this browser environment.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListeningState = true;
      if (this.callbacks.onStart) this.callbacks.onStart();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const currentText = finalTranscript || interimTranscript;
      const isFinal = Boolean(finalTranscript);

      if (this.callbacks.onTranscript) {
        this.callbacks.onTranscript(currentText, isFinal);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error event:', event.error);
      this.isListeningState = false;

      let errorMessage = 'Voice recognition error occurred.';
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMessage = 'Microphone permission denied. Please allow microphone access in browser settings.';
      } else if (event.error === 'no-speech') {
        errorMessage = 'No speech was detected. Please try speaking again.';
      } else if (event.error === 'network') {
        errorMessage = 'Network error during speech recognition.';
      }

      if (this.callbacks.onError) {
        this.callbacks.onError(errorMessage);
      }
    };

    this.recognition.onend = () => {
      this.isListeningState = false;
      if (this.callbacks.onEnd) this.callbacks.onEnd();
    };
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  // Dynamic Microphone Permission Checking & Requesting
  public async checkAndRequestPermission(): Promise<{ granted: boolean; error?: string }> {
    if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
      return {
        granted: false,
        error: 'MediaDevices API / Microphone is not supported in this browser.',
      };
    }

    try {
      // 1. Check Permissions API if available in browser
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const permStatus = await navigator.permissions.query({
            name: 'microphone' as PermissionName,
          });
          console.log('Navigator microphone permission state:', permStatus.state);

          if (permStatus.state === 'granted') {
            // Verify media stream active test and release
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach((track) => track.stop());
            return { granted: true };
          } else if (permStatus.state === 'denied') {
            return {
              granted: false,
              error: 'Microphone permission denied in browser. Please grant access in settings.',
            };
          }
        } catch (permErr) {
          console.warn('Permissions API query check fallback:', permErr);
        }
      }

      // 2. Request microphone stream dynamically via getUserMedia ({ audio: true })
      console.log('Requesting audio stream via getUserMedia...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop tracks immediately so SpeechRecognition can acquire clean lock
      stream.getTracks().forEach((track) => track.stop());
      return { granted: true };
    } catch (err: any) {
      console.error('getUserMedia microphone access failed:', err);
      let errMsg = 'Microphone permission denied. Please allow microphone access in browser settings.';
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errMsg = 'No microphone device found on this system.';
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errMsg = 'Microphone permission denied by user or browser policy.';
      }
      return { granted: false, error: errMsg };
    }
  }

  public setLanguage(lang: string) {
    this.lang = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public setCallbacks(callbacks: VoiceRecognitionCallbacks) {
    this.callbacks = callbacks;
  }

  public startListening(lang = 'en-US'): boolean {
    if (!this.isSupported()) {
      if (this.callbacks.onError) {
        this.callbacks.onError('Web Speech API is not supported on this browser.');
      }
      return false;
    }

    if (!this.recognition) {
      this.initRecognition();
    }

    try {
      this.recognition.lang = lang;
      this.recognition.start();
      return true;
    } catch (err: any) {
      console.warn('Speech recognition start exception:', err);
      try {
        this.recognition.stop();
        setTimeout(() => {
          this.recognition.start();
        }, 200);
        return true;
      } catch (e) {
        if (this.callbacks.onError) {
          this.callbacks.onError('Could not start microphone listening.');
        }
        return false;
      }
    }
  }

  public stopListening() {
    if (this.recognition && this.isListeningState) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
    }
    this.isListeningState = false;
  }

  public isListening(): boolean {
    return this.isListeningState;
  }
}

export const voiceRecognitionService = new VoiceRecognitionService();
