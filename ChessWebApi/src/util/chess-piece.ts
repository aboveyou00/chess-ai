import { PlayerColor } from './player';

export abstract class ChessPiece {
  constructor(private _color: PlayerColor) {
  }

  get color() {
    return this._color;
  }

  private _hasMoved: boolean;
  get hasMoved(): boolean {
    return this._hasMoved;
  }
  set hasMoved(value: boolean) {
    this._hasMoved = value;
  }

  abstract get notation(): string;
  toConsoleString(): string {
    return this.notation + (this.color == 'White' ? 'l' : 'd');
  }
}

export * from './king';
export * from './queen';
export * from './knight';
export * from './rook';
export * from './bishop';
export * from './pawn';
