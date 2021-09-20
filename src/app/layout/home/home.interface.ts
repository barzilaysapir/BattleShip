import { EBoardWidth, EGameLevel } from "src/app/services/battleship.enum";

interface IObjectKeys {
    [key: string]: any;
}

export interface IGameLevelData extends IObjectKeys {
    gameLevel?: EGameLevel,
    amountOfShips: number,
    rows: number,
    columns: number,
    amountOfSquares: number,
    boardWidth?: EBoardWidth,
    squareWidthInPercent?: number,
    isRhambous: boolean,
    rhambous?: IRhambousData
}

interface IRhambousData {
    verticalMid: number[],
    horizontalMid: number[],
}

export interface IFormInput {
    label: string,
    formControlName: string,
    isValidator?: boolean
}