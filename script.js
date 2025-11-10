// afficher la date du jour
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById('date').innerText = today.toLocaleDateString('fr-FR', options);

// afficher méditation différente chaque jour
fetch('meditations.json')
    .then(response => response.json())
    .then(meditations => {
        const day = new Date();
        const daySeed = day.getFullYear() * 1000 + day.getMonth() * 31 + day.getDate();
        const index = daySeed % meditations.length;
        
        document.getElementById('meditation').innerText = meditations[index];
    })
    .catch(err => console.error('Erreur chargement méditations:', err));

// afficher vidéos bible en 1 an
const debutPlan = new Date('2025-11-10');
const diffTime = today - debutPlan;
const jourPlan = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

document.getElementById('numeroJour').innerText = jourPlan;

fetch('bibleEn1An.json')
    .then(res => res.json())
    .then(videos => {
        const jourData = videos.find(v => v.jour === jourPlan);
        if (jourData) {
                document.getElementById('videoMatin').src = jourData.matin;
                document.getElementById('videoSoir').src = jourData.soir;
        } else {
                document.getElementById('bibleJour').innerHTML = "Le parcours \"Bible en 1 An\" débutera le 01-01-2026";
        }
    })
    .catch(err => console.error(err));

// 🕊️ afficher prière du jour
fetch('prieres.json')
    .then(res => res.json())
    .then(prieres => {
        const daySeed = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate();
        const index = daySeed % prieres.length;
        document.querySelector('#priere .texte').innerText = prieres[index];
    })
    .catch(err => console.error('Erreur chargement prières:', err));


// Fade-in au chargement
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('active');
    });
});

// 🔔 Widget Messes du jour (EgliseInfo)
(function() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`; // format DD-MM-YYYY

    // Exemple : ".fr 31 toulouse toutecelebration 11-11-2025"
    const searchValue = `.fr 31 toulouse toutecelebration ${formattedDate}`;

    // Met à jour dynamiquement l’attribut data-search
    const widget = document.getElementById('widgetEglise');
    if (widget) {
        widget.setAttribute('data-search', searchValue);
    }
})();

// === Gestion du message personnalisé quand il n'y a pas de messe ===
document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(() => {
    const widget = document.querySelector("#widgetEglise");
    if (!widget) return;

    const errorMessage = widget.querySelector(".error b");
    const customMessageId = "no-messe-message";

    // Si le widget affiche "Pas d'horaire disponible..."
    if (errorMessage && errorMessage.textContent.includes("Pas d'horaire disponible")) {
        // Masquer le bloc original
        widget.style.display = "none";

        // Créer un message personnalisé s’il n’existe pas déjà
        if (!document.getElementById(customMessageId)) {
            const message = document.createElement("div");
            message.id = customMessageId;
            message.style.textAlign = "center";
            message.style.padding = "20px";
            message.style.backgroundColor = "#f9f9f9";
            message.style.borderRadius = "10px";
            message.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
            message.innerHTML = `
                <p style="font-size: 1.1em; color: #444;">
                    Aucune messe prévue aujourd’hui à Toulouse.
                </p>
                `;
            const container = document.querySelector("#messes .EgliseInfo-container");
            if (container) container.appendChild(message);
            }
        }
    });

    // Surveille le contenu du widget (car il est injecté dynamiquement)
    const targetNode = document.querySelector("#widgetEglise");
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }
});

// === Suppression de la popup automatique du widget EgliseInfo ===
document.addEventListener("DOMContentLoaded", () => {
    const observerPopup = new MutationObserver(() => {
        const popup = document.querySelector(".gwt-DialogBox.window-eglise-choice");
        if (popup) {
            popup.remove(); // supprime complètement la fenêtre
            console.log("Popup EgliseInfo supprimée");
        }
    });

    // Surveille tout le body car la popup est injectée directement dedans
    observerPopup.observe(document.body, { childList: true, subtree: true });
});