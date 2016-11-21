import { ChessPiece, ChessBoardT } from './chess-piece';
import { PlayerColor } from './player';

export class Bishop extends ChessPiece {
  constructor(color: PlayerColor) {
    super(color, 'B');
  }
  
  static *findPossibilities(board: ChessBoardT, tox: number, toy: number): IterableIterator<[number, number]> {
    for (let q = 1; q < 8; q++) {
      if (tox + q > 7 || toy + q > 7) break;
      yield [tox + q, toy + q];
      if (board[tox + q][toy + q]) break;
    }
    for (let q = 1; q < 8; q++) {
      if (tox - q < 0 || toy + q > 7) break;
      yield [tox - q, toy + q];
      if (board[tox - q][toy + q]) break;
    }
    for (let q = 1; q < 8; q++) {
      if (tox + q > 7 || toy - q < 0) break;
      yield [tox + q, toy - q];
      if (board[tox + q][toy - q]) break;
    }
    for (let q = 1; q < 8; q++) {
      if (tox - q < 0 || toy - q < 0) break;
      yield [tox - q, toy - q];
      if (board[tox - q][toy - q]) break;
    }
  }
}
