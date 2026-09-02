const STORE_KEY = 'miniLifeApp';
const ACHIEVEMENTS_KEY = 'miniLifeAchievements';

const defaultState = {
    profile: {
        name: 'User',
        createdAt: Date.now()
    },
    stats: {
        totalMoods: 0,
        plantsGrown: 0,
        petInteractions: 0,
        currentStreak: 0,
        longestStreak: 0
    },
    achievements: [],
    activity: []
};

function loadState() {
    try {
        const data = localStorage.getItem(STORE_KEY);
        return data ? JSON.parse(data) : defaultState;
    } catch {
        return defaultState;
    }
}

function saveState(state) {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function loadAchievements() {
    try {
        const data = localStorage.getItem(ACHIEVEMENTS_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveAchievements(achievements) {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
}

function addActivity(type, message, icon) {
    const state = loadState();
    state.activity.unshift({
        type,
        message,
        icon,
        timestamp: Date.now()
    });
    if (state.activity.length > 20) {
        state.activity = state.activity.slice(0, 20);
    }
    saveState(state);
}

function unlockAchievement(id) {
    const achievements = loadAchievements();
    if (achievements.includes(id)) return false;

    achievements.push(id);
    saveAchievements(achievements);
    addActivity('achievement', `Unlocked: ${id}`, '🏆');
    showToast(`🏆 Achievement unlocked: ${id}!`);
    return true;
}

function checkAchievements() {
    const state = loadState();
    const achievements = loadAchievements();

    if (state.stats.totalMoods >= 1 && !achievements.includes('first-mood')) {
        unlockAchievement('first-mood');
    }
    if (state.stats.currentStreak >= 7 && !achievements.includes('week-streak')) {
        unlockAchievement('week-streak');
    }
    if (state.stats.plantsGrown >= 1 && !achievements.includes('first-plant')) {
        unlockAchievement('first-plant');
    }
    if (state.stats.plantsGrown >= 5 && !achievements.includes('plant-master')) {
        unlockAchievement('plant-master');
    }
    if (state.stats.petInteractions >= 10 && !achievements.includes('pet-friend')) {
        unlockAchievement('pet-friend');
    }
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
