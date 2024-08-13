import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import {renderRoute} from "./utils/render_route";
import {renderBuilding} from "./utils/render_building";

const map = (window.map = new maplibregl.Map({
	container: 'map',
	style:
		'https://api.maptiler.com/maps/basic/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
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
