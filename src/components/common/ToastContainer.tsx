import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Zap, X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';
import { ToastMessage } from '../../types/ui';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'cyber':
        return <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-purple-400" />;
    }
  };

  const getBorderColor = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
      case 'error':
        return 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
      case 'warning':
        return 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
      case 'cyber':
        return 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]';
      case 'info':
      default:
        return 'border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]';
    }
  };

  return (
    <div
      id="nexus-toast-container"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl glass-panel border ${getBorderColor(
              toast.type
            )} backdrop-blur-xl bg-slate-950/80 text-slate-100 relative overflow-hidden`}
          >
            <div className="shrink-0 pt-0.5">{getIcon(toast.type)}</div>
            <div className="flex-1 min-w-0 pr-2">
              <h4 className="text-sm font-semibold text-slate-100 leading-tight">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-60" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
