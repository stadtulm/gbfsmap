declare var GITHUB_CLIENT_ID, STACKOVERFLOW_CLIENT_ID, UI_SYSTEM_URL

export class Login {
	constructor(protected ui: HTMLElement){
		this.createUI()
	}

	protected createUI() {
		let baseHtml = `
			<div class="social-login">
				<div class="social-login-description">Login with</div>
				<div class="social-login-buttonbox">
					<a class="social-login-service" href="https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}">
						<img src="/img/octocat.jpg"><br>
						
					</a>
					<a class="social-login-service" href="https://stackoverflow.com/oauth?client_id=${STACKOVERFLOW_CLIENT_ID}&redirect_uri=${encodeURIComponent(UI_SYSTEM_URL + "/?authservice=stackexchange")}">
						<img src="/img/so-icon.png"><br>
						
					</a>
				</div>
			</div>
		`
		this.ui.innerHTML = baseHtml
	}
}