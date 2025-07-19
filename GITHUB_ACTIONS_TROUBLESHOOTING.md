# GitHub Actions CI 故障排除指南

## 常见失败原因及解决方案

### 1. 权限问题
**问题**: `Error: Resource not accessible by integration`
**解决方案**: 
- 确保在 GitHub 仓库设置中启用了 GitHub Pages
- 检查 Actions 权限设置

### 2. Node.js 版本兼容性
**问题**: 构建失败，依赖安装错误
**解决方案**: 
- 使用 Node.js 18 (LTS 版本)
- 确保 package-lock.json 存在

### 3. 基础路径配置
**问题**: 部署后页面空白或资源加载失败
**解决方案**: 
- 在 vite.config.js 中设置正确的 base 路径
- 格式: `/repository-name/`

### 4. 构建产物问题
**问题**: dist 目录为空或缺少文件
**解决方案**: 
- 检查构建脚本是否正确
- 确保所有依赖都已安装

## GitHub 仓库配置步骤

### 1. 启用 GitHub Pages
1. 进入仓库 Settings
2. 找到 Pages 选项
3. Source 选择 "GitHub Actions"

### 2. 检查 Actions 权限
1. 进入仓库 Settings
2. 找到 Actions > General
3. 确保 "Workflow permissions" 设置为 "Read and write permissions"

### 3. 手动触发工作流
1. 进入 Actions 标签页
2. 选择 "CI Github Pages" 工作流
3. 点击 "Run workflow" 按钮

## 调试步骤

### 1. 本地测试构建
```bash
# 安装依赖
npm ci

# 本地构建测试
npm run build

# 预览构建结果
npm run preview
```

### 2. 检查构建产物
```bash
# 检查 dist 目录
ls -la dist/

# 确认关键文件存在
ls -la dist/index.html
```

### 3. 验证 base 路径
- 开发环境: `base: '/'`
- 生产环境: `base: '/repository-name/'`

## 工作流配置说明

### 环境变量
- `NODE_ENV=production`: 确保生产环境构建
- 自动设置正确的 base 路径

### 构建步骤
1. **Checkout**: 拉取代码
2. **Setup Node.js**: 配置 Node.js 环境
3. **Install dependencies**: 安装依赖 (使用 npm ci)
4. **Build**: 构建项目
5. **Upload artifact**: 上传构建产物
6. **Deploy**: 部署到 GitHub Pages

### 验证步骤
- 检查 package.json 和 package-lock.json
- 验证依赖安装
- 检查构建产物
- 确认 index.html 存在

## 常见错误信息

### `Could not resolve entry module`
- **原因**: 依赖缺失或配置错误
- **解决**: 检查 package.json 和依赖安装

### `Permission denied`
- **原因**: GitHub token 权限不足
- **解决**: 检查仓库 Actions 权限设置

### `404 on deployed site`
- **原因**: base 路径配置错误
- **解决**: 确认 vite.config.js 中的 base 配置

### `Build failed`
- **原因**: 代码错误或依赖问题
- **解决**: 本地测试构建，修复错误

## 最佳实践

1. **使用 npm ci**: 比 npm install 更适合 CI 环境
2. **锁定 Node.js 版本**: 使用 LTS 版本 (18)
3. **添加验证步骤**: 确保每个步骤都成功
4. **设置环境变量**: 明确指定生产环境
5. **使用官方 Actions**: 使用最新版本的官方 Actions

## 部署后验证

1. 访问 `https://username.github.io/repository-name/`
2. 检查页面是否正常加载
3. 验证静态资源是否正确加载
4. 测试页面功能是否正常

## 联系支持

如果问题仍然存在:
1. 检查 Actions 日志中的详细错误信息
2. 确认所有配置步骤都已完成
3. 尝试手动触发工作流
4. 检查 GitHub Pages 设置是否正确