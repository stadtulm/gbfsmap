import { IAuthConfig } from "./Auth";

export class StartRent {
	constructor(protected ApiEndpoint: string, protected auth: IAuthConfig, protected rentUI: HTMLElement) {
		
	}

	
}