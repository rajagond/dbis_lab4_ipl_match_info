import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

  
export class MatchesDetailsService {

  private API_SERVER = "http://localhost:3000/matches/match_info/";

  constructor(private http: HttpClient) { }

  public getData(link: string):Observable <any>{
    //let queryParams = new HttpParams().append("skip",skip).append("limit",limit);
    return this.http.get<any>(this.API_SERVER + link).pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
       return 'Unable to get initial form value from server.';
    // Return an observable with a user-facing error message
  }
}
