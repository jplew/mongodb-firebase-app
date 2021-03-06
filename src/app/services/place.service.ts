import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Place } from '../interfaces/place';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  baseUrl = environment.placesApiUrl;

  currentRecord: Place;

  httpOptions = {
    // headers: new HttpHeaders({
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<Place[]> {
    return this.http.get<Place[]>(this.baseUrl);
  }

  getByName(name: string): Observable<Place> {
    return this.http.get<Place>(this.baseUrl + name);
  }

  createLocation(place: Place): Observable<Place> {
    this.currentRecord = place;
    console.log('sending post request to server');
    // return of(place)
    return this.http
      .post<Place>(this.baseUrl, place, this.httpOptions)
      .pipe(catchError((error) => this.handleError(error)));
  }

  updateLocation(place: Place): Observable<Place> {
    this.currentRecord = place;
    console.log('sending put request to server', place);
    // return of(place)
    return this.http
      .put<Place>(this.baseUrl + place.locationName, place, this.httpOptions)
      .pipe(catchError((error) => this.handleError(error)));
  }

  deleteLocation(place: Place): Observable<{}> {
    console.log('sending post request to server', place);

    return this.http
      .delete<Place>(this.baseUrl + place.locationName, this.httpOptions)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      if (error.error.indexOf('E11000') > -1) {
        return this.createLocation(this.currentRecord);
      }
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
