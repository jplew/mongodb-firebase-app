import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable, Observer, Subject } from 'rxjs'
import { Place } from '../interfaces/place'
import { isArray } from '../helpers/isArray'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  @Input() placesForDropdown$: Observable<Place[]>
  @Input() selectedPlace$: Observable<Place[] | Place>
  @Input() placesSubject: Subject<string>

  // @Input() selectedLocation$: Observable<Location>

  @Output() updateSelect = new EventEmitter<string>()
  @Output() updateSave = new EventEmitter<string>()

  placeForm: FormGroup

  select = new FormControl()

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm()
    this.listenToSelect()
  }

  createForm(): void {
    this.placeForm = this.fb.group({
      locationName: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  listenToSelect(): void {
    this.select.valueChanges.forEach((value: string) => {
      this.updateSelect.emit(value)
    })
  }

  subscribeToSelectedLocation() {
    this.selectedPlace$.subscribe((next: Place[] | Place) => {
      console.log('selected Place was updated', next)
      if (isArray(next)) {
        this.placeForm.get('locationName').reset()
      } else {
        this.placeForm.get('locationName').setValue(next.locationName)
      }
    })
  }
}
