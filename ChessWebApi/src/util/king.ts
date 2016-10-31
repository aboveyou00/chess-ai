import { ChessPiece } from './chess-piece';

export class King extends ChessPiece {
  get notation(): string {
    return 'K';
  }
}
