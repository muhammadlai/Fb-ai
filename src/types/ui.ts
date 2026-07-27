export type CyberThemeMode = 'cyber-purple' | 'neon-cyan' | 'matrix-green' | 'dark-midnight';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'cyber';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  iconName: string;
  badge?: string;
  category?: string;
  isPhaseLocked?: boolean;
}

export interface AIModelOption {
  id: string;
  name: string;
  provider: string;
  version: string;
  status: 'active' | 'beta' | 'deprecated';
  latencyMs: number;
}
