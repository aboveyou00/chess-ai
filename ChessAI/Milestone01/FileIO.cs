using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ChessAI.Milestone01
{
    public class ChessIO : IDisposable, IEnumerable<string>
    {
        public ChessIO(Stream stream)
        {
            this.stream = stream;
        }
        private Stream stream;
        
        public IEnumerator<string> GetEnumerator()
        {
            stream.Seek(0, SeekOrigin.Begin);
            using (var reader = new StreamReader(stream))
                while (!reader.EndOfStream)
                {
                    string line = reader.ReadLine();
                    if (!string.IsNullOrWhiteSpace(line)) yield return line;
                }
        }
        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
        
        private static Regex nonstandardRegex = new Regex(@"^(?<placePiece>[KQBNRP][ld])(?<placePosition>[a-h][1-8])|(?<moveFrom>[a-h][1-8])\s*(?<moveTo>[a-h][1-8])\s*((?<capturePiece>\*)|(?<moveFrom2>[a-h][1-8])\s*(?<moveTo2>[a-h][1-8])\s*)?$");
        public string InterpretMove(string move)
        {
            var match = nonstandardRegex.Match(move);
            if (!match.Success) return "Failed to match regular expression. Could not interpret chess move.";

            var placePiece = match.Groups["placePiece"];
            if (placePiece.Success)
            {
                var placePosition = match.Groups["placePosition"];
                return $"Place a {interpretPlacePiece(placePiece.Value)} at position {placePosition.Value.ToUpper()}.";
            }

            var moveFrom = match.Groups["moveFrom"];
            var moveTo = match.Groups["moveTo"];
            var capture = match.Groups["capturePiece"];
            string moveMsg = interpretMove(moveFrom.Value, moveTo.Value, capture.Success && capture.Value == "*").Capitalize();

            var moveFrom2 = match.Groups["moveFrom2"];
            var moveTo2 = match.Groups["moveTo2"];
            if (moveFrom2.Success && moveTo2.Success) moveMsg += $", and {interpretMove(moveFrom2.Value, moveTo2.Value)}";

            return moveMsg + ".";
        }
        private static Dictionary<char, string> pieceNames = new Dictionary<char, string>()
        {
            { 'K', "king" },
            { 'Q', "queen" },
            { 'B', "bishop" },
            { 'N', "knight" },
            { 'R', "rook" },
            { 'P', "pawn" }
        };
        private string interpretPlacePiece(string placePiece)
        {
            var color = placePiece.EndsWith("l") ? "white" : "black";
            if (!pieceNames.TryGetValue(placePiece[0], out string piece)) piece = "%%ERROR%%";
            return $"{color} {piece}";
        }
        private string interpretMove(string moveFrom, string moveTo, bool capture = false)
        {
            string captureMsg = "";
            if (capture) captureMsg = "capture the piece at ";
            return $"move the piece at {moveFrom.ToUpper()} to {captureMsg}{moveTo.ToUpper()}";
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls
        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing) stream.Dispose();
                disposedValue = true;
            }
        }
        public void Dispose()
        {
            Dispose(true);
        }
        #endregion
    }
}
