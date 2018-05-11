import { Component, OnInit } from '@angular/core'
import {
  tap,
  catchError,
  map,
  filter,
  toArray,
  shareReplay
} from 'rxjs/operators'
import { Subject, of, Observable, observable, BehaviorSubject } from 'rxjs'
import { PlaceService } from './services/place.service'
import { Place } from './interfaces/place'
import { isArray } from './helpers/isArray'
import { sortAlphabetical } from './helpers/sortAlphabetical'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  placesForDropdown$: Observable<Place[]>
  placesSource = new BehaviorSubject<Place[] | Place>(null)
  places$: Observable<Place[] | Place> = this.placesSource.asObservable()

  places: Place[] | Place

  placesSubject = new Subject<string>()

  place$: Observable<Place>

  loadingError$ = new Subject<string>()

  state = {
    sortDescending: true
  }

  constructor(private placeService: PlaceService) {
    this.placesForDropdown$ = this.placeService.getAll()
    this.placeService
      .getAll()
      .pipe(sortAlphabetical(this.state.sortDescending))
      .subscribe(next => {
        this.placesSource.next(next)
      })

    this.subscribeToSearchBox()
  }

  subscribeToSearchBox() {
    const subscription = this.placesSubject.subscribe((query: string) => {
      // this.loadingError$.next(null)

      this.places$ = this.placesSource.pipe(
        catchError(error => {
          console.log(error)
          this.loadingError$.next(error)
          return of()
        }),
        map((locations: Place[]) => {
          if (!query) {
            return locations
          }

          const hits = locations.filter(
            (location: Place) =>
              location.locationName
                .toLowerCase()
                .indexOf(query.toLowerCase()) !== -1
          )
          if (!hits.length) {
            // this.places$ = null
            this.loadingError$.next(query)
          }
          return hits
        })
      )
    })
  }

  updateFromSave(query) {
    this.placeService.getAll().subscribe(next => {
      this.placesSource.next(next)
    })
  }

  swapOrder(value: boolean) {
    this.state = {
      sortDescending: !value
    }

    this.places$ = this.places$.pipe(
      sortAlphabetical(this.state.sortDescending)
    )
  }
}
