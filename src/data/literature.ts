import literature from './literature.json';

export interface BookItem {
  collection?: string;          // Explicit narrative series, not a publisher's imprint
  partOrder?: number;
  installments?: BookItem[];
  collectionReview?: BookItem['review'];
  sourceIds?: string[];
  hidden?: boolean;
  id: string;
  title: string;                // Display title matching this specific copy (e.g. "局外人", "看不见的城市", "Gödel, Escher, Bach")
  originalTitle: string;        // Original title in original language (e.g. "L'Étranger", "Le città invisibili")
  author: string;               // Author name matching this copy (e.g. "阿尔贝·加缪", "Douglas R. Hofstadter")
  originalAuthor?: string;      // Original author name in original language (e.g. "Albert Camus")
  translator?: string;          // Translator (only if this copy is a translation)
  edition: string;              // Combined concise publisher & edition (e.g. "上海译文出版社 · 2010年版")
  year: number | string;        // Publication year of the recorded edition
  coverUrl: string;             // Public cover URL
  coverWidth?: number;          // Intrinsic size reserves space before the image loads
  coverHeight?: number;
  firstRead?: string;           // First read date e.g. "2019.04"
  reread?: string;              // Reread dates e.g. "2021.04, 2024.04"
  review?: {
    date: string;               // Review date
    content: string;            // In-depth review essay
  };
}

export interface EssayItem {
  hidden?: boolean;
  id: string;
  title: string;                // Essay title
  author: string;               // Author e.g. "王怡"
  year: string;                 // Year e.g. "2025"
  date: string;                 // Date e.g. "2025.8.15"
  location: string;             // Location e.g. "Regensburg"
  content: string;              // Full formatted prose text
}

export const literatureBooks: BookItem[] = (literature.books as BookItem[]).filter(book => !book.hidden);
export const literatureEssays: EssayItem[] = (literature.essays as EssayItem[]).filter(essay => !essay.hidden);

export function groupBookCollections(books: BookItem[]): BookItem[] {
  const groups = new Map<string, BookItem[]>();
  for (const book of books) {
    const key = book.collection || book.id;
    const group = groups.get(key) || [];
    group.push(book);
    groups.set(key, group);
  }
  return [...groups.values()].map(group => {
    const installments = group.sort((a, b) => (a.partOrder || 0) - (b.partOrder || 0));
    const first = installments[0];
    return installments.length > 1 ? { ...first, title: first.collection!, installments } : first;
  });
}

// Keep each author's collections and standalone books together.
const authorGroups = new Map<string, BookItem[]>();
for (const book of groupBookCollections(literatureBooks)) {
  const key = book.author;
  const group = authorGroups.get(key) || [];
  group.push(book);
  authorGroups.set(key, group);
}
export const literatureBookCards = [...authorGroups.values()]
  .map(group => group.sort((a, b) => Number(!!b.installments) - Number(!!a.installments) || Number(a.year) - Number(b.year)))
  .sort((a, b) => Number(!!b[0].installments) - Number(!!a[0].installments) || Number(a[0].year) - Number(b[0].year))
  .flat();
