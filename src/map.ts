import * as L from "leaflet"
import { Gbfs } from "./gbfs/Gbfs";

export class Map {
	constructor() {
		console.log("Hello Map")
		this.map = L.map("map").setView([51.505, -0.09], 13);
		L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
			attribution: '<a href="https://foundation.wikimedia.org/wiki/Maps_Terms_of_Use">Wikimedia Maps</a> | Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
			maxZoom: 19
		}).addTo(this.map)

		this.initGbfs().then(()=>{
			this.renderGbfs()
			this.map.fitBounds(this.stationLayer.getBounds())
			
			setInterval(()=>{
				this.gbfs.loadStationStatus().then(()=>{
					this.renderGbfs()
				}).catch()
			}, 1000 * 60)
			setInterval(()=>{
				this.gbfs.loadStations()
			}, 1000 * 60 * 5)
		}).catch(err=>{
			console.warn("Error laoding GBFS:", err)
		})
	}

	protected initGbfs() {
		this.gbfs = new Gbfs("https://staging.ulm.dev/gbfs/examplesheet/gbfs.json")
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
						bgPos: [13, 13],
						iconSize: [26, 26],
						popupAnchor: [0, -17],
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
		let degree = bikes/(bikes+docks) * 360
		//degree = 270
		let ringCss = `
		background: ${this.bikeMarkerColor};
		background-image:
			linear-gradient(${90+degree}deg, transparent 50%, ${this.bikeMarkerBgColor} 50%),
			linear-gradient(90deg, ${this.bikeMarkerBgColor} 50%, transparent 50%);
		`
		if (degree > 180) {
			ringCss = `
			background: ${this.bikeMarkerColor};
			background-image:
				linear-gradient(${degree-90}deg, transparent 50%, ${this.bikeMarkerColor} 50%),
				linear-gradient(90deg, ${this.bikeMarkerBgColor} 50%, transparent 50%);
			`
		}
		return `
		<div class="bike-icon-ring" style="${ringCss}">
			<div class="${cssClass}">${bikes}</div>
		</div>
		`
	}

	protected bikeMarkerColor = "rgb(87, 162, 255)"
	protected bikeMarkerBgColor = "white"

	protected gbfs: Gbfs
	protected map: L.Map
	protected stationLayer: L.GeoJSON
}