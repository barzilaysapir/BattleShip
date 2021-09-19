import { EBoardWidth, EGameLevel } from "src/app/services/battleship.enum";

interface IObjectKeys {
    [key: string]: any;
}

export interface IGameLevelData extends IObjectKeys {
    gameLevel?: EGameLevel,
    amountOfShips: number,
    rows: number,
    columns: number,
    verticalMid?: number[],
    horizontalMid?: number[],
    amountOfSquares: number,
    boardWidth?: EBoardWidth,
    squareWidthInPercent?: number,
}

export interface IFormInput {
    label: string,
    formControlName: string,
    isValidator?: boolean
}