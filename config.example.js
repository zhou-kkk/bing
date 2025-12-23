/**
 * Bing 壁纸爬虫配置文件
 * 
 * 可在此文件中自定义各种参数
 */

module.exports = {
    // ============ API 配置 ============
    bing: {
        // Bing 官方接口
        url: 'https://www4.bing.com/HPImageArchive.aspx',

        // 请求参数
        params: {
            format: 'js',        // 返回 JSON 格式
            idx: 0,              // 图片索引（0最新，可设置1-7获取历史）
            n: 1,                // 返回图片数量（1-8）
            mkt: 'zh-CN'         // 地区代码
        },

        // 请求头
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44'
        }
    },

    // ============ 文件存储配置 ============
    storage: {
        // 数据文件目录（相对于项目根目录）
        dataDir: 'data',

        // 公开文件目录（GitHub Pages 根目录）
        publicDir: 'public',

        // 壁纸存储子目录
        wallpapersDir: 'public/wallpapers',

        // API 存储子目录
        apiDir: 'public/api',

        // 最新壁纸文件名
        latestFile: 'latest.json',

        // 历史记录文件名
        historyFile: 'history.json'
    },

    // ============ 图片配置 ============
    image: {
        // 默认下载分辨率
        resolution: '1920x1080',

        // 支持的分辨率列表
        supportedResolutions: [
            '400x240',
            '800x480',
            '1366x768',
            '1920x1080'
        ],

        // 是否自动下载图片到本地
        autoDownload: true,

        // 图片下载超时时间（毫秒）
        downloadTimeout: 30000,

        // 图片格式
        format: 'jpg'
    },

    // ============ 历史记录配置 ============
    history: {
        // 最多保留的历史记录数
        maxRecords: 30,

        // 历史记录排序（desc=最新在前，asc=最旧在前）
        sort: 'desc'
    },

    // ============ 网页生成配置 ============
    html: {
        // 是否自动生成 index.html
        autoGenerate: true,

        // 网页标题
        title: 'Bing 每日壁纸',

        // 网页描述
        description: '每日自动更新最新的必应壁纸',

        // 每页显示壁纸数
        wallpapersPerPage: 12,

        // 主题颜色
        theme: {
            primary: '#667eea',
            secondary: '#764ba2',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }
    },

    // ============ API 配置 ============
    api: {
        // 是否自动生成 API 文件
        autoGenerate: true,

        // API 端点
        endpoints: {
            latest: 'api/latest.json',
            all: 'api/all.json'
        }
    },

    // ============ 日志配置 ============
    logging: {
        // 日志级别 (0=off, 1=error, 2=warn, 3=info, 4=debug)
        level: 3,

        // 是否保存日志文件
        saveFile: false,

        // 日志文件路径
        filePath: 'logs/fetch.log',

        // 日志格式时间戳
        timestamp: true
    },

    // ============ 地区代码（Bing 支持的市场）============
    marketCodes: {
        'en-US': 'English (United States)',
        'en-GB': 'English (United Kingdom)',
        'zh-CN': 'Chinese (Simplified)',
        'zh-TW': 'Chinese (Traditional)',
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
        'ar-SA': 'Arabic'
    },

    // ============ GitHub Actions 配置 ============
    githubActions: {
        // 默认运行时间（Cron 表达式）
        // 格式: 分 时 日 月 周
        schedule: '0 0 * * *',  // 每天 UTC 00:00（北京时间 08:00）

        // 快速预设
        schedulePresets: {
            'daily-8am': '0 0 * * *',        // 每天 08:00 Beijing Time
            'daily-noon': '0 4 * * *',       // 每天 12:00 Beijing Time
            'daily-evening': '0 12 * * *',   // 每天 20:00 Beijing Time
            'every-6-hours': '0 */6 * * *',  // 每 6 小时
            'every-12-hours': '0 */12 * * *' // 每 12 小时
        }
    },

    // ============ 通知配置（扩展功能）============
    notifications: {
        // Email 通知
        email: {
            enabled: false,
            // 需要在环境变量中配置: MAIL_USER, MAIL_PASS, MAIL_TO
            service: 'gmail',
            from: process.env.MAIL_USER || 'your-email@gmail.com',
            to: process.env.MAIL_TO || 'recipient@example.com'
        },

        // Webhook 通知（钉钉、企业微信等）
        webhook: {
            enabled: false,
            // 需要在环境变量中配置: WEBHOOK_URL
            url: process.env.WEBHOOK_URL || ''
        }
    },

    // ============ 缓存配置 ============
    cache: {
        // 是否启用缓存
        enabled: true,

        // 缓存过期时间（毫秒）
        ttl: 3600000, // 1小时

        // 缓存目录
        dir: '.cache'
    }
};
