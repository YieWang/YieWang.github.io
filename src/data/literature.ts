export interface BookItem {
  id: string;
  title: string;                // Display title matching this specific copy (e.g. "局外人", "看不见的城市", "Gödel, Escher, Bach")
  originalTitle: string;        // Original title in original language (e.g. "L'Étranger", "Le città invisibili")
  author: string;               // Author name matching this copy (e.g. "阿尔贝·加缪", "Douglas R. Hofstadter")
  originalAuthor?: string;      // Original author name in original language (e.g. "Albert Camus")
  translator?: string;          // Translator (only if this copy is a translation)
  edition: string;              // Combined concise publisher & edition (e.g. "上海译文出版社 · 2010年版")
  year: number | string;        // Original publication year
  coverUrl: string;             // Public cover URL
  firstRead?: string;           // First read date e.g. "2019.04"
  reread?: string;              // Reread dates e.g. "2021.04, 2024.04"
  review?: {
    date: string;               // Review date
    content: string;            // In-depth review essay
  };
}

export interface EssayItem {
  id: string;
  title: string;                // Essay title
  author: string;               // Author e.g. "王怡"
  year: string;                 // Year e.g. "2025"
  date: string;                 // Date e.g. "2025.8.15"
  location: string;             // Location e.g. "Regensburg"
  content: string;              // Full formatted prose text
}

export const literatureBooks: BookItem[] = [];
export const literatureEssays: EssayItem[] = [];
