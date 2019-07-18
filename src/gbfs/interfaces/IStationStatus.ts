export interface IStationStatus {
	stations: {
		station_id: number|string,
		num_bikes_available: number,
		num_bikes_disabled?: number,
		num_docks_available: number,
		num_docks_disabled?: number,
		is_installed: boolean,
		is_renting: boolean,
		is_returning: boolean,
		last_report: number
	}[]
}