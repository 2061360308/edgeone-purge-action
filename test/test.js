const dotenv = require('dotenv');
const fs = require('fs');

// 检查并加载.env文件
if (fs.existsSync('.env')) {
  dotenv.config();
}

// 设置环境变量（优先使用.env中的值）
process.env.INPUT_SECRET_ID = process.env.SECRET_ID || 'your_test_secret_id';
process.env.INPUT_SECRET_KEY = process.env.SECRET_KEY || 'your_test_secret_key';
process.env.INPUT_ZONE_ID = process.env.ZONE_ID || 'your_test_zone_id';
process.env.INPUT_TYPE = process.env.TYPE || 'purge_host';
process.env.INPUT_HOSTNAMES = process.env.HOSTNAMES || 'test.example.com';

// 运行主程序
try {
  require('../dist/main.js');
} catch (error) {
  console.error('测试失败:', error);
  process.exit(1);
}