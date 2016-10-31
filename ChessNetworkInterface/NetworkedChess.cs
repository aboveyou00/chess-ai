using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;

namespace ChessNetworkInterface
{
    public class NetworkedChess
    {
        public NetworkedChess(IPAddress addr, string gameName, string yourname)
        {
            ServerAddress = addr;
            GameName = gameName;
            Name = yourname;
        }

        public IPAddress ServerAddress { get; private set; }
        public string GameName { get; private set; }
        public string Name { get; private set; }
        
        public async Task<bool> Reset()
        {
            var req = WebRequest.Create(new Uri($"http://{ServerAddress}/reset/{GameName}"));
            req.Method = Http.Post;
            req.ContentLength = 0;

            var res = (HttpWebResponse)(await req.GetResponseAsync());
            using (var reader = new StreamReader(res.GetResponseStream()))
                return "true" == await reader.ReadToEndAsync();
        }
        public async Task<ChessBoard> GetBoard()
        {
            var req = WebRequest.Create(new Uri($"http://{ServerAddress}/getboard/{GameName}"));
            req.Method = Http.Get;
            req.ContentLength = 0;

            var res = (HttpWebResponse)(await req.GetResponseAsync());
            using (var reader = new StreamReader(res.GetResponseStream()))
                return ChessBoard.FromString(await reader.ReadToEndAsync());
        }
        public async Task<bool> JoinGame()
        {
            var req = WebRequest.Create(new Uri($"http://{ServerAddress}/joingame/{GameName}/{Name}"));
            req.Method = Http.Post;
            req.ContentLength = 0;

            var res = (HttpWebResponse)(await req.GetResponseAsync());
            using (var reader = new StreamReader(res.GetResponseStream()))
                return "true" == await reader.ReadToEndAsync();
        }
        public async Task<bool> MakeMove(string move)
        {
            var req = WebRequest.Create(new Uri($"http://{ServerAddress}/makemove/{GameName}/{Name}/{move}"));
            req.Method = Http.Post;
            req.ContentLength = 0;

            var res = (HttpWebResponse)(await req.GetResponseAsync());
            using (var reader = new StreamReader(res.GetResponseStream()))
                return "true" == await reader.ReadToEndAsync();
        }
    }
}
