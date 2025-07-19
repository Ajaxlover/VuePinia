# 多平台部署配置指南

## 概述

项目现在支持多平台部署，会根据部署环境自动调整配置：

- **Vercel**: 使用根路径 `/`
- **GitHub Pages**: 使用子路径 `/VuePinia/`
- **本地开发**: 使用根路径 `/`

## 自动检测机制

### Vite 配置逻辑
```javascript
const getBasePath = () => {
  // 开发环境始终使用根路径
  if (command === 'serve') return '/'
  
  // 生产环境根据部署平台设置
  if (process.env.VERCEL) {
    // Vercel 部署
    return '/'
  } else if (process.env.GITHUB_ACTIONS) {
    // GitHub Pages 部署
    return '/VuePinia/'
  } else {
    // 默认情况（本地构建）
    return '/'
  }
}
```

### 环境变量检测
- `process.env.VERCEL`: Vercel 自动设置
- `process.env.GITHUB_ACTIONS`: GitHub Actions 自动设置

## 部署平台配置

### 1. Vercel 部署

#### 配置文件: `vercel.json`
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 特点
- ✅ 自动检测 `VERCEL` 环境变量
- ✅ 使用根路径 `/`，资源正确加载
- ✅ SPA 路由重写支持
- ✅ 无需额外配置

#### 部署步骤
1. 连接 GitHub 仓库到 Vercel
2. 自动部署，无需额外配置
3. 访问 Vercel 提供的域名

### 2. GitHub Pages 部署

#### 配置文件: `.github/workflows/deploy.yml`
```yaml
- name: Build
  run: npm run build
  env:
    NODE_ENV: production
```

#### 特点
- ✅ 自动检测 `GITHUB_ACTIONS` 环境变量
- ✅ 使用子路径 `/VuePinia/`
- ✅ 包含 404.html 重定向支持
- ✅ SPA 路由脚本支持

#### 部署步骤
1. 推送代码到 main 分支
2. GitHub Actions 自动构建和部署
3. 访问 `https://username.github.io/VuePinia/`

### 3. 本地开发

#### 开发服务器
```bash
npm run dev
# 使用根路径 /，端口 3000
```

#### 本地预览
```bash
npm run build
npm run preview
# 使用根路径 /，端口 4173
```

## 路由配置

### SPA 重定向支持

#### Vercel
- 使用 `vercel.json` 的 rewrites 配置
- 所有路由请求重定向到 `index.html`

#### GitHub Pages
- 使用 `404.html` 文件处理 404 请求
- `index.html` 包含重定向脚本

### 路由模式
```javascript
// src/router/index.js
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...]
})
```

## 构建输出对比

### Vercel 构建
```
dist/
├── index.html          # 根路径资源引用
├── js/main-xxx.js      # /js/main-xxx.js
├── css/main-xxx.css    # /css/main-xxx.css
└── ...
```

### GitHub Pages 构建
```
dist/
├── index.html          # 子路径资源引用
├── js/main-xxx.js      # /VuePinia/js/main-xxx.js
├── css/main-xxx.css    # /VuePinia/css/main-xxx.css
├── 404.html           # SPA 重定向文件
└── ...
```

## 故障排除

### Vercel 资源加载失败
**问题**: JS/CSS 文件 404 错误
**原因**: base 路径配置错误
**解决**: 确保 Vercel 环境使用根路径 `/`

### GitHub Pages 资源加载失败
**问题**: 静态资源 404 错误
**原因**: base 路径与仓库名不匹配
**解决**: 确保 GitHub Actions 环境使用 `/VuePinia/`

### 路由刷新 404
**问题**: 直接访问路由或刷新页面 404
**解决**: 
- Vercel: 检查 `vercel.json` 配置
- GitHub Pages: 检查 `404.html` 和重定向脚本

## 手动覆盖配置

如果需要手动指定部署平台，可以设置环境变量：

### 强制 Vercel 模式
```bash
VERCEL=1 npm run build
```

### 强制 GitHub Pages 模式
```bash
GITHUB_ACTIONS=1 npm run build
```

### 自定义 base 路径
```bash
# 在 vite.config.js 中添加
base: process.env.CUSTOM_BASE || getBasePath()
```

## 最佳实践

1. **开发时**: 使用 `npm run dev`，自动使用根路径
2. **本地测试**: 使用 `npm run preview`，模拟生产环境
3. **部署前**: 确认目标平台的环境变量设置
4. **多平台**: 无需修改代码，自动适配不同平台

## 验证部署

### Vercel
- 访问 Vercel 提供的域名
- 测试路由导航和刷新
- 检查浏览器开发者工具的网络请求

### GitHub Pages
- 访问 `https://username.github.io/VuePinia/`
- 测试路由导航和刷新
- 确认所有静态资源正确加载

## 注意事项

1. **环境变量**: 依赖平台自动设置的环境变量
2. **构建缓存**: 切换平台时建议清理 `dist` 目录
3. **域名配置**: 自定义域名可能需要额外配置
4. **CDN 缓存**: 部署后可能需要等待 CDN 缓存更新