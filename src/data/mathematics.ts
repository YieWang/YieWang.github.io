export interface NoteItem {
  title: string;
  type: string;
  period: string;
  url?: string;
}

export interface ExpositionItem {
  title: string;
  type: string;
  year: string;
  url?: string;
}

export interface TalkItem {
  title: string;
  event: string;
  year: string;
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
  },
  {
    title: "Atlas",
    type: "Figures",
    period: "2026–",
    url: "https://homepage-assets.mathtranslations.org/notes/Atlas.pdf",
  },
];

export const expositionData: ExpositionItem[] = [
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

export const templateData: TemplateItem[] = [
  {
    title: "English",
    type: "LaTeX template",
    previewUrl: "https://homepage-assets.mathtranslations.org/templates/English.pdf?v=9",
    sourceUrl: "https://homepage-assets.mathtranslations.org/templates/English.zip?v=9",
  },
  {
    title: "Chinese",
    type: "LaTeX template",
    previewUrl: "https://homepage-assets.mathtranslations.org/templates/Chinese.pdf?v=8",
    sourceUrl: "https://homepage-assets.mathtranslations.org/templates/Chinese.zip?v=8",
  },
  {
    title: "Seminar",
    type: "LaTeX template",
    previewUrl: "https://homepage-assets.mathtranslations.org/templates/Seminar.pdf?v=8",
    sourceUrl: "https://homepage-assets.mathtranslations.org/templates/Seminar.zip?v=8",
  },
  {
    title: "Lecture",
    type: "LaTeX template",
    previewUrl: "https://homepage-assets.mathtranslations.org/templates/Lecture.pdf?v=8",
    sourceUrl: "https://homepage-assets.mathtranslations.org/templates/Lecture.zip?v=8",
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
