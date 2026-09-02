let growth = 0;
let lastGrowth = -1;

function updatePlant() {
    const plant = document.getElementById('plant');
    const stage = document.getElementById('stage');
    const progressBar = document.getElementById('progress-bar');
    const percentage = document.getElementById('percentage');
    const waterBtn = document.getElementById('water-btn');
    const sunBtn = document.getElementById('sun-btn');

    progressBar.style.width = growth + '%';
    percentage.textContent = growth + '% Growth';

    if (growth >= 100) {
        plant.textContent = '🌳';
        stage.textContent = 'Fully Grown!';
        progressBar.classList.add('mature');
        waterBtn.disabled = true;
        sunBtn.disabled = true;
    } else if (growth >= 75) {
        plant.textContent = '🌳';
        stage.textContent = 'Almost Mature!';
        progressBar.classList.remove('mature');
        waterBtn.disabled = false;
        sunBtn.disabled = false;
    } else if (growth >= 50) {
        plant.textContent = '🪴';
        stage.textContent = 'Healthy Plant';
        progressBar.classList.remove('mature');
        waterBtn.disabled = false;
        sunBtn.disabled = false;
    } else if (growth >= 25) {
        plant.textContent = '🌿';
        stage.textContent = 'Growing Plant';
        progressBar.classList.remove('mature');
        waterBtn.disabled = false;
        sunBtn.disabled = false;
    } else {
        plant.textContent = '🌱';
        stage.textContent = 'Seedling';
        progressBar.classList.remove('mature');
        waterBtn.disabled = false;
        sunBtn.disabled = false;
    }

    if (growth !== lastGrowth && growth < 100) {
        plant.classList.remove('grow');
        void plant.offsetWidth;
        plant.classList.add('grow');
    }
    lastGrowth = growth;
}

function waterPlant() {
    if (growth >= 100) return;

    growth += 10;
    if (growth > 100) growth = 100;

    if (growth >= 100) {
        document.getElementById('message').textContent = '🎉 Your plant is fully grown!';
    } else {
        document.getElementById('message').textContent = 'Your plant enjoyed the water! 💧';
    }

    updatePlant();
}

function giveSunlight() {
    if (growth >= 100) return;

    growth += 15;
    if (growth > 100) growth = 100;

    if (growth >= 100) {
        document.getElementById('message').textContent = '🎉 Your plant is fully grown!';
    } else {
        document.getElementById('message').textContent = 'Your plant is enjoying the sunlight! ☀️';
    }

    updatePlant();
}

function resetPlant() {
    growth = 0;
    lastGrowth = -1;
    document.getElementById('message').textContent = 'Plant reset! Start fresh! 🌱';
    updatePlant();
}

updatePlant();
