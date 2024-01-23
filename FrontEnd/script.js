// API address
const apiUrl = "http://localhost:5678/api/";

// Récupération des works éventuellement stockés dans le localStorage
async function getWorks() {
    let works = window.localStorage.getItem("works");
    
    if (works === null) {
        // Récupération des works (projets) depuis l'API et le end-point /works
        const reponse = await fetch(`${apiUrl}works`);
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
// Create all works for main page
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

// First display of the works
genererWorks(works);

//------------------
//
//
// Get categories
async function getCategories() {
    try {
        const response = await fetch(`${apiUrl}categories`);
        return await response.json();
    } catch {
        console.error("Erreur lors de la récupération des catégories :", error);
        return [];
    }
}

const categories = await getCategories();


//------------------
//
//
// Create filters V2
function createFilterButtons(categories) {
    const filterBar = document.getElementById("filter-bar");

    // Create a button for all works
    const allFilterButton = document.createElement("button");
    allFilterButton.className = "filter-button";
    allFilterButton.id = "all-filter-btn";
    allFilterButton.innerText = "Tous";

    allFilterButton.addEventListener("click", () => {
        // Clear all previous works filtered
        document.querySelector(".gallery").innerHTML = "";
        genererWorks(works);
    });

    filterBar.appendChild(allFilterButton);

    // Create a button for each category
    categories.forEach(category => {
        const filterButton = document.createElement("button");
        filterButton.className = "filter-button";
        filterButton.id = `filter-btn-${category.id}`;
        filterButton.innerText = category.name;

        filterButton.addEventListener("click", () => {
            const filteredWorks = works.filter(work => work.category.id === category.id);
            genererWorks(filteredWorks);
        })

        // Add each button to the filter bar
        filterBar.appendChild(filterButton);
    })

}

createFilterButtons(categories);


//------------------
//
//
// Select options
function createSelectOptions(categories) {
    const selectMenu = document.getElementById("category");

    // Create an option for each category
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.innerText = category.name;

        selectMenu.appendChild(option);
    })
}

createSelectOptions(categories);


//------------------
//
//
// Get token
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
const openModal = async function() { // changer en function directement
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
// Create all works for the modal
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

            // Clear localStorage
            window.localStorage.removeItem("works");
        });
    }

}


//------------------
//
//
// Delete a work
// Function to delete a work with his ID
async function deleteWork(workId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}works/${workId}`, {
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
// Create a work
// Function to add a work
const projectForm = document.getElementById("project-form");
projectForm.addEventListener("submit", async function (event) {
    // Prevent reload page after submit form
    event.preventDefault();

    const statutMsg = document.getElementById("statut-msg");

    try {
        const formData = new FormData(this);
        const token = localStorage.getItem("token");

        const response = await fetch (`${apiUrl}works`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if(response.ok) {
            // Clear localStorage
            window.localStorage.removeItem("works");

            // Wait update of works
            const updatedWorks = await getWorks();
            genererWorks(updatedWorks);
            
            statutMsg.classList.add("success-message");
            statutMsg.classList.remove("error-message");
            statutMsg.classList.remove("hidden");
            statutMsg.textContent = "Projet ajouté avec succès.";

            await new Promise(resolve => setTimeout(resolve, 2000));
            statutMsg.classList.add("hidden");

            // Clear form & close modal
            projectForm.reset();
            closeModal();
        } else {
            statutMsg.classList.add("error-message");
            statutMsg.classList.remove("success-message");
            statutMsg.classList.remove("hidden");
            statutMsg.textContent = "Échec de l'ajout du projet. Veuillez réessayer.";

            setTimeout(() => {
                statutMsg.classList.add("hidden");
            }, 2000);
        }
    
    } catch(error) {
        
        
        console.log("Erreur lors de l'envoi du formulaire : ", error);
    }


})