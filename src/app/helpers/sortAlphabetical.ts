import { Place } from '../interfaces/place'
import { Observable } from 'rxjs'

export const sortAlphabetical = (sortDescending: boolean) => (
  source: Observable<Place[]>
) =>
  new Observable<Place[]>(observer => {
    return source.subscribe({
      next(x) {
        const sortedLocations = x.sort((a: Place, b: Place) => {
          const nameA = a.locationName.toLowerCase()
          const nameB = b.locationName.toLowerCase()

          if (nameA < nameB) {
            return sortDescending ? -1 : 1
          }
          if (nameA > nameB) {
            return sortDescending ? 1 : -1
          }
          return 0
        })

        observer.next(sortedLocations)
      },
      error(err) {
        observer.error(err)
      },
      complete() {
        observer.complete()
      }
    })
  })
