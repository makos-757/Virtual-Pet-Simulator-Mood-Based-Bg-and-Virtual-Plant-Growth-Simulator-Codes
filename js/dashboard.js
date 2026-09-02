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
    lastMood: null,
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

function updateDashboard() {
    const state = loadState();
    const achievements = loadAchievements();

    document.getElementById('total-moods').textContent = state.stats.totalMoods;
    document.getElementById('plants-grown').textContent = state.stats.plantsGrown;
    document.getElementById('pet-interactions').textContent = state.stats.petInteractions;
    document.getElementById('current-streak').textContent = state.stats.currentStreak;

    document.querySelectorAll('.achievement').forEach(el => {
        const id = el.dataset.id;
        el.classList.toggle('unlocked', achievements.includes(id));
    });

    const activityList = document.getElementById('activity-list');
    if (state.activity.length === 0) {
        activityList.innerHTML = '<p class="empty-state">No activity yet. Start using the apps!</p>';
    } else {
        activityList.innerHTML = state.activity.map(item => {
            const date = new Date(item.timestamp);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `
                <div class="activity-item">
                    <span class="activity-icon">${item.icon}</span>
                    <div class="activity-text">
                        <strong>${item.message}</strong>
                        <span>${item.type}</span>
                    </div>
                    <span class="activity-time">${timeStr}</span>
                </div>
            `;
        }).join('');
    }

    updatePreviewCards();
}

function updatePreviewCards() {
    const state = loadState();

    const moodPreviewEmoji = document.getElementById('mood-preview-emoji');
    const moodPreviewText = document.getElementById('mood-preview-text');
    const plantPreviewEmoji = document.getElementById('plant-preview-emoji');
    const plantPreviewText = document.getElementById('plant-preview-text');
    const petPreviewEmoji = document.getElementById('pet-preview-emoji');
    const petPreviewText = document.getElementById('pet-preview-text');

    if (moodPreviewEmoji && moodPreviewText) {
        const lastMood = state.lastMood;
        if (lastMood) {
            const moodEmojis = {
                happy: '😊',
                sad: '😢',
                tired: '😴',
                angry: '😡'
            };
            moodPreviewEmoji.textContent = moodEmojis[lastMood] || '😊';
            moodPreviewText.textContent = `Last mood: ${lastMood}`;
        } else {
            moodPreviewEmoji.textContent = '😊';
            moodPreviewText.textContent = 'Log your mood today';
        }
    }

    if (plantPreviewEmoji && plantPreviewText) {
        const plantState = getPlantState();
        if (plantState && plantState.growth > 0) {
            const emojis = { 0: '🌱', 25: '🌿', 50: '🪴', 75: '🌳', 100: '🌳' };
            const closest = Object.keys(emojis).reduce((a, b) => Math.abs(b - plantState.growth) < Math.abs(a - plantState.growth) ? b : a);
            plantPreviewEmoji.textContent = emojis[closest];
            plantPreviewText.textContent = `${plantState.growth}% grown`;
        } else {
            plantPreviewEmoji.textContent = '🌱';
            plantPreviewText.textContent = 'Start growing a plant';
        }
    }

    if (petPreviewEmoji && petPreviewText) {
        const petState = getPetState();
        if (petState) {
            if (petState.health <= 0) {
                petPreviewEmoji.textContent = '💀';
                petPreviewText.textContent = 'Pet needs reset';
            } else if (petState.happiness > 80 && petState.energy > 80) {
                petPreviewEmoji.textContent = '🥰';
                petPreviewText.textContent = 'Pet is very happy!';
            } else if (petState.happiness < 25 || petState.energy < 25) {
                petPreviewEmoji.textContent = '😿';
                petPreviewText.textContent = 'Pet needs attention';
            } else {
                petPreviewEmoji.textContent = '🐶';
                petPreviewText.textContent = 'Pet is doing well';
            }
        } else {
            petPreviewEmoji.textContent = '🐶';
            petPreviewText.textContent = 'Adopt a pet';
        }
    }
}

function getPlantState() {
    try {
        const data = localStorage.getItem('plantState');
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function getPetState() {
    try {
        const data = localStorage.getItem('petState');
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function setGreeting() {
    const hour = new Date().getHours();
    const greeting = document.getElementById('greeting');
    if (!greeting) return;

    let text = 'Good evening!';
    if (hour >= 5 && hour < 12) text = 'Good morning!';
    else if (hour >= 12 && hour < 17) text = "How's your day going?";
    else if (hour >= 17 && hour < 21) text = 'Good evening!';
    else text = ' Burning the midnight oil? 🌙';

    greeting.textContent = text;
}

function showToast(message) {
    const container = document.getElementById('toast-container');
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

function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setGreeting();
    checkAchievements();
    updateDashboard();
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateDashboard();
    }
});
