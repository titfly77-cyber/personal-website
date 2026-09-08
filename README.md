# Tenghui Tu · Personal engineering portfolio

技术优先的三语个人作品网站。首次访问为英文，支持简体、繁体切换。首页、九个项目详情与总览均使用本地内容；字体和媒体不依赖第三方加载。

## 本地预览

安装 Node.js 后，在本目录执行 `npm run dev`，访问 http://localhost:4173 。预览站点仅绑定本机。

`npm run build` 生成 `dist/`；`npm run preview` 预览构建结果。网站没有运行时框架依赖。

## 内容维护

- `data.js`：三语文案、项目贡献、有效仓库链接、实习内容。
- `app.js`：首页、项目总览、详情页与语言切换。
- `styles.css`：字体、色彩、响应式排版。
- `assets/`：仅纳入网站所需的照片、视频、简历及本地字体。
- 新增中文字符后需要更新 Noto 字体子集，或以完整的 Noto Serif SC/TC 字体替换对应文件。

扫床机器人按用户确认采用 ADRC；巡线小车按已有源码展示 PID 轮速控制。BOARD-MIND 空仓库不设源码链接；受限实习图片不包含在站点资产中。短视频与照片的图注区分原型版本，示意图明确标示为结构说明。

## GitHub Pages

本目录可以作为独立仓库。`dist/` 为发布产物，部署时只上传此目录的内容；原始简历资料目录和开发依赖不属于发布产物。所有资产为相对路径，使用哈希路由，兼容仓库子路径，刷新项目详情也可访问。

当前未自动推送或发布到 GitHub。也可将 `dist/` 内容放入 GitHub Pages 使用的分支后在仓库设置中开启 Pages。

## 验证

运行 `npm install`、`npx playwright install chromium`，再执行 `npm test`。浏览器验证覆盖三语、路由、素材、视频、简历和移动端布局。测试截图保存在 `test-results/`。

## 字体

英文主字体为 Cormorant Garamond；简繁汉字分别由 Noto Serif SC/TC 补充。字体采用 SIL Open Font License，许可文本保存在 `assets/fonts/`。页面中的中文字体文件为针对当前文案的本地子集。
