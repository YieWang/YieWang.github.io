# 现代学术与个人主页 (Academic Homepage)

本项目为个人学术与生活主页，基于 **Astro + Tailwind CSS** 构建，严格遵循 [DESIGN.md](./DESIGN.md) 确立的“现代人文与雅致学术 (Modern Editorial & Scholarly)”设计规范。

---

## ✨ 特性与亮点

- 🏛️ **现代人文与学术排版**：采用优雅的现代衬线体（Newsreader）与温润纸白质感（`#fafaf9`），通透明亮。
- 🚫 **恪守设计红线**：根据 [DESIGN.md](./DESIGN.md)，彻底排除任何暗黑模式、极客黑客风、紫色调与霓虹浮夸动效。
- 📊 **学术成果画廊**：
  - 自动识别并加粗本人作者姓名（支持高亮下划线）；
  - 论文会议/期刊徽章（CVPR Oral、NeurIPS 等）；
  - 原生轻量 BibTeX 引用复制弹窗，无需跳转外页；
  - 论文 PDF、开源代码与项目主页直达。
- ☕ **生活与兴趣札记 (Life & Beyond Research)**：
  - 胶片摄影相册与光影记录；
  - 案头在读书目与哲思摘抄；
  - 日常长跑成绩与生活步调；
  - 随想小思卡片。
- 🚀 **数据彻底解耦**：所有内容存放在 `src/data/` 目录中，增删论文或修改简介无需动及任何 HTML 模板。
- 🌐 **一键发布至 GitHub Pages**：内置官方推荐的 GitHub Actions 持续集成流。

---

## 🛠️ 本地运行与开发

```bash
# 1. 安装依赖
npm install

# 2. 启动本地实时预览服务
npm run dev

# 3. 生产环境构建打包
npm run build

# 4. 预览打包后的静态站点
npm run preview
```

本地服务启动后，在浏览器访问 `http://localhost:4321` 即可实时查看并修改页面。

---

## 📝 如何修改与定制个人内容

所有个人内容均存放在 `src/data/` 目录下的 TypeScript 文件中，按需编辑即可：

| 文件 | 用途 | 说明 |
| :--- | :--- | :--- |
| `src/data/profile.ts` | **个人基本信息** | 姓名、职称、研究方向简述、详细介绍、Google Scholar 链接及引用数、GitHub、邮箱等 |
| `src/data/news.ts` | **最新学术/个人动态** | 按时间倒序的更新动态列表（日期、标签、文字内容、链接） |
| `src/data/publications.ts` | **论文成果库** | 论文标题、作者列表、会议名称、年份、录用类型、摘要、BibTeX 引用源码、PDF/代码外链 |
| `src/data/interests.ts` | **生活与兴趣札记** | 摄影作品图注、案头在读图书与书摘、日常运动步调、随想短文等 |

---

## 🚀 部署至 GitHub Pages 指南

1. **新建 GitHub 仓库**：
   - 推荐仓库名为 `你的用户名.github.io`（作为根域名主页），或者任意项目名如 `homepage`。

2. **推送本地代码到 GitHub**：
   ```bash
   git init
   git add .
   git commit -m "feat: initial academic homepage"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

3. **启用 GitHub Pages**：
   - 打开 GitHub 仓库页面，进入 **Settings (设置)** -> **Pages**。
   - 在 **Build and deployment** -> **Source** 下拉框中，选择 **GitHub Actions**。
   - 每次向 `main` 分支推送代码，`.github/workflows/deploy.yml` 就会自动编译并将静态页面部署上线！

---

## 📐 设计规范准则

开发新功能或调整样式前，请务必阅读并遵照项目根目录的 [DESIGN.md](./DESIGN.md)。
