# ☕ 捐赠页面 · Donation Page

一个精美的个人捐赠页面，支持微信支付、支付宝等收款渠道，并内置**捐赠排行榜 + 累计金额统计**（含后台管理），部署在 **Cloudflare Pages + D1** 上。主题色 `#39C5BB`，桌面端与移动端布局分别优化。

ps.你就用你的 ai 吧，雪你完蛋了你知道吗？！！你还记得当年你手搓的快乐时光吗？！。。。

---

## ✨ 功能特性

- 📱 响应式设计：移动端单栏布局，桌面端（≥880px）自动切换为左右两栏（内容 + 常驻排行榜侧栏）
- ⚙️ **`config.js` 单文件配置**：简介、主题色、二维码、外部渠道、捐款用途、装饰图、页脚链接等所有可自定义内容都集中在这一个文件里，不用碰 `index.html`
- 🟢 微信支付收款二维码 + 支付宝**经营码 / 经营收款单 / 红包码**三合一，红包码下方带一条固定提示：建议先领红包再捐赠更划算；另支持自定义外部渠道链接（爱发电等）
- ➕ **可选扩展更多收款二维码**：PayPal / USDT / 其他平台收款码等，在 `config.js` 里加一项配置即可，不配置就不显示
- 🖼 二维码 & 装饰图片均支持 **WebP**：按 `.webp → .png → .jpg → .jpeg` 顺序自动探测，放哪种格式的图都不用改代码
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
├── config.js                      # 页面文案 / 二维码 / 链接等所有可配置参数
├── admin.html                     # 后台管理页（密码登录 + 渠道管理）
├── _headers                       # Cloudflare Pages 响应头配置（安全头 + 静态资源缓存）
├── wechat-qr.* / alipay-biz-qr.* / alipay-order-qr.* / alipay-redpacket-qr.*  # 收款二维码（.webp/.png/.jpg/.jpeg 均可）
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

页面上几乎所有能自定义的内容都集中在项目根目录的 **`config.js`** 一个文件里，改这一个文件就够了，不需要碰 `index.html`。改完保存、刷新页面即可看到效果。

### 1. 基本信息 / 简介 / 主题色

编辑 `config.js`：

- `pageTitle` 浏览器标签页标题
- `eyebrow` 页面顶部小字标签
- `introHtml` 简介 / 感谢语，支持 `<strong>` `<br>` 等简单 HTML
- `footerName` 页面底部署名
- `themeColor` 主题色（`accent` / `accentDark` / `accentTint`），默认是 `#39C5BB`，改这三个值即可整体换色（`admin.html` 的主题色仍在其自身 `:root` 里单独改）

### 2. 收款二维码

在 `config.js` 的 `qrChannels` 数组里增删改，想放几个放几个，页面会自动换行、最后一行不满时自动撑满：

```js
qrChannels: [
  { id: 'wechat-qr', name: '微信支付', brand: 'wx', tip: '微信扫一扫' },
  { id: 'alipay-biz-qr', name: '经营码', brand: 'ali', tip: '支付宝扫一扫' },
  { id: 'alipay-order-qr', name: '经营收款单', brand: 'ali', tip: '支付宝扫一扫' },
  {
    id: 'alipay-redpacket-qr',
    name: '红包码',
    brand: 'ali',
    tip: '支付宝扫一扫',
    reminderHtml: '💡 建议先领<strong>红包</strong>，再用经营码 / 收款单捐赠，可以抵扣一部分金额，更划算～',
  },
  // { id: 'paypal-qr', name: 'PayPal', color: '#003087', tip: '扫码支持' },
],
```

- `id` 必填，同时是图片文件名前缀，放在项目根目录：上面例子 `wechat-qr` 会依次尝试 `wechat-qr.webp` / `.png` / `.jpg` / `.jpeg`，找到即显示，都没有就显示占位框（不会报错）
- `name` 必填，二维码上方名称
- `brand` 可选，`'wx'`（微信绿色图标）或 `'ali'`（支付宝蓝色图标），不填用默认通用图标
- `color` 可选，名称文字颜色，不填跟随 brand 配色 / 主题色
- `tip` 可选，二维码下方小字提示，不填默认「扫码支持」
- `reminderHtml` 可选，二维码下方额外提示框，支持简单 HTML

### 3. 更多渠道 / 捐款用途

`config.js` 里的 `links`（爱发电等外部渠道）和 `usageList`（捐款用途列表）都是数组，直接增删条目即可；留空数组 `[]` 会整块隐藏对应区块。

### 4. 装饰图片

`config.js` 里的 `mascots` 数组对应 `assets/img/` 下的装饰配图，`id` 是文件名前缀，优先加载 `.webp`，找不到自动回退 `.jpg`；留空数组 `[]` 会隐藏这一整行。想换图直接替换 `assets/img/` 下对应文件即可，不用改配置。

### 5. 页脚链接

`config.js` 里的 `footerLinks.homepage` / `footerLinks.github` 控制页面最底部的个人主页和 GitHub 链接，删掉对应字段就不显示；后台管理入口固定显示，不需要配置。

### 6. 管理捐赠渠道

登录 `/admin.html` 后，展开「管理捐赠渠道」面板：

- 输入新渠道名称并点击「添加渠道」，之后填写捐赠记录时就能在下拉框里选到
- 也可以在添加记录表单里点渠道旁边的「＋」快速新增
- 点渠道标签上的 `×` 可以删除渠道（只影响下拉选项，已有的捐赠记录不受影响）

### 6. 管理排行榜数据

- **添加新捐赠**：填写捐赠者名称、渠道、金额（可选备注/日期），点击「添加记录」
- **追加捐赠**：用同样的「捐赠者名称」再添加一条新记录即可，排行榜会自动把同名记录的金额相加，显示为总金额，并可展开查看每一笔明细
- **匿名捐赠**：捐赠者名称留空将自动按匿名录入；公开排行榜显示为「匿名」，且**不会**与任何其他记录合并，但金额仍计入首页顶部的累计总金额
- **编辑 / 删除**：在「全部记录」列表中对任意一条记录点击「编辑」或「删除」，编辑会预填表单，保存后立即生效
- 排行榜按总金额从高到低自动排序，无需手动调整顺序

---

## 🔒 安全说明

- 管理员密码以 Cloudflare Secret 形式存储，不会出现在代码或仓库中
- 登录后签发的会话是一个用 HMAC-SHA256 签名的 Cookie（`HttpOnly`、`Secure`、`SameSite=Strict`），7 天后自动过期，`/api/admin/*` 的所有请求都会校验签名和过期时间
- 所有数据库查询都使用参数化绑定（`?` 占位符），不存在 SQL 注入风险；所有从数据库/配置渲染回页面的内容（捐赠者名称、备注、渠道名等）都经过转义后再插入 DOM，不存在 XSS 风险
- `_headers` 文件为全站加了一层响应头加固：`Content-Security-Policy`、`X-Frame-Options: DENY`（防点击劫持）、`X-Content-Type-Options`、`Referrer-Policy`、`Permissions-Policy` 等；`/admin.html` 额外设置了 `noindex, nofollow` 防止被搜索引擎收录
- 捐赠者名称留空即匿名：公开排行榜只显示「匿名」，后台列表也以匿名标记展示
- 建议使用一个**独立于其他账号**的强密码，且不要把记录密码的文件提交到公开仓库
- 登录接口 `/api/auth/login` 目前没有内置的暴力破解速率限制，建议在 Cloudflare 控制台给这个路径单独配置一条 **Rate Limiting** 规则（比如同一 IP 每分钟最多 5 次），这个防护放在 Cloudflare 边缘层面做比写在代码里更可靠

## ⚡ 性能优化

- 收款二维码 / 装饰图片都按实际显示尺寸重新采样压缩过（保留 WebP，视觉效果不变），体积合计减少了约 70%
- Google Fonts 只请求页面实际用到的字重，去掉了从未使用过的字重文件，减少字体下载体积
- 用内联 SVG favicon 替代默认的 `/favicon.ico`，避免每次访问都产生一次多余的 404 请求
- `_headers` 文件给二维码图片、装饰图、`assets/*` 设置了一年期的强缓存（`immutable`），重复访问时浏览器直接读本地缓存，不再发请求；`config.js` 给了 5 分钟短缓存，兼顾性能和改完能较快生效；`/admin.html` 和 `/api/*` 保持不缓存，保证数据始终最新
- 没有对 `index.html` / `admin.html` 做压缩混淆：这个项目本身没有构建步骤，仓库里的 HTML 就是直接部署的文件，压缩后的空白字符在 Cloudflare 的 Brotli/Gzip 传输压缩下本来也省不了多少实际流量，但会让以后手动改文件变得很难读，权衡下来不划算

---

## 📄 License

MIT — 随意使用和修改，欢迎 Star ⭐
