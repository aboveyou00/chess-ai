import { ChessPiece, ChessBoardT } from './chess-piece';
import { PlayerColor } from './player';

export class Rook extends ChessPiece {
  constructor(color: PlayerColor) {
    super(color, 'R');
  }
  
  static *findPossibilities(board: ChessBoardT, tox: number, toy: number): IterableIterator<[number, number]> {
    for (let q = tox + 1; q < 8; q++) {
      yield [q, toy];
      if (board[q][toy]) break;
    }
    for (let q = tox - 1; q >= 0; q--) {
      yield [q, toy];
      if (board[q][toy]) break;
    }
    for (let q = toy + 1; q < 8; q++) {
      yield [tox, q];
      if (board[tox][q]) break;
    }
    for (let q = toy - 1; q >= 0; q--) {
      yield [tox, q];
      if (board[tox][q]) break;
    }
  }
}
