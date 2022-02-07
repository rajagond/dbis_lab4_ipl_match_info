import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class MatchDetailsService {

  private API_SERVER = "http://localhost:3000/matches/match_info/";

  private API_SERVER_TEAM = "http://localhost:3000/matches/";

  private API_SERVER_SUM = "http://localhost:3000/matches/match_summary/";
  private API_SERVER_COMP = "http://localhost:3000/matches/cumulative_run/";

  constructor(private http: HttpClient) { }

  public getData(link: string): Observable<any> {
    return this.http.get<any>(this.API_SERVER + link).pipe(retry(1), catchError(this.handleError));
  }

  public getInningTeamData(link: string): Observable<any> {
    return this.http.get<any>(this.API_SERVER_TEAM + link).pipe(retry(1), catchError(this.handleError));
  }

  public getInnData(link: string): Observable<any> {
    return this.http.get<any>(this.API_SERVER_SUM + link).pipe(retry(1), catchError(this.handleError));
  }


  public getOverWise(link: string): Observable<any> {
    return this.http.get<any>(this.API_SERVER_COMP + link).pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() =>
      new Error('Something bad happened; please try again later.'));
  }
}
