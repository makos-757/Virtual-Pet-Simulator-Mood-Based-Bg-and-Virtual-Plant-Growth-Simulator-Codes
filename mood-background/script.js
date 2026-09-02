const MOODS_KEY = 'moodData';

const moodConfig = {
    happy: {
        emoji: '😊',
        title: "You're Feeling Happy!",
        message: 'Keep smiling and enjoy your day!',
        bg: '#FFF8E1',
        suggestion: 'Try spreading your joy - share a compliment with someone today!'
    },
    sad: {
        emoji: '😢',
        title: "You're Feeling Sad",
        message: "It's okay. Better days are coming!",
        bg: '#E3F2FD',
        suggestion: 'Consider talking to a friend or doing something that usually makes you smile.'
    },
    tired: {
        emoji: '😴',
        title: "You're Feeling Tired",
        message: 'Take some rest. You deserve it!',
        bg: '#F3E5F5',
        suggestion: 'Try a short walk or some gentle stretching to boost your energy.'
    },
    angry: {
        emoji: '😡',
        title: "You're Feeling Angry",
        message: 'Take a deep breath and stay calm.',
        bg: '#FFEBEE',
        suggestion: 'Practice deep breathing: inhale 4s, hold 4s, exhale 4s. It really helps!'
    },
    calm: {
        emoji: '😌',
        title: "You're Feeling Calm",
        message: 'Enjoy this peaceful moment.',
        bg: '#E8F5E9',
        suggestion: 'Perfect time for meditation or a quiet activity you enjoy.'
    },
    anxious: {
        emoji: '😰',
        title: "You're Feeling Anxious",
        message: "It's okay to feel this way. You're not alone.",
        bg: '#FCE4EC',
        suggestion: 'Try the 5-4-3-2-1 grounding technique. Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.'
    },
    excited: {
        emoji: '🤩',
        title: "You're Feeling Excited!",
        message: 'Channel that energy into something creative!',
        bg: '#FFF3E0',
        suggestion: 'Great energy! Use it to start a new project or learn something new.'
    },
    grateful: {
        emoji: '🙏',
        title: "You're Feeling Grateful",
        message: 'What a wonderful way to feel!',
        bg: '#E0F7FA',
        suggestion: 'Write down 3 things you are grateful for. It amplifies the feeling!'
    }
};

function getTodayKey() {
    return new Date().toISOString().split('T')[0];
}

function loadMoodData() {
    try {
        const data = localStorage.getItem(MOODS_KEY);
        return data ? JSON.parse(data) : { history: [], streak: 0, longestStreak: 0 };
    } catch {
        return { history: [], streak: 0, longestStreak: 0 };
    }
}

function saveMoodData(data) {
    localStorage.setItem(MOODS_KEY, JSON.stringify(data));
}

function getTimeSuggestion() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning! Start your day with positivity 😊';
    if (hour >= 12 && hour < 17) return "Afternoon slump? Maybe you need a break 😴";
    if (hour >= 17 && hour < 21) return 'Evening reflections? It\'s okay to feel this way 😢';
    return 'Late night? Consider getting some rest 😴';
}

function updateStreak(data) {
    const today = getTodayKey();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (data.history.length === 0) {
        data.streak = 1;
    } else {
        const lastEntry = data.history[0];
        if (lastEntry.date === today) {
            // Already logged today
        } else if (lastEntry.date === yesterday) {
            data.streak += 1;
        } else {
            data.streak = 1;
        }
    }

    if (data.streak > data.longestStreak) {
        data.longestStreak = data.streak;
    }
}

function logMood(mood) {
    const data = loadMoodData();
    const today = getTodayKey();

    const existingToday = data.history.find(entry => entry.date === today);
    if (existingToday) {
        showToast('You already logged your mood today!');
        return;
    }

    data.history.unshift({
        mood,
        date: today,
        timestamp: Date.now()
    });

    updateStreak(data);
    saveMoodData(data);

    updateUI();
    renderHistory();
    renderCalendar();

    const config = moodConfig[mood];
    document.getElementById('emoji').textContent = config.emoji;
    document.getElementById('title').textContent = config.title;
    document.getElementById('message').textContent = config.message;
    document.getElementById('suggestion-card').innerHTML = `<p>${config.suggestion}</p>`;

    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mood === mood);
    });

    showToast(`Mood logged: ${mood}! ${config.emoji}`);
}

function updateUI() {
    const data = loadMoodData();
    document.getElementById('streak').textContent = data.streak;
}

function renderHistory() {
    const data = loadMoodData();
    const list = document.getElementById('history-list');

    if (data.history.length === 0) {
        list.innerHTML = '<p class="empty-state">No moods logged yet. Start tracking!</p>';
        return;
    }

    list.innerHTML = data.history.slice(0, 10).map(entry => {
        const config = moodConfig[entry.mood];
        const date = new Date(entry.timestamp);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString();

        return `
            <div class="history-item">
                <span class="history-emoji">${config.emoji}</span>
                <div class="history-info">
                    <strong>${config.title}</strong>
                    <span>${dateStr}</span>
                </div>
                <span class="history-time">${timeStr}</span>
            </div>
        `;
    }).join('');
}

function renderCalendar() {
    const data = loadMoodData();
    const calendar = document.getElementById('calendar');
    const today = new Date();

    let html = '';
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        const entry = data.history.find(e => e.date === dateKey);

        const isToday = i === 0;
        const emoji = entry ? moodConfig[entry.mood].emoji : '';

        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                ${emoji || (isToday ? '📍' : '')}
            </div>
        `;
    }

    calendar.innerHTML = html;
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

document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => logMood(btn.dataset.mood));
});

document.getElementById('reset-streak').addEventListener('click', () => {
    const data = loadMoodData();
    data.streak = 0;
    saveMoodData(data);
    updateUI();
    showToast('Streak reset!');
});

window.addEventListener('DOMContentLoaded', () => {
    const data = loadMoodData();
    if (data.history.length > 0) {
        const lastMood = data.history[0].mood;
        const config = moodConfig[lastMood];
        document.getElementById('emoji').textContent = config.emoji;
        document.getElementById('title').textContent = config.title;
        document.getElementById('message').textContent = config.message;
        document.getElementById('suggestion-card').innerHTML = `<p>${config.suggestion}</p>`;
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mood === lastMood);
        });
    }

    updateUI();
    renderHistory();
    renderCalendar();
});
