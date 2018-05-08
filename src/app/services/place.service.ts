import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Location } from '../interfaces/location'

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  baseUrl = 'https://us-central1-mongodb-api.cloudfunctions.net/api/places/'
  constructor(private http: HttpClient) {}

  getAll(): Observable<Location[]> {
    return this.http.get<Location[]>(this.baseUrl)
  }

  getByName(name: string): Observable<Location> {
    return this.http.get<Location>(this.baseUrl + name)
  }
}
