import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { MatchInfo } from '../interfaces/match-info';

@Injectable({
  providedIn: 'root'
})


export class MatchesinfoService {

  private API_SERVER = "http://localhost:3000/matches";

  constructor(private http: HttpClient) { }

  public getData(): Observable<MatchInfo[]> {
    return this.http.get<MatchInfo[]>(this.API_SERVER).pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      return throwError(() =>
        new Error('something bad happened on your side.'));
    } else {
      return throwError(() =>
        new Error('Unable to get initial value from server.'));
    }
  }
}
