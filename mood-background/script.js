const moods = {
    happy: {
        bg: '#FFF8E1',
        emoji: '😊',
        title: "You're Feeling Happy!",
        message: 'Keep smiling and enjoy your day!'
    },
    sad: {
        bg: '#E3F2FD',
        emoji: '😢',
        title: "You're Feeling Sad",
        message: "It's okay. Better days are coming!"
    },
    tired: {
        bg: '#F3E5F5',
        emoji: '😴',
        title: "You're Feeling Tired",
        message: 'Take some rest. You deserve it!'
    },
    angry: {
        bg: '#FFEBEE',
        emoji: '😡',
        title: "You're Feeling Angry",
        message: 'Take a deep breath and stay calm.'
    }
};

const timeSuggestions = {
    morning: { mood: 'happy', text: 'Good morning! Start your day with positivity 😊' },
    afternoon: { mood: 'tired', text: 'Afternoon slump? Maybe you need a break 😴' },
    evening: { mood: 'sad', text: 'Evening reflections? It\'s okay to feel this way 😢' },
    night: { mood: 'tired', text: 'Late night? Consider getting some rest 😴' }
};

function getTimeSuggestion() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return timeSuggestions.morning;
    if (hour >= 12 && hour < 17) return timeSuggestions.afternoon;
    if (hour >= 17 && hour < 21) return timeSuggestions.evening;
    return timeSuggestions.night;
}

function getTodayKey() {
    return new Date().toISOString().split('T')[0];
}

function loadMoodData() {
    const data = localStorage.getItem('moodData');
    if (data) {
        const parsed = JSON.parse(data);
        if (parsed.date !== getTodayKey()) {
            return { date: getTodayKey(), streak: parsed.streak || 0, lastMood: null };
        }
        return parsed;
    }
    return { date: getTodayKey(), streak: 0, lastMood: null };
}

function saveMoodData(data) {
    localStorage.setItem('moodData', JSON.stringify(data));
}

let moodData = loadMoodData();

function updateUI() {
    document.getElementById('streak').textContent = moodData.streak;
    document.getElementById('last-mood').textContent = moodData.lastMood || 'None';
}

function changeMood(mood) {
    const data = moods[mood];
    if (!data) return;

    if (moodData.lastMood === mood) {
        document.getElementById('message').textContent = "You already selected this mood today!";
        return;
    }

    document.body.style.backgroundColor = data.bg;
    document.getElementById('emoji').textContent = data.emoji;
    document.getElementById('title').textContent = data.title;
    document.getElementById('message').textContent = data.message;

    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mood === mood);
    });

    if (moodData.lastMood && moodData.lastMood !== mood) {
        moodData.streak = 0;
    }

    moodData.lastMood = mood;
    moodData.streak += 1;
    moodData.date = getTodayKey();
    saveMoodData(moodData);
    updateUI();
}

document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => changeMood(btn.dataset.mood));
});

document.getElementById('reset-btn').addEventListener('click', () => {
    moodData = { date: getTodayKey(), streak: 0, lastMood: null };
    saveMoodData(moodData);
    updateUI();
    document.getElementById('message').textContent = "Streak reset! Start fresh!";
});

const suggestion = getTimeSuggestion();
document.getElementById('message').textContent = suggestion.text;

if (moodData.lastMood) {
    document.querySelector(`[data-mood="${moodData.lastMood}"]`)?.classList.add('active');
    document.getElementById('emoji').textContent = moods[moodData.lastMood].emoji;
    document.getElementById('title').textContent = moods[moodData.lastMood].title;
    document.body.style.backgroundColor = moods[moodData.lastMood].bg;
}

updateUI();
