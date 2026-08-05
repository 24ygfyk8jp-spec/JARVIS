// Funktion, um deine heruntergeladene MP3-Datei abzuspielen
function spieleAudio(dateiName) {
  const audio = new Audio(dateiName);
  audio.play().catch(e => console.log("Audio konnte nicht abgespielt werden:", e));
}

// Spracherkennung starten
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

    // 1. Aktivierung: Spielt deine 'aktiviert.mp3' ab!
    if (text.includes("hey jarvis") || text.includes("jarvis")) {
      istAktiv = true;
      const statusEl = document.querySelector("#status");
      if (statusEl) statusEl.textContent = "JARVIS wurde aktiviert";
      
      // Hier spielt er deine echte ElevenLabs-Stimme ab:
      spieleAudio("aktiviert.mp3");
      return;
    }

    // 2. Befehle ausführen
    if (istAktiv) {
      if (text.includes("suche nach") || text.includes("google nach")) {
        let query = text.replace("suche nach", "").replace("google nach", "").trim();
        if (query) {
          window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(query);
        }
      } 
      else if (text.includes("uhrzeit") || text.includes("wie viel uhr")) {
        const jetzt = new Date();
        const zeit = jetzt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
        const speech = new SpeechSynthesisUtterance("Es ist " + zeit + " Uhr.");
        speech.lang = "de-DE";
        window.speechSynthesis.speak(speech);
      }
      else if (text.includes("öffne youtube")) {
        window.location.href = "https://www.youtube.com";
      }
      else if (text.includes("stopp") || text.includes("schlafen")) {
        istAktiv = false;
        const statusEl = document.querySelector("#status");
        if (statusEl) statusEl.textContent = "JARVIS wartet...";
      }
    }
  };

  recognition.onerror = function(e) { console.log("Fehler:", e.error); };
  recognition.onend = function() { recognition.start(); };
  recognition.start();
}
// Funktion zum Abspielen der ElevenLabs-Datei
function spieleAudio(dateiName) {
  // Verhindert doppeltes Abspielen
  window.speechSynthesis.cancel(); 

  const audio = new Audio(dateiName);
  audio.play().then(() => {
    console.log("MP3 erfolgreich abgespielt!");
  }).catch(e => {
    console.log("Fehler beim Abspielen der MP3:", e);
    alert("Audio konnte nicht geladen werden. Prüfe, ob " + dateiName + " auf GitHub liegt!");
  });
}

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

    // Aktivierung
    if (text.includes("hey jarvis") || text.includes("jarvis")) {
      istAktiv = true;
      const statusEl = document.querySelector("#status");
      if (statusEl) statusEl.textContent = "JARVIS wurde aktiviert";
      
      // Spielt DEINE hochgeladene MP3-Stimme ab
      spieleAudio("aktiviert.mp3");
      return;
    }

    if (istAktiv) {
      if (text.includes("suche nach") || text.includes("google nach")) {
        let query = text.replace("suche nach", "").replace("google nach", "").trim();
        if (query) {
          window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(query);
        }
      } 
      else if (text.includes("öffne youtube")) {
        window.location.href = "https://www.youtube.com";
      }
      else if (text.includes("stopp") || text.includes("schlafen")) {
        istAktiv = false;
        const statusEl = document.querySelector("#status");
        if (statusEl) statusEl.textContent = "JARVIS wartet...";
      }
    }
  };

  recognition.onerror = function(e) { console.log("Fehler:", e.error); };
  recognition.onend = function() { recognition.start(); };
  recognition.start();
}
