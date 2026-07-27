import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export function ForgotPasswordPage() {
  const toast = useToastStore();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Recovery Vector Sent', `Encrypted recovery instructions dispatched to ${email}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#080711] flex items-center justify-center p-6 cyber-grid-bg relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-purple-500/30 shadow-2xl relative z-10 backdrop-blur-3xl">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-slate-950 border border-cyan-400/40 text-cyan-400 mb-3 glow-cyan">
            <Cpu className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            CREDENTIAL <span className="text-gradient-cyber">RECOVERY</span>
          </h1>
          <p className="text-xs text-purple-300/70 font-mono mt-1 uppercase tracking-widest">
            Nexus Security Clearance Vector
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed text-center mb-2">
              Enter your corporate email address to receive an ephemeral 15-minute cryptographic reset token.
            </p>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Corporate Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  placeholder="architect@enterprise.io"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full cyber-button py-3 rounded-xl font-bold text-xs text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-6"
            >
              {isLoading ? (
                <span>Generating Cryptographic Token...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch Reset Instructions</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-sm font-bold text-emerald-300">Reset Link Dispatched</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We have sent an encrypted reset token to <span className="text-cyan-300 font-mono">{email}</span>. Please check your inbox or security folder.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Authentication Gateway
          </Link>
        </div>
      </div>
    </div>
  );
}
