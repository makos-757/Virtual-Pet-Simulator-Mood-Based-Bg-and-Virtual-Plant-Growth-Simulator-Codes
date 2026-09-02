function changeMood(mood) {
    const emoji = document.getElementById("emoji");
    const title = document.getElementById("title");
    const message = document.getElementById("message");

    if (mood === "happy") {
        document.body.style.backgroundColor = "#FFD54F";
        emoji.textContent = "😊";
        title.textContent = "You're Feeling Happy!";
        message.textContent = "Keep smiling and enjoy your day!";
    }

    if (mood === "sad") {
        document.body.style.backgroundColor = "#90CAF9";
        emoji.textContent = "😢";
        title.textContent = "You're Feeling Sad";
        message.textContent = "It's okay. Better days are coming!";
    }

    if (mood === "tired") {
        document.body.style.backgroundColor = "#B39DDB";
        emoji.textContent = "😴";
        title.textContent = "You're Feeling Tired";
        message.textContent = "Take some rest. You deserve it!";
    }

    if (mood === "angry") {
        document.body.style.backgroundColor = "#EF9A9A";
        emoji.textContent = "😡";
        title.textContent = "You're Feeling Angry";
        message.textContent = "Take a deep breath and stay calm.";
    }
}
