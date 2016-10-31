import { ChessPiece } from './chess-piece';

export class Knight extends ChessPiece {
  get notation(): string {
    return 'N';
  }
}
