import { Auth } from "./Auth";

export class CurrentRent {
	constructor(protected apiEndpoint: string, protected rentUI: HTMLElement) {
		this.loadRents()
	}

	public loadRents() {

		let url = this.apiEndpoint + "/rent/current"
		Auth.fetch(url)
		.then(json => {
			console.log(json)
			this.rents = json
			this.renderRents()
		}).catch(err => {
			console.log(err)
		})
	}

	public renderRents() {
		this.rentUI.innerHTML = ""
		this.rents.forEach(rent => {
			let row = document.createElement('div')
			row.className = "rent-row"
			row.innerHTML = `
				<div class="rent-row-bike">
					<div class="rent-row-description">
						Bike Number
					</div>
					<div class="rent-row-bike-value">
						${rent.bike.bike_number}
					</div>
				</div>
			`;
			if (rent.bike.lock) {
				row.innerHTML += `	
					<div class="rent-row-key">
						<div class="rent-row-description">
							Unlock Key
						</div>
						<div class="rent-row-key-value">
							${rent.bike.lock.unlock_key}
						</div>
					</div>
				`;
			}
			let button = document.createElement('button')
			button.className = "rent-row-return-button"
			button.innerHTML = "finish ride"
			button.onclick = () => {
				this.returnRide(rent.id)
			}
			row.appendChild(button)
			this.rentUI.appendChild(row)
		})
	}

	protected returnRide(rideId) {
		navigator.geolocation.getCurrentPosition((location) => {
			console.log(location)
			this.submitReturnRide(rideId, location.coords)
		}, (err)=> {
			console.log(err)
			this.submitReturnRide(rideId)
		}, {
			timeout: 3000,
			enableHighAccuracy: true,
			maximumAge: 20000
		})
	}

	protected submitReturnRide(rideId: number, location?: Coordinates) {
		let data = {
			rent_id: rideId
		}
		//TODO mindestgenauigkeit erhöhen
		if (location && location.accuracy < 20){
			data['lat'] = location.latitude
			data['lng'] = location.longitude
		}
		let url = this.apiEndpoint + "/rent/finish"
		Auth.fetch(url, {
			body: JSON.stringify(data),
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			}
		}).then(res => {
			this.loadRents()
			if (res.success == true){
				alert("Successfully returned, please lock the bike")
			} else {
				alert("Error: " + (res.detail || res.error))
			}
		}).catch(err => {
			this.loadRents()
			console.log(err)
			alert(err)
		})
	}

	protected rents: IRent[]
}

interface IRent {
	bike: {
		bike_number: string,
		lock?: {
			unlock_key: string
		}
	}, 
	id: number,
	rent_start: string
}