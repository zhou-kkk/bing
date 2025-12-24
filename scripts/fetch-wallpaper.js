#!/usr/bin/env node

/**
 * Bing Wallpaper Fetcher
 * 基于im-zhou/bing项目的API接口
 * 每日自动获取最新必应壁纸
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

// 配置
const BING_URL = 'https://www4.bing.com/HPImageArchive.aspx';
const LANG_MKT = 'zh-CN';
const DATA_DIR = path.join(__dirname, '../data');
const PUBLIC_DIR = path.join(__dirname, '../public');

// 确保目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

/**
 * 从Bing获取壁纸数据
 */
async function fetchBingWallpaper() {
    try {
        console.log('[' + new Date().toISOString() + '] 开始获取Bing壁纸...');

        const params = {
            format: 'js',
            idx: 0,
            n: 1,
            mkt: LANG_MKT
        };

        const response = await axios.get(BING_URL, {
            params: params,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44'
            }
        });

        const data = response.data;

        if (!data.images || data.images.length === 0) {
            console.error('❌ 未获取到壁纸数据');
            return null;
        }

        const image = data.images[0];
        const wallpaper = {
            id: generateId(),
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            date: moment().format('YYYY-MM-DD'),
            title: image.title,
            description: image.description,
            copyright: image.copyright,
            copyrightlink: image.copyrightlink,
            urlbase: image.urlbase,
            url: 'https://www.bing.com' + image.urlbase + '_1920x1080.jpg',
            imageUrl: 'https://www.bing.com' + image.urlbase + '_1920x1080.jpg',
            mkt: image.mkt,
            startdate: image.startdate,
            enddate: image.enddate,
            fullstartdate: image.fullstartdate,
            hsh: image.hsh
        };

        console.log('✅ 成功获取壁纸信息');
        console.log('   标题:', wallpaper.title);
        console.log('   描述:', wallpaper.description);

        return wallpaper;
    } catch (error) {
        console.error('❌ 获取壁纸失败:', error.message);
        return null;
    }
}

/**
 * 生成唯一ID
 */
function generateId() {
    return moment().format('YYYYMMDD') + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 下载壁纸图片
 */
async function downloadWallpaper(wallpaper) {
    try {
        console.log('[' + new Date().toISOString() + '] 下载壁纸图片...');

        const imageUrl = wallpaper.url;
        const filename = wallpaper.date + '_' + wallpaper.title.replace(/[^a-zA-Z0-9]/g, '_') + '.jpg';
        const filepath = path.join(PUBLIC_DIR, 'wallpapers', filename);

        // 确保目录存在
        const wallpapersDir = path.dirname(filepath);
        if (!fs.existsSync(wallpapersDir)) {
            fs.mkdirSync(wallpapersDir, { recursive: true });
        }

        // 下载图片
        const response = await axios.get(imageUrl, {
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log('✅ 壁纸下载完成:', filepath);
                wallpaper.localPath = `/wallpapers/${filename}`;
                resolve(wallpaper);
            });
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('❌ 下载壁纸失败:', error.message);
        return wallpaper;
    }
}

/**
 * 保存壁纸信息到JSON
 */
function saveWallpaperData(wallpaper) {
    try {
        console.log('[' + new Date().toISOString() + '] 保存壁纸信息...');

        // 保存单个壁纸信息
        const wallpaperFile = path.join(DATA_DIR, 'latest.json');
        fs.writeFileSync(wallpaperFile, JSON.stringify(wallpaper, null, 2));

        // 保存到历史记录
        const historyFile = path.join(DATA_DIR, 'history.json');
        let history = [];

        if (fs.existsSync(historyFile)) {
            const content = fs.readFileSync(historyFile, 'utf-8');
            history = JSON.parse(content);
        }

        // 检查是否已存在当天的壁纸
        const todayIndex = history.findIndex(item => item.date === wallpaper.date);
        if (todayIndex >= 0) {
            history[todayIndex] = wallpaper;
        } else {
            history.unshift(wallpaper);
        }

        // 只保留最近30条记录
        history = history.slice(0, 30);

        fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

        console.log('✅ 壁纸信息已保存');
        return wallpaper;
    } catch (error) {
        console.error('❌ 保存壁纸信息失败:', error.message);
        return wallpaper;
    }
}

/**
 * 生成网页索引
 */
function generateIndex() {
    try {
        console.log('[' + new Date().toISOString() + '] 生成网页索引...');

        const historyFile = path.join(DATA_DIR, 'history.json');
        let wallpapers = [];

        if (fs.existsSync(historyFile)) {
            const content = fs.readFileSync(historyFile, 'utf-8');
            wallpapers = JSON.parse(content);
        }

        const html = generateHTML(wallpapers);
        const indexFile = path.join(PUBLIC_DIR, 'index.html');
        fs.writeFileSync(indexFile, html);

        console.log('✅ 网页索引已生成');
    } catch (error) {
        console.error('❌ 生成网页索引失败:', error.message);
    }
}

/**
 * 生成HTML内容
 */
function generateHTML(wallpapers) {
    const latest = wallpapers[0] || {};
    const items = wallpapers.map((wp, index) => `
    <div class="wallpaper-item">
      <img src="${wp.url || wp.imageUrl || '#'}" alt="${wp.title}" loading="lazy">
      <div class="info">
        <h3>${wp.title || '未知标题'}</h3>
        <p class="description">${wp.description || ''}</p>
        <p class="copyright">${wp.copyright || ''}</p>
        <p class="date">${wp.date || ''}</p>
        ${wp.url ? `<a href="${wp.url}" target="_blank" class="btn-download">下载原图</a>` : ''}
      </div>
    </div>
  `).join('');

    // 注意：保持 items 为数组，以便后续可以使用 slice/join 操作
    // 把上面的 join 移除，返回数组
    // 重新生成 itemsArray 作为数组形式
    const itemsArray = wallpapers.map((wp, index) => `
        <div class="wallpaper-item">
            <img src="${wp.url || wp.imageUrl || '#'}" alt="${wp.title}" loading="lazy">
            <div class="info">
                <h3>${wp.title || '未知标题'}</h3>
                <p class="description">${wp.description || ''}</p>
                <p class="copyright">${wp.copyright || ''}</p>
                <p class="date">${wp.date || ''}</p>
                ${wp.url ? `<a href="${wp.url}" target="_blank" class="btn-download">下载原图</a>` : ''}
            </div>
        </div>
    `);

    return `<!DOCTYPE html>
<html lang="zh-CN">
<!-- wallpaper-id: ${latest.id || ''} timestamp: ${latest.timestamp || ''} -->
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bing 每日壁纸</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #f7fbf9 0%, #ffffff 100%);
            min-height: 100vh;
            padding: 20px;
            color: #2b4d45;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            color: #0f574a;
            margin-bottom: 40px;
        }
        
        header h1 {
            font-size: 3em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .featured {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            margin-bottom: 40px;
        }
        
        .featured img {
            width: 100%;
            height: 400px;
            object-fit: cover;
            display: block;
        }
        
        .featured-info {
            padding: 30px;
        }
        
        .featured-info h2 {
            color: #333;
            margin-bottom: 15px;
            font-size: 2em;
        }
        
        .featured-info p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 10px;
        }
        
        .featured-info .copyright {
            color: #999;
            font-size: 0.9em;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        
        .btn-download {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 30px;
            background: linear-gradient(135deg, #2a9d8f 0%, #88d8c0 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .btn-download:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(42, 157, 143, 0.2);
        }
        
        .wallpapers-title {
            color: #0f574a;
            font-size: 2em;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .wallpapers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .wallpaper-item {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .wallpaper-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        .wallpaper-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
        }
        
        .wallpaper-item .info {
            padding: 15px;
        }
        
        .wallpaper-item h3 {
            color: #333;
            margin-bottom: 8px;
            font-size: 1.1em;
        }
        
        .wallpaper-item .description {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 10px;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .wallpaper-item .copyright {
            color: #999;
            font-size: 0.85em;
        }
        
        .wallpaper-item .date {
            color: #bbb;
            font-size: 0.8em;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #eee;
        }
        
        .wallpaper-item .btn-download {
            display: inline-block;
            padding: 8px 16px;
            font-size: 0.9em;
            margin-top: 10px;
        }
        
        footer {
            text-align: center;
            color: #4b6b64;
            padding: 20px;
            opacity: 0.9;
        }
        
        @media (max-width: 768px) {
            header h1 {
                font-size: 2em;
            }
            
            .featured img {
                height: 250px;
            }
            
            .wallpapers-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🖼️ Bing 每日壁纸</h1>
            <p>每日自动更新最新的必应壁纸</p>
        </header>
        
        ${latest.url || latest.imageUrl ? `
        <div class="featured">
            <img src="${latest.url || latest.imageUrl}" alt="${latest.title}">
            <div class="featured-info">
                <h2>${latest.title || '今日壁纸'}</h2>
                <p>${latest.description || ''}</p>
                <p class="copyright">${latest.copyright || ''}</p>
                <a href="${latest.url || latest.imageUrl}" target="_blank" class="btn-download">⬇️ 下载原图</a>
            </div>
        </div>
        ` : ''}
        
        ${wallpapers.length > 1 ? `
        <h2 class="wallpapers-title">📚 历史壁纸</h2>
        <div class="wallpapers-grid">
            ${itemsArray.slice(1).join('')}
        </div>
        ` : ''}
        
        <footer>
            <p>💡 数据来自 <a href="https://www.bing.com" target="_blank" style="color: yellow;">Bing</a></p>
            <p>最后更新: ${moment().format('YYYY-MM-DD HH:mm:ss')}</p>
        </footer>
    </div>
</body>
</html>`;
}

/**
 * 生成API数据
 */
function generateAPI() {
    try {
        console.log('[' + new Date().toISOString() + '] 生成API数据...');

        const historyFile = path.join(DATA_DIR, 'history.json');
        let wallpapers = [];

        if (fs.existsSync(historyFile)) {
            const content = fs.readFileSync(historyFile, 'utf-8');
            wallpapers = JSON.parse(content);
        }

        // 生成API文件
        const apiDir = path.join(PUBLIC_DIR, 'api');
        if (!fs.existsSync(apiDir)) {
            fs.mkdirSync(apiDir, { recursive: true });
        }

        // latest.json
        if (wallpapers.length > 0) {
            fs.writeFileSync(
                path.join(apiDir, 'latest.json'),
                JSON.stringify({ data: wallpapers[0], status: 'success' }, null, 2)
            );
        }

        // all.json
        fs.writeFileSync(
            path.join(apiDir, 'all.json'),
            JSON.stringify({ data: wallpapers, count: wallpapers.length, status: 'success' }, null, 2)
        );

        console.log('✅ API数据已生成');
    } catch (error) {
        console.error('❌ 生成API数据失败:', error.message);
    }
}

/**
 * 主函数
 */
async function main() {
    try {
        console.log('\n========== Bing 壁纸爬虫 ==========\n');

        // 获取壁纸
        const wallpaper = await fetchBingWallpaper();
        if (!wallpaper) {
            console.error('❌ 无法继续，缺少壁纸数据');
            process.exit(1);
        }

        // 下载壁纸
        await downloadWallpaper(wallpaper);

        // 保存数据
        saveWallpaperData(wallpaper);

        // 生成前端页面
        generateIndex();

        // 生成API数据
        generateAPI();

        console.log('\n✅ 所有任务完成！\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ 发生错误:', error);
        process.exit(1);
    }
}

// 运行
main();
