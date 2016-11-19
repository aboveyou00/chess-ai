import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ChessService } from '../../services/chess.service';

@Component({
  selector: 'reset-game',
  styleUrls: ['./reset-game.css'],
  templateUrl: './reset-game.html'
})
export class ResetGameComponent {
  constructor(private chess: ChessService) {
  }
  
  @Input() gameName: string;
  @Output() reset: EventEmitter<void> = new EventEmitter<void>();
  
  resetGame() {
    this.chess.resetGame(this.gameName).then(() => this.reset.emit());
  }
}
