const GAME_FREQ = 1000
const LIFE = '🙂'
const SUPER_LIFE = '😡'

// the model
var gBoard
var gGameInterval

function onInit() {
  gBoard = createBoard()
  renderBoard(gBoard)
  console.table(gBoard)
}

function blowUpNegs(cellI, cellJ) {
  //Neighbours loop - start
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      if (i === cellI && j === cellJ) continue
      if (gBoard[i][j] === LIFE) {
        // update model:
        gBoard[i][j] = ''
        // update DOM:
        var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
        elCell.innerText = ''
        elCell.classList.remove('occupied')
      }
    }
  }
}

function onCellClicked(elCell, cellI, cellJ) {
  if (gBoard[cellI][cellJ] === LIFE) {
    gBoard[cellI][cellJ] = SUPER_LIFE
    elCell.innerText = gBoard[cellI][cellJ]
    blowUpNegs(cellI, cellJ)
  }
}

function countNegs(rowIdx, colIdx, board) {
  var numNegs = 0
  // Neighbours loop - start
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === rowIdx && j === colIdx) continue
      // if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) negsCount++;
      // The above line wil be used in cases there are elements that occupy a cell but we don't consider them negs
      if (board[i][j]) {
        numNegs++
      }
    }
  }
  //Neighbours loop - end

  return numNegs
}

function runGeneration(board) {
  var newBoard = copyMat(board)
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      const currCell = board[i][j]
      const numNegs = countNegs(i, j, board)
      if (numNegs > 2 && numNegs < 6) {
        if (currCell === '') newBoard[i][j] = LIFE
      } else if (currCell === LIFE) newBoard[i][j] = ''
    }
  }
  //   console.table(newBoard)
  return newBoard
}

function play() {
  gBoard = runGeneration(gBoard)
  renderBoard(gBoard)
}

function onToggleGame(elBtn) {
  if (gGameInterval) {
    clearInterval(gGameInterval)
    gGameInterval = null
    elBtn.innerText = 'Start'
  } else {
    gGameInterval = setInterval(play, GAME_FREQ)
    elBtn.innerText = 'Pause'
  }
}
function renderBoard(board) {
  var strHTML = ``
  for (let i = 0; i < board.length; i++) {
    strHTML += `<tr>`
    for (let j = 0; j < board[0].length; j++) {
      var currCell = board[i][j]
      var className = currCell ? 'occupied' : ''
      strHTML += `<td class="${className}" 
      data-i="${i}" data-j="${j}" 
      onclick="onCellClicked(this,${i},${j})">${currCell}</td>`
    }
    strHTML += `</tr>`
  }
  var elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function createBoard() {
  var board = []
  for (let i = 0; i < 8; i++) {
    board.push([])
    for (let j = 0; j < 6; j++) {
      board[i][j] = Math.random() > 0.65 ? LIFE : ''
    }
  }
  return board
}
