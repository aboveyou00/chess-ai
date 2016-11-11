using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;

namespace ChessNetworkInterface
{
    public class ChessBoard
    {
        public ChessBoard()
        {
            HasStarted = false;
            initBoard();
        }
        public ChessBoard(string whiteName, string blackName, string winner, string[] moves)
        {
            if (string.IsNullOrWhiteSpace(whiteName)) throw new ArgumentNullException(nameof(whiteName));
            if (string.IsNullOrWhiteSpace(blackName)) throw new ArgumentNullException(nameof(blackName));
            if (string.IsNullOrWhiteSpace(winner)) throw new ArgumentNullException(nameof(winner));
            if (moves == null || moves.Any(move => string.IsNullOrWhiteSpace(move))) throw new ArgumentNullException(nameof(moves));
            HasStarted = true;
            WhiteName = whiteName;
            BlackName = blackName;
            Winner = winner;

            initBoard();
            followMoves(moves);
        }
        public ChessBoard(string whiteName, string blackName, double turnTimeLeft, string[] moves)
        {
            if (string.IsNullOrWhiteSpace(whiteName)) throw new ArgumentNullException(nameof(whiteName));
            if (string.IsNullOrWhiteSpace(blackName)) throw new ArgumentNullException(nameof(blackName));
            if (moves == null || moves.Any(move => string.IsNullOrWhiteSpace(move))) throw new ArgumentNullException(nameof(moves));
            HasStarted = true;
            WhiteName = whiteName;
            BlackName = blackName;
            TurnTimeLeft = turnTimeLeft;

            initBoard();
            followMoves(moves);
        }

        public bool HasStarted { get; }
        public string Winner { get; }

        public string WhiteName { get; }
        public string BlackName { get; }

        public string CurrentTurnPlayer
        {
            get
            {
                return CurrentTurnColor == PlayerColor.Black ? BlackName : WhiteName;
            }
        }
        public PlayerColor CurrentTurnColor { get; private set; }
        public double TurnTimeLeft { get; }

        private ChessPiece?[,] _board = new ChessPiece?[8, 8];
        public ChessPiece? this[int x, int y]
        {
            get
            {
                return _board[x, y];
            }
            set
            {
                _board[x, y] = value;
            }
        }

        public void MoveRepl()
        {
            Console.WriteLine("Beginning ChessBoard move REPL. Enter your move, or 'exit' to stop.");
            while (true)
            {
                Console.Write($"{CurrentTurnColor}>");
                var move = Console.ReadLine();
                if (move.ToLower() == "exit") break;
                try
                {
                    followMove(move, true);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
        }

        private void initBoard()
        {
            _board[0, 0] = new ChessPiece(PlayerColor.Black, ChessPieceType.Rook);
            _board[1, 0] = new ChessPiece(PlayerColor.Black, ChessPieceType.Knight);
            _board[2, 0] = new ChessPiece(PlayerColor.Black, ChessPieceType.Bishop);
            _board[3, 0] = new ChessPiece(PlayerColor.Black, ChessPieceType.Queen);
            _board[4, 0] = new ChessPiece(PlayerColor.Black, ChessPieceType.King);
            _board[5, 0] = new ChessPiece(PlayerColor.Black, ChessPieceType.Bishop);
            _board[6, 0] = new ChessPiece(PlayerColor.Black, ChessPieceType.Knight);
            _board[7, 0] = new ChessPiece(PlayerColor.Black, ChessPieceType.Rook);
            for (int q = 0; q < 8; q++)
            {
                _board[q, 1] = new ChessPiece(PlayerColor.Black, ChessPieceType.Pawn);
                _board[q, 6] = new ChessPiece(PlayerColor.White, ChessPieceType.Pawn);
            }
            _board[0, 7] = new ChessPiece(PlayerColor.White, ChessPieceType.Rook);
            _board[1, 7] = new ChessPiece(PlayerColor.White, ChessPieceType.Knight);
            _board[2, 7] = new ChessPiece(PlayerColor.White, ChessPieceType.Bishop);
            _board[3, 7] = new ChessPiece(PlayerColor.White, ChessPieceType.Queen);
            _board[4, 7] = new ChessPiece(PlayerColor.White, ChessPieceType.King);
            _board[5, 7] = new ChessPiece(PlayerColor.White, ChessPieceType.Bishop);
            _board[6, 7] = new ChessPiece(PlayerColor.White, ChessPieceType.Knight);
            _board[7, 7] = new ChessPiece(PlayerColor.White, ChessPieceType.Rook);
        }
        private static Regex moveRegex = new Regex(@"
            ((
              (?<movePiece>[KQBNRP][ld]?)?
              (?<fromPosition>[a-h]?[1-8]?)
              (?<takePiece>x)?
              (?<toPosition>[a-h][1-8])
              (?<promotion>[QBNR])?
            )|(?<castleMove>0-0(-0)?|O-O(-O)?))
            (?<checkAndMate>[+][+]?)?
        ", RegexOptions.IgnorePatternWhitespace);
        private void followMoves(string[] moves)
        {
            CurrentTurnColor = PlayerColor.White;

            for (int q = 0; q < moves.Length; q++)
                followMove(moves[q], true);
        }
        private void followMove(string move, bool log = false)
        {
            var match = moveRegex.Match(move);
            if (!match.Success) throw new InvalidDataException("The moves can't be parsed!");

            if (match.Groups["castleMove"].Success) followCastleMove(match, log);
            else followNormalMove(match, log);

            //TODO: validate that that move doesn't put you in check
            //TODO: validate match.Groups["checkAndMate"]

            //Switch to other player's turn
            CurrentTurnColor = (CurrentTurnColor == PlayerColor.Black) ? PlayerColor.White : PlayerColor.Black;
        }
        private void followCastleMove(Match match, bool log = false)
        {
            var queenSide = match.Groups["castleMove"].Value.Length == 5;
            var y = (CurrentTurnColor == PlayerColor.White ? 7 : 0);
            int rookFrom = 0, kingTo, rookTo;
            if (queenSide)
            {
                kingTo = 2;
                rookTo = 3;
                if (this[0, y] == null || this[1, y] != null || this[2, y] != null || this[3, y] != null || this[4, y] == null) throw new InvalidDataException("Invalid castling move.");
            }
            else
            {
                kingTo = 6;
                rookTo = 5;
                if (this[4, y] == null || this[5, y] != null || this[6, y] != null || this[7, y] == null) throw new InvalidDataException("Invalid castling move.");
            }

            if (this[rookFrom, y].Value.type != ChessPieceType.Rook
             || this[rookFrom, y].Value.hasMoved
             || this[4, y].Value.type != ChessPieceType.King
             || this[4, y].Value.hasMoved)
            {
                throw new InvalidDataException("Invalid castling move.");
            }

            if (log)
            {
                var side = queenSide ? "Queen-side" : "King-side";
                Console.WriteLine($"{side} castle.");
                Console.WriteLine(ToConsoleString());
            }

            this[kingTo, y] = this[4, y].Value.move();
            this[rookTo, y] = this[rookFrom, y].Value.move();
            this[rookFrom, y] = this[4, y] = null;
        }
        private void followNormalMove(Match match, bool log = false)
        {
            //Normalize movePiece to contain just the type of piece [KQBNRP]
            var movePiece = match.Groups["movePiece"].Success ? match.Groups["movePiece"].Value : "P";
            if (movePiece.EndsWith("l") || movePiece.EndsWith("d"))
            {
                if (movePiece[movePiece.Length - 1] != (CurrentTurnColor == PlayerColor.Black ? 'd' : 'l')) throw new InvalidDataException("Moving a piece out of turn.");
                movePiece = movePiece.Substring(0, movePiece.Length - 1);
            }
            var pieceType = getPieceType(movePiece[0]);

            Func<Tuple<int, int>, bool> predicate = pos => true;
            if (!string.IsNullOrEmpty(match.Groups["fromPosition"].Value))
            {
                var fromString = match.Groups["fromPosition"].Value;
                var fromRow = char.IsLetter(fromString[0]) ? (int?)(fromString[0] - 'a') : null;
                var fromColumn = char.IsDigit(fromString[fromString.Length - 1]) ? (int?)(7 - fromString[fromString.Length - 1] - '1') : null;
                if (fromRow != null && fromColumn != null) predicate = pos => pos.Item1 == fromColumn.Value && pos.Item2 == fromRow.Value;
                else if (fromRow != null) predicate = pos => pos.Item1 == fromRow.Value;
                else predicate = pos => pos.Item2 == fromColumn.Value;
            }

            string toPosition = match.Groups["toPosition"].Value;
            int tox = toPosition[0] - 'a', toy = 7 - (toPosition[1] - '1');

            //Validate whether or not you are taking a piece
            bool takePiece = false;
            if (match.Groups["takePiece"].Success || (this[tox, toy] != null && this[tox, toy].Value.color != CurrentTurnColor))
            {
                takePiece = true;
                var pieceTaking = this[tox, toy];
                if (pieceTaking == null || pieceTaking?.color == CurrentTurnColor) throw new InvalidDataException("Can't take an empty square or your own piece!");
                //TODO: allow for en passant
            }
            else if (this[tox, toy] != null) throw new InvalidDataException("Can't move a piece onto another piece!");

            bool promoting = match.Groups["promotion"].Success;
            var promotionType = pieceType;
            if (promoting)
            {
                if (pieceType != ChessPieceType.Pawn) throw new InvalidDataException("Pieces that aren't pawns can't be promoted!");
                if (toy != (CurrentTurnColor == PlayerColor.White ? 0 : 7)) throw new InvalidDataException("Pawns can't be promoted until they reach the end row.");
                promotionType = getPieceType(match.Groups["promotion"].Value[0]);
            }
            else if (pieceType == ChessPieceType.Pawn && toy == (CurrentTurnColor == PlayerColor.White ? 0 : 7)) throw new InvalidDataException("Moving a pawn to the end row must specify a pawn promotion.");

            //Find all piece possibilities
            var possibilities = findPiecePossibilities(pieceType, tox, toy, takePiece)
                .Where(pos => pos.Item1 >= 0 && pos.Item1 <= 7 && pos.Item2 >= 0 && pos.Item2 <= 7)
                .Where(pos => this[pos.Item1, pos.Item2]?.type == pieceType && this[pos.Item1, pos.Item2]?.color == CurrentTurnColor)
                .Where(predicate)
                .ToArray();
            if (possibilities.Length == 0) throw new InvalidDataException("Could not find piece that matches move.");
            else if (possibilities.Length > 1) throw new InvalidDataException("Could not find a single best move that matches move syntax.");
            int fromx = possibilities[0].Item1, fromy = possibilities[0].Item2;
            var pieceMoved = this[tox, toy] = this[fromx, fromy]?.move(promotionType);
            this[fromx, fromy] = null;

            if (log)
            {
                var ptString = pieceType.ToString();
                var capture = takePiece ? "to capture the piece at" : "to";
                var promotion = promoting ? $" Promote to {promotionType.ToString()}." : "";
                Console.WriteLine($"Move the {ptString} at {(char)('A' + fromx)}{8 - fromy} {capture} {(char)('A' + tox)}{8 - toy}.{promotion}");
                Console.WriteLine(this.ToConsoleString());
            }
        }
        private ChessPieceType getPieceType(char chr)
        {
            switch (chr)
            {
            case 'K':
                return ChessPieceType.King;
            case 'Q':
                return ChessPieceType.Queen;
            case 'N':
                return ChessPieceType.Knight;
            case 'B':
                return ChessPieceType.Bishop;
            case 'R':
                return ChessPieceType.Rook;
            case 'P':
                return ChessPieceType.Pawn;

            default:
                throw new InvalidOperationException();
            }
        }

        private IEnumerable<Tuple<int, int>> findPiecePossibilities(ChessPieceType type, int tox, int toy, bool takePiece)
        {
            switch (type)
            {
                case ChessPieceType.King:
                    return findKingPossibilities(tox, toy, takePiece);
                case ChessPieceType.Queen:
                    return findQueenPossibilities(tox, toy, takePiece);
                case ChessPieceType.Bishop:
                    return findBishopPossibilities(tox, toy, takePiece);
                case ChessPieceType.Rook:
                    return findRookPossibilities(tox, toy, takePiece);
                case ChessPieceType.Knight:
                    return findKnightPossibilities(tox, toy, takePiece);
                case ChessPieceType.Pawn:
                    return findPawnPossibilities(tox, toy, takePiece);
                default:
                    throw new ArgumentException(nameof(type));
            }
        }

        private IEnumerable<Tuple<int, int>> findKingPossibilities(int tox, int toy, bool takePiece)
        {
            yield return new Tuple<int, int>(tox - 1, toy - 1);
            yield return new Tuple<int, int>(tox, toy - 1);
            yield return new Tuple<int, int>(tox + 1, toy - 1);
            yield return new Tuple<int, int>(tox - 1, toy);
            yield return new Tuple<int, int>(tox + 1, toy);
            yield return new Tuple<int, int>(tox - 1, toy + 1);
            yield return new Tuple<int, int>(tox, toy + 1);
            yield return new Tuple<int, int>(tox + 1, toy + 1);
        }
        private IEnumerable<Tuple<int, int>> findQueenPossibilities(int tox, int toy, bool takePiece)
        {
            foreach (var move in findRookPossibilities(tox, toy, takePiece))
                yield return move;
            foreach (var move in findBishopPossibilities(tox, toy, takePiece))
                yield return move;
        }
        private IEnumerable<Tuple<int, int>> findRookPossibilities(int tox, int toy, bool takePiece)
        {
            for (int q = tox + 1; q < 8; q++)
            {
                yield return new Tuple<int, int>(q, toy);
                if (this[q, toy] != null) break;
            }
            for (int q = tox - 1; q >= 0; q--)
            {
                yield return new Tuple<int, int>(q, toy);
                if (this[q, toy] != null) break;
            }
            for (int q = toy + 1; q < 8; q++)
            {
                yield return new Tuple<int, int>(tox, q);
                if (this[tox, q] != null) break;
            }
            for (int q = toy - 1; q >= 0; q--)
            {
                yield return new Tuple<int, int>(tox, q);
                if (this[tox, q] != null) break;
            }
        }
        private IEnumerable<Tuple<int, int>> findBishopPossibilities(int tox, int toy, bool takePiece)
        {
            for (int q = 1; q < 8; q++)
            {
                if (tox + q > 7 || toy + q > 7) break;
                yield return new Tuple<int, int>(tox + q, toy + q);
                if (this[tox + q, toy + q] != null) break;
            }
            for (int q = 1; q < 8; q++)
            {
                if (tox - q < 0 || toy + q > 7) break;
                yield return new Tuple<int, int>(tox - q, toy + q);
                if (this[tox - q, toy + q] != null) break;
            }
            for (int q = 1; q < 8; q++)
            {
                if (tox + q > 7 || toy - q < 0) break;
                yield return new Tuple<int, int>(tox + q, toy - q);
                if (this[tox + q, toy - q] != null) break;
            }
            for (int q = 1; q < 8; q++)
            {
                if (tox - q < 0 || toy - q < 0) break;
                yield return new Tuple<int, int>(tox - q, toy - q);
                if (this[tox - q, toy - q] != null) break;
            }
        }
        private IEnumerable<Tuple<int, int>> findKnightPossibilities(int tox, int toy, bool takePiece)
        {
            yield return new Tuple<int, int>(tox - 2, toy - 1);
            yield return new Tuple<int, int>(tox - 1, toy - 2);
            yield return new Tuple<int, int>(tox + 2, toy - 1);
            yield return new Tuple<int, int>(tox + 1, toy - 2);
            yield return new Tuple<int, int>(tox - 2, toy + 1);
            yield return new Tuple<int, int>(tox - 1, toy + 2);
            yield return new Tuple<int, int>(tox + 2, toy + 1);
            yield return new Tuple<int, int>(tox + 1, toy + 2);
        }
        private IEnumerable<Tuple<int, int>> findPawnPossibilities(int tox, int toy, bool takePiece)
        {
            yield return new Tuple<int, int>(tox, toy - 1);
            yield return new Tuple<int, int>(tox, toy + 1);
            if (toy == 3 && !takePiece) yield return new Tuple<int, int>(tox, toy - 2);
            if (toy == 4 && !takePiece) yield return new Tuple<int, int>(tox, toy + 2);
            if (takePiece)
            {
                yield return new Tuple<int, int>(tox - 1, toy - 1);
                yield return new Tuple<int, int>(tox + 1, toy - 1);
                yield return new Tuple<int, int>(tox - 1, toy + 1);
                yield return new Tuple<int, int>(tox + 1, toy + 1);
            }
        }

        public static Stream GetSampleXML()
        {
            return File.OpenRead("sample-chessboard.xml");
        }

        public static ChessBoard FromString(string str)
        {
            return FromStringAsync(str).Result;
        }
        public static ChessBoard FromStream(Stream stream)
        {
            return FromStreamAsync(stream).Result;
        }
        public static async Task<ChessBoard> FromStringAsync(string str)
        {
            return await FromStreamAsync(new MemoryStream(Encoding.UTF8.GetBytes(str)));
        }
        public static async Task<ChessBoard> FromStreamAsync(Stream stream)
        {
            bool? hasStarted = null;
            string[] playerNames = new string[2];
            PlayerColor[] playerColors = new PlayerColor[2];
            int playersReceived = 0;
            string winner = null;
            double? turnTimeLeft = null;
            List<string> moves = new List<string>();

            var settings = new XmlReaderSettings();
            settings.Async = true;
            using (var xml = XmlReader.Create(stream, settings))
            while (await xml.ReadAsync())
            {
                if (!xml.IsStartElement()) continue;
                if (xml.Name == "Game")
                {
                    if (hasStarted != null) throw new InvalidDataException();
                    hasStarted = xml.GetAttribute("HasStarted") == "true";
                    winner = xml.GetAttribute("Winner");
                }
                else if (xml.Name == "Player")
                {
                    if (playersReceived >= 2) throw new InvalidDataException();
                    playerNames[playersReceived] = xml.GetAttribute("Name");
                    playerColors[playersReceived] = xml.GetAttribute("Color") == "Black" ? PlayerColor.Black : PlayerColor.White;
                    playersReceived++;
                }
                else if (xml.Name == "Turn")
                {
                    if (turnTimeLeft != null) throw new InvalidDataException();
                    string timeLeftString = xml.GetAttribute("TimeLeft");
                    double timeLeftDouble;
                    if (!double.TryParse(timeLeftString, out timeLeftDouble)) throw new InvalidDataException("Invalid turn element!");
                    turnTimeLeft = timeLeftDouble;
                }
                else if (xml.Name == "Board")
                {
                    while (await xml.ReadAsync())
                    {
                        if (!xml.IsStartElement("Move")) break;
                        moves.Add(await xml.ReadElementContentAsStringAsync());
                    }
                }
                else throw new InvalidDataException("Invalid ChessBoard xml!");
            }

            if (hasStarted == null) throw new InvalidDataException();

            //If the game hasn't started, just return an empty ChessBoard
            if (!hasStarted.Value) return new ChessBoard();

            //Validate input when the game has started...
            if (playersReceived != 2) throw new InvalidDataException();
            if (playerNames.Any(name => string.IsNullOrWhiteSpace(name))) throw new InvalidDataException();
            if (!playerColors.Any(color => color == PlayerColor.White) || !playerColors.Any(color => color == PlayerColor.Black)) throw new InvalidDataException();

            string whiteName = playerColors[0] == PlayerColor.White ? playerNames[0] : playerNames[1];
            string blackName = playerColors[0] == PlayerColor.White ? playerNames[1] : playerNames[0];

            if (!string.IsNullOrWhiteSpace(winner)) return new ChessBoard(whiteName, blackName, winner, moves.ToArray());

            //Validate input when the game hasn't ended yet...
            if (turnTimeLeft == null) throw new InvalidDataException();

            return new ChessBoard(whiteName, blackName, turnTimeLeft.Value, moves.ToArray());
        }

        public string Serialize()
        {
            throw new NotImplementedException();
        }
        public string ToConsoleString()
        {
            StringBuilder sb = new StringBuilder();
            for (int row = 0; row < 8; row++)
            {
                sb.Append((8 - row) + "  ");
                for (int col = 0; col < 8; col++)
                {
                    var piece = this[col, row];
                    sb.Append(" " + (piece?.ToConsoleString() ?? "- "));
                }
                sb.Append("\r\n");
            }
            sb.Append("\r\n    A  B  C  D  E  F  G  H");
            var utf_board = sb.ToString();

            return utf_board;
//            if (!HasStarted) return $"The chess game has not started yet.\r\n\r\nBoard:\r\n{utf_board}";
//            else if (!string.IsNullOrWhiteSpace(Winner)) return $"{Winner} wins!\r\n\r\nBoard:\r\n{utf_board}";
//            else return $@"Players:
//{WhiteName} is White, {BlackName} is Black.
//{CurrentTurnPlayer} has {(int)TurnTimeLeft} seconds left to move.

//{utf_board}";
        }
    }
}
