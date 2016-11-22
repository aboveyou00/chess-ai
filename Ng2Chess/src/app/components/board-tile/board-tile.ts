import { Component, Input } from '@angular/core';

@Component({
  selector: 'board-tile',
  styleUrls: ['./board-tile.css'],
  templateUrl: './board-tile.html'
})
export class BoardTileComponent {
  constructor() { }
  
  @Input() piece: any;
  @Input() selected: boolean;
  @Input() validMove: boolean;
  
  get imageSource(): string {
    return `/img/${this.piece.pieceType}${this.piece.color}.png`;
  }
}
