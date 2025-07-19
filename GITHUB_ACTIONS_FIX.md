# GitHub Actions 部署修复说明

## 🔧 修复的问题

### 1. **缺少 Node.js 环境设置**
- **问题**: 原配置没有明确设置 Node.js 版本
- **修复**: 添加了 `actions/setup-node@v4` 并指定 Node.js 18 版本
- **影响**: 确保构建环境一致性

### 2. **缺少权限配置**
- **问题**: 没有设置 GitHub Pages 部署所需的权限
- **修复**: 添加了 `permissions` 配置
- **权限**: `contents: read`, `pages: write`, `id-token: write`

### 3. **使用过时的 Actions 版本**
- **问题**: 使用了过时的 `actions/checkout@v3`
- **修复**: 升级到 `actions/checkout@v4`
- **好处**: 更好的性能和安全性

### 4. **部署方式不当**
- **问题**: 使用第三方 action `JamesIves/github-pages-deploy-action`
- **修复**: 改用官方的 GitHub Pages 部署方式
- **优势**: 更稳定、更安全、更快速

### 5. **缺少并发控制**
- **问题**: 可能同时运行多个部署任务
- **修复**: 添加了 `concurrency` 配置
- **效果**: 确保同时只有一个部署在运行

### 6. **依赖安装方式优化**
- **问题**: 使用 `npm install` 可能导致版本不一致
- **修复**: 改用 `npm ci` 进行清洁安装
- **好处**: 更快、更可靠的依赖安装

## 📋 GitHub Pages 配置步骤

### 1. 仓库设置
1. 进入 GitHub 仓库
2. 点击 **Settings** 标签
3. 在左侧菜单找到 **Pages**

### 2. 配置 Pages 源
1. 在 **Source** 部分选择 **GitHub Actions**
2. 不要选择 "Deploy from a branch"

### 3. 环境配置
确保仓库有以下设置：
- ✅ Actions 权限已启用
- ✅ Pages 功能已启用
- ✅ 工作流权限设置为 "Read and write permissions"

## 🚀 工作流特性

### 触发条件
- **自动触发**: 推送到 `main` 分支时
- **手动触发**: 通过 GitHub Actions 页面手动运行

### 构建步骤
1. **检出代码**: 获取最新代码
2. **设置环境**: 配置 Node.js 18 环境
3. **安装依赖**: 使用 npm ci 安装依赖
4. **构建项目**: 运行 npm run build
5. **上传产物**: 上传 dist 目录到 GitHub Pages
6. **部署**: 自动部署到 GitHub Pages

### 性能优化
- **缓存**: 启用 npm 缓存加速构建
- **并发控制**: 避免重复部署
- **清洁安装**: 使用 npm ci 确保依赖一致性

## 🔍 故障排除

### 常见问题

1. **权限错误**
   ```
   Error: Resource not accessible by integration
   ```
   **解决**: 检查仓库 Settings > Actions > General > Workflow permissions

2. **Pages 未启用**
   ```
   Error: Pages is not enabled for this repository
   ```
   **解决**: 在 Settings > Pages 中启用 GitHub Pages

3. **分支不存在**
   ```
   Error: The branch 'main' does not exist
   ```
   **解决**: 确保推送到正确的分支名称

4. **构建失败**
   ```
   Error: Process completed with exit code 1
   ```
   **解决**: 检查本地构建是否成功，修复构建错误

### 调试步骤

1. **查看 Actions 日志**
   - 进入 GitHub 仓库
   - 点击 **Actions** 标签
   - 查看失败的工作流详细日志

2. **本地测试**
   ```bash
   npm ci
   npm run build
   ```

3. **检查文件结构**
   确保 `dist` 目录包含 `index.html` 文件

## 📝 最佳实践

### 1. 环境变量
如果需要环境变量，在 GitHub 仓库设置中添加：
- Settings > Secrets and variables > Actions
- 添加必要的环境变量

### 2. 自定义域名
如果使用自定义域名：
1. 在 `public` 目录添加 `CNAME` 文件
2. 文件内容为您的域名（如：`example.com`）

### 3. 缓存策略
当前配置已启用 npm 缓存，可以显著加速构建时间。

### 4. 安全考虑
- 使用官方 Actions
- 定期更新 Actions 版本
- 最小权限原则

## 🎯 预期结果

修复后，您的工作流应该能够：
- ✅ 成功触发和运行
- ✅ 正确构建项目
- ✅ 自动部署到 GitHub Pages
- ✅ 在几分钟内完成整个流程

部署成功后，您的网站将在以下地址可用：
`https://[username].github.io/[repository-name]/`

---

*如果仍有问题，请检查 GitHub Actions 的详细日志，或参考 GitHub Pages 官方文档。*