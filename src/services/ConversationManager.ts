// ConversationManager.ts - Natural Pakistani Bilingual Assistant Engine

import { AssistantEmotion } from '../store/useAssistantStore';

export class ConversationManager {
  // Emotional Keyword Analysis
  public detectEmotion(text: string): AssistantEmotion {
    const lower = text.toLowerCase();
    if (
      lower.includes('happy') ||
      lower.includes('great') ||
      lower.includes('awesome') ||
      lower.includes('shukriya') ||
      lower.includes('wah') ||
      lower.includes('zabar') ||
      lower.includes('maza')
    ) {
      return 'happy';
    }
    if (
      lower.includes('sad') ||
      lower.includes('error') ||
      lower.includes('fail') ||
      lower.includes('bad') ||
      lower.includes('kharab') ||
      lower.includes('afsoos')
    ) {
      return 'sad';
    }
    if (
      lower.includes('angry') ||
      lower.includes('ghussa') ||
      lower.includes('gusa') ||
      lower.includes('hate')
    ) {
      return 'angry';
    }
    if (
      lower.includes('excited') ||
      lower.includes('deploy') ||
      lower.includes('launch') ||
      lower.includes('kamaal') ||
      lower.includes('wow')
    ) {
      return 'excited';
    }
    if (
      lower.includes('confused') ||
      lower.includes('samjh nahi') ||
      lower.includes('what') ||
      lower.includes('kya matlab')
    ) {
      return 'confused';
    }
    return 'neutral';
  }

  // Format responses with natural Pakistani bilingual phrases
  public formatPakistaniResponse(rawResponse: string, userName = 'Sir Aitzaz'): string {
    if (!rawResponse) return `Ji ${userName}, main aap ki khidmat mein online hoon.`;

    // Check if already starts with respectful greeting or phrase
    const hasGreeting =
      rawResponse.toLowerCase().includes('assalam') ||
      rawResponse.toLowerCase().includes('ji sir') ||
      rawResponse.toLowerCase().includes('bilkul sir');

    if (!hasGreeting) {
      const prefixes = [
        `Ji ${userName}! `,
        `Bilkul ${userName}! `,
        `Theek hai ${userName}! `,
        `Ek second ${userName}, `,
      ];
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      return randomPrefix + rawResponse;
    }

    return rawResponse;
  }
}

export const conversationManager = new ConversationManager();
