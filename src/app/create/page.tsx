'use client';
import { motion } from "framer-motion";

export default function CreateCompanionPage() {
    return (
        <motion.main 
            className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center">
                <h1 className="text-2xl font-bold">Página de creación en mantenimiento.</h1>
                <p className="text-muted-foreground">El formulario de creación se está reconstruyendo y el archivo anterior ha sido eliminado.</p>
            </div>
        </motion.main>
    );
}
