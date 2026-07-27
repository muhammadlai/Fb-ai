import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Cpu,
  User,
  Mail,
  Lock,
  Building,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';

export function RegisterPage() {
  const navigate = useNavigate();
  const { loginAsDemoUser } = useAuthStore();
  const toast = useToastStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [role, setRole] = useState('ai_architect');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculatePasswordStrength(password);

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.warning('Compliance Policy Required', 'Please accept the Enterprise Security SLA to proceed.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      loginAsDemoUser();
      setIsLoading(false);
      toast.success('Enterprise Account Provisioned', `Welcome ${name || 'Architect'}, your Nexus AI workspace is live.`);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#080711] flex items-center justify-center p-6 cyber-grid-bg relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="max-w-lg w-full glass-panel p-8 rounded-3xl border border-purple-500/30 shadow-2xl relative z-10 backdrop-blur-3xl my-8">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-slate-950 border border-cyan-400/40 text-cyan-400 mb-3 glow-cyan">
            <Cpu className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            PROVISION <span className="text-gradient-cyber">WORKSPACE</span>
          </h1>
          <p className="text-xs text-purple-300/70 font-mono mt-1 uppercase tracking-widest">
            Nexus AI Creator OS Enterprise v2
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  placeholder="Elena Rostova"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  placeholder="elena@enterprise.ai"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Organization Name
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  required
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  placeholder="Aether Systems Corp"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Platform Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs bg-slate-950 text-slate-200"
                >
                  <option value="ai_architect">AI Architect</option>
                  <option value="creator_lead">Creator Lead</option>
                  <option value="developer">Developer</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Master Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                placeholder="Create strong password..."
              />
            </div>

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1.5 w-full">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 rounded-full transition-colors ${
                        strength >= step
                          ? strength === 4
                            ? 'bg-emerald-400'
                            : strength === 3
                            ? 'bg-cyan-400'
                            : 'bg-amber-400'
                          : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Password Strength:{' '}
                  <span className="text-cyan-300">
                    {strength === 4 ? 'Maximum Enterprise Security' : strength >= 2 ? 'Moderate' : 'Weak'}
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 rounded accent-cyan-400 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
              I agree to the Nexus Enterprise Security Protocol, Data Governance SLA, and ISO-27001 compliance terms.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cyber-button py-3 rounded-xl font-bold text-xs text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-6"
          >
            {isLoading ? (
              <span>Initializing Workspace Tenant...</span>
            ) : (
              <>
                <span>Complete Enterprise Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an enterprise credential?{' '}
          <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
            Authenticate Session
          </Link>
        </div>
      </div>
    </div>
  );
}
