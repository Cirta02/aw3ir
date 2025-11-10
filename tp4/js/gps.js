// demande de la localisation à l'utilisateur
function getLocation() {
    if (navigator.geolocation) {
        document.querySelector("#map").innerHTML = "Localisation en cours...";
        navigator.geolocation.getCurrentPosition(showPosition, showError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    } else {
        document.querySelector("#map").innerHTML =
            "La géolocalisation n'est pas supportée par ce navigateur.";
    }
}

// Si l'utilisateur l'autorise, on récupère les coordonnées dans l'objet "position"
function showPosition(position) {
    // Récupérer la latitude et longitude
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    console.log("Coordonnées brutes - Latitude: " + lat + ", Longitude: " + lon);

    // Afficher d'abord les coordonnées brutes
    document.getElementById("adresse").value = `Position: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    calcNbChar("adresse");

    // Essayer de récupérer l'adresse avec plusieurs services
    getAddressFromCoordinates(lat, lon);

    // Afficher la carte
    displayMap(lat, lon);
}

// Fonction pour récupérer l'adresse avec plusieurs services
function getAddressFromCoordinates(lat, lon) {
    // Essayer d'abord avec OpenStreetMap
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
            if (data && data.display_name) {
                console.log("Adresse OSM:", data.display_name);
                document.getElementById("adresse").value = data.display_name;
                calcNbChar("adresse");
            } else {
                // Si OSM échoue, essayer avec l'API de géocodage de Bing
                getAddressFromBing(lat, lon);
            }
        })
        .catch(error => {
            console.error("Erreur OSM:", error);
            getAddressFromBing(lat, lon);
        });
}

// Alternative avec l'API de géocodage (utilisant un service gratuit)
function getAddressFromBing(lat, lon) {
    // Note: Vous devrez obtenir une clé API Bing Maps gratuite
    // Pour l'instant, on va simplement formater les coordonnées
    const address = `Latitude: ${lat.toFixed(6)}, Longitude: ${lon.toFixed(6)} - Utilisez l'adresse réelle si nécessaire`;
    document.getElementById("adresse").value = address;
    calcNbChar("adresse");
}

// Fonction pour afficher la carte
function displayMap(lat, lon) {
    const zoom = 16;
    const delta = 0.01;

    const bboxEdges = {
        south: lat - delta,
        north: lat + delta,
        west: lon - delta,
        east: lon + delta,
    };

    const bbox = `${bboxEdges.west}%2C${bboxEdges.south}%2C${bboxEdges.east}%2C${bboxEdges.north}`;
    const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

    document.getElementById("map").innerHTML = `
      <div class="alert alert-info">
        <strong>Position détectée:</strong> ${lat.toFixed(6)}, ${lon.toFixed(6)}
        <br><small>Si l'adresse est incorrecte, modifiez-la manuellement</small>
      </div>
      <iframe
        width="100%"
        height="300"
        frameborder="0"
        scrolling="no"
        src="${iframeSrc}">
      </iframe>
    `;
}

// Gestion des erreurs
function showError(error) {
    let errorMessage = "";

    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "Vous avez refusé l'accès à la géolocalisation. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Les informations de localisation ne sont pas disponibles.";
            break;
        case error.TIMEOUT:
            errorMessage = "La demande de localisation a expiré. Veuillez réessayer.";
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = "Une erreur inconnue est survenue lors de la localisation.";
            break;
    }

    document.getElementById("map").innerHTML = `
      <div class="alert alert-warning">
        <strong>Erreur de géolocalisation:</strong> ${errorMessage}
      </div>
    `;
}