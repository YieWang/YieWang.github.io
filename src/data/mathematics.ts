export interface NoteItem {
  title: string;
  type: string;
  period: string;
  url: string;
}

export interface ExpositionItem {
  title: string;
  type: string;
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
];

export const expositionData: ExpositionItem[] = [
  {
    title: "Research on Galois Theory in Algebra",
    type: "Bachelor's thesis",
    year: "2026",
  },
];

export const templateData: TemplateItem[] = [
  {
    title: "English",
    type: "LaTeX template",
    previewUrl: "https://homepage-assets.mathtranslations.org/templates/English_Template_Preview.pdf?v=2",
    sourceUrl: "https://homepage-assets.mathtranslations.org/templates/English_Template.zip?v=2",
  },
  {
    title: "Chinese",
    type: "LaTeX template",
    previewUrl: "https://homepage-assets.mathtranslations.org/templates/Chinese_Template_Preview.pdf?v=3",
    sourceUrl: "https://homepage-assets.mathtranslations.org/templates/Chinese_Template.zip?v=3",
  },
  {
    title: "Seminar",
    type: "LaTeX template",
    previewUrl: "https://homepage-assets.mathtranslations.org/templates/Seminar_Template_Preview.pdf?v=3",
    sourceUrl: "https://homepage-assets.mathtranslations.org/templates/Seminar_Template.zip?v=3",
  },
];
