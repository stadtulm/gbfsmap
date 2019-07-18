import * as L from "leaflet"
import { Gbfs } from "./gbfs/Gbfs";

export class Map {
	constructor() {
		console.log("Hello Map")
		this.map = L.map("map").setView([51.505, -0.09], 13);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
			maxZoom: 19
		}).addTo(this.map)

		this.initGbfs().then(()=>{
			this.renderGbfs()
			this.map.fitBounds(this.stationLayer.getBounds())
			
			setInterval(()=>{
				this.gbfs.loadStationStatus().then(()=>{
					this.renderGbfs()
				}).catch()
			}, 1000 * 120)
		}).catch(err=>{
			console.warn("Error laoding GBFS:", err)
		})
	}

	protected initGbfs() {
		this.gbfs = new Gbfs("http://ubahndepot.com/applications/opendata/demo_gbfs/camp/gbfs.json")
		return this.gbfs.ready
	}

	protected renderGbfs() {
		if (this.stationLayer) {
			this.stationLayer.clearLayers()
		} else {
			this.stationLayer = L.geoJSON(null, {
				filter: (feature => feature.properties.is_installed) //remove inactive stations
			}).addTo(this.map)
		}
		this.stationLayer.addData(<GeoJSON.GeoJsonObject>this.gbfs.getGeoJson())
	}

	protected gbfs: Gbfs
	protected map: L.Map
	protected stationLayer: L.GeoJSON
}