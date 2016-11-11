using ChessNetworkInterface;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Milestone02
{
    public class Program
    {
        static void Main(string[] args)
        {
            if (args.Length == 0) args = new[] { "sample-chessboard-m02.xml" };
            if (args.Length == 0)
            {
                Console.WriteLine("Usage: Milestone02 <path-to-file>");
                Console.ReadKey();
                return;
            }

            ChessBoard board;
            using (var file = File.OpenRead(args[0]))
            {
                board = ChessBoard.FromStream(file);
            }
            //Console.WriteLine(board.ToConsoleString());
            board.MoveRepl();
        }
    }
}
