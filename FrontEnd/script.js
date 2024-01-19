// Récupération des works (projets) depuis l'API et le end-point /works
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json(); // Nouveau tableau

//------------------
//
//
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

//------------------
//
//
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

// Filtre Tous
const allFilterButton = document.getElementById("all-button");
allFilterButton.addEventListener("click", function() {
    // Suppression de tous les éléments (filtrés ou non) puis régénération à nouveau de tous les éléments
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(works);
})

//------------------
//
//
// Récupération du token d'authentification
const token = sessionStorage.getItem("token");

// Modification des éléments de la page index.html si présence du token
if(token) {
    // Modification du lien 'log-link'
    const logLink = document.getElementById("log-link");
    logLink.innerText = "logout";    

    // Affichage de la barre "Mode édition"
    const modeEdition = document.getElementById("creation-mode");
    modeEdition.classList.remove("hidden");
    
    // Affichage d'un lien pour modifier les projets
    const modifProjects = document.getElementById("modif-projects");
    modifProjects.classList.remove("hidden");
    
    // Masquage des filtres
    const filterBar = document.getElementById("filter-bar");
    filterBar.classList.add("hidden");
        
    
    // Déconnexion en cas de click sur log-link
    logLink.addEventListener("click", (event) => {
        event.preventDefault(); // Empêche le rechargement de la plage
        sessionStorage.removeItem("token"); // Retire le token
        location.reload(); // Recharge la page une fois le token retiré
    })
}

//------------------
//
//
// Modals
const modal = document.querySelectorAll(".modal");
const openModalBtn = document.querySelectorAll(".btn-open");
const closeModalBtn = document.querySelectorAll(".btn-close");
const overlay = document.querySelector(".overlay");
const divGalleryModal = document.querySelector(".gallery-modal");

// Open Modal 1
const openModal = function() {
    modal[0].classList.remove("hidden");
    overlay.classList.remove("hidden");

    // Fonction qui génère toute la gallerie pour la modale
    function genererThumbnails(works) {
    
        // Creation d'une boucle pour récupérer tous les objets de works
        for (let i = 0; i < works.length; i++) {
            
            const work = works[i]; // Work correspondant à un objet de ma liste works (un projet)

            // Création d'un élément 'image'
            const imageElement = document.createElement("img");
            imageElement.src = work.imageUrl;
            imageElement.alt = work.title;

            // Création de la trashbin
            const divTrash = document.createElement("div");
            divTrash.className = "trash";
            const imgTrash = document.createElement("img");
            imgTrash.src = "assets/icons/trashbin.png";
            divTrash.appendChild(imgTrash);
            
            // Création de l'élément 'figure' et rattachement de l'élément 'imageElement' et 'divTrash'
            const figureElement = document.createElement("figure");
            figureElement.appendChild(imageElement);
            figureElement.appendChild(divTrash);
            
            // Rattachement de l'élément 'figure' au DOM
            const divGalleryModal = document.querySelector(".gallery-modal");
            divGalleryModal.appendChild(figureElement);

        }

    }

    // Appel de la fonction pour afficher tous les projets
    genererThumbnails(works);

    // Open modal 2 (click 'Ajouter une photo')
    const openModal2 = document.querySelector("#open-modal-2");
    openModal2.addEventListener("click", () => {
        modal[1].classList.remove("hidden");
        modal[0].classList.add("hidden");
    })

    // Back to modal 1
    const backModal1 = document.querySelector("#back");
    backModal1.addEventListener("click",() => {
        divGalleryModal.innerHTML = "";
        modal[1].classList.add("hidden");
        openModal();
    })
}

openModalBtn[0].addEventListener("click", openModal);

// Close Modal 1 & 2
const closeModal = function(event) {
    event.preventDefault();
    
    modal[0].classList.add("hidden");
    modal[1].classList.add("hidden");
    overlay.classList.add("hidden");

    // Efface les miniatures
    divGalleryModal.innerHTML = "";
}

closeModalBtn[0].addEventListener("click", closeModal);
closeModalBtn[1].addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);