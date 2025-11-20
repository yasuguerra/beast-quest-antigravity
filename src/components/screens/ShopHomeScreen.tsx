import React from 'react';
import { ShoppingBag, Zap, Shield, Crown } from 'lucide-react';

export const ShopHomeScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Mercado Negro</h2>
                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-lg border border-gray-800">
                    <span className="font-mono font-bold text-green-400">1,250 G</span>
                </div>
            </div>

            {/* Daily Deals */}
            <section className="mb-8">
                <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4 font-bold">Ofertas Diarias</h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="min-w-[160px] bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                                <Zap className="w-8 h-8 text-yellow-500" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-sm">Booster de XP</p>
                                <p className="text-xs text-gray-500">x2 por 1h</p>
                            </div>
                            <button className="w-full py-2 bg-green-600 rounded-lg text-xs font-bold uppercase">
                                200 G
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Gem Packs */}
            <section>
                <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4 font-bold">Banco de Gemas</h3>
                <div className="space-y-3">
                    {[
                        { amount: 100, price: '$1.99', icon: <Shield className="w-5 h-5 text-blue-400" /> },
                        { amount: 550, price: '$4.99', icon: <Shield className="w-6 h-6 text-blue-500" /> },
                        { amount: 1200, price: '$9.99', icon: <Crown className="w-6 h-6 text-purple-500" /> },
                    ].map((pack, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-900 border border-gray-800 p-4 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                    {pack.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{pack.amount} Gemas</p>
                                    <p className="text-xs text-gray-500">Pack {i === 0 ? 'Básico' : i === 1 ? 'Popular' : 'Bestial'}</p>
                                </div>
                            </div>
                            <button className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200">
                                {pack.price}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
