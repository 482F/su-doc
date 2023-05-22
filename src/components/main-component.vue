<template>
  <div>
    <div class="board">
      <cell
        class="cell"
        :class="{
          top: Math.floor(i / 9) % 3 === 0,
          bottom: Math.floor(i / 9) % 3 === 2,
          left: i % 3 === 0,
          right: i % 3 === 2,
        }"
        v-for="(cell, i) of board.flatMap((row) => row)"
        :cell="cell"
        @update:num="
          (newNum) => {
            if (newNum !== null) {
              cell.num = newNum
              cell.updateBy()
            }
            focusNext(i)
          }
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Cell from './cell.vue'
import { createBoard } from '../utils/sudoku'

onMounted(() => {
  ;(document.querySelector('.cell') as HTMLElement)?.focus()
})

const focusNext = (thisI: number) => {
  const cellDOMs = document.querySelectorAll('.cell')
  ;(cellDOMs[(thisI + 1) % cellDOMs.length] as HTMLElement).focus()
}
const board = createBoard()

board.resolve()
</script>

<style scoped>
.board {
  display: grid;
  grid-template: repeat(9, auto) / repeat(9, auto);
  border: 2px solid gray;
  > .right {
    border-right: 2px solid gray;
  }
  > .left {
    border-left: 2px solid gray;
  }
  > .top {
    border-top: 2px solid gray;
  }
  > .bottom {
    border-bottom: 2px solid gray;
  }
}
</style>
