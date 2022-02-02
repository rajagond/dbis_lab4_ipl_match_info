import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchesComponent } from './matches/matches.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatchDetailsComponent } from './match-details/match-details.component';
import { RouterModule } from '@angular/router';
import { PointstableComponent } from './pointstable/pointstable.component';
import { MatTabsModule } from '@angular/material/tabs';
import { VenuesComponent } from './venues/venues.component';
import { VenueDetailsComponent } from './venue-details/venue-details.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    MatchesComponent,
    MatchDetailsComponent,
    PointstableComponent,
    VenuesComponent,
    VenueDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxPaginationModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    MatTabsModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
