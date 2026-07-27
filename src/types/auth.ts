export type UserRole = 'super_admin' | 'system_owner' | 'creator_lead' | 'ai_architect' | 'developer' | 'viewer';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  organization: string;
  tier: 'Enterprise Scale' | 'Enterprise Owner' | 'Pro Architect' | 'Free Tier';
  credits: number;
  maxCredits: number;
  mfaEnabled: boolean;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mfaRequired: boolean;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setMfaRequired: (required: boolean) => void;
}

export type SSOProvider = 'google' | 'github' | 'saml' | 'okta';
