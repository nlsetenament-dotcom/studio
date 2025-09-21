'use client';

import { useState, useEffect, useCallback } from 'react';
import { Companion, Message, Difficulty } from '@/lib/types';

const COMPANION_KEY = 'altered-self-companion';
const MESSAGES_KEY = 'altered-self-messages';

export function useCompanion() {
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

  const saveCompanion = useCallback((newCompanion: Companion) => {
    setCompanion(newCompanion);
    try {
      localStorage.setItem(COMPANION_KEY, JSON.stringify(newCompanion));
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
    const updatedMessages = [...messages, message];
    saveMessages(updatedMessages);
  }, [messages, saveMessages]);

  const updateCompanionDetails = useCallback((updates: Partial<Companion>) => {
    if (companion) {
      const updatedCompanion = { ...companion, ...updates };
      saveCompanion(updatedCompanion);
    }
  }, [companion, saveCompanion]);
  
  const resetChat = useCallback(() => {
      saveMessages([]);
      if(companion){
          updateCompanionDetails({relationshipStatus: 'Acquaintance'});
      }
  }, [saveMessages, companion, updateCompanionDetails]);

  return {
    companion,
    messages,
    isLoading,
    saveCompanion,
    addMessage,
    updateCompanionDetails,
    resetChat,
  };
}
