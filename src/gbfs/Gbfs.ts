import { IStationInformation } from "./interfaces/IStationInformation";
import { IStationStatus } from "./interfaces/IStationStatus";

export class Gbfs {
	constructor (gbfsUrl: string) {
		this.gbfsRootUrl = this.getCleanRootUrl(gbfsUrl)
		
		this.ready = new Promise<void>((resolve, reject)=>{
			Promise.all([
				this.loadStations(),
				this.loadStationStatus()
			]).then(()=>{
				resolve()
			}).catch(reject)
		})
	}

	private loadStations() {
		return new Promise<void>((resolve, reject)=>{
			let url = this.gbfsRootUrl + "station_information.json"
			fetch(url).then((res)=>{
				res.json().then(json=>{
					this.stationInformation = json
					resolve()
				}).catch(reject)
			}).catch(reject)
		})
	}

	private loadStationStatus() {
		return new Promise<void>((resolve, reject)=>{
			let url = this.gbfsRootUrl + "station_status.json"
			fetch(url).then((res)=>{
				res.json().then(json=>{
					this.stationInformation = json
					resolve()
				}).catch(reject)
			}).catch(reject)
		})
	}

	/**
	 * remove gbfs.json from URL
	 * @param gbfsUrl
	 */
	protected getCleanRootUrl(gbfsUrl: string) {
		let fragments = gbfsUrl.split("/");
		if (fragments[fragments.length-1] === "gbfs.json"){
			fragments.pop()
			return fragments.join("/");
		} else {
			return gbfsUrl
		}
	}


	public ready: Promise<void>
	
	protected gbfsRootUrl: string
	protected stationInformation: IStationInformation
	protected stationStatus: IStationStatus
}