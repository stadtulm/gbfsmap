import { AuthFetch, EAuthType, IAuthConfig } from "./Auth";

export class CurrentRent {
	constructor(protected apiEndpoint: string, protected auth: IAuthConfig, protected rentUI: HTMLElement) {
		this.loadRents()
	}

	public loadRents() {

		let url = this.apiEndpoint + "/rent/current"
		//fetch(url).then(res => res.json())
		AuthFetch.fetch(url, this.auth)
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
				<div class="rent-row-key">
					<div class="rent-row-description">
						Unlock Key
					</div>
					<div class="rent-row-key-value">
						${rent.bike.lock.unlock_key}
					</div>
				</div>
			`
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

	protected returnRide(id) {
		console.log(id)
	}

	protected rents: IRent[]
}

interface IRent {
	bike: {
		bike_number: string,
		lock: {
			unlock_key: string
		}
	}, 
	id: number,
	rent_start: string
}