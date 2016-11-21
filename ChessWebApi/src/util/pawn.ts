import { ChessPiece, ChessBoardT } from './chess-piece';
import { PlayerColor } from './player';

export class Pawn extends ChessPiece {
  constructor(color: PlayerColor) {
    super(color, 'P');
  }
  
  static *findPossibilities(board: ChessBoardT, tox: number, toy: number, takePiece: boolean, turnColor: PlayerColor): IterableIterator<[number, number]> {
    let forward = (turnColor == 'White' ? -1 : 1);
    yield [tox, toy - forward];
    if (toy == 4 && turnColor == 'White' && !takePiece) yield [tox, toy + 2];
    if (toy == 3 && turnColor == 'Black' && !takePiece) yield [tox, toy - 2];
    if (takePiece) {
      yield [tox - 1, toy - forward];
      yield [tox + 1, toy - forward];
    }
  }
}
