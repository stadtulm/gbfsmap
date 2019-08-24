declare var AUTH_LOGIN, AUTH_PROVIDER

export class Login {
	constructor(protected ui: HTMLElement){
		this.createUI()
	}

	protected createUI() {
		let providerHTML = AUTH_PROVIDER.map(provider => {
			let url = AUTH_LOGIN.replace(/\{provider\}/, provider.id)
			return `<a class="social-login-service" href="${url}">
				<img src="${provider.icon}" alt="${provider.name}"><br>
			</a>
			`
		}).join('')
		let baseHtml = `
			<div class="social-login">
				<div class="social-login-description">Login with</div>
				<div class="social-login-buttonbox">
					${providerHTML}
				</div>
			</div>
		`
		this.ui.innerHTML = baseHtml
	}
}
