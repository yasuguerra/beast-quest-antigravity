import React, { useEffect } from 'react';
import { ScreenRouter } from './src/components/screens/ScreenRouter';
import { useAuth } from './src/hooks/useAuth';
import { AntiFugaEngine } from './src/engines/AntiFugaEngine';

function App() {
    const { loading } = useAuth();

    useEffect(() => {
        AntiFugaEngine.startMonitoring();
        return () => AntiFugaEngine.stopMonitoring();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl">Loading Legion...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white font-sans antialiased">
            <ScreenRouter />
        </div>
    );
}

export default App;
