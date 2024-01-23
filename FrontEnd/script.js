// Récupération des works éventuellement stockés dans le localStorage
async function getWorks() {
    let works = window.localStorage.getItem("works");
    
    if (works === null) {
        // Récupération des works (projets) depuis l'API et le end-point /works
        const reponse = await fetch("http://localhost:5678/api/works");
        works = await reponse.json(); // Nouveau tableau
        
        // Transformation des pièces en JSON
        const valeurWorks = JSON.stringify(works);
        // Stockage des informations dans le localStorage
        window.localStorage.setItem("works", valeurWorks);
    } else {
        works = JSON.parse(works); // Reconstruction des données
    }
    
    return works
}

let works = await getWorks();

const divGallery = document.querySelector(".gallery");
const divGalleryModal = document.querySelector(".gallery-modal");

//------------------
//
//
// Fonction qui génère toute la 'gallery'
function genererWorks(works) {
    
    divGallery.innerHTML = "";

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
        figureElement.id = `${work.id}-gall`;
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
// Boutons de filtrages V2
async function filterButtons() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();

        const filterBar = document.getElementById("filter-bar");

        // Create a button for each category
        categories.forEach(category => {
            const filterButton = document.createElement("button");
            filterButton.className = "filter-button";
            filterButton.id = `filter-btn-${category.id}`;
            filterButton.innerText = category.name;

            filterButton.addEventListener("click", function() {
                const filteredWorks = works.filter(work => work.category.id === category.id);
                genererWorks(filteredWorks);
            })

            // Add each button to the filter bar
            filterBar.appendChild(filterButton);
        })
    } catch {
        console.error("Erreur lors de la récupération des catégories :", error);
    }
}

filterButtons();

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
const token = localStorage.getItem("token");

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
        event.preventDefault(); // Empêche la redirection vers login.html
        localStorage.removeItem("token"); // Retire le token
        location.reload(); // Recharge la page une fois le token retiré
    })
}


// MODAL


//------------------
//
//
// Variable for Modals
const modal = document.querySelectorAll(".modal");
const openModalBtn = document.querySelectorAll(".btn-open");
const openModal2Btn = document.querySelector("#open-modal-2");
const closeModalBtn = document.querySelectorAll(".btn-close");
const overlay = document.querySelector(".overlay");
const backModal1 = document.querySelector("#back");

// Open Modal 1
const openModal = async function() {
    modal[0].classList.remove("hidden");
    modal[1].classList.add("hidden");
    overlay.classList.remove("hidden");

    works = await getWorks();

    // Appel de la fonction pour afficher tous les works
    genererThumbnails(works);
}

// Open modal 2
function openModal2() {
    modal[1].classList.remove("hidden");
    modal[0].classList.add("hidden");
}

// Close Modal 1 & 2
function closeModal() {    
    modal[0].classList.add("hidden");
    modal[1].classList.add("hidden");
    overlay.classList.add("hidden");
}

// Listeners for Modals
openModalBtn[0].addEventListener("click", openModal);
openModal2Btn.addEventListener("click", openModal2);
backModal1.addEventListener("click", openModal);
closeModalBtn[0].addEventListener("click", closeModal);
closeModalBtn[1].addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);


//------------------
//
//
// Fonction qui génère tous les works pour la modale
function genererThumbnails(works) {
        
    // Nettoyer la div pour s'assurer qu'il ne reste pas d'anciennes miniatures
    divGalleryModal.innerHTML = "";

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
        figureElement.id = `${work.id}-thumb`;
        figureElement.appendChild(imageElement);
        figureElement.appendChild(divTrash);
        
        // Rattachement de l'élément 'figure' au DOM
        const divGalleryModal = document.querySelector(".gallery-modal");
        divGalleryModal.appendChild(figureElement);


        // Ajout d'un listener pour chaque élément .trash
        divTrash.addEventListener("click", function(event) {
            event.stopPropagation(); // Empêche la propagation de l'événement pour éviter de déclencher l'événement du parent

            // Appel de la fonction pour supprimer le projet
            deleteWork(work.id);

            // Retirer l'élément de la modale
            const deletedWorkModal = document.getElementById(`${work.id}-thumb`);
            deletedWorkModal.remove();

            // Retirer l'élément de la galerie
            const deletedWorkGall = document.getElementById(`${work.id}-gall`);
            deletedWorkGall.remove();

            window.localStorage.removeItem("works");
        });
    }

}


//------------------
//
//
// Suppression d'un projet
// Fonction pour supprimer un projet avec son ID
async function deleteWork(workId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        if(response.ok) {
            // alert(`Projet avec l'ID ${workId} supprimé avec succès.`);
        } else {
            alert(`Échec de la suppression du projet avec l'ID ${workId}`)
        }

    } catch(error) {
        alert('Erreur lors de la suppression du projet:', error);
    }
}


//------------------
//
//
// Création d'un projet
// Fonction pour ajouter un projet
const projectForm = document.getElementById("project-form");
projectForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Empêche le rechargement de la page à la validation du formulaire

    try {
        const formData = new FormData(this);
        const token = localStorage.getItem("token");

        const response = await fetch ("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if(response.ok) {
            window.localStorage.removeItem("works");

            // Attendre la mise à jour de works
            const updatedWorks = await getWorks();
                        
            genererWorks(updatedWorks);
            // genererThumbnails(updatedWorks);
            
            alert("Projet ajouté avec succès.");        

        } else {
            alert("Échec de l'ajout du projet. Veuillez réessayer");
        }
    
    } catch(error) {
        alert("Erreur lors de l'envoi du formulaire : " + error.message);
        console.log("Erreur lors de l'envoi du formulaire : ", error);
    }


})