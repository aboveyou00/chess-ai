import { ChessPiece, ChessBoardT } from './chess-piece';
import { PlayerColor } from './player';

export class King extends ChessPiece {
  constructor(color: PlayerColor) {
    super(color, 'K');
  }
  
  static *findPossibilities(board: ChessBoardT, tox: number, toy: number): IterableIterator<[number, number]> {
    yield [tox - 1, toy - 1];
    yield [tox, toy - 1];
    yield [tox + 1, toy - 1];
    yield [tox - 1, toy];
    yield [tox + 1, toy];
    yield [tox - 1, toy + 1];
    yield [tox, toy + 1];
    yield [tox - 1, toy + 1];
  }
}
