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
			setInterval(()=>{
				this.renderGbfs()
			}, 1000 * 120)
		}).catch(err=>{
			console.warn("Error laoding GBFS:", err)
		})
	}

	protected initGbfs() {
		this.gbfs = new Gbfs("")
		return this.gbfs.ready
	}

	protected renderGbfs() {

	}

	protected gbfs: Gbfs
	protected map: L.Map
}