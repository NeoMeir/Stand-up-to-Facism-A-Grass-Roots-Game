
import React from 'react';
import { TurnSummary } from '../types';

interface EndTurnSummaryProps {
    summary: TurnSummary;
    onClose: () => void;
}

const EndTurnSummary: React.FC<EndTurnSummaryProps> = ({ summary, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl m-4">
                <h2 className="text-3xl font-bold text-center text-sky-800 mb-6">Turn Report</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-100 p-4 rounded-lg text-center">
                        <p className="text-lg font-semibold text-green-800">Gains</p>
                        <p>Funds: <span className="font-bold text-green-600">+${summary.fundsGained}</span></p>
                        <p>Followers: <span className="font-bold text-green-600">+{summary.followersGained}</span></p>
                        <p>Notoriety: <span className="font-bold text-green-600">+{summary.notorietyGained}</span></p>
                    </div>
                    <div className="bg-rose-100 p-4 rounded-lg text-center">
                        <p className="text-lg font-semibold text-rose-800">Losses</p>
                        <p>Followers Lost: <span className="font-bold text-rose-600">-{summary.followersLost}</span></p>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-sky-700 mb-2">Action Outcomes</h3>
                    <div className="max-h-40 overflow-y-auto space-y-2 bg-gray-100 p-3 rounded-lg">
                        {summary.opinionShifts.length > 0 ? summary.opinionShifts.map((shift, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <p className="font-semibold">{shift.regionName}</p>
                                {shift.success ? (
                                    <p className="text-emerald-600">Opinion +{shift.shift}</p>
                                ) : (
                                    <p className="text-rose-600">Action Failed</p>
                                )}
                            </div>
                        )) : <p className="text-center text-gray-500">No actions were taken.</p>}
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-sky-500 text-white font-bold rounded-lg shadow-md hover:bg-sky-600 transition-colors"
                    >
                        Start Next Turn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EndTurnSummary;
