import * as express from 'express';
import { Controller, Get, Post } from 'miter';
import { ChessService } from '../services/chess.service';

@Controller({})
export class ChessController {
  constructor(private chessService: ChessService) {
  }

  @Post('/reset/:game')
  async reset(req: express.Request, res: express.Response) {
    let gameName = req.params['game'];
    let success = this.chessService.deleteGame(gameName);
    res.status(200).send(success ? 'true' : 'false');
  }

  @Get('/getboard/:game')
  async getboard(req: express.Request, res: express.Response) {
    let gameName = req.params['game'];
    let game = this.chessService.getOrCreateGame(name);
    res.status(200).send(game.toXml());
  }

  @Post('/joingame/:game/:player')
  async joingame(req: express.Request, res: express.Response) {
    let gameName = req.params['game'];
    let playerName = req.params['player'];
    let success = this.chessService.addPlayerToGame(gameName, playerName);
    res.status(200).send(success ? 'true' : 'false');
  }

  @Post('/makemove/:game/:player/:move')
  async makemove(req: express.Request, res: express.Response) {
    let gameName = req.params['game'];
    let playerName = req.params['player'];
    let move = req.params['move'];
    let success = this.chessService.playerMadeMove(gameName, playerName, move);
    res.status(200).send(success ? 'true' : 'false');
  }
}
