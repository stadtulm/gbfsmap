export class Login {
	constructor(protected ui: HTMLElement){
		this.createUI()
	}

	protected createUI() {
		let baseHtml = `
			<div class="social-login">
				<a href="https://github.com/login/oauth/authorize?client_id=87e39bc9cbf04dfe3be9">Github</a>
				<a href="https://stackoverflow.com/oauth?client_id=16007&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%3Fauthservice%3Dstackexchange">Stackoverflow</a>
			</div>
		`
		this.ui.innerHTML = baseHtml
	}
}