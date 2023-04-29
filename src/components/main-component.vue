<template>
  <div>
    <div class="board">
      <cell
        v-for="cell of board.flatMap((row) => row)"
        :cell="cell"
        @update:num="
          (newNum) => {
            cell.num = newNum
            updateBy(cell)
          }
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import Cell from './cell.vue'
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
type Num = (typeof nums)[number]
const is = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const
type I = (typeof is)[number]

type Chunk = {
  [i in I]: Cell
} & Array<Cell>

export type Cell = {
  row: Chunk
  column: Chunk
  area: Chunk
  num?: Num
} & {
  [num in Num]: boolean
}

type Board = {
  [r in I]: {
    [c in I]: Cell
  }
} & Array<Array<Cell>>

const board: Board = reactive(
  nums.map((r) =>
    nums.map((c) => Object.fromEntries([...nums.map((n) => [n, true])]))
  ) as Board
)

board.forEach((_, r) => {
  const ars = Math.floor(r / 3) * 3
  board[r].forEach((_, c) => {
    const acs = Math.floor(c / 3) * 3
    board[r][c].row = is.map((i) => board[r][i]) as Chunk
    board[r][c].column = is.map((i) => board[i][c]) as Chunk
    board[r][c].area = is.map(
      (i) => board[ars + Math.floor(i / 3)][acs + (i % 3)]
    ) as Chunk
  })
})

const str =
  '2                                                    5 5  8    7 43 59  96  71  2'
for (let r = 0; r < 9; r++) {
  for (let c = 0; c < 9; c++) {
    const s = str[r + c * 9]
    if (s !== ' ') {
      board[r][c].num = Number(s) as Num
    }
  }
}

function updateBy(cell: Cell) {
  const num = cell.num
  if (num) {
    const relatedCells = new Set([...cell.row, ...cell.column, ...cell.area])
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
        updateBy(c)
      }
    })
  }
}

;(async () => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].num) {
        updateBy(board[r][c])
        await new Promise((resolve) => setTimeout(resolve, 100))
        console.log('A')
      }
    }
  }
  console.log(board)
})()
</script>

<style scoped>
.board {
  display: grid;
  grid-template: repeat(9, auto) / repeat(9, auto);
}
</style>
