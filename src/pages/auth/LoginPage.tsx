import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Cpu,
  Lock,
  Mail,
  Shield,
  ArrowRight,
  Github,
  Globe,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginAsDemoUser, login } = useAuthStore();
  const toast = useToastStore();

  const [email, setEmail] = useState('architect@nexus-ai.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaStep, setMfaStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (!mfaStep) {
        setMfaStep(true);
        toast.info('MFA Authentication Required', 'Enter the 6-digit verification code sent to your authenticator app.');
      } else {
        loginAsDemoUser();
        toast.success('Authentication Verified', 'Welcome to Nexus AI Creator OS Enterprise v2');
        navigate('/dashboard');
      }
    }, 800);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsDemoUser();
      setIsLoading(false);
      toast.cyber('Demo Access Granted', 'Authenticated as Super AI Architect');
      navigate('/dashboard');
    }, 500);
  };

  const handleSSO = (provider: string) => {
    toast.cyber(`${provider} SSO Triggered`, 'Redirecting to identity provider token exchange...');
    setTimeout(() => {
      loginAsDemoUser();
      navigate('/dashboard');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#080711] flex items-center justify-center p-6 cyber-grid-bg relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-purple-500/30 shadow-2xl relative z-10 backdrop-blur-3xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-slate-950 border border-cyan-400/40 text-cyan-400 mb-4 glow-cyan">
            <Cpu className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            NEXUS <span className="text-gradient-cyber">CREATOR OS</span>
          </h1>
          <p className="text-xs text-purple-300/70 font-mono mt-1 uppercase tracking-widest">
            Enterprise v2 Security Gateway
          </p>
        </div>

        {/* Demo Quick Button */}
        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full mb-6 p-3 rounded-xl bg-gradient-to-r from-purple-900/60 to-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-medium text-xs flex items-center justify-center gap-2 hover:border-cyan-400 transition-all cursor-pointer shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>One-Click Enterprise Demo Login</span>
        </button>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-purple-900/40" />
          <span className="shrink mx-4 text-[10px] font-mono text-purple-400 uppercase tracking-widest">
            Or Standard Auth
          </span>
          <div className="flex-grow border-t border-purple-900/40" />
        </div>

        {/* Auth Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {!mfaStep ? (
            <>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Enterprise User Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                    placeholder="architect@nexus-ai.io"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono text-slate-300">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-mono text-cyan-400 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-xs"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3 p-4 bg-purple-950/40 border border-cyan-500/30 rounded-2xl">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono">
                <Shield className="w-4 h-4" />
                <span>2FA / MFA Verification Required</span>
              </div>
              <p className="text-xs text-slate-400">
                Enter your 6-digit TOTP token (e.g., 889201)
              </p>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm font-mono tracking-widest text-center"
                  placeholder="889201"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cyber-button py-3 rounded-xl font-bold text-xs text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-6"
          >
            {isLoading ? (
              <span>Decrypting Session Tokens...</span>
            ) : (
              <>
                <span>{mfaStep ? 'Verify MFA Code' : 'Authenticate Gateway'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* SSO Options */}
        <div className="mt-8 pt-6 border-t border-purple-900/30">
          <p className="text-[10px] font-mono text-center text-purple-300/70 uppercase tracking-widest mb-3">
            Federated SSO Sign-In
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSSO('Google Workspace')}
              className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors flex items-center justify-center gap-1.5 text-xs font-mono cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-purple-400" /> Google
            </button>
            <button
              onClick={() => handleSSO('GitHub Enterprise')}
              className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors flex items-center justify-center gap-1.5 text-xs font-mono cursor-pointer"
            >
              <Github className="w-3.5 h-3.5 text-cyan-400" /> GitHub
            </button>
            <button
              onClick={() => handleSSO('SAML / Okta')}
              className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors flex items-center justify-center gap-1.5 text-xs font-mono cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> SAML
            </button>
          </div>
        </div>

        {/* Register Redirect */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Need an enterprise workspace?{' '}
          <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
            Request Provisioning
          </Link>
        </div>
      </div>
    </div>
  );
}
