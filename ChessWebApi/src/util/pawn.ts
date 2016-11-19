import { ChessPiece } from './chess-piece';
import { PlayerColor } from './player';

export class Pawn extends ChessPiece {
  constructor(color: PlayerColor) {
    super(color, 'P');
  }
}
