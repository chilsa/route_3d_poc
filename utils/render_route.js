import maplibregl from "maplibre-gl";
import _ from 'lodash';
import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import {interpolate, interpolateArray} from "d3-interpolate";
import {lineString, points, point, polygon} from "@turf/helpers";
import {buffer} from "@turf/buffer";
import {center} from "@turf/center";
import {destination} from "@turf/destination";
import arrowUp from "../imgs/arrow_up.png";

const paths = [{
	"time": 61797,
	"distance": 85.837,
	"bbox": [114.111457, 22.370669, 114.111821, 22.37097],
	"instructions": [
		{
			"venue_id": "9f0af5f1758040008a7b112d041c0977",
			"building_id": "tsuenwanplaza_hk_369d01",
			"distance": 13.651,
			"heading": 344.61,
			"sign": 0,
			"interval": [0, 1],
			"text": "Enter building from outdoor",
			"time": 9828,
			"floor_id": "2cdd6174730d4431b1aa730eda596ed4",
			"ordinal": 0,
			"street_name": "",
			"type": null
		},
		{
			"venue_id": "9f0af5f1758040008a7b112d041c0977",
			"building_id": "tsuenwanplaza_hk_369d01",
			"distance": 29.86,
			"heading": 0,
			"sign": 2,
			"interval": [1, 2],
			"text": "Turn Right and walk straight to the lift",
			"time": 21498,
			"floor_id": "2cdd6174730d4431b1aa730eda596ed4",
			"ordinal": 0,
			"street_name": "",
			"type": null
		},
		{
			"venue_id": "9f0af5f1758040008a7b112d041c0977",
			"building_id": "tsuenwanplaza_hk_369d01",
			"distance": 10.456,
			"heading": 0,
			"sign": 100,
			"interval": [2, 3],
			"text": "Take lift from level 1 to level 3",
			"time": 7528,
			"floor_id": "2cdd6174730d4431b1aa730eda596ed4",
			"ordinal": 0,
			"street_name": "",
			"type": null
		},
		{
			"venue_id": "9f0af5f1758040008a7b112d041c0977",
			"building_id": "tsuenwanplaza_hk_369d01",
			"distance": 4.283,
			"heading": 0,
			"sign": 0,
			"interval": [3, 4],
			"text": "Out from lift and walk straight",
			"time": 3083,
			"floor_id": "2cdd6174730d4431b1aa730eda596ed4",
			"ordinal": 1,
			"street_name": "",
			"type": null
		},
		{
			"venue_id": "9f0af5f1758040008a7b112d041c0977",
			"building_id": "tsuenwanplaza_hk_369d01",
			"distance": 2.241,
			"heading": 0,
			"sign": 2,
			"interval": [4, 5],
			"text": "Turn Right and walk straight to the destination",
			"time": 1613,
			"floor_id": "2cdd6174730d4431b1aa730eda596ed4",
			"ordinal": 1,
			"street_name": "",
			"type": null
		},
		{
			"venue_id": "9f0af5f1758040008a7b112d041c0977",
			"building_id": "tsuenwanplaza_hk_369d01",
			"distance": 2.241,
			"heading": 0,
			"sign": 100,
			"interval": [5, 6],
			"text": "Turn Right and walk straight to the destination",
			"time": 1613,
			"floor_id": "2cdd6174730d4431b1aa730eda596ed4",
			"ordinal": 1,
			"street_name": "",
			"type": null
		},
		{
			"venue_id": "9f0af5f1758040008a7b112d041c0977",
			"building_id": "tsuenwanplaza_hk_369d01",
			"distance": 2.241,
			"heading": 0,
			"sign": 0,
			"interval": [6, 7],
			"text": "Turn Right and walk straight to the destination",
			"time": 1613,
			"floor_id": "2cdd6174730d4431b1aa730eda596ed4",
			"ordinal": 2,
			"street_name": "",
			"type": null
		},
		{
			"venue_id": "9f0af5f1758040008a7b112d041c0977",
			"building_id": "tsuenwanplaza_hk_369d01",
			"distance": 2.241,
			"heading": 0,
			"sign": 0,
			"interval": [7, 8],
			"text": "Turn Right and walk straight to the destination",
			"time": 1613,
			"floor_id": "2cdd6174730d4431b1aa730eda596ed4",
			"ordinal": 2,
			"street_name": "",
			"type": null
		},
		{
			"venue_id": "9f0af5f1758040008a7b112d041c0977",
			"building_id": "tsuenwanplaza_hk_369d01",
			"distance": 0,
			"heading": 0,
			"sign": 4,
			"interval": [8, 8],
			"text": "Arrive at destination",
			"time": 0,
			"floor_id": "e7067d79ac7e47a7835965bb1e46ac6b",
			"ordinal": 2,
			"street_name": "",
			"type": null
		},
	],
	"points": {
		"coordinates": [
			[-87.61702191869324, 41.865332260722425],
			[-87.61703942291355, 41.866246675348975],
			[-87.61570479030358, 41.8662492712956],
			[-87.61557591779658, 41.86624606863293],
			[-87.61703942291355, 41.866246675348975],
			[-87.61705892436883, 41.86665937995096],
			[-87.61705742344037, 41.86676639127796],
			[-87.61708220141612, 41.86646212362754],
			[-87.61809728994754, 41.866462761717656]
		],
		"type": "LineString"
	},
	"snapped_waypoints": {
		"coordinates": [[114.111821, 22.370669], [114.111457, 22.37097]],
		"type": "LineString"
	}
}];

export async function renderRoute(maplibre) {
	renderPathsLayer(maplibre, paths[0]);
	await render3DModals(maplibre, paths[0]);
}

function renderPathsLayer(maplibre, path) {
	const {instructions, points: {coordinates}} = path;
	const features = instructions.slice(0, instructions.length - 1).map((instruction, index) => {
		const {interval: [start, end], ordinal, sign} = instruction;
		const nextOrdinal = instructions[index + 1].ordinal;
		let lineFeature;
		
		if (isConnector(sign)) {
			const center = coordinates[end];
			// 计算一个以电梯坐标为中心点的正方形的四个顶点，把电梯渲染成一个立方体
			const vertexes = [45, 135, 225, 315].map(angle => {
				const pointFeature = destination(point(center), 3, angle, {units: "meters"});
				return pointFeature.geometry.coordinates;
			});
			lineFeature = polygon([[...vertexes, vertexes[0]]], {
				color: "#ea580c",
				height: nextOrdinal * 100,
				"base_height": ordinal * 100
			});
		} else {
			// 把路径渲染成宽4米高0.5米的立体线条
			lineFeature = lineString(
				coordinates.slice(start, end + 1),
				{
					color: "#ea580c",
					height: ordinal * 100 + 0.5,
					"base_height": ordinal * 100
				},
			);
			lineFeature = buffer(lineFeature, 2, {units: "meters"});
		}
		
		return lineFeature;
	});
	
	maplibre.addLayer({
		id: "lift-extrusion",
		type: "fill-extrusion",
		source: {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features
			}
		},
		paint: {
			'fill-extrusion-color': ['get', 'color'],
			'fill-extrusion-height': ['get', 'height'],
			'fill-extrusion-base': ['get', 'base_height']
		}
	});
}

async function render3DModals(maplibre, path) {
	const {points: {coordinates}} = path;
	
	// 以路线中心作为世界坐标系原点
	const centerPointFeature = center(points(coordinates));
	const centerOrigin = centerPointFeature.geometry.coordinates;
	const centerAltitude = 0;
	const sceneOriginMercator = maplibregl.MercatorCoordinate.fromLngLat(centerOrigin, centerAltitude);
	const sceneTransform = {
		translateX: sceneOriginMercator.x,
		translateY: sceneOriginMercator.y,
		translateZ: sceneOriginMercator.z,
		scale: sceneOriginMercator.meterInMercatorCoordinateUnits()
	};
	const sceneMatrix4 = new THREE.Matrix4()
		.makeTranslation(sceneTransform.translateX, sceneTransform.translateY, sceneTransform.translateZ)
		.scale(new THREE.Vector3(sceneTransform.scale, -sceneTransform.scale, sceneTransform.scale));
	
	// 加载marker模型
	const endMarkerModel = await loadModel();
	const scaleFactor = 8;
	endMarkerModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
	
	// 创建一个平面几何体来渲染箭头
	const loader = new THREE.TextureLoader();
	const arrowTexture = loader.load(arrowUp);
	const arrowMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1),
		new THREE.MeshBasicMaterial({map: arrowTexture, side: THREE.DoubleSide, transparent: true})
	);
	arrowMesh.scale.set(scaleFactor * 0.5, scaleFactor * 0.5, scaleFactor * 0.5);
	
	const markerGroup = new THREE.Group();
	const pathTextureGroup = new THREE.Group();
	const connectorTextureGroup = new THREE.Group();
	
	const customLayer = {
		id: 'points-3d-model',
		type: 'custom',
		renderingMode: '3d',
		onAdd(map, gl) {
			this.map = map;
			this.scene = new THREE.Scene();
			// In threejs, y points up - we're rotating the scene such that it's y points along maplibre's up.
			this.scene.rotateX(Math.PI / 2);
			// In threejs, z points toward the viewer - mirroring it such that z points along maplibre's north.
			this.scene.scale.multiply(new THREE.Vector3(1, 1, -1));
			// We now have a scene with (x=east, y=up, z=north)
			this.camera = new THREE.Camera();
			// use the MapLibre GL JS map canvas for three.js
			this.renderer = new THREE.WebGLRenderer({
				canvas: map.getCanvas(),
				context: gl,
				antialias: true
			});
			this.renderer.autoClear = false;
			
			const pArr = getRouteSplits(sceneOriginMercator, path, 3);
			pArr.forEach(({coordinates, identifier}, i) => {
				if (i === 0) {
					const startMarker = endMarkerModel.clone(true);
					startMarker.traverse((node) => {
						if (node.isMesh && node.material.name === "red") {
							// 克隆材质
							const clonedMaterial = node.material.clone();
							clonedMaterial.color.set(0x366ceb); // 设置为蓝色
							node.material = clonedMaterial; // 替换材质
						}
					});
					startMarker.position.set(coordinates[0], coordinates[1] + 4, coordinates[2]);
					markerGroup.add(startMarker);
				} else if (i === pArr.length - 1) {
					const endMarker = endMarkerModel.clone();
					endMarker.position.set(coordinates[0], coordinates[1] + 4, coordinates[2]);
					markerGroup.add(endMarker);
				} else {
					const nextCoord = pArr[i + 1].coordinates;
					
					if (identifier === "path") {
						const arrow = addPathArrow(coordinates, nextCoord, arrowMesh);
						pathTextureGroup.add(arrow);
					} else {
						const arrowModals = addConnectorArrows(coordinates, nextCoord, arrowMesh);
						arrowModals.forEach(arrowModal => connectorTextureGroup.add(arrowModal));
					}
				}
			});
			this.scene.add(pathTextureGroup);
			this.scene.add(connectorTextureGroup);
			this.scene.add(markerGroup);
			
			const light = new THREE.AmbientLight(0xffffff); // 环境光，照亮场景里的所有物体
			this.scene.add(light);
		},
		render(gl, matrix) {
			const mlMatrix4 = new THREE.Matrix4().fromArray(matrix);
			
			this.camera.projectionMatrix = mlMatrix4.multiply(sceneMatrix4);
			this.renderer.resetState();
			this.renderer.render(this.scene, this.camera);
			this.map.triggerRepaint();
		}
	};
	
	maplibre.addLayer(customLayer);
}

async function loadModel() {
	const loader = new GLTFLoader();
	const gltf = await loader.loadAsync('./assets/red-point.gltf');
	return gltf.scene;
}

function addPathArrow(position, nextPosition, texture) {
	const arrow = texture.clone();
	arrow.position.set(position[0], position[1] + 1, position[2]);
	arrow.lookAt(new THREE.Vector3(nextPosition[0], nextPosition[1] + 1, nextPosition[2]));
	arrow.rotateX(Math.PI/2);
	return arrow;
}

function addConnectorArrows(position, nextPosition, texture) {
	const xTextures = ["west", "east"].map(direct => {
		const modal = texture.clone();
		const originX = direct === "west" ? position[0] - 3 : position[0] + 3;
		const nextX = direct === "west" ? nextPosition[0] - 3 : nextPosition[0] + 3;
		
		modal.position.set(originX, position[1] + 3, position[2]);
		modal.lookAt(new THREE.Vector3(nextX, nextPosition[1] + 3, nextPosition[2]));
		
		modal.rotateX(Math.PI/2);
		modal.rotateY(Math.PI/2);
		return modal;
	});
	const zTextures = ["south", "north"].map(direct => {
		const modal = texture.clone();
		const originZ = direct === "south" ? position[2] - 3 : position[2] + 3;
		const nextZ = direct === "south" ? nextPosition[2] - 3 : nextPosition[2] + 3;
		
		modal.position.set(position[0], position[1] + 3, originZ);
		modal.lookAt(new THREE.Vector3(nextPosition[0], nextPosition[1] + 3, nextZ));
		
		modal.rotateX(Math.PI/2);
		return modal;
	});
	return [...xTextures, ...zTextures];
}

function getRouteSplits(originPoint, path, breakCnt = 0) {
	const {instructions, points: {coordinates}} = path;
	
	return _.flatMap(instructions, (instruction, i) => {
		const {interval: [start, end], ordinal: sOrd, sign} = instruction;
		const next = instructions[i + 1];
		const eOrd = next?.ordinal ?? sOrd;
		if (start === end) {
			return [
				{
					coordinates: lngLatToWorldCoord(originPoint, coordinates[start], eOrd * 100),
					identifier: "end"
				}
			]
		}
		const interpAltitude = interpolate(sOrd * 100, eOrd * 100);
		const cCnt = end - start;
		const worldCoordPoints = isConnector(sign)
			? [
				{
					coordinates: lngLatToWorldCoord(originPoint, coordinates[end], sOrd * 100),
					identifier: "connector"
				},
				{
					coordinates: lngLatToWorldCoord(originPoint, coordinates[end], eOrd * 100),
					identifier: "connector"
				}
			]
			: coordinates
				.slice(start, end + 1)
				.map((c, j) => ({
					coordinates: lngLatToWorldCoord(originPoint, c, interpAltitude(j / cCnt)),
					identifier: "path"
				}));
		const distance = calcDistance(worldCoordPoints);
		const splitCount = Math.floor(distance / 20);
		
		return _.flatMap(worldCoordPoints, ({coordinates, identifier}, j) => {
			const nextCoord = worldCoordPoints[j + 1]?.coordinates;
			if (!nextCoord) {
				return i === instructions.length - 1 ? [coordinates] : [];
			}
			const interpVec = interpolateArray(coordinates, nextCoord);
			return _.times(splitCount, (k) => {
				return {
					coordinates: interpVec(k / splitCount).slice(),
					identifier
				}
			});
		})
	})
}

function isConnector(sign) {
	return sign === 100 || sign === -100;
}

// 将莫卡托坐标([x(E), y(N), z(UP)])转换为世界坐标([x(E), y(UP), z(VIEWER)])
// 莫卡托坐标 rotateX(Math.PI/2) 转换为世界坐标
function lngLatToWorldCoord(origin, lngLat, altitude) {
	const mercator = maplibregl.MercatorCoordinate.fromLngLat(lngLat, altitude);
	const unit = 1.0 / mercator.meterInMercatorCoordinateUnits(); // 单位长度, 1米在莫卡托坐标系中的长度
	return [
		(mercator.x - origin.x) * unit,
		(mercator.z - origin.z) * unit,
		-(mercator.y - origin.y) * unit
	]
}

function calcDistance(worldCoordPoints) {
	return worldCoordPoints.reduce((acc, {coordinates}, i) => {
		const nextCoord = worldCoordPoints[i + 1]?.coordinates;
		if (!nextCoord) return acc;
		const [x1, y1, z1] = coordinates;
		const [x2, y2, z2] = nextCoord;
		return acc + Math.sqrt(
			Math.pow(x2 - x1, 2) +
			Math.pow(y2 - y1, 2) +
			Math.pow(z2 - z1, 2)
		);
	}, 0);
}
