'use client';
import { useState, useEffect } from 'react';
import CreateCompanionForm from "@/components/create-companion-form";
import WelcomeGuide from '@/components/welcome-guide';
import { motion } from "framer-motion";

export default function CreateCompanionPage() {
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    useEffect(() => {
        // Decide whether to show the guide on the client-side
        const hasSeenGuide = localStorage.getItem('hasSeenWelcomeGuide');
        if (!hasSeenGuide) {
            setIsGuideOpen(true);
        }
    }, []);

    const handleCloseGuide = () => {
        localStorage.setItem('hasSeenWelcomeGuide', 'true');
        setIsGuideOpen(false);
    };

    return (
        <>
            <WelcomeGuide isOpen={isGuideOpen} onOpenChange={setIsGuideOpen} onClose={handleCloseGuide} />
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
