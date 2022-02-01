export interface MatchInfo {
    match_id: Number;
    season_year: Number;  
    team1: String;  
    team2: String;  
    winner: String;  
    win_type: String;  
    win_margin: Number;  
    venue_name: String;
    city_name: String;  
}

export interface BatterInfo {
    Batter: String;  
    runs: Number;  
    fours: Number;  
    sixes: Number;
}
