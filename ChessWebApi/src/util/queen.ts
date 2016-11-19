import { ChessPiece } from './chess-piece';
import { PlayerColor } from './player';

export class Queen extends ChessPiece {
  constructor(color: PlayerColor) {
    super(color, 'Q');
  }
}
