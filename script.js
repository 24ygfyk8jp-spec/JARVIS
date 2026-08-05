// Hilfsfunktion zum Abspielen deiner ElevenLabs-MP3s
function spieleAudio(dateiName) {
  // Stoppt eventuelle Sprachausgaben
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const audio = new Audio(dateiName);

  audio.play().then(() => {
    console.log("ElevenLabs Audio abgespielt:", dateiName);
  }).catch(e => {
    console.log("Audio-Fehler:", e);
    const statusEl = document.querySelector("#status");
    if (statusEl) statusEl.textContent = "FEHLER: 'aktiviert.mp3' NICHT GEFUNDEN";
  });
}

// Spracherkennung für Browser (Safari/Chrome)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Spracherkennung wird von diesem Browser nicht unterstützt. Bitte Safari nutzen!");
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = "de-DE";
  recognition.continuous = true;
  recognition.interimResults = false;

  let istAktiv = false;

  // Zeigt an, dass das System bereit ist
  recognition.onstart = function() {
    const statusEl = document.querySelector("#status");
    if (statusEl) statusEl.textContent = "SYSTEM ONLINE. WARTEN AUF BEFEHL...";
  };

  // Verarbeitet die gesprochenen Worte
  recognition.onresult = function(event) {
    const text = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
    console.log("Erkannt:", text);

    const statusEl = document.querySelector("#status");

    // 1. Aktivierung durch "Hey Jarvis"
    if (text.includes("hey jarvis") || text.includes("jarvis")) {
      istAktiv = true;
      if (statusEl) statusEl.textContent = "JARVIS AKTIV";
      
      // Spielt DEINE hochgeladene ElevenLabs-Datei ab!
      spieleAudio("aktiviert.mp3");
      return;
    }

    // 2. Befehle nur verarbeiten, wenn JARVIS vorher aktiviert wurde
    if (istAktiv) {
      
      // Google-Suche
      if (text.includes("suche nach") || text.includes("google nach")) {
        let query = text.replace("suche nach", "").replace("google nach", "").trim();
        if (query) {
          if (statusEl) statusEl.textContent = "SUCHE: " + query.toUpperCase();
          setTimeout(() => {
            window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(query);
          }, 1000);
        }
      } 
      // YouTube öffnen
      else if (text.includes("öffne youtube") || text.includes("youtube")) {
        if (statusEl) statusEl.textContent = "ÖFFNE YOUTUBE...";
        setTimeout(() => {
          window.location.href = "https://www.youtube.com";
        }, 1000);
      }
      // Standby
      else if (text.includes("stopp") || text.includes("schlafen") || text.includes("beenden")) {
        istAktiv = false;
        if (statusEl) statusEl.textContent = "STANDBY-MODUS";
      }
    }
  };

  // Startet das Mikrofon automatisch neu, wenn Safari es stoppt
  recognition.onend = function() {
    try {
      recognition.start();
    } catch (e) {
      console.log("Neustart-Fehler:", e);
    }
  };

  recognition.onerror = function(e) {
    console.log("Erkennungs-Fehler:", e.error);
  };

  // Spracherkennung aktivieren
  recognition.start();
}
