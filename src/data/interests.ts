export interface ProjectItem {
  name: string;
  nameZh: string;
  role: string;
  url: string;
  launched: string;
  description: string;
  highlights: string[];
}

export interface NoteItem {
  title: string;
  category: string;
  detail: string;
}

export interface InterestsData {
  project: ProjectItem;
  notes: NoteItem[];
  communication: {
    description: string;
    platforms: { name: string; count: string }[];
  };
  marginalia: string[];
}

export const interestsData: InterestsData = {
  project: {
    name: "Math Translations",
    nameZh: "数译",
    role: "Founder & Maintainer",
    url: "https://mathtranslations.org",
    launched: "August 2026",
    description: "A non-commercial open platform for collecting, organizing, and archiving mathematical translations, lecture notes, original treatises, and standardized Chinese-English mathematical terminology.",
    highlights: [
      "Non-commercial & openly accessible for long-term study",
      "Term standardization, edition histories, and community errata",
      "715+ registered users as of August 2026"
    ]
  },
  notes: [
    {
      title: "Arakelov Geometry Seminar",
      category: "University of Regensburg",
      detail: "Working through Atsushi Moriwaki's Arakelov Geometry, investigating arithmetic varieties, hermitian vector bundles, and arithmetic intersection theory."
    },
    {
      title: "Algebraic Number Theory & Lie Algebra",
      category: "Zhejiang University (Audited)",
      detail: "Audited lecture series by Prof. Dongwen Liu (Algebraic Number Theory) and Prof. Fangyang Tian (Lie Algebra)."
    },
    {
      title: "Foundations in Arithmetic Geometry",
      category: "Exposition & Notes",
      detail: "Ongoing studies covering Class Field Theory, Algebraic Curves, L-functions, Weil Heights, and Mordell–Weil Theory."
    }
  ],
  communication: {
    description: "Expository writing on pure mathematics, foundational algebra, and geometry across social platforms.",
    platforms: [
      { name: "WeChat Official Account", count: "1,133 followers" },
      { name: "Zhihu", count: "909 followers" }
    ]
  },
  marginalia: [
    "Cinema & arthouse films",
    "Music & acoustic recordings",
    "Table tennis",
    "Video games"
  ]
};

