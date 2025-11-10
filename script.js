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
        document.getElementById('priere').innerText = prieres[index];
    })
    .catch(err => console.error('Erreur chargement prières:', err));


// Fade-in au chargement
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('active');
    });
});