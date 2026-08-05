// Funktion zum Abspielen von Audio-Dateien (z. B. deine ElevenLabs MP3)
function spieleAudio(dateiName) {
  // Stoppt eventuelle Browser-Sprachausgaben
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  // Versucht die MP3-Datei aus dem selben Ordner zu laden
  const audio = new Audio(dateiName);

  audio.play().then(() => {
    console.log("Audio erfolgreich abgespielt:", dateiName);
  }).catch(e => {
    console.log("MP3 konnte nicht geladen werden, nutze Browser-Stimme als Backup:", e);
    // Backup: Falls die MP3-Datei nicht auf GitHub liegt oder falsch heißt
    const speech = new SpeechSynthesisUtterance("Ich bin bereit. Was kann ich für dich tun?");
    speech.lang = "de-DE";
    speech.pitch = 0.6;
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  });
}

// Spracherkennung initialisieren
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "de-DE";
  recognition.continuous = true;
  recognition.interimResults = false;

  let istAktiv = false;

  recognition.onresult = function(event) {
    const text = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
    console.log("JARVIS hört:", text);

    const statusEl = document.querySelector("#status");

    // 1. Aktivierung
    if (text.includes("hey jarvis") || text.includes("jarvis")) {
      istAktiv = true;
      if (statusEl) statusEl.textContent = "JARVIS wurde aktiviert";
      
      // Spielt deine hochgeladene aktiviert.mp3 ab
      spieleAudio("aktiviert.mp3");
      return;
    }

    // 2. Befehle nur ausführen, wenn JARVIS aktiv ist
    if (istAktiv) {
      // Google-Suche
      if (text.includes("suche nach") || text.includes("google nach")) {
        let query = text.replace("suche nach", "").replace("google nach", "").trim();
        if (query) {
          if (statusEl) statusEl.textContent = "Suche nach: " + query;
          window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(query);
        }
      } 
      // YouTube öffnen
      else if (text.includes("öffne youtube") || text.includes("youtube")) {
        if (statusEl) statusEl.textContent = "Öffne YouTube...";
        window.location.href = "https://www.youtube.com";
      }
      // Uhrzeit ansagen
      else if (text.includes("uhrzeit") || text.includes("wie viel uhr")) {
        const jetzt = new Date();
        const zeit = jetzt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
        const speech = new SpeechSynthesisUtterance("Es ist " + zeit + " Uhr.");
        speech.lang = "de-DE";
        speech.pitch = 0.6;
        window.speechSynthesis.speak(speech);
      }
      // Standby / Stopp
      else if (text.includes("stopp") || text.includes("schlafen") || text.includes("beenden")) {
        istAktiv = false;
        if (statusEl) statusEl.textContent = "JARVIS wartet...";
      }
    }
  };

  recognition.onerror = function(e) {
    console.log("Erkennungs-Fehler:", e.error);
  };

  recognition.onend = function() {
    // Startet die Spracherkennung automatisch neu, falls sie stoppt
    recognition.start();
  };

  // Spracherkennung starten
  recognition.start();

} else {
  alert("Dein Browser unterstützt keine Spracherkennung. Bitte nutze Safari auf dem iPad.");
}
spieleAudio("aktiviert.mp3.mp3");

