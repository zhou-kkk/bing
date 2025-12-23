# Bing 壁纸 API 文档

## 📌 概述

本 API 提供每日必应壁纸数据，包括壁纸链接、标题、描述等信息。数据每日自动更新。

**Base URL:**
```
https://yourusername.github.io/api
```

## 🔗 API 端点

### 1. 获取最新壁纸

**端点：** `GET /api/latest.json`

**描述：** 获取最新的必应壁纸信息

**示例请求：**
```bash
curl https://yourusername.github.io/api/latest.json
```

**示例响应：**
```json
{
  "data": {
    "id": "20240101_a1b2c3d4e",
    "timestamp": "2024-01-01 08:00:00",
    "date": "2024-01-01",
    "title": "冬日阳光下的冰雪世界",
    "description": "冰冻的湖泊覆盖着晶莹的霜花，远处的雪山在阳光下闪闪发光",
    "copyright": "© Tom Mackie / Offset by Shutterstock",
    "copyrightlink": "https://www.bing.com/search?q=冰冻湖泊",
    "urlbase": "/th?id=OHR.FrozenLake_ZH-CN1234567890_1920x1080",
    "url": "https://www.bing.com/th?id=OHR.FrozenLake_ZH-CN1234567890_1920x1080.jpg",
    "imageUrl": "https://www.bing.com/th?id=OHR.FrozenLake_ZH-CN1234567890_1920x1080.jpg",
    "mkt": "zh-CN",
    "startdate": "20240101",
    "enddate": "20240102",
    "fullstartdate": "202401010800",
    "hsh": "a1b2c3d4e5f6g7h8"
  },
  "status": "success"
}
```

**响应字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 壁纸唯一标识符 |
| `timestamp` | string | 数据更新时间（YYYY-MM-DD HH:mm:ss） |
| `date` | string | 壁纸日期（YYYY-MM-DD） |
| `title` | string | 壁纸标题 |
| `description` | string | 壁纸描述信息 |
| `copyright` | string | 版权信息 |
| `copyrightlink` | string | 版权链接 |
| `urlbase` | string | 图片URL基础部分 |
| `url` | string | 高分辨率壁纸URL（1920x1080） |
| `imageUrl` | string | 图片URL（同url） |
| `mkt` | string | 地区代码 |
| `startdate` | string | 生效开始日期（YYYYMMDD） |
| `enddate` | string | 生效结束日期（YYYYMMDD） |
| `fullstartdate` | string | 完整开始时间（YYYYMMDDHHmm） |
| `hsh` | string | 哈希值 |

---

### 2. 获取所有历史壁纸

**端点：** `GET /api/all.json`

**描述：** 获取所有历史壁纸信息（最多保留30条）

**示例请求：**
```bash
curl https://yourusername.github.io/api/all.json
```

**示例响应：**
```json
{
  "data": [
    {
      "id": "20240101_a1b2c3d4e",
      "date": "2024-01-01",
      "title": "冬日阳光下的冰雪世界",
      ...
    },
    {
      "id": "20231231_f5e4d3c2b",
      "date": "2023-12-31",
      "title": "跨年夜的城市灯火",
      ...
    }
  ],
  "count": 30,
  "status": "success"
}
```

**响应字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `data` | array | 壁纸数组，每条包含与 /latest.json 相同的字段 |
| `count` | number | 历史记录数量 |
| `status` | string | 请求状态（success/error） |

---

## 🔄 HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 📊 使用示例

### JavaScript/Fetch API

```javascript
// 获取最新壁纸
fetch('https://yourusername.github.io/api/latest.json')
  .then(response => response.json())
  .then(data => {
    console.log('标题:', data.data.title);
    console.log('图片URL:', data.data.url);
  });
```

### Python

```python
import requests

url = 'https://yourusername.github.io/api/latest.json'
response = requests.get(url)
data = response.json()

print('标题:', data['data']['title'])
print('描述:', data['data']['description'])
print('图片URL:', data['data']['url'])
```

### cURL

```bash
# 获取最新壁纸
curl 'https://yourusername.github.io/api/latest.json' | jq '.'

# 提取特定字段
curl 'https://yourusername.github.io/api/latest.json' | jq '.data.title'
```

### Node.js

```javascript
const axios = require('axios');

async function getWallpaper() {
  try {
    const response = await axios.get('https://yourusername.github.io/api/latest.json');
    const wallpaper = response.data.data;
    console.log('标题:', wallpaper.title);
    console.log('图片:', wallpaper.url);
  } catch (error) {
    console.error('请求失败:', error);
  }
}

getWallpaper();
```

---

## ⚠️ 注意事项

1. **请求频率**：无限制，建议不要频繁请求（30秒内不超过10次）
2. **缓存**：建议在客户端缓存数据，减少请求
3. **图片URL**：图片链接来自 Bing 官方，可能在区域受到限制
4. **数据更新**：每天自动更新一次，具体时间取决于工作流配置
5. **数据格式**：返回的是原始 JSON，无法配置返回格式

---

## 🖼️ 不同分辨率的图片URL

Bing API 提供的 `urlbase` 字段可以组合不同分辨率的图片：

```javascript
const urlbase = image.urlbase; // 例如: /th?id=OHR.xxx

// 不同分辨率
const resolutions = {
  '400x240': `https://www.bing.com${urlbase}_400x240.jpg`,
  '800x480': `https://www.bing.com${urlbase}_800x480.jpg`,
  '1366x768': `https://www.bing.com${urlbase}_1366x768.jpg`,
  '1920x1080': `https://www.bing.com${urlbase}_1920x1080.jpg`
};
```

---

## 🔍 数据持久化

所有数据保存在仓库的 `data/` 目录：

- `data/latest.json` - 最新壁纸信息
- `data/history.json` - 历史记录（数组，最多30条）

这些文件通过 Git 版本控制，每次更新都会自动提交。

---

## 🤝 集成建议

### 作为壁纸源
```javascript
// 在你的应用中使用
const wallpaperUrl = 'https://yourusername.github.io/api/latest.json';
// 定期获取并展示壁纸
```

### 作为数据源
```python
# 爬虫、爬取或分析用途
import requests
api_url = 'https://yourusername.github.io/api/all.json'
all_wallpapers = requests.get(api_url).json()['data']
```

### 作为展示板
```html
<!-- 在网页中展示 -->
<img id="wallpaper" src="" alt="今日必应壁纸">

<script>
fetch('https://yourusername.github.io/api/latest.json')
  .then(r => r.json())
  .then(d => {
    document.getElementById('wallpaper').src = d.data.url;
  });
</script>
```

---

## 📝 变更日志

### v1.0.0 (2024-01-01)
- ✨ 首个版本发布
- 📸 支持每日自动获取壁纸
- 🔗 提供 RESTful API
- 🌐 使用 GitHub Pages 展示

---

## 📧 反馈和支持

如有问题，请提交 [Issue](https://github.com/yourusername/bing/issues)

---

**最后更新：** 2024年
**维护者：** Your Name
