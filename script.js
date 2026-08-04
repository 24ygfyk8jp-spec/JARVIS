// Spracherkennung initialisieren
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  
  recognition.lang = "de-DE";
  recognition.continuous = true;
  recognition.interimResults = false;

  let istAktiv = false;

  recognition.onresult = function(event) {
    const text = event.results[event.results.length - 1][0].transcript.toLowerCase();
    console.log("JARVIS hört:", text);

    // 1. Aktivierung
    if (text.includes("hey jarvis") || text.includes("jarvis")) {
      istAktiv = true;
      document.querySelector("#status").textContent = "JARVIS wurde aktiviert";
      jarvisSpeak("Ich bin bereit. Was kann ich für dich tun?");
      return;
    }

    // 2. Befehle nur ausführen, wenn aktiv
    if (istAktiv) {      
      // Befehl: Google Suche
      if (text.includes("suche nach") || text.includes("google nach")) {
        let suchbegriff = "";
        if (text.includes("suche nach")) {
          suchbegriff = text.split("suche nach")[1].trim();
        } else if (text.includes("google nach")) {
          suchbegriff = text.split("google nach")[1].trim();
        }

        if (suchbegriff.length > 0) {
          jarvisSpeak("Ich suche auf Google nach " + suchbegriff);
          window.open("https://www.google.com/search?q=" + encodeURIComponent(suchbegriff), "_blank");
        }
      } 
      
      // Befehl: Uhrzeit
      else if (text.includes("uhrzeit") || text.includes("wie viel uhr")) {
        const zeit = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
        jarvisSpeak("Es ist " + zeit + " Uhr.");
      }

      // Befehl: YouTube öffnen
      else if (text.includes("öffne youtube")) {
        jarvisSpeak("Öffne YouTube.");
        window.open("https://www.youtube.com", "_blank");
      }

      // Befehl: Deaktivieren
      else if (text.includes("stopp") || text.includes("schlafen")) {
        istAktiv = false;
        document.querySelector("#status").textContent = "JARVIS wartet...";
        jarvisSpeak("JARVIS geht in den Standby-Modus.");
      }
    }
  };

  recognition.onerror = function(event) {
    console.log("Spracherkennung:", event.error);
  };

  recognition.onend = function() {
    recognition.start();
  };

  recognition.start();
} else {
  console.log("Spracherkennung wird nicht unterstützt.");
}

// Hilfsfunktion für die Sprachausgabe (Text-to-Speech)
function jarvisSpeak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Laufende Sprachausgaben stoppen
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "de-DE";
    speech.rate = 1;
    speech.pitch = 0.9;
    window.speechSynthesis.speak(speech);
  }
}
