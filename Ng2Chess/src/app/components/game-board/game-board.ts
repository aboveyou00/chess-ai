import { Component, Input, Output, EventEmitter } from '@angular/core';

type MovePossibility = {
  col: number,
  row: number,
  move: string,
  promote?: boolean
};
function makePossibility(prefix: string, col: number, row: number, colto: number, rowto: number, capture?: boolean): MovePossibility {
  return {
    col: colto,
    row: rowto,
    move: prefix + makeCoords(col, row) + (capture ? 'x' : '') + makeCoords(colto, rowto)
  };
}
function makeCoords(col: number, row: number): string {
  return 'abcdefgh'[col] + (8 - row);
}

@Component({
  selector: 'game-board',
  styleUrls: ['./game-board.css'],
  templateUrl: './game-board.html'
})
export class GameBoardComponent {
  constructor() { }

  @Input() board: any;
  @Input() currentTurnColor: 'Black' | 'White';

  private _moveCount: number;
  @Input()
  set moveCount(val: number) {
    if (this._moveCount == val) return;
    this._moveCount = val;
    this.selectedColumn = -1;
    this.selectedRow = -1;
    this.movePossibilities = [];
  }

  @Output() moveMade: EventEmitter<string> = new EventEmitter<string>();

  private selectedRow: number;
  private selectedColumn: number;
  private movePossibilities: MovePossibility[] = [];
  isValidMove(col: number, row: number): boolean {
    return !!this.movePossibilities.find(move => move.row == row && move.col == col);
  }

  isPromoting: MovePossibility | null = null;
  
  tileClicked(col: number, row: number) {
    let piece = this.board[col][row];
    if (!!piece && piece.color == this.currentTurnColor) {
      if (this.selectedColumn == col && this.selectedRow == row) {
        this.selectedColumn = -1;
        this.selectedRow = -1;
        this.movePossibilities = [];
        this.isPromoting = null;
        return;
      }
      this.selectedColumn = col;
      this.selectedRow = row;
      this.movePossibilities = this.findPossibilities();
      this.isPromoting = null;
      console.log(this.movePossibilities);
    }
    else {
      let moves = [...this.movePossibilities.filter(move => move.col == col && move.row == row)];
      if (moves.length > 1) throw new Error('Multiple valid moves! This should never happen!');
      if (moves.length == 1) {
        let move = moves[0];
        if (move && move.promote) this.isPromoting = move;
        else this.moveMade.emit(move.move);
        return;
      }
      this.selectedColumn = -1;
      this.selectedRow = -1;
      this.movePossibilities = [];
      this.isPromoting = null;
    }
  }
  promoteWith(type: string) {
    if (!this.isPromoting) return;
    let promoMove = this.isPromoting.move;
    this.isPromoting = null;
    if (!type) return;
    this.moveMade.emit(promoMove + type);
  }
  
  piecePossibilities: { [key: string]: { (row: number, col: number, piece: any): IterableIterator<MovePossibility> } } = {
    K: function* (row: number, col: number, piece: any): IterableIterator<MovePossibility> {
         yield makePossibility(piece.pieceType, col, row, col - 1, row - 1);
         yield makePossibility(piece.pieceType, col, row, col + 0, row - 1);
         yield makePossibility(piece.pieceType, col, row, col + 1, row - 1);
         yield makePossibility(piece.pieceType, col, row, col - 1, row + 0);
         yield makePossibility(piece.pieceType, col, row, col + 1, row + 0);
         yield makePossibility(piece.pieceType, col, row, col - 1, row + 1);
         yield makePossibility(piece.pieceType, col, row, col + 0, row + 1);
         yield makePossibility(piece.pieceType, col, row, col + 1, row + 1);

         if (!piece.hasMoved && col == 4) {
           if (!this.board[col - 1][row] && !this.board[col - 2][row] && !this.board[col - 3][row]) {
             let rook = this.board[col - 4][row];
             if (rook && !rook.hasMoved && rook.pieceType == 'R') yield { col: col - 2, row: row, move: 'O-O-O' };
           }
           if (!this.board[col + 1][row] && !this.board[col + 2][row]) {
             let rook = this.board[col + 3][row];
             if (rook && !rook.hasMoved && rook.pieceType == 'R') yield { col: col + 2, row: row, move: 'O-O' };
           }
         }
       },
    Q: function* (row: number, col: number, piece: any): IterableIterator<MovePossibility> {
         yield* this.piecePossibilities['B'].bind(this)(row, col, piece);
         yield* this.piecePossibilities['R'].bind(this)(row, col, piece);
       },
    N: function* (row: number, col: number, piece: any): IterableIterator<MovePossibility> {
         yield makePossibility(piece.pieceType, col, row, col - 2, row - 1);
         yield makePossibility(piece.pieceType, col, row, col - 1, row - 2);
         yield makePossibility(piece.pieceType, col, row, col + 2, row - 1);
         yield makePossibility(piece.pieceType, col, row, col + 1, row - 2);
         yield makePossibility(piece.pieceType, col, row, col - 2, row + 1);
         yield makePossibility(piece.pieceType, col, row, col - 1, row + 2);
         yield makePossibility(piece.pieceType, col, row, col + 2, row + 1);
         yield makePossibility(piece.pieceType, col, row, col + 1, row + 2);
       },
    B: function* (row: number, col: number, piece: any): IterableIterator<MovePossibility> {
         for (let q = 1; col - q >= 0 && row - q >= 0; q++) {
           let takingPiece = this.board[col - q][row - q];
           if (!!takingPiece) {
             if (takingPiece.color != this.currentTurnColor) yield makePossibility(piece.pieceType, col, row, col - q, row - q, true);
             break;
           }
           yield makePossibility(piece.pieceType, col, row, col - q, row - q);
         }
         for (let q = 1; col - q >= 0 && row + q <= 7; q++) {
           let takingPiece = this.board[col - q][row + q];
           if (!!takingPiece) {
             if (takingPiece.color != this.currentTurnColor) yield makePossibility(piece.pieceType, col, row, col - q, row + q, true);
             break;
           }
           yield makePossibility(piece.pieceType, col, row, col - q, row + q);
         }
         for (let q = 1; col + q <= 7 && row + q <= 7; q++) {
           let takingPiece = this.board[col + q][row + q];
           if (!!takingPiece) {
             if (takingPiece.color != this.currentTurnColor) yield makePossibility(piece.pieceType, col, row, col + q, row + q, true);
             break;
           }
           yield makePossibility(piece.pieceType, col, row, col + q, row + q);
         }
         for (let q = 1; col + q <= 7 && row - q >= 0; q++) {
           let takingPiece = this.board[col + q][row - q];
           if (!!takingPiece) {
             if (takingPiece.color != this.currentTurnColor) yield makePossibility(piece.pieceType, col, row, col + q, row - q, true);
             break;
           }
           yield makePossibility(piece.pieceType, col, row, col + q, row - q);
         }
       },
    R: function* (row: number, col: number, piece: any): IterableIterator<MovePossibility> {
         for (let q = col - 1; q >= 0; q--) {
           let takingPiece = this.board[q][row];
           if (!!takingPiece) {
             if (takingPiece.color != this.currentTurnColor) yield makePossibility(piece.pieceType, col, row, q, row, true);
             break;
           }
           yield makePossibility(piece.pieceType, col, row, q, row);
         }
         for (let q = col + 1; q <= 7; q++) {
           let takingPiece = this.board[q][row];
           if (!!takingPiece) {
             if (takingPiece.color != this.currentTurnColor) yield makePossibility(piece.pieceType, col, row, q, row, true);
             break;
           }
           yield makePossibility(piece.pieceType, col, row, q, row);
         }
         for (let w = row - 1; w >= 0; w--) {
           let takingPiece = this.board[col][w];
           if (!!takingPiece) {
             if (takingPiece.color != this.currentTurnColor) yield makePossibility(piece.pieceType, col, row, col, w, true);
             break;
           }
           yield makePossibility(piece.pieceType, col, row, col, w);
         }
         for (let w = row + 1; w <= 7; w++) {
           let takingPiece = this.board[col][w];
           if (!!takingPiece) {
             if (takingPiece.color != this.currentTurnColor) yield makePossibility(piece.pieceType, col, row, col, w, true);
             break;
           }
           yield makePossibility(piece.pieceType, col, row, col, w);
         }
       },
    P: function* (row: number, col: number, piece: any): IterableIterator<MovePossibility> {
         let forward = (this.currentTurnColor == 'White' ? -1 : 1);
         let firstPieceTaken = row + forward < 0 || row + forward > 7 || !!this.board[col][row + forward];
         if (!firstPieceTaken) {
           let move = makePossibility('', col, row, col, row + forward);
           if (row + forward == 0 || row + forward == 7) move.promote = true;
           yield move;
           if (!piece.hasMoved) {
             let secondPieceTaken = !!this.board[col][row + (forward * 2)];
             if (!secondPieceTaken) yield makePossibility('', col, row, col, row + (forward * 2));
           }
         }
         if (row + forward >= 0 && row + forward <= 7 && col > 0) {
           let captureLeft = this.board[col - 1][row + forward];
           if (!!captureLeft && captureLeft.color != this.currentTurnColor) yield makePossibility('', col, row, col - 1, row + forward, true);
         }
         if (row + forward >= 0 && row + forward <= 7 && col < 7) {
           let captureRight = this.board[col + 1][row + forward];
           if (!!captureRight && captureRight.color != this.currentTurnColor) yield makePossibility('', col, row, col + 1, row + forward, true);
         }
       }
  }
  private findPossibilities(): MovePossibility[] {
    let row = this.selectedRow,
        col = this.selectedColumn;
    let piece = this.board[col][row];
    if (!piece) return [];
    let possibilities = this.piecePossibilities[piece.pieceType];
    if (!possibilities) return [];
    return [...possibilities.bind(this)(row, col, piece)]
      .filter(move => {
        if (move.col < 0 || move.col > 7 || move.row < 0 || move.row > 7) return false;
        let takePiece = this.board[move.col][move.row];
        if (!!takePiece) return takePiece.color != this.currentTurnColor;
        return true;
      });
  }
}
