export interface Venues {
    venue_id: number;
    venue_name: string;
    city_name: string;
    country_name: string;
}
/*
export interface Basic {
    venue_name: string;
    city_name: string;
    country_name: string;
    capacity: string;
}
export interface Basics extends Array<Basic>{}

export interface Runs_chased {
    runs_chased: number;
}
export interface Runs_chaseds extends Array<Runs_chased>{}

export interface Match_high_low {
    num_matches: number;
    high: number;
    low: number;
}
export interface Match_high_lows extends Array<Match_high_low>{}

export interface VenueDetails {
    basic: Basics;
    match_high_low: Match_high_lows;
    runs_chased: Runs_chaseds;
}
*/
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