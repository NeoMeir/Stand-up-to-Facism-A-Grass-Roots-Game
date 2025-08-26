
import { GameState, Region, ProtestTactic, PoliticalLeaning } from './types';

export const REGIONS: Region[] = [
    { id: 'r1', name: 'Capital City', path: 'M100,0 L250,0 L250,150 L150,150 Z', politicalLeaning: PoliticalLeaning.Loyalist, opinionMeter: 10, regimeEnforcers: 20 },
    { id: 'r2', name: 'Western Farmlands', path: 'M0,0 L100,0 L150,150 L0,200 Z', politicalLeaning: PoliticalLeaning.Apathetic, opinionMeter: 35, regimeEnforcers: 5 },
    { id: 'r3', name: 'Northern Mountains', path: 'M0,200 L150,150 L250,150 L250,300 L100,300 Z', politicalLeaning: PoliticalLeaning.OpenMinded, opinionMeter: 50, regimeEnforcers: 8 },
    { id: 'r4', name: 'Eastern Docks', path: 'M250,0 L400,0 L400,200 L250,150 Z', politicalLeaning: PoliticalLeaning.Apathetic, opinionMeter: 40, regimeEnforcers: 12 },
    { id: 'r5', name: 'Southern Plains', path: 'M250,150 L400,200 L400,300 L250,300 Z', politicalLeaning: PoliticalLeaning.OpenMinded, opinionMeter: 45, regimeEnforcers: 6 },
];

export const TACTICS: Record<string, ProtestTactic> = {
    'leaflet': { id: 'leaflet', name: 'Distribute Leaflets', description: 'Spread awareness with pamphlets. Low risk, low reward.', cost: 0, baseNotoriety: 5, baseInfluence: 2, risk: 0.05 },
    'march': { id: 'march', name: 'Peaceful March', description: 'Organize a public march to show numbers.', cost: 200, baseNotoriety: 20, baseInfluence: 5, risk: 0.15 },
    'sit_in': { id: 'sit_in', name: 'Sit-in', description: 'Occupy a public space nonviolently. High impact, higher risk.', cost: 500, baseNotoriety: 50, baseInfluence: 10, risk: 0.25 },
    'strike': { id: 'strike', name: 'General Strike', description: 'Encourage workers to stop working. Very high impact and risk.', cost: 1000, baseNotoriety: 100, baseInfluence: 20, risk: 0.4 },
};

export const INITIAL_GAME_STATE: GameState = {
    turn: 1,
    regions: REGIONS,
    playerResources: {
        followers: 10,
        notoriety: 0,
        funds: 100,
    },
    unlockedTactics: ['leaflet'],
    activeActions: [],
    selectedRegionId: null,
    gameStatus: 'playing',
    turnSummary: null,
};
