import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useGameStore } from '../../store/gameStore';
import { UserMode, ArchetypeId } from '../../types';

export const AuthRegisterScreen: React.FC = () => {
    const navigate = useNavigate();
    const { setUser } = useGameStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Profile
            await updateProfile(user, { displayName: name });

            // 3. Create Firestore Document
            const newUserProfile = {
                uid: user.uid,
                displayName: name,
                email: user.email || '',
                avatarId: ArchetypeId.WARRIOR, // Default, will be updated in Avatar Selection
                mode: UserMode.WARRIOR,
                level: 1,
                xp: 0,
                trophies: 0,
                gold: 0,
                gems: 0,
                fragments: 0,
                monsterSouls: 0,
                streakDays: 0,
                lastActive: new Date().toISOString()
            };

            await setDoc(doc(db, 'users', user.uid), newUserProfile);

            // 4. Update Local Store
            setUser(newUserProfile);

            console.log("Registered:", user.uid);
            navigate('/avatar-selection'); // Go to avatar selection after register
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Únete a la Legión</h2>
                    <p className="mt-2 text-gray-400">Tu transformación comienza ahora.</p>
                </div>

                <form onSubmit={handleRegister} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">Nombre de Guerrero</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="relative block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
                                placeholder="Nombre de Guerrero"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="relative block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                    >
                        {loading ? 'Creando...' : 'CREAR CUENTA'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button onClick={() => navigate('/login')} className="text-gray-500 text-sm hover:text-white">
                        ¿Ya tienes cuenta? Inicia Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};
