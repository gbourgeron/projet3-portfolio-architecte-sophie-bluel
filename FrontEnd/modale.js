// let modal = null 

// // Fonction pour gérer l'ouverture de la modale
// const openModal = function(event) {
//     event.preventDefault(); // Évite le comportement pas défaut

//     // Récupère l'attribut href et sa valeur (ex: href = #modal1)
//     const target = document.querySelector(event.target.getAttribute("href"));

//     // Affichage de la barre 'modale'
//     const modale = document.getElementsByClassName("modal")[0];
//     modale.classList.remove("hidden");
// }

// // Nous récupérons tous les 'a' pour activer la fonction modale
// document.querySelectorAll(".js-modal").forEach(a => {
//     a.addEventListener("click", openModal)
// })



const modalLink = document.getElementById("modif-projects");
modalLink.addEventListener("click", (event) => {
    event.preventDefault();

    const modal1 = document.getElementById("modal-1");
    modal1.classList.remove("hidden");
})