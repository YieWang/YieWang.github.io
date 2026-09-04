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
    url: "/notes/Abstract_Algebra_Notes.pdf",
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
    title: "Chinese Template",
    type: "LaTeX template",
    previewUrl: "/templates/Chinese_Template_Preview.pdf?v=2",
    sourceUrl: "/templates/Chinese_Template.zip?v=2",
  },
  {
    title: "English Template",
    type: "LaTeX template",
    previewUrl: "/templates/English_Template_Preview.pdf?v=2",
    sourceUrl: "/templates/English_Template.zip?v=2",
  },
  {
    title: "Seminar Template",
    type: "LaTeX template",
    previewUrl: "/templates/Seminar_Template_Preview.pdf?v=3",
    sourceUrl: "/templates/Seminar_Template.zip?v=3",
  },
];
