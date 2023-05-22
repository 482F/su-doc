<template>
  <div class="cell" :tabindex="0" @keydown="onKeydown">
    <div class="num" v-if="value">{{ value }}</div>
    <div class="nums" v-else>
      <div class="snum" v-for="num of '789456123'.split('').map(Number)">
        {{ cell[num as Num] ? num : '&nbsp;' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import { Cell, Num, nums } from '../utils/sudoku'

const props = defineProps<{ cell: Cell }>()

const $emit = defineEmits<{
  (e: 'update:num', value: Num | null): void
}>()

const value: Ref<string> = ref(String(props.cell.num ?? ''))
const error = ref(false)

watch(
  () => props.cell.num,
  () => (value.value = String(props.cell.num))
)

function onKeydown(e: KeyboardEvent) {
  const char = e.key
  if (char === 'Enter') {
    $emit('update:num', null)
    return
  } else if (char.length !== 1) {
    return
  }
  value.value = char
  const num = Number(value.value)
  if (!((num): num is Num => nums.includes(num as Num))(num)) {
    error.value = true
    return
  }
  $emit('update:num', num)
}
</script>

<style scoped>
.cell {
  height: 80px;
  width: 80px;
  border: 1px solid lightgray;

  display: grid;
  align-content: center;
  position: relative;
  .input {
    position: absolute;
    opacity: 0.3;
  }
  .num {
    font-size: 30px;
  }
  .nums {
    display: grid;
    grid-template: repeat(3, auto) / repeat(3, auto);
  }
}
</style>
