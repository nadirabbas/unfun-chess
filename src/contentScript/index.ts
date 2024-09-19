import ChessCom from './sites/ChessCom'
import Lichess from './sites/Lichess'

// listen for ALT + N on window
let board: any
window.addEventListener('keydown', (e) => {
  if (['w', 'b'].includes(e.key)) {
    if (document.location.host === 'www.chess.com') {
      board = new ChessCom(e.key === 'w')
    } else if (document.location.host === 'lichess.org') {
      board = new Lichess(e.key === 'w')
    }
    if (!board) return

    const fen = board.getFen()
    if (fen === board.fen) return
    board.clearBoard()
    board.fen = fen

    fetch(`https://stockfish.online/api/stockfish.php?fen=${fen}&depth=13&mode=bestmove`)
      .then((res) => res.json())
      .then((res) => {
        const move = res.data.split(' ')[1]
        const from = move.slice(0, 2)
        const to = move.slice(2, 4)

        // convert alpha to numeric
        const fromCol = from[0].charCodeAt(0) - 96
        const fromRow = parseInt(from[1])

        // convert alpha to numeric
        const toCol = to[0].charCodeAt(0) - 96
        const toRow = parseInt(to[1])

        const fromSquare = board.getFromSquare(fromCol, fromRow)
        if (!fromSquare) return

        fromSquare.classList.add('bestmove')
        board.drawArrow({ column: toCol, row: toRow })
      })
  }

  if (e.key === 'c') {
    board?.clearBoard()
  }
})

// add style to html head
const style = document.createElement('style')

style.innerHTML = `.bestmove {border: 3px solid red;}`
document.head.appendChild(style)
