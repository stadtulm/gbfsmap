export class AuthFetch {
	public static fetch(url, auth: IAuthConfig) {
		let headers = new Headers();
		if (auth.type == EAuthType.Basic) {
			headers.append('Authorization', 'Basic ' + btoa(auth.username + ':' + auth.password))
		}
		return fetch(url, {headers: headers}).then(res => res.json())
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