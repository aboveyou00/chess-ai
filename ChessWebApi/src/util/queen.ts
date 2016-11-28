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
  
  listMoves(board: ChessBoardT, fromx: number, fromy: number): IterableIterator<[Function, Function]> {
    return this.wrapMoves(board, fromx, fromy, [...this.allMoves(board, fromx, fromy)]);
  }
  *allMoves(board: ChessBoardT, fromx: number, fromy: number): IterableIterator<[number, number]> {
    yield* Rook.allMoves(this, board, fromx, fromy);
    yield* Bishop.allMoves(this, board, fromx, fromy);
  }
}
