import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    to?: string;
    onClick?: () => void;
    className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ to, onClick, className = '' }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onClick) {
            onClick();
        } else if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={`absolute top-6 left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 z-10 ${className}`}
            aria-label="Go back"
        >
            <ArrowLeft className="w-6 h-6 text-white" />
        </button>
    );
};
