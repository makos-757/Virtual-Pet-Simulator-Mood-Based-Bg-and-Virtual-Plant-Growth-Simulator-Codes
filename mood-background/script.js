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

function changeMood(mood) {
    const data = moods[mood];
    if (!data) return;

    document.body.style.backgroundColor = data.bg;
    document.getElementById('emoji').textContent = data.emoji;
    document.getElementById('title').textContent = data.title;
    document.getElementById('message').textContent = data.message;

    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mood === mood);
    });
}

document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => changeMood(btn.dataset.mood));
});
