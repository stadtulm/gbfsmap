export interface IFreeBikeStatus {
	bikes: {
		bike_id: string,
		lat: number,
		lon: number,
		is_reserved: boolean,
		is_disabled: boolean
	}[]
}