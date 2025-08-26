import React from 'react';
import { ProtestTactic } from '../types';

interface UpgradesPanelProps {
    isOpen: boolean;
    onClose: () => void;
    unlockedTactics: string[];
    allTactics: Record<string, ProtestTactic>;
    funds: number;
    onUnlockTactic: (tacticId: string) => void;
    onRecruitFollowers: () => void;
}

const UpgradesPanel: React.FC<UpgradesPanelProps> = ({ isOpen, onClose, unlockedTactics, allTactics, funds, onUnlockTactic, onRecruitFollowers }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl m-4 flex flex-col h-[80vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-sky-800">Organize Movement</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>

                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 flex justify-between items-center">
                    <div>
                        <p className="font-bold">Recruit a New Follower</p>
                        <p className="text-sm">Expand your movement one person at a time.</p>
                    </div>
                    <button
                        onClick={onRecruitFollowers}
                        disabled={funds < 10}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
                    >
                        Cost: $10
                    </button>
                </div>

                <h3 className="text-xl font-semibold text-sky-700 mb-3">Develop New Tactics</h3>
                <div className="flex-grow overflow-y-auto space-y-3 pr-2 -mr-2">
                    {/* FIX: Cast Object.values to ProtestTactic[] to fix type inference issues where TypeScript assumes 'unknown'. */}
                    {(Object.values(allTactics) as ProtestTactic[]).filter(t => t.cost > 0).map(tactic => {
                        const isUnlocked = unlockedTactics.includes(tactic.id);
                        const canAfford = funds >= tactic.cost;
                        return (
                            <div key={tactic.id} className={`p-4 rounded-lg flex justify-between items-center ${isUnlocked ? 'bg-gray-200' : 'bg-sky-100'}`}>
                                <div>
                                    <p className={`font-bold ${isUnlocked ? 'text-gray-500' : ''}`}>{tactic.name}</p>
                                    <p className="text-sm text-gray-600">{tactic.description}</p>
                                </div>
                                <button
                                    onClick={() => onUnlockTactic(tactic.id)}
                                    disabled={isUnlocked || !canAfford}
                                    className="px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isUnlocked ? 'Developed' : `Cost: $${tactic.cost}`}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UpgradesPanel;
