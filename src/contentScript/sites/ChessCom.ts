import ChessBoard from '../ChessBoard'

type Square = {
  color: string
  piece: string
} | null

type SquarePosition = {
  column: number
  row: number
}

export default class ChessCom implements ChessBoard {
  public boardType: 'canvas' | 'html' = 'canvas'
  public whiteToMove: boolean = true
  public fen: string = ''

  constructor(whiteToMove: boolean) {
    this.whiteToMove = whiteToMove
    this.detectBoardType()
  }

  getFromSquare(fromCol: number, fromRow: number) {
    return document.querySelector(`.piece.square-${fromCol}${fromRow}`) as HTMLElement
  }

  drawArrow(to: SquarePosition) {
    const existingArrow = document.querySelector('.unfun-chess-arrow')
    if (existingArrow) {
      existingArrow.remove()
    }

    const board = document.querySelector('wc-chess-board') as HTMLElement
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

  async detectBoardType() {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      this.boardType = 'canvas'
    } else {
      this.boardType = 'html'
    }
  }

  getFen() {
    if (this.boardType === 'canvas') {
      return this.getFenCanvas()
    } else {
      return this.getFenHtml()
    }
  }

  getFenCanvas() {
    return ''
  }

  clearBoard() {
    document.querySelectorAll('.unfun-chess-arrow').forEach((arrow) => arrow.remove())
    const pieces = document.querySelectorAll('.piece')
    pieces.forEach((piece) => {
      piece.classList.remove('bestmove')
    })
  }

  getFenHtml() {
    const squares: Square[] = []
    let row = 8,
      column = 1
    for (let i = 1; i <= 64; i++) {
      if (column > 8) {
        column = 1
        row--
      }

      if (row < 1) {
        row = 8
      }

      const piece = document.querySelector(`.piece.square-${column}${row}`) as HTMLElement
      if (piece) {
        const pieceClass = Array.from(piece.classList).find((c) => c.length === 2)
        if (!pieceClass) throw new Error('Piece class not found')
        squares.push({
          color: pieceClass[0],
          piece: pieceClass[1],
        })
      } else {
        squares.push(null)
      }

      column++
    }

    return this.squaresToFen(squares)
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
