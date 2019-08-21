import * as L from "leaflet"
import '../lib/locate/L.Control.Locate.js'
import { Gbfs } from "./gbfs/Gbfs";
import { Rent } from "./rent/Rent";

declare var GBFS_URL;
declare var API_ROOT;

export class Map {
	constructor() {
		console.log("Hello Map")
		this.map = L.map("map").setView([53.03134, 13.30776], 16);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
			maxZoom: 19
		}).addTo(this.map)

		//setTimeout(()=>{
		try {
			let locate =  (<any>L).control.locate({
				position: "bottomleft",
				icon: 'icon-direction',
				iconLoading: 'icon-spin5 animate-spin',
				locateOptions : {
					watch: true,
					enableHighAccuracy: true
				}
			}).addTo(this.map);
			//locate.start()
		//}, 1000)
		} catch (err) {
			console.log("err", err)
		}
		

		this.initGbfs().then(()=>{
			this.renderGbfs()
			let bounds = L.featureGroup([this.stationLayer, this.bikeLayer]).getBounds()
			
			//TODO temporary deactiveated for camp
			//this.map.fitBounds(bounds)
			
			setInterval(()=>{
				Promise.all([
					this.gbfs.loadStationStatus(),
					this.gbfs.loadFreeBikeStatus()
				]).then(()=>{
					this.renderGbfs()
				}).catch()
			}, 1000 * 60)
			setInterval(()=>{
				this.gbfs.loadStations()
			}, 1000 * 60 * 5)
		}).catch(err=>{
			console.warn("Error laoding GBFS:", err)
		})

		this.initRentUI()
	}

	protected initGbfs() {
		//this.gbfs = new Gbfs("https://staging.ulm.dev/gbfs/examplesheet/gbfs.json")
		this.gbfs = new Gbfs(GBFS_URL)
		return this.gbfs.ready
	}

	protected initRentUI() {
		new Rent(API_ROOT, this.map)
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

		if (this.bikeLayer) {
			this.bikeLayer.clearLayers()
		} else {
			this.bikeLayer = L.geoJSON(null, {
				filter: (feature => !feature.properties.is_disabled),
				pointToLayer: (feature, latlng) => {
					let icon = new L.Icon({
						iconSize: [32, 32],
						popupAnchor: [0, -20],
						iconUrl: "./img/bike_icon.png"
					})
					let marker = new L.Marker(latlng, {
						icon: icon
					})
					marker.bindPopup(`Bike <b>${feature.properties['bike_id']}</b>`)
					return marker
				}
			}).addTo(this.map)
		}
		this.bikeLayer.addData(<GeoJSON.GeoJsonObject>this.gbfs.getBikeGeoJson())
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
	protected bikeLayer: L.GeoJSON
}
