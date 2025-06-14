<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Child from './components/Child.vue'
import { ref, useTemplateRef, onMounted } from 'vue'

let car = ref('子组件')
let toy = ref('')

function getToy(d) {
  console.log(d)
  toy.value = d
}

let aaa = useTemplateRef('sonComp')
// 写法二
const sonComp = ref(null)

onMounted(() => {
  console.log('写法一：', aaa.value.toy3)
  aaa.value.sonMethod()
  console.log('写法二：', sonComp.value.toy3)
})
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <div>父组件</div>
      <div>子传父：{{ toy }}</div>
      <Child ref="sonComp" :msg="car" :sendToy="getToy" @send-toy2="getToy" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
