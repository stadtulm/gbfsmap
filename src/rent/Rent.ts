import { StartRent } from "./StartRent";
import { CurrentRent } from "./CurrentRent";
import { IAuthConfig, EAuthType } from "./Auth";

export class Rent {
	constructor(protected ApiEndpoint: string){
		let auth: IAuthConfig = {
			type: EAuthType.Basic,
			username: "",
			password: ""
		}
		new StartRent(this.ApiEndpoint, auth)
		new CurrentRent(this.ApiEndpoint, auth)
	}
}