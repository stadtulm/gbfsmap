export class AuthFetch {
	public static fetch(url, auth: IAuthConfig, options?: any) {
		let headers = new Headers();
		if (options && options.headers){
			headers = new Headers(options.headers);
		}
		if (auth.type == EAuthType.Basic) {
			headers.append('Authorization', 'Basic ' + btoa(auth.username + ':' + auth.password))
		}
		if (auth.type == EAuthType.Token) {
			headers.append('Authorization', 'Token ' + auth.token)
		}
		if (!options) {
			options = {}
		}
		/*if (options.headers) {
			Object.assign(headers, options.headers)
			console.log("headers!!!", headers)
		}*/
		Object.assign(options, {headers: headers})
		return fetch(url, options).then(res => res.json())
	}
}

export interface IAuthConfig {
	type: EAuthType,
	username?: string,
	password?: string,
	token?: string
}

export enum EAuthType {
	Basic,
	Token
}