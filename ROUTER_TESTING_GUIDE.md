# Vue Router 测试指南

## 测试步骤

### 1. 本地测试
```bash
# 构建项目
npm run build

# 启动预览服务器
npm run preview
```

### 2. 测试路由功能
访问以下 URL 并测试刷新功能：

#### 本地测试地址
- 首页：`http://localhost:4173/VuePinia/`
- 关于页：`http://localhost:4173/VuePinia/about`
- 贪吃蛇游戏：`http://localhost:4173/VuePinia/snake`

#### GitHub Pages 测试地址
- 首页：`https://ajaxlover.github.io/VuePinia/`
- 关于页：`https://ajaxlover.github.io/VuePinia/about`
- 贪吃蛇游戏：`https://ajaxlover.github.io/VuePinia/snake`

### 3. 测试场景

#### ✅ 应该正常工作的操作
1. **导航测试**：点击导航链接切换页面
2. **直接访问**：在浏览器地址栏直接输入路由地址
3. **刷新测试**：在任意路由页面按 F5 刷新
4. **前进后退**：使用浏览器的前进后退按钮
5. **书签访问**：将路由地址添加为书签后访问

#### ❌ 如果出现问题
- **404 错误**：检查 `404.html` 文件是否存在于 `dist` 目录
- **空白页面**：检查控制台是否有 JavaScript 错误
- **资源加载失败**：检查 `base` 路径配置是否正确

## 解决方案对比

### Hash 模式
```javascript
// URL 示例：https://ajaxlover.github.io/VuePinia/#/about
history: createWebHashHistory(import.meta.env.BASE_URL)
```
- ✅ 100% 兼容静态托管
- ❌ URL 不美观，包含 # 符号
- ❌ SEO 不友好

### History 模式 + SPA 重定向
```javascript
// URL 示例：https://ajaxlover.github.io/VuePinia/about
history: createWebHistory(import.meta.env.BASE_URL)
```
- ✅ URL 美观，无 # 符号
- ✅ SEO 友好
- ✅ 用户体验更好
- ⚠️ 需要额外的重定向配置

## 当前项目配置

项目已配置为 **History 模式 + SPA 重定向**：

### 文件结构
```
public/
├── 404.html          # GitHub Pages 404 重定向
└── favicon.ico

dist/                  # 构建输出
├── 404.html          # 自动复制的重定向文件
├── index.html        # 包含 SPA 重定向脚本
├── css/
├── js/
└── favicon.ico
```

### 工作原理
1. 用户访问 `/about` 路由
2. GitHub Pages 找不到对应文件，返回 `404.html`
3. `404.html` 中的脚本将路径转换为查询参数
4. 重定向到 `/?/about`
5. `index.html` 中的脚本解析查询参数
6. 恢复为正确的路由 `/about`
7. Vue Router 正常处理路由

## 部署后验证

1. **提交更改**：
   ```bash
   git add .
   git commit -m "fix: add SPA redirect for GitHub Pages routing"
   git push origin main
   ```

2. **等待部署**：GitHub Actions 自动部署（约 2-5 分钟）

3. **测试路由**：访问各个路由并测试刷新功能

4. **检查控制台**：确保没有 JavaScript 错误

## 故障排除

### 如果仍有 404 问题
1. 检查 `dist/404.html` 是否存在
2. 确认 GitHub Pages 设置正确
3. 清除浏览器缓存
4. 检查 `base` 路径配置

### 如果页面空白
1. 打开浏览器开发者工具
2. 查看 Console 标签页的错误信息
3. 检查 Network 标签页的资源加载情况
4. 确认所有静态资源路径正确

### 切换到 Hash 模式（备选方案）
如果 History 模式仍有问题，可以快速切换到 Hash 模式：

```javascript
// src/router/index.js
import { createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // ...
})
```