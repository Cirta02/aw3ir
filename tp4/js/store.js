/*
store.js
Script pour gérer la liste de contact en JSON
*/
var contactStore = (function () {
    // variable privée
    let contactList = [];

    // Charger depuis le localStorage au démarrage
    function loadFromStorage() {
        const contactListString = localStorage.getItem("contactList");
        contactList = contactListString ? JSON.parse(contactListString) : [];
        console.log("Contacts chargés:", contactList.length);
    }

    // Sauvegarder dans le localStorage
    function saveToStorage() {
        localStorage.setItem("contactList", JSON.stringify(contactList));
    }

    // Charger au initialisation
    loadFromStorage();

    return {
        add: function (_name, _firsname, _date, _adress, _mail) {
            var contact = {
                name: _name,
                firstname: _firsname,
                date: _date,
                adress: _adress,
                mail: _mail,
                id: Date.now() // ID unique pour faciliter le débogage
            };

            // ajout du contact à la liste
            contactList.push(contact);
            console.log("Contact ajouté, liste maintenant:", contactList);

            // sauvegarde
            saveToStorage();

            return contact;
        },

        reset: function () {
            contactList = [];
            saveToStorage();
            console.log("Liste réinitialisée");
            return contactList;
        },

        getList: function () {
            return contactList;
        }
    };
})();