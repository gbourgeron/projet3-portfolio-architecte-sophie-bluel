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
const openModal = async function() {
    modal[0].classList.remove("hidden");
    overlay.classList.remove("hidden");

    // Récupération des works dans le localStorage
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

            // const workId = work.id;

            // Appel de la fonction pour supprimer le projet
            deleteWork(work.id);

            // Retirer l'élément de la modale
            const deletedWorkModal = document.getElementById(`${work.id}-thumb`);
            deletedWorkModal.remove();
            // Retirer l'élément de la galerie
            const deletedWorkGall = document.getElementById(`${work.id}-gall`);
            deletedWorkGall.remove();
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
            window.localStorage.removeItem("works");
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
            alert("Projet ajouté avec succès.");

        } else {
            alert("Échec de l'ajout du projet. Veuillez réessayer");
        }
    
    } catch(error) {
        alert("Erreur lors de l'envoi du formulaire : " + error.message);
        console.log("Erreur lors de l'envoi du formulaire : ", error);
    }


})






//------------------
//
//
// Création d'un projet
// Fonction pour ajouter un projet
// const projectForm = document.getElementById("project-form");
// projectForm.addEventListener("submit", function(event) {
//     event.preventDefault(); // Empêche le rechargement de la page

//     const formData = new FormData(this);
//     const token = localStorage.getItem("token");

//     fetch("http://localhost:5678/api/works", {
//         method: 'POST',
//         headers: {
//             "Authorization": `Bearer ${token}`
//         },
//         body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//         alert("Réponse du serveur : " + JSON.stringify(data));

//         if(data.ok) {
//             window.localStorage.removeItem("work");
            
//         }
//     })
//     .catch(error => {
//         alert("Erreur lors de l'envoi du formulaire : " + error.message);
//         console.log("Erreur lors de l'envoi du formulaire : ", error);
//     });
// });