
import React from 'react';
import { Region, ProtestTactic } from '../types';
import { TACTICS } from '../constants';
import { EnforcerIcon, OpinionIcon, CloseIcon } from './icons';

interface RegionDetailPanelProps {
    region: Region;
    unlockedTactics: string[];
    onOpenActionModal: (tactic: ProtestTactic) => void;
    onClose: () => void;
}

const RegionDetailPanel: React.FC<RegionDetailPanelProps> = ({ region, unlockedTactics, onOpenActionModal, onClose }) => {
    return (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white/80 backdrop-blur-sm shadow-2xl rounded-l-xl p-6 flex flex-col z-20 animate-slide-in">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                <CloseIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-sky-800 mb-4">{region.name}</h2>

            <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700">
                        <OpinionIcon className="w-5 h-5" />
                        <span>Public Opinion</span>
                    </div>
                    <span className="font-bold">{region.opinionMeter}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${region.opinionMeter}%` }}
                    ></div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700">
                        <EnforcerIcon className="w-5 h-5" />
                        <span>Regime Enforcers</span>
                    </div>
                    <span className="font-bold">{region.regimeEnforcers}</span>
                </div>
                <div className="text-center text-sm font-semibold text-gray-600 bg-gray-200 rounded-full px-3 py-1">
                    Political Leaning: {region.politicalLeaning}
                </div>
            </div>

            <h3 className="text-lg font-semibold text-sky-700 mb-2 border-b-2 border-sky-200 pb-1">Actions</h3>
            <div className="flex-grow overflow-y-auto space-y-2 pr-2 -mr-2">
                {unlockedTactics.map(tacticId => {
                    const tactic = TACTICS[tacticId];
                    return (
                        <div key={tactic.id} className="bg-sky-100 p-3 rounded-lg">
                            <p className="font-bold">{tactic.name}</p>
                            <p className="text-sm text-gray-600 mb-2">{tactic.description}</p>
                            <button
                                onClick={() => onOpenActionModal(tactic)}
                                className="w-full px-3 py-1 bg-sky-500 text-white font-semibold rounded-md shadow-sm hover:bg-sky-600 transition-colors text-sm"
                            >
                                Dispatch
                            </button>
                        </div>
                    );
                })}
            </div>
             <style jsx>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default RegionDetailPanel;
