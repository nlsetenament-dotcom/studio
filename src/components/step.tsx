import { ReactElement } from "react";

interface StepProps {
    icon: ReactElement;
    title: string;
    description: string;
}

export function Step({ icon, title, description }: StepProps) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full p-2">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-base">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
