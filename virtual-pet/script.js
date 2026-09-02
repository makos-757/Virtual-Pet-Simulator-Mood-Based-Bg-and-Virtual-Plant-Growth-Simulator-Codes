let happiness = 50;
let energy = 50;
let hunger = 50;
let thirst = 50;
let health = 100;
let isSleeping = false;
let sleepTimer = null;

function updatePet() {
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
    const pet = document.getElementById('pet');
    const feedBtn = document.getElementById('feed-btn');
    const playBtn = document.getElementById('play-btn');
    const sleepBtn = document.getElementById('sleep-btn');
    const waterBtn = document.getElementById('water-btn');

    happinessText.textContent = happiness + '%';
    energyText.textContent = energy + '%';
    hungerText.textContent = hunger + '%';
    thirstText.textContent = thirst + '%';
    healthText.textContent = health + '%';

    happinessBar.style.width = happiness + '%';
    energyBar.style.width = energy + '%';
    hungerBar.style.width = hunger + '%';
    thirstBar.style.width = thirst + '%';
    healthBar.style.width = health + '%';

    happinessBar.classList.toggle('low', happiness < 25);
    energyBar.classList.toggle('low', energy < 25);
    hungerBar.classList.toggle('high', hunger > 80);
    thirstBar.classList.toggle('high', thirst > 80);
    healthBar.classList.toggle('low', health < 30);

    if (health <= 0) {
        pet.textContent = '💀';
        document.getElementById('pet-name').textContent = 'Buddy (Deceased)';
        feedBtn.disabled = true;
        playBtn.disabled = true;
        sleepBtn.disabled = true;
        waterBtn.disabled = true;
        document.getElementById('message').textContent = 'Buddy has passed away. Reset to try again.';
        return;
    }

    if (happiness > 80 && energy > 80 && hunger < 30 && thirst < 30) {
        pet.textContent = '🥰';
    } else if (happiness < 25 || energy < 25 || hunger > 80 || thirst > 80) {
        pet.textContent = '😿';
    } else if (isSleeping) {
        pet.textContent = '😴';
    } else {
        pet.textContent = '🐶';
    }

    feedBtn.disabled = isSleeping || hunger >= 100;
    playBtn.disabled = isSleeping || energy <= 10;
    sleepBtn.disabled = isSleeping || energy >= 100;
    waterBtn.disabled = isSleeping || thirst >= 100;
}

function feedPet() {
    if (isSleeping || hunger >= 100 || health <= 0) return;

    hunger += 25;
    if (hunger > 100) {
        hunger = 100;
        health -= 20;
        document.getElementById('message').textContent = '⚠️ Overfed! Buddy is sick!';
    } else {
        happiness = Math.min(100, happiness + 10);
        document.getElementById('message').textContent = 'Yummy! Buddy loved the food! 🍔';
    }

    const pet = document.getElementById('pet');
    pet.classList.remove('animate');
    void pet.offsetWidth;
    pet.classList.add('animate');

    updatePet();
}

function playWithPet() {
    if (isSleeping || energy <= 10 || health <= 0) return;

    if (energy <= 20) {
        health -= 10;
        document.getElementById('message').textContent = '⚠️ Buddy is too tired to play!';
    } else {
        happiness = Math.min(100, happiness + 15);
        energy = Math.max(0, energy - 15);
        hunger = Math.min(100, hunger + 10);
        thirst = Math.min(100, thirst + 10);
        document.getElementById('message').textContent = 'Buddy had lots of fun playing! 🎮';
    }

    const pet = document.getElementById('pet');
    pet.classList.remove('animate');
    void pet.offsetWidth;
    pet.classList.add('animate');

    updatePet();
}

function sleepPet() {
    if (isSleeping || energy >= 100 || health <= 0) return;

    isSleeping = true;
    document.getElementById('message').textContent = 'Buddy is sleeping... 😴';
    updatePet();

    sleepTimer = setInterval(() => {
        energy = Math.min(100, energy + 10);
        happiness = Math.max(0, happiness - 2);

        if (energy >= 100) {
            clearInterval(sleepTimer);
            sleepTimer = null;
            isSleeping = false;
            document.getElementById('message').textContent = 'Buddy woke up refreshed! ☀️';
        }

        updatePet();
    }, 1000);
}

function giveWater() {
    if (isSleeping || thirst >= 100 || health <= 0) return;

    thirst = Math.min(100, thirst + 20);
    document.getElementById('message').textContent = 'Buddy drank water! 💧';

    const pet = document.getElementById('pet');
    pet.classList.remove('animate');
    void pet.offsetWidth;
    pet.classList.add('animate');

    updatePet();
}

function resetPet() {
    if (sleepTimer) {
        clearInterval(sleepTimer);
        sleepTimer = null;
    }
    happiness = 50;
    energy = 50;
    hunger = 50;
    thirst = 50;
    health = 100;
    isSleeping = false;
    document.getElementById('pet-name').textContent = 'Buddy';
    document.getElementById('message').textContent = 'Buddy is waiting for you!';
    updatePet();
}

setInterval(() => {
    if (health <= 0) return;

    if (!isSleeping) {
        hunger = Math.min(100, hunger + 3);
        thirst = Math.min(100, thirst + 4);
        energy = Math.max(0, energy - 2);
        happiness = Math.max(0, happiness - 2);
    }

    if (hunger > 90 || thirst > 90) {
        health -= 5;
    }

    if (hunger > 100) hunger = 100;
    if (thirst > 100) thirst = 100;

    updatePet();
}, 4000);

updatePet();
