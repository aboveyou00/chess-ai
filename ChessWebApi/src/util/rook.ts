import { ChessPiece } from './chess-piece';

export class Rook extends ChessPiece {
  get notation(): string {
    return 'R';
  }
}
