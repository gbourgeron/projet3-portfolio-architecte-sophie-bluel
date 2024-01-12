// Récupération des works (projets) depuis l'API et le end-point /works
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json(); // Nouveau tableau


// Fonction qui génère toute la 'gallery'
function genererWorks(works) {
    
    // Creation d'une boucle pour parcourir et afficher tous les objets de works
    for (let i = 0; i < works.length; i++) {
        
        const work = works[i]; // Work correspondant à un objet de ma liste works (un projet)

        // Création d'un élément 'image' et 'figCaption'
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        
        const figCaptionElement = document.createElement("figcaption");
        figCaptionElement.innerText = work.title;
        
        // Création de l'élément 'figure' et rattachement des éléments 'image' et 'figcaption'
        const figureElement = document.createElement("figure");
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figCaptionElement);
        
        // Rattachement de l'élément 'figure' au DOM
        const divGallery = document.querySelector(".gallery");
        divGallery.appendChild(figureElement);

    }
}

// Premier affichage de la page
genererWorks(works);

// Boutons de filtrages 
// Filtre Objets
const objFilterButton = document.getElementById("objets");
objFilterButton.addEventListener("click", function() {
    const objFiltres = works.filter(work => work.category.id === 1);

    // Suppression de tous les éléments puis régénération des éléments filtrés
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(objFiltres); 
})

// Filtre Appartements
const appartFilterButton = document.getElementById("appartements");
appartFilterButton.addEventListener("click", function() {
    const appartFiltres = works.filter(work => work.category.id === 2);

    // Suppression de tous les éléments puis régénération des éléments filtrés
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(appartFiltres);
})

// Filtre Hotels & Restaurants
const hotFilterButton = document.getElementById("hotels-restaurants");
hotFilterButton.addEventListener("click", function() {
    const hotFiltres = works.filter(work => work.category.id === 3);

    // Suppression de tous les éléments puis régénération des éléments filtrés
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(hotFiltres);
})


const allFilterButton = document.getElementById("all-button");