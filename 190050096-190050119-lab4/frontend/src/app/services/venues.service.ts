import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Venues } from '../interfaces/venues';

@Injectable({
  providedIn: 'root'
})
export class VenuesService {

  constructor(private httpClient: HttpClient) { }

  private basicUrl = 'http://localhost:3000/venues';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  public getVenues(): Observable<Venues[]> {
    return this.httpClient.get<Venues[]>(this.basicUrl)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      return throwError( () =>
      new Error('Something bad happened; please try again later.'));
  }
}
