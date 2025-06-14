<script setup>
import { ref } from 'vue'
let r = ref('哈哈哈哈')
// 获取环境变量
console.log(import.meta.env)
let toy = ref('玩具1')
let toy2 = ref('玩具2')
let toy3 = ref('子组件属性')

function sonMethod() {
  console.log('子组件方法')
}
defineProps({
  msg: {
    type: String,
    required: true,
  },
  sendToy: {
    type: Function,
    required: false,
  },
})

defineExpose({
  toy3,
  sonMethod,
})

const emit = defineEmits(['send-toy2'])
// 使用 emit('send-toy2', toy2)  触发子组件自定义事件
</script>

<template>
  <div class="greetings">
    <div>子组件</div>
    <h1 class="green">{{ msg }}</h1>
    <button @click="sendToy(toy)">传递参数到父组件</button>
    <button @click="emit('send-toy2', toy2)">传递参数到父组件方式2</button>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings {
  border: 1px solid red;
}
.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
