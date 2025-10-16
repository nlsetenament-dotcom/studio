'use client';
import { useState } from 'react';
import CreateCompanionForm from "@/components/create-companion-form";
import { motion } from "framer-motion";

export default function CreateCompanionPage() {

    return (
        <>
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
