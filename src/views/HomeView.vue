<script setup>
// import TheWelcome from '../components/TheWelcome.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="home-container">
    <h1>欢迎来到Vue3小游戏,测试CI</h1>
    <div class="game-links">
      <RouterLink to="/snake" class="game-link">
        <div class="game-card">
          <h2>贪吃蛇</h2>
          <p>
            经典的贪吃蛇游戏，使用方向键控制蛇移动，吃到食物可以增加长度和分数。
          </p>
        </div>
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 30px;
}

.game-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.game-link {
  text-decoration: none;
  color: inherit;
  flex: 1;
  min-width: 300px;
}

.game-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.game-card h2 {
  color: #4caf50;
  margin-bottom: 10px;
}

.game-card p {
  color: #666;
}
</style>
