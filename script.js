// HTML-Button erstellen, um Audio/Mikrofon auf iPads/iPhones freizuschalten
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.createElement("button");
  btn.innerText = "JARVIS System Starten";
  btn.style.cssText = "position:fixed; top:20px; left:50%; transform:translateX(-50%); z-index:9999; padding:12px 24px; background:#00d2ff; color:#000; border:none; border-radius:8px; font-weight:bold; font-size:16px;";
  document.body.appendChild(btn);

  btn.addEventListener("click", () => {
    jarvisSpeak("Systeme online.");
    initJarvis();
    btn.remove();
  });
});

function initJarvis() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Spracherkennung wird von diesem Browser nicht unterstützt. Bitte nutze Safari.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "de-DE";
  recognition.continuous = true;
  recognition.interimResults = false;

  let istAktiv = false;

  recognition.onresult = function(event) {
    const text = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
    console.log("JARVIS hört:", text);

    // 1. Aktivierung
    if (text.includes("hey jarvis") || text.includes("jarvis")) {
      istAktiv = true;
      const statusEl = document.querySelector("#status");
      if (statusEl) statusEl.textContent = "JARVIS wurde aktiviert";
      jarvisSpeak("Ich bin bereit.");
      return;
    }

    // 2. Befehle ausführen
    if (istAktiv) {
      if (text.includes("suche nach") || text.includes("google nach")) {
        let query = text.replace("suche nach", "").replace("google nach", "").trim();
        if (query) {
          jarvisSpeak("Suche nach " + query);
          window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(query);
        }
      } 
      else if (text.includes("uhrzeit") || text.includes("wie viel uhr")) {
        const zeit = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
        jarvisSpeak("Es ist " + zeit + " Uhr.");
      }
      else if (text.includes("öffne youtube")) {
        jarvisSpeak("Öffne YouTube.");
        window.location.href = "https://www.youtube.com";
      }
      else if (text.includes("stopp") || text.includes("schlafen")) {
        istAktiv = false;
        const statusEl = document.querySelector("#status");
        if (statusEl) statusEl.textContent = "JARVIS wartet...";
        jarvisSpeak("Standby Modus.");
      }
    }
  };

  recognition.onerror = function(e) {
    console.log("Fehler:", e.error);
  };

  recognition.onend = function() {
    recognition.start();
  };

  recognition.start();
}

function jarvisSpeak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "de-DE";
    speech.rate = 1.0;
    speech.pitch = 0.9;
    window.speechSynthesis.speak(speech);
  }
}
