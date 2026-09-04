# 个人主页设计规范指南 (DESIGN.md)

本文档是本个人主页所有视觉设计、界面布局、配色方案及前端组件开发的最根本遵循准则。本规范在汲取现代极简设计精髓的基础上，**坚决贯彻“无方框、零多余横线、纯文本呼吸感、丝滑淡入淡出（Crossfade）”的超纯净学术美学**。

---

## 一、 核心红线原则 (Strict Red Lines)

> [!CAUTION]
> **以下设计元素一律绝对禁止：**
>
> 1. **绝对禁止任何方框与线框包裹（No Boxes or Button Borders）**：
>    * 导航菜单、论文操作按钮、外链一律禁止使用矩形边框（`border`）或胶囊框包裹。
>    * 全部回归**高定纯文字排印美学**：依靠字母大写、宽字间距、字重与悬浮深浅对比传递交互状态。
> 2. **绝对禁止首页多余横线（No Redundant Horizontal Lines on Homepage）**：
>    * 顶栏完全移除上下夹持的发丝横线，让导航字形在纯白天地中完全开放呼吸；
>    * 首页（Home）彻底零横线，绝不用横线切割视野，完全依托排版层级、大字间距与从容留白划分节奏；
>    * 页脚版权区去除分割横线与冗余修饰，依靠充裕留白自然下沉。
> 3. **绝对禁止生硬突兀的页面跳切（No Harsh Toggling）**：
>    * 多专页切换必须遵循 Julián Perilla 范式的**丝滑淡入淡出动效（Crossfade & Micro-Scale）**，通过 `opacity` 与微幅 `scale` 带来如画廊展陈般的呼吸过渡感。
> 4. **绝对禁止衬线古典字体（No Serif Typography）**：
>    * 严禁使用任何老派古典衬线字体（Garamond / Newsreader / Times）。
>    * **全站严格锁定几何无衬线双字体系统**：
>      * 学者姓名：**`Josefin Sans`（700 Bold、全大写、`letter-spacing: 0.5rem` 超大字间距）**，中文姓名以基线对齐排在英文名侧旁；
>      * 正文、小标题、导航与按钮文本：**`Montserrat`（300 超轻字重与 400/600）**。
> 5. **绝对禁止极客黑客化与暗黑模式**：
>    * 严格纯白背景 `#FFFFFF`，文字温雅炭灰 `#474747` 与中灰 `#5C5C5C`，严禁终端绿、暗黑背景与高饱和霓虹色。
> 6. **绝对禁止首屏信息堆砌（No Single-Page Dumping）**：
>    * 首页保持纯粹单屏名片：大字姓名 + 2 句轻盈学术介绍 + 极简链接 + 肖像，零论文列表杂质。论文与笔记全面独立解耦至 `#research` 与 `#notes`。

---

## 二、 核心设计语言与 Token

### 1. 字体系统 (Typography System)
* **学者姓名（Name Heading）**：
  * 主标题（H1）：仅使用英文大字 **`YI WANG`**（`'Josefin Sans', sans-serif`，字重 `700`，字号 `2.625rem`，行高 `1.375`，全大写，`letter-spacing: 0.5rem` 超大字间距，字色 `#474747`，不出现多余字符，保持 100% 纯净排印）。
  * 中文名（Native Name）：在正文简介第一句自然写出：“*I am Yi Wang (王怡), a Master's student in...*”，保持大标题的国际化与极简秩序。
* **正文与个人简介（Body Text）**：
  * 字数控制：严格保持 **2 句精炼自述（约 30 词以内）**，严禁堆砌长篇术语。
  * 第一句：交代姓名、硕士身份、院校实验室与核心大方向；
  * 第二句：交代此前本科背景或导师。
  * 字体族：`'Montserrat', sans-serif`，字重 `300` (Light)，字号 `1rem` ~ `1.0625rem`，行高 `1.95`，字色 `#474747`。
* **首页联系方式（Single Email Icon）**：
  * 首页底部**仅保留单个纯粹的 SVG 邮箱图标**，绝不放多余的文字链接或平铺社交图标，保持 100% Julián Perilla 极致留白。
  * 字体族：`'Montserrat', sans-serif`，字重 `700`，字号 `1.25rem`，全大写居中，字色 `#5C5C5C`，`letter-spacing: 0.15rem`。

### 2. 动效与交互系统 (Silky Crossfade System)
* **页面切换动效 (Crossfade Animation)**：
  * 离场动效：`transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);`，当前激活页面透明度降为 `0`，轻微缩放至 `scale(0.96)`；
  * 进场动效：`transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);`，目标专页自 `scale(0.96)` 与 `opacity: 0` 平滑缩放至 `scale(1)` 与 `opacity: 1`。
* **去方框纯文字导航 (Borderless Navigation)**：
  * 菜单项（`HOME` · `RESEARCH` · `NOTES` · `CV`），`letter-spacing: 0.25rem`；
  * 激活态纯黑加粗高对比，静止态雅灰 `#737373`，悬停平滑变黑。项间距 `3rem` 以上。

---

## 三、 硕士阶段专页架构建议 (Master's Persona Architecture)

1. **HOME 视图 (`#home`)**：
   * **单屏零滚动原则 (Zero-Scroll Viewport)**：桌面端严格适配 100vh 单屏，绝无纵向滚动条，打开即一览无余；
   * **文字下沉 (Text Settling)**：左侧姓名与正文适度下移（`md:pt-14 lg:pt-20`），与上方顶栏拉开空间，重心更加沉稳从容；
   * **正文字数极简**：严格控制在 20 词左右（身份 + 核心方向），绝不堆砌冗余信息；
   * **更大肖像画幅**：右侧肖像采用大画幅 2:3 纵向比例（`max-w-[440px] aspect-[2/3]`），与左侧文字形成强大现代气场；
   * **独尊邮箱图标**：底部仅保留单个极简 SVG 邮箱图标。
   * 专收论文与预印本（Publications & Preprints）以及正进行中的探索（Work in Progress）。
3. **NOTES 视图 (`#notes`)**：
   * 针对硕士生阶段最契合的版块，替代传统的 Teaching：
     * **Research Notes & Takeaways**：前沿文献精读心得、模型轻量化思考、实验复盘；
     * **Marginalia & Life**：摄影、人文阅读书单、跑步生活等个人印记。
