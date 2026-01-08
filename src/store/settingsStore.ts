import { create } from 'zustand';

interface SettingsState {
  apiKey: string;
  isKeyValid: boolean | null;
  isSettingsOpen: boolean;
  
  setApiKey: (key: string) => void;
  setKeyValid: (valid: boolean | null) => void;
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
  
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  apiKey: '',
  isKeyValid: null,
  isSettingsOpen: false,

  setApiKey: (key) => {
    set({ apiKey: key, isKeyValid: null });
  },

  setKeyValid: (valid) => {
    set({ isKeyValid: valid });
  },

  openSettings: () => {
    set({ isSettingsOpen: true });
  },

  closeSettings: () => {
    set({ isSettingsOpen: false });
  },

  toggleSettings: () => {
    set({ isSettingsOpen: !get().isSettingsOpen });
  },

  loadFromStorage: () => {
    const storedKey = localStorage.getItem('pollinations_api_key');
    if (storedKey) {
      set({ apiKey: storedKey, isKeyValid: true });
    }
  },

  saveToStorage: () => {
    const { apiKey } = get();
    if (apiKey) {
      localStorage.setItem('pollinations_api_key', apiKey);
    } else {
      localStorage.removeItem('pollinations_api_key');
    }
  },
}));
