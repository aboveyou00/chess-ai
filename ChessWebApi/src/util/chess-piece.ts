import { PlayerColor } from './player';

export type PieceNotation = 'K' | 'Q' | 'N' | 'B' | 'R' | 'P';

export type ChessBoardT = (ChessPiece | null)[][];
export type StaticChessPiece<T extends ChessPiece> = {
  new (...args: any[]): T,
  findPossibilities(board: ChessBoardT, tox: number, toy: number, takePiece?: boolean, turnColor?: PlayerColor): IterableIterator<[number, number]>
};

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
