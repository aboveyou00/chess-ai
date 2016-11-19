using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChessAI.Milestone01
{
    public class Program
    {
        public static void Main(string[] args)
        {
            if (args.Length == 0) args = new[] { "Milestone01/test-m1.txt" };
            if (args.Length == 0)
            {
                Console.WriteLine("Usage: Milestone01 <path-to-file>");
                Console.ReadKey();
                return;
            }
            
            using (var stream = File.OpenRead(args[0]))
            using (var io = new ChessIO(stream))
                foreach (var move in io)
                    Console.WriteLine($"{move}: {io.InterpretMove(move)}");
            Console.ReadKey();
        }
    }
}
