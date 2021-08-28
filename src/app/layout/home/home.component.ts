import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { EGameLevel, EGameState } from 'src/app/services/battleship.enum';

import { IFormInput, IGameLevelData } from './home.interface';
import { IShipsAmountsList } from 'src/app/components/game-board/game-board.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  public shipsAmountsList: IShipsAmountsList[];
  public gameState: EGameState;
  public gameData: IGameLevelData;

  public gameLevels: IGameLevelData;
  public formInputs: IFormInput[];
  public gameLevelFormGroup: FormGroup;

  constructor() {
    this.shipsAmountsList = [];
    this.gameState = EGameState.PLAYING;
    this.gameData = {} as IGameLevelData;

    this.gameLevels = {
      gameLevel: EGameLevel.MEDIUM,
      amountOfShips: 10,
      rows: 10,
      columns: 10,
      amountOfSquares: 100,
    }

    this.formInputs = [
      {
        label: "Ships", 
        formControlName: "amountOfShips",
        isValidator: true
      },
      {
        label: "Rows", 
        formControlName: "rows"
      },
      {
        label: "Columns", 
        formControlName: "columns"
      },
    ]

    this.gameLevelFormGroup = new FormGroup({
      amountOfShips: new FormControl(),
      rows: new FormControl(),
      columns: new FormControl(),
    })
  }

  ngOnInit(): void {
    this.gameData = this.gameLevels;
  }

  public shipsAmountsChanges(shipsAmountsList: IShipsAmountsList[]): void {
    this.shipsAmountsList = shipsAmountsList;
  }

  public gameStateChanged(newGameState: EGameState): void {
    this.gameState = newGameState;
  }

  public newGameSubmitted(inputValues?: IGameLevelData): void {
    let newGameLevel: IGameLevelData = { ...this.gameLevels, gameLevel: EGameLevel.CUSTOM };

    if (inputValues) {
      Object.entries(inputValues).forEach(([key, value]) => {
        if (value)
          newGameLevel[key as keyof IGameLevelData] = inputValues[key as keyof IGameLevelData];
      });

      if (newGameLevel.amountOfShips < newGameLevel.rows * newGameLevel.columns / 2) {
        newGameLevel = {
          ...newGameLevel,
          amountOfSquares: inputValues.rows * inputValues.columns
        };
      } else {
        newGameLevel = { ...this.gameLevels };
      }
    }

    this.gameState = EGameState.PLAYING;
    this.gameData = newGameLevel || { ...this.gameLevels };
  }
}
