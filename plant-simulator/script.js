let growth = 0;

function updatePlant() {
    const plant = document.getElementById("plant");
    const stage = document.getElementById("stage");
    const progressBar = document.getElementById("progress-bar");
    const percentage = document.getElementById("percentage");

    progressBar.style.width = growth + "%";
    percentage.textContent = growth + "% Growth";

    if (growth < 25) {
        plant.textContent = "🌱";
        stage.textContent = "Seedling";
    } else if (growth < 50) {
        plant.textContent = "🌿";
        stage.textContent = "Growing Plant";
    } else if (growth < 75) {
        plant.textContent = "🪴";
        stage.textContent = "Healthy Plant";
    } else if (growth < 100) {
        plant.textContent = "🌳";
        stage.textContent = "Almost Mature!";
    } else {
        plant.textContent = "🌳";
        stage.textContent = "Fully Grown!";
    }
}

function waterPlant() {
    if (growth < 100) {
        growth += 10;
        if (growth > 100) {
            growth = 100;
        }
        document.getElementById("message").textContent =
            "Your plant enjoyed the water! 💧";
        updatePlant();
    }
}

function giveSunlight() {
    if (growth < 100) {
        growth += 15;
        if (growth > 100) {
            growth = 100;
        }
        document.getElementById("message").textContent =
            "Your plant is enjoying the sunlight! ☀️";
        updatePlant();
    }
}
