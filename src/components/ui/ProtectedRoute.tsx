import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isGuestMode } = useGameStore();

    if (!user && !isGuestMode) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
