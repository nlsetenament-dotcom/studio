'use client';
import CreateCompanionForm from "@/components/create-companion-form";
import WelcomeGuide from "@/components/welcome-guide";
import { useCompanion } from "@/hooks/use-companion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const WELCOME_GUIDE_KEY = 'altered-self-has-seen-welcome-guide';

export default function CreateCompanionPage() {
    const { companion, isLoading } = useCompanion();
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            const hasSeenGuide = localStorage.getItem(WELCOME_GUIDE_KEY);
            if (!hasSeenGuide && !companion) {
                setIsGuideOpen(true);
            }
        }
    }, [isLoading, companion]);

    const handleGuideClose = () => {
        localStorage.setItem(WELCOME_GUIDE_KEY, 'true');
        setIsGuideOpen(false);
    };

    return (
        <>
            <WelcomeGuide isOpen={isGuideOpen} onClose={handleGuideClose} />
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
