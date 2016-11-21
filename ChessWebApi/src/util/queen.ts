import { ChessPiece, ChessBoardT } from './chess-piece';
import { PlayerColor } from './player';
import { Rook } from './rook';
import { Bishop } from './bishop';

export class Queen extends ChessPiece {
  constructor(color: PlayerColor) {
    super(color, 'Q');
  }
  
  static *findPossibilities(board: ChessBoardT, tox: number, toy: number): IterableIterator<[number, number]> {
    yield* Rook.findPossibilities(board, tox, toy);
    yield* Bishop.findPossibilities(board, tox, toy);
  }
}
