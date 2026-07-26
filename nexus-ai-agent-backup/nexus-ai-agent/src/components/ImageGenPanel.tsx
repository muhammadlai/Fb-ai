import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Image as ImageIcon,
  Copy,
  Check,
  RefreshCw,
  Wand2,
  Sliders,
  Layers,
  Zap
} from 'lucide-react';

export const ImageGenPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('Futuristic AI cybernetic neural core with glowing neon purple and cyan glassmorphism nodes, 8k resolution studio render');
  const [stylePreset, setStylePreset] = useState('Cyberpunk Sci-Fi');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [gallery, setGallery] = useState([
    {
      id: 'img_1',
      title: 'Futuristic AI Cybernetic Neural Core',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      prompt: 'Futuristic AI cybernetic neural core with glowing neon purple and cyan glassmorphism nodes',
      aspect: '16:9',
      style: 'Cyberpunk Sci-Fi',
    },
    {
      id: 'img_2',
      title: 'Hologram Quantum Supercomputer Data Center',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      prompt: 'Hologram quantum supercomputer data center in deep dark slate theme',
      aspect: '16:9',
      style: 'Photorealistic',
    },
    {
      id: 'img_3',
      title: 'Abstract Neon Vector Network',
      url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
      prompt: 'Abstract neon vector network nodes with glowing purple highlights',
      aspect: '1:1',
      style: '3D Render',
    },
  ]);

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    setTimeout(() => {
      const newImg = {
        id: `img_${Date.now()}`,
        title: prompt.substring(0, 32) + '...',
        url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80',
        prompt,
        aspect: aspectRatio,
        style: stylePreset,
      };
      setGallery(prev => [newImg, ...prev]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-6 p-1 custom-scrollbar animate-fadeIn">
      {/* Title Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-pink-950/60 border border-purple-500/30 backdrop-blur-xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Nexus Imagen & Visual Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate ultra-high-resolution AI concept art, UI mockups, and neural assets using Gemini Imagen models.
          </p>
        </div>
      </div>

      {/* Generation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-4">
          <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-400" /> Image Prompt Parameters
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Prompt Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-3 border border-white/10 focus:outline-none focus:border-purple-500/40 resize-none font-sans"
              placeholder="Describe the image you want Nexus AI to generate..."
            />
          </div>

          {/* Style Presets */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Aesthetic Style</label>
            <select
              value={stylePreset}
              onChange={(e) => setStylePreset(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-2.5 border border-white/10 focus:outline-none"
            >
              <option value="Cyberpunk Sci-Fi">Cyberpunk Sci-Fi</option>
              <option value="Photorealistic">Photorealistic Studio</option>
              <option value="3D Render">3D Glassmorphism Render</option>
              <option value="Minimalist Vector">Minimalist Vector Art</option>
              <option value="Anime Digital">Anime Digital Concept</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Aspect Ratio</label>
            <div className="grid grid-cols-4 gap-2">
              {['1:1', '16:9', '9:16', '4:3'].map((ar) => (
                <button
                  key={ar}
                  onClick={() => setAspectRatio(ar)}
                  className={`py-1.5 rounded-xl text-xs font-mono border transition-all ${
                    aspectRatio === ar
                      ? 'bg-purple-600 text-white border-purple-400 font-bold'
                      : 'bg-slate-950 text-slate-400 border-white/5 hover:bg-slate-800'
                  }`}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs shadow-lg shadow-purple-950/60 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing Art...' : 'Generate Image'}</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="text-sm font-bold text-slate-100">Generated Artworks Gallery ({gallery.length})</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gallery.map((img, idx) => (
              <div
                key={img.id}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 hover:border-purple-500/40 shadow-xl transition-all"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 p-4 flex flex-col justify-end">
                  <div className="text-xs font-bold text-slate-100 line-clamp-1">{img.title}</div>
                  <div className="text-[10px] font-mono text-purple-300 mt-0.5">{img.style} • {img.aspect}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
