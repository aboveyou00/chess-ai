import { Component, Input } from '@angular/core';

@Component({
  selector: 'move-list',
  styleUrls: ['./move-list.css'],
  templateUrl: './move-list.html'
})
export class MoveListComponent {
  constructor() { }
  
  @Input() moves: string[];
}
