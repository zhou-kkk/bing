#!/usr/bin/env node

/**
 * 测试脚本
 */

const axios = require('axios');
const moment = require('moment');

async function test() {
    try {
        console.log('\n========== 测试 Bing API ==========\n');

        const BING_URL = 'https://www4.bing.com/HPImageArchive.aspx';

        const params = {
            format: 'js',
            idx: 0,
            n: 1,
            mkt: 'zh-CN'
        };

        console.log('📡 正在请求 Bing API...');
        console.log('URL:', BING_URL);
        console.log('参数:', params);

        const response = await axios.get(BING_URL, {
            params: params,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const data = response.data;

        if (!data.images || data.images.length === 0) {
            console.error('❌ 未获取到壁纸数据');
            process.exit(1);
        }

        const image = data.images[0];

        console.log('\n✅ 成功获取壁纸信息:\n');
        console.log('标题:', image.title);
        console.log('描述:', image.description);
        console.log('版权:', image.copyright);
        console.log('日期:', image.startdate, '~', image.enddate);
        console.log('网址:', 'https://www.bing.com' + image.urlbase + '_1920x1080.jpg');

        console.log('\n========== 测试成功 ==========\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        process.exit(1);
    }
}

test();
