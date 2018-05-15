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
  placesSource = new BehaviorSubject<Place[] | Place>(null)
  places$: Observable<Place[] | Place> = this.placesSource.asObservable()

  placesSubject = new Subject<string>()

  selectedPlaceSource = new BehaviorSubject<Place>(null)
  selectedPlace$: Observable<Place> = this.selectedPlaceSource.asObservable()

  loadingError$ = new Subject<string>()

  state = {
    sortDescending: true
  }

  constructor(private placeService: PlaceService) {
    this.fetchAllLocations()
    this.subscribeToSearchBox()
  }

  fetchAllLocations(): void {
    this.placeService
      .getAll()
      .pipe(sortAlphabetical(this.state.sortDescending))
      .subscribe(next => {
        this.placesSource.next(next)
      })
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
            this.loadingError$.next(query)
          }
          return hits
        })
      )
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

  editRecord(place: Place) {
    this.selectedPlaceSource.next(place)
  }

  sendDeleteRequest(place: Place) {
    this.placeService.deleteLocation(place).subscribe(
      next => {
        console.log('Location deleted successfully')
        this.fetchAllLocations()
      },
      () => {
        console.log('completed')
      }
    )
  }

  sendPostRequest(body: Place) {
    this.placeService.createLocation(body).subscribe(
      createdPlace => {
        console.log('Location created successfully')
        this.fetchAllLocations()
      },
      err => {
        console.error('error', err)
      }
    )
  }

  sendPutRequest(body: Place) {
    this.placeService.updateLocation(body).subscribe(updatedPlace => {
      console.log('Location updated successfully')
      this.fetchAllLocations()
    })
  }
}
