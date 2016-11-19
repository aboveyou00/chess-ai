using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ChessNetworkInterface;

namespace ChessAI.Milestone04
{
    public class Program
    {
        public static void Main(string[] args)
        {
            if (args.Length == 0)
                args = new[] { "Milestone04/test-m4.xml" };
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
