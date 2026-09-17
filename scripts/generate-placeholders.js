'use strict';

/**
 * @file scripts/generate-placeholders.js
 * @description 批量生成 SVG 占位图脚本。
 *
 * 用法：
 *   node scripts/generate-placeholders.js
 *
 * 生成规则：
 *   - 菜品  => src/static/exhibit/{name}.svg  (750x500, 背景 #c8a97e, 白字菜名)
 *   - 时辰  => src/static/timeslot/{slot}.svg (750x400, 背景 themeColor, 白字时辰名)
 *   - 名厨  => src/static/exhibit/{name}.svg  (300x300, 圆形背景 #c8a97e, 白字姓氏)
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// 内置数据（从 mock/exhibit.js 与 time-slots.js 手工提取，保持路径不变）
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} DishEntry
 * @property {string} name  - 菜品名称
 * @property {string} image - 图片路径，形如 /static/exhibit/xxx.jpg
 */

/** @type {DishEntry[]} */
const DISHES = [
  { name: '清蒸武昌鱼', image: '/static/exhibit/wuchangyu.jpg' },
  { name: '排骨藕汤',   image: '/static/exhibit/paigulotang.jpg' },
  { name: '沔阳三蒸',   image: '/static/exhibit/mianyang.jpg' },
  { name: '红菜薹炒腊肉', image: '/static/exhibit/hongcaitai.jpg' },
  { name: '潜江油焖大虾', image: '/static/exhibit/qianjiangxia.jpg' },
  { name: '黄陂三合',   image: '/static/exhibit/huangpi.jpg' },
  { name: '东坡肉',     image: '/static/exhibit/dongporou.jpg' },
  { name: '荆沙甲鱼',   image: '/static/exhibit/jingsha.jpg' },
  { name: '钟祥蟠龙菜', image: '/static/exhibit/panlongcai.jpg' },
  { name: '珍珠丸子',   image: '/static/exhibit/zhenzhuwanzi.jpg' },
];

/**
 * @typedef {Object} TimeSlotEntry
 * @property {string} slot       - 时辰标识，如 'zi'
 * @property {string} name       - 时辰名称，如 '子时'
 * @property {string} themeColor - 背景主题色，如 '#1a237e'
 */

/** @type {TimeSlotEntry[]} */
const TIME_SLOTS = [
  { slot: 'zi',   name: '子时', themeColor: '#1a237e' },
  { slot: 'chou', name: '丑时', themeColor: '#283593' },
  { slot: 'yin',  name: '寅时', themeColor: '#1b5e20' },
  { slot: 'mao',  name: '卯时', themeColor: '#e65100' },
  { slot: 'chen', name: '辰时', themeColor: '#00695c' },
  { slot: 'si',   name: '巳时', themeColor: '#558b2f' },
  { slot: 'wu',   name: '午时', themeColor: '#e64a19' },
  { slot: 'wei',  name: '未时', themeColor: '#f57f17' },
  { slot: 'shen', name: '申时', themeColor: '#ff8f00' },
  { slot: 'you',  name: '酉时', themeColor: '#bf360c' },
  { slot: 'xu',   name: '戌时', themeColor: '#4a148c' },
  { slot: 'hai',  name: '亥时', themeColor: '#0d1b2a' },
];

/**
 * @typedef {Object} ChefEntry
 * @property {string} name  - 厨师姓名
 * @property {string} photo - 图片路径，形如 /static/exhibit/chef-xxx.jpg
 */

/** @type {ChefEntry[]} */
const CHEFS = [
  { name: '卢永良', photo: '/static/exhibit/chef-lu.jpg' },
  { name: '孙昌弼', photo: '/static/exhibit/chef-sun.jpg' },
  { name: '余明社', photo: '/static/exhibit/chef-yu.jpg' },
  { name: '邹志平', photo: '/static/exhibit/chef-zou.jpg' },
  { name: '王海东', photo: '/static/exhibit/chef-wang.jpg' },
];

// ---------------------------------------------------------------------------
// SVG 生成函数
// ---------------------------------------------------------------------------

/**
 * 生成菜品占位 SVG。
 * 尺寸 750x500，背景色 #c8a97e，白色大字居中显示菜名。
 *
 * @param {string} label - 菜品名称
 * @returns {string} SVG 字符串
 */
function buildDishSvg(label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="750" height="500" viewBox="0 0 750 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d4b896"/>
      <stop offset="100%" stop-color="#b8935a"/>
    </linearGradient>
  </defs>
  <rect width="750" height="500" fill="url(#bg)"/>
  <text
    x="375"
    y="265"
    font-family="sans-serif"
    font-size="64"
    font-weight="bold"
    fill="#ffffff"
    text-anchor="middle"
    dominant-baseline="middle"
  >${label}</text>
</svg>`;
}

/**
 * 生成时辰占位 SVG。
 * 尺寸 750x400，背景色取自时辰 themeColor，白色大字居中显示时辰名。
 *
 * @param {string} label      - 时辰名称，如 '子时'
 * @param {string} bgColor    - 背景主题色
 * @returns {string} SVG 字符串
 */
function buildTimeSlotSvg(label, bgColor) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="750" height="400" viewBox="0 0 750 400">
  <rect width="750" height="400" fill="${bgColor}"/>
  <text
    x="375"
    y="210"
    font-family="sans-serif"
    font-size="72"
    font-weight="bold"
    fill="#ffffff"
    text-anchor="middle"
    dominant-baseline="middle"
  >${label}</text>
</svg>`;
}

/**
 * 生成名厨占位 SVG。
 * 尺寸 300x300，圆形背景色 #c8a97e，白色大字居中显示姓名第一个字。
 *
 * @param {string} name - 厨师姓名（取第一个字）
 * @returns {string} SVG 字符串
 */
function buildChefSvg(name) {
  const initial = name.charAt(0);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <circle cx="150" cy="150" r="150" fill="#c8a97e"/>
  <text
    x="150"
    y="150"
    font-family="sans-serif"
    font-size="120"
    font-weight="bold"
    fill="#ffffff"
    text-anchor="middle"
    dominant-baseline="middle"
  >${initial}</text>
</svg>`;
}

// ---------------------------------------------------------------------------
// 文件写入工具
// ---------------------------------------------------------------------------

/**
 * 确保目录存在，不存在则递归创建。
 *
 * @param {string} dirPath - 目录绝对路径
 * @returns {void}
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 将 SVG 内容写入指定路径，自动创建父目录。
 *
 * @param {string} filePath - 输出文件绝对路径
 * @param {string} content  - SVG 字符串
 * @returns {void}
 */
function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

// ---------------------------------------------------------------------------
// 路径解析工具
// ---------------------------------------------------------------------------

/**
 * 根据 image/photo 路径（形如 /static/exhibit/xxx.jpg）
 * 推导出输出 SVG 文件的绝对路径（根目录 src/，扩展名改为 .svg）。
 *
 * @param {string} assetPath - 形如 /static/exhibit/xxx.jpg
 * @returns {string} 绝对路径，形如 <projectRoot>/src/static/exhibit/xxx.svg
 */
function resolveOutputPath(assetPath) {
  const projectRoot = path.resolve(__dirname, '..');
  // assetPath 以 / 开头，去掉开头的 /，拼到 src/ 下
  const relative = assetPath.replace(/^\//, '');
  const svgRelative = relative.replace(/\.[^.]+$/, '.svg');
  return path.join(projectRoot, 'src', svgRelative);
}

/**
 * 根据 slot 标识推导时辰 SVG 的输出绝对路径。
 *
 * @param {string} slot - 时辰标识，如 'zi'
 * @returns {string} 绝对路径，形如 <projectRoot>/src/static/timeslot/zi.svg
 */
function resolveTimeSlotOutputPath(slot) {
  const projectRoot = path.resolve(__dirname, '..');
  return path.join(projectRoot, 'src', 'static', 'timeslot', `${slot}.svg`);
}

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------

/**
 * 脚本入口：批量生成所有 SVG 占位图并打印统计信息。
 *
 * @returns {void}
 */
function main() {
  let count = 0;

  // 1. 菜品
  for (const dish of DISHES) {
    const outputPath = resolveOutputPath(dish.image);
    const svg = buildDishSvg(dish.name);
    writeFile(outputPath, svg);
    count += 1;
  }

  // 2. 时辰
  for (const ts of TIME_SLOTS) {
    const outputPath = resolveTimeSlotOutputPath(ts.slot);
    const svg = buildTimeSlotSvg(ts.name, ts.themeColor);
    writeFile(outputPath, svg);
    count += 1;
  }

  // 3. 名厨
  for (const chef of CHEFS) {
    const outputPath = resolveOutputPath(chef.photo);
    const svg = buildChefSvg(chef.name);
    writeFile(outputPath, svg);
    count += 1;
  }

  console.log(`共生成 ${count} 个文件`);
}

main();
