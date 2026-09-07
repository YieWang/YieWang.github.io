# Yi Wang (王怡) — Personal Academic Homepage

Welcome to the source repository for the personal academic homepage of **Yi Wang (王怡)**: [https://yiewang.github.io/](https://yiewang.github.io/).

---

## 🏛️ About Me
- **Name**: Yi Wang (王怡)
- **Current Affiliation**: University of Regensburg (雷根斯堡大学) — M.Sc. in Mathematics (2026–present)
- **Previous Affiliation**: China Jiliang University (中国计量大学) — B.S. in Mathematics and Applied Mathematics (2022–2026)
- **Research Interests**: Arithmetic Geometry, Algebraic Geometry, Algebraic Number Theory
- **Open Project**: Founder & Maintainer of [Math Translations (数译)](https://mathtranslations.org)
- **Geodetic Coordinates**: Regensburg (49°00′06″ N · 12°05′47″ E) ⇄ Hangzhou (30°18′55″ N · 120°21′52″ E)
- **Contact**: [Yi.Wang@stud.uni-regensburg.de](mailto:Yi.Wang@stud.uni-regensburg.de) · [kasaaa0412@gmail.com](mailto:kasaaa0412@gmail.com)
- **Online Profile**: [https://yiewang.github.io/](https://yiewang.github.io/)

---

## 💻 Tech Stack & Architecture

- **Framework**: [Astro](https://astro.build/) (Static Site Generation) + [Tailwind CSS](https://tailwindcss.com/)
- **Design Philosophy**: Minimalist Academic Editorial, Julian Perilla 100vh Single-Screen Fluid Geometry
- **Interactive Art**: Geodetic Harmonic Wave Engine (HTML5 Canvas)
- **Typography**: Josefin Sans (Name Heading) & Montserrat (Body & Nav)
- **Deployment**: GitHub Pages via GitHub Actions CI/CD

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

Content & Personal Data © Yi Wang (王怡).  
Source code available under the MIT License.

## 本地内容编辑

筛选影视、音乐和书籍：双击 **筛选影视.command**，通过页面顶部切换栏目。音乐按专辑筛选，书籍按本筛选。海报下点击“保留 / 删除”自动保存；“删除”会隐藏条目，在“已删除”筛选中点“保留”即可恢复。支持搜索片名、导演，以及按电影、电视剧、动漫筛选。保存只影响本机，发布后才更新网站。

双击项目目录中的 **编辑主页.command**，在浏览器打开 `http://127.0.0.1:4399/marginalia`。
保持启动时的终端窗口开启；按 Control-C 可以停止服务。

1. 选择兴趣栏目，点击底部“编辑模式”。标题可原地修改；点击图片或条目打开详细编辑面板。
2. “新增 / 管理”可以添加、搜索、隐藏、删除和上下移动条目。音乐下可管理音乐人、专辑和曲目；摄影下可选择年份、相册和照片列表。
3. 点“保存并预览”，修改写入本机内容文件并刷新页面。仅关闭面板不会丢掉当前草稿；尚未保存时离开页面会提示。
4. 改好后告诉 Codex “检查并发布本地修改”。本地保存不触发推送或线上部署。

图片上传后会自动生成 WebP 展示图和缩略图，保存在 `public/local-uploads/`；原图留在 `.local-editor/originals/`。上传完成后还需保存条目。
影视长评和书评使用空行分段，文字按原文显示，不需要写 HTML。

发布检查：用 Git 差异检查 `src/data/` 和新增图片；将实际引用的本地图片上传到现有图片存储并更新地址，验证后再移除本地副本；运行 `node tests/local-editor.mjs`、`npm run build` 和必要的页面检查，再提交、推送并核验部署。不要重新导入外部资料覆盖手工修改。

内容来源：影视 `cinema-import.json`，音乐 `music-import.json`，摄影 `photography.json`，文学 `literature.json`，游戏 `games.json`，邀请及乒乓球文字 `interest-text.json`，均在 `src/data/`。
每次保存前保留该文件的上一版本到 `.local-editor/backups/`；这只是一份防误操作备份，长期历史由 Git 保存。

编辑界面和保存接口只在明确设置 `HOMEPAGE_EDITOR=1` 的本机开发服务中启用，不进入静态发布产物。不需要安装 CMS、数据库或注册账号。
