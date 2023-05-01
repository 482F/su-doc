<template>
  <div class="cell">
    <div class="num" v-if="cell.num">{{ cell.num }}</div>
    <template v-else>
      <input @input="updateNum" type="text" class="input" />
      <div class="nums">
        <div
          class="snum"
          v-for="num of Array(9)
            .fill(0)
            .map((_, i) => i + 1)"
        >
          {{ cell[num] ? num : '&nbsp;' }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Cell } from './main-component.vue'

const $emit = defineEmits<{
  (e: 'update:num', value: number): void
}>()

function updateNum(e: { target: { value: string } }) {
  const value = e.target.value
  if (!value.match(/\d/)) {
    return
  }
  $emit('update:num', Number(value))
}

defineProps<{ cell: Cell }>()
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
