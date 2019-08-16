export class Auth {
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

	public static auth(service: string, code: string): Promise<IAuthConfig> {
		switch (service) {
			case "github":
				return Auth.githubAuth(code)
		}
	}

	public static githubAuth(code): Promise<IAuthConfig> {
		return new Promise<IAuthConfig>((resolve, reject)=>{
			fetch("http://localhost:8000/rest-auth/github/", {
				method: "POST",
				headers: new Headers({"Content-Type": "application/json"}),
				body: JSON.stringify({ "code": code})
			}).then(res => res.json()).then(res => {
				let auth = {
					type: EAuthType.Token,
					token: res.key
				}
				localStorage.setItem("auth", JSON.stringify(auth))
				resolve(auth)
			}).catch((err)=>{
				reject(err)
			})
		})
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