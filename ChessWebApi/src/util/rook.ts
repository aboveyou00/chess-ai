import { ChessPiece } from './chess-piece';
import { PlayerColor } from './player';

export class Rook extends ChessPiece {
  constructor(color: PlayerColor) {
    super(color, 'R');
  }
}
