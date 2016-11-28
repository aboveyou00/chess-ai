import { ChessPiece, ChessBoardT } from './chess-piece';
import { PlayerColor } from './player';

export class Knight extends ChessPiece {
  constructor(color: PlayerColor) {
    super(color, 'N');
  }
  
  static *findPossibilities(board: ChessBoardT, tox: number, toy: number): IterableIterator<[number, number]> {
    yield [tox - 2, toy - 1];
    yield [tox - 1, toy - 2];
    yield [tox + 2, toy - 1];
    yield [tox + 1, toy - 2];
    yield [tox - 2, toy + 1];
    yield [tox - 1, toy + 2];
    yield [tox + 2, toy + 1];
    yield [tox + 1, toy + 2];
  }
  
  listMoves(board: ChessBoardT, fromx: number, fromy: number): IterableIterator<[Function, Function]> {
    return this.validateMoves(board, fromx, fromy, this.allMoves(board, fromx, fromy));
  }
  private *allMoves(board: ChessBoardT, fromx: number, fromy: number): IterableIterator<[number, number]> {
    yield [fromx - 2, fromy - 1];
    yield [fromx - 1, fromy - 2];
    yield [fromx + 2, fromy - 1];
    yield [fromx + 1, fromy - 2];
    yield [fromx - 2, fromy + 1];
    yield [fromx - 1, fromy + 2];
    yield [fromx + 2, fromy + 1];
    yield [fromx + 1, fromy + 2];
  }
}
