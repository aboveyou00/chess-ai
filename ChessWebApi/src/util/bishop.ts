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
  
  listMoves(board: ChessBoardT, fromx: number, fromy: number): IterableIterator<[Function, Function]> {
    return this.wrapMoves(board, fromx, fromy, [...Bishop.allMoves(this, board, fromx, fromy)]);
  }
  static *allMoves(self: ChessPiece, board: ChessBoardT, xfrom: number, yfrom: number): IterableIterator<[number, number]> {
    for (let q = 1; xfrom - q >= 0 && yfrom - q >= 0; q++) {
      let takingPiece = board[xfrom - q][yfrom - q];
      if (!!takingPiece) {
        if (takingPiece.color != self.color) yield [xfrom - q, yfrom - q];
        break;
      }
      yield [xfrom - q, yfrom - q];
    }
    for (let q = 1; xfrom - q >= 0 && yfrom + q <= 7; q++) {
      let takingPiece = board[xfrom - q][yfrom + q];
      if (!!takingPiece) {
        if (takingPiece.color != self.color) yield [xfrom - q, yfrom + q];
        break;
      }
      yield [xfrom - q, yfrom + q];
    }
    for (let q = 1; xfrom + q <= 7 && yfrom + q <= 7; q++) {
      let takingPiece = board[xfrom + q][yfrom + q];
      if (!!takingPiece) {
        if (takingPiece.color != self.color) yield [xfrom + q, yfrom + q];
        break;
      }
      yield [xfrom + q, yfrom + q];
    }
    for (let q = 1; xfrom + q <= 7 && yfrom - q >= 0; q++) {
      let takingPiece = board[xfrom + q][yfrom - q];
      if (!!takingPiece) {
        if (takingPiece.color != self.color) yield [xfrom + q, yfrom - q];
        break;
      }
      yield [xfrom + q, yfrom - q];
    }
  }
}
