'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { Companion, Message } from '@/lib/types';

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

export function CompanionProvider({ children }: { children: ReactNode }) {
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedCompanion = localStorage.getItem(COMPANION_KEY);
      const storedMessages = localStorage.getItem(MESSAGES_KEY);

      if (storedCompanion) {
        setCompanion(JSON.parse(storedCompanion));
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
        } else {
            localStorage.removeItem(COMPANION_KEY);
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
            localStorage.setItem(COMPANION_KEY, JSON.stringify(updatedCompanion));
        } catch (error) {
            console.error('Failed to save companion to localStorage', error);
        }
        return updatedCompanion;
    });
  }, []);
  
  const resetChat = useCallback(() => {
      saveMessages([]);
      updateCompanionDetails({relationshipStatus: 'Conocido'});
  }, [saveMessages, updateCompanionDetails]);

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
