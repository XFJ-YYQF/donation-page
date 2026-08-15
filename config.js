/*
  ────────────────────────────────────────────────────────────
   捐赠页面配置文件 / Donation Page Config
   页面上几乎所有能自定义的内容都在这个文件里，改这一个文件就够了，
   不用碰 index.html。改完保存、刷新页面即可看到效果。
  ────────────────────────────────────────────────────────────
*/
window.SITE_CONFIG = {

  /* 浏览器标签页标题 */
  pageTitle: '支持我的创作',

  /* 页面顶部的小字标签 */
  eyebrow: 'Support my work',

  /* 简介 / 感谢语，支持简单 HTML（比如 <strong> 加粗、<br> 换行） */
  introHtml: '我是 <strong>夜桜侵雪</strong>，独立创作者。<br>如果对你有帮助，欢迎用任意金额支持我继续做下去。',

  /* 主题色，不填（删掉整个 themeColor 或留 null）则使用默认的薄荷绿 #39C5BB */
  themeColor: {
    accent: '#39C5BB',
    accentDark: '#1FA69C',
    accentTint: '#E6FAF8',
  },

  /*
    收款二维码列表，按顺序显示，想加 / 删 / 改哪个都直接改这个数组即可，
    数量不限，页面会自动换行、最后一行不满时自动撑满。

    每一项：
      id            必填，同时是图片文件名前缀，把图片放在项目根目录。
                    比如 id: 'wechat-qr' 会依次尝试
                    wechat-qr.webp / .png / .jpg / .jpeg，找到即显示，
                    都没有就显示一个占位框（不会报错、不会露出裂图标）。
      name          必填，二维码上方显示的名称
      brand         可选，'wx'（微信绿色图标）或 'ali'（支付宝蓝色图标），
                    不填则使用默认的通用二维码图标
      color         可选，name 文字颜色（十六进制），不填则跟随 brand 配色 /
                    主题色
      tip           可选，二维码下方的小字提示，不填默认「扫码支持」
      reminderHtml  可选，二维码下方额外的提示框（支持简单 HTML），
                    比如提醒「先领红包再捐赠更划算」
  */
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
    // 想加更多收款方式（PayPal、USDT、其他平台收款码等），照着下面这样加一项即可：
    // { id: 'paypal-qr', name: 'PayPal', color: '#003087', tip: '扫码支持' },
    // { id: 'usdt-qr',   name: 'USDT',   color: '#26A17B', tip: '扫码支持' },
  ],

  /* 「更多渠道」链接列表（爱发电等），留空数组 [] 会整块隐藏这个区块 */
  links: [
    { icon: '⚡', name: '爱发电', href: 'https://ifdian.net/a/MinecraftXFJ', hrefLabel: 'ifdian.net/a/MinecraftXFJ' },
  ],

  /* 「捐款用途」列表，留空数组 [] 会整块隐藏这个区块 */
  usageList: [
    '吃小零食喝小甜水',
    '服务器与域名续费',
    '买一些你知道我会穿什么的衣服',
    '维持我的兴趣爱好',
    '攒钱玩 kigurumi ！',
    'SRS！！！',
  ],

  /* 页面底部署名 */
  footerName: '夜桜侵雪',

  /*
    页面顶部的装饰图（吉祥物），放在 assets/img/ 下。
    id 是文件名前缀，优先加载 .webp，找不到自动回退 .jpg。
    留空数组 [] 会整块隐藏这一行。
  */
  mascots: [
    { id: 'mascot-broke', alt: '没钱了' },
    { id: 'mascot-pray', alt: '求打赏' },
  ],

  /* 页面最底部的个人主页 / GitHub 链接，不填（删掉对应字段）就不显示 */
  footerLinks: {
    homepage: { name: '夜桜侵雪', href: 'https://minecraftxfj.top' },
    github: { href: 'https://github.com/XFJ-YYQF/donation-page' },
  },

};
