import * as L from "leaflet"
import { StartRent } from "./StartRent";
import { CurrentRent } from "./CurrentRent";
import { Login } from "./Login";
import { IAuthConfig, EAuthType, Auth } from "./Auth";

export class Rent {
	constructor(protected ApiEndpoint: string, protected map: L.Map){
		let params = new URLSearchParams(window.location.search)
		if (params.has("authservice") && params.has("code")){
			let code = params.get("code")
			let authservice = params.get("authservice")
			Auth.auth(authservice, code).then((auth)=>{
				//localStorage.setItem("auth", JSON.stringify(auth))
				window.location.search = ""
				this.createRentUi()
				let currentRents = new CurrentRent(this.ApiEndpoint, auth, this.rentListUI)
				new StartRent(this.ApiEndpoint, auth, this.rentStartUI, currentRents)
			}).catch((err)=>{
				alert("Auth failed" + err)
			})
		}

		if (Auth.hasAuth()){
			this.createRentUi()
			let auth = Auth.getAuth()
			let currentRents = new CurrentRent(this.ApiEndpoint, auth, this.rentListUI)
			new StartRent(this.ApiEndpoint, auth, this.rentStartUI, currentRents)
		} else {
			this.createLoginUi()
		}
		
	}

	protected createRentUi() {
		let rentControll = L.Control.extend({
			onAdd: (map) => {
				var div = L.DomUtil.create('div');
				div.innerHTML = 'Rent';
				div.id = "rentmapcontrol"
				div.className = "custommapcontrol"
				div.onclick = () => { this.toggleUI() }

				this.rentUI = document.createElement('div');
				this.rentUI.id = "rentui"
				this.rentUI.className = "rentwindow"
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

	protected createLoginUi() {
		let loginControl = L.Control.extend({
			onAdd: (map) => {
				var div = L.DomUtil.create('div');
				div.innerHTML = 'Login';
				div.id = "loginmapcontrol"
				div.className = "custommapcontrol"
				div.onclick = () => { this.toggleLogin() }

				this.loginUI = document.createElement('div');
				this.loginUI.id = "loginui"
				this.loginUI.className = "rentwindow"
				document.body.appendChild(this.loginUI)
				this.loginUI.style.display = "none"
				new Login(this.loginUI)

				return div;
			}
		});
		new loginControl({ position: 'topright' }).addTo(this.map);
	}

	protected toggleUI() {
		this.isUiVisible = !this.isUiVisible
		this.rentUI.style.display = this.isUiVisible ? "block" : "none"
	}

	protected toggleLogin() {
		this.isLoginVisible = !this.isLoginVisible
		this.loginUI.style.display = this.isLoginVisible ? "block" : "none"
	}

	protected isUiVisible = false
	protected isLoginVisible = false
	protected rentUI: HTMLElement
	protected loginUI: HTMLElement
	protected rentListUI: HTMLElement
	protected rentStartUI: HTMLElement
}