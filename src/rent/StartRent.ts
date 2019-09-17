import { Auth } from "./Auth";
import { CurrentRent } from "./CurrentRent";

export class StartRent {
	constructor(protected apiEndpoint: string, protected rentUI: HTMLElement, protected currentRents: CurrentRent) {
		this.renderUI()
	}
	public renderUI() {
		this.rentUI.innerHTML = `
			<div class="startrent">
				<div class="startrent-number-label">Enter Bike Number</div>
				<input type="text" id="bike-number-input" class="startrent-number-input" />
			</div>
		`
		let button = document.createElement('div')
		button.innerHTML = "Start Rent"
		button.className = "start-rent-button"
		button.onclick = ()=>{this.startRent()}
		this.rentUI.appendChild(button)
	}

	public startRent() {
		let bike_number = (<any>document.querySelector("#bike-number-input")).value;
		
		navigator.geolocation.getCurrentPosition((location) => {
			console.log(location)
			this.submitStartRent(bike_number, location.coords)
		}, (err)=> {
			console.log(err)
			this.submitStartRent(bike_number)
		}, {
			timeout: 3000,
			enableHighAccuracy: true,
			maximumAge: 20000
		})
	}

	private submitStartRent(bikeNumber: string, location?: Coordinates) {
		let url = this.apiEndpoint + "/rent/start"
		let data = {
			bike_number: bikeNumber
		}
		//TODO mindestgenauigkeit erhöhen
		if (location && location.accuracy < 20){
			data['lat'] = location.latitude
			data['lng'] = location.longitude
		}
		Auth.fetch(url, {
			body: JSON.stringify(data),
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			}
		}).then(res => {
			if (res.success == true) {
				let key = res.unlock_key
				if (key) {
					alert("Your unlock key is: " + key)
				}
				this.renderUI()
				this.currentRents.loadRents()
			} else {
				alert("Error: " + (res.detail || res.error))
			}
		}).catch(err => {
			console.log(err)
			alert(err)
		})
	}
	
}