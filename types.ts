
export enum PoliticalLeaning {
  Loyalist = "Loyalist",
  Apathetic = "Apathetic",
  OpenMinded = "Open-Minded",
  Rebellious = "Rebellious"
}

export interface ProtestTactic {
  id: string;
  name: string;
  description: string;
  cost: number;
  baseNotoriety: number;
  baseInfluence: number;
  risk: number; // A value between 0 and 1
}

export interface Region {
  id: string;
  name: string;
  path: string; // SVG path data
  politicalLeaning: PoliticalLeaning;
  opinionMeter: number; // 0-100
  regimeEnforcers: number;
}

export interface PlayerResources {
  followers: number;
  notoriety: number;
  funds: number;
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  turn: number;
  regions: Region[];
  playerResources: PlayerResources;
  unlockedTactics: string[];
  activeActions: Action[];
  selectedRegionId: string | null;
  gameStatus: GameStatus;
  turnSummary: TurnSummary | null;
}

export interface Action {
  regionId: string;
  tacticId: string;
  followersAssigned: number;
}

export interface TurnSummary {
    notorietyGained: number;
    fundsGained: number;
    followersGained: number;
    followersLost: number;
    opinionShifts: { regionId: string, regionName: string, shift: number, success: boolean }[];
}
