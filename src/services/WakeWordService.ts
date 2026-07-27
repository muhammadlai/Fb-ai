// WakeWordService.ts - Real-time Wake Word Detector ("Hello Nexus", "Hi Nexus", "Nexus")

export class WakeWordService {
  private wakeWords = ['hello nexus', 'hi nexus', 'nexus', 'hey nexus', 'suno nexus'];

  public isWakeWord(transcript: string): boolean {
    if (!transcript) return false;
    const lower = transcript.toLowerCase().trim();
    return this.wakeWords.some((word) => lower.includes(word));
  }

  public stripWakeWord(transcript: string): string {
    let cleaned = transcript.toLowerCase();
    for (const word of this.wakeWords) {
      cleaned = cleaned.replace(word, '');
    }
    return cleaned.trim();
  }
}

export const wakeWordService = new WakeWordService();
