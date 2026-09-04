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
  url: string;
}

export interface TemplateItem {
  title: string;
  type: string;
  previewUrl: string;
  sourceUrl: string;
}

export const notesData: NoteItem[] = [
  {
    title: "Algebraic Number Theory",
    type: "Notes",
    period: "2026—",
    url: "/notes/Algebraic_Number_Theory.pdf",
  },
  {
    title: "Algebraic Geometry",
    type: "Notes",
    period: "2026—",
    url: "/notes/Algebraic_Geometry.pdf",
  },
  {
    title: "Arakelov Geometry",
    type: "Seminar notes",
    period: "2026—",
    url: "/notes/Arakelov_Geometry.pdf",
  },
];

export const expositionData: ExpositionItem[] = [
  {
    title: "Research on Galois Theory in Algebra",
    type: "Bachelor's thesis",
    year: "2026",
    url: "/Research_on_Galois_Theory_in_Algebra.pdf",
  },
];

export const templateData: TemplateItem[] = [
  {
    title: "Mathematical Notes",
    type: "LaTeX template",
    previewUrl: "/templates/preview.pdf",
    sourceUrl: "/templates/math-notes-template.zip",
  },
];
