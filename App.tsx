
import React, { useState, useCallback, useMemo } from 'react';
import { GameState, PlayerResources, Region, Action, ProtestTactic, TurnSummary, GameStatus, PoliticalLeaning } from './types';
import { INITIAL_GAME_STATE, TACTICS, REGIONS } from './constants';
import GameMap from './components/GameMap';
import HUD from './components/HUD';
import RegionDetailPanel from './components/RegionDetailPanel';
import ActionModal from './components/ActionModal';
import UpgradesPanel from './components/UpgradesPanel';
import EndTurnSummary from './components/EndTurnSummary';
import GameEndScreen from './components/GameEndScreen';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [isUpgradesPanelOpen, setIsUpgradesPanelOpen] = useState(false);
    const [selectedTactic, setSelectedTactic] = useState<ProtestTactic | null>(null);

    const selectedRegion = useMemo(() => {
        return gameState.regions.find(r => r.id === gameState.selectedRegionId) || null;
    }, [gameState.regions, gameState.selectedRegionId]);

    const handleSelectRegion = useCallback((regionId: string) => {
        setGameState(prev => ({ ...prev, selectedRegionId: regionId }));
    }, []);

    const handleOpenActionModal = useCallback((tactic: ProtestTactic) => {
        setSelectedTactic(tactic);
        setIsActionModalOpen(true);
    }, []);

    const handleDispatchAction = useCallback((followersAssigned: number) => {
        if (!selectedRegion || !selectedTactic) return;

        const newAction: Action = {
            regionId: selectedRegion.id,
            tacticId: selectedTactic.id,
            followersAssigned,
        };

        setGameState(prev => {
            const availableFollowers = prev.playerResources.followers - prev.activeActions.reduce((sum, a) => sum + a.followersAssigned, 0);
            if (followersAssigned > availableFollowers) return prev; // Should be prevented by UI but safe check

            return {
                ...prev,
                activeActions: [...prev.activeActions, newAction]
            };
        });
        setIsActionModalOpen(false);
        setSelectedTactic(null);
    }, [selectedRegion, selectedTactic]);

    const handleUnlockTactic = useCallback((tacticId: string) => {
        const tacticToUnlock = TACTICS[tacticId];
        setGameState(prev => {
            if (prev.playerResources.funds >= tacticToUnlock.cost && !prev.unlockedTactics.includes(tacticId)) {
                return {
                    ...prev,
                    playerResources: {
                        ...prev.playerResources,
                        funds: prev.playerResources.funds - tacticToUnlock.cost,
                    },
                    unlockedTactics: [...prev.unlockedTactics, tacticId],
                };
            }
            return prev;
        });
    }, []);

    const handleRecruitFollowers = useCallback(() => {
        const costPerFollower = 10;
        setGameState(prev => {
            if (prev.playerResources.funds >= costPerFollower) {
                return {
                    ...prev,
                    playerResources: {
                        ...prev.playerResources,
                        followers: prev.playerResources.followers + 1,
                        funds: prev.playerResources.funds - costPerFollower,
                    },
                };
            }
            return prev;
        });
    }, []);

    const handleEndTurn = useCallback(() => {
        setGameState(prev => {
            let nextRegions = [...prev.regions];
            let nextPlayerResources = { ...prev.playerResources };
            const summary: TurnSummary = {
                notorietyGained: 0,
                fundsGained: 0,
                followersGained: 0,
                followersLost: 0,
                opinionShifts: [],
            };

            // Process actions
            for (const action of prev.activeActions) {
                const region = nextRegions.find(r => r.id === action.regionId)!;
                const tactic = TACTICS[action.tacticId];
                
                // Success chance influenced by followers vs enforcers
                const powerRatio = action.followersAssigned / (region.regimeEnforcers * 2 + 1);
                const successChance = Math.min(0.95, 0.5 + powerRatio * 0.25 - tactic.risk);
                
                if (Math.random() < successChance) { // Success
                    const notoriety = Math.ceil(tactic.baseNotoriety * (1 + powerRatio * 0.5));
                    summary.notorietyGained += notoriety;
                    
                    let influence = tactic.baseInfluence;
                    if (region.politicalLeaning === PoliticalLeaning.Loyalist) influence *= 0.5;
                    if (region.politicalLeaning === PoliticalLeaning.OpenMinded) influence *= 1.5;

                    const opinionShift = Math.ceil(influence * Math.log1p(action.followersAssigned));
                    
                    const regionIndex = nextRegions.findIndex(r => r.id === action.regionId);
                    const newOpinion = Math.min(100, nextRegions[regionIndex].opinionMeter + opinionShift);
                    nextRegions[regionIndex] = { ...nextRegions[regionIndex], opinionMeter: newOpinion };
                    summary.opinionShifts.push({ regionId: action.regionId, shift: opinionShift, success: true, regionName: region.name });

                } else { // Failure
                    const followersLost = Math.ceil(action.followersAssigned * (tactic.risk + 0.1));
                    summary.followersLost += followersLost;
                    summary.opinionShifts.push({ regionId: action.regionId, shift: 0, success: false, regionName: region.name });
                }
            }

            nextPlayerResources.notoriety += summary.notorietyGained;
            nextPlayerResources.followers -= summary.followersLost;

            // Passive gains for next turn
            const controlledRegions = nextRegions.filter(r => r.opinionMeter > 50).length;
            summary.fundsGained = 50 + (controlledRegions * 25) + Math.floor(nextPlayerResources.notoriety / 10);
            summary.followersGained = 1 + controlledRegions;

            nextPlayerResources.funds += summary.fundsGained;
            nextPlayerResources.followers += summary.followersGained;
            
            // Regime response
            nextRegions = nextRegions.map(region => {
                let newEnforcers = region.regimeEnforcers;
                if (region.opinionMeter > 75) newEnforcers = Math.max(0, newEnforcers-2);
                else if (region.opinionMeter > 50) newEnforcers = Math.max(1, newEnforcers-1);
                else if (prev.activeActions.some(a => a.regionId === region.id)) {
                    newEnforcers += Math.floor(Math.random() * 3) + 1;
                }
                return { ...region, regimeEnforcers: newEnforcers };
            });


            // Check win/loss conditions
            const totalOpinion = nextRegions.reduce((sum, r) => sum + r.opinionMeter, 0);
            const winThreshold = nextRegions.length * 80;
            let nextGameStatus: GameStatus = 'playing';

            if (totalOpinion >= winThreshold) {
                nextGameStatus = 'won';
            } else if (nextPlayerResources.followers <= 0 && prev.playerResources.followers > 0) { // Check previous state to avoid losing on turn 1
                nextGameStatus = 'lost';
            }

            return {
                ...prev,
                turn: prev.turn + 1,
                regions: nextRegions,
                playerResources: nextPlayerResources,
                activeActions: [],
                turnSummary: summary,
                gameStatus: nextGameStatus,
                selectedRegionId: null,
            };
        });
    }, []);

    const totalFollowersAssigned = gameState.activeActions.reduce((sum, action) => sum + action.followersAssigned, 0);
    const availableFollowers = gameState.playerResources.followers - totalFollowersAssigned;

    return (
        <div className="w-screen h-screen bg-sky-50 text-gray-800 flex flex-col items-center p-4 overflow-hidden">
            <h1 className="text-4xl font-bold text-sky-800 mb-2">The People's Crusade</h1>
            <HUD
                resources={gameState.playerResources}
                turn={gameState.turn}
                onEndTurn={handleEndTurn}
                onOpenUpgrades={() => setIsUpgradesPanelOpen(true)}
                followersBusy={totalFollowersAssigned}
            />
            <main className="w-full flex-grow flex items-center justify-center relative mt-4">
                <GameMap
                    regions={gameState.regions}
                    selectedRegionId={gameState.selectedRegionId}
                    onSelectRegion={handleSelectRegion}
                />
                {selectedRegion && (
                    <RegionDetailPanel
                        region={selectedRegion}
                        unlockedTactics={gameState.unlockedTactics}
                        onOpenActionModal={handleOpenActionModal}
                        onClose={() => setGameState(prev => ({...prev, selectedRegionId: null}))}
                    />
                )}
            </main>

            {isActionModalOpen && selectedRegion && selectedTactic && (
                <ActionModal
                    isOpen={isActionModalOpen}
                    onClose={() => setIsActionModalOpen(false)}
                    tactic={selectedTactic}
                    region={selectedRegion}
                    availableFollowers={availableFollowers}
                    onDispatch={handleDispatchAction}
                />
            )}

            <UpgradesPanel
                isOpen={isUpgradesPanelOpen}
                onClose={() => setIsUpgradesPanelOpen(false)}
                unlockedTactics={gameState.unlockedTactics}
                allTactics={TACTICS}
                funds={gameState.playerResources.funds}
                onUnlockTactic={handleUnlockTactic}
                onRecruitFollowers={handleRecruitFollowers}
            />
            
            {gameState.turnSummary && (
                <EndTurnSummary
                    summary={gameState.turnSummary}
                    onClose={() => setGameState(prev => ({ ...prev, turnSummary: null }))}
                />
            )}

            {gameState.gameStatus !== 'playing' && (
                <GameEndScreen
                    status={gameState.gameStatus}
                    onRestart={() => setGameState(INITIAL_GAME_STATE)}
                />
            )}
        </div>
    );
};

export default App;
