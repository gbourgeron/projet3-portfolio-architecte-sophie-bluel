// Récupération des works (projets) depuis l'API et le end-point /works
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json(); // Nouveau tableau


// Creation d'une boucle pour parcourir et afficher tous les éléments de works
for (let i = 0; i < works.length; i++) {
        
    const work = works[i]; // Work correspondant à un élément de ma liste works (un projet)

    // Création des balises pour index.html
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;

    const figCaptionElement = document.createElement("figcaption");
    figCaptionElement.innerText = work.title;

    // Création de l'élément figure et rattachement d'img et figcaption
    const figureElement = document.createElement("figure");
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figCaptionElement);

    // Rattachement de la balise figure au DOM
    const divGallery = document.querySelector(".gallery");
    divGallery.appendChild(figureElement);

}
