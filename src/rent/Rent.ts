import * as L from "leaflet"
import { StartRent } from "./StartRent";
import { CurrentRent } from "./CurrentRent";
import { IAuthConfig, EAuthType } from "./Auth";

export class Rent {
	constructor(protected ApiEndpoint: string, protected map: L.Map){
		this.createRentUi()
		
		let auth = JSON.parse(localStorage.getItem("auth"))

		let params = new URLSearchParams(window.location.search)
		if (params.has("authservice") && params.has("code")){
			let code = params.get("code")
			//let authservice = params.get("authservice")
			fetch("http://localhost:8000/rest-auth/github/", {
				method: "POST",
				headers: new Headers({"Content-Type": "application/json"}),
				body: JSON.stringify({ "code": code})
			}).then(res => res.json()).then(res => {
				auth = {
					type: EAuthType.Token,
					token: res.key
				}
				localStorage.setItem("auth", JSON.stringify(auth))
				window.location.search = ""

				let currentRents = new CurrentRent(this.ApiEndpoint, auth, this.rentListUI)
				new StartRent(this.ApiEndpoint, auth, this.rentStartUI, currentRents)
			})
		}

		if (auth) {
			let currentRents = new CurrentRent(this.ApiEndpoint, auth, this.rentListUI)
			new StartRent(this.ApiEndpoint, auth, this.rentStartUI, currentRents)
		} else {
			console.log("not logged in")
		}
	}

	protected createRentUi() {
		let rentControll = L.Control.extend({
			onAdd: (map) => {
				var div = L.DomUtil.create('div');
				div.innerHTML = 'Rent';
				div.id = "rentmapcontrol"
				div.onclick = () => { this.toggleUI() }

				this.rentUI = document.createElement('div');
				this.rentUI.id = "rentui"
				document.body.appendChild(this.rentUI)
				this.rentUI.style.display = "none"

				this.rentListUI = document.createElement('div');
				this.rentListUI.id = "rentlistui"
				this.rentUI.appendChild(this.rentListUI)

				this.rentStartUI = document.createElement('div');
				this.rentStartUI.id = "rentstartui"
				this.rentUI.appendChild(this.rentStartUI)

				return div;
			}
		});
		new rentControll({ position: 'topright' }).addTo(this.map);
	}

	protected toggleUI() {
		this.isUiVisible = !this.isUiVisible
		this.rentUI.style.display = this.isUiVisible ? "block" : "none"
	}

	protected isUiVisible = false
	protected rentUI: HTMLElement
	protected rentListUI: HTMLElement
	protected rentStartUI: HTMLElement
}