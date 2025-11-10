// Fonction pour calculer et afficher le nombre de caractères
function calcNbChar(id) {
    const inputElement = document.querySelector(`#${id}`);
    const countElement = document.querySelector(`[data-count-${id}]`);

    if (countElement && inputElement) {
        countElement.textContent = inputElement.value.length + " car.";
    }
}

// Fonction pour afficher la liste des contacts
function displayContactList() {
    const contactList = contactStore.getList();
    const tbody = document.querySelector("table tbody");

    if (!tbody) {
        console.error("Table body not found!");
        return;
    }

    tbody.innerHTML = "";

    if (contactList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center">Aucun contact enregistré</td></tr>`;
        return;
    }

    for (const contact of contactList) {
        // Créer un lien Google Maps pour l'adresse
        const mapsLink = `https://maps.google.com/maps?q=${encodeURIComponent(contact.adress)}`;

        // Créer un lien mailto pour l'email
        const mailLink = `mailto:${contact.mail}`;

        tbody.innerHTML += `<tr>
        <td>${contact.name}</td>
        <td>${contact.firstname}</td>
        <td>${contact.date}</td>
        <td><a href="${mapsLink}" target="_blank" title="Voir sur Google Maps">${contact.adress}</a></td>
        <td><a href="${mailLink}">${contact.mail}</a></td>
      </tr>`;
    }

    console.log(`${contactList.length} contacts affichés`);
}

// Validation d'email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Affichage des erreurs
function showError(id, message) {
    const errorElement = document.getElementById(id);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Effacement des erreurs
function clearErrors() {
    ["nameError", "firstnameError", "birthError", "adresseError", "mailError"].forEach(id => {
        showError(id, "");
    });
}

// Réinitialisation des compteurs de caractères
function resetCharCounters() {
    ["name", "firstname", "adresse", "mail"].forEach(id => {
        calcNbChar(id);
    });
}

// Fonction pour afficher un message
function showMessage(title, message, isSuccess = true) {
    const modal = new bootstrap.Modal(document.getElementById('myModal'));
    const modalTitle = document.getElementById('exampleModalLabel');
    const modalBody = document.querySelector('.modal-body');

    modalTitle.textContent = title;
    modalBody.innerHTML = message;

    // Changer la couleur du header selon le type de message
    const modalHeader = document.querySelector('.modal-header');
    modalHeader.style.background = isSuccess
        ? 'linear-gradient(90deg, #a0c4ff, #ffafcc)'
        : 'linear-gradient(90deg, #ff6b6b, #ffa5a5)';

    modal.show();
}

// Initialisation au chargement de la page
window.onload = function () {
    console.log("DOM ready - Initialisation du formulaire");

    // Afficher la liste des contacts existants
    displayContactList();

    // Gestion de la soumission du formulaire
    document.getElementById("myForm").addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("Formulaire soumis");

        clearErrors();

        const name = document.getElementById("name").value.trim();
        const firstname = document.getElementById("firstname").value.trim();
        const birth = document.getElementById("birth").value;
        const adresse = document.getElementById("adresse").value.trim();
        const mail = document.getElementById("mail").value.trim();

        // Vérification des champs vides
        if (!name || !firstname || !birth || !adresse || !mail) {
            showMessage("Erreur", "Tous les champs sont obligatoires.", false);
            return;
        }

        let hasError = false;
        let errorMessages = [];

        if (name.length < 5) {
            showError("nameError", "Le nom doit contenir au moins 5 caractères.");
            errorMessages.push("Nom : doit contenir au moins 5 caractères.");
            hasError = true;
        }
        if (firstname.length < 5) {
            showError("firstnameError", "Le prénom doit contenir au moins 5 caractères.");
            errorMessages.push("Prénom : doit contenir au moins 5 caractères.");
            hasError = true;
        }
        if (adresse.length < 5) {
            showError("adresseError", "L'adresse doit contenir au moins 5 caractères.");
            errorMessages.push("Adresse : doit contenir au moins 5 caractères.");
            hasError = true;
        }
        if (!validateEmail(mail)) {
            showError("mailError", "Email invalide.");
            errorMessages.push("Email : invalide.");
            hasError = true;
        }

        const birthTimestamp = new Date(birth).getTime();
        if (isNaN(birthTimestamp)) {
            showError("birthError", "Date invalide.");
            errorMessages.push("Date de naissance : invalide.");
            hasError = true;
        } else if (birthTimestamp > Date.now()) {
            showError("birthError", "La date de naissance ne peut pas être dans le futur.");
            errorMessages.push("Date de naissance : ne peut pas être dans le futur.");
            hasError = true;
        }

        if (hasError) {
            showMessage("Erreur de saisie", errorMessages.join("<br>"), false);
        } else {
            // Ajouter le contact au store
            const newContact = contactStore.add(name, firstname, birth, adresse, mail);
            console.log("Contact ajouté:", newContact);

            // Afficher le message de succès
            showMessage("Succès",
                `Bravo! Le contact a été ajouté avec succès.<br><br>
           <strong>${firstname} ${name}</strong><br>
           Né(e) le: ${birth}<br>
           Adresse: ${adresse}<br>
           Email: ${mail}`);

            // Réinitialiser le formulaire
            document.getElementById("myForm").reset();

            // Mettre à jour les compteurs de caractères
            resetCharCounters();

            // Mettre à jour l'affichage de la liste
            displayContactList();
        }
    });

    // Gestion du bouton GPS
    document.getElementById("gps").addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Bouton GPS cliqué");
        getLocation();
    });

    // Gestion du bouton Reset
    document.getElementById("reset").addEventListener("click", function (event) {
        event.preventDefault();
        if (confirm("Êtes-vous sûr de vouloir supprimer tous les contacts ? Cette action est irréversible.")) {
            contactStore.reset();
            displayContactList();
            showMessage("Reset effectué", "Tous les contacts ont été supprimés avec succès.");
        }
    });

    // Initialiser les compteurs de caractères
    resetCharCounters();

    console.log("Initialisation terminée");
};