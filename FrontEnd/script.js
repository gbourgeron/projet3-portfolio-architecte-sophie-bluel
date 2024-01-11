// Récupération des projets depuis l'API et le end-point /works
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

// Création des balises
