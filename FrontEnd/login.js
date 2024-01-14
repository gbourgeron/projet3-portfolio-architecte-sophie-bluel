// Fonction pour se loguer 
export function userLogin() {
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("click", function(event) {
        event.preventDefault(); // Évite le rechargement de la page

        // Création de l'objet de l'user
        const user = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        }

        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(user);

        // Appel de la fonction fetch avec tous les informations
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: chargeUtile
        });

        // console.log(user);

        // window.location.href = "index.html"; // Redirection sur index.html
    });

}


// Appel de la fonction pour ajouter le listener au formulaire
userLogin();