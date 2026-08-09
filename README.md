# ☕ 捐赠页面 · Donation Page

一个精美的个人捐赠页面，支持微信支付、支付宝等收款渠道，并内置**捐赠排行榜 + 累计金额统计**（含后台管理），部署在 **Cloudflare Pages + D1** 上。主题色 `#39C5BB`，桌面端与移动端布局分别优化。

---

## ✨ 功能特性

- 📱 响应式设计：移动端单栏布局，桌面端（≥880px）自动切换为左右两栏（内容 + 常驻排行榜侧栏）
- 🟢 微信支付 & 支付宝收款二维码，可自定义外部渠道链接（爱发电等）
- 🏆 **捐赠排行榜**：按总金额从高到低排序，同一人多次捐赠自动合并，显示「含更多捐赠」可展开明细
- 🕶 **匿名捐赠**：捐赠者名称留空即自动匿名；排行榜显示为「匿名」，且**不会**与其他记录合并
- 💰 首页顶部显示**累计已收到支持**总金额（自动求和，含数字滚动动画）
- 🏷 **渠道管理**：在后台自由添加/删除捐赠渠道，录入时下拉选择，不再局限于预设的三个选项
- 🔐 **后台管理**（`/admin.html`）：密码登录后可添加 / 编辑 / 删除任意捐赠记录，追加捐赠只需再录入一条同名记录
- ☁️ 数据存储在 Cloudflare D1（SQLite），通过 Cloudflare Pages Functions 提供 API，零额外后端服务器

---

## 📁 项目结构

```
donation-page/
├── index.html                     # 公开捐赠页（含排行榜 + 累计金额展示）
├── admin.html                     # 后台管理页（密码登录 + 渠道管理）
├── wechat-qr.png / alipay-qr.png  # 收款二维码
├── assets/img/                    # 页面装饰图片
├── functions/                     # Cloudflare Pages Functions（后端 API）
│   ├── _lib/auth.js                #  签名 Cookie 会话工具（无第三方依赖）
│   └── api/
│       ├── leaderboard.js          # GET  /api/leaderboard          公开，聚合排行榜 + 总金额
│       ├── auth/
│       │   ├── login.js            # POST /api/auth/login            管理员登录
│       │   ├── logout.js           # POST /api/auth/logout           退出登录
│       │   └── status.js           # GET  /api/auth/status           查询登录状态
│       └── admin/
│           ├── _middleware.js      # 保护下面所有 /api/admin/* 路由
│           ├── donations.js        # GET 列表 / POST 新增（含 is_anonymous）
│           ├── donations/[id].js   # PUT 编辑 / DELETE 删除
│           ├── channels.js         # GET 渠道列表 / POST 新增渠道
│           └── channels/[id].js    # DELETE 删除渠道
├── schema.sql                     # D1 数据库表结构（全新部署用）
├── migrations/
│   └── 0002_anonymous_and_channels.sql   # 已部署过旧版的，用这个升级
└── wrangler.toml                  # Cloudflare 部署配置
```

---

## 🚀 部署到 Cloudflare Pages

### 1. 创建 D1 数据库

```bash
npx wrangler login
npx wrangler d1 create donation_db
```

命令会输出一个 `database_id`，把它填入 `wrangler.toml` 中的：

```toml
[[d1_databases]]
binding = "DB"
database_name = "donation_db"
database_id = "在这里填入你的 database_id"
```

也可以完全在 Dashboard 里操作：**Storage & Databases → D1 SQL Database → Create Database**。

### 2. 初始化表结构

**全新部署**（第一次建库）：

```bash
npx wrangler d1 execute donation_db --remote --file=./schema.sql
```

**升级已有部署**（之前已经跑过旧版 `schema.sql`，现在要用匿名捐赠 / 渠道管理功能）：

```bash
npx wrangler d1 execute donation_db --remote --file=./migrations/0002_anonymous_and_channels.sql
```

不用命令行也可以：进 D1 数据库详情页 → **Console** 标签 → 把对应 `.sql` 文件内容粘贴进去 → 执行。

### 3. 创建 Pages 项目并部署

```bash
npx wrangler pages project create donation-page
npx wrangler pages deploy .
```

也可以直接在 Cloudflare Dashboard → **Workers & Pages → 创建应用 → Pages → 连接到 Git** 导入这个仓库，Cloudflare 会自动识别 `functions/` 目录并部署 API；构建命令留空，输出目录填 `.`（当前目录）。

> 通过 Dashboard 绑定 D1 时：**变量名称必须填 `DB`**（区分大小写，要和代码里的 `env.DB` 一致），D1 数据库选择你在第 1 步创建的那个。绑定后需要重新部署一次才会生效。

### 4. 设置管理员密码（必须）

```bash
npx wrangler pages secret put ADMIN_PASSWORD
# 按提示输入你的后台登录密码
```

可选：单独设置一个用于签名会话 Cookie 的密钥（不设置则自动使用 `ADMIN_PASSWORD`）：

```bash
npx wrangler pages secret put SESSION_SECRET
```

### 5. 完成

访问你的 Pages 域名即可看到捐赠页；访问 `/admin.html` 用刚才设置的密码登录后台，添加第一条捐赠记录，排行榜和累计金额会立即更新。

---

## 🖥 本地开发预览

```bash
# 本地创建同名 D1 数据库（自动生成本地 SQLite 文件，不影响线上数据）
npx wrangler d1 execute donation_db --local --file=./schema.sql

# 启动本地开发服务器（含 Functions + D1 模拟）
ADMIN_PASSWORD=你的本地测试密码 npx wrangler pages dev . --port 8788
```

然后访问 `http://localhost:8788`。

> 只想看静态页面效果（不测试排行榜/后台）时，也可以直接用 `python3 -m http.server` 打开 `index.html`，此时排行榜会显示「加载失败」，属正常现象（因为没有 Functions + D1 提供接口）。

---

## ⚙️ 个性化配置

### 1. 基本信息 / 二维码 / 外部渠道

编辑 `index.html`，按注释中的 `👇` 提示修改标语、简介、署名，并将收款码图片替换为 `wechat-qr.png` / `alipay-qr.png`（文件名保持一致会自动显示）。爱发电等链接在 `link-list` 区块修改或取消注释启用。

### 2. 装饰图片

`assets/img/` 下的 `mascot-broke.jpg`、`mascot-pray.jpg` 是页面顶部的装饰配图，可直接替换为你自己的图片（保持文件名，或同时修改 `index.html` 里的 `<img src>`）。

### 3. 主题色

主题色变量在 `index.html` 和 `admin.html` 的 `:root` 里（`--accent` / `--accent-dark` / `--accent-tint`），默认是 `#39C5BB`，改这三个值即可整体换色。

### 4. 管理捐赠渠道

登录 `/admin.html` 后，展开「管理捐赠渠道」面板：

- 输入新渠道名称并点击「添加渠道」，之后填写捐赠记录时就能在下拉框里选到
- 也可以在添加记录表单里点渠道旁边的「＋」快速新增
- 点渠道标签上的 `×` 可以删除渠道（只影响下拉选项，已有的捐赠记录不受影响）

### 5. 管理排行榜数据

- **添加新捐赠**：填写捐赠者名称、渠道、金额（可选备注/日期），点击「添加记录」
- **追加捐赠**：用同样的「捐赠者名称」再添加一条新记录即可，排行榜会自动把同名记录的金额相加，显示为总金额，并可展开查看每一笔明细
- **匿名捐赠**：捐赠者名称留空将自动按匿名录入；公开排行榜显示为「匿名」，且**不会**与任何其他记录合并，但金额仍计入首页顶部的累计总金额
- **编辑 / 删除**：在「全部记录」列表中对任意一条记录点击「编辑」或「删除」，编辑会预填表单，保存后立即生效
- 排行榜按总金额从高到低自动排序，无需手动调整顺序

---

## 🔒 安全说明

- 管理员密码以 Cloudflare Secret 形式存储，不会出现在代码或仓库中
- 登录后签发的会话是一个用 HMAC-SHA256 签名的 Cookie（`HttpOnly`、`Secure`、`SameSite=Strict`），7 天后自动过期，`/api/admin/*` 的所有请求都会校验签名和过期时间
- 捐赠者名称留空即匿名：公开排行榜只显示「匿名」，后台列表也以匿名标记展示
- 建议使用一个**独立于其他账号**的强密码，且不要把记录密码的文件提交到公开仓库

---

## 📄 License

MIT — 随意使用和修改，欢迎 Star ⭐
