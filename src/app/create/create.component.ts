import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  @Input() placesForDropdown$: Observable<Location[]>
  @Input() place$: Observable<Location[] | Location>

  constructor() {}

  ngOnInit() {}
}
