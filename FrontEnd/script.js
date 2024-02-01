// API address
const apiUrl = "http://localhost:5678/api/";

// Get works from localStorage or API
async function getWorks() {
    let works = window.localStorage.getItem("works");
    
    if (works === null) {
        // Get works from API/works
        const reponse = await fetch(`${apiUrl}works`);
        works = await reponse.json(); // Nouveau tableau
        
        // Transform works in JSON
        const valeurWorks = JSON.stringify(works);
        // Store works in localStorage
        window.localStorage.setItem("works", valeurWorks);
    } else {
        works = JSON.parse(works); // Rebuilt data
    }
    
    return works
}

let works = await getWorks();

const divGallery = document.querySelector(".gallery");
const divGalleryModal = document.querySelector(".gallery-modal");

//------------------
//
//
// Display all works for main page
function genererWorks(works) {
    
    divGallery.innerHTML = "";

    // For loop for display all works
    for (let i = 0; i < works.length; i++) {
        
        const work = works[i]; // One work

        // Create image & figCaption
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        
        const figCaptionElement = document.createElement("figcaption");
        figCaptionElement.innerText = work.title;
        
        // Create figure to attach image & figCaption
        const figureElement = document.createElement("figure");
        figureElement.id = `${work.id}-gall`;
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figCaptionElement);
        
        // Attach figure to DOM
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

// Change display of index.html if logged
if(token) {
    // Change login to logout
    const logLink = document.getElementById("log-link");
    logLink.innerText = "logout";    

    // Display bar "Mode édition"
    const modeEdition = document.getElementById("creation-mode");
    modeEdition.classList.remove("hidden");
    
    // Display link "modifier"
    const modifProjects = document.getElementById("modif-projects");
    modifProjects.classList.remove("hidden");
    
    // Hide filters
    const filterBar = document.getElementById("filter-bar");
    filterBar.classList.add("hidden");
    
    // Logout if link clicked
    logLink.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent redirect to login.html
        localStorage.removeItem("token"); // Remove token
        location.reload(); // Reload page
    })
}


// MODAL
//------------------
//
//
// Variable for Modals and listeners
const modal = document.querySelectorAll(".modal");

const openModalBtn = document.querySelectorAll(".btn-open");
openModalBtn[0].addEventListener("click", openModal1);

const openModal2Btn = document.querySelector("#open-modal-2");
openModal2Btn.addEventListener("click", openModal2);

const closeModalBtn = document.querySelectorAll(".btn-close");
closeModalBtn[0].addEventListener("click", closeModal);
closeModalBtn[1].addEventListener("click", closeModal);

const overlay = document.querySelector(".overlay");
overlay.addEventListener("click", closeModal);

const backModal1 = document.querySelector("#back");
backModal1.addEventListener("click", openModal1);

// Open Modal 1
async function openModal1() {
    modal[0].classList.remove("hidden");
    modal[1].classList.add("hidden");
    overlay.classList.remove("hidden");

    resetModal2();

    works = await getWorks();

    // Display all works
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


//------------------
//
//
// Create all works for the modal
function genererThumbnails(works) {
        
    divGalleryModal.innerHTML = "";

    // For loop for display all works
    for (let i = 0; i < works.length; i++) {
        
        const work = works[i]; // One work

        // Create image
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;

        // Create trashbin
        const divTrash = document.createElement("div");
        divTrash.className = "trash";
        const imgTrash = document.createElement("img");
        imgTrash.src = "assets/icons/trashbin.png";
        divTrash.appendChild(imgTrash);
        
        // Create figure to attach image and trashbin
        const figureElement = document.createElement("figure");
        figureElement.id = `${work.id}-thumb`;
        figureElement.appendChild(imageElement);
        figureElement.appendChild(divTrash);
        
        // Attach figure to DOM
        const divGalleryModal = document.querySelector(".gallery-modal");
        divGalleryModal.appendChild(figureElement);

        // Add eventListener for trashbin click
        divTrash.addEventListener("click", function(event) {
            // Stop event to propagate 
            event.stopPropagation();

            // Call delete function
            deleteWork(work.id);
        });
    }
}


//------------------
//
//
// Delete a work
// Function to delete a work with his ID
async function deleteWork(workId) {

    const deleteMsg = document.getElementById("delete-msg");

    try {
        const response = await fetch(`${apiUrl}works/${workId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        if(response.ok) {
            let message = "Projet supprimé avec succès.";
            displayMessage(deleteMsg, message, "success-message");

            // Remove work from modal
            const deletedWorkModal = document.getElementById(`${workId}-thumb`);
            deletedWorkModal.remove();

            // Remove work from gallery
            const deletedWorkGall = document.getElementById(`${workId}-gall`);
            deletedWorkGall.remove();

            // Clear localStorage
            window.localStorage.removeItem("works");
        }

    } catch(error) {
        let message = `Impossible de supprimer le projet : ${error.message}`;
        displayMessage(deleteMsg, message, "error-message");
    }
}


//------------------
//
//
// Check form field
function checkFormField(field) {
    if(field.value === "") {
        throw new Error(`Le champ ${field.name} est vide. Veuillez le renseignez.`);
    }
}

// A améliorer

// Select form field an check if selected to change Submit button style
const title = document.getElementById("title");
title.addEventListener("input", updateValidationBtnStyle);

const category = document.getElementById("category");
category.addEventListener("input", updateValidationBtnStyle);

const filediv = document.getElementById("file-input");
filediv.addEventListener("input", updateValidationBtnStyle);

// Check form and change submit button style
function updateValidationBtnStyle() {
    // Vérifiez que tous les champs sont remplis
    if (title.value !== "" && category.value !== "" && filediv.value !== "") {
        // Changer le style du bouton de validation
        const validationBtn = document.getElementById("validation-btn");
        validationBtn.style.backgroundColor = "#1D6154";
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

        let title = document.getElementById("title");
        checkFormField(title);
        let category = document.getElementById("category");
        checkFormField(category);
        let filediv = document.getElementById("file-input");
        checkFormField(filediv);

    } catch(error) {
        let message = `${error.message}`;
        displayMessage(statutMsg, message, "error-message");
    }

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

            let message = "Projet ajouté avec succès.";
            await displayMessage(statutMsg, message, "success-message");

            // Clear form & close modal
            projectForm.reset();
            closeModal();
        } 
            
    } catch(error) {       
        let message = `Erreur du serveur lors de l'envoi du formulaire : ${error.message}`;
        displayMessage(statutMsg, message, "error-message");
    }
})


//------------------
//
//
// Message function
async function displayMessage(element, message, className) {
    element.className = className;
    element.classList.remove("hidden");
    element.textContent = message;

    await new Promise(resolve => setTimeout(resolve, 3000));
    element.classList.add("hidden");
}


//------------------
//
//
// Input button
function openFileInput() {
    document.getElementById("file-input").click();
}

const addButton = document.getElementById("add-button-filediv");
addButton.addEventListener("click", openFileInput);

const fileInput = document.getElementById("file-input");
fileInput.addEventListener("change", displaySelectedImage);

// Display uploaded image
function displaySelectedImage() {
    const fileInput = document.getElementById('file-input');
    const fileDiv = document.getElementById('filediv');
  
    // Check if file selected
    if (fileInput.files) {
        const selectedImage = fileInput.files[0];

        // Create URL object for the selected image
        const imageURL = URL.createObjectURL(selectedImage);

        // Create image element
        const imgElement = document.createElement('img');
        imgElement.src = imageURL;
        imgElement.id = "image-to-upload"

        // Add image to parent div
        fileDiv.appendChild(imgElement);

        // Change height of the image
        imgElement.style.height = '100%';

        // Hide all elements behind image
        hideAllElementsBehindImage(fileDiv, imgElement);
    }
}

function hideAllElementsBehindImage(parentElement, exceptionElement) {
    // Get all elements from parentElement
    const childElements = parentElement.children;
  
    // Apply hidden class for all childElements with an except one
    for (const child of childElements) {
      if (child !== exceptionElement) {
        child.classList.add('hidden');
      }
    }
}


//------------------
//
//
// Function to reset Modal 2
function resetModal2() {
    
    const fileInput = document.getElementById('file-input');
    const fileDiv = document.getElementById('filediv');
    const imgElement = document.getElementById("image-to-upload");

    // Delete img if present
    if (imgElement) {
        imgElement.remove();
    }

    // Reset class
    const pictureFileDiv = document.getElementById('picture-filediv');
    const addButtonFileDiv = document.getElementById("add-button-filediv");
    const textFileDiv = document.getElementById('text-filediv');
    pictureFileDiv.classList.remove('hidden');
    addButtonFileDiv.classList.remove("hidden");
    textFileDiv.classList.remove("hidden");

    // Clear field's content
    fileInput.value = "";
    title.value = "";
    category.value = "";

}