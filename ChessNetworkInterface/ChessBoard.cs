using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;

namespace ChessNetworkInterface
{
    public class ChessBoard
    {
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
            string[] playerColors = new string[2];
            int playersReceived = 0;
            string turnName = null;
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
                    playerColors[playersReceived] = xml.GetAttribute("Color");
                    playersReceived++;
                }
                else if (xml.Name == "Turn")
                {
                    if (turnName != null || turnTimeLeft != null) throw new InvalidDataException();
                    turnName = xml.GetAttribute("Name");
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
            if (hasStarted.Value)
            {
                if (playersReceived != 2) throw new InvalidDataException();
                if (playerNames.Any(name => string.IsNullOrWhiteSpace(name))) throw new InvalidDataException();
                if (!playerColors.Any(color => color == "White") || !playerColors.Any(color => color == "Black")) throw new InvalidDataException();
                if (string.IsNullOrWhiteSpace(winner))
                {
                    if (turnName == null || turnTimeLeft == null) throw new InvalidDataException();
                }
                //TODO: validate board/list of moves
            }

            return null;
        }

        public string Serialize()
        {
            throw new NotImplementedException();
        }
    }
}

//Needs to store information:
//Player names
//Has game started?
//Whose turn is it?
