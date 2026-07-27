// ThreeDAvatarCanvas.tsx - Interactive Animated Futuristic 3D Avatar Canvas with Lip Sync & Spectrum

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { AssistantEmotion, AvatarAnimationState } from '../store/useAssistantStore';

interface ThreeDAvatarCanvasProps {
  emotion: AssistantEmotion;
  avatarAnimation: AvatarAnimationState;
  mouthVolume?: number; // 0 to 1 for lip sync
  isListening?: boolean;
  isSpeaking?: boolean;
}

export const ThreeDAvatarCanvas: React.FC<ThreeDAvatarCanvasProps> = ({
  emotion,
  avatarAnimation,
  mouthVolume = 0,
  isListening = false,
  isSpeaking = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render Futuristic Cyber Sphere & Audio Spectrum on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let time = 0;

    // Canvas sizing
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const getColors = () => {
      switch (emotion) {
        case 'happy':
          return { core: '#f59e0b', ring: '#10b981', glow: 'rgba(245, 158, 11, 0.4)' };
        case 'sad':
          return { core: '#3b82f6', ring: '#6366f1', glow: 'rgba(59, 130, 246, 0.4)' };
        case 'angry':
          return { core: '#f43f5e', ring: '#e11d48', glow: 'rgba(244, 63, 94, 0.4)' };
        case 'excited':
          return { core: '#a855f7', ring: '#06b6d4', glow: 'rgba(168, 85, 247, 0.5)' };
        case 'confused':
          return { core: '#8b5cf6', ring: '#ec4899', glow: 'rgba(139, 92, 246, 0.4)' };
        default:
          return { core: '#06b6d4', ring: '#3b82f6', glow: 'rgba(6, 182, 212, 0.4)' };
      }
    };

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      const colors = getColors();

      // 1. Outer Glow Aura
      const glowRadius = 55 + Math.sin(time * 2) * 4 + mouthVolume * 25;
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        glowRadius
      );
      gradient.addColorStop(0, colors.glow);
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // 2. Audio Spectrum Rings (When speaking or listening)
      if (isSpeaking || isListening) {
        ctx.save();
        ctx.strokeStyle = isListening ? '#f59e0b' : colors.ring;
        ctx.lineWidth = 2;
        const waveCount = 18;

        for (let i = 0; i < waveCount; i++) {
          const angle = (i / waveCount) * Math.PI * 2 + time;
          const amp = (isSpeaking ? mouthVolume * 22 : Math.sin(time * 4 + i) * 8) + 40;
          const x = centerX + Math.cos(angle) * amp;
          const y = centerY + Math.sin(angle) * amp;

          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = isListening ? '#f59e0b' : colors.ring;
          ctx.fill();
        }
        ctx.restore();
      }

      // 3. Rotating Cyber Outer Ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(avatarAnimation === 'thinking' ? time * 3 : time * 0.5);

      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 1.5);
      ctx.strokeStyle = colors.ring;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // 4. Core Avatar Head Base
      const headY = centerY + Math.sin(time * 1.5) * 3; // Head bobbing
      ctx.beginPath();
      ctx.arc(centerX, headY, 26, 0, Math.PI * 2);
      ctx.fillStyle = colors.core;
      ctx.shadowColor = colors.ring;
      ctx.shadowBlur = 15;
      ctx.fill();

      // 5. Cyber Eyes Simulation (Blinking effect)
      const blink = Math.sin(time * 0.8) > 0.95 ? 0.2 : 1;
      const eyeHeight = 5 * blink;

      ctx.fillStyle = '#ffffff';
      // Left eye
      ctx.beginPath();
      ctx.ellipse(centerX - 9, headY - 4, 3, eyeHeight, 0, 0, Math.PI * 2);
      ctx.fill();

      // Right eye
      ctx.beginPath();
      ctx.ellipse(centerX + 9, headY - 4, 3, eyeHeight, 0, 0, Math.PI * 2);
      ctx.fill();

      // 6. Lip-Sync Mouth Opening (Tied to real-time mouthVolume / TTS)
      ctx.beginPath();
      const mouthWidth = 10;
      const mouthOpen = isSpeaking ? Math.max(2, mouthVolume * 10) : 2;
      ctx.ellipse(centerX, headY + 8, mouthWidth / 2, mouthOpen / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [emotion, avatarAnimation, mouthVolume, isListening, isSpeaking]);

  return (
    <div className="relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={180}
        height={180}
        className="w-44 h-44 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] pointer-events-none"
      />
    </div>
  );
};
