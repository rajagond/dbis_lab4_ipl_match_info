import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { VenueDetails, Venueline, Venuepie } from '../interfaces/venues';

@Injectable({
  providedIn: 'root'
})
export class VenueDetailsService {
  constructor(private httpClient: HttpClient) { }

  private basicUrl = 'http://localhost:3000/venues/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  public getBasicDetails(venue_id: string): Observable<VenueDetails[]> {
    return this.httpClient.get<VenueDetails[]>(this.basicUrl + venue_id + '/basic')
      .pipe(
        catchError(this.handleError)
      );
  }

  public getGraphDetails(venue_id: string): Observable<Venuepie[]> {
    return this.httpClient.get<Venuepie[]>(this.basicUrl + venue_id + '/pie_chart')
      .pipe(
        catchError(this.handleError)
      );
  }
  public getLineGraphDetails(venue_id: string): Observable<Venueline[]> {
    return this.httpClient.get<Venueline[]>(this.basicUrl + venue_id + '/graph')
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError( () =>
  new Error('Something bad happened; please try again later.'));
  }

}
