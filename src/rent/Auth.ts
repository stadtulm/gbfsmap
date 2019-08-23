declare var AUTH_USER

export class Auth {
	public static fetch(url, options?: any) {
		let headers = new Headers();
		if (options && options.headers){
			headers = new Headers(options.headers);
		}
		let token = this.getAuth()
		headers.append('Authorization', 'Token ' + token)
		if (!options) {
			options = {}
		}
		Object.assign(options, {
			credentials: 'include',
			mode: 'cors',
		})
		Object.assign(options, {headers: headers})
		return fetch(url, options).then(res => res.json())
	}

	public static getAuth() {
		return localStorage.getItem("auth")
	}

	public static hasAuth() {
		return new Promise<boolean>((resolve, reject)=>{
			let token = this.getAuth()
			let inParams = false
			if (!token) {
				let params = new URLSearchParams(window.location.search)
				if (params.has("token")) {
					inParams = true
					token = params.get("token")
				}
			}
			if (token) {
				localStorage.setItem("auth", token)
				Auth.fetch(AUTH_USER).then(data => {
					if (data.pk) {
						console.log('logged in')
						if (inParams) {
							window.location.search = ""
						}
						resolve(true)
					} else {
						console.log('not logged in')
						this.removeAuth()
						resolve(false)
					}
				})
			} else {
				resolve(false)
			}
		})
	}

	public static removeAuth() {
		localStorage.removeItem("auth")
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