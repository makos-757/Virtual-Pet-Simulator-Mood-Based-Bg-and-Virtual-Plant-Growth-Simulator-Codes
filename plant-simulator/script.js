const PLANT_KEY = 'plantState';

const plantSpecies = {
    cactus: {
        name: 'Cactus',
        emoji: '🌵',
        stages: ['🌱', '🌵', '🌵', '🌵', '🌵'],
        minMoisture: 10,
        maxMoisture: 30,
        minSun: 60,
        maxSun: 100,
        growthRate: 0.8,
        description: 'Low water, high sunlight'
    },
    rose: {
        name: 'Rose',
        emoji: '🌹',
        stages: ['🌱', '🌿', '🌹', '🌹', '🌹'],
        minMoisture: 50,
        maxMoisture: 70,
        minSun: 50,
        maxSun: 80,
        growthRate: 1.0,
        description: 'Moderate water and sun'
    },
    fern: {
        name: 'Fern',
        emoji: '🌿',
        stages: ['🌱', '🌿', '🌿', '🌿', '🌿'],
        minMoisture: 70,
        maxMoisture: 90,
        minSun: 20,
        maxSun: 50,
        growthRate: 0.9,
        description: 'High moisture, low sun'
    },
    sunflower: {
        name: 'Sunflower',
        emoji: '🌻',
        stages: ['🌱', '🌿', '🌻', '🌻', '🌻'],
        minMoisture: 40,
        maxMoisture: 60,
        minSun: 70,
        maxSun: 100,
        growthRate: 1.2,
        description: 'High sunlight, moderate water'
    }
};

const weatherTypes = [
    { id: 'sunny', icon: '☀️', text: 'Sunny', moistureChange: -3, sunlightChange: 5 },
    { id: 'cloudy', icon: '☁️', text: 'Cloudy', moistureChange: -1, sunlightChange: -3 },
    { id: 'rain', icon: '🌧️', text: 'Rainy', moistureChange: 10, sunlightChange: -5 },
    { id: 'heatwave', icon: '🔥', text: 'Heatwave', moistureChange: -8, sunlightChange: 10 }
];

const randomEvents = [
    {
        id: 'pests',
        icon: '🐛',
        title: 'Pest Attack!',
        message: 'Aphids are attacking your plant! Health -20',
        effect: () => { plant.health -= 20; }
    },
    {
        id: 'disease',
        icon: '🦠',
        title: 'Disease!',
        message: 'Your plant has a fungal infection. Health -15',
        effect: () => { plant.health -= 15; }
    },
    {
        id: 'rain',
        icon: '🌧️',
        title: 'Unexpected Rain!',
        message: 'Rain boosted your plant\'s moisture!',
        effect: () => { plant.moisture = Math.min(100, plant.moisture + 15); }
    },
    {
        id: 'pollination',
        icon: '🐝',
        title: 'Pollination!',
        message: 'A bee visited your plant. Growth +5!',
        effect: () => { plant.growth = Math.min(100, plant.growth + 5); }
    }
];

let plant = null;
let currentWeather = weatherTypes[0];
let eventTimer = null;

function getDefaultPlant() {
    return {
        species: null,
        growth: 0,
        health: 100,
        moisture: 50,
        sunlight: 50,
        lastWatered: null,
        lastSunlight: null,
        createdAt: null
    };
}

function loadPlant() {
    try {
        const data = localStorage.getItem(PLANT_KEY);
        return data ? JSON.parse(data) : getDefaultPlant();
    } catch {
        return getDefaultPlant();
    }
}

function savePlant() {
    localStorage.setItem(PLANT_KEY, JSON.stringify(plant));
}

function getStageEmoji(species, growth) {
    if (!species || !plantSpecies[species]) return '🌱';
    const stages = plantSpecies[species].stages;
    if (growth >= 100) return stages[stages.length - 1];
    const index = Math.floor((growth / 100) * (stages.length - 1));
    return stages[Math.min(index, stages.length - 1)];
}

function getStageName(growth) {
    if (growth >= 100) return 'Fully Grown!';
    if (growth >= 75) return 'Almost Mature!';
    if (growth >= 50) return 'Healthy Plant';
    if (growth >= 25) return 'Growing Plant';
    return 'Seedling';
}

function updatePlant() {
    const plantEl = document.getElementById('plant');
    const stageEl = document.getElementById('stage');
    const progressBar = document.getElementById('progress-bar');
    const percentageEl = document.getElementById('percentage');
    const healthText = document.getElementById('health');
    const moistureText = document.getElementById('moisture');
    const sunlightText = document.getElementById('sunlight');
    const healthBar = document.getElementById('health-bar');
    const moistureBar = document.getElementById('moisture-bar');
    const sunlightBar = document.getElementById('sunlight-bar');
    const waterBtn = document.getElementById('water-btn');
    const sunBtn = document.getElementById('sun-btn');
    const messageEl = document.getElementById('message');

    if (!plant || !plant.species) {
        plantEl.textContent = '🌱';
        stageEl.textContent = 'Select a plant to start';
        progressBar.style.width = '0%';
        percentageEl.textContent = '0% Growth';
        return;
    }

    const species = plantSpecies[plant.species];
    plantEl.textContent = getStageEmoji(plant.species, plant.growth);
    stageEl.textContent = getStageName(plant.growth);

    progressBar.style.width = plant.growth + '%';
    percentageEl.textContent = Math.round(plant.growth) + '% Growth';

    healthText.textContent = Math.round(plant.health) + '%';
    moistureText.textContent = Math.round(plant.moisture) + '%';
    sunlightText.textContent = Math.round(plant.sunlight) + '%';

    healthBar.style.width = plant.health + '%';
    moistureBar.style.width = plant.moisture + '%';
    sunlightBar.style.width = plant.sunlight + '%';

    healthBar.classList.toggle('low', plant.health < 30);
    moistureBar.classList.toggle('low', plant.moisture < 20);
    moistureBar.classList.toggle('high', plant.moisture > 80);
    sunlightBar.classList.toggle('high', plant.sunlight > 80);

    if (plant.health <= 0) {
        plantEl.textContent = '🥀';
        stageEl.textContent = 'Dead';
        progressBar.classList.add('dead');
        waterBtn.disabled = true;
        sunBtn.disabled = true;
        messageEl.textContent = 'Your plant has died. Reset to try again.';
        return;
    }

    if (plant.growth >= 100) {
        progressBar.classList.add('mature');
        waterBtn.disabled = true;
        sunBtn.disabled = true;
        messageEl.textContent = '🎉 Your plant is fully grown!';
    } else {
        progressBar.classList.remove('mature');
        waterBtn.disabled = false;
        sunBtn.disabled = false;
    }
}

function selectPlant(species) {
    if (!plantSpecies[species]) return;

    plant = {
        ...getDefaultPlant(),
        species,
        createdAt: Date.now()
    };

    savePlant();
    updateUI();
    showToast(`Selected ${plantSpecies[species].name}! ${plantSpecies[species].emoji}`);

    document.querySelectorAll('.plant-option').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.plant === species);
    });

    document.getElementById('plant-select').querySelector('h3').textContent = `Plant: ${plantSpecies[species].name}`;
    updatePlant();
}

function waterPlant() {
    if (!plant || !plant.species || plant.health <= 0 || plant.growth >= 100) return;

    const species = plantSpecies[plant.species];
    plant.moisture += 15;

    if (plant.moisture > 100) {
        plant.moisture = 100;
        plant.health -= 15;
        showToast('⚠️ Overwatered! Roots are rotting!');
        document.getElementById('message').textContent = '⚠️ Overwatered! Roots are rotting!';
    } else {
        const bonus = getGrowthBonus();
        plant.growth = Math.min(100, plant.growth + Math.max(0, 10 * species.growthRate + bonus));
        if (bonus < 0) {
            showToast('⚠️ Plant struggling with current conditions...');
            document.getElementById('message').textContent = '⚠️ Plant struggling with current conditions...';
        } else {
            showToast('Your plant enjoyed the water! 💧');
            document.getElementById('message').textContent = 'Your plant enjoyed the water! 💧';
        }
    }

    plant.lastWatered = Date.now();
    savePlant();
    updatePlant();
}

function giveSunlight() {
    if (!plant || !plant.species || plant.health <= 0 || plant.growth >= 100) return;

    const species = plantSpecies[plant.species];
    plant.sunlight += 15;

    if (plant.sunlight > 100) {
        plant.sunlight = 100;
        plant.health -= 20;
        showToast('⚠️ Too much sun! Plant is wilting!');
        document.getElementById('message').textContent = '⚠️ Too much sun! Plant is wilting!';
    } else {
        const bonus = getGrowthBonus();
        plant.growth = Math.min(100, plant.growth + Math.max(0, 15 * species.growthRate + bonus));
        if (bonus < 0) {
            showToast('⚠️ Plant struggling with current conditions...');
            document.getElementById('message').textContent = '⚠️ Plant struggling with current conditions...';
        } else {
            showToast('Your plant is enjoying the sunlight! ☀️');
            document.getElementById('message').textContent = 'Your plant is enjoying the sunlight! ☀️';
        }
    }

    plant.lastSunlight = Date.now();
    savePlant();
    updatePlant();
}

function getGrowthBonus() {
    if (!plant || !plant.species) return 0;
    const species = plantSpecies[plant.species];
    let bonus = 0;

    if (plant.moisture < species.minMoisture || plant.moisture > species.maxMoisture) {
        bonus -= 5;
    }
    if (plant.sunlight < species.minSun || plant.sunlight > species.maxSun) {
        bonus -= 5;
    }

    return bonus;
}

function resetPlant() {
    plant = getDefaultPlant();
    savePlant();
    updateUI();
    showToast('Plant reset! Start fresh! 🌱');
    document.getElementById('message').textContent = 'Select a plant to begin!';
    document.getElementById('plant-select').querySelector('h3').textContent = 'Choose Your Plant';
    document.querySelectorAll('.plant-option').forEach(btn => btn.classList.remove('selected'));
    updatePlant();
}

function updateWeather() {
    const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    currentWeather = weather;

    document.getElementById('weather-icon').textContent = weather.icon;
    document.getElementById('weather-text').textContent = weather.text;

    if (plant && plant.species && plant.health > 0 && plant.growth < 100) {
        plant.moisture = Math.max(0, Math.min(100, plant.moisture + weather.moistureChange));
        plant.sunlight = Math.max(0, Math.min(100, plant.sunlight + weather.sunlightChange));
        savePlant();
        updatePlant();
    }
}

function triggerRandomEvent() {
    if (!plant || !plant.species || plant.health <= 0 || plant.growth >= 100) return;

    const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    event.effect();

    const eventSection = document.getElementById('events-section');
    const eventCard = document.getElementById('event-card');
    eventCard.innerHTML = `
        <strong>${event.icon} ${event.title}</strong>
        <p>${event.message}</p>
    `;
    eventSection.style.display = 'block';

    savePlant();
    updatePlant();
    showToast(`${event.icon} ${event.title}`);

    setTimeout(() => {
        eventSection.style.display = 'none';
    }, 5000);
}

function updateUI() {
    if (!plant) return;

    document.querySelectorAll('.plant-option').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.plant === plant.species);
    });

    if (plant.species) {
        document.getElementById('plant-select').querySelector('h3').textContent = `Plant: ${plantSpecies[plant.species].name}`;
    }
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

document.querySelectorAll('.plant-option').forEach(btn => {
    btn.addEventListener('click', () => selectPlant(btn.dataset.plant));
});

window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    plant = loadPlant();

    if (plant && plant.species) {
        updateUI();
    }

    updatePlant();
    checkAchievements();

    setInterval(() => {
        if (!plant || !plant.species || plant.health <= 0 || plant.growth >= 100) return;

        plant.moisture = Math.max(0, plant.moisture - 2);
        plant.sunlight = Math.max(0, plant.sunlight - 3);

        if (plant.moisture < 20 || plant.sunlight < 20) {
            plant.health -= 5;
        }

        const species = plantSpecies[plant.species];
        if (plant.moisture < species.minMoisture || plant.moisture > species.maxMoisture ||
            plant.sunlight < species.minSun || plant.sunlight > species.maxSun) {
            plant.health -= 3;
        }

        plant.health = Math.max(0, Math.min(100, plant.health));
        savePlant();
        updatePlant();
    }, 3000);

    setInterval(updateWeather, 30000);

    setInterval(() => {
        if (Math.random() < 0.3) {
            triggerRandomEvent();
        }
    }, 45000);
});
