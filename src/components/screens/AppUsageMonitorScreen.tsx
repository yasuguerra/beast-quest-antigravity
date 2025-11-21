import React from 'react';
import { ArrowLeft, Smartphone, AlertCircle, TrendingUp, Shield } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface AppUsageData {
    appName: string;
    timeMinutes: number;
    category: 'productive' | 'distraction' | 'neutral';
}

export const AppUsageMonitorScreen: React.FC = () => {
    const { goBack } = useGameStore();

    // Mock data (in real app, this would come from device tracking)
    const todayUsage: AppUsageData[] = [
        { appName: 'Instagram', timeMinutes: 47, category: 'distraction' },
        { appName: 'YouTube', timeMinutes: 32, category: 'distraction' },
        { appName: 'Twitter', timeMinutes: 23, category: 'distraction' },
        { appName: 'Beast Quest', timeMinutes: 18, category: 'productive' },
        { appName: 'Gmail', timeMinutes: 12, category: 'neutral' },
    ];

    const totalDistraction = todayUsage
        .filter(app => app.category === 'distraction')
        .reduce((sum, app) => sum + app.timeMinutes, 0);

    const criticalMoments = [
        { time: '09:23 AM', event: 'Opened Instagram instead of starting work', impact: 'High' },
        { time: '11:45 AM', event: 'YouTube rabbit hole detected', impact: 'Critical' },
        { time: '02:15 PM', event: 'Twitter scrolling during focus block', impact: 'High' },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-gray-800 p-4">
                <div className="flex items-center justify-between">
                    <button onClick={goBack} className="p-2 hover:bg-gray-900 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold uppercase tracking-wider">App Usage Monitor</span>
                    <div className="w-9" />
                </div>
            </div>

            <div className="flex-1 p-6 pb-24">
                {/* Summary Card */}
                <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-500/50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                        <div>
                            <div className="text-sm text-gray-400">Total Distraction Time</div>
                            <div className="text-3xl font-black text-red-400">{totalDistraction} min</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400">
                        You lost <span className="text-red-400 font-bold">{Math.floor(totalDistraction / 60)}h {totalDistraction % 60}m</span> to distractions today.
                        That's time you'll never get back.
                    </p>
                </div>

                {/* App Breakdown */}
                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-4 font-bold">Today's Usage</h3>
                <div className="space-y-2 mb-8">
                    {todayUsage.map((app, idx) => (
                        <div
                            key={idx}
                            className={`bg-gray-900 border rounded-xl p-4 flex items-center justify-between ${app.category === 'distraction' ? 'border-red-500/30' :
                                    app.category === 'productive' ? 'border-green-500/30' :
                                        'border-gray-800'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${app.category === 'distraction' ? 'bg-red-600/20' :
                                        app.category === 'productive' ? 'bg-green-600/20' :
                                            'bg-gray-800'
                                    }`}>
                                    <Smartphone className={`w-5 h-5 ${app.category === 'distraction' ? 'text-red-500' :
                                            app.category === 'productive' ? 'text-green-500' :
                                                'text-gray-500'
                                        }`} />
                                </div>
                                <div>
                                    <div className="font-bold">{app.appName}</div>
                                    <div className="text-xs text-gray-500 capitalize">{app.category}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`font-mono font-bold ${app.category === 'distraction' ? 'text-red-400' :
                                        app.category === 'productive' ? 'text-green-400' :
                                            'text-gray-400'
                                    }`}>
                                    {app.timeMinutes}m
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Critical Moments */}
                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-4 font-bold">Critical Moments Detected</h3>
                <div className="space-y-3 mb-8">
                    {criticalMoments.map((moment, idx) => (
                        <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${moment.impact === 'Critical' ? 'text-red-500' : 'text-orange-500'
                                    }`} />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-mono text-gray-500">{moment.time}</span>
                                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${moment.impact === 'Critical' ? 'bg-red-600/20 text-red-400' : 'bg-orange-600/20 text-orange-400'
                                            }`}>
                                            {moment.impact}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-300">{moment.event}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Recommendation */}
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                        <h3 className="font-black uppercase">AI Recommendation</h3>
                    </div>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                        Your distraction pattern shows peak vulnerability between 9-11 AM and 2-3 PM.
                        Activate Distraction Shield during these windows tomorrow.
                    </p>
                    <button className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                        <Shield className="w-5 h-5" />
                        Apply Recommendation
                    </button>
                </div>
            </div>
        </div>
    );
};
