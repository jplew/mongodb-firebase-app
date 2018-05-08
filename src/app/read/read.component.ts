import { Component, OnInit } from '@angular/core'
import { PlaceService } from '../services/place.service'
import { Observable } from 'rxjs'
import { Location } from '../interfaces/location'

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {
  places$: Observable<Location[]>
  constructor(private placeService: PlaceService) {}

  ngOnInit() {
    this.places$ = this.placeService.getAll()
  }
}
