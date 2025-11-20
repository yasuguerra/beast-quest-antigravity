import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { ArchetypeId, UserMode } from '../../types';
import { Shield, Sword, Brain, Crown, Users } from 'lucide-react';

const ARCHETYPES = [
    {
        id: ArchetypeId.WARRIOR,
        name: 'Guerrero',
        icon: <Sword className="w-8 h-8" />,
        desc: 'Fuerza bruta. Disciplina. Acción masiva.',
        color: 'text-red-500',
        bg: 'bg-red-900/20',
        border: 'border-red-500'
    },
    {
        id: ArchetypeId.STRATEGIST,
        name: 'Estratega',
        icon: <Brain className="w-8 h-8" />,
        desc: 'Análisis. Planificación. Eficiencia.',
        color: 'text-blue-500',
        bg: 'bg-blue-900/20',
        border: 'border-blue-500'
    },
    {
        id: ArchetypeId.SOCIAL_ALPHA,
        name: 'Líder Social',
        icon: <Users className="w-8 h-8" />,
        desc: 'Carisma. Influencia. Conexión.',
        color: 'text-purple-500',
        bg: 'bg-purple-900/20',
        border: 'border-purple-500'
    },
    {
        id: ArchetypeId.MONSTER_BUILDING,
        name: 'Constructor',
        icon: <Crown className="w-8 h-8" />,
        desc: 'Legado. Imperio. Riqueza.',
        color: 'text-yellow-500',
        bg: 'bg-yellow-900/20',
        border: 'border-yellow-500'
    }
];

export const AvatarIdentityScreen: React.FC = () => {
    const navigate = useNavigate();
    const { setArchetype, setUserMode } = useGameStore();
    const [selected, setSelected] = useState<ArchetypeId | null>(null);

    const handleSelect = (id: ArchetypeId) => {
        setSelected(id);
    };

    const handleConfirm = () => {
        if (selected) {
            setArchetype(selected);
            setUserMode(UserMode.WARRIOR); // Default to Warrior mode initially
            navigate('/assessment-intro');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col">
            <div className="flex-1 flex flex-col items-center max-w-md mx-auto w-full">
                <h2 className="text-3xl font-bold mb-2 text-center">Elige tu Identidad</h2>
                <p className="text-gray-400 text-center mb-8">
                    ¿Qué tipo de bestia quieres despertar?
                </p>

                <div className="grid grid-cols-1 gap-4 w-full">
                    {ARCHETYPES.map((arch) => (
                        <button
                            key={arch.id}
                            onClick={() => handleSelect(arch.id)}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 text-left group
                ${selected === arch.id
                                    ? `${arch.border} ${arch.bg} shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-105 z-10`
                                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-800'
                                }`}
                        >
                            <div className={`p-3 rounded-full bg-black/50 ${arch.color}`}>
                                {arch.icon}
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold ${selected === arch.id ? 'text-white' : 'text-gray-300'}`}>
                                    {arch.name}
                                </h3>
                                <p className="text-sm text-gray-500 group-hover:text-gray-400">
                                    {arch.desc}
                                </p>
                            </div>
                            {selected === arch.id && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className={`w-3 h-3 rounded-full ${arch.color.replace('text-', 'bg-')} animate-ping`} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-8 max-w-md mx-auto w-full">
                <button
                    onClick={handleConfirm}
                    disabled={!selected}
                    className={`w-full py-4 font-bold text-lg uppercase tracking-wider rounded-lg transition-all
            ${selected
                            ? 'bg-white text-black hover:bg-gray-200 shadow-lg transform hover:-translate-y-1'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Confirmar Identidad
                </button>
            </div>
        </div>
    );
};
