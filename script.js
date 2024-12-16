const map = L.map('map').setView([12.9716, 77.5946], 13); // Centered on Bengaluru

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let originMarker, destinationMarker;

map.on('click', function(e) {
    if (!originMarker) {
        originMarker = L.marker(e.latlng).addTo(map);
        document.getElementById('origin').value = `${e.latlng.lat}, ${e.latlng.lng}`;
    } else if (!destinationMarker) {
        destinationMarker = L.marker(e.latlng).addTo(map);
        document.getElementById('destination').value = `${e.latlng.lat}, ${e.latlng.lng}`;
    } else {
        alert("Both origin and destination are already set!");
    }
});

document.getElementById('calculate').addEventListener('click', function() {
    const origin = document.getElementById('origin').value.split(',').map(Number);
    const destination = document.getElementById('destination').value.split(',').map(Number);

    fetch('/route', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            origin_lat: origin[0],
            origin_lon: origin[1],
            dest_lat: destination[0],
            dest_lon: destination[1]
        })
    })
    .then(response => response.json())
    .then(data => {
        const routeCoords = data.map(coord => [coord[0], coord[1]]);
        L.polyline(routeCoords, { color: 'blue' }).addTo(map);
        map.fitBounds(routeCoords);
    })
    .catch(error => console.error('Error:', error));
});