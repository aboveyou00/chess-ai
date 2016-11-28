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
  
  listMoves(board: ChessBoardT, fromx: number, fromy: number): IterableIterator<[Function, Function]> {
    return this.wrapMoves(board, fromx, fromy, [...this.allMoves(board, fromx, fromy)]);
  }
  private *allMoves(board: ChessBoardT, xfrom: number, yfrom: number): IterableIterator<[number, number]> {
    let forward = (this.color == 'White' ? -1 : 1);
    let firstPieceTaken = yfrom + forward < 0 || yfrom + forward > 7 || !!board[xfrom][yfrom + forward];
    if (!firstPieceTaken) {
      yield [xfrom, yfrom + forward];
      if (!this.hasMoved) {
        let secondPieceTaken = !!board[xfrom][yfrom + (forward * 2)];
        if (!secondPieceTaken) yield [xfrom, yfrom + (forward * 2)];
      }
    }
    if (yfrom + forward >= 0 && yfrom + forward <= 7 && xfrom > 0) {
      let captureLeft = board[xfrom - 1][yfrom + forward];
      if (!!captureLeft && captureLeft.color != this.color) yield [xfrom - 1, yfrom + forward];
    }
    if (yfrom + forward >= 0 && yfrom + forward <= 7 && xfrom < 7) {
      let captureRight = board[xfrom + 1][yfrom + forward];
      if (!!captureRight && captureRight.color != this.color) yield [xfrom + 1, yfrom + forward];
    }
  }
}
