let happiness = 50;
let energy = 50;

function updatePet() {
    document.getElementById("happiness").textContent = happiness + "%";
    document.getElementById("energy").textContent = energy + "%";
    document.getElementById("happiness-bar").style.width = happiness + "%";
    document.getElementById("energy-bar").style.width = energy + "%";
}

function feedPet() {
    happiness += 10;
    energy += 5;
    if (happiness > 100) {
        happiness = 100;
    }
    if (energy > 100) {
        energy = 100;
    }
    document.getElementById("message").textContent =
        "Yummy! Buddy loved the food! 🍔";
    updatePet();
}

function playWithPet() {
    happiness += 15;
    energy -= 10;
    if (happiness > 100) {
        happiness = 100;
    }
    if (energy < 0) {
        energy = 0;
    }
    document.getElementById("message").textContent =
        "Buddy had lots of fun playing! 🎮";
    updatePet();
}

function sleepPet() {
    energy += 25;
    if (energy > 100) {
        energy = 100;
    }
    document.getElementById("message").textContent =
        "Buddy is feeling refreshed! 😴";
    updatePet();
}
