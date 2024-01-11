// Récupération des projets depuis l'API et le end-point /works
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();


// Création des balises
const projet = works[0]; 

const imageElement = document.createElement("img");
imageElement.src = projet.imageUrl;
imageElement.alt = projet.title;

const figCaptionElement = document.createElement("figcaption");
figCaptionElement.innerText = projet.title;


// Création de l'élément figure et rattachement d'img et figcaption
const figureElement = document.createElement("figure");
figureElement.appendChild(imageElement);
figureElement.appendChild(figCaptionElement);

// Rattachement de la balise figure au DOM
const divGallery = document.querySelector(".gallery");

divGallery.appendChild(figureElement);
