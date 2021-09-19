import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EGameState } from 'src/app/services/battleship.enum';
import { IRhambousDetails, ISquareItem } from '../game-board.interface';

@Component({
  selector: 'app-game-board-square',
  templateUrl: './game-board-square.component.html',
  styleUrls: ['./game-board-square.component.scss']
})

export class GameBoardSquareComponent implements OnInit {
  @Output() squareClickedEmit: EventEmitter<ISquareItem> = new EventEmitter<ISquareItem>();

  @Input() square: ISquareItem;
  @Input() gameState: EGameState;
  @Input() rhambous: IRhambousDetails;

  public EGameState: typeof EGameState;
  public isInBorders: boolean;

  constructor() {
    this.square = {} as ISquareItem;
    this.gameState = EGameState.PLAYING;
    this.EGameState = EGameState;

    this.rhambous = {} as IRhambousDetails;
    this.isInBorders = false;
  }

  ngOnInit(): void {
    this.isInBorders = this.checkIfInBorders();
  }

  private checkIfInBorders(): boolean {
    if (!this.rhambous.isRhambous
      ||
      this.rhambous.verMid.some(midPoint => midPoint === this.rhambous.rowI)
      ||
      this.rhambous.horMid.some(midPoint => midPoint === this.rhambous.squareI % this.rhambous.rows))
      return true;

    let multi = this.rhambous.rowI + (this.rhambous.rowI + 1);

    if (this.rhambous.verMid.every(midPoint => midPoint < this.rhambous.rowI)) {
      let temp = this.rhambous.rows - this.rhambous.rowI;
      multi = temp - 1 + temp;
    }

    let max = this.rhambous.columns;
    let min = this.rhambous.rows;
    if (this.rhambous.rows > this.rhambous.columns) {
      let max = this.rhambous.rows;
      let min = this.rhambous.columns
    }
    multi *= (max / min);

    let start = this.rhambous.columns / 2 - multi / 2;
    let end = this.rhambous.columns / 2 + multi / 2;
    // console.log(multi, this.rhambous.rowI);
    // console.log("squareI: " + this.rhambous.squareI);
    // console.log("start: " + start, "end: " + end);

    this.square.isInBorders = this.rhambous.squareI >= start && this.rhambous.squareI <= end;
    return this.square.isInBorders;
  }

  public squareClicked(square: ISquareItem): void {
    this.squareClickedEmit.emit(square);
  }

}
