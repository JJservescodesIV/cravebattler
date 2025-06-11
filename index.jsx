import React, { useState, useEffect } from 'react';
import { Sword, Shield, Heart, Zap, Trophy, Star, Flame, Brain, Target } from 'lucide-react';

const CravingBattleSimulator = () => {
  const [playerStats, setPlayerStats] = useState({
    health: 100,
    willpower: 100,
    level: 1,
    experience: 0,
    battlesWon: 0,
    streak: 0
  });
  
  const [currentBattle, setCurrentBattle] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [gameState, setGameState] = useState('menu'); // menu, battle, victory, defeat
  
  const cravingEnemies = [
    {
      name: "Sneaky Morning Craving",
      type: "ambush",
      health: 30,
      power: 15,
      weakness: "coffee",
      description: "Attacks when you first wake up!",
      icon: "☕"
    },
    {
      name: "Stress Monster",
      type: "berserker", 
      health: 50,
      power: 25,
      weakness: "breathing",
      description: "Feeds on your anxiety and grows stronger!",
      icon: "😤"
    },
    {
      name: "Social Pressure Demon",
      type: "trickster",
      health: 40,
      power: 20,
      weakness: "confidence",
      description: "Whispers 'just one won't hurt' in crowds!",
      icon: "👥"
    },
    {
      name: "Break Time Bandit",
      type: "routine",
      health: 35,
      power: 18,
      weakness: "movement",
      description: "Strikes during work breaks and lunch!",
      icon: "⏰"
    },
    {
      name: "Mega Withdrawal Beast",
      type: "boss",
      health: 80,
      power: 35,
      weakness: "support",
      description: "The ultimate challenge - pure withdrawal fury!",
      icon: "🐉"
    }
  ];

  const battleMoves = [
    {
      name: "Deep Breathing Strike",
      type: "breathing",
      damage: 20,
      cost: 10,
      description: "4-7-8 breathing technique deals solid damage!",
      icon: "🫁"
    },
    {
      name: "Hydration Blast",
      type: "hydration", 
      damage: 15,
      cost: 5,
      description: "Chug water to wash away the craving!",
      icon: "💧"
    },
    {
      name: "Exercise Fury",
      type: "movement",
      damage: 25,
      cost: 15,
      description: "Physical activity devastates cravings!",
      icon: "🏃"
    },
    {
      name: "Mindfulness Shield",
      type: "mental",
      damage: 10,
      cost: 8,
      heal: 15,
      description: "Observe the craving without judgment, heal yourself!",
      icon: "🧘"
    },
    {
      name: "Call for Backup",
      type: "support",
      damage: 30,
      cost: 20,
      description: "Your support network joins the fight!",
      icon: "📞"
    },
    {
      name: "Healthy Snack Attack",
      type: "oral",
      damage: 12,
      cost: 5,
      description: "Keep your mouth busy with good stuff!",
      icon: "🥕"
    }
  ];

  const startBattle = () => {
    const randomEnemy = cravingEnemies[Math.floor(Math.random() * cravingEnemies.length)];
    setCurrentBattle({
      enemy: { ...randomEnemy, currentHealth: randomEnemy.health },
      turn: 'player'
    });
    setBattleLog([`A wild ${randomEnemy.name} appears! ${randomEnemy.description}`]);
    setGameState('battle');
  };

  const executeMove = (move) => {
    if (!currentBattle || gameState !== 'battle') return;
    
    let newLog = [...battleLog];
    let newPlayerStats = { ...playerStats };
    let newBattle = { ...currentBattle };
    
    // Player's turn
    if (newPlayerStats.willpower >= move.cost) {
      newPlayerStats.willpower -= move.cost;
      
      let damage = move.damage;
      // Check for weakness bonus
      if (move.type === newBattle.enemy.weakness) {
        damage = Math.floor(damage * 1.5);
        newLog.push(`🎯 CRITICAL HIT! ${move.name} exploits ${newBattle.enemy.name}'s weakness!`);
      }
      
      newBattle.enemy.currentHealth -= damage;
      newLog.push(`You used ${move.name}! Dealt ${damage} damage!`);
      
      if (move.heal) {
        newPlayerStats.health = Math.min(100, newPlayerStats.health + move.heal);
        newLog.push(`You recovered ${move.heal} health!`);
      }
      
      // Check if enemy is defeated
      if (newBattle.enemy.currentHealth <= 0) {
        const expGained = newBattle.enemy.health + 10;
        newPlayerStats.experience += expGained;
        newPlayerStats.battlesWon += 1;
        newPlayerStats.streak += 1;
        
        // Level up check
        const expNeeded = newPlayerStats.level * 100;
        if (newPlayerStats.experience >= expNeeded) {
          newPlayerStats.level += 1;
          newPlayerStats.experience = 0;
          newPlayerStats.willpower = 100;
          newLog.push(`🎉 LEVEL UP! You're now level ${newPlayerStats.level}!`);
        }
        
        newLog.push(`🏆 Victory! You defeated ${newBattle.enemy.name}!`);
        newLog.push(`Gained ${expGained} experience! Streak: ${newPlayerStats.streak}`);
        setGameState('victory');
      } else {
        // Enemy's turn
        const enemyDamage = Math.floor(newBattle.enemy.power * (0.8 + Math.random() * 0.4));
        newPlayerStats.health -= enemyDamage;
        newLog.push(`${newBattle.enemy.name} attacks for ${enemyDamage} damage!`);
        
        if (newPlayerStats.health <= 0) {
          newPlayerStats.health = 0;
          newPlayerStats.streak = 0;
          newLog.push(`💀 The craving overwhelmed you this time...`);
          setGameState('defeat');
        }
      }
    } else {
      newLog.push(`❌ Not enough willpower! You need ${move.cost} but only have ${newPlayerStats.willpower}.`);
      return;
    }
    
    setPlayerStats(newPlayerStats);
    setCurrentBattle(newBattle);
    setBattleLog(newLog.slice(-6)); // Keep last 6 messages
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentBattle(null);
    setBattleLog([]);
  };

  const restoreHealth = () => {
    setPlayerStats(prev => ({
      ...prev,
      health: Math.min(100, prev.health + 50),
      willpower: Math.min(100, prev.willpower + 30)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen text-white">
      <div className="bg-black bg-opacity-30 rounded-lg p-6 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-center mb-6 text-yellow-300 flex items-center justify-center gap-3">
          <Sword className="text-orange-400" />
          Craving Battle Simulator
          <Shield className="text-blue-400" />
        </h1>
        
        {/* Player Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-600 bg-opacity-50 rounded-lg p-3 text-center">
            <Heart className="mx-auto mb-1" size={20} />
            <div className="text-sm">Health</div>
            <div className="text-xl font-bold">{playerStats.health}/100</div>
          </div>
          <div className="bg-blue-600 bg-opacity-50 rounded-lg p-3 text-center">
            <Zap className="mx-auto mb-1" size={20} />
            <div className="text-sm">Willpower</div>
            <div className="text-xl font-bold">{playerStats.willpower}/100</div>
          </div>
          <div className="bg-yellow-600 bg-opacity-50 rounded-lg p-3 text-center">
            <Star className="mx-auto mb-1" size={20} />
            <div className="text-sm">Level</div>
            <div className="text-xl font-bold">{playerStats.level}</div>
          </div>
          <div className="bg-green-600 bg-opacity-50 rounded-lg p-3 text-center">
            <Trophy className="mx-auto mb-1" size={20} />
            <div className="text-sm">Streak</div>
            <div className="text-xl font-bold">{playerStats.streak}</div>
          </div>
        </div>

        {/* Game States */}
        {gameState === 'menu' && (
          <div className="text-center space-y-6">
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-green-300">🎮 Ready to Battle Your Cravings?</h2>
              <p className="text-lg mb-6">
                Turn your quit-smoking journey into an epic adventure! Each craving is a monster to defeat.
                Use your arsenal of healthy coping strategies to win battles and level up your willpower!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-600 bg-opacity-30 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-300 mb-2">🏆 Your Stats</h3>
                  <p>Battles Won: {playerStats.battlesWon}</p>
                  <p>Current Level: {playerStats.level}</p>
                  <p>Best Streak: {playerStats.streak}</p>
                </div>
                <div className="bg-purple-600 bg-opacity-30 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-300 mb-2">⚔️ Battle Tips</h3>
                  <p>• Exploit enemy weaknesses for critical hits</p>
                  <p>• Manage your willpower carefully</p>
                  <p>• Different enemies need different strategies</p>
                </div>
              </div>
              <button 
                onClick={startBattle}
                className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg text-xl font-bold transition-colors flex items-center gap-2 mx-auto"
              >
                <Flame />
                START BATTLE
                <Target />
              </button>
            </div>
          </div>
        )}

        {gameState === 'battle' && currentBattle && (
          <div className="space-y-6">
            {/* Enemy Status */}
            <div className="bg-red-900 bg-opacity-50 rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">{currentBattle.enemy.icon}</div>
              <h3 className="text-xl font-bold text-red-300">{currentBattle.enemy.name}</h3>
              <div className="text-sm text-gray-300 mb-2">{currentBattle.enemy.description}</div>
              <div className="bg-red-600 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-red-400 h-full transition-all duration-500"
                  style={{ width: `${(currentBattle.enemy.currentHealth / currentBattle.enemy.health) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm mt-1">
                {currentBattle.enemy.currentHealth}/{currentBattle.enemy.health} HP
              </div>
              <div className="text-xs text-yellow-300 mt-1">
                Weakness: {currentBattle.enemy.weakness}
              </div>
            </div>

            {/* Battle Log */}
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 h-32 overflow-y-auto">
              <h4 className="font-bold text-blue-300 mb-2">Battle Log:</h4>
              {battleLog.map((log, index) => (
                <div key={index} className="text-sm mb-1">{log}</div>
              ))}
            </div>

            {/* Battle Moves */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {battleMoves.map((move, index) => (
                <button
                  key={index}
                  onClick={() => executeMove(move)}
                  disabled={playerStats.willpower < move.cost}
                  className={`p-3 rounded-lg transition-colors ${
                    playerStats.willpower >= move.cost
                      ? move.type === currentBattle.enemy.weakness
                        ? 'bg-yellow-600 hover:bg-yellow-700 border-2 border-yellow-400'
                        : 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-600 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-2xl mb-1">{move.icon}</div>
                  <div className="font-bold text-sm">{move.name}</div>
                  <div className="text-xs text-gray-300">{move.description}</div>
                  <div className="text-xs mt-1">
                    Cost: {move.cost} | Damage: {move.damage}
                    {move.heal && ` | Heal: ${move.heal}`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'victory' && (
          <div className="text-center space-y-6">
            <div className="bg-green-900 bg-opacity-50 rounded-lg p-6">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-green-300 mb-4">VICTORY!</h2>
              <p className="text-xl mb-4">You successfully defeated the craving!</p>
              <p className="text-lg text-gray-300 mb-6">
                In real life, you just successfully used a healthy coping strategy to overcome 
                a cigarette craving. That's a genuine victory worth celebrating!
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={startBattle}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  NEXT BATTLE
                </button>
                <button 
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  MAIN MENU
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === 'defeat' && (
          <div className="text-center space-y-6">
            <div className="bg-red-900 bg-opacity-50 rounded-lg p-6">
              <div className="text-6xl mb-4">💀</div>
              <h2 className="text-3xl font-bold text-red-300 mb-4">Craving Won This Round</h2>
              <p className="text-xl mb-4">But you're not out of the fight!</p>
              <p className="text-lg text-gray-300 mb-6">
                In real life, if you smoked, that's okay. Every quit attempt teaches you something. 
                The important thing is to get back in there and keep fighting!
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={restoreHealth}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  RECOVER & HEAL
                </button>
                <button 
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  MAIN MENU
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>💡 Pro tip: Use this game when you feel a real craving coming on!</p>
          <p>The moves you choose here are actual coping strategies that work in real life.</p>
        </div>
      </div>
    </div>
  );
};

export default CravingBattleSimulator;
