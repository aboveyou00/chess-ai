using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChessNetworkInterface
{
    public struct ChessPiece
    {
        public ChessPiece(PlayerColor color, ChessPieceType type, bool hasMoved = false)
        {
            this.color = color;
            this.type = type;
            this.hasMoved = hasMoved;
        }
        public PlayerColor color;
        public ChessPieceType type;
        public bool hasMoved;

        public ChessPiece move(ChessPieceType? newType = null)
        {
            return new ChessPiece(color, newType ?? this.type, true);
        }

        public string ToConsoleString()
        {
            var color = this.color == PlayerColor.Black ? "d" : "l";
            switch (type)
            {
                case ChessPieceType.King:
                    return "K" + color;
                case ChessPieceType.Queen:
                    return "Q" + color;
                case ChessPieceType.Bishop:
                    return "B" + color;
                case ChessPieceType.Rook:
                    return "R" + color;
                case ChessPieceType.Knight:
                    return "N" + color;
                case ChessPieceType.Pawn:
                    return "P" + color;

                default:
                    throw new InvalidOperationException();
            }
        }
    }

    public enum ChessPieceType
    {
        King,
        Queen,
        Bishop,
        Rook,
        Knight,
        Pawn
    }
}
