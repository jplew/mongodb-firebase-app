import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms'
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
  @Input() formReset$: Observable<void>

  @Output() updatePlace = new EventEmitter<Place>()
  @Output() createPlace = new EventEmitter<Place>()

  updateForm: FormGroup
  createForm: FormGroup

  update: any
  create: any

  activeTabIndex = 0

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm()
    this.subscribeToSelectedLocation()
    this.listenForReset()
  }

  initForm(): void {
    this.createFormControls()
    this.createFormGetters()
  }

  getNameError(source) {
    if (source.hasError('required')) {
      return 'Location Name is required.'
    }
    if (source.hasError('pattern')) {
      return 'Location Name contains invalid characters.'
    }
    if (source.hasError('maxLength')) {
      return 'Location Name must be under 30 characters long.'
    }
  }

  getDescriptionError(source) {
    if (source.hasError('required')) {
      return 'Description is required.'
    }
    if (source.hasError('pattern')) {
      return 'Description contains invalid characters.'
    }
    if (source.hasError('maxLength')) {
      return 'Description must be less than 500 characters.'
    }
  }

  getRangeError(source, min, max) {
    if (source.hasError('required')) {
      return 'Required field.'
    }
    if (source.hasError('pattern')) {
      return 'Must contain only numbers and decimals.'
    }
    if (source.hasError('max')) {
      return `Must be less than or equal to ${max}.`
    }
    if (source.hasError('min')) {
      return `Must be greater than or equal to ${min}.`
    }
  }

  listenForReset() {
    this.formReset$.subscribe(() => this.reset())
  }

  createFormGetters() {
    this.update = {
      locationName: this.updateForm.get('locationName'),
      description: this.updateForm.get('description'),
      latitude: this.updateForm.get('latitude'),
      longitude: this.updateForm.get('longitude')
    }

    this.create = {
      locationName: this.createForm.get('locationName'),
      description: this.createForm.get('description'),
      latitude: this.createForm.get('latitude'),
      longitude: this.createForm.get('longitude')
    }
  }

  createFormControls() {
    this.updateForm = this.fb.group({
      locationName: [
        '',
        [
          Validators.required,
          Validators.pattern(`^[ .-:.'a-zA-Z\u0080-\u024F]*$`),
          Validators.maxLength(30)
        ]
      ],
      latitude: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9.-]*$'),
          Validators.min(-90),
          Validators.max(90)
        ]
      ],
      longitude: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9.-]*$'),
          Validators.min(-180),
          Validators.max(180)
        ]
      ],
      description: [
        '',
        [
          Validators.pattern(`^[ .-:.'a-zA-Z\u0080-\u024F]*$`),
          Validators.maxLength(500),
          Validators.required
        ]
      ]
    })

    this.createForm = this.fb.group({
      locationName: [
        '',
        [
          Validators.required,
          Validators.pattern(`^[ .-:.'a-zA-Z\u0080-\u024F]*$`),
          Validators.maxLength(30)
        ]
      ],
      latitude: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9.-]*$'),
          Validators.min(-90),
          Validators.max(90)
        ]
      ],
      longitude: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9.-]*$'),
          Validators.min(-180),
          Validators.max(180)
        ]
      ],
      description: [
        '',
        [
          Validators.pattern(`^[ .-:.'a-zA-Z\u0080-\u024F]*$`),
          Validators.maxLength(500),
          Validators.required
        ]
      ]
    })
  }

  subscribeToSelectedLocation() {
    this.selectedPlace$
      .pipe(filter(next => !!next))
      .subscribe((next: Place) => {
        this.activeTabIndex = 0

        this.update.locationName.setValue(next.locationName)
        this.update.locationName.disable()
        this.update.latitude.setValue(next.latitude)
        this.update.longitude.setValue(next.longitude)
        this.update.description.setValue(next.description)
      })
  }

  submitUpdate() {
    this.updateForm.get('locationName').enable()
    this.updatePlace.emit(this.updateForm.value)
  }

  reset() {
    this.updateForm.reset()
    this.createForm.reset()
  }

  submitCreate() {
    this.createPlace.emit(this.createForm.value)
  }

  resetCreateForm() {
    this.createForm.reset()
  }

  revert() {
    this.selectedPlace$.subscribe((next: Place) => {
      if (!next) {
        return this.reset()
      }
      this.update.locationName.setValue(next.locationName)
      this.update.latitude.setValue(next.latitude)
      this.update.longitude.setValue(next.longitude)
      this.update.description.setValue(next.description)
    })
  }
}
