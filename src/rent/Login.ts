export class Login {
	constructor(protected ui: HTMLElement){
		this.createUI()
	}

	protected createUI() {
		let baseHtml = `
			<div class="social-login">
				<div class="social-login-description">Login with</div>
				<div class="social-login-buttonbox">
					<a class="social-login-service" href="https://github.com/login/oauth/authorize?client_id=87e39bc9cbf04dfe3be9">
						<img src="/img/octocat.jpg"><br>
						
					</a>
					<a class="social-login-service" href="https://stackoverflow.com/oauth?client_id=16007&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%3Fauthservice%3Dstackexchange">
						<img src="/img/so-icon.png"><br>
						
					</a>
				</div>
			</div>
		`
		this.ui.innerHTML = baseHtml
	}
}