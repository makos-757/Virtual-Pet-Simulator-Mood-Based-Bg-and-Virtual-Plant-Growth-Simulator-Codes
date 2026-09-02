let happiness = 50;
let energy = 50;

function updatePet() {
    const happinessText = document.getElementById('happiness');
    const energyText = document.getElementById('energy');
    const happinessBar = document.getElementById('happiness-bar');
    const energyBar = document.getElementById('energy-bar');
    const pet = document.getElementById('pet');
    const feedBtn = document.getElementById('feed-btn');
    const playBtn = document.getElementById('play-btn');
    const sleepBtn = document.getElementById('sleep-btn');

    happinessText.textContent = happiness + '%';
    energyText.textContent = energy + '%';
    happinessBar.style.width = happiness + '%';
    energyBar.style.width = energy + '%';

    happinessBar.classList.toggle('low', happiness < 25);
    energyBar.classList.toggle('low', energy < 25);

    if (happiness < 25 || energy < 25) {
        pet.textContent = '😿';
    } else if (happiness < 50 || energy < 50) {
        pet.textContent = '🐶';
    } else if (happiness >= 80 && energy >= 80) {
        pet.textContent = '🥰';
    } else {
        pet.textContent = '🐶';
    }

    feedBtn.disabled = happiness >= 100 && energy >= 100;
    playBtn.disabled = energy <= 0;
    sleepBtn.disabled = energy >= 100;
}

function feedPet() {
    if (happiness >= 100 && energy >= 100) return;

    happiness = Math.min(100, happiness + 10);
    energy = Math.min(100, energy + 5);

    const pet = document.getElementById('pet');
    pet.classList.remove('animate');
    void pet.offsetWidth;
    pet.classList.add('animate');

    document.getElementById('message').textContent = 'Yummy! Buddy loved the food! 🍔';
    updatePet();
}

function playWithPet() {
    if (energy <= 0) return;

    happiness = Math.min(100, happiness + 15);
    energy = Math.max(0, energy - 10);

    const pet = document.getElementById('pet');
    pet.classList.remove('animate');
    void pet.offsetWidth;
    pet.classList.add('animate');

    document.getElementById('message').textContent = 'Buddy had lots of fun playing! 🎮';
    updatePet();
}

function sleepPet() {
    if (energy >= 100) return;

    energy = Math.min(100, energy + 25);
    happiness = Math.max(0, happiness - 5);

    document.getElementById('message').textContent = 'Buddy is feeling refreshed! 😴';
    updatePet();
}

function resetPet() {
    happiness = 50;
    energy = 50;
    document.getElementById('message').textContent = 'Buddy is waiting for you!';
    updatePet();
}

setInterval(() => {
    if (happiness > 0) happiness = Math.max(0, happiness - 2);
    if (energy > 0) energy = Math.max(0, energy - 3);
    updatePet();
}, 5000);

updatePet();
