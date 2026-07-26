import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Key, Lock, LogIn, UserPlus, X, ShieldAlert, Cpu } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  currentUser: User | null;
  onLogin: (token: string, user: User) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  onLogin,
  onLogout,
  isOpen,
  onClose,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isSignUp ? '/api/v1/auth/register' : '/api/v1/auth/login';
    const body = isSignUp
      ? { username, email, password, role }
      : { username_or_email: username || email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem('nexus_jwt_token', data.access_token);
        onLogin(data.access_token, data.user);
        onClose();
      } else {
        setError(data.detail || 'Authentication failed. Check credentials.');
      }
    } catch (err: any) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              {currentUser ? 'User Account Profile' : isSignUp ? 'Create Nexus Account' : 'JWT Authentication Sign In'}
            </h3>
            <p className="text-xs text-slate-400">
              {currentUser ? 'Role-Based Access Control Active' : 'FastAPI Auth Endpoint Proxy'}
            </p>
          </div>
        </div>

        {currentUser ? (
          <div className="space-y-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Username:</span>
                <span className="font-bold text-slate-200">{currentUser.username}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-200 font-mono">{currentUser.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Role:</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${
                  currentUser.role === 'admin'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {currentUser.role}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('nexus_jwt_token');
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all"
            >
              Log Out of Nexus Agent
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                {isSignUp ? 'Username' : 'Username or Email'}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or admin@nexus.ai"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@nexus.ai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Role Assignment</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="user">Standard User</option>
                  <option value="admin">Administrator (Admin Role)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating JWT...</span>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  Sign Up & Create Account
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In with JWT
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-slate-400 hover:text-indigo-300 text-[11px] underline"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Register"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
