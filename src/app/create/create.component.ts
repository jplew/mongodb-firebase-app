import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable, Observer, Subject } from 'rxjs'
import { Place } from '../interfaces/place'
import { isArray } from '../helpers/isArray'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  @Input() placesForDropdown$: Observable<Place[]>
  @Input() selectedPlace$: Observable<Place>
  @Input() placesSubject: Subject<string>

  @Output() updatePlace = new EventEmitter<Place>()

  placeForm: FormGroup

  select = new FormControl()

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm()
    this.subscribeToSelectedLocation()
  }

  createForm(): void {
    this.placeForm = this.fb.group({
      locationName: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  subscribeToSelectedLocation() {
    this.selectedPlace$
      .pipe(filter(next => !!next))
      .subscribe((next: Place) => {
        this.placeForm.get('locationName').setValue(next.locationName)
        this.placeForm.get('latitude').setValue(next.latitude)
        this.placeForm.get('longitude').setValue(next.longitude)
        this.placeForm.get('description').setValue(next.description)
      })
  }

  onSubmit() {
    console.log('form was submitted', this.placeForm.value)
    this.updatePlace.emit(this.placeForm.value)
  }

  revert() {
    console.log('reverting')
  }
}
