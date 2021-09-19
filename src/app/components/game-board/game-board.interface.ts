export interface ISquareItem {
    isShip: boolean,
    isClicked: boolean,
    shipId: number,
    shipSize: number,
    isFirstSquareOfShip?: boolean,
    isShipSunk?: boolean,
    isVertical?: boolean,
    isInBorders?: boolean,
}

export interface INewShipDetails {
    index: number,
    isVertical: boolean,
    randomShipSize: number,
    randomSquareI: number
}

export interface IAxes {
    x: string[],
    y: number[],
}

export interface IShipsAmountsList {
    onBoard: number,
    sunk: number
}

export interface IShipsSizesRange {
    min: number,
    max: number
}

export interface IRhambousDetails {
    isRhambous: boolean,
    rows: number,
    columns: number,
    rowI: number,
    squareI: number
    verMid: number[],
    horMid: number[],
}
