import { ChessPiece } from './chess-piece';
import { PlayerColor } from './player';

export class King extends ChessPiece {
  constructor(color: PlayerColor) {
    super(color, 'K');
  }
}
