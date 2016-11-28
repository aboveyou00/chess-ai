import { ChessPiece, ChessBoardT } from './chess-piece';
import { PlayerColor } from './player';

export class King extends ChessPiece {
  constructor(color: PlayerColor) {
    super(color, 'K');
  }
  
  static *findPossibilities(board: ChessBoardT, tox: number, toy: number): IterableIterator<[number, number]> {
    yield [tox - 1, toy - 1];
    yield [tox + 0, toy - 1];
    yield [tox + 1, toy - 1];
    yield [tox - 1, toy + 0];
    yield [tox + 1, toy + 0];
    yield [tox - 1, toy + 1];
    yield [tox + 0, toy + 1];
    yield [tox + 1, toy + 1];
  }
  
  listMoves(board: ChessBoardT, fromx: number, fromy: number): IterableIterator<[Function, Function]> {
    return this.validateMoves(board, fromx, fromy, this.allMoves(board, fromx, fromy));
  }
  private *allMoves(board: ChessBoardT, fromx: number, fromy: number): IterableIterator<[number, number]> {
    yield [fromx - 1, fromy - 1];
    yield [fromx + 0, fromy - 1];
    yield [fromx + 1, fromy - 1];
    yield [fromx - 1, fromy + 0];
    yield [fromx + 1, fromy + 0];
    yield [fromx - 1, fromy + 1];
    yield [fromx + 0, fromy + 1];
    yield [fromx + 1, fromy + 1];
  }
}
