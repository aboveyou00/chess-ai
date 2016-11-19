import { ChessPiece } from './chess-piece';
import { PlayerColor } from './player';

export class Bishop extends ChessPiece {
  constructor(color: PlayerColor) {
    super(color, 'B');
  }
}
