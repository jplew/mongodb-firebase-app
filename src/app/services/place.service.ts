import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Place } from '../interfaces/place'
@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  baseUrl = 'https://us-central1-mongodb-api.cloudfunctions.net/api/places/'
  constructor(private http: HttpClient) {}

  getAll(): Observable<Place[]> {
    return this.http.get<Place[]>(this.baseUrl)
  }

  getByName(name: string): Observable<Place> {
    return this.http.get<Place>(this.baseUrl + name)
  }
}
