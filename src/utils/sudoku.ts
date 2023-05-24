import { reactive } from 'vue'
export const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
export type Num = (typeof nums)[number]
const is = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const
type I = (typeof is)[number]

type Chunk = {
  [i in I]: Cell
} & Array<Cell>

export type Cell = {
  row: Chunk
  column: Chunk
  area: Chunk
  updateBy: () => void
  num?: Num
} & {
  [num in Num]: boolean
}

type Board = {
  [r in I]: {
    [c in I]: Cell
  }
} & Array<Array<Cell>> & { resolve: () => void }

export function createBoard(): Board {
  const board: Board = reactive(
    nums.map((_) =>
      nums.map((_) => Object.fromEntries([...nums.map((n) => [n, true])]))
    ) as Board
  )

  board.forEach((_, r) => {
    const ars = Math.floor(r / 3) * 3
    board[r].forEach((_, c) => {
      const acs = Math.floor(c / 3) * 3
      const cell = board[r][c]
      cell.row = is.map((i) => board[r as I][i]) as Chunk
      cell.column = is.map((i) => board[i][c as I]) as Chunk
      cell.area = is.map(
        (i) => board[ars + Math.floor(i / 3)][acs + (i % 3)]
      ) as Chunk

      cell.updateBy = function () {
        const num = cell.num
        if (num) {
          const relatedCells = new Set([
            ...cell.row,
            ...cell.column,
            ...cell.area,
          ])
          relatedCells.forEach((c) => {
            c[num] = false
          })
          relatedCells.forEach((c) => {
            if (c.num) {
              return
            }
            const trueNums = nums.filter((num) => c[num])
            if (trueNums.length === 1) {
              c.num = trueNums[0]
              c.updateBy()
            }
          })
        }
      }
    })
  })

  board.resolve = async () => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c].num) {
          board[r][c].updateBy()
          await new Promise((resolve) => setTimeout(resolve, 100))
          console.log('A')
        }
      }
    }
    console.log(board)
  }

  return board
}
