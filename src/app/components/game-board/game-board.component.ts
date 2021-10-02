import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EBoardWidth, EGameState } from 'src/app/services/battleship.enum';

import { IGameLevelData } from 'src/app/layout/home/home.interface';
import { IAxes, INewShipDetails, IShipsAmountsList, IShipsSizesRange, ISquareItem } from './game-board.interface';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})

export class GameBoardComponent implements OnInit {
  private shipSizesRange: IShipsSizesRange;
  private largestShipImg: number;
  private _gameState: EGameState;
  private _gameData: IGameLevelData;

  public rows: void[];
  public strikesCounter: number;
  public axesLabels: IAxes;
  public boardSquaresArr: ISquareItem[];
  public shipsAmountsList: IShipsAmountsList[];
  public EGameState: typeof EGameState;
  public EBoardWidth: typeof EBoardWidth;

  @Output() gameStateChanged: EventEmitter<EGameState> = new EventEmitter<EGameState>();
  @Output() shipsAmountListChanged: EventEmitter<IShipsAmountsList[]> = new EventEmitter<IShipsAmountsList[]>();

  @Input()
  get data(): IGameLevelData { return this._gameData };
  set data(gameData: IGameLevelData) {
    if (Object.keys(this._gameData).length !== 0 && gameData !== this._gameData) {
      this._gameData = gameData;
      this.setGameLevel();
    } else {
      this._gameData = gameData;
    }
    this.startNewGame();
  }

  @Input()
  get gameState(): EGameState { return this._gameState };
  set gameState(gameState: EGameState) {
    this._gameState = gameState;
    if (this.strikesCounter === this.data.amountOfShips && gameState === EGameState.PLAYING) {
      this.startNewGame();
    }
  }

  constructor() {
    this.rows = [];
    this.strikesCounter = 0;
    this.shipSizesRange = { min: 1, max: 7 };
    this.largestShipImg = 7;
    this.boardSquaresArr = [];
    this.shipsAmountsList = [];

    this._gameData = {} as IGameLevelData;
    this.data = {} as IGameLevelData;
    this.axesLabels = {} as IAxes;
    this._gameState = EGameState.PLAYING;

    this.EGameState = EGameState;
    this.EBoardWidth = EBoardWidth;
  }

  ngOnInit(): void {
    this.setGameLevel();
    this.startNewGame();
  }

  private setGameLevel(): void {
    this.data = Object.assign(this.data, {
      squareWidthInPercent: 100 / this.data.columns,
      amountOfSquares: this.data.rows * this.data.columns,
      boardWidth: this.data.columns >= 20 ? EBoardWidth.WIDE
        : this.data.columns <= 10 ? EBoardWidth.THIN
          : EBoardWidth.NORMAL
    });

    this.rows = new Array(this.data.rows);
    this.createAxiesLabels();

    if (this.largestShipImg < Math.max(this.data.rows, this.data.columns)) {
      this.shipSizesRange.max = this.largestShipImg;
    } else {
      this.shipSizesRange.max = Math.max(this.data.rows, this.data.columns);
    }
  }

  private createAxiesLabels(): void {
    this.axesLabels.x = [];
    this.axesLabels.y = [];

    for (let i = 1; i <= this.data.columns; i++) {
      this.axesLabels.x.push((i + 9).toString(36).toUpperCase());
    }

    for (let i = 1; i <= this.data.rows; i++) {
      this.axesLabels.y.push(i);
    }
  }

  private createBoardSquaresList(): void {
    this.boardSquaresArr = [];

    for (let i = 0; i < this.data.amountOfSquares; i++) {
      this.boardSquaresArr.push({
        id: i,
        isShip: false,
        isClicked: false,
        shipId: -1,
        shipSize: -1,
        isInBorders: true
      });
    }
  }

  private setBoardBorders(): void {
    if (this.data.isRhambous) {
      this.data.rhambous = {
        verticalMid: this.getBoardMidPoints(this.data.rows),
        horizontalMid: this.getBoardMidPoints(this.data.columns)
      }

      const isOdd: number = +(this.data.columns % 2 !== 0);
      const ratio: number = this.data.columns / this.data.rows;

      let currentRow: number = 0;
      let currentColumn: number = 0;
      let amountToShow: number;
      let rowStartPoint: number;
      let rowEndPoint: number;

      this.boardSquaresArr.forEach(square => {
        currentRow = Math.floor(square.id / this.data.columns);
        currentColumn = square.id - currentRow * this.data.columns;

        if (currentColumn === 0) {
          let tempCurrentRow = currentRow;
          if (this.data.rhambous?.verticalMid.every(midPoint => midPoint <= currentRow)) {
            tempCurrentRow = this.data.rows - (currentRow + 1);
          }
          amountToShow = Math.round(ratio * (tempCurrentRow + 1)) * 2 - isOdd;
          rowStartPoint = (this.data.columns - amountToShow) / 2;
          rowEndPoint = rowStartPoint + amountToShow;
        }

        if (rowStartPoint <= currentColumn && rowEndPoint > currentColumn) {
          square.isInBorders = true;
        } else {
          square.isInBorders = false;
        }
      });

    } else {
      this.boardSquaresArr.forEach(square => square.isInBorders = true);
    }
  }

  private getBoardMidPoints(param: number): number[] {
    let mid: number[] = [Math.floor(param / 2)];
    if (param % 2 === 0)
      mid.push(mid[0] - 1);
    return mid;
  }

  private createShipsAmountsList(): void {
    this.shipsAmountsList = []

    for (let i = 0; i <= this.largestShipImg; i++) {
      this.shipsAmountsList.push({ onBoard: 0, sunk: 0 });
    }
  }

  private createAllShips(): void {
    for (let i = 0; i < this.data.amountOfShips; i++) {
      const getRandomSquareIndex = (): number => Math.floor(Math.random() * this.data.amountOfSquares);

      const currentShip: INewShipDetails = {
        index: i,
        isVertical: Boolean(Math.round(Math.random())),
        randomShipSize: Math.floor(Math.random() * this.shipSizesRange.max) + this.shipSizesRange.min,
        randomSquareI: getRandomSquareIndex()
      }

      while (this.boardSquaresArr[currentShip.randomSquareI].isShip
        || !this.boardSquaresArr[currentShip.randomSquareI].isInBorders) {
        currentShip.randomSquareI = getRandomSquareIndex();
      }

      this.buildCurrentShip(currentShip);
    }

    this.shipsAmountListChanged.emit(this.shipsAmountsList);
  }

  private buildCurrentShip(ship: INewShipDetails): void {
    let currentShipSize: number = 0;

    for (let j = 0;
      j < ship.randomShipSize * (ship.isVertical ? this.data.columns : 1);
      ship.isVertical ? j += this.data.columns : j++
    ) {
      if (ship.randomSquareI + j >= this.data.amountOfSquares ||
        this.boardSquaresArr[ship.randomSquareI + j].isShip ||
        !this.boardSquaresArr[ship.randomSquareI + j].isInBorders ||
        (j !== 0 && (ship.randomSquareI + j) % (ship.isVertical ? this.data.rows : this.data.columns) === 0)
      ) break;

      this.boardSquaresArr[ship.randomSquareI + j] = {
        ... this.boardSquaresArr[ship.randomSquareI + j],
        isShip: true,
        shipId: ship.index,
        isFirstSquareOfShip: j === 0,
        shipSize: 1,
        isVertical: ship.isVertical
      }
      currentShipSize++;
    }

    this.shipsAmountsList[currentShipSize].onBoard++;

    if (currentShipSize > 1) {
      this.boardSquaresArr.map(square => square.shipId === ship.index && (square.shipSize = currentShipSize));
    }
  }

  private startNewGame(): void {
    this.strikesCounter = 0;
    this.createBoardSquaresList();
    this.setBoardBorders();
    this.createShipsAmountsList();
    this.createAllShips();
  }


  public trackByFn(index: number): number {
    return index;
  }

  public squareClicked(squareIndex: number, square: ISquareItem): void {
    this.boardSquaresArr[squareIndex].isClicked = true;

    if (square.isShip) {
      let currentShip = this.boardSquaresArr.filter(({ shipId }) => shipId === square.shipId);

      if (currentShip.every(square => square.isClicked)) {
        currentShip.map(square => square.isShipSunk = true);
        this.shipsAmountsList[square.shipSize].sunk++;
        this.strikesCounter++;
      }
    }

    if (this.strikesCounter === this.data.amountOfShips) {
      this.gameStateChanged.emit(EGameState.WON);
    }
  }

}
