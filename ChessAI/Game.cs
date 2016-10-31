using ChessNetworkInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace ChessAI
{
    public interface ILogger
    {
        void Log(string str);
        void Log<T>(T t);
    }
    public class ConsoleLogger : ILogger
    {
        public void Log(string str)
        {
            Console.WriteLine(str);
        }
        public void Log<T>(T t)
        {
            Console.WriteLine($"{t}");
        }
    }

    public class Game
    {
        public Game(Player p, IPAddress ip, ILogger logger = null)
        {
            Player = p;
            Network = new NetworkedChess(ip, p.Name);
            Logger = logger ?? new ConsoleLogger();
        }

        public Player Player { get; }
        public NetworkedChess Network { get; }
        public ILogger Logger { get; }

        public async Task<bool> Start()
        {
            Logger.Log("Joining network game...");
            bool joined = await Network.JoinGame();
            if (joined) Logger.Log("Game joined.");
            else Logger.Log("Could not join game.");
            return joined;
        }

        public bool HasGameStarted { get; private set; }
        public bool IsMyTurn { get; private set; }

        public event EventHandler MyTurnStarted;
    }
    
    public abstract class Player
    {
        public Player(string name)
        {
            Name = name;
        }

        public string Name { get; }
    }
}
