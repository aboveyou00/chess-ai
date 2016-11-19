import { ChessPiece } from './chess-piece';
import { PlayerColor } from './player';

export class Knight extends ChessPiece {
  constructor(color: PlayerColor) {
    super(color, 'N');
  }
}
