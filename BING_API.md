# Bing 壁纸接口分析与实现

## 📡 Bing API 接口规范

### 核心接口

Bing 官方提供的壁纸接口：

```
https://www4.bing.com/HPImageArchive.aspx
```

### 请求参数详解

| 参数 | 类型 | 必需 | 说明 | 示例 |
|------|------|------|------|------|
| `format` | string | ✓ | 返回格式，必须为 `js` 表示 JSON | `js` |
| `idx` | number | ✓ | 图片索引，0为今日，1为昨日，以此类推 | `0` |
| `n` | number | ✓ | 返回的图片数量，范围 1-8 | `1` |
| `mkt` | string | ✓ | 市场代码/地区，控制图片和文字语言 | `zh-CN` |

### 完整请求示例

```bash
curl "https://www4.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN"
```

### 响应数据结构

```json
{
  "batchrss": {
    "version": "1.0",
    "encoding": "utf-8"
  },
  "images": [
    {
      "startdate": "20231215",
      "enddate": "20231216",
      "url": "/images/search?q=xx",
      "urlbase": "/th?id=OHR.ChristmasMarket_ZH-CN0123456789_1920x1080",
      "copyrightlink": "https://www.bing.com/search?q=...",
      "copyright": "© Copyright Info",
      "title": "圣诞集市的魔法",
      "quiz": "/search?q=Encylopaedia",
      "wp": true,
      "hsh": "abc123def456",
      "drk": 1,
      "top": 1,
      "ody": 1,
      "mkt": "zh-CN",
      "fullstartdate": "202312150800"
    }
  ],
  "tooltips": {
    "loading": "正在加载...",
    "previous": "上一张",
    "next": "下一张",
    "walle": "此图片不能下载用作壁纸",
    "walls": "下载今日美图"
  }
}
```

### 响应字段说明

#### 图片基本信息

| 字段 | 类型 | 说明 |
|------|------|------|
| `startdate` | string | 生效开始日期（YYYYMMDD格式） |
| `enddate` | string | 生效结束日期（YYYYMMDD格式） |
| `fullstartdate` | string | 完整开始时间（YYYYMMDDHHmm格式） |
| `title` | string | 壁纸标题 |
| `description` | string | 壁纸描述（需单独请求） |

#### 图片链接相关

| 字段 | 类型 | 说明 |
|------|------|------|
| `urlbase` | string | 图片URL基础，可组合不同分辨率 |
| `url` | string | 搜索结果页面的URL |
| `copyrightlink` | string | 版权信息链接 |
| `copyright` | string | 版权文本 |

#### 图片属性

| 字段 | 类型 | 说明 |
|------|------|------|
| `mkt` | string | 市场代码 |
| `wp` | boolean | 是否可用作壁纸 |
| `hsh` | string | 哈希值 |
| `drk` | number | 暗色模式标记 |
| `top` | number | 热门标记 |
| `ody` | number | 今日焦点标记 |

---

## 🖼️ 图片URL 构成

### URL 组成规则

```
https://www.bing.com/th?id=OHR.<identifier>_<resolution>.jpg
```

### 分辨率列表

Bing 支持多种分辨率（通过修改 `_<resolution>` 部分）：

```javascript
const resolutions = {
  '400x240': 'Mobile Phone',
  '800x480': 'Mobile Device', 
  '1024x768': 'Tablet',
  '1366x768': 'Laptop',
  '1920x1080': 'Desktop HD',
  '3840x2160': 'Ultra HD (4K)'  // 部分图片支持
};
```

### URL 示例

```javascript
// 基础URL
const urlbase = '/th?id=OHR.SnowyOwl_ZH-CN0987654321_1920x1080';

// 不同分辨率的完整URL
const urls = {
  small: `https://www.bing.com${urlbase.replace('_1920x1080', '_400x240')}.jpg`,
  medium: `https://www.bing.com${urlbase.replace('_1920x1080', '_800x480')}.jpg`,
  large: `https://www.bing.com${urlbase.replace('_1920x1080', '_1366x768')}.jpg`,
  original: `https://www.bing.com${urlbase}.jpg`
};
```

---

## 🌍 支持的地区代码

### 完整的地区代码列表

```javascript
const marketCodes = {
  // 英语
  'en-US': 'English (United States)',
  'en-GB': 'English (United Kingdom)',
  'en-CA': 'English (Canada)',
  'en-AU': 'English (Australia)',
  
  // 中文
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  
  // 其他语言
  'ja-JP': 'Japanese',
  'ko-KR': 'Korean',
  'ru-RU': 'Russian',
  'fr-FR': 'French',
  'de-DE': 'German',
  'es-ES': 'Spanish',
  'it-IT': 'Italian',
  'pt-BR': 'Portuguese (Brazil)',
  'pt-PT': 'Portuguese (Portugal)',
  'nl-NL': 'Dutch',
  'sv-SE': 'Swedish',
  'pl-PL': 'Polish',
  'tr-TR': 'Turkish',
  'ar-SA': 'Arabic',
  'th-TH': 'Thai',
  'vi-VN': 'Vietnamese',
  'id-ID': 'Indonesian',
  'hi-IN': 'Hindi'
};
```

---

## 🔍 API 高级用法

### 1. 批量获取历史壁纸

```javascript
async function getHistoryWallpapers(daysBack = 7) {
  const wallpapers = [];
  
  for (let i = 0; i < daysBack; i++) {
    const response = await axios.get(
      'https://www4.bing.com/HPImageArchive.aspx',
      {
        params: {
          format: 'js',
          idx: i,        // 0=今天，1=昨天，以此类推
          n: 1,
          mkt: 'zh-CN'
        }
      }
    );
    
    if (response.data.images && response.data.images.length > 0) {
      wallpapers.push(response.data.images[0]);
    }
  }
  
  return wallpapers;
}
```

### 2. 一次获取多张图片

```javascript
async function getMultipleWallpapers(count = 8) {
  const response = await axios.get(
    'https://www4.bing.com/HPImageArchive.aspx',
    {
      params: {
        format: 'js',
        idx: 0,
        n: Math.min(count, 8),  // 最多8张
        mkt: 'zh-CN'
      }
    }
  );
  
  return response.data.images;
}
```

### 3. 切换不同地区

```javascript
const markets = ['zh-CN', 'en-US', 'ja-JP'];

async function getWallpapersFromMultipleMarkets() {
  const results = {};
  
  for (const mkt of markets) {
    const response = await axios.get(
      'https://www4.bing.com/HPImageArchive.aspx',
      {
        params: {
          format: 'js',
          idx: 0,
          n: 1,
          mkt: mkt
        }
      }
    );
    
    results[mkt] = response.data.images[0];
  }
  
  return results;
}
```

---

## ⚠️ 注意事项和限制

### 1. 请求限制

- ⏱️ **无官方速率限制**，但建议不要过度频繁请求
- 🔒 **无身份验证**，任何人都可以调用
- 📊 **无使用量统计**

### 2. 数据特性

- 🖼️ **图片每天更新**，一般在 UTC 0:00 更新
- 🌍 **不同地区** 会返回不同的图片
- 🚫 **非所有图片** 都能用作壁纸（检查 `wp` 字段）
- 📝 **描述信息** 需要额外请求获取

### 3. URL 有效期

- ⏰ **图片URL 有效期有限**，通常为 24 小时
- 💾 **应及时下载** 保存到本地
- 🔄 **建议每天更新** 获取最新链接

### 4. 地区限制

- 🌐 **某些图片** 在某些地区可能无法访问
- 🔗 **链接可能被限制** 在特定国家/地区
- 📡 **建议使用代理** 如果遇到访问问题

---

## 🛠️ 本项目中的实现

### fetch-wallpaper.js 中的核心代码

```javascript
// 获取壁纸的参数配置
const params = {
  format: 'js',
  idx: 0,
  n: 1,
  mkt: 'zh-CN'
};

// 发送请求
const response = await axios.get(BING_URL, {
  params: params,
  headers: {
    'User-Agent': 'Mozilla/5.0 ...'
  }
});

// 提取图片数据
const image = response.data.images[0];

// 组建完整URL
const imageUrl = 'https://www.bing.com' + image.urlbase + '_1920x1080.jpg';
```

---

## 🔗 相关资源

- [Bing 官方首页](https://www.bing.com)
- [原项目 im-zhou/bing](https://github.com/im-zhou/bing)
- [Bing 搜索 API](https://learn.microsoft.com/en-us/bing/search-apis)
- [HTTP 状态码参考](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

## 📚 示例脚本集合

见 `scripts/` 目录中的各类脚本：
- `fetch-wallpaper.js` - 主爬虫脚本

---
