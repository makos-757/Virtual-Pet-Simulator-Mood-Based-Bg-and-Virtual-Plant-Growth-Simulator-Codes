const PET_KEY = 'petState';

const petTypes = {
    dog: {
        name: 'Dog',
        emoji: '🐶',
        personalities: ['Playful', 'Friendly', 'Energetic', 'Loyal'],
        baseEnergy: 80,
        baseHappiness: 70,
        description: 'Loyal and energetic companion'
    },
    cat: {
        name: 'Cat',
        emoji: '🐱',
        personalities: ['Independent', 'Curious', 'Calm', 'Affectionate'],
        baseEnergy: 60,
        baseHappiness: 60,
        description: 'Independent and curious'
    },
    rabbit: {
        name: 'Rabbit',
        emoji: '🐰',
        personalities: ['Gentle', 'Timid', 'Curious', 'Social'],
        baseEnergy: 70,
        baseHappiness: 65,
        description: 'Gentle and social'
    },
    bird: {
        name: 'Bird',
        emoji: '🐦',
        personalities: ['Vocal', 'Active', 'Social', 'Playful'],
        baseEnergy: 90,
        baseHappiness: 75,
        description: 'Vocal and active'
    }
};

let pet = null;
let isSleeping = false;
let sleepTimer = null;
let gameActive = false;
let gameStartTime = 0;

function getDefaultPet() {
    return {
        type: null,
        name: '',
        personality: '',
        age: 0,
        happiness: 50,
        energy: 50,
        hunger: 50,
        thirst: 50,
        health: 100,
        interactions: 0,
        createdAt: null
    };
}

function loadPet() {
    try {
        const data = localStorage.getItem(PET_KEY);
        return data ? JSON.parse(data) : getDefaultPet();
    } catch {
        return getDefaultPet();
    }
}

function savePet() {
    localStorage.setItem(PET_KEY, JSON.stringify(pet));
}

function selectPet(type) {
    if (!petTypes[type]) return;

    const petType = petTypes[type];
    const personality = petType.personalities[Math.floor(Math.random() * petType.personalities.length)];

    pet = {
        ...getDefaultPet(),
        type,
        name: petType.name,
        personality,
        age: 0,
        happiness: petType.baseHappiness,
        energy: petType.baseEnergy,
        createdAt: Date.now()
    };

    savePet();
    updateUI();
    showToast(`Adopted ${petType.name}! ${petType.emoji}`);

    document.querySelectorAll('.pet-option').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.pet === type);
    });

    document.getElementById('pet-select').querySelector('h3').textContent = `Pet: ${petType.name}`;
    updatePet();
}

function getPetEmoji() {
    if (!pet || !pet.type) return '🐶';

    if (pet.health <= 0) return '💀';
    if (isSleeping) return '😴';
    if (pet.happiness > 80 && pet.energy > 80 && pet.hunger < 30 && pet.thirst < 30) return '🥰';
    if (pet.happiness < 25 || pet.energy < 25 || pet.hunger > 80 || pet.thirst > 80) return '😿';
    if (pet.happiness < 50 || pet.energy < 50) return '😐';

    return petTypes[pet.type].emoji;
}

function updatePet() {
    const petEl = document.getElementById('pet');
    const nameEl = document.getElementById('pet-name');
    const personalityEl = document.getElementById('pet-personality');
    const happinessText = document.getElementById('happiness');
    const energyText = document.getElementById('energy');
    const hungerText = document.getElementById('hunger');
    const thirstText = document.getElementById('thirst');
    const healthText = document.getElementById('health');
    const happinessBar = document.getElementById('happiness-bar');
    const energyBar = document.getElementById('energy-bar');
    const hungerBar = document.getElementById('hunger-bar');
    const thirstBar = document.getElementById('thirst-bar');
    const healthBar = document.getElementById('health-bar');
    const feedBtn = document.getElementById('feed-btn');
    const playBtn = document.getElementById('play-btn');
    const sleepBtn = document.getElementById('sleep-btn');
    const waterBtn = document.getElementById('water-btn');
    const messageEl = document.getElementById('message');

    if (!pet || !pet.type) {
        petEl.textContent = '🐶';
        nameEl.textContent = 'Choose a pet to start';
        personalityEl.textContent = '';
        return;
    }

    petEl.textContent = getPetEmoji();
    nameEl.textContent = pet.name;
    personalityEl.textContent = `Personality: ${pet.personality}`;

    happinessText.textContent = Math.round(pet.happiness) + '%';
    energyText.textContent = Math.round(pet.energy) + '%';
    hungerText.textContent = Math.round(pet.hunger) + '%';
    thirstText.textContent = Math.round(pet.thirst) + '%';
    healthText.textContent = Math.round(pet.health) + '%';

    happinessBar.style.width = pet.happiness + '%';
    energyBar.style.width = pet.energy + '%';
    hungerBar.style.width = pet.hunger + '%';
    thirstBar.style.width = pet.thirst + '%';
    healthBar.style.width = pet.health + '%';

    happinessBar.classList.toggle('low', pet.happiness < 25);
    energyBar.classList.toggle('low', pet.energy < 25);
    hungerBar.classList.toggle('high', pet.hunger > 80);
    thirstBar.classList.toggle('high', pet.thirst > 80);
    healthBar.classList.toggle('low', pet.health < 30);

    if (pet.health <= 0) {
        petEl.classList.add('dead');
        feedBtn.disabled = true;
        playBtn.disabled = true;
        sleepBtn.disabled = true;
        waterBtn.disabled = true;
        messageEl.textContent = 'Your pet has passed away. Reset to try again.';
        return;
    }

    petEl.classList.remove('dead');
    feedBtn.disabled = isSleeping || pet.hunger >= 100;
    playBtn.disabled = isSleeping || pet.energy <= 10;
    sleepBtn.disabled = isSleeping || pet.energy >= 100;
    waterBtn.disabled = isSleeping || pet.thirst >= 100;
}

function feedPet() {
    if (!pet || !pet.type || isSleeping || pet.hunger >= 100 || pet.health <= 0) return;

    pet.hunger += 25;
    if (pet.hunger > 100) {
        pet.hunger = 100;
        pet.health -= 20;
        showToast('⚠️ Overfed! Pet is sick!');
        document.getElementById('message').textContent = '⚠️ Overfed! Pet is sick!';
    } else {
        pet.happiness = Math.min(100, pet.happiness + 10);
        showToast('Yummy! Pet loved the food! 🍔');
        document.getElementById('message').textContent = 'Yummy! Pet loved the food! 🍔';
    }

    pet.interactions++;
    animatePet();
    savePet();
    updatePet();
}

function playWithPet() {
    if (!pet || !pet.type || isSleeping || pet.energy <= 10 || pet.health <= 0) return;

    if (pet.energy <= 20) {
        pet.health -= 10;
        showToast('⚠️ Pet is too tired to play!');
        document.getElementById('message').textContent = '⚠️ Pet is too tired to play!';
    } else {
        pet.happiness = Math.min(100, pet.happiness + 15);
        pet.energy = Math.max(0, pet.energy - 15);
        pet.hunger = Math.min(100, pet.hunger + 10);
        pet.thirst = Math.min(100, pet.thirst + 10);
        showToast('Pet had lots of fun playing! 🎮');
        document.getElementById('message').textContent = 'Pet had lots of fun playing! 🎮';
    }

    pet.interactions++;
    animatePet();
    savePet();
    updatePet();
}

function sleepPet() {
    if (!pet || !pet.type || isSleeping || pet.energy >= 100 || pet.health <= 0) return;

    isSleeping = true;
    document.getElementById('message').textContent = 'Pet is sleeping... 😴';
    updatePet();

    sleepTimer = setInterval(() => {
        pet.energy = Math.min(100, pet.energy + 10);
        pet.happiness = Math.max(0, pet.happiness - 2);

        if (pet.energy >= 100) {
            clearInterval(sleepTimer);
            sleepTimer = null;
            isSleeping = false;
            document.getElementById('message').textContent = 'Pet woke up refreshed! ☀️';
        }

        savePet();
        updatePet();
    }, 1000);
}

function giveWater() {
    if (!pet || !pet.type || isSleeping || pet.thirst >= 100 || pet.health <= 0) return;

    pet.thirst = Math.min(100, pet.thirst + 20);
    showToast('Pet drank water! 💧');
    document.getElementById('message').textContent = 'Pet drank water! 💧';

    pet.interactions++;
    animatePet();
    savePet();
    updatePet();
}

function animatePet() {
    const petEl = document.getElementById('pet');
    petEl.classList.remove('animate');
    void petEl.offsetWidth;
    petEl.classList.add('animate');
}

function resetPet() {
    if (sleepTimer) {
        clearInterval(sleepTimer);
        sleepTimer = null;
    }
    isSleeping = false;
    pet = getDefaultPet();
    savePet();
    updateUI();
    showToast('Pet reset! Start fresh!');
    document.getElementById('message').textContent = 'Select a pet to begin!';
    document.getElementById('pet-select').querySelector('h3').textContent = 'Choose Your Pet';
    document.querySelectorAll('.pet-option').forEach(btn => btn.classList.remove('selected'));
    updatePet();
}

function updateUI() {
    if (!pet) return;

    document.querySelectorAll('.pet-option').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.pet === pet.type);
    });

    if (pet.type) {
        document.getElementById('pet-select').querySelector('h3').textContent = `Pet: ${petTypes[pet.type].name}`;
    }
}

function playMiniGame() {
    if (!pet || !pet.type || pet.health <= 0) return;

    const gameSection = document.getElementById('game-section');
    const gameBtn = document.getElementById('game-start-btn');
    const gameStatus = document.getElementById('game-status');

    gameSection.style.display = 'block';
    gameBtn.disabled = false;
    gameBtn.textContent = 'Wait for green...';
    gameStatus.textContent = '';
    gameActive = true;

    const delay = 2000 + Math.random() * 3000;

    setTimeout(() => {
        if (!gameActive) return;
        gameBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        gameBtn.textContent = 'CLICK NOW!';
        gameStartTime = Date.now();
    }, delay);

    gameBtn.onclick = () => {
        if (!gameActive) return;

        const reactionTime = Date.now() - gameStartTime;

        if (gameBtn.textContent === 'CLICK NOW!') {
            const points = Math.max(1, Math.floor(1000 / reactionTime));
            pet.happiness = Math.min(100, pet.happiness + points);
            pet.energy = Math.max(0, pet.energy - 5);
            gameStatus.textContent = `Great! +${points} happiness (${reactionTime}ms)`;
            showToast(`🎯 +${points} happiness!`);
            pet.interactions++;
            savePet();
            updatePet();
        } else if (gameBtn.textContent === 'Wait for green...') {
            gameStatus.textContent = 'Too early! Wait for green.';
            gameBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        }

        gameActive = false;
        gameBtn.disabled = true;
        gameBtn.textContent = 'Play Again';
        gameBtn.style.background = '';
        gameBtn.disabled = false;
    };
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

document.querySelectorAll('.pet-option').forEach(btn => {
    btn.addEventListener('click', () => selectPet(btn.dataset.pet));
});

window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setGreeting();
    pet = loadPet();

    if (pet && pet.type) {
        updateUI();
    }

    updatePet();

    setInterval(() => {
        if (!pet || !pet.type || pet.health <= 0 || isSleeping) return;

        pet.hunger = Math.min(100, pet.hunger + 3);
        pet.thirst = Math.min(100, pet.thirst + 4);
        pet.energy = Math.max(0, pet.energy - 2);
        pet.happiness = Math.max(0, pet.happiness - 2);

        if (pet.hunger > 90 || pet.thirst > 90) {
            pet.health -= 5;
        }

        pet.age += 1 / 60;

        savePet();
        updatePet();
    }, 4000);
});
