
import React from 'react';
import { Region as RegionType, PoliticalLeaning } from '../types';

interface GameMapProps {
    regions: RegionType[];
    selectedRegionId: string | null;
    onSelectRegion: (regionId: string) => void;
}

const getRegionColor = (region: RegionType): string => {
    const opinion = region.opinionMeter;
    if (opinion > 80) return 'fill-emerald-500';
    if (opinion > 60) return 'fill-emerald-400';
    if (opinion > 40) return 'fill-sky-400';
    if (opinion > 20) return 'fill-amber-400';
    return 'fill-rose-400';
};

const GameMap: React.FC<GameMapProps> = ({ regions, selectedRegionId, onSelectRegion }) => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 400 300" className="max-w-4xl max-h-[80vh] drop-shadow-lg">
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {regions.map((region) => (
                    <g key={region.id} onClick={() => onSelectRegion(region.id)} className="cursor-pointer">
                         <path
                            d={region.path}
                            className={`
                                ${getRegionColor(region)}
                                stroke-white stroke-2
                                transition-all duration-300
                                hover:brightness-110
                            `}
                            style={{
                                filter: region.id === selectedRegionId ? 'url(#glow)' : 'none',
                            }}
                        />
                        <text
                            x={calculateLabelPosition(region.path).x}
                            y={calculateLabelPosition(region.path).y}
                            textAnchor="middle"
                            className="fill-white font-bold text-sm pointer-events-none drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                        >
                            {region.name}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

// Helper to find a rough center of the SVG path for label placement
function calculateLabelPosition(pathData: string): { x: number, y: number } {
    const points = pathData.replace(/[M,L,Z]/g, ' ').trim().split(/\s+/).map(Number);
    let xMin = Infinity, yMin = Infinity, xMax = -Infinity, yMax = -Infinity;
    for (let i = 0; i < points.length; i += 2) {
        xMin = Math.min(xMin, points[i]);
        yMin = Math.min(yMin, points[i+1]);
        xMax = Math.max(xMax, points[i]);
        yMax = Math.max(yMax, points[i+1]);
    }
    return { x: xMin + (xMax - xMin) / 2, y: yMin + (yMax - yMin) / 2 };
}

export default GameMap;
