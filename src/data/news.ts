export interface NewsItem {
  date: string;
  badge?: string;
  content: string;
  highlightText?: string;
  link?: string;
}

export const newsData: NewsItem[] = [
  {
    date: "2026.10",
    badge: "Study",
    content: "Commenced M.Sc. in Mathematics at the University of Regensburg.",
  },
  {
    date: "2026.08",
    badge: "Project",
    content: 'Founded and launched "Math Translations" (mathtranslations.org), an open platform for mathematical translations and terminology standardization.',
    link: "https://mathtranslations.org",
  },
  {
    date: "2026.06",
    badge: "Degree",
    content: 'Graduated with B.S. in Mathematics and Applied Mathematics from China Jiliang University. Completed B.S. thesis "Research on Galois Theory in Algebra".',
  }
];
