import { ChessPiece, StaticChessPiece, King, Queen, Knight, Rook, Bishop, Pawn } from './chess-piece';
import { Player } from './player';
import { Turn } from './turn';

export class ChessGame {
  constructor() { }

  hasStarted: boolean = false;
  winner: string = '';

  players: Player[] = [];
  turn: Turn;

  moves: string[];
  board: (ChessPiece | null)[][];

  initBoard() {
    this.hasStarted = true;
    this.winner = '';
    this.moves = [];
    ////Standard chess board
    //this.board = [
    //  [new Rook('Black'),   new Pawn('Black'), null, null, null, null, new Pawn('White'), new Rook('White')],
    //  [new Knight('Black'), new Pawn('Black'), null, null, null, null, new Pawn('White'), new Knight('White')],
    //  [new Bishop('Black'), new Pawn('Black'), null, null, null, null, new Pawn('White'), new Bishop('White')],
    //  [new Queen('Black'),  new Pawn('Black'), null, null, null, null, new Pawn('White'), new Queen('White')],
    //  [new King('Black'),   new Pawn('Black'), null, null, null, null, new Pawn('White'), new King('White')],
    //  [new Bishop('Black'), new Pawn('Black'), null, null, null, null, new Pawn('White'), new Bishop('White')],
    //  [new Knight('Black'), new Pawn('Black'), null, null, null, null, new Pawn('White'), new Knight('White')],
    //  [new Rook('Black'),   new Pawn('Black'), null, null, null, null, new Pawn('White'), new Rook('White')]
    //];

    ////Testing castling:
    //this.board = [
    //  [new Rook('Black'), new Pawn('Black'), null, null, null, null, new Pawn('White'), new Rook('White')],
    //  [null, new Pawn('Black'), null, null, null, null, new Pawn('White'), null],
    //  [null, new Pawn('Black'), null, null, null, null, new Pawn('White'), null],
    //  [null, new Pawn('Black'), null, null, null, null, new Pawn('White'), null],
    //  [new King('Black'), new Pawn('Black'), null, null, null, null, new Pawn('White'), new King('White')],
    //  [null, new Pawn('Black'), null, null, null, null, new Pawn('White'), null],
    //  [null, new Pawn('Black'), null, null, null, null, new Pawn('White'), null],
    //  [new Rook('Black'), new Pawn('Black'), null, null, null, null, new Pawn('White'), new Rook('White')]
    //];

    //Promotion
    this.board = [
      [null,                new Pawn('White'), null, null, null, null, new Pawn('White'), new Rook('White')],
      [null,                null,              null, null, null, null, new Pawn('White'), new Knight('White')],
      [new Bishop('Black'), new Pawn('Black'), null, null, null, null, new Pawn('White'), new Bishop('White')],
      [new Queen('Black'),  new Pawn('Black'), null, null, null, null, new Pawn('White'), new Queen('White')],
      [new King('Black'),   new Pawn('Black'), null, null, null, null, new Pawn('White'), new King('White')],
      [new Bishop('Black'), new Pawn('Black'), null, null, null, null, new Pawn('White'), new Bishop('White')],
      [new Knight('Black'), new Pawn('Black'), null, null, null, null, null,              null],
      [new Rook('Black'),   null,              null, null, null, null, new Pawn('Black'), null]
    ];
  }
  
  get currentTurnColor() {
    if (!this.hasStarted) throw new Error(`Games that haven't started yet don't have current turn colors.`);
    let color = (this.turn.name == this.players[0].name) ? this.players[0].color : this.players[1].color;
    return color || 'White';
  }
  validateCastleMove(castleMove: string): string {
    let board = this.board;
    let queenSide: boolean = castleMove.length === 5;
    let y = (this.currentTurnColor == 'White') ? 7 : 0;
    let rookFrom, kingTo, rookTo;
    if (queenSide) {
      kingTo = 2;
      rookTo = 3;
      rookFrom = 0;
      if (!board[0][y] || board[1][y] || board[2][y] || board[3][y] || !board[4][y]) return "Invalid castling move.";
    }
    else {
      kingTo = 6;
      rookTo = 5;
      rookFrom = 7;
      if (!board[4][y] || board[5][y] || board[6][y] || !board[7][y]) return "Invalid castling move.";
    }

    let rook = board[rookFrom][y];
    let king = board[4][y];
    if (!rook || !(rook instanceof Rook) || rook.hasMoved || !king || !(king instanceof King) || king.hasMoved) {
      return "Invalid castling move.";
    }

    board[kingTo][y] = king; king.hasMoved = true;
    board[rookTo][y] = rook; rook.hasMoved = true;
    board[rookFrom][y] = board[4][y] = null;

    if (log) {
      var side = queenSide ? 'Queen-side' : 'King-side';
      console.log(`${side} castle.`);
      console.log(this.toConsoleString());
    }
    return '';
  }
  validateNormalMove(movePiece: string, fromPosition: string, takePiece: boolean, toPosition: string, promotion: string, checkAndMate: string): string {
    let board = this.board;
    
    //Normalize movePiece to contain just the type of piece [KQBNRP]
    if (movePiece.endsWith('l') || movePiece.endsWith('d')) {
      if (movePiece[movePiece.length - 1] != (this.currentTurnColor == 'Black' ? 'd' : 'l')) return "Moving a piece out of turn.";
      movePiece = movePiece.substr(0, 1);
    }
    let pieceType = this.getPieceType(movePiece);
    
    let predicate: (pos: [number, number]) => boolean = (pos) => true;
    if (fromPosition) {
      let firstChar = fromPosition[0];
      let lastChar = fromPosition[fromPosition.length - 1];
      let fromColumn = firstChar >= 'a' && firstChar <= 'h' ? firstChar.charCodeAt(0) - 'a'.charCodeAt(0) : null;
      let fromRow = lastChar >= '1' && lastChar <= '8' ? 7 - (lastChar.charCodeAt(0) - '1'.charCodeAt(0)) : null;
      if (fromRow != null && fromColumn != null) predicate = (pos) => pos[0] == fromColumn && pos[1] == fromRow;
      else if (fromRow != null) predicate = (pos) => pos[0] == fromRow;
      else predicate = (pos) => pos[1] == fromColumn;
    }
    
    let tox = toPosition[0].charCodeAt(0) - 'a'.charCodeAt(0),
        toy = 7 - (toPosition[1].charCodeAt(0) - '1'.charCodeAt(0));
    
    //Validate whether or not you are taking a piece
    let pieceTaking = board[tox][toy];
    if (takePiece || (pieceTaking && pieceTaking.color != this.currentTurnColor)) {
      takePiece = true;
      if (!pieceTaking || pieceTaking.color == this.currentTurnColor) return "Can't take an empty square or your own piece!";
      //TODO: allow for en passant
    }
    else if (pieceTaking) return "Can't move a piece onto another piece!";
    
    let promotionType = pieceType;
    if (promotion) {
      if (pieceType !== Pawn) return "Pieces that aren't pawns can't be promoted!";
      if (toy != (this.currentTurnColor == 'White' ? 0 : 7)) return "Pawns can't be promoted until they reach the end row.";
      promotionType = this.getPieceType(promotion);
    }
    else if (pieceType === Pawn && toy == (this.currentTurnColor == 'White' ? 0 : 7)) return "Moving a pawn to the end row must specify a pawn promotion.";
    
    //Find all piece possibilities
    let possibilities = [...pieceType.findPossibilities(this.board, tox, toy, takePiece, this.currentTurnColor)]
      .filter(pos => pos[0] >= 0 && pos[0] <= 7 && pos[1] >= 0 && pos[1] <= 7)
      .filter(pos => {
        let piece = board[pos[0]][pos[1]];
        if (!piece || !(piece instanceof pieceType) || piece.color != this.currentTurnColor) return false;
        return true;
      })
      .filter(predicate);
    if (possibilities.length == 0) return "Could not find piece that matches move.";
    else if (possibilities.length > 1) return "Could not find a single best move that matches move syntax.";
    let fromx: number = possibilities[0][0], fromy: number = possibilities[0][1];
    if (promotion) board[fromx][fromy] = new promotionType(this.currentTurnColor);
    let pieceMoved = board[tox][toy] = board[fromx][fromy];
    if (pieceMoved) pieceMoved.hasMoved = true;
    board[fromx][fromy] = null;
    
    if (log) {
      var capture = takePiece ? "to capture the piece at" : "to";
      var promotionStr = promotion ? ` Promote to ${promotionType.name}.` : "";
      var fromxStr = String.fromCharCode('A'.charCodeAt(0) + fromx);
      var fromyStr = String.fromCharCode('8'.charCodeAt(0) - fromy);
      var toxStr = String.fromCharCode('A'.charCodeAt(0) + tox);
      var toyStr = String.fromCharCode('8'.charCodeAt(0) - toy);
      console.log(`Move the ${pieceType.name} at ${fromxStr}${fromyStr} ${capture} ${toxStr}${toyStr}.${promotionStr}`);
      console.log(this.toConsoleString());
    }
    
    return '';
  }
  private getPieceType(movePiece: string): StaticChessPiece<any> {
    switch (movePiece) {
      case 'K': return King;
      case 'Q': return Queen;
      case 'N': return Knight;
      case 'B': return Bishop;
      case 'R': return Rook;
      case 'P': return Pawn;

      default: throw new Error(`WTF?`);
    }
  }
  
  toJson(): string {
    return JSON.stringify(this);
  }
  toXml(): string {
    let players = this.players.map(p => `<Player Name="${p.name}" Color="${p.color}"></Player>`).join('');
    let turn = '', board = '';
    if (this.hasStarted) {
      if (!this.winner) turn = `<Turn Name="${this.turn.name}" TimeLeft="${this.turn.timeLeft}"></Turn>`;
      let moves = this.moves.map(move => `<Move>${move}</Move>`).join('');
      board = `<Board>${moves}</Board>`;
    }
    
    return `
      <?xml version="1.0" encoding="utf-8" ?>
      <Game HasStarted="${this.hasStarted}" Winner="${this.winner}">
        ${players}
        ${turn}
        ${board}
      </Game>
    `;
  }
  toConsoleString(): string {
    let sb = '';
    for (let row = 0; row < 8; row++) {
      sb += (8 - row) + '  ';
      for (let col = 0; col < 8; col++) {
        let piece = this.board[col][row];
        if (!piece) sb += ' - ';
        else sb += ' ' + piece.toConsoleString();
      }
      sb += '\r\n';
    }
    sb += '\r\n    A  B  C  D  E  F  G  H';
    return sb;
  }
}

const log: boolean = true;
