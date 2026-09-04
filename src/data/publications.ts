export interface ResearchItem {
  id: string;
  title: string;
  author: string;
  supervisor?: string;
  institution?: string;
  degree?: string;
  journal?: string;
  year: number;
  url?: string; // Direct arXiv or PDF link
}

export interface WorkingItem {
  title: string;
  description: string;
}

export const researchData: ResearchItem[] = [
  {
    id: "wang2026galois",
    title: "Research on Galois Theory in Algebra",
    author: "Yi Wang",
    supervisor: "Kunbo Wang",
    institution: "China Jiliang University",
    degree: "B.S. Thesis in Mathematics",
    year: 2026,
    url: "" // 点击跳转 arXiv 或论文链接
  }
];

export const workInProgressData: WorkingItem[] = [
  {
    title: "Arakelov Geometry Seminar Notes (Regensburg)",
    description: "Study based on Atsushi Moriwaki's Arakelov Geometry, focusing on arithmetic varieties, heights, and intersections."
  },
  {
    title: "Expository Notes on Algebraic Number Theory",
    description: "Audited lecture materials and notes covering Dedekind domains, ideal class groups, and local fields."
  },
  {
    title: "Studies in Arithmetic Geometry & Mordell–Weil Theory",
    description: "Foundations on algebraic curves, Weil heights, and abelian varieties."
  }
];

// Compatibility exports
export const thesisData = researchData;
export const publicationsData = researchData;


