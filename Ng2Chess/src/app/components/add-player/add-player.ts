import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ChessService } from '../../services/chess.service';

@Component({
  selector: 'add-player',
  styleUrls: ['./add-player.css'],
  templateUrl: './add-player.html'
})
export class AddPlayerComponent {
  constructor(private chess: ChessService) {
  }
  
  @Input() gameName: string;
  @Output() playerAdded: EventEmitter<string> = new EventEmitter<string>();
  
  addPlayerName: string;
  addPlayer() {
    let addPlayerName = this.addPlayerName;
    this.chess.joinGame(this.gameName, addPlayerName).then((worked) => {
      if (worked) this.playerAdded.emit(addPlayerName);
      this.addPlayerName = '';
    });
  }
}
