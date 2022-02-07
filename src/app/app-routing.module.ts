import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatchesComponent } from './matches/matches.component';
import { MatchDetailsComponent } from './match-details/match-details.component';
import { PointstableComponent } from './pointstable/pointstable.component';
import { VenuesComponent } from './venues/venues.component';
import { VenueDetailsComponent } from './venue-details/venue-details.component';
import { AddComponent } from './venues/add/add.component';
import { HomeComponent } from './home/home.component';
import { PlayerInfoComponent } from './player-info/player-info.component';

const routes: Routes = [
  { path: 'matches/:match_id', component: MatchDetailsComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'pointstable/:year', component: PointstableComponent },
  { path: 'players/:player_id', component: PlayerInfoComponent },
  { path: 'venues/add', component: AddComponent },
  { path: 'venues', component: VenuesComponent },
  { path: 'venue/:venue_id', component: VenueDetailsComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
