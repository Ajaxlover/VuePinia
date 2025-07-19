import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    // GitHub Pages 部署配置
    base: process.env.NODE_ENV === 'production' ? '/VuePinia/' : '/',
    // 插件配置
    plugins: [
      vue({
        // Vue 插件优化
        reactivityTransform: true, // 启用响应式语法糖
        script: {
          defineModel: true, // 启用 defineModel
          propsDestructure: true // 启用 props 解构
        }
      }),
      // 仅在开发环境启用 devtools
      ...(command === 'serve' ? [vueDevTools()] : [])
    ],

    // 路径解析优化
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./node_modules', import.meta.url))
      },
      // 优化解析扩展名
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },

    // 开发服务器优化
    server: {
      host: '0.0.0.0', // 允许外部访问
      port: 3000,
      open: true, // 自动打开浏览器
      cors: true, // 启用 CORS
      // 预热常用文件
      warmup: {
        clientFiles: ['./src/components/**/*.vue', './src/views/**/*.vue']
      },
      // HMR 优化
      hmr: {
        overlay: true // 显示错误覆盖层
      }
    },

    // 预览服务器配置
    preview: {
      port: 4173,
      host: '0.0.0.0'
    },

    // 依赖优化
    optimizeDeps: {
      // 预构建依赖
      include: [
        'vue',
        'vue-router',
        'pinia'
      ],
      // 排除预构建
      exclude: ['vue-demi'],
      // 强制预构建
      force: false
    },

    // 构建优化
    build: {
      // 输出目录
      outDir: 'dist',
      // 静态资源目录
      assetsDir: 'assets',
      // 启用/禁用 CSS 代码分割
      cssCodeSplit: true,
      // 启用/禁用 gzip 压缩大小报告
      reportCompressedSize: false,
      // chunk 大小警告限制 (kb)
      chunkSizeWarningLimit: 1000,
      // 启用/禁用 minification
      minify: 'terser',
      // Terser 选项
      terserOptions: {
        compress: {
          // 生产环境移除 console
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
          // 移除无用代码
          pure_funcs: mode === 'production' ? ['console.log'] : []
        },
        format: {
          // 移除注释
          comments: false
        }
      },
      // Rollup 选项
      rollupOptions: {
        // 输入配置
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url))
        },
        // 外部依赖 (CDN)
        external: [],
        // 输出配置
        output: {
          // 文件命名
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            let extType = info[info.length - 1]
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'media'
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'img'
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'fonts'
            }
            return `${extType}/[name]-[hash].[ext]`
          },
          // 代码分割
          manualChunks: (id) => {
            // 将 Vue 相关库打包到一个 chunk
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vue'
            }
            // 将 node_modules 中的其他第三方库打包到 vendor chunk
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      },
      // 启用源码映射 (仅开发环境)
      sourcemap: command === 'serve'
    },

    // CSS 优化
    css: {
      // 开发环境启用 source map
      devSourcemap: command === 'serve'
    },

    // 环境变量
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    },

    // ESBuild 优化
    esbuild: {
      // 生产环境移除 console 和 debugger
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      // 压缩标识符
      minifyIdentifiers: mode === 'production',
      // 压缩语法
      minifySyntax: mode === 'production',
      // 压缩空白
      minifyWhitespace: mode === 'production'
    },

    // 实验性功能
    experimental: {
      // 启用渲染内置组件
      renderBuiltUrl: (filename, { hostType }) => {
        if (hostType === 'js') {
          return { js: `"${filename}"` }
        } else {
          return { relative: true }
        }
      }
    }
  }
})
