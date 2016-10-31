using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace ChessNetworkInterface
{
    public class Program
    {
        static void Main(string[] args)
        {
            ChessBoard board = getChessboard().Result;
        }

        private static async Task<ChessBoard> getChessboard()
        {
            using (var stream = ChessBoard.GetSampleXML())
                return await ChessBoard.FromStreamAsync(stream);
        }
    }
}
