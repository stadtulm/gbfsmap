import * as L from "leaflet"
import { StartRent } from "./StartRent";
import { CurrentRent } from "./CurrentRent";
import { IAuthConfig, EAuthType } from "./Auth";

export class Rent {
	constructor(protected ApiEndpoint: string, protected map: L.Map){
		this.createRentUi()
		let auth: IAuthConfig = {
			type: EAuthType.Basic,
			username: "",
			password: ""
		}
		new StartRent(this.ApiEndpoint, auth)
		new CurrentRent(this.ApiEndpoint, auth)
	}

	protected createRentUi() {
		let rentControll = L.Control.extend({
			onAdd: (map) => {
				var div = L.DomUtil.create('div');
				div.innerHTML = 'Rent';
				div.id = "rentmapcontrol"
				div.onclick = () => { this.toggleUI() }

				this.rentUI = document.createElement('div');
				this.rentUI.innerHTML = "UI"
				this.rentUI.id = "rentui"
				document.body.appendChild(this.rentUI)
				this.rentUI.style.display = "none"
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
}