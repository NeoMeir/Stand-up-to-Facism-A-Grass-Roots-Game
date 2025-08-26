
import React, { useState, useEffect } from 'react';
import { Region, ProtestTactic } from '../types';
import { FollowerIcon } from './icons';

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    tactic: ProtestTactic;
    region: Region;
    availableFollowers: number;
    onDispatch: (followersAssigned: number) => void;
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, tactic, region, availableFollowers, onDispatch }) => {
    const [followers, setFollowers] = useState(1);

    useEffect(() => {
        if (isOpen) {
            setFollowers(Math.min(1, availableFollowers));
        }
    }, [isOpen, availableFollowers]);

    if (!isOpen) return null;

    const handleDispatch = () => {
        if (followers > 0) {
            onDispatch(followers);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md m-4">
                <h2 className="text-2xl font-bold text-sky-800">Dispatch: {tactic.name}</h2>
                <p className="text-lg text-gray-600 mb-6">Targeting: {region.name}</p>

                <div className="mb-6">
                    <label htmlFor="followers" className="block text-lg font-semibold text-gray-700 mb-2">
                        Assign Followers
                    </label>
                    <div className="flex items-center gap-4">
                        <FollowerIcon className="w-8 h-8 text-sky-600" />
                        <input
                            type="range"
                            id="followers"
                            min="1"
                            max={availableFollowers}
                            value={followers}
                            onChange={(e) => setFollowers(Number(e.target.value))}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            disabled={availableFollowers === 0}
                        />
                        <span className="text-2xl font-bold w-16 text-center">{followers}</span>
                    </div>
                    <p className="text-right text-sm text-gray-500 mt-1">
                        Available: {availableFollowers}
                    </p>
                </div>
                
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDispatch}
                        disabled={followers === 0 || availableFollowers === 0}
                        className="px-6 py-2 bg-sky-500 text-white font-bold rounded-lg shadow-md hover:bg-sky-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionModal;
