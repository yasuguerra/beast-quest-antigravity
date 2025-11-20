import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Lock, Eye } from 'lucide-react';

export const DistractionShieldScreen: React.FC = () => {
    const [blockedApps, setBlockedApps] = useState([
        { name: 'Instagram', icon: '📸', blocked: true },
        { name: 'TikTok', icon: '🎵', blocked: true },
        { name: 'Twitter', icon: '🐦', blocked: false },
    ]);

    const [isActive, setIsActive] = useState(true);

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Escudo Anti-Fuga</h2>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border 
          ${isActive ? 'bg-green-900/20 border-green-600' : 'bg-gray-900 border-gray-800'}`}>
                    <Shield className={`w-4 h-4 ${isActive ? 'text-green-500' : 'text-gray-500'}`} />
                    <span className={`font-mono font-bold ${isActive ? 'text-green-500' : 'text-gray-500'}`}>
                        {isActive ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                </div>
            </div>

            {/* Status Monitor */}
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl mb-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 animate-pulse" />
                <Eye className="w-16 h-16 text-green-500 mx-auto mb-4 relative z-10" />
                <h3 className="text-xl font-bold text-white relative z-10">Monitoreo Activo</h3>
                <p className="text-gray-400 text-sm mt-2 relative z-10">
                    El Coach está vigilando tu uso de aplicaciones. No intentes escapar.
                </p>
            </div>

            {/* Blocked Apps List */}
            <div className="space-y-4">
                <h3 className="text-sm text-gray-500 uppercase tracking-widest font-bold">Aplicaciones Restringidas</h3>

                {blockedApps.map((app, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-900 border border-gray-800 p-4 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-2xl">
                                {app.icon}
                            </div>
                            <div>
                                <p className="font-bold">{app.name}</p>
                                <p className="text-xs text-gray-500">{app.blocked ? 'Bloqueado' : 'Permitido'}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                const newApps = [...blockedApps];
                                newApps[index].blocked = !newApps[index].blocked;
                                setBlockedApps(newApps);
                            }}
                            className={`p-2 rounded-lg transition-colors
                ${app.blocked ? 'bg-red-900/20 text-red-500' : 'bg-gray-800 text-gray-400'}`}
                        >
                            {app.blocked ? <Lock className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                        </button>
                    </div>
                ))}
            </div>

            {/* Emergency Unlock */}
            <div className="mt-8 p-4 border border-red-900/50 rounded-xl bg-red-900/10">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                    <div>
                        <h4 className="font-bold text-red-500 text-sm uppercase">Protocolo de Emergencia</h4>
                        <p className="text-xs text-gray-400 mt-1">
                            Desactivar el escudo costará <span className="text-white font-bold">50 HP</span> y reiniciará tu racha.
                        </p>
                    </div>
                </div>
                <button className="w-full mt-4 py-3 bg-red-900/20 border border-red-800 text-red-500 font-bold uppercase rounded-lg hover:bg-red-900/40 transition-colors">
                    Desactivar Escudo
                </button>
            </div>
        </div>
    );
};
