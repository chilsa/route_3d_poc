import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import {renderRoute} from "./utils/render_route";
import {renderBuilding} from "./utils/render_building";

const map = (window.map = new maplibregl.Map({
	container: 'map',
	style: {
		'id': 'raster',
		'version': 8,
		'name': 'Raster tiles',
		'center': [0, 0],
		'zoom': 0,
		'sources': {
			'raster-tiles': {
				'type': 'raster',
				'tiles': ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
				'tileSize': 256,
				'minzoom': 0,
				'maxzoom': 19
			}
		},
		'layers': [
			{
				'id': 'background',
				'type': 'background',
				'paint': {
					'background-color': '#e0dfdf'
				}
			},
			{
				'id': 'simple-tiles',
				'type': 'raster',
				'source': 'raster-tiles'
			}
		]
	},
	center: [-87.61578392215847, 41.86784341172856],
	zoom: 16,
	pitch: 60,
	bearing: 30,
	antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased
}));

map.on('style.load', async () => {
	await renderBuilding(map);
	await renderRoute(map);
});
