import { Component, OnInit } from '@angular/core'
import { tap, catchError, map, filter, toArray } from 'rxjs/operators'
import { Subject, of, Observable } from 'rxjs'
import { PlaceService } from './services/place.service'
import { Location } from './interfaces/location'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  placesForDropdown$: Observable<Location[]>
  places$: Observable<Location[] | Location>
  place$: Observable<Location>

  loadingError$ = new Subject<string>()

  title = 'app'

  constructor(private placeService: PlaceService) {
    this.placesForDropdown$ = this.placeService.getAll()
    this.places$ = this.placeService.getAll()
  }

  updateFromSearch(query) {
    this.places$ = this.placeService.getAll().pipe(
      catchError(error => {
        console.log(error)
        this.loadingError$.next(error)
        return of()
      }),
      map((locations: Location[]) => {
        return locations.filter(
          (location: Location) =>
            location.locationName.toLowerCase().indexOf(query.toLowerCase()) !==
            -1
        )
      }),
      filter((result: Location[] | Location) => {
        if (this.isArray(result) && result.length === 0) {
          console.log('no matches for:', query)
          this.loadingError$.next(query)
          return false
        } else {
          return true
        }
      })
    )
  }

  updateFromSelect(query) {
    if (!query) {
      this.places$ = this.placeService.getAll()
    } else {
      this.places$ = this.placeService.getByName(query).pipe(toArray())
    }
  }

  isArray(location: Location[] | Location): location is Location[] {
    return (<Location[]>location).length >= 0
  }

  updateFromSave(query) {
    this.places$ = this.placeService.getAll()
  }
}
