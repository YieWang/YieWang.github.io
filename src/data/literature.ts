import literature from './literature.json';
import authorSortNames from './literature-sort-names.json';
import { hasComment } from '../lib/review-order';

export interface BookItem {
  collection?: string;          // Explicit narrative series, not a publisher's imprint
  collectionEnglishTitle?: string;
  partOrder?: number;
  partLabel?: string;
  installments?: BookItem[];
  collectionReview?: BookItem['review'];
  sourceIds?: string[];
  hidden?: boolean;
  id: string;
  title: string;                // Display title matching this specific copy (e.g. "局外人", "看不见的城市", "Gödel, Escher, Bach")
  englishTitle?: string;        // Primary display title matching Cinema-style English shelf
  originalTitle: string;        // Original title in original language (e.g. "L'Étranger", "Le città invisibili")
  author: string;               // Author name matching this copy (e.g. "阿尔贝·加缪", "Douglas R. Hofstadter")
  originalAuthor?: string;      // Original author name in original language (e.g. "Albert Camus")
  translator?: string;          // Translator (only if this copy is a translation)
  edition: string;              // Combined concise publisher & edition (e.g. "上海译文出版社 · 2010年版")
  year: number | string;        // Publication year of the recorded edition
  originalYear?: number;        // First publication of the work, used for ordering and the list year
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
const essayDate = (essay: EssayItem) => {
  const [year = 0, month = 0, day = 0] = essay.date.split(/\D+/).map(Number);
  return year * 10000 + month * 100 + day;
};
export const literatureEssays: EssayItem[] = (literature.essays as EssayItem[])
  .filter(essay => !essay.hidden).sort((a, b) => essayDate(b) - essayDate(a));

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
    return installments.length > 1 ? {
      ...first,
      title: first.collection!,
      englishTitle: first.collectionEnglishTitle || first.englishTitle || first.collection!,
      installments
    } : first;
  });
}

// Keep each author's collections and standalone books together.
const authorOrder = new Intl.Collator('en', { sensitivity: 'base', numeric: true, ignorePunctuation: true });
const authorName = (book: BookItem) => book.originalAuthor || book.author;
const authorSortName = (book: BookItem) => (authorSortNames as Record<string, string>)[authorName(book)] || authorName(book);
const authorGroups = new Map<string, BookItem[]>();
for (const book of groupBookCollections(literatureBooks)) {
  const key = authorName(book);
  const group = authorGroups.get(key) || [];
  group.push(book);
  authorGroups.set(key, group);
}
export const literatureBookCards = [...authorGroups.values()]
  .map(group => group.sort((a, b) => (a.originalYear ?? Infinity) - (b.originalYear ?? Infinity)))
  .sort((a, b) => Number(b.some(hasComment)) - Number(a.some(hasComment))
    || authorOrder.compare(authorSortName(a[0]), authorSortName(b[0])))
  .flat();
