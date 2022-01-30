import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { MatchInfo } from './interfaces/match-info';

@Injectable({
  providedIn: 'root'
})

  
export class MatchesinfoService {

  private API_SERVER = "http://localhost:3000/match";

  constructor(private http: HttpClient) { }

  public getData(skip: any, limit: any):Observable <MatchInfo[]>{
    let queryParams = new HttpParams().append("skip",skip).append("limit",limit);
    return this.http.get<MatchInfo[]>(this.API_SERVER,{params:queryParams});
  }
  postData(userData: any) {
    return this.http.post<any>('https://cs251-outlab-6.herokuapp.com/add_new_feedback/',userData)
                    .pipe(
                      retry(1),
                      catchError(this.handleError)
                    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
     // alert('Some network error occured on your side');
     console.error('An error occurred:', error.error.message);
     return throwError(
        'Unable to get initial form value ; something bad happened on your side.');
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
       return throwError(
        'Unable to get initial form value from server.');
    }
    // Return an observable with a user-facing error message
  }
}
