import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable, Observer, Subject } from 'rxjs'
import { Place } from '../interfaces/place'

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {
  @Input() state
  @Input() placesSubject: Subject<string>
  @Input() places$: Observable<Place[] | Place>
  @Input() loadingError$: Observable<string>
  @Output() toggleSortOrder = new EventEmitter<boolean>()
  @Output() editRecord = new EventEmitter<Place>()
  @Output() deleteRecord = new EventEmitter<Place>()

  select = new FormControl()
  search = new FormControl()

  constructor() {}

  ngOnInit() {
    this.listenToFormEvents()
  }

  listenToFormEvents() {
    this.select.valueChanges.subscribe(this.placesSubject)
    this.search.valueChanges.subscribe(this.placesSubject)
  }

  onSortClick(event) {
    this.toggleSortOrder.emit(this.state.sortDescending)
  }

  editLocation(place: Place) {
    try {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    } catch (e) {
      window.scrollTo(0, 0)
    }
    this.editRecord.emit(place)
  }

  deleteLocation(place: Place) {
    this.deleteRecord.emit(place)
  }
}
