import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatchesComponent } from './matches/matches.component';
import { MatchDetailsComponent } from './match-details/match-details.component';
import { PointstableComponent } from './pointstable/pointstable.component';
import { VenuesComponent } from './venues/venues.component';
import { VenueDetailsComponent } from './venue-details/venue-details.component';

const routes: Routes = [
  { path: 'matches/:match_id', component: MatchDetailsComponent},
  { path: 'matches', component: MatchesComponent },
  { path: 'pointstable/:year', component: PointstableComponent },
  { path: 'venues', component: VenuesComponent },
  { path: 'venue/:venue_id', component: VenueDetailsComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
