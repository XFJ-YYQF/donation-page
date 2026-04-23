# ☕ 捐赠页面 · Donation Page

一个精美的个人捐赠页面，支持微信支付、支付宝、爱发电等，可一键部署到 Vercel。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/donation-page)

---

## ✨ 功能特性

- 📱 响应式设计，移动端完美适配
- 🟢 微信支付 & 支付宝 收款二维码
- ⚡ 爱发电主页链接（可扩展 Ko-fi、GitHub Sponsors）
- 🎨 优雅的暖金色设计风格
- ⚡ 纯静态，零依赖，部署秒级完成

---

## 🚀 快速部署

### 方式一：一键部署到 Vercel（推荐）

1. Fork 本仓库到你的 GitHub
2. 点击上方 **Deploy with Vercel** 按钮
3. 按提示授权并完成部署

### 方式二：手动导入

1. Fork 本仓库
2. 打开 [vercel.com](https://vercel.com) → **Add New Project**
3. 选择你 Fork 的仓库，点击 **Deploy**
4. 完成！

---

## ⚙️ 个性化配置

编辑 `index.html`，按注释中的 `👇` 提示修改：

### 1. 基本信息

```html
<!-- 修改标语 -->
你的支持是我持续创作的动力。

<!-- 修改个人介绍 -->
Hi，我是 <strong>你的名字</strong>，...

<!-- 修改署名 -->
<p class="footer-name">— 你的名字</p>
```

### 2. 添加收款二维码

将你的收款码图片放到项目根目录：

```
donation-page/
├── index.html
├── vercel.json
├── wechat-qr.png    ← 微信收款码（命名必须一致）
└── alipay-qr.png    ← 支付宝收款码（命名必须一致）
```

页面会自动检测并加载图片，无需修改代码。

> **获取收款码方式：**
> - 微信：「我」→「收付款」→「二维码收款」→ 保存图片
> - 支付宝：首页搜索「收款码」→ 保存图片

### 3. 设置爱发电链接

```html
<a class="link-card" href="https://afdian.com/a/YOUR_USERNAME" ...>
  <div class="link-url">afdian.com/a/YOUR_USERNAME</div>
```

将 `YOUR_USERNAME` 替换为你的爱发电用户名。

### 4. 替换头像（可选）

```html
<!-- 方式A：使用图片文件 -->
<img class="avatar" src="avatar.jpg" alt="头像" />

<!-- 方式B：使用 emoji（默认） -->
<div class="avatar">☕</div>
```

### 5. 启用可选链接（Ko-fi / GitHub Sponsors）

在 `index.html` 中找到对应的注释块，取消注释即可：

```html
<!-- 可选：Ko-fi -->
<!--
<a class="link-card" href="https://ko-fi.com/YOUR_USERNAME" ...>
  ...
</a>
-->
```

---

## 📁 项目结构

```
donation-page/
├── index.html        # 主页面（所有样式内联，无外部依赖）
├── vercel.json       # Vercel 部署配置
├── README.md         # 本文件
├── wechat-qr.png     # [你添加] 微信收款码
├── alipay-qr.png     # [你添加] 支付宝收款码
└── avatar.jpg        # [可选] 头像图片
```

---

## 🛠 本地预览

直接用浏览器打开 `index.html` 即可，无需任何构建工具。

```bash
# 或用 Python 起一个本地服务器（推荐，避免跨域问题）
python3 -m http.server 8080
# 然后访问 http://localhost:8080
```

---

## 📄 License

MIT — 随意使用和修改，欢迎 Star ⭐
