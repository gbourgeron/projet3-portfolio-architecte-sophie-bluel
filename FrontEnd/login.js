// Function to login
async function userLogin() {

    const errorMessage = document.getElementById("error-login-msg");

    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent page reload


        try {
            // Create the user object
            const user = {
                email: event.target.querySelector("[name=email]").value,
                password: event.target.querySelector("[name=password]").value
            }

            // Create payload to JSON format
            const chargeUtile = JSON.stringify(user);
        
            // Call the Api with fetch function
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: chargeUtile
            })

            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }
            
            const data = await response.json();

            // Store token in localStorage
            const token = data.token;
            localStorage.setItem('token', token);            
            
            // Redirect to index.html after success login
            window.location.href = "index.html";

        } catch(error) {
            errorMessage.classList.remove("hidden");
    
            if (error instanceof TypeError) {
                // Message if server's connexion not ok
                errorMessage.textContent = "Erreur de connexion au serveur, veuillez essayer ultérieurement.";
                setTimeout(() => {
                    errorMessage.classList.add("hidden");
                }, 3000);
            } else {
                // Message if log users are wrong
                errorMessage.textContent = "Votre combinaison email/mot de passe est incorrecte.";
                setTimeout(() => {
                    errorMessage.classList.add("hidden");
                }, 3000);
            }

        }
    });

}

userLogin();