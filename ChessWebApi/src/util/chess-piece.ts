import { PlayerColor } from './player';

export abstract class ChessPiece {
  constructor(private _color: PlayerColor) {
  }

  get color() {
    return this._color;
  }

  abstract get notation(): string;
}

export * from './king';
export * from './queen';
export * from './knight';
export * from './rook';
export * from './bishop';
export * from './pawn';
