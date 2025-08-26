
import React from 'react';
import { GameStatus } from '../types';

interface GameEndScreenProps {
    status: GameStatus;
    onRestart: () => void;
}

const GameEndScreen: React.FC<GameEndScreenProps> = ({ status, onRestart }) => {
    const isWin = status === 'won';
    const title = isWin ? "Victory for the People!" : "The Movement Fades...";
    const message = isWin
        ? "Through peaceful protest and unwavering resolve, you have shifted public opinion and forced the regime to cede power. A new era of freedom begins!"
        : "The regime's grip proved too strong, and your movement has lost its momentum. But the seeds of change have been planted for the future.";

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className={`bg-white rounded-2xl shadow-xl p-10 w-full max-w-lg m-4 text-center border-t-8 ${isWin ? 'border-emerald-500' : 'border-rose-500'}`}>
                <h2 className="text-4xl font-bold mb-4">{title}</h2>
                <p className="text-lg text-gray-700 mb-8">{message}</p>
                <button
                    onClick={onRestart}
                    className="px-8 py-3 bg-sky-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-sky-600 transition-colors"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default GameEndScreen;
