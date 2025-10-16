'use client';
import { useState, useEffect } from 'react';
import CreateCompanionForm from "@/components/create-companion-form";
import WelcomeGuide from "@/components/welcome-guide";
import { motion } from "framer-motion";
import { useCompanion } from '@/hooks/use-companion';

const GUIDE_SEEN_KEY = 'hasSeenWelcomeGuide';

export default function CreateCompanionPage() {
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const { companion, isLoading } = useCompanion();

    useEffect(() => {
        if (!isLoading && !companion) {
            const hasSeenGuide = localStorage.getItem(GUIDE_SEEN_KEY);
            if (!hasSeenGuide) {
                setIsGuideOpen(true);
            }
        }
    }, [companion, isLoading]);

    const handleGuideClose = () => {
        localStorage.setItem(GUIDE_SEEN_KEY, 'true');
    };

    return (
        <>
            <WelcomeGuide 
                isOpen={isGuideOpen} 
                onOpenChange={setIsGuideOpen}
                onClose={handleGuideClose}
            />
            <motion.main 
                className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
                <CreateCompanionForm />
            </motion.main>
        </>
    );
}
