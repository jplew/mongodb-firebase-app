import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs'
import { Place } from '../interfaces/place'

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {
  @Input() placesForDropdown$: Observable<Place[]>
  @Input() places$: Observable<Place[] | Place>
  @Output() updateSelect = new EventEmitter<string>()
  @Output() updateSearch = new EventEmitter<string>()

  select = new FormControl()
  search = new FormControl()

  constructor() {}

  ngOnInit() {
    this.listenToFormEvents()
  }

  listenToFormEvents() {
    this.select.valueChanges.forEach((query: string) => {
      // this.search.reset()
      this.updateSelect.emit(query)
    })

    this.search.valueChanges.forEach((query: string) => {
      this.select.reset()
      this.updateSearch.emit(query)
    })
  }
}
