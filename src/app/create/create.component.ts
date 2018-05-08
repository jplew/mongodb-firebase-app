import { Component, OnInit } from '@angular/core'
import { PlaceService } from '../services/place.service'
import { Observable } from 'rxjs'
import { Location } from '../interfaces/location'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  places$: Observable<Location[]>
  constructor(private placeService: PlaceService) {}

  ngOnInit() {
    this.places$ = this.placeService.getAll()
  }
}
