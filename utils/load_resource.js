export async function loadGeoJson() {
	const response = await fetch('./assets/indoor-3d-map.geojson.json');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return await response.json();
}

export async function loadSprite(maplibre, name, url) {
	if (!maplibre.hasImage(name)) {
		try {
			const image = await maplibre.loadImage(url);
			maplibre.addImage(name, image.data);
		} catch (e) {
			console.error(e);
		}
	}
}
