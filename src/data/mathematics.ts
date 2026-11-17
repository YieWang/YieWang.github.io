export interface NoteItem {
  title: string;
  type: string;
  period: string;
  url?: string;
}

// Mathematics 栏目固定为 Paper → Thesis → Talk → Conference → Teaching → Note → Template；
// 没有条目的栏目整栏不显示，填入条目后自动出现。

export interface PaperItem {
  title: string;
  coauthors?: string; // 如 "with A. Author"
  venue: string;      // 如 "Preprint"、期刊名
  year: string;
  url?: string;
}

export interface ThesisItem {
  title: string;
  type: string; // 如 "Bachelor's thesis"
  year: string;
  url?: string;
}

export interface TalkItem {
  title: string;
  event: string;
  year: string;
  url?: string;
}

export interface ConferenceItem {
  title: string; // 会议名
  place: string; // 如 "Regensburg"
  year: string;
  url?: string;
}

export interface TeachingItem {
  title: string; // 课程名
  role: string;  // 如 "Tutor"
  term: string;  // 如 "Winter 2026/27"
  url?: string;
}

export interface TemplateItem {
  title: string;
  type: string;
  previewUrl: string;
  sourceUrl: string;
}

export const notesData: NoteItem[] = [
  {
    title: "Abstract Algebra",
    type: "Notes",
    period: "2024–2025",
    url: "https://homepage-assets.mathtranslations.org/notes/Abstract_Algebra_Notes.pdf",
  },
  {
    title: "Algebraic Geometry",
    type: "Notes",
    period: "2026–",
  },
  {
    title: "Category Theory",
    type: "Notes",
    period: "2026–",
    url: "https://homepage-assets.mathtranslations.org/notes/Category_Theory_Notes.pdf",
  },
  {
    title: "Atlas",
    type: "Figures",
    period: "2026–",
    url: "https://homepage-assets.mathtranslations.org/notes/Atlas.pdf",
  },
];

export const paperData: PaperItem[] = [];

export const thesisData: ThesisItem[] = [
  {
    title: "Research on Galois Theory in Algebra",
    type: "Bachelor's thesis",
    year: "2026",
  },
];

export const talkData: TalkItem[] = [
  {
    title: "Riemann–Roch and Effective Sections",
    event: "Arakelov Geometry Seminar",
    year: "2026",
    url: "https://homepage-assets.mathtranslations.org/talks/Riemann-Roch_and_Effective_Sections.pdf",
  },
];

export const conferenceData: ConferenceItem[] = [];

export const teachingData: TeachingItem[] = [];

export const templateData: TemplateItem[] = [
  {
    title: "English",
    type: "LaTeX template",
    previewUrl: "https://homepage-assets.mathtranslations.org/templates/English.pdf?v=11",
    sourceUrl: "https://homepage-assets.mathtranslations.org/templates/English.zip?v=11",
  },
  {
    title: "Chinese",
    type: "LaTeX template",
    previewUrl: "https://homepage-assets.mathtranslations.org/templates/Chinese.pdf?v=11",
    sourceUrl: "https://homepage-assets.mathtranslations.org/templates/Chinese.zip?v=11",
  },
  {
    title: "Seminar",
    type: "LaTeX template",
    previewUrl: "https://homepage-assets.mathtranslations.org/templates/Seminar.pdf?v=11",
    sourceUrl: "https://homepage-assets.mathtranslations.org/templates/Seminar.zip?v=11",
  },
  {
    title: "Lecture",
    type: "LaTeX template",
    previewUrl: "https://homepage-assets.mathtranslations.org/templates/Lecture.pdf?v=11",
    sourceUrl: "https://homepage-assets.mathtranslations.org/templates/Lecture.zip?v=11",
  },
  {
    title: "Talk",
    type: "LaTeX template",
    previewUrl: "https://homepage-assets.mathtranslations.org/templates/Talk.pdf?v=9",
    sourceUrl: "https://homepage-assets.mathtranslations.org/templates/Talk.zip?v=9",
  },
  {
    title: "Homework",
    type: "LaTeX template",
    previewUrl: "https://homepage-assets.mathtranslations.org/templates/Homework.pdf?v=9",
    sourceUrl: "https://homepage-assets.mathtranslations.org/templates/Homework.zip?v=9",
  },
];
