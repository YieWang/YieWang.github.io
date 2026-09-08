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

双击项目目录中的 **编辑主页.command**，在浏览器打开 `http://127.0.0.1:4399/marginalia`。
保持启动时的终端窗口开启；按 Control-C 可以停止服务。

1. 选择兴趣栏目，点击底部“编辑模式”。标题可原地修改；点击图片或条目打开详细编辑面板。
2. “新增 / 管理”可以添加、搜索、隐藏、删除和上下移动条目。音乐下可管理音乐人、专辑和曲目；摄影下可选择年份、相册和照片列表。
3. 点“保存并预览”，修改写入本机内容文件并刷新页面。仅关闭面板不会丢掉当前草稿；尚未保存时离开页面会提示。
4. 改好后双击 **发布主页.command**。工具检查内容、上传新图片并构建，显示本次改动后，输入“发布”并回车。出现“发布成功”后即可关闭窗口。本地保存本身不触发线上部署。

图片上传后会自动生成 WebP 展示图和缩略图，保存在 `public/local-uploads/`；原图留在 `.local-editor/originals/`。上传完成后还需保存条目。
影视长评和书评使用空行分段，文字按原文显示，不需要写 HTML。

发布包含影视、音乐、摄影、文学、游戏、栏目文字，以及 `media-curation.json` 中已保存的所有操作：文字、评分、评论、新增、删除、隐藏、恢复、顺序和图片。程序代码与样式修改会另行提示，不混入内容发布。没有新改动时可以重新部署当前版本。

新图片和配套缩略图会上传到现有 R2，下载核对文件内容后再更新地址；只上传被保存条目引用的图片及配套缩略图。未保存到条目的上传图片不会上线。本地图片与原图保留，地址更新前的内容另存于 `.local-editor/publish-backups/`。取消最后的发布确认不会提交或推送，但已经验证的图片可能已上传 R2。

检查在临时副本里运行，不影响本地编辑器预览。期间暂不能保存；发布窗口结束后刷新编辑器再继续。工具提交并推送到 GitHub，等待 Pages 部署成功，再核对线上九个页面的文字、顺序及图片地址。不要重新导入外部资料覆盖手工修改。

终端操作（另开一个窗口，保持编辑器原来的窗口开启）：

```bash
cd /Users/wangyi/Documents/Homepage
npm run publish:check  # 只检查和构建，不上传、不提交、不推送
npm run publish        # 正式发布，最后输入“发布”确认
```

看到报错时不要关掉提示就当作成功；本地内容仍在。网络中断可以重新双击发布入口，上次尚未推送的内容和后续已保存的编辑会一并发布。GitHub 部署失败时，重新发布可重新运行部署。如果 GitHub 登录失效，按提示运行 `gh auth login --hostname github.com --git-protocol https --web`；R2 登录失效时运行 `npx --yes wrangler@4.129.0 login`，在浏览器完成登录后重试。使用已有本机登录，不在项目里保存密码或令牌。

仅有日常编辑器操作时不需要手动使用 Git。若提示分支不同、存在冲突或其他代码提交尚未同步，先处理终端指出的 Git 状态；工具不会强制推送或覆盖这些内容。

内容来源：影视 `cinema-import.json`，音乐 `music-import.json`，摄影 `photography.json`，文学 `literature.json`，游戏 `games.json`，邀请及乒乓球文字 `interest-text.json`，均在 `src/data/`。
每次保存前保留该文件的上一版本到 `.local-editor/backups/`；这只是一份防误操作备份，长期历史由 Git 保存。

本地工作素材 `Homepage-Assets/` 保留为项目内的真实目录，并由 Git 忽略；临时构建和素材脚本依赖项目路径，不将它移出后用符号链接替代。`.local-editor/` 下的 `originals`、`backups`、`publish-backups` 是项目内的真实目录，工具可按需创建，日常操作不依赖外部归档。此前归档的原图和旧备份仍保存在 `/Users/wangyi/Documents/Homepage-Archive/editor/`；个人照片归档在该归档根目录的 `Homepage-Photography/`，项目中的同名链接仅供查阅。长期整理标准见《本站规范》的“文件整理与瘦身的长期标准”。

编辑界面和保存接口只在明确设置 `HOMEPAGE_EDITOR=1` 的本机开发服务中启用，不进入静态发布产物。不需要安装 CMS、数据库或注册账号。

`reports/music-standard-editions-audit.json` 和 `reports/literature-ordering-audit.json` 是音乐标准版与文学首次出版年份的测试依据，保留在仓库中，分别供 `tests/music-standard-editions.mjs` 和 `tests/collection-order.mjs` 核验来源。其他历史报告放在 `/Users/wangyi/Documents/Homepage-Archive/reports/`。

历史导入、选图和素材处理资料归档在 `/Users/wangyi/Documents/Homepage-Archive/Working-History-20260908/Homepage-Assets/`。其中的旧脚本仅作为历史资料保留，不是日常维护入口；再次使用时应先检查路径并恢复所需工作文件。项目内仍保留现有整理脚本和来源检查使用的资料、翻书生成素材，以及尚未发布的书籍调整材料。
