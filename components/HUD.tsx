
import React from 'react';
import { PlayerResources } from '../types';
import { FollowerIcon, NotorietyIcon, FundsIcon } from './icons';

interface HUDProps {
    resources: PlayerResources;
    turn: number;
    onEndTurn: () => void;
    onOpenUpgrades: () => void;
    followersBusy: number;
}

const HUD: React.FC<HUDProps> = ({ resources, turn, onEndTurn, onOpenUpgrades, followersBusy }) => {
    return (
        <div className="w-full max-w-6xl bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2" title="Followers">
                    <FollowerIcon className="w-8 h-8 text-sky-600" />
                    <span className="text-2xl font-bold">{resources.followers}</span>
                    {followersBusy > 0 && <span className="text-lg text-amber-600">(-{followersBusy})</span>}
                </div>
                <div className="flex items-center gap-2" title="Notoriety">
                    <NotorietyIcon className="w-8 h-8 text-purple-600" />
                    <span className="text-2xl font-bold">{resources.notoriety}</span>
                </div>
                <div className="flex items-center gap-2" title="Funds">
                    <FundsIcon className="w-8 h-8 text-green-600" />
                    <span className="text-2xl font-bold">${resources.funds}</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onOpenUpgrades}
                    className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                >
                    Organize
                </button>
                <div className="text-center">
                    <div className="text-sm font-semibold text-gray-500">TURN</div>
                    <div className="text-3xl font-bold">{turn}</div>
                </div>
                <button
                    onClick={onEndTurn}
                    className="px-6 py-3 bg-rose-500 text-white font-bold rounded-lg shadow-md hover:bg-rose-600 transition-colors"
                >
                    End Turn
                </button>
            </div>
        </div>
    );
};

export default HUD;
