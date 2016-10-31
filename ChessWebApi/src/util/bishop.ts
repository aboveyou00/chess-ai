import { ChessPiece } from './chess-piece';

export class Bishop extends ChessPiece {
  get notation(): string {
    return 'B';
  }
}
