import { PlayerColor } from './player';

type PieceNotation = 'K' | 'Q' | 'N' | 'B' | 'R' | 'P';

export abstract class ChessPiece {
  constructor(color: PlayerColor, notation: PieceNotation) {
    this.color = color;
    this.pieceType = notation;
  }

  color: PlayerColor;
  hasMoved: boolean = false;
  pieceType: PieceNotation;
  
  toConsoleString(): string {
    return this.pieceType + (this.color == 'White' ? 'l' : 'd');
  }
}

export * from './king';
export * from './queen';
export * from './knight';
export * from './rook';
export * from './bishop';
export * from './pawn';
