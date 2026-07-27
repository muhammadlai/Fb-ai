import { create } from 'zustand';
import { ToastMessage, ToastType } from '../types/ui';

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  cyber: (title: string, description?: string) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastMessage = {
      id,
      duration: 4000,
      ...toast,
    };
    
    set((state) => ({
      toasts: [...state.toasts.slice(-4), newToast], // Keep max 5 toasts
    }));

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => set({ toasts: [] }),

  success: (title, description) => get().addToast({ title, description, type: 'success' }),
  error: (title, description) => get().addToast({ title, description, type: 'error' }),
  warning: (title, description) => get().addToast({ title, description, type: 'warning' }),
  info: (title, description) => get().addToast({ title, description, type: 'info' }),
  cyber: (title, description) => get().addToast({ title, description, type: 'cyber' }),
}));
