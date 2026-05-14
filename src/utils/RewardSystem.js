/**
 * 🍹 Global Reward Management System for Cold Drink Website
 * Handles daily limits, storage and code generation for game rewards.
 */

const STORAGE_KEY = 'chillsip_user_rewards';
const DAILY_LIMIT = 999; // Raised limit for unlimited gameplay and testing

export const rewardSystem = {
  getRewards: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse rewards', e);
      return [];
    }
  },

  saveReward: (bottles, gameType) => {
    const rewards = rewardSystem.getRewards();
    const today = new Date().toDateString();

    const todayCount = rewards.filter(r => r.dateStr === today).length;

    if (todayCount >= DAILY_LIMIT) {
      return { success: false, message: 'Daily reward limit reached! Come back tomorrow.' };
    }

    const newReward = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      code: `DRINK-${Math.floor(1000 + Math.random() * 9000)}`,
      bottles,
      game: gameType,
      date: new Date().toISOString(),
      dateStr: today,
      redeemed: false
    };

    rewards.push(newReward);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rewards));
    return { success: true, reward: newReward };
  },

  canPlay: () => {
    const rewards = rewardSystem.getRewards();
    const today = new Date().toDateString();
    const todayCount = rewards.filter(r => r.dateStr === today).length;
    return todayCount < DAILY_LIMIT;
  },

  getRemainingDaily: () => {
    const rewards = rewardSystem.getRewards();
    const today = new Date().toDateString();
    return Math.max(0, DAILY_LIMIT - rewards.filter(r => r.dateStr === today).length);
  }
};
