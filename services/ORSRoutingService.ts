const ORS_API_ENDPOINT = "https://api.openrouteservice.org/v2/directions";
const ORS_GEOCODING_ENDPOINT = "https://api.openrouteservice.org/geocode/search";
const ORS_API_KEY = "5b3ce3597851110001cf6248c9076184a7454a28b33621aa86dfd12a"; 

export async function getRoute(origin: [number, number], destination: [number, number], mode: "driving-car" | "cycling-regular" | "foot-walking" = "driving-car") {
    const url = `${ORS_API_ENDPOINT}/${mode}/geojson?start=${origin.join(",")}&end=${destination.join(",")}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': ORS_API_KEY,
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }
    });

    if (!response.ok) {
        throw new Error(`ORS Routing Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function getDestinationCoordinates(query: string) {
    const url = `${ORS_GEOCODING_ENDPOINT}?text=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': ORS_API_KEY,
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }
    });

    if (!response.ok) {
        throw new Error(`ORS Geocoding Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transformando os resultados em um formato mais amigável para a nossa aplicação
    const destinations = data.features.map((feature: any) => ({
        label: feature.properties.label,
        lat: feature.geometry.coordinates[1], // Latitude é o segundo item
        lon: feature.geometry.coordinates[0], // Longitude é o primeiro item
    }));

    return destinations;
}


