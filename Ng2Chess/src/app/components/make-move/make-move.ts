import { Component, Input } from '@angular/core';

import { ChessService } from '../../services/chess.service';

//interface Player {
//  name: string,
//  color: 'Black' | 'White' | undefined
//}

@Component({
  selector: 'make-move',
  styleUrls: ['./make-move.css'],
  templateUrl: './make-move.html'
})
export class MakeMoveComponent {
  constructor(private chess: ChessService) {
  }
  
  @Input() gameName: string;
  @Input() player: string;
  
  move: string;
  makeMove() {
    if (!this.player) return;
    this.chess.makeMove(this.gameName, this.player, this.move);
    this.move = '';
  }
}
