# Bing 壁纸自动爬虫

[![Daily Fetch Bing Wallpaper](https://github.com/im-zhou/bing/actions/workflows/daily-fetch.yml/badge.svg)](https://github.com/im-zhou/bing/actions/workflows/daily-fetch.yml)

基于 [im-zhou/bing](https://github.com/im-zhou/bing) 项目提取的 **Bing 壁纸 API 接口**，使用 **GitHub Actions** 实现每日自动获取最新必应壁纸，并上传至本仓库，同时通过 **GitHub Pages** 对外分享。

## 🎯 功能特性

- ✅ **每日自动更新** - 通过 GitHub Actions 定时任务，每天自动获取最新壁纸
- 📸 **壁纸下载** - 自动下载高分辨率壁纸（1920x1080）
- 💾 **数据持久化** - 保存壁纸元数据和历史记录（JSON格式）
- 🌐 **Web 展示** - 使用 GitHub Pages 对外分享壁纸
- 🔗 **RESTful API** - 提供 JSON API 接口供外部调用
- 📱 **响应式设计** - 支持各种设备访问

## 📐 项目结构

```
bing/
├── .github/
│   └── workflows/
│       └── daily-fetch.yml          # GitHub Actions 工作流
├── scripts/
│   ├── fetch-wallpaper.js           # 核心爬虫脚本（提取Bing接口）
│   └── test.js                      # API测试脚本
├── data/
│   ├── latest.json                  # 最新壁纸信息
│   └── history.json                 # 历史壁纸记录（保留30条）
├── public/
│   ├── index.html                   # GitHub Pages 首页
│   ├── api/
│   │   ├── latest.json              # API: 获取最新壁纸
│   │   └── all.json                 # API: 获取所有壁纸
│   └── wallpapers/                  # 壁纸文件存储目录
├── package.json                     # Node.js 依赖配置
└── README.md                        # 项目说明
```

## 🔧 Bing 壁纸 API 接口

本项目基于以下 Bing 官方接口：

### 接口地址
```
https://www4.bing.com/HPImageArchive.aspx
```

### 请求参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `format` | js | 返回 JSON 格式 |
| `idx` | 0-7 | 图片索引，0为最新 |
| `n` | 1-8 | 返回图片数量 |
| `mkt` | zh-CN | 地区代码（中文） |

### 请求示例

```bash
curl "https://www4.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN"
```

### 响应数据结构

```json
{
  "images": [
    {
      "startdate": "20230101",
      "enddate": "20230102",
      "url": "...",
      "urlbase": "/th?id=OHR.xxx",
      "title": "壁纸标题",
      "description": "壁纸描述",
      "copyright": "©版权信息",
      "copyrightlink": "https://...",
      "mkt": "zh-CN",
      "hsh": "xxx"
    }
  ]
}
```

## 🚀 快速开始

### 本地测试

```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/bing.git
cd bing

# 2. 安装依赖
npm install

# 3. 测试 API 接口
npm run test

# 4. 运行爬虫脚本
npm run fetch
```

### GitHub Actions 自动部署

1. **启用 GitHub Actions**
   - 进入仓库的 `Settings` > `Actions` > 启用 Actions

2. **配置 GitHub Pages**
   - 进入仓库的 `Settings` > `Pages`
   - Source 选择 `Deploy from a branch`
   - Branch 选择 `gh-pages` 和 `/root`

3. **运行工作流**
   - 工作流会在每天 UTC 00:00（北京时间 08:00）自动运行
   - 也可以在 `Actions` 标签页手动触发

## 📊 API 使用

### 获取最新壁纸

**请求：**
```bash
curl https://yourusername.github.io/api/latest.json
```

**响应：**
```json
{
  "data": {
    "id": "20230101_abc123def",
    "title": "壁纸标题",
    "description": "壁纸描述",
    "copyright": "©版权信息",
    "url": "https://www.bing.com/th?id=OHR.xxx_1920x1080.jpg",
    "date": "2023-01-01",
    "timestamp": "2023-01-01 08:00:00"
  },
  "status": "success"
}
```

### 获取所有壁纸

**请求：**
```bash
curl https://yourusername.github.io/api/all.json
```

**响应：**
```json
{
  "data": [...],
  "count": 30,
  "status": "success"
}
```

## 🌐 GitHub Pages 页面

部署后可通过以下地址访问：
- 主页: `https://yourusername.github.io/`
- API: `https://yourusername.github.io/api/latest.json`

## 🔄 工作流说明

### daily-fetch.yml 工作流流程

1. **检出代码** - 克隆仓库代码
2. **设置环境** - 安装 Node.js 18 和依赖
3. **执行爬虫** - 运行 `fetch-wallpaper.js` 获取壁纸
4. **提交更新** - Git 提交新增壁纸数据
5. **部署页面** - 将 public 目录部署到 GitHub Pages

### 定时执行

- **默认时间**：每天 UTC 00:00 运行（北京时间 08:00）
- **可手动触发**：通过 `workflow_dispatch` 事件

## 📝 配置说明

### 修改定时时间

编辑 `.github/workflows/daily-fetch.yml`:

```yaml
schedule:
  - cron: '0 0 * * *'  # 修改此行的时间
```

Cron 格式：`分 时 日 月 周`

示例：
- `0 0 * * *` - 每天 UTC 00:00
- `0 8 * * *` - 每天 UTC 08:00（北京时间 16:00）
- `0 */6 * * *` - 每 6 小时

### 修改地区和语言

编辑 `scripts/fetch-wallpaper.js`:

```javascript
const LANG_MKT = 'zh-CN';  // 修改此处
```

支持的地区代码：
- `zh-CN` - 中文（简体）
- `zh-TW` - 中文（繁体）
- `en-US` - 英文（美国）
- `ja-JP` - 日文
- 等等...

## 📦 依赖说明

- `axios` - HTTP 请求库
- `moment` - 时间日期处理库

## 🐛 故障排除

### 问题：GitHub Actions 运行失败

**解决方案：**
1. 检查 `Settings` > `Actions` 是否启用
2. 查看 Actions 日志获取详细错误信息
3. 确保 `GitHub Pages` 部分配置正确

### 问题：页面无法访问

**解决方案：**
1. 确认 `gh-pages` 分支已创建
2. 检查 `Settings` > `Pages` 配置
3. 等待几分钟让 GitHub Pages 重新部署

### 问题：API 返回错误

**解决方案：**
1. 运行本地测试：`npm run test`
2. 检查网络连接和 Bing API 可用性
3. 查看 Actions 日志中的详细错误

## 🔒 安全性考虑

- GitHub Actions 秘钥通过 `${{ secrets.GITHUB_TOKEN }}` 自动管理
- 无需配置外部密钥或凭证
- 所有操作都在 GitHub 托管运行器上进行

## 📄 许可证

MIT License

## 🙏 致谢

- 感谢 [im-zhou/bing](https://github.com/im-zhou/bing) 项目提供的 API 参考
- 感谢 Bing 提供的每日壁纸服务

## 📮 支持

如有问题或建议，欢迎提交 [Issue](https://github.com/yourusername/bing/issues) 或 [Pull Request](https://github.com/yourusername/bing/pulls)

---

**更新时间：** 2024年
**作者：** Your Name
