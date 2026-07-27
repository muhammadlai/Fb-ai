import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';

export const DocumentUploader: React.FC = () => {
  const { uploadAndProcessDocument, isUploading } = useMemoryStore();
  const [dragActive, setDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setSuccessMessage(null);
    await uploadAndProcessDocument(file);
    setSuccessMessage(`Document "${file.name}" ingested and indexed into Vector Vault with auto OCR & chunking.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
            : 'border-slate-800 bg-slate-950 hover:border-purple-500/40 hover:bg-slate-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-inner">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-200">
              {isUploading ? 'Ingesting Document & Extracting OCR...' : 'Click or Drag Files to Ingest'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports <span className="text-cyan-400 font-mono">PDF, Word (.docx), Plain Text (.txt)</span>, and <span className="text-indigo-400 font-mono">Images for Gemini Vision OCR</span>
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-500">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
              <FileText className="w-3 h-3 text-cyan-400" /> Auto Chunking
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-indigo-400" /> Gemini Vision OCR
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> 128-Dim Embeddings
            </span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};
