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
}
