import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AddVenue } from '../interfaces/venues';

@Injectable({
  providedIn: 'root'
})
export class VenueaddService {
  baseURL: string = "http://localhost:3000/venues/add";

  constructor(private http: HttpClient) { }
  public addVenue(venue: AddVenue): Observable<any> {

    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(venue);
    return this.http.post(this.baseURL, body,{'headers':headers}).pipe(
    catchError(this.handleError) // then handle the error
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
