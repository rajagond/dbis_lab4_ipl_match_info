export interface Venues {
    venue_id: number;
    venue_name: string;
    city_name: string;
    country_name: string;
}
export interface VenueDetails {
    venue_name: string;
    city_name: string;
    country_name: string;
    capacity: number;
    num_matches: number;
    high: number;
    low: number;
    runs_chased: number;
}

export interface Venuepie {
    first: number;
    second: number;
    draw: number;
}

export interface Venueline {
    season_year: string;
    avg: number;
}

export interface AddVenue {
    venue_name: string;
    city_name: string;
    country_name: string;
    capacity: number;
}