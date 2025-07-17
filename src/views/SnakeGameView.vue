<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 游戏配置
const gridSize = 20; // 网格大小
const gridWidth = 20; // 网格宽度（格子数）
const gridHeight = 20; // 网格高度（格子数）
const initialSpeed = 200; // 初始速度（毫秒/移动）

// 游戏状态
const snake = ref([{ x: 10, y: 10 }]); // 蛇的身体，初始位置在中间
const direction = ref('right'); // 初始方向
const food = ref({ x: 5, y: 5 }); // 食物位置
const score = ref(0); // 分数
const gameOver = ref(false); // 游戏结束标志
const gameStarted = ref(false); // 游戏开始标志
const gameInterval = ref(null); // 游戏循环间隔
const speed = ref(initialSpeed); // 当前速度

// 方向键映射
const directionMap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
};

// 相反方向映射（防止直接反向移动）
const oppositeDirections = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

// 生成随机食物位置
const generateFood = () => {
  const newFood = {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight),
  };
  
  // 确保食物不会出现在蛇身上
  const isOnSnake = snake.value.some(segment => 
    segment.x === newFood.x && segment.y === newFood.y
  );
  
  if (isOnSnake) {
    return generateFood(); // 递归重新生成
  }
  
  return newFood;
};

// 检查碰撞
const checkCollision = (head) => {
  // 检查是否撞墙
  if (
    head.x < 0 ||
    head.x >= gridWidth ||
    head.y < 0 ||
    head.y >= gridHeight
  ) {
    return true;
  }
  
  // 检查是否撞到自己（从第二个身体部分开始检查）
  for (let i = 1; i < snake.value.length; i++) {
    if (snake.value[i].x === head.x && snake.value[i].y === head.y) {
      return true;
    }
  }
  
  return false;
};

// 移动蛇
const moveSnake = () => {
  if (gameOver.value || !gameStarted.value) return;
  
  const head = { ...snake.value[0] };
  
  // 根据方向移动头部
  switch (direction.value) {
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'right':
      head.x += 1;
      break;
  }
  
  // 检查碰撞
  if (checkCollision(head)) {
    endGame();
    return;
  }
  
  // 添加新头部
  snake.value.unshift(head);
  
  // 检查是否吃到食物
  if (head.x === food.value.x && head.y === food.value.y) {
    // 吃到食物，增加分数
    score.value += 10;
    // 生成新食物
    food.value = generateFood();
    // 加速（最快50ms一次）
    if (speed.value > 50) {
      speed.value -= 5;
    }
    // 重新设置游戏循环以应用新速度
    if (gameInterval.value) {
      clearInterval(gameInterval.value);
      gameInterval.value = setInterval(moveSnake, speed.value);
    }
  } else {
    // 没吃到食物，移除尾部
    snake.value.pop();
  }
};

// 处理键盘输入
const handleKeydown = (event) => {
  const newDirection = directionMap[event.key];
  if (newDirection && newDirection !== oppositeDirections[direction.value]) {
    direction.value = newDirection;
  }
  
  // 如果游戏未开始，按任意方向键开始游戏
  if (!gameStarted.value && !gameOver.value && newDirection) {
    startGame();
  }
  
  // 如果游戏结束，按空格键重新开始
  if (gameOver.value && event.key === ' ') {
    resetGame();
  }
};

// 开始游戏
const startGame = () => {
  if (gameStarted.value || gameOver.value) return;
  gameStarted.value = true;
  gameInterval.value = setInterval(moveSnake, speed.value);
};

// 结束游戏
const endGame = () => {
  gameOver.value = true;
  if (gameInterval.value) {
    clearInterval(gameInterval.value);
    gameInterval.value = null;
  }
};

// 重置游戏
const resetGame = () => {
  snake.value = [{ x: 10, y: 10 }];
  direction.value = 'right';
  food.value = generateFood();
  score.value = 0;
  gameOver.value = false;
  gameStarted.value = false;
  speed.value = initialSpeed;
  if (gameInterval.value) {
    clearInterval(gameInterval.value);
    gameInterval.value = null;
  }
};

// 手动控制方向（用于移动设备）
const changeDirection = (newDirection) => {
  if (newDirection !== oppositeDirections[direction.value]) {
    direction.value = newDirection;
  }
  
  // 如果游戏未开始，按任意方向键开始游戏
  if (!gameStarted.value && !gameOver.value) {
    startGame();
  }
};

// 组件挂载时添加键盘事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  // 初始化食物位置
  food.value = generateFood();
});

// 组件卸载时移除键盘事件监听并清除游戏循环
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (gameInterval.value) {
    clearInterval(gameInterval.value);
  }
});
</script>

<template>
  <div class="snake-game-container">
    <h1>贪吃蛇游戏</h1>
    
    <div class="game-info">
      <div class="score">分数: {{ score }}</div>
    </div>
    
    <div 
      class="game-board" 
      :style="{ 
        width: `${gridSize * gridWidth}px`, 
        height: `${gridSize * gridHeight}px` 
      }"
    >
      <!-- 绘制蛇 -->
      <div 
        v-for="(segment, index) in snake" 
        :key="`snake-${index}`"
        class="snake-segment"
        :style="{ 
          width: `${gridSize}px`, 
          height: `${gridSize}px`,
          left: `${segment.x * gridSize}px`, 
          top: `${segment.y * gridSize}px`,
          backgroundColor: index === 0 ? '#4CAF50' : '#8BC34A' // 头部颜色不同
        }"
      ></div>
      
      <!-- 绘制食物 -->
      <div 
        class="food"
        :style="{ 
          width: `${gridSize}px`, 
          height: `${gridSize}px`,
          left: `${food.x * gridSize}px`, 
          top: `${food.y * gridSize}px` 
        }"
      ></div>
    </div>
    
    <!-- 游戏状态提示 -->
    <div v-if="!gameStarted && !gameOver" class="game-message">
      按方向键开始游戏
    </div>
    
    <div v-if="gameOver" class="game-message game-over">
      游戏结束! 按空格键重新开始
    </div>
    
    <!-- 移动设备控制按钮 -->
    <div class="mobile-controls">
      <div class="control-row">
        <button @click="changeDirection('up')" class="control-btn">↑</button>
      </div>
      <div class="control-row">
        <button @click="changeDirection('left')" class="control-btn">←</button>
        <button @click="resetGame()" class="control-btn reset-btn">重置</button>
        <button @click="changeDirection('right')" class="control-btn">→</button>
      </div>
      <div class="control-row">
        <button @click="changeDirection('down')" class="control-btn">↓</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.snake-game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.game-info {
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: bold;
}

.game-board {
  position: relative;
  background-color: #f0f0f0;
  border: 2px solid #333;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.snake-segment {
  position: absolute;
  border-radius: 3px;
}

.food {
  position: absolute;
  background-color: #FF5722;
  border-radius: 50%;
}

.game-message {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #333;
}

.game-over {
  color: #f44336;
  font-weight: bold;
}

.mobile-controls {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.control-row {
  display: flex;
  margin: 5px 0;
}

.control-btn {
  width: 50px;
  height: 50px;
  margin: 0 5px;
  font-size: 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.control-btn:hover {
  background-color: #45a049;
}

.reset-btn {
  background-color: #f44336;
  font-size: 1rem;
}

.reset-btn:hover {
  background-color: #d32f2f;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .game-board {
    width: 300px !important;
    height: 300px !important;
  }
}
</style>