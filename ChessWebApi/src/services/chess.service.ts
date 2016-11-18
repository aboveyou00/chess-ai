import { Service } from 'miter';
import { ChessGame } from '../util';

@Service()
export class ChessService {
  
  private games = new Map<string, ChessGame>();

  deleteGame(name: string): boolean {
    return this.games.delete(name);
  }

  getOrCreateGame(name: string): ChessGame {
    let game = this.games.get(name);
    if (!game) this.games.set(name, game = new ChessGame());
    return game;
  }

  addPlayerToGame(name: string, player: string): boolean {
    let game = this.getOrCreateGame(name);
    if (game.players.length >= 2) return false;
    game.players.push({ name: player });
    if (game.players.length == 2) this.startGame(game);
    return true;
  }
  private startGame(game: ChessGame) {
    let firstPlayerWhite = Math.random() > .5;
    game.players[0].color = ( firstPlayerWhite ? 'White' : 'Black');
    game.players[1].color = (!firstPlayerWhite ? 'White' : 'Black');
    game.turn = { name: game.players[firstPlayerWhite ? 0 : 1].name, timeLeft: 10 };
    game.initBoard();
  }

  playerMadeMove(name: string, player: string, move: string): string {
    let game = this.games.get(name);
    if (!game) return `That game doesn't exist!`;
    if (!game.hasStarted) return `That game hasn't started yet!`;
    if (game.winner) return `That game already has a winner! You can't make any more moves!`;
    if (game.turn.name != player) return `It's not your turn! It's ${game.turn.name}'s turn to move!`;

    let match = moveRegex.exec(move);
    if (!match) return `Could not parse move using move regex`;

    let castleMove = match[captureGroups.castleMove];
    if (castleMove) {
      let error = game.validateCastleMove(castleMove);
      if (error) return error;
    }
    else {
      let movePiece = match[captureGroups.movePiece] || 'P';
      let fromPosition = match[captureGroups.fromPosition];
      let takePiece: boolean = !!match[captureGroups.takePiece];
      let toPosition = match[captureGroups.toPosition];
      let promotion = match[captureGroups.promotion];
      let checkAndMate = match[captureGroups.checkAndMate];

      let error = game.validateNormalMove(movePiece, fromPosition, takePiece, toPosition, promotion, checkAndMate);
      if (error) return error;
    }

    game.turn.timeLeft = 10;
    game.turn.name = (game.turn.name == game.players[0].name ? game.players[1].name : game.players[0].name);
    return '';
  }

}

export const moveRegex = /^(?:(?:([KQBNRP][ld]?)?([a-h]?[1-8]?)(x)?([a-h][1-8])(?:=?([QBNR]))?)|(0-0(?:-0)?|o-o(?:-o)?|O-O(?:-O)?))([+][+]?)?$/g;
export const captureGroups = {
  movePiece: 1,
  fromPosition: 2,
  takePiece: 3,
  toPosition: 4,
  promotion: 5,
  castleMove: 6,
  checkAndMate: 7
};
