let growth = 0;
let health = 100;
let moisture = 50;
let sunlight = 50;
let lastGrowth = -1;

const stageConfig = {
    seedling: { minMoisture: 40, maxMoisture: 70, minSun: 30, maxSun: 60 },
    growing: { minMoisture: 50, maxMoisture: 75, minSun: 40, maxSun: 70 },
    healthy: { minMoisture: 55, maxMoisture: 80, minSun: 50, maxSun: 80 },
    mature: { minMoisture: 60, maxMoisture: 85, minSun: 60, maxSun: 90 }
};

function getStage() {
    if (growth >= 100) return 'mature';
    if (growth >= 75) return 'mature';
    if (growth >= 50) return 'healthy';
    if (growth >= 25) return 'growing';
    return 'seedling';
}

function getStageEmoji(stage) {
    const emojis = {
        seedling: '🌱',
        growing: '🌿',
        healthy: '🪴',
        mature: '🌳'
    };
    return emojis[stage] || '🌱';
}

function getStageName(stage) {
    const names = {
        seedling: 'Seedling',
        growing: 'Growing Plant',
        healthy: 'Healthy Plant',
        mature: growth >= 100 ? 'Fully Grown!' : 'Almost Mature!'
    };
    return names[stage] || 'Seedling';
}

function updatePlant() {
    const plant = document.getElementById('plant');
    const stage = document.getElementById('stage');
    const progressBar = document.getElementById('progress-bar');
    const percentage = document.getElementById('percentage');
    const healthText = document.getElementById('health');
    const moistureText = document.getElementById('moisture');
    const sunlightText = document.getElementById('sunlight');
    const healthBar = document.getElementById('health-bar');
    const moistureBar = document.getElementById('moisture-bar');
    const sunlightBar = document.getElementById('sunlight-bar');
    const waterBtn = document.getElementById('water-btn');
    const sunBtn = document.getElementById('sun-btn');
    const message = document.getElementById('message');

    const currentStage = getStage();
    plant.textContent = getStageEmoji(currentStage);
    stage.textContent = getStageName(currentStage);

    progressBar.style.width = growth + '%';
    percentage.textContent = growth + '% Growth';

    healthText.textContent = health + '%';
    moistureText.textContent = Math.round(moisture) + '%';
    sunlightText.textContent = Math.round(sunlight) + '%';

    healthBar.style.width = health + '%';
    moistureBar.style.width = moisture + '%';
    sunlightBar.style.width = sunlight + '%';

    healthBar.classList.toggle('low', health < 30);
    moistureBar.classList.toggle('low', moisture < 20);
    moistureBar.classList.toggle('high', moisture > 80);
    sunlightBar.classList.toggle('high', sunlight > 80);

    if (health <= 0) {
        plant.textContent = '🥀';
        stage.textContent = 'Dead';
        progressBar.classList.add('dead');
        waterBtn.disabled = true;
        sunBtn.disabled = true;
        message.textContent = 'Your plant has died. Reset to try again.';
        return;
    }

    progressBar.classList.remove('dead');
    waterBtn.disabled = false;
    sunBtn.disabled = false;

    if (growth >= 100) {
        progressBar.classList.add('mature');
        waterBtn.disabled = true;
        sunBtn.disabled = true;
        message.textContent = '🎉 Your plant is fully grown!';
    } else {
        progressBar.classList.remove('mature');
    }

    if (growth !== lastGrowth && growth < 100 && health > 0) {
        plant.classList.remove('grow');
        void plant.offsetWidth;
        plant.classList.add('grow');
    }
    lastGrowth = growth;
}

function getGrowthBonus() {
    const stage = getStage();
    const config = stageConfig[stage];
    let bonus = 0;

    if (moisture < config.minMoisture || moisture > config.maxMoisture) {
        bonus -= 5;
    }
    if (sunlight < config.minSun || sunlight > config.maxSun) {
        bonus -= 5;
    }

    return bonus;
}

function waterPlant() {
    if (growth >= 100 || health <= 0) return;

    moisture += 15;
    if (moisture > 100) {
        moisture = 100;
        health -= 15;
        document.getElementById('message').textContent = '⚠️ Overwatered! Roots are rotting!';
    } else {
        const bonus = getGrowthBonus();
        growth = Math.min(100, growth + Math.max(0, 10 + bonus));
        if (bonus < 0) {
            document.getElementById('message').textContent = '⚠️ Plant struggling with current conditions...';
        } else {
            document.getElementById('message').textContent = 'Your plant enjoyed the water! 💧';
        }
    }

    updatePlant();
}

function giveSunlight() {
    if (growth >= 100 || health <= 0) return;

    sunlight += 15;
    if (sunlight > 100) {
        sunlight = 100;
        health -= 20;
        document.getElementById('message').textContent = '⚠️ Too much sun! Plant is wilting!';
    } else {
        const bonus = getGrowthBonus();
        growth = Math.min(100, growth + Math.max(0, 15 + bonus));
        if (bonus < 0) {
            document.getElementById('message').textContent = '⚠️ Plant struggling with current conditions...';
        } else {
            document.getElementById('message').textContent = 'Your plant is enjoying the sunlight! ☀️';
        }
    }

    updatePlant();
}

function resetPlant() {
    growth = 0;
    health = 100;
    moisture = 50;
    sunlight = 50;
    lastGrowth = -1;
    document.getElementById('message').textContent = 'Plant reset! Start fresh! 🌱';
    updatePlant();
}

setInterval(() => {
    if (growth >= 100 || health <= 0) return;

    moisture = Math.max(0, moisture - 2);
    sunlight = Math.max(0, sunlight - 3);

    if (moisture < 20 || sunlight < 20) {
        health -= 5;
    }

    const stage = getStage();
    const config = stageConfig[stage];
    if (moisture < config.minMoisture || moisture > config.maxMoisture ||
        sunlight < config.minSun || sunlight > config.maxSun) {
        health -= 3;
    }

    health = Math.max(0, Math.min(100, health));
    updatePlant();
}, 3000);

updatePlant();
