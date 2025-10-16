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
        // No mostrar nada hasta que sepamos si el compañero existe o no.
        if (isLoading) return;

        const hasSeenGuide = localStorage.getItem(WELCOME_GUIDE_KEY);
        // Si el usuario no ha visto la guía, se la mostramos.
        // La clave 'hasSeenGuide' se borra cuando se crea un nuevo compañero,
        // por lo que esto funciona tanto para usuarios nuevos como para los que reinician.
        if (!hasSeenGuide) {
            setIsGuideOpen(true);
        }
    }, [isLoading]);

    const handleGuideClose = () => {
        localStorage.setItem(WELCOME_GUIDE_KEY, 'true');
        setIsGuideOpen(false);
    };

    // No renderizar el formulario si la guía está abierta.
    if (isGuideOpen) {
        return <WelcomeGuide isOpen={isGuideOpen} onClose={handleGuideClose} />;
    }

    // No renderizar el formulario mientras se carga para evitar un parpadeo.
    // Y si la guía va a abrirse, esperamos.
    if (isLoading || (!localStorage.getItem(WELCOME_GUIDE_KEY) && !isGuideOpen)) {
        return null; // O un spinner de página completa si se prefiere.
    }

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
