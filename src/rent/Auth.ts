export class AuthFetch {
	public static fetch(url, auth: IAuthConfig, options?: any) {
		let headers = new Headers();
		if (auth.type == EAuthType.Basic) {
			headers.append('Authorization', 'Basic ' + btoa(auth.username + ':' + auth.password))
		}
		if (!options) {
			options = {}
		}
		Object.assign(options, {headers: headers})
		return fetch(url, options).then(res => res.json())
	}
}

export interface IAuthConfig {
	type: EAuthType,
	username?: string,
	password?: string
}

export enum EAuthType {
	Basic
}