// useVoiceAssistant.ts - Unified React Hook for Voice STT/TTS & AI Conversation

import { useState, useEffect, useCallback, useRef } from 'react';
import { voiceRecognitionService } from '../services/VoiceRecognitionService';
import { textToSpeechService } from '../services/TextToSpeechService';
import { useAssistantStore, AssistantEmotion, ThinkingStage, AvatarAnimationState } from '../store/useAssistantStore';
import { useChatStore } from '../features/ai-engine/store/useChatStore';
import { useToastStore } from '../store/useToastStore';
import { useNavigate } from 'react-router-dom';

export function useVoiceAssistant() {
  const navigate = useNavigate();
  const toast = useToastStore();
  const { sendMessage } = useChatStore();

  const {
    emotion,
    setEmotion,
    thinkingStage,
    setThinkingStage,
    avatarAnimation,
    setAvatarAnimation,
    voiceConfig,
    isOwnerMode,
    setOwnerMode,
    transcript,
    setTranscript,
    lastResponseText,
    setLastResponseText,
    addMemory,
    addTimelineLog,
  } = useAssistantStore();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthVolume, setMouthVolume] = useState(0); // 0 to 1 for 3D/2D Avatar mouth animation
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);

  // Stop active speech or recognition on unmount
  useEffect(() => {
    return () => {
      voiceRecognitionService.stopListening();
      textToSpeechService.stop();
    };
  }, []);

  // Text To Speech Trigger with Avatar Animation Sync
  const speak = useCallback(
    (text: string) => {
      if (!textToSpeechService.isSupported()) {
        toast.error('Voice Error', 'Text to speech synthesis is not supported in this browser.');
        return;
      }

      voiceRecognitionService.stopListening();
      setIsListening(false);

      textToSpeechService.speak(
        text,
        {
          gender: voiceConfig.gender,
          rate: voiceConfig.rate,
          pitch: voiceConfig.pitch,
          lang: voiceConfig.language === 'ur-PK' ? 'ur-PK' : 'en-US',
        },
        {
          onStart: () => {
            setIsSpeaking(true);
            setAvatarAnimation('talking');
            setThinkingStage('talking');
          },
          onLipSyncFrame: (vol) => {
            setMouthVolume(vol);
          },
          onEnd: () => {
            setIsSpeaking(false);
            setMouthVolume(0);
            setAvatarAnimation('idle');
            setThinkingStage('done');

            // Continuous Hands-free Conversation Loop
            if (voiceConfig.continuousListening) {
              setTimeout(() => {
                startListening();
              }, 800);
            }
          },
          onError: (err) => {
            setIsSpeaking(false);
            setMouthVolume(0);
            setAvatarAnimation('idle');
            setThinkingStage('done');
          },
        }
      );
    },
    [voiceConfig, setAvatarAnimation, setThinkingStage]
  );

  const stopSpeaking = useCallback(() => {
    textToSpeechService.stop();
    setIsSpeaking(false);
    setMouthVolume(0);
    setAvatarAnimation('idle');
    setThinkingStage('done');
  }, [setAvatarAnimation, setThinkingStage]);

  // Voice Command & Response Router
  const processQuery = useCallback(
    async (queryText: string) => {
      if (!queryText.trim()) return;

      addTimelineLog('user', queryText);
      const lower = queryText.toLowerCase();

      // 1. Navigation Commands with natural respectful Pakistani assistant responses
      if (lower.includes('open memory') || lower.includes('open knowledge') || lower.includes('memory kholo')) {
        navigate('/knowledge');
        const reply = 'Ji Sir, Main abhi Vector Memory Vault khol raha hoon.';
        setLastResponseText(reply);
        speak(reply);
        toast.cyber('Voice Command Executed', 'Opening Memory Vault');
        return;
      }

      if (lower.includes('open dashboard') || lower.includes('open overview') || lower.includes('dashboard kholo')) {
        navigate('/dashboard');
        const reply = 'Bilkul Sir! Main Overview Dashboard khol raha hoon.';
        setLastResponseText(reply);
        speak(reply);
        toast.cyber('Voice Command Executed', 'Opening Dashboard');
        return;
      }

      if (lower.includes('open studio') || lower.includes('open creator') || lower.includes('open projects')) {
        navigate('/studio');
        const reply = 'Theek hai Sir! Creator Studio aur Canvas open ho raha hai.';
        setLastResponseText(reply);
        speak(reply);
        toast.cyber('Voice Command Executed', 'Opening Creator Studio');
        return;
      }

      if (lower.includes('open agents') || lower.includes('open chat') || lower.includes('open ai engine')) {
        navigate('/ai-engine');
        const reply = 'Ji Sir! Multi-Model AI Engine aur Agent Chat tayyar hai.';
        setLastResponseText(reply);
        speak(reply);
        toast.cyber('Voice Command Executed', 'Opening AI Engine');
        return;
      }

      if (lower.includes('open workflow') || lower.includes('open automations')) {
        navigate('/workflows');
        const reply = 'Bilkul Sir! Autonomous Workflows aur Automations khol diye hain.';
        setLastResponseText(reply);
        speak(reply);
        toast.cyber('Voice Command Executed', 'Opening Workflows');
        return;
      }

      if (lower.includes('open security') || lower.includes('open settings') || lower.includes('open rbac')) {
        navigate('/security');
        const reply = 'Ek moment Sir! Security Vault aur API Keys open ho rahe hain.';
        setLastResponseText(reply);
        speak(reply);
        toast.cyber('Voice Command Executed', 'Opening Security Vault');
        return;
      }

      if (lower.includes('open telemetry') || lower.includes('open analytics')) {
        navigate('/analytics');
        const reply = 'Ji Sir! Real-time System Telemetry Dashboard khol diya hai.';
        setLastResponseText(reply);
        speak(reply);
        toast.cyber('Voice Command Executed', 'Opening Analytics');
        return;
      }

      // 2. Casual Conversation, Greetings & Jokes
      if (lower.includes('kaise ho') || lower.includes('kaise hain') || lower.includes('how are you')) {
        const reply = 'Ji Sir! Main bilkul theek aur online hoon. Aap batayein Aitzaz Sir, aap ka din kaisa guzar raha hai?';
        setEmotion('happy');
        setLastResponseText(reply);
        speak(reply);
        return;
      }

      if (lower.includes('joke') || lower.includes('chutkala') || lower.includes('latifa') || lower.includes('funny')) {
        const reply = 'Ji Sir! Ek mazedaar baat suniye: Ek Programmer aur AI mile, AI ne kaha "Sir tension na lein, code mein bug mera hai par credit hamesha aap ka!"';
        setEmotion('excited');
        setLastResponseText(reply);
        speak(reply);
        return;
      }

      if (lower.includes('shukriya') || lower.includes('thank you') || lower.includes('thanks')) {
        const reply = 'Aap ka bohot bohot shukriya Aitzaz Sir! Yeh to mera farz hai. Aur kya hukum hai Sir?';
        setEmotion('happy');
        setLastResponseText(reply);
        speak(reply);
        return;
      }

      // 3. Multi-Stage Thinking Animation Feedback
      setThinkingStage('thinking');
      setAvatarAnimation('thinking');

      await new Promise((r) => setTimeout(r, 350));
      setThinkingStage('searching_memory');

      await new Promise((r) => setTimeout(r, 350));
      setThinkingStage('planning');

      await new Promise((r) => setTimeout(r, 350));
      setThinkingStage('executing');

      // Send Query to AI Engine
      await sendMessage(queryText);

      // Construct warm respectful response
      const aiReply = `Ji Sir! Main ne aap ki query "${queryText}" par kaam shuru kar diya hai. Output tayyar hai Sir.`;

      // Emotion Detection
      let detectedEmotion: AssistantEmotion = 'neutral';
      if (lower.includes('happy') || lower.includes('great') || lower.includes('awesome') || lower.includes('shukriya') || lower.includes('wah')) {
        detectedEmotion = 'happy';
      } else if (lower.includes('error') || lower.includes('fail') || lower.includes('bad') || lower.includes('kharab')) {
        detectedEmotion = 'sad';
      } else if (lower.includes('deploy') || lower.includes('launch') || lower.includes('zabar') || lower.includes('excited')) {
        detectedEmotion = 'excited';
      }

      setEmotion(detectedEmotion);
      setLastResponseText(aiReply);
      addTimelineLog('nexus', aiReply);

      addMemory({
        title: `Voice Conversation: ${queryText.slice(0, 25)}...`,
        category: 'chat_history',
        content: `User query: "${queryText}". Natural Pakistani Voice Output generated.`,
        isPinned: false,
        isLongTerm: false,
        relevanceScore: 0.9,
      });

      speak(aiReply);
    },
    [
      navigate,
      setLastResponseText,
      speak,
      toast,
      setThinkingStage,
      setAvatarAnimation,
      sendMessage,
      setEmotion,
      addTimelineLog,
      addMemory,
    ]
  );

  // Start Speech Recognition with Dynamic Permission Handshake
  const startListening = useCallback(async () => {
    if (!voiceRecognitionService.isSupported()) {
      setMicPermissionError('Web Speech Recognition API is not supported in this browser.');
      toast.error('Voice Unsupported', 'Speech recognition requires Chrome, Edge, or Safari.');
      return;
    }

    stopSpeaking();

    // Re-check permission status dynamically on every trigger
    const permResult = await voiceRecognitionService.checkAndRequestPermission();

    if (!permResult.granted) {
      const errMsg = permResult.error || 'Microphone access denied.';
      setMicPermissionError(errMsg);
      toast.error('Microphone Error', errMsg);
      setAvatarAnimation('idle');
      setThinkingStage('idle');
      return;
    }

    // Permission is granted! Clear error banner immediately
    setMicPermissionError(null);

    voiceRecognitionService.setCallbacks({
      onStart: () => {
        setIsListening(true);
        setTranscript('');
        setAvatarAnimation('listening');
        setThinkingStage('listening');
      },
      onTranscript: (text, isFinal) => {
        setTranscript(text);
        const lower = text.toLowerCase();

        // Wake Word Interception
        if (lower.includes('hello nexus') || lower.includes('hi nexus')) {
          voiceRecognitionService.stopListening();
          setIsListening(false);
          const wakeText = 'Hello Sir Aitzaz! Nexus AI is online and listening. How may I serve you?';
          setLastResponseText(wakeText);
          setEmotion('happy');
          speak(wakeText);
          toast.cyber('Wake Word Active', 'Hello Sir Aitzaz!');
          return;
        }

        // Owner Phrase Interception
        if (
          lower.includes('i am aitzaz') ||
          lower.includes('main aitzaz hoon') ||
          lower.includes('mera naam aitzaz hai') ||
          lower.includes('aitzaz hoon')
        ) {
          voiceRecognitionService.stopListening();
          setIsListening(false);
          setOwnerMode(true);
          const ownerText =
            'Assalam-o-Alaikum Aitzaz Sir. Welcome back. Main online hoon. Aap kaise hain? Aaj kis cheez mein madad karun?';
          setLastResponseText(ownerText);
          setEmotion('excited');
          speak(ownerText);
          toast.cyber('Owner Verified', 'Assalam-o-Alaikum Sir Aitzaz!');
          return;
        }

        if (isFinal && text.trim()) {
          voiceRecognitionService.stopListening();
          setIsListening(false);
          processQuery(text);
        }
      },
      onError: (errMsg) => {
        setIsListening(false);
        setAvatarAnimation('idle');
        setThinkingStage('idle');
        console.error('Speech recognition runtime error:', errMsg);
        if (errMsg.toLowerCase().includes('not-allowed') || errMsg.toLowerCase().includes('denied')) {
          setMicPermissionError(errMsg);
          toast.error('Voice Error', errMsg);
        }
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    const started = voiceRecognitionService.startListening(
      voiceConfig.language === 'en-US' ? 'en-US' : 'ur-PK'
    );
    if (!started) {
      setIsListening(false);
      setAvatarAnimation('idle');
    }
  }, [
    stopSpeaking,
    setTranscript,
    setAvatarAnimation,
    setThinkingStage,
    setLastResponseText,
    setEmotion,
    speak,
    toast,
    setOwnerMode,
    processQuery,
    voiceConfig.language,
  ]);

  const stopListening = useCallback(() => {
    voiceRecognitionService.stopListening();
    setIsListening(false);
    setAvatarAnimation('idle');
    setThinkingStage('idle');
  }, [setAvatarAnimation, setThinkingStage]);

  return {
    isListening,
    isSpeaking,
    mouthVolume,
    transcript,
    lastResponseText,
    micPermissionError,
    emotion,
    thinkingStage,
    avatarAnimation,
    isOwnerMode,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    processQuery,
  };
}
