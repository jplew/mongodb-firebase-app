import { Component, OnInit } from '@angular/core'
import { tap, catchError, map, filter, toArray } from 'rxjs/operators'
import { Subject, of, Observable } from 'rxjs'
import { PlaceService } from './services/place.service'
import { Place } from './interfaces/place'
import { isArray } from './helpers/isArray'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  placesForDropdown$: Observable<Place[]>
  placesSource = new Subject<Place[] | Place>()
  places$: Observable<Place[] | Place> = this.placesSource.asObservable()

  places: Place[] | Place

  // places$: Observable<Place[] | Place>
  place$: Observable<Place>

  loadingError$ = new Subject<string>()

  constructor(private placeService: PlaceService) {
    this.placesForDropdown$ = this.placeService.getAll()
    this.placeService.getAll().subscribe(next => {
      this.placesSource.next(next)
    })
  }

  updateFromSearch(query) {
    this.placeService
      .getAll()
      .pipe(
        catchError(error => {
          console.log(error)
          this.loadingError$.next(error)
          return of()
        }),
        map((locations: Place[]) => {
          return locations.filter(
            (location: Place) =>
              location.locationName
                .toLowerCase()
                .indexOf(query.toLowerCase()) !== -1
          )
        })
        // filter((result: Place[] | Place) => {
        //   if (isArray(result) && result.length === 0) {
        //     console.log('no matches for:', query)
        //     this.loadingError$.next(query)
        //     return false
        //   } else {
        //     return true
        //   }
        // })
        // tap(next => {
        //   console.log('next', next)
        //   this.placesSource.next(next)
        // })
      )
      .subscribe(next => {
        console.log('next', next)
        if (!next.length) {
          // this.handleError(new Error('No hits, sadly.'))
          this.loadingError$.next('No hits, sadly.')
          this.places$ = null
        } else {
          this.placesSource.next(next)
        }
      })
  }

  updateFromSelect(query) {
    console.log('app comp update selected', query)

    if (!query) {
      this.placeService.getAll().subscribe(next => {
        this.placesSource.next(next)
      })
    } else {
      this.placeService
        .getByName(query)
        .pipe(toArray())
        .subscribe(next => {
          this.placesSource.next(next)
        })
    }
  }

  updateFromSave(query) {
    this.placeService.getAll().subscribe(next => {
      this.placesSource.next(next)
    })

    // this.placesSource.next(this.placeService.getAll())
  }
}
