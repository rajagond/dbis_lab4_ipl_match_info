import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PlayerInfoService {

  private API_SERVER = "http://localhost:3000/players/";

  constructor(private http: HttpClient) { }

  public getData(link: string): Observable<any> {
    return this.http.get<any>(this.API_SERVER + link).pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() =>
      new Error('Something bad happened; please try again later.'));
  }
}
