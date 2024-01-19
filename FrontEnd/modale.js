// Récupération des works (projets) depuis l'API et le end-point /works
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

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


            // Ajout d'un listener pour chaque élément .trash
            divTrash.addEventListener("click", function(event) {
                event.stopPropagation(); // Empêche la propagation de l'événement pour éviter de déclencher l'événement du parent

                const workId = work.id;

                // Appel de la fonction pour supprimer le projet
                deleteWork(workId);
            });
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




// Fonction pour supprimer un projet avec son ID
async function deleteWork(workId) {
    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
                // "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if(response.ok) {
            alert(`Projet avec l'ID ${workId} supprimé avec succès.`);
        } else {
            alert(`Échec de la suppression du projet avec l'ID ${workId}`)
        }

    } catch(error) {
        alert('Erreur lors de la suppression du projet:', error);
    }
}