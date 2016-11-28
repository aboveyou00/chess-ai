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
  
  abstract listMoves(board: ChessBoardT, fromx: number, fromy: number): IterableIterator<[Function, Function]>;

  protected validateMoves(board: ChessBoardT, fromx: number, fromy: number, allMoves: IterableIterator<[number, number]>): IterableIterator<[Function, Function]> {
    let filteredMoves = [...allMoves]
      .filter(move => move[0] >= 0 && move[0] <= 7 && move[1] >= 0 && move[1] <= 7)
      .filter(move => {
        let piece = board[move[0]][move[1]];
        if (!piece) return true;
        if (piece.color != this.color) return true;
        return false;
      });
    return this.wrapMoves(board, fromx, fromy, filteredMoves);
  }
  protected *wrapMoves(board: ChessBoardT, fromx: number, fromy: number, allMoves: [number, number][]): IterableIterator<[Function, Function]> {
    let pieceMoving = this;
    let hasPieceMoved = this.hasMoved;
    
    yield* allMoves.map(move => {
      let capturePiece = board[move[0]][move[1]];
      return <[Function, Function]>[function() {
        board[move[0]][move[1]] = pieceMoving;
        board[fromx][fromy] = null;
        pieceMoving.hasMoved = true;
      }, function() {
        board[fromx][fromy] = pieceMoving;
        board[move[0]][move[1]] = capturePiece;
        pieceMoving.hasMoved = hasPieceMoved;
      }];
    });
  }
  
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
