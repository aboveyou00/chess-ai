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
  
  listMoves(board: ChessBoardT, fromx: number, fromy: number): IterableIterator<[Function, Function]> {
    return this.wrapMoves(board, fromx, fromy, [...Rook.allMoves(this, board, fromx, fromy)]);
  }
  static *allMoves(self: ChessPiece, board: ChessBoardT, xfrom: number, yfrom: number): IterableIterator<[number, number]> {
    for (let q = xfrom - 1; q >= 0; q--) {
      let takingPiece = board[q][yfrom];
      if (!!takingPiece) {
        if (takingPiece.color != self.color) yield [q, yfrom];
        break;
      }
      yield [q, yfrom];
    }
    for (let q = xfrom + 1; q <= 7; q++) {
      let takingPiece = board[q][yfrom];
      if (!!takingPiece) {
        if (takingPiece.color != self.color) yield [q, yfrom];
        break;
      }
      yield [q, yfrom];
    }
    for (let w = yfrom - 1; w >= 0; w--) {
      let takingPiece = board[xfrom][w];
      if (!!takingPiece) {
        if (takingPiece.color != self.color) yield [xfrom, w];
        break;
      }
      yield [xfrom, w];
    }
    for (let w = yfrom + 1; w <= 7; w++) {
      let takingPiece = board[xfrom][w];
      if (!!takingPiece) {
        if (takingPiece.color != self.color) yield [xfrom, w];
        break;
      }
      yield [xfrom, w];
    }
  }
}
