# 📁 项目文件结构说明

## 项目目录树

```
bing/
├── .github/
│   └── workflows/
│       └── daily-fetch.yml              ⭐ GitHub Actions 工作流 - 每日自动执行
│
├── scripts/
│   ├── fetch-wallpaper.js               ⭐ 核心爬虫脚本 - 获取和处理壁纸
│   └── test.js                          🧪 API 测试脚本 - 验证接口可用性
│
├── data/                                📊 数据存储目录
│   ├── latest.json                      最新壁纸信息（单条）
│   └── history.json                     历史壁纸记录（数组，最多30条）
│
├── public/                              🌐 GitHub Pages 输出目录
│   ├── index.html                       ⭐ 网站首页 - 展示壁纸
│   ├── api/                             REST API 数据目录
│   │   ├── latest.json                  API：获取最新壁纸
│   │   └── all.json                     API：获取所有壁纸
│   └── wallpapers/                      壁纸图片存储目录（自动生成）
│       ├── 2024-01-01_*.jpg
│       └── ...
│
├── .gitignore                           Git 忽略文件
├── package.json                         ⭐ Node.js 项目配置
├── package-lock.json                    依赖锁定文件
│
├── README.md                            📖 项目主文档
├── QUICKSTART.md                        🚀 快速启动指南
├── DEPLOYMENT.md                        📋 详细部署指南
├── API.md                               🔗 API 使用文档
├── BING_API.md                          📡 Bing 接口分析文档
│
└── config.example.js                    ⚙️ 配置文件示例
```

## 📄 文件详细说明

### 核心文件

#### `.github/workflows/daily-fetch.yml`
- **作用**：GitHub Actions 工作流配置文件
- **功能**：
  - 每天 UTC 00:00（北京时间 08:00）自动运行
  - 调用爬虫脚本获取壁纸
  - 自动提交更新到 Git
  - 部署生成的页面到 GitHub Pages
- **修改方法**：编辑 `cron` 字段改变运行时间

#### `scripts/fetch-wallpaper.js`
- **作用**：主爬虫脚本，核心功能实现
- **功能**：
  - 调用 Bing 官方 API 获取最新壁纸
  - 下载壁纸文件到本地
  - 保存元数据到 JSON 文件
  - 生成网页 HTML
  - 生成 REST API JSON
- **运行方式**：`npm run fetch`
- **依赖**：axios, moment

#### `scripts/test.js`
- **作用**：API 测试脚本
- **功能**：验证 Bing API 是否可用
- **运行方式**：`npm run test`

### 数据文件

#### `data/latest.json`
- **内容**：最新壁纸的完整信息
- **格式**：单个对象 JSON
- **自动生成**：是（每次爬虫运行时）
- **手动编辑**：否，由脚本自动维护

#### `data/history.json`
- **内容**：历史壁纸数组（最多30条）
- **格式**：JSON 数组
- **自动生成**：是（累积保存）
- **用途**：
  - 生成网页中的历史壁纸列表
  - 生成 `/api/all.json` 接口

### 生成文件（首次运行后自动创建）

#### `public/index.html`
- **内容**：完整的网站首页
- **样式**：内联 CSS，响应式设计
- **功能**：
  - 展示最新壁纸
  - 显示历史记录列表
  - 提供下载链接

#### `public/api/latest.json`
- **内容**：最新壁纸数据
- **格式**：`{ data: {...}, status: "success" }`
- **用途**：外部应用调用此 API 获取最新壁纸

#### `public/api/all.json`
- **内容**：所有历史壁纸
- **格式**：`{ data: [...], count: 30, status: "success" }`
- **用途**：获取全部历史记录

#### `public/wallpapers/`
- **内容**：下载的壁纸文件
- **命名**：`YYYY-MM-DD_*.jpg`
- **大小**：约 1-2 MB/张

### 文档文件

#### `README.md`
- **内容**：项目概览
- **包含**：功能介绍、快速开始、API 说明

#### `QUICKSTART.md` ⭐
- **内容**：5分钟快速部署指南
- **建议**：首次使用者必读

#### `DEPLOYMENT.md`
- **内容**：详细部署步骤
- **包含**：故障排除、自定义配置

#### `API.md`
- **内容**：API 完整文档
- **包含**：端点说明、使用示例、数据结构

#### `BING_API.md`
- **内容**：Bing 接口深度分析
- **包含**：
  - 官方接口规范
  - 参数详解
  - 响应数据结构
  - 高级用法
  - 限制与注意事项

#### `config.example.js`
- **内容**：配置参数示例
- **用途**：参考文档，可扩展项目配置

### 配置文件

#### `package.json`
- **内容**：Node.js 项目配置
- **关键信息**：
  ```json
  {
    "scripts": {
      "fetch": "node scripts/fetch-wallpaper.js",
      "test": "node scripts/test.js"
    },
    "dependencies": {
      "axios": "^1.6.0",
      "moment": "^2.29.4"
    }
  }
  ```

#### `.gitignore`
- **内容**：Git 忽略规则
- **忽略**：node_modules, 日志文件等

## 🔄 工作流程

### 数据流向图

```
Bing API
    ↓
fetch-wallpaper.js (获取并处理)
    ↓
├─→ data/latest.json (最新数据)
├─→ data/history.json (历史积累)
├─→ public/wallpapers/*.jpg (图片文件)
│
生成网页和API
├─→ public/index.html (网站首页)
├─→ public/api/latest.json (API)
└─→ public/api/all.json (API)
    ↓
GitHub Pages (部署)
    ↓
https://yourusername.github.io (访问)
```

### 每次执行周期

```
[GitHub Actions 触发]
        ↓
   [检出代码] → .github/workflows/daily-fetch.yml
        ↓
   [安装依赖] → npm install
        ↓
   [执行爬虫] → npm run fetch
        ↓
   [Git 提交] → git add/commit/push
        ↓
   [部署页面] → GitHub Pages (自动)
        ↓
   [完成] → 网站更新完毕
```

## 📊 文件大小参考

| 文件 | 大小 | 说明 |
|------|------|------|
| `fetch-wallpaper.js` | ~12 KB | 爬虫脚本 |
| `latest.json` | ~2 KB | 单条壁纸 |
| `history.json` | ~60 KB | 30条历史 |
| `index.html` | ~25 KB | 网页 |
| 壁纸图片 | ~1.5 MB | 每张高清图 |
| **总计（30张图）** | **~50 MB** | 不含 node_modules |

## 🔧 定制要点

### 要修改的文件

| 需求 | 修改文件 |
|------|---------|
| 改变运行时间 | `.github/workflows/daily-fetch.yml` |
| 改变地区/语言 | `scripts/fetch-wallpaper.js` |
| 自定义网页样式 | `scripts/fetch-wallpaper.js` (generateHTML) |
| 修改历史记录数 | `scripts/fetch-wallpaper.js` (maxRecords) |
| 修改图片分辨率 | `scripts/fetch-wallpaper.js` (resolution) |

### 不应修改的文件

- ❌ `package.json` - 除非需要添加新依赖
- ❌ `data/*.json` - 由脚本自动管理
- ❌ `public/*` - 由脚本自动生成

## 📦 依赖说明

```json
{
  "axios": "^1.6.0",      // HTTP 请求库
  "moment": "^2.29.4"     // 时间处理库
}
```

## 🚀 首次运行清单

- [ ] 克隆/创建仓库
- [ ] 运行 `npm install` 安装依赖
- [ ] 运行 `npm run test` 验证 API
- [ ] 运行 `npm run fetch` 本地测试
- [ ] 检查 `data/` 和 `public/` 目录
- [ ] 推送到 GitHub
- [ ] 启用 GitHub Actions
- [ ] 配置 GitHub Pages
- [ ] 访问网站验证

---

**最后更新**：2025年
