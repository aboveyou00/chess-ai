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

  playerMadeMove(name: string, player: string, move: string): boolean {
    return false;
  }

}
