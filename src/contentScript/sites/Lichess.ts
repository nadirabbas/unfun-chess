import ChessBoard from '../ChessBoard'

type Square = {
  color: string
  piece: string
} | null

type SquarePosition = {
  column: number
  row: number
}

export default class Lichess implements ChessBoard {
  public boardType: 'canvas' | 'html' = 'canvas'
  public whiteToMove: boolean = true
  public fen: string = ''
  public width: number = 0
  public height: number = 0
  public squareSize: number = 0

  constructor(whiteToMove: boolean) {
    this.whiteToMove = whiteToMove
    this.detectBoardSize()
  }

  flipNumberInRange(number: number) {
    if (number >= 1 && number <= 8) {
      return 9 - number
    } else {
      console.log('Number is outside the range 1-8')
      return number
    }
  }

  getFromSquare(fromCol: number, fromRow: number) {
    fromRow = this.flipNumberInRange(fromRow)
    return document.querySelector(
      `piece[style*="transform: translate(${(fromCol - 1) * this.squareSize}px, ${
        (fromRow - 1) * this.squareSize
      }px)"]`,
    ) as HTMLElement
  }

  drawArrow(to: SquarePosition) {
    const existingArrow = document.querySelector('.unfun-chess-arrow')
    if (existingArrow) {
      existingArrow.remove()
    }

    const board = document.querySelector('cg-container') as HTMLElement
    // draw square of width 12.5% of board and height of 12.5 % of board
    const square = document.createElement('div')
    square.classList.add('unfun-chess-arrow')
    square.style.width = '12.5%'
    square.style.height = '12.5%'
    square.style.position = 'absolute'
    square.style.left = `${(to.column - 1) * 12.5}%`
    square.style.top = `${(8 - to.row) * 12.5}%`
    square.style.backgroundColor = 'red'
    square.style.opacity = '0.5'
    board.appendChild(square)
  }

  async detectBoardSize() {
    const cont = document.querySelector('cg-container') as HTMLElement
    this.width = cont.offsetWidth
    this.height = cont.offsetHeight
    this.squareSize = this.width / 8
  }

  getFen() {
    return this.getFenHtml()
  }

  getFenCanvas() {
    return ''
  }

  clearBoard() {
    document.querySelectorAll('.unfun-chess-arrow').forEach((arrow) => arrow.remove())
    const pieces = document.querySelectorAll('piece')
    pieces.forEach((piece) => {
      piece.classList.remove('bestmove')
    })
  }

  getFenHtml() {
    const squares: Square[] = []
    let row = 1,
      column = 1
    for (let i = 1; i <= 64; i++) {
      if (column > 8) {
        column = 1
        row++
      }

      const piece = document.querySelector(
        `piece[style*="transform: translate(${(column - 1) * this.squareSize}px, ${
          (row - 1) * this.squareSize
        }px)"]`,
      ) as HTMLElement
      if (piece) {
        const pieceName = Array.from(piece.classList).find(
          (c) => !['white', 'black'].includes(c),
        ) as string
        squares.push({
          color: piece.classList.contains('white') ? 'w' : 'b',
          piece: this.pieceNameToPiece(pieceName),
        })
      } else {
        squares.push(null)
      }

      column++
    }

    return this.squaresToFen(squares)
  }

  pieceNameToPiece(pieceName: string) {
    switch (pieceName) {
      case 'pawn':
        return 'p'
      case 'rook':
        return 'r'
      case 'knight':
        return 'n'
      case 'bishop':
        return 'b'
      case 'queen':
        return 'q'
      case 'king':
        return 'k'
      default:
        return ''
    }
  }

  squaresToFen(squares: Square[]) {
    let fen = ''
    let emptySquares = 0
    for (let i = 0; i < 64; i++) {
      const square = squares[i]
      if (square) {
        if (emptySquares > 0) {
          fen += emptySquares
          emptySquares = 0
        }
        fen += this.squareToFen(square)
      } else {
        emptySquares++
      }

      if ((i + 1) % 8 === 0) {
        if (emptySquares > 0) {
          fen += emptySquares
          emptySquares = 0
        }
        if (i !== 63) fen += '/'
      }
    }

    fen += ` ${this.whiteToMove ? 'w' : 'b'} - - 0 1`

    return fen
  }

  squareToFen(square: Square) {
    if (!square) return '-'
    return square.color === 'w' ? square.piece.toUpperCase() : square.piece
  }
}
