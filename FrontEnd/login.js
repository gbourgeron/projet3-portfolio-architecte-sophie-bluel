// Fonction pour se loguer 
function userLogin() {

    const errorMessage = document.getElementById("error-login-msg");

    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Évite le rechargement de la page

        // Création de l'objet de l'user
        const user = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        }

        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(user);

        // Appel de la fonction fetch avec toutes les informations
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: chargeUtile
        })

        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }
            
            // Extraction du token de la réponse
            return response.json();
        })
        
        .then(data => {
            // Stockage du token localement
            const token = data.token;
            localStorage.setItem('token', token);            
            
            // Redirection sur index.html après un login réussi
            window.location.href = "index.html";
        })

        .catch(error => {
            console.error('Erreur lors de la requête fetch:', error);
            errorMessage.classList.remove("hidden");

            if (error instanceof TypeError) {
                // Message si connexion au serveur impossible
                errorMessage.textContent = "Erreur de connexion au serveur, veuillez essayer ultérieurement."
            } else {
                // Message si identifiants incorrects
                errorMessage.textContent = "Votre combinaison email/mot de passe est incorrecte."
            }
        });
    });

}

userLogin();