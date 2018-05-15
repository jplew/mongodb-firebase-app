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
  @Input() selectedPlace$: Observable<Place>

  @Output() updatePlace = new EventEmitter<Place>()
  @Output() createPlace = new EventEmitter<Place>()

  activeTabIndex = 0
  updateForm: FormGroup
  createForm: FormGroup

  select = new FormControl()

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm()
    this.subscribeToSelectedLocation()
  }

  initForm(): void {
    this.updateForm = this.fb.group({
      locationName: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      description: ['', Validators.required]
    })

    this.createForm = this.fb.group({
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
        this.activeTabIndex = 0
        this.updateForm.get('locationName').setValue(next.locationName)
        this.updateForm.get('locationName').disable()
        this.updateForm.get('latitude').setValue(next.latitude)
        this.updateForm.get('longitude').setValue(next.longitude)
        this.updateForm.get('description').setValue(next.description)
      })
  }

  submitUpdate() {
    this.updateForm.get('locationName').enable()
    this.updatePlace.emit(this.updateForm.value)
    this.updateForm.reset()
  }

  submitCreate() {
    this.createPlace.emit(this.createForm.value)
    this.updateForm.reset()
  }

  revert() {
    this.selectedPlace$.subscribe((next: Place) => {
      this.updateForm.get('locationName').setValue(next.locationName)
      this.updateForm.get('latitude').setValue(next.latitude)
      this.updateForm.get('longitude').setValue(next.longitude)
      this.updateForm.get('description').setValue(next.description)
    })
  }
}
