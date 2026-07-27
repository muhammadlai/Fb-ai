import { create } from 'zustand';
import { UserProfile } from '../types/auth';

interface AuthStore {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mfaRequired: boolean;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setMfaRequired: (required: boolean) => void;
  loginAsDemoUser: () => void;
}

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr_nexus_aitzaz_owner',
  email: 'aitzaz@nexus-ai.io',
  name: 'Aitzaz',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'system_owner',
  organization: 'Nexus AI Creator OS Enterprise',
  tier: 'Enterprise Owner',
  credits: 1000000,
  maxCredits: 1000000,
  mfaEnabled: true,
  createdAt: '2026-01-01T00:00:00Z',
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: DEFAULT_DEMO_USER,
  token: 'mock-jwt-nexus-token-v2-enterprise',
  isAuthenticated: true,
  isLoading: false,
  mfaRequired: false,

  login: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      mfaRequired: false,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      mfaRequired: false,
    }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  setMfaRequired: (required) => set({ mfaRequired: required }),

  loginAsDemoUser: () =>
    set({
      user: DEFAULT_DEMO_USER,
      token: 'mock-jwt-nexus-token-v2-enterprise',
      isAuthenticated: true,
      isLoading: false,
      mfaRequired: false,
    }),
}));
