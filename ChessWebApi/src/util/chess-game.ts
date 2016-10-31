import { ChessPiece, King, Queen, Knight, Rook, Bishop, Pawn } from './chess-piece';
import { Player } from './player';
import { Turn } from './turn';

export class ChessGame {
  constructor() { }

  hasStarted: boolean = false;
  winner: string = '';

  players: Player[] = [];
  turn: Turn;

  moves: string[];
  board: (ChessPiece | undefined)[][];

  initBoard() {
    this.hasStarted = true;
    this.winner = '';
    this.moves = [];
    this.board = [
      [new Rook('Black'), new Knight('Black'), new Bishop('Black'), new Queen('Black'), new King('Black'), new Bishop('Black'), new Knight('Black'), new Rook('Black')],
      [new Pawn('Black'), new Pawn('Black'), new Pawn('Black'), new Pawn('Black'), new Pawn('Black'), new Pawn('Black'), new Pawn('Black'), new Pawn('Black')],
      [,,,,,,],
      [,,,,,,],
      [,,,,,,],
      [,,,,,,],
      [new Pawn('White'), new Pawn('White'), new Pawn('White'), new Pawn('White'), new Pawn('White'), new Pawn('White'), new Pawn('White'), new Pawn('White')],
      [new Rook('White'), new Knight('White'), new Bishop('White'), new Queen('White'), new King('White'), new Bishop('White'), new Knight('White'), new Rook('White')]
    ];
  }

  toXml(): string {
    let players = this.players.map(p => `<Player Name="${p.name}" Color="${p.color}"></Player>`).join();
    let turn = '', board = '';
    if (this.hasStarted) {
      if (!this.winner) turn = `<Turn Name="${this.turn.name}" TimeLeft="${this.turn.timeLeft}"></Turn>`;
      let moves = this.moves.map(move => `<Move>${move}</Move>`).join();
      board = `<Board>${moves}</Board>`;
    }

    return `
      <?xml version="1.0" encoding="utf-8" ?>
      <Game HasStarted="${this.hasStarted}" Winner="${this.winner}">
        ${players}
        ${turn}
        ${board}
      </Game>
    `;
  }
}
