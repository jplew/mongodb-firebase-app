import { Component } from '@angular/core'

@Component({
  selector: 'app-column-layout',
  templateUrl: './column-layout.component.html',
  styleUrls: ['./column-layout.component.css']
})
export class ColumnLayoutComponent {
  cards = [
    { title: 'Card 1', cols: 1, rows: 1 },
    { title: 'Card 2', cols: 1, rows: 1 }
  ];
}
