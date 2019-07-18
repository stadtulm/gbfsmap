export interface IStationInformation {
	stations: {
		station_id: number|string,
		name: string,
		short_name?: string
		lat: number,
		lon: number,
		address?: string,
		cross_street?: string,
		region_id?: number|string,
		post_code?: string,
		rental_methods?: "KEY"|"CREDITCARD"|"PAYPASS"|"APPLEPAY"|"ANDROIDPAY"|"TRANSITCARD"|"ACCOUNTNUMBER"|"PHONE",
		capacity?: number
	}[]
}