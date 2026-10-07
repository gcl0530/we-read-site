# WE_READ · 公众号数据系统 — 产品展示站

WE_READ 的在线产品介绍页：极简学术风，支持深浅色切换，纯静态站点（HTML/CSS/JS，零构建）。

## 页面

- `/` — 首页：Hero + 系统规模 + 栏目入口 + 决策工作台截图
- `/features.html` — 核心功能：采集 / 存档 / 批注 / 决策 / 控制台
- `/data.html` — 数据与成果：运行数据 + 四类批注标签体系 + 批注页截图
- `/about.html` — 关于：技术栈、隐私说明（个人简介占位待补）

## 本地预览

任意静态服务器即可，例如：

```
python -m http.server 8080 --directory .
```

浏览器打开 http://127.0.0.1:8080/

## 部署到 Vercel（免费）

1. **推到 GitHub**：在 GitHub 新建一个仓库（如 `we-read-site`），然后：

```bash
git init
git add .
git commit -m "WE_READ 产品展示站"
git remote add origin https://github.com/<你的用户名>/we-read-site.git
git push -u origin main
```

2. **Vercel 导入**：登录 https://vercel.com（用 GitHub 账号）→ New Project → Import 刚才的仓库。
   - Framework Preset 选 **Other**（纯静态，无需构建）
   - Build Command / Output Directory 留空
   - 点击 Deploy，约 1 分钟内完成

3. 部署完成后 Vercel 会分配 `https://we-read-site-xxxx.vercel.app`，可在项目 Settings → Domains 里绑定自己的域名（如有）。

4. 以后每次 `git push`，Vercel 自动重新部署。

## 注意事项

- 站内截图来自系统真实界面，公开前请确认是否需要对公众号名 / 文章标题 / 批注内容打码。
- 站点为纯静态页，不包含任何系统数据接口——展示站与本地系统完全隔离。
