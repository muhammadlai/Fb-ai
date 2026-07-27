// VoiceStateManager.ts - Voice Engine State & Interrupt Handler

export type VoiceState = 'idle' | 'listening' | 'recognizing' | 'thinking' | 'speaking' | 'paused';

export class VoiceStateManager {
  private currentState: VoiceState = 'idle';
  private listeners: Array<(state: VoiceState) => void> = [];

  public getState(): VoiceState {
    return this.currentState;
  }

  public setState(state: VoiceState) {
    this.currentState = state;
    this.listeners.forEach((fn) => fn(state));
  }

  public subscribe(listener: (state: VoiceState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== listener);
    };
  }
}

export const voiceStateManager = new VoiceStateManager();
