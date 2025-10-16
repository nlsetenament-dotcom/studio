'use client';
import { useState, useEffect } from 'react';
import CreateCompanionForm from "@/components/create-companion-form";
import WelcomeGuide from '@/components/welcome-guide';
import { motion } from "framer-motion";
import { useCompanion } from '@/hooks/use-companion';

export default function CreateCompanionPage() {
    const { companion, isLoading } = useCompanion();
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    useEffect(() => {
        // Show the guide only if loading is complete and there's no companion
        if (!isLoading && !companion) {
            const hasSeenGuide = localStorage.getItem('hasSeenWelcomeGuide');
            if (!hasSeenGuide) {
                setIsGuideOpen(true);
                localStorage.setItem('hasSeenWelcomeGuide', 'true');
            }
        }
        // If a companion is deleted, we need to reset the flag
        if (!isLoading && companion === null) {
             localStorage.removeItem('hasSeenWelcomeGuide');
        }

    }, [isLoading, companion]);


    const handleCloseGuide = () => {
        setIsGuideOpen(false);
    };

    return (
        <>
            <WelcomeGuide isOpen={isGuideOpen} onOpenChange={setIsGuideOpen} />
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
