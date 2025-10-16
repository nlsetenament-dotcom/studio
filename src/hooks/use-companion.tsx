
'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { Companion, Message, appThemes, AppTheme } from '@/lib/types';

const COMPANION_KEY = 'altered-self-companion';
const MESSAGES_KEY = 'altered-self-messages';
const APPEARANCE_KEY = 'altered-self-appearance';
const WELCOME_GUIDE_KEY = 'altered-self-has-seen-welcome-guide';

type Appearance = 'light' | 'dark';

interface CompanionContextType {
  companion: Companion | null;
  messages: Message[];
  isLoading: boolean;
  appearance: Appearance;
  saveCompanion: (companion: Companion | null) => void;
  addMessage: (message: Message) => void;
  removeMessages: (messageIds: string[]) => void;
  updateCompanionDetails: (updates: Partial<Companion>, isVolatile?: boolean) => void;
  resetChat: () => void;
  setAppearance: (appearance: Appearance) => void;
  previewTheme: (themeName: AppTheme) => void;
}

const CompanionContext = createContext<CompanionContextType | undefined>(undefined);

function applyThemeColors(themeName: AppTheme) {
    const theme = appThemes[themeName];
    const root = document.documentElement;

    if (theme) {
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--ring', theme.primary);
    }
}

function applyAppearance(appearance: Appearance) {
    const root = document.documentElement;
    if (appearance === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

export function CompanionProvider({ children }: { children: ReactNode }) {
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appearance, setAppearanceState] = useState<Appearance>('light');

  useEffect(() => {
    try {
      // Load Appearance first
      const storedAppearance = localStorage.getItem(APPEARANCE_KEY) as Appearance | null;
      const initialAppearance = storedAppearance || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setAppearanceState(initialAppearance);
      applyAppearance(initialAppearance);
      
      const storedCompanion = localStorage.getItem(COMPANION_KEY);
      const storedMessages = localStorage.getItem(MESSAGES_KEY);

      if (storedCompanion) {
        const parsedCompanion: Companion = JSON.parse(storedCompanion);
        setCompanion(parsedCompanion);
        if (parsedCompanion.theme) {
            applyThemeColors(parsedCompanion.theme);
        }
      }
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Failed to load from localStorage', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setAppearance = useCallback((newAppearance: Appearance) => {
    setAppearanceState(newAppearance);
    applyAppearance(newAppearance);
    try {
      localStorage.setItem(APPEARANCE_KEY, newAppearance);
    } catch (error) {
      console.error('Failed to save appearance to localStorage', error);
    }
  }, []);

  const previewTheme = useCallback((themeName: AppTheme) => {
    applyThemeColors(themeName);
  }, []);

  const saveCompanion = useCallback((newCompanion: Companion | null) => {
    setCompanion(newCompanion);
    try {
        if (newCompanion) {
            localStorage.setItem(COMPANION_KEY, JSON.stringify(newCompanion));
            if (newCompanion.theme) {
                applyThemeColors(newCompanion.theme);
            }
        } else {
            localStorage.removeItem(COMPANION_KEY);
            localStorage.removeItem(MESSAGES_KEY);
            localStorage.removeItem(WELCOME_GUIDE_KEY); // Reset welcome guide
            setMessages([]);
        }
    } catch (error) {
      console.error('Failed to save companion to localStorage', error);
    }
  }, []);

  const saveMessages = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Failed to save messages to localStorage', error);
    }
  }, []);

  const addMessage = useCallback((message: Message) => {
    setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, message];
        try {
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
        } catch (error) {
            console.error('Failed to save messages to localStorage', error);
        }
        return updatedMessages;
    });
  }, []);
  
  const removeMessages = useCallback((messageIds: string[]) => {
    setMessages(prevMessages => {
        const updatedMessages = prevMessages.filter(msg => !messageIds.includes(msg.id));
        try {
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
        } catch (error) {
            console.error('Failed to save messages to localStorage', error);
        }
        return updatedMessages;
    });
  }, []);

  const updateCompanionDetails = useCallback((updates: Partial<Companion>, isVolatile: boolean = false) => {
    setCompanion(prevCompanion => {
        if (!prevCompanion) return null;
        
        const updatedCompanion = { ...prevCompanion, ...updates };

        if (!isVolatile) {
            try {
                localStorage.setItem(COMPANION_KEY, JSON.stringify(updatedCompanion));
            } catch (error) {
                console.error('Failed to save updated companion to localStorage', error);
            }
        }

        if (updates.theme) {
            applyThemeColors(updates.theme);
        }
        
        return updatedCompanion;
    });
  }, []);
  
  const resetChat = useCallback(() => {
      saveMessages([]);
      if(companion) {
        updateCompanionDetails({relationshipStatus: 'Conocido'});
      }
  }, [saveMessages, updateCompanionDetails, companion]);

  const value = {
    companion,
    messages,
    isLoading,
    appearance,
    saveCompanion,
    addMessage,
    removeMessages,
    updateCompanionDetails,
    resetChat,
    setAppearance,
    previewTheme,
  };

  return <CompanionContext.Provider value={value}>{children}</CompanionContext.Provider>;
}

export function useCompanion() {
  const context = useContext(CompanionContext);
  if (context === undefined) {
    throw new Error('useCompanion must be used within a CompanionProvider');
  }
  return context;
}
