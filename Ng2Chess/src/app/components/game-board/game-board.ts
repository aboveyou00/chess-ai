import { Component, Input } from '@angular/core';

@Component({
  selector: 'game-board',
  styleUrls: ['./game-board.css'],
  templateUrl: './game-board.html'
})
export class GameBoardComponent {
  constructor() { }
  
  @Input() board: any;
}
