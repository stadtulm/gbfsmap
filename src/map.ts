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
				filter: (feature => feature.properties.is_installed), //hide inactive stations
				onEachFeature: (feature, layer) => {
					layer.bindPopup(this.getLabelText(feature))
				},
				pointToLayer: (feature, latlng) => {
					let icon = new L.DivIcon({
						html: this.getIconHtml(feature.properties.num_bikes_available, feature.properties.num_docks_available),
						bgPos: [10, 10],
						iconSize: [20, 20],
						popupAnchor: [0, -15],
						className: "bike-icon"
					})
					return new L.Marker(latlng, {
						icon: icon
					})
				}
			}).addTo(this.map)
		}
		this.stationLayer.addData(<GeoJSON.GeoJsonObject>this.gbfs.getGeoJson())
	}

	protected getLabelText(feature) {
		return `<b>${feature.properties.name}</b><br>Bikes: ${feature.properties.num_bikes_available}`
	}

	protected getIconHtml(bikes: number, docks: number) {
		let cssClass = "bike-icon-inner"
		if (bikes == 0) {
			cssClass += " bike-icon-empty"
		}
		return `
		<div class="${cssClass}">${bikes}</div>
		`
	}

	protected gbfs: Gbfs
	protected map: L.Map
	protected stationLayer: L.GeoJSON
}