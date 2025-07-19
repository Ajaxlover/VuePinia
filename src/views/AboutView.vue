<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

console.log(counter)

const toIncrement = () => {
  counter.increment()
}
</script>
<template>
  <div class="about">
    <h1>组件公共属性**{{ counter.doubleCount }}</h1>
    <h1>组件公共属性{{ counter.count }}</h1>
    <button @click="toIncrement">+1</button>
    <button @click="counter.incrementAsync()">3s后+1</button>
    <div>github page 自动化部署</div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
