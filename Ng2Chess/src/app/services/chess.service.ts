import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/rx';

import { ApiPathBase } from '../util/config';

@Injectable()
export class ChessService {
  constructor(private http: Http) {
  }
  
  resetGame(gameName: string): Promise<boolean> {
    return this.http
      .post(ApiPathBase + `reset/${gameName}`, {})
      .map(response => response.text() == 'true')
      .share()
      .toPromise();
  }
  
  getBoard(gameName: string): Promise<any> {
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
    return this.http
      .get(ApiPathBase + `getboard/${gameName}`, { headers: headers })
      .map(response => response.json())
      .share()
      .toPromise();
  }
  
  joinGame(gameName: string, playerName: string): Promise<boolean> {
    return this.http
      .post(ApiPathBase + `joingame/${gameName}/${playerName}`, {})
      .map(response => response.text() == 'true')
      .share()
      .toPromise();
  }
  
  makeMove(gameName: string, playerName: string, move: string): Promise<[boolean, string]> {
    return this.http
      .post(ApiPathBase + `makemove/${gameName}/${playerName}/${move}`, {})
      .map<[boolean, string]>(response => response.status == 200 ? [true, ''] : [false, response.text()])
      .share()
      .toPromise();
  }
}
