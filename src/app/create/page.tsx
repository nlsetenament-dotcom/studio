'use client';
import CreateCompanionForm from "@/components/create-companion-form";
import WelcomeGuide from "@/components/welcome-guide";
import { useCompanion } from "@/hooks/use-companion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const WELCOME_GUIDE_KEY = 'altered-self-has-seen-welcome-guide';

export default function CreateCompanionPage() {
    const { isLoading } = useCompanion();
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    useEffect(() => {
        // No hacer nada hasta que la carga inicial desde localStorage haya terminado.
        if (isLoading) return;

        const hasSeenGuide = localStorage.getItem(WELCOME_GUIDE_KEY);
        // Si el usuario NUNCA ha visto la guía, abrimos el pop-up.
        if (!hasSeenGuide) {
            setIsGuideOpen(true);
        }
    }, [isLoading]);

    const handleGuideClose = () => {
        localStorage.setItem(WELCOME_GUIDE_KEY, 'true');
        setIsGuideOpen(false);
    };

    // Renderiza solo el pop-up si debe estar abierto.
    if (isGuideOpen) {
        return <WelcomeGuide isOpen={isGuideOpen} onClose={handleGuideClose} />;
    }

    // Renderiza el formulario solo si la carga ha terminado y el pop-up está cerrado.
    // Esto evita mostrar el formulario momentáneamente antes de que se decida abrir el pop-up.
    if (!isLoading && !isGuideOpen) {
        return (
            <motion.main 
                className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
                <CreateCompanionForm />
            </motion.main>
        );
    }

    // Mientras se decide si mostrar el pop-up o el formulario (durante el estado de carga inicial),
    // no mostramos nada para evitar parpadeos.
    return null;
}
