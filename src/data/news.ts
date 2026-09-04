export interface NewsItem {
  date: string;
  badge?: string;
  content: string;
  highlightText?: string;
  link?: string;
}

export const newsData: NewsItem[] = [
  {
    date: "2026.07",
    badge: "Paper",
    content: '论文 "FlashAttn-V4: Extreme Sparse Vision-Language Attention" 被 CVPR 2026 录用为',
    highlightText: "Oral Presentation",
    link: "#publications",
  },
  {
    date: "2026.04",
    badge: "Talk",
    content: "受邀在北京人工智能学术研讨会做关于《端侧多模态模型高效量化与轻量化架构》的主题学术报告。",
  },
  {
    date: "2025.12",
    badge: "Award",
    content: "荣获博士研究生国家奖学金 (National Scholarship for Graduate Students)。",
  },
  {
    date: "2025.09",
    badge: "Paper",
    content: '论文 "LatentAlign: Unified Representation Learning" 被 NeurIPS 2025 录用为',
    highlightText: "Spotlight Presentation",
    link: "#publications",
  }
];
