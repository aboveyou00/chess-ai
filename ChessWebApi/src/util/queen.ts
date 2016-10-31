import { ChessPiece } from './chess-piece';

export class Queen extends ChessPiece {
  get notation(): string {
    return 'Q';
  }
}
