export interface ISquareItem {
    id: number,
    isShip: boolean,
    isClicked: boolean,
    shipId: number,
    shipSize: number,
    isInBorders: boolean,
    isFirstSquareOfShip?: boolean,
    isShipSunk?: boolean,
    isVertical?: boolean,
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