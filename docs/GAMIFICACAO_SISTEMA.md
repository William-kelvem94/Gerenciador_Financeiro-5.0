# 🎮 Gamificação Financeira - Documentação Técnica

## 🎯 Visão Geral
Sistema de gamificação para tornar o gerenciamento financeiro mais envolvente e motivador, com desafios personalizados, sistema de conquistas e elementos sociais cyberpunk.

---

## 🏗️ Arquitetura do Sistema de Gamificação

### Estrutura de Dados

```typescript
interface FinancialChallenge {
  id: string;
  title: string;
  description: string;
  type: 'economy' | 'investment' | 'budget' | 'habit' | 'knowledge';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  duration: number; // em dias
  target: {
    type: 'amount' | 'percentage' | 'count' | 'streak';
    value: number;
    category?: string;
  };
  rewards: Reward[];
  prerequisites?: string[];
  isActive: boolean;
  cyberpunkTheme: CyberpunkThemeData;
}

interface UserChallenge {
  challengeId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  isCompleted: boolean;
  currentStreak: number;
  bestStreak: number;
  milestones: ChallengeMilestone[];
}

interface Reward {
  type: 'xp' | 'badge' | 'title' | 'theme' | 'feature';
  value: number | string;
  name: string;
  description: string;
  cyberpunkDesign: {
    icon: string;
    color: string;
    animation: string;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  requirements: AchievementRequirement[];
  reward: Reward;
  isHidden: boolean; // Conquistas secretas
  cyberpunkAesthetics: {
    hologramEffect: boolean;
    neonColor: string;
    scanlineEffect: boolean;
  };
}

interface UserProgress {
  userId: string;
  level: number;
  totalXP: number;
  currentXP: number;
  xpToNextLevel: number;
  title: string;
  badges: Badge[];
  achievements: UserAchievement[];
  statistics: UserStatistics;
  leaderboardRank?: number;
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  level: number;
  totalXP: number;
  monthlyXP: number;
  badges: Badge[];
  isCurrentUser: boolean;
  cyberpunkRank: {
    title: string;
    color: string;
    icon: string;
  };
}
```

---

## 🎯 Sistema de Desafios

### 1. Gerador de Desafios Personalizados

```typescript
class ChallengeGenerator {
  private userProfile: UserFinancialProfile;
  private challengeTemplates: ChallengeTemplate[];

  constructor(userProfile: UserFinancialProfile) {
    this.userProfile = userProfile;
    this.challengeTemplates = this.loadChallengeTemplates();
  }

  generatePersonalizedChallenges(): FinancialChallenge[] {
    const challenges: FinancialChallenge[] = [];

    // Analisar padrões do usuário
    const analysis = this.analyzeUserPatterns();

    // 1. Desafios de Economia baseados nos gastos
    if (analysis.highExpenseCategories.length > 0) {
      const economyChallenge = this.createEconomyChallenge(analysis.highExpenseCategories[0]);
      challenges.push(economyChallenge);
    }

    // 2. Desafios de Orçamento
    const budgetChallenge = this.createBudgetChallenge(analysis.budgetAdherence);
    challenges.push(budgetChallenge);

    // 3. Desafios de Investimento
    if (analysis.savingsRate > 0.1) {
      const investmentChallenge = this.createInvestmentChallenge(analysis.availableForInvestment);
      challenges.push(investmentChallenge);
    }

    // 4. Desafios de Hábitos Financeiros
    const habitChallenge = this.createHabitChallenge(analysis.weakFinancialHabits);
    challenges.push(habitChallenge);

    // 5. Desafios de Conhecimento
    const knowledgeChallenge = this.createKnowledgeChallenge(analysis.knowledgeGaps);
    challenges.push(knowledgeChallenge);

    return challenges.filter(c => c !== null);
  }

  private createEconomyChallenge(category: ExpenseCategory): FinancialChallenge {
    const reduction = Math.min(0.3, Math.max(0.1, Math.random() * 0.25 + 0.1));
    const targetAmount = category.averageMonthly * (1 - reduction);

    return {
      id: `economy_${category.name}_${Date.now()}`,
      title: `💰 Economia Cyberpunk: ${category.displayName}`,
      description: `Reduza seus gastos em ${category.displayName} para R$ ${targetAmount.toFixed(2)} neste mês. Suas finanças vão brilhar como neon!`,
      type: 'economy',
      difficulty: this.calculateDifficulty(reduction),
      duration: 30,
      target: {
        type: 'amount',
        value: targetAmount,
        category: category.name
      },
      rewards: [
        {
          type: 'xp',
          value: this.calculateXPReward('economy', reduction),
          name: 'XP de Economia',
          description: 'Experiência em gestão financeira',
          cyberpunkDesign: {
            icon: '💾',
            color: '#00ff41',
            animation: 'neon-pulse'
          }
        },
        {
          type: 'badge',
          value: `economy_${category.name}_bronze`,
          name: `Economista ${category.displayName}`,
          description: `Especialista em economia de ${category.displayName}`,
          cyberpunkDesign: {
            icon: '🔥',
            color: '#ff6b00',
            animation: 'hologram-effect'
          }
        }
      ],
      prerequisites: [],
      isActive: true,
      cyberpunkTheme: {
        backgroundColor: '#001a00',
        accentColor: '#00ff41',
        iconStyle: 'matrix',
        animationType: 'data-stream'
      }
    };
  }

  private createBudgetChallenge(adherence: number): FinancialChallenge {
    const targetAdherence = Math.min(0.95, adherence + 0.15);

    return {
      id: `budget_adherence_${Date.now()}`,
      title: '📊 Protocolo Orçamentário',
      description: `Mantenha-se dentro do orçamento em ${(targetAdherence * 100).toFixed(0)}% das categorias. Precisão é poder!`,
      type: 'budget',
      difficulty: adherence > 0.8 ? 'hard' : 'medium',
      duration: 30,
      target: {
        type: 'percentage',
        value: targetAdherence * 100
      },
      rewards: [
        {
          type: 'xp',
          value: 250,
          name: 'XP de Disciplina',
          description: 'Experiência em controle orçamentário',
          cyberpunkDesign: {
            icon: '⚡',
            color: '#00d4ff',
            animation: 'electric-surge'
          }
        },
        {
          type: 'title',
          value: 'Controlador de Dados',
          name: 'Título: Controlador de Dados',
          description: 'Mestre do controle orçamentário',
          cyberpunkDesign: {
            icon: '👑',
            color: '#fcee09',
            animation: 'crown-glow'
          }
        }
      ],
      prerequisites: [],
      isActive: true,
      cyberpunkTheme: {
        backgroundColor: '#0a0a1a',
        accentColor: '#00d4ff',
        iconStyle: 'blade-runner',
        animationType: 'scan-lines'
      }
    };
  }

  private createInvestmentChallenge(availableAmount: number): FinancialChallenge {
    const targetInvestment = Math.min(availableAmount * 0.8, availableAmount - 1000);

    return {
      id: `investment_start_${Date.now()}`,
      title: '🚀 Protocolo de Investimento',
      description: `Invista R$ ${targetInvestment.toFixed(2)} em aplicações financeiras. O futuro é agora!`,
      type: 'investment',
      difficulty: 'medium',
      duration: 7,
      target: {
        type: 'amount',
        value: targetInvestment,
        category: 'investment'
      },
      rewards: [
        {
          type: 'xp',
          value: 500,
          name: 'XP de Investidor',
          description: 'Experiência em investimentos',
          cyberpunkDesign: {
            icon: '💎',
            color: '#ff00ff',
            animation: 'diamond-sparkle'
          }
        },
        {
          type: 'badge',
          value: 'investor_initiate',
          name: 'Iniciado nos Investimentos',
          description: 'Primeiro passo no mundo dos investimentos',
          cyberpunkDesign: {
            icon: '🌟',
            color: '#8000ff',
            animation: 'star-burst'
          }
        }
      ],
      prerequisites: [],
      isActive: true,
      cyberpunkTheme: {
        backgroundColor: '#1a001a',
        accentColor: '#ff00ff',
        iconStyle: 'ghost-shell',
        animationType: 'purple-rain'
      }
    };
  }
}
```

### 2. Sistema de Progressão

```typescript
class ProgressionSystem {
  private readonly XP_CURVES = {
    easy: [100, 250, 450, 700, 1000, 1400, 1850, 2350, 2900, 3500],
    normal: [200, 500, 900, 1400, 2000, 2800, 3700, 4700, 5800, 7000],
    hard: [500, 1200, 2200, 3500, 5000, 7000, 9200, 11700, 14500, 17500]
  };

  calculateUserLevel(totalXP: number, difficulty: 'easy' | 'normal' | 'hard' = 'normal'): number {
    const curve = this.XP_CURVES[difficulty];
    let level = 1;
    let cumulativeXP = 0;

    for (let i = 0; i < curve.length; i++) {
      cumulativeXP += curve[i];
      if (totalXP >= cumulativeXP) {
        level = i + 2;
      } else {
        break;
      }
    }

    return level;
  }

  getXPForNextLevel(currentXP: number, difficulty: 'easy' | 'normal' | 'hard' = 'normal'): number {
    const currentLevel = this.calculateUserLevel(currentXP, difficulty);
    const curve = this.XP_CURVES[difficulty];
    
    if (currentLevel > curve.length) {
      // Nível máximo alcançado
      return 0;
    }

    let cumulativeXP = 0;
    for (let i = 0; i < currentLevel - 1; i++) {
      cumulativeXP += curve[i];
    }

    return cumulativeXP + curve[currentLevel - 1] - currentXP;
  }

  getCyberpunkTitle(level: number): string {
    const titles = [
      'Iniciante Digital',
      'Navegador de Dados',
      'Hacker Financeiro',
      'Analista Cibernético',
      'Especialista em Códigos',
      'Arquiteto de Sistemas',
      'Mestre dos Algoritmos',
      'Lenda da Matrix',
      'Senhor dos Dados',
      'Guardião do Futuro'
    ];

    const titleIndex = Math.min(Math.floor((level - 1) / 5), titles.length - 1);
    return titles[titleIndex];
  }

  getCyberpunkRankData(level: number, totalXP: number): CyberpunkRank {
    if (level >= 50) {
      return {
        title: 'Lenda da Matrix',
        color: '#ff00ff',
        icon: '👑',
        description: 'Transcendeu os limites financeiros'
      };
    } else if (level >= 30) {
      return {
        title: 'Mestre dos Algoritmos',
        color: '#00ffff',
        icon: '🔱',
        description: 'Dominou a arte da gestão financeira'
      };
    } else if (level >= 20) {
      return {
        title: 'Arquiteto de Sistemas',
        color: '#ffff00',
        icon: '⚡',
        description: 'Construtor de estratégias financeiras'
      };
    } else if (level >= 10) {
      return {
        title: 'Hacker Financeiro',
        color: '#00ff00',
        icon: '💻',
        description: 'Decodificou os segredos do dinheiro'
      };
    } else {
      return {
        title: 'Navegador de Dados',
        color: '#0080ff',
        icon: '🔍',
        description: 'Explorando o mundo financeiro'
      };
    }
  }
}
```

---

## 🏆 Sistema de Conquistas

### 1. Engine de Conquistas

```typescript
class AchievementEngine {
  private achievements: Achievement[] = [
    {
      id: 'first_save',
      name: 'Primeira Economia',
      description: 'Complete seu primeiro desafio de economia',
      category: 'economia',
      tier: 'bronze',
      requirements: [
        { type: 'challenge_completed', value: 'economy', count: 1 }
      ],
      reward: {
        type: 'badge',
        value: 'first_saver',
        name: 'Primeiro Economista',
        description: 'Sua jornada financeira começou!',
        cyberpunkDesign: {
          icon: '💰',
          color: '#00ff41',
          animation: 'matrix-glow'
        }
      },
      isHidden: false,
      cyberpunkAesthetics: {
        hologramEffect: true,
        neonColor: '#00ff41',
        scanlineEffect: true
      }
    },
    {
      id: 'budget_master',
      name: 'Mestre do Orçamento',
      description: 'Mantenha-se dentro do orçamento por 3 meses consecutivos',
      category: 'orçamento',
      tier: 'gold',
      requirements: [
        { type: 'budget_adherence', value: 90, period: 'monthly', streak: 3 }
      ],
      reward: {
        type: 'title',
        value: 'Controlador Supremo',
        name: 'Título: Controlador Supremo',
        description: 'Mestre absoluto do controle orçamentário',
        cyberpunkDesign: {
          icon: '👑',
          color: '#ffd700',
          animation: 'golden-crown'
        }
      },
      isHidden: false,
      cyberpunkAesthetics: {
        hologramEffect: true,
        neonColor: '#ffd700',
        scanlineEffect: false
      }
    },
    {
      id: 'investment_guru',
      name: 'Guru dos Investimentos',
      description: 'Tenha R$ 10.000 investidos em diferentes modalidades',
      category: 'investimentos',
      tier: 'platinum',
      requirements: [
        { type: 'total_invested', value: 10000 },
        { type: 'investment_diversity', value: 3 }
      ],
      reward: {
        type: 'theme',
        value: 'investor_elite',
        name: 'Tema: Elite dos Investidores',
        description: 'Tema exclusivo para investidores avançados',
        cyberpunkDesign: {
          icon: '💎',
          color: '#00ffff',
          animation: 'diamond-matrix'
        }
      },
      isHidden: true,
      cyberpunkAesthetics: {
        hologramEffect: true,
        neonColor: '#00ffff',
        scanlineEffect: true
      }
    }
  ];

  async checkAchievements(userId: string, action: UserAction): Promise<Achievement[]> {
    const userProgress = await this.getUserProgress(userId);
    const unlockedAchievements: Achievement[] = [];

    for (const achievement of this.achievements) {
      if (userProgress.achievements.some(ua => ua.achievementId === achievement.id)) {
        continue; // Já conquistada
      }

      if (await this.checkRequirements(userId, achievement.requirements, action)) {
        unlockedAchievements.push(achievement);
        await this.unlockAchievement(userId, achievement);
      }
    }

    return unlockedAchievements;
  }

  private async checkRequirements(
    userId: string, 
    requirements: AchievementRequirement[], 
    action: UserAction
  ): Promise<boolean> {
    for (const requirement of requirements) {
      if (!await this.checkSingleRequirement(userId, requirement, action)) {
        return false;
      }
    }
    return true;
  }

  private async checkSingleRequirement(
    userId: string, 
    requirement: AchievementRequirement, 
    action: UserAction
  ): Promise<boolean> {
    switch (requirement.type) {
      case 'challenge_completed':
        return await this.checkChallengeCompleted(userId, requirement);
      
      case 'budget_adherence':
        return await this.checkBudgetAdherence(userId, requirement);
      
      case 'total_invested':
        return await this.checkTotalInvested(userId, requirement);
      
      case 'spending_streak':
        return await this.checkSpendingStreak(userId, requirement);
      
      case 'savings_goal':
        return await this.checkSavingsGoal(userId, requirement);
      
      default:
        return false;
    }
  }

  async generateAchievementNotification(achievement: Achievement): Promise<CyberpunkNotification> {
    return {
      id: `achievement_${achievement.id}`,
      type: 'achievement',
      title: `🏆 Conquista Desbloqueada!`,
      message: `${achievement.name} - ${achievement.description}`,
      cyberpunkStyle: {
        backgroundColor: achievement.cyberpunkAesthetics.neonColor + '20',
        borderColor: achievement.cyberpunkAesthetics.neonColor,
        glowEffect: true,
        scanlines: achievement.cyberpunkAesthetics.scanlineEffect,
        hologram: achievement.cyberpunkAesthetics.hologramEffect
      },
      duration: 5000,
      sound: 'achievement_unlock',
      animation: 'slide-in-from-top'
    };
  }
}
```

---

## 🎮 Interface de Gamificação

### 1. Dashboard de Progresso

```typescript
// components/Gamification/ProgressDashboard.tsx
import React from 'react';
import { useGameProgress } from '../../hooks/useGameProgress';
import { CyberpunkProgressBar } from './CyberpunkProgressBar';
import { BadgeCollection } from './BadgeCollection';
import { ChallengeGrid } from './ChallengeGrid';

export const ProgressDashboard: React.FC = () => {
  const { userProgress, activeChallenges, leaderboard, isLoading } = useGameProgress();

  if (isLoading || !userProgress) {
    return <div className="cyberpunk-loading">Carregando dados do nexus...</div>;
  }

  return (
    <div className="progress-dashboard cyberpunk-container">
      {/* Header com nível e XP */}
      <div className="progress-header neon-border">
        <div className="user-rank">
          <div className="rank-icon" data-rank={userProgress.cyberpunkRank.title}>
            {userProgress.cyberpunkRank.icon}
          </div>
          <div className="rank-info">
            <h2 className="neon-glow">{userProgress.cyberpunkRank.title}</h2>
            <p className="level-display">Nível {userProgress.level}</p>
          </div>
        </div>
        
        <CyberpunkProgressBar
          current={userProgress.currentXP}
          max={userProgress.xpToNextLevel}
          label="XP para próximo nível"
          color={userProgress.cyberpunkRank.color}
        />
      </div>

      {/* Grid de conteúdo */}
      <div className="dashboard-grid">
        {/* Desafios Ativos */}
        <div className="dashboard-section">
          <h3 className="section-title neon-glow">🎯 Missões Ativas</h3>
          <ChallengeGrid challenges={activeChallenges} />
        </div>

        {/* Conquistas */}
        <div className="dashboard-section">
          <h3 className="section-title neon-glow">🏆 Conquistas</h3>
          <BadgeCollection 
            badges={userProgress.badges}
            achievements={userProgress.achievements}
          />
        </div>

        {/* Leaderboard */}
        <div className="dashboard-section">
          <h3 className="section-title neon-glow">📊 Ranking Global</h3>
          <LeaderboardWidget entries={leaderboard.slice(0, 10)} />
        </div>

        {/* Estatísticas */}
        <div className="dashboard-section">
          <h3 className="section-title neon-glow">📈 Estatísticas</h3>
          <StatsGrid stats={userProgress.statistics} />
        </div>
      </div>
    </div>
  );
};
```

### 2. Componente de Desafio Cyberpunk

```typescript
// components/Gamification/CyberpunkChallenge.tsx
import React, { useState } from 'react';
import { FinancialChallenge, UserChallenge } from '../../types/gamification';
import { useCyberpunkSound } from '../../utils/soundSystem';

interface CyberpunkChallengeProps {
  challenge: FinancialChallenge;
  userChallenge?: UserChallenge;
  onAccept: (challengeId: string) => void;
  onComplete: (challengeId: string) => void;
}

export const CyberpunkChallenge: React.FC<CyberpunkChallengeProps> = ({
  challenge,
  userChallenge,
  onAccept,
  onComplete
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { playClick, playSuccess } = useCyberpunkSound();

  const getDifficultyColor = (difficulty: string): string => {
    const colors = {
      easy: '#00ff41',
      medium: '#ffaa00',
      hard: '#ff6600',
      expert: '#ff0080'
    };
    return colors[difficulty as keyof typeof colors] || '#00d4ff';
  };

  const handleAccept = () => {
    playClick();
    onAccept(challenge.id);
  };

  const handleComplete = () => {
    playSuccess();
    onComplete(challenge.id);
  };

  return (
    <div 
      className={`cyberpunk-challenge ${challenge.type} ${isHovered ? 'hovered' : ''}`}
      style={{ 
        borderColor: challenge.cyberpunkTheme.accentColor,
        backgroundColor: challenge.cyberpunkTheme.backgroundColor 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header do desafio */}
      <div className="challenge-header">
        <div className="challenge-type-badge" style={{ color: getDifficultyColor(challenge.difficulty) }}>
          {challenge.type.toUpperCase()}
        </div>
        <div className="challenge-difficulty">
          <span className="difficulty-label">DIFICULDADE:</span>
          <span 
            className="difficulty-value neon-glow"
            style={{ color: getDifficultyColor(challenge.difficulty) }}
          >
            {challenge.difficulty.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="challenge-content">
        <h3 className="challenge-title neon-glow">{challenge.title}</h3>
        <p className="challenge-description">{challenge.description}</p>

        {/* Progresso (se ativo) */}
        {userChallenge && (
          <div className="challenge-progress">
            <div className="progress-label">
              PROGRESSO: {userChallenge.progress.toFixed(1)}%
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar neon-glow"
                style={{ 
                  width: `${userChallenge.progress}%`,
                  backgroundColor: challenge.cyberpunkTheme.accentColor
                }}
              />
            </div>
          </div>
        )}

        {/* Meta do desafio */}
        <div className="challenge-target">
          <span className="target-label">META:</span>
          <span className="target-value">
            {challenge.target.type === 'amount' && `R$ ${challenge.target.value.toFixed(2)}`}
            {challenge.target.type === 'percentage' && `${challenge.target.value}%`}
            {challenge.target.type === 'count' && `${challenge.target.value} vezes`}
            {challenge.target.type === 'streak' && `${challenge.target.value} dias consecutivos`}
          </span>
        </div>

        {/* Duração */}
        <div className="challenge-duration">
          <span className="duration-label">DURAÇÃO:</span>
          <span className="duration-value">{challenge.duration} dias</span>
        </div>
      </div>

      {/* Recompensas */}
      <div className="challenge-rewards">
        <h4 className="rewards-title">RECOMPENSAS:</h4>
        <div className="rewards-grid">
          {challenge.rewards.map((reward, index) => (
            <div key={index} className="reward-item">
              <span className="reward-icon">{reward.cyberpunkDesign.icon}</span>
              <div className="reward-info">
                <span className="reward-name">{reward.name}</span>
                <span className="reward-value">
                  {reward.type === 'xp' && `+${reward.value} XP`}
                  {reward.type === 'badge' && 'Badge'}
                  {reward.type === 'title' && 'Título'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ações */}
      <div className="challenge-actions">
        {!userChallenge && (
          <button 
            className="cyberpunk-btn accept-btn"
            onClick={handleAccept}
            style={{ borderColor: challenge.cyberpunkTheme.accentColor }}
          >
            ACEITAR MISSÃO
          </button>
        )}
        
        {userChallenge && !userChallenge.isCompleted && userChallenge.progress >= 100 && (
          <button 
            className="cyberpunk-btn complete-btn"
            onClick={handleComplete}
            style={{ borderColor: '#00ff41' }}
          >
            FINALIZAR MISSÃO
          </button>
        )}
        
        {userChallenge && userChallenge.isCompleted && (
          <div className="challenge-completed">
            <span className="completed-icon">✅</span>
            <span className="completed-text">MISSÃO COMPLETA</span>
          </div>
        )}
      </div>

      {/* Efeitos visuais */}
      {challenge.cyberpunkTheme.animationType === 'scan-lines' && (
        <div className="scan-lines-overlay" />
      )}
      
      {challenge.cyberpunkTheme.animationType === 'data-stream' && (
        <div className="data-stream-overlay">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="data-particle" />
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 📱 Integração e APIs

### 1. Hooks React para Gamificação

```typescript
// hooks/useGameProgress.ts
import { useState, useEffect, useCallback } from 'react';
import { gamificationAPI } from '../api/gamification';

export const useGameProgress = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [activeChallenges, setActiveChallenges] = useState<UserChallenge[]>([]);
  const [availableChallenges, setAvailableChallenges] = useState<FinancialChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserProgress = useCallback(async () => {
    try {
      const progress = await gamificationAPI.getUserProgress();
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  }, []);

  const loadChallenges = useCallback(async () => {
    try {
      const [active, available] = await Promise.all([
        gamificationAPI.getActiveChallenges(),
        gamificationAPI.getAvailableChallenges()
      ]);
      setActiveChallenges(active);
      setAvailableChallenges(available);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  }, []);

  const loadLeaderboard = useCallback(async () => {
    try {
      const leaderboardData = await gamificationAPI.getLeaderboard();
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  }, []);

  const acceptChallenge = async (challengeId: string) => {
    try {
      await gamificationAPI.acceptChallenge(challengeId);
      await loadChallenges();
      await loadUserProgress();
    } catch (error) {
      console.error('Error accepting challenge:', error);
    }
  };

  const completeChallenge = async (challengeId: string) => {
    try {
      const result = await gamificationAPI.completeChallenge(challengeId);
      await loadChallenges();
      await loadUserProgress();
      return result;
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([
        loadUserProgress(),
        loadChallenges(),
        loadLeaderboard()
      ]);
      setIsLoading(false);
    };

    loadAll();
  }, [loadUserProgress, loadChallenges, loadLeaderboard]);

  return {
    userProgress,
    activeChallenges,
    availableChallenges,
    leaderboard,
    isLoading,
    acceptChallenge,
    completeChallenge,
    refresh: () => {
      loadUserProgress();
      loadChallenges();
      loadLeaderboard();
    }
  };
};
```

---

## 🎨 Estilos CSS para Gamificação

```css
/* Gamification Cyberpunk Styles */
.cyberpunk-challenge {
  position: relative;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  background: var(--color-bg-card);
  overflow: hidden;
  transition: all 0.3s ease;
}

.cyberpunk-challenge:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 8px 25px rgba(0, 212, 255, 0.3),
    0 0 20px var(--color-primary);
}

.cyberpunk-challenge.hovered::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: scan-effect 2s infinite;
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.challenge-type-badge {
  padding: 4px 12px;
  border: 1px solid currentColor;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.difficulty-value {
  font-weight: bold;
  margin-left: 8px;
}

.challenge-title {
  font-size: 24px;
  margin-bottom: 12px;
  color: var(--color-primary);
}

.challenge-progress {
  margin: 16px 0;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: progress-shine 2s infinite;
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.reward-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
}

.reward-icon {
  font-size: 20px;
  margin-right: 8px;
}

.cyberpunk-btn {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  padding: 12px 24px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 16px;
}

.cyberpunk-btn:hover {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  box-shadow: 
    0 0 10px var(--color-primary),
    0 0 20px var(--color-primary);
  transform: translateY(-2px);
}

.challenge-completed {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 2px solid #00ff41;
  border-radius: 4px;
  background: rgba(0, 255, 65, 0.1);
  color: #00ff41;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 16px;
}

.scan-lines-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 212, 255, 0.1) 2px,
    rgba(0, 212, 255, 0.1) 4px
  );
  pointer-events: none;
  animation: scanlines-move 5s infinite linear;
}

.data-stream-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.data-particle {
  position: absolute;
  width: 2px;
  height: 10px;
  background: var(--color-primary);
  border-radius: 1px;
  animation: data-fall 3s infinite linear;
}

.data-particle:nth-child(1) { left: 10%; animation-delay: 0s; }
.data-particle:nth-child(2) { left: 30%; animation-delay: 1s; }
.data-particle:nth-child(3) { left: 50%; animation-delay: 2s; }
.data-particle:nth-child(4) { left: 70%; animation-delay: 0.5s; }
.data-particle:nth-child(5) { left: 90%; animation-delay: 1.5s; }

/* Keyframe animations */
@keyframes scan-effect {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes progress-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes data-fall {
  0% { 
    transform: translateY(-100%);
    opacity: 0;
  }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { 
    transform: translateY(calc(100vh + 100px));
    opacity: 0;
  }
}

@keyframes scanlines-move {
  0% { transform: translateY(0); }
  100% { transform: translateY(4px); }
}
```

---

Este sistema de gamificação cyberpunk completo tornará a experiência financeira muito mais envolvente e motivadora! 🎮✨
