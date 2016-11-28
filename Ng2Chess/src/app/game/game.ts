import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ChessService } from '../services/chess.service';

@Component({
  styleUrls: ['./game.css'],
  templateUrl: './game.html'
})
export class GameComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private chess: ChessService) {
  }
  
  private _gameName: string;
  get gameName() {
    return this._gameName;
  }
  
  private _game: any = {};
  get game() {
    return this._game;
  }
  
  error: string;
  
  myPlayers: string[] = [];
  addPlayer(name: string) {
    this.myPlayers.push(name);
  }
  get isMyTurn() {
    return this.game.hasStarted && !this.game.winner && !!this.myPlayers.find(p => p == this.game.turn.name);
  }
  get currentPlayer() {
    if (!this.game.hasStarted) return null;
    return this.game.players.find(p => p.name == this.game.turn.name);
  }
  get currentTurnColor() {
    let p = this.currentPlayer;
    if (!p) return 'FISH';
    return p.color;
  }
  makeMove(move: string) {
    this.error = '';
    this.chess.makeMove(this._gameName, this.game.turn.name, move)
      .catch(response => this.error = response._body);
  }
  reset() {
    this.myPlayers = [];
  }
  
  private _timeout: NodeJS.Timer | null;
  private tick() {
    this.chess.getBoard(this._gameName).then(game => {
      this._game = game;
      this._timeout = setTimeout(() => this.tick(), 300);
    });
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this._gameName = params['gameName'];
      this.tick();
    });
  }
  ngOnDestroy() {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
  }
}
