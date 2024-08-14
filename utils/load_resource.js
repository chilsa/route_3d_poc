export async function loadGeoJson() {
	const response = await fetch('./assets/indoor-3d-map.geojson.json');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return await response.json();
}
