import { AuthFetch, EAuthType, IAuthConfig } from "./Auth";

export class CurrentRent {
	constructor(protected apiEndpoint: string, protected auth: IAuthConfig) {
		this.loadRents()
	}

	public loadRents() {

		let url = this.apiEndpoint + "/rent/current"
		//fetch(url).then(res => res.json())
		AuthFetch.fetch(url, this.auth)
		.then(json => {
			console.log(json)
		}).catch(err => {
			console.log(err)
		})
	}
}