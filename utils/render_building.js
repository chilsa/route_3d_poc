import {loadGeoJson} from './load_resource.js';

export async function renderBuilding(maplibre) {
	const data = await loadGeoJson();
	
	maplibre.addSource('floorplan', {
		// GeoJSON Data source used in vector tiles, documented at
		// https://gist.github.com/ryanbaumann/a7d970386ce59d11c16278b90dde094d
		'type': 'geojson',
		'data': data
	});
	maplibre.addLayer({
		'id': 'room-extrusion',
		'type': 'fill-extrusion',
		'source': 'floorplan',
		'paint': {
			// See the MapLibre Style Specification for details on data expressions.
			// https://maplibre.org/maplibre-style-spec/expressions/
			
			// Get the fill-extrusion-color from the source 'color' property.
			'fill-extrusion-color': ['get', 'color'],
			
			// Get fill-extrusion-height from the source 'height' property.
			'fill-extrusion-height': ['get', 'height'],
			
			// Get fill-extrusion-base from the source 'base_height' property.
			'fill-extrusion-base': ['get', 'base_height'],
			
			// Make extrusions slightly opaque for see through indoor walls.
			// 'fill-extrusion-opacity': 0.8
		}
	});
}
