'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { Companion, Message, appThemes } from '@/lib/types';

const COMPANION_KEY = 'altered-self-companion';
const MESSAGES_KEY = 'altered-self-messages';

interface CompanionContextType {
  companion: Companion | null;
  messages: Message[];
  isLoading: boolean;
  saveCompanion: (companion: Companion | null) => void;
  addMessage: (message: Message) => void;
  removeMessages: (messageIds: string[]) => void;
  updateCompanionDetails: (updates: Partial<Companion>) => void;
  resetChat: () => void;
}

const CompanionContext = createContext<CompanionContextType | undefined>(undefined);

function applyTheme(themeName: keyof typeof appThemes) {
    const theme = appThemes[themeName];
    const root = document.documentElement;

    if (theme) {
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--ring', theme.primary);
        
        if (themeName === 'night-sky') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }
}

export function CompanionProvider({ children }: { children: ReactNode }) {
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedCompanion = localStorage.getItem(COMPANION_KEY);
      const storedMessages = localStorage.getItem(MESSAGES_KEY);

      if (storedCompanion) {
        const parsedCompanion = JSON.parse(storedCompanion);
        setCompanion(parsedCompanion);
        if (parsedCompanion.theme) {
            applyTheme(parsedCompanion.theme);
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

  const saveCompanion = useCallback((newCompanion: Companion | null) => {
    setCompanion(newCompanion);
    try {
        if (newCompanion) {
            localStorage.setItem(COMPANION_KEY, JSON.stringify(newCompanion));
            if (newCompanion.theme) {
                applyTheme(newCompanion.theme);
            }
        } else {
            localStorage.removeItem(COMPANION_KEY);
            // Also clear messages when companion is removed
            localStorage.removeItem(MESSAGES_KEY);
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

  const updateCompanionDetails = useCallback((updates: Partial<Companion>) => {
    setCompanion(prevCompanion => {
        if (!prevCompanion) return null;
        
        const updatedCompanion = { ...prevCompanion, ...updates };

        try {
            // Force save to localStorage immediately
            localStorage.setItem(COMPANION_KEY, JSON.stringify(updatedCompanion));
            if (updates.theme) {
              applyTheme(updates.theme);
            }
        } catch (error) {
            console.error('Failed to save updated companion to localStorage', error);
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
    saveCompanion,
    addMessage,
    removeMessages,
    updateCompanionDetails,
    resetChat,
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
