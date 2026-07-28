const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "de-DE";
recognition.continuous = true;
recognition.interimResults = false;

recognition.onresult = function(event) {
    const text =
        event.results[event.results.length - 1][0].transcript
        .toLowerCase();

    console.log("JARVIS hört:", text);

    if (text.includes("hey jarvis")) {
        document.querySelector("#status").textContent =
            "JARVIS wurde aktiviert.";
    }
};

recognition.onerror = function(event) {
    console.log("Spracherkennung:", event.error);
};

recognition.onend = function() {
    recognition.start();
};