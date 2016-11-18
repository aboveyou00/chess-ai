import { ChessPiece, King, Queen, Knight, Rook, Bishop, Pawn } from './chess-piece';
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
    this.board = [
      [new Rook('Black'), new Knight('Black'), new Bishop('Black'), new Queen('Black'), new King('Black'), new Bishop('Black'), new Knight('Black'), new Rook('Black')],
      [new Pawn('Black'), new Pawn('Black'), new Pawn('Black'), new Pawn('Black'), new Pawn('Black'), new Pawn('Black'), new Pawn('Black'), new Pawn('Black')],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [new Pawn('White'), new Pawn('White'), new Pawn('White'), new Pawn('White'), new Pawn('White'), new Pawn('White'), new Pawn('White'), new Pawn('White')],
      [new Rook('White'), new Knight('White'), new Bishop('White'), new Queen('White'), new King('White'), new Bishop('White'), new Knight('White'), new Rook('White')]
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
    let rookFrom = 0, kingTo, rookTo;
    if (queenSide) {
      kingTo = 2;
      rookTo = 3;
      if (!board[0][y] || board[1][y] || board[2][y] || board[3][y] || !board[4][y]) return "Invalid castling move.";
    }
    else {
      kingTo = 6;
      rookTo = 5;
      if (!board[4][y] || board[5][y] || board[6][y] || !board[7][y]) return "Invalid castling move.";
    }

    let rook = board[rookFrom][y];
    let king = board[4][y];
    if (!rook || !(rook instanceof Rook) || rook.hasMoved || !king || !(king instanceof King) || king.hasMoved) {
      return "Invalid castling move.";
    }

    if (log) {
      var side = queenSide ? 'Queen-side' : 'King-side';
      console.log(`${side} castle.`);
      console.log(this.toConsoleString());
    }

    this[kingTo][y] = king; king.hasMoved = true;
    this[rookTo][y] = rook; rook.hasMoved = true;
    this[rookFrom][y] = this[4][y] = null;
    return '';
  }
  validateNormalMove(movePiece: string, fromPosition: string, takePiece: boolean, toPosition: string, promotion: string, checkAndMate: string): string {
    let board = this.board;

    //Normalize movePiece to contain just the type of piece [KQBNRP]
    if (movePiece.endsWith('l') || movePiece.endsWith('d')) {
      if (movePiece[movePiece.length - 1] != (this.currentTurnColor == 'Black' ? 'd' : 'l')) return "Moving a piece out of turn.";
      movePiece = movePiece.substr(0, 1);
    }
    var pieceType = this.getPieceType(movePiece);
    
    let predicate: (pos: [number, number]) => boolean = (pos) => true;
    if (fromPosition) {
      let firstChar = fromPosition[0];
      let lastChar = fromPosition[fromPosition.length - 1];
      var fromRow = firstChar >= 'a' && firstChar <= 'h' ? firstChar.charCodeAt(0) - 'a'.charCodeAt(0) : null;
      var fromColumn = lastChar >= '1' && lastChar <= '8' ? lastChar.charCodeAt(0) - '1'.charCodeAt(0) : null;
      if (fromRow != null && fromColumn != null) predicate = (pos) => pos[0] == fromColumn && pos[1] == fromRow;
      else if (fromRow != null) predicate = (pos) => pos[0] == fromRow;
      else predicate = (pos) => pos[1] == fromColumn;
    }
    
    let tox = toPosition[0].charCodeAt(0) - 'a'.charCodeAt(0), toy = 7 - (toPosition[1].charCodeAt(0) - '1'.charCodeAt(0));

    //Validate whether or not you are taking a piece
    let pieceTaking = board[tox][toy];
    if (takePiece || (pieceTaking && pieceTaking.color != this.currentTurnColor)) {
      takePiece = true;
      if (!pieceTaking || pieceTaking.color == this.currentTurnColor) return "Can't take an empty square or your own piece!";
      //TODO: allow for en passant
    }
    else if (pieceTaking) return "Can't move a piece onto another piece!";
    
    var promotionType = pieceType;
    if (promotion) {
      if (pieceType !== Pawn) return "Pieces that aren't pawns can't be promoted!";
      if (toy != (this.currentTurnColor == 'White' ? 0 : 7)) return "Pawns can't be promoted until they reach the end row.";
      promotionType = this.getPieceType(promotion);
    }
    else if (pieceType === Pawn && toy == (this.currentTurnColor == 'White' ? 0 : 7)) return "Moving a pawn to the end row must specify a pawn promotion.";

    //Find all piece possibilities
    var possibilities = [...this.findPiecePossibilities(pieceType, tox, toy, takePiece)]
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
    var pieceMoved = board[tox][toy] = board[fromx][fromy];
    board[fromx][fromy] = null;

    if (log) {
      var capture = takePiece ? "to capture the piece at" : "to";
      var promotionStr = promotion ? ` Promote to ${promotionType.name}.` : "";
      console.log(`Move the ${pieceType.name} at ${('A' + fromx)}${8 - fromy} ${capture} ${('A' + tox)}${8 - toy}.${promotionStr}`);
      console.log(this.toConsoleString());
    }

    return '';
  }
  private getPieceType(movePiece: string) {
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

  private findPiecePossibilities(type: new (...args: any[]) => any, tox: number, toy: number, takePiece: boolean): IterableIterator<[number, number]> {
    switch (type) {
      case King:
        return this.findKingPossibilities(tox, toy, takePiece);
      case Queen:
        return this.findQueenPossibilities(tox, toy, takePiece);
      case Bishop:
        return this.findBishopPossibilities(tox, toy, takePiece);
      case Rook:
        return this.findRookPossibilities(tox, toy, takePiece);
      case Knight:
        return this.findKnightPossibilities(tox, toy, takePiece);
      case Pawn:
        return this.findPawnPossibilities(tox, toy, takePiece);
      default:
        throw new Error(`Invalid chess piece type: ${type}`);
    }
  }

  private *findKingPossibilities(tox: number, toy: number, takePiece: boolean): IterableIterator<[number, number]> {
    yield [tox - 1, toy - 1];
    yield [tox, toy - 1];
    yield [tox + 1, toy - 1];
    yield [tox - 1, toy];
    yield [tox + 1, toy];
    yield [tox - 1, toy + 1];
    yield [tox, toy + 1];
    yield [tox - 1, toy + 1];
  }
  private *findQueenPossibilities(tox: number, toy: number, takePiece: boolean): IterableIterator<[number, number]> {
    yield* this.findRookPossibilities(tox, toy, takePiece);
    yield* this.findBishopPossibilities(tox, toy, takePiece);
  }
  private *findRookPossibilities(tox: number, toy: number, takePiece: boolean): IterableIterator<[number, number]> {
    for (let q = tox + 1; q < 8; q++)
    {
      yield [q, toy];
      if (this.board[q][toy]) break;
    }
    for (let q = tox - 1; q >= 0; q--)
    {
      yield [q, toy];
      if (this.board[q][toy]) break;
    }
    for (let q = toy + 1; q < 8; q++)
    {
      yield [tox, q];
      if (this.board[tox][q]) break;
    }
    for (let q = toy - 1; q >= 0; q--)
    {
      yield [tox, q];
      if (this.board[tox][q]) break;
    }
  }
  private *findBishopPossibilities(tox: number, toy: number, takePiece: boolean): IterableIterator<[number, number]> {
    for (let q = 1; q < 8; q++)
    {
      if (tox + q > 7 || toy + q > 7) break;
      yield [tox + q, toy + q];
      if (this.board[tox + q][toy + q]) break;
    }
    for (let q = 1; q < 8; q++)
    {
      if (tox - q < 0 || toy + q > 7) break;
      yield [tox - q, toy + q];
      if (this.board[tox - q][toy + q]) break;
    }
    for (let q = 1; q < 8; q++)
    {
      if (tox + q > 7 || toy - q < 0) break;
      yield [tox + q, toy - q];
      if (this.board[tox + q][toy - q]) break;
    }
    for (let q = 1; q < 8; q++)
    {
      if (tox - q < 0 || toy - q < 0) break;
      yield [tox - q, toy - q];
      if (this.board[tox - q][toy - q]) break;
    }
  }
  private *findKnightPossibilities(tox: number, toy: number, takePiece: boolean): IterableIterator<[number, number]> {
    yield [tox - 2, toy - 1];
    yield [tox - 1, toy - 2];
    yield [tox + 2, toy - 1];
    yield [tox + 1, toy - 2];
    yield [tox - 2, toy + 1];
    yield [tox - 1, toy + 2];
    yield [tox + 2, toy + 1];
    yield [tox + 1, toy + 2];
  }
  private *findPawnPossibilities(tox: number, toy: number, takePiece: boolean): IterableIterator<[number, number]> {
    yield [tox, toy - 1];
    yield [tox, toy + 1];
    if (toy == 4 && !takePiece) yield [tox, toy + 2];
    if (toy == 3 && !takePiece) yield [tox, toy - 2];
    if (takePiece) {
      yield [tox - 1, toy - 1];
      yield [tox + 1, toy - 1];
      yield [tox - 1, toy + 1];
      yield [tox + 1, toy + 1];
    }
  }

  toXml(): string {
    let players = this.players.map(p => `<Player Name="${p.name}" Color="${p.color}"></Player>`).join();
    let turn = '', board = '';
    if (this.hasStarted) {
      if (!this.winner) turn = `<Turn Name="${this.turn.name}" TimeLeft="${this.turn.timeLeft}"></Turn>`;
      let moves = this.moves.map(move => `<Move>${move}</Move>`).join();
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
