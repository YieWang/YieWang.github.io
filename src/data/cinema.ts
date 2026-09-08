import directorSortNames from './cinema-sort-names.json';
import importedCinema from './cinema-import.json';
import { cinemaGroups, cinemaCollectionTitles } from './media-curation.json';
import { hasComment, reviewFirst } from '../lib/review-order';

export interface MediaItem {
  installments?: MediaItem[];   // Films or seasons sharing one collection card
  seasons?: (Partial<MediaItem> & { id: string; title: string; year: number | string; posterUrl: string; releaseDate?: string })[];
  hidden?: boolean;
  id: string;
  title: string;                 // English display title
  chineseTitle?: string;
  partLabel?: string;
  originalTitle?: string;        // Original native title (e.g. "東京物語")
  type: 'film' | 'series';       // 'film' or 'series'
  director: string;              // Director or Showrunner
  creditRole?: string;          // Actual role of the displayed credit
  chineseDirector?: string;
  originalDirector?: string;     // Native director name (e.g. "岩井俊二", "小津安二郎")
  year: number | string;         // Start year (e.g. 1953, 2015)
  span?: string;                 // Year span for series (e.g. "2015–2022")
  country: string;               // Country
  genre: string;                 // Genre
  studio?: string;               // Animation studio of the first installment
  runtime?: string;              // Runtime or seasons (e.g. "136 min", "6 Seasons")
  format?: string;               // Technical format (e.g. "35mm · B&W · 1.37:1")
  posterUrl: string;             // 2:3 vertical poster
  stillUrl?: string;             // 16:9 or widescreen still
  rating?: string;               // Personal rating e.g. "5.0 / 5.0" (available with or without full essay)
  firstWatched?: string;         // First watch date e.g. "2019.04"
  rewatched?: string;            // Rewatch dates e.g. "2021.04, 2024.04"
  externalLink?: {
    platform: 'IMDb' | 'Douban' | 'TMDb';
    url: string;
  };
  tmdbId?: number;
  watchedEntries?: { doubanId: string; title: string; firstWatched: string; rating: string; comment: string }[];
  review?: {
    date?: string;               // e.g. "2026.02"
    quote?: string;              // Iconic quote in English
    content: string;             // Full review in English
  };
}

const importedItems = (importedCinema as MediaItem[]).filter(item => !item.hidden);
const isAnimation = (item: MediaItem) => item.genre.split(', ').includes('Animation');
const seriesById = new Map(cinemaGroups.flatMap((ids, group) => ids.map(id => [id, group] as const)));

function relatedOrder(items: MediaItem[]): MediaItem[] {
  const groups = new Map<string, MediaItem[]>();
  for (const item of items) {
    const series = seriesById.get(item.id);
    const key = series === undefined ? `director:${item.director}` : `series:${series}`;
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  }
  return [...groups.values()]
    .sort((a, b) => Number(b.some(item => item.review)) - Number(a.some(item => item.review)))
    .flatMap(group => group.sort((a, b) => Number(a.year) - Number(b.year)
      || Number(b.type === 'series') - Number(a.type === 'series')));
}

export const cinemaAnimation = relatedOrder(importedItems.filter(isAnimation));
export const cinemaFilms = relatedOrder(importedItems.filter(item => item.type === 'film' && !isAnimation(item)));
export const cinemaSeries = importedItems.filter(item => item.type === 'series' && !isAnimation(item));
export const allCinemaItems: MediaItem[] = importedItems;

// Explicit franchise groups only; sharing a director does not make a collection.
const collectionTitles: Record<string, string> = cinemaCollectionTitles;

export function groupFilmCollections(items: MediaItem[]): MediaItem[] {
  const emitted = new Set<number>();
  return items.flatMap(item => {
    const group = seriesById.get(item.id);
    if (item.type !== 'film' || group === undefined) return [item];
    if (emitted.has(group)) return [];
    emitted.add(group);
    const installments = items.filter(film => film.type === 'film' && seriesById.get(film.id) === group)
      .sort((a, b) => Number(a.year) - Number(b.year) || cinemaGroups[group].indexOf(a.id) - cinemaGroups[group].indexOf(b.id));
    if (installments.length < 2) return installments;
    const first = installments[0];
    return [{ ...first, title: collectionTitles[cinemaGroups[group][0]] || first.title,
      director: [...new Set(installments.map(film => film.director))].join(', '), installments }];
  });
}

// Keep a director's collections and standalone films together, in release order.
const leadDirector = (item: MediaItem) => (item.installments?.[0] || item).director.split(',')[0].trim();
const directorSortName = (item: MediaItem) => (directorSortNames as Record<string, string>)[leadDirector(item)] || leadDirector(item);
const directorOrder = new Intl.Collator('en', { sensitivity: 'base', numeric: true, ignorePunctuation: true });
const filmDirectorGroups = new Map<string, MediaItem[]>();
for (const item of groupFilmCollections(cinemaFilms)) {
  const key = leadDirector(item) || item.id;
  const group = filmDirectorGroups.get(key) || [];
  group.push(item);
  filmDirectorGroups.set(key, group);
}
export const cinemaFilmCards = [...filmDirectorGroups.values()]
  .map(group => group.sort((a, b) => Number(a.year) - Number(b.year)))
  .sort((a, b) => Number(b.some(hasComment)) - Number(a.some(hasComment))
    || directorOrder.compare(directorSortName(a[0]), directorSortName(b[0])))
  .flat();

// Seasons reuse the same detail switcher as film collections.
export function withSeasonDetails(item: MediaItem): MediaItem {
  if (!item.seasons?.length) return item;
  const { seasons, ...series } = item;
  const installments = [...seasons].sort((a, b) => String(a.releaseDate || a.year).localeCompare(String(b.releaseDate || b.year))).map(season => ({
    ...series, ...season, span: undefined, review: season.review,
    rating: season.rating || '', firstWatched: season.firstWatched || '', rewatched: season.rewatched || '',
    watchedEntries: season.watchedEntries || [],
  }));
  return { ...series, year: installments[0].year, posterUrl: installments[0].posterUrl, installments };
}

export const cinemaSeriesCards = cinemaSeries.map(withSeasonDetails)
  .sort((a, b) => reviewFirst(a, b) || Number(a.year) - Number(b.year));

const animationCards = groupFilmCollections(cinemaAnimation).map(withSeasonDetails);
const animationTier = (item: MediaItem) => (item.type === 'series' ? 0 : 2)
  + ((item.installments?.length || 0) > 1 ? 0 : 1);

// Review priority moves whole studio groups, without crossing the four tiers.
const studioGroups = new Map<string, MediaItem[]>();
for (const item of animationCards) {
  const key = item.studio ? `${item.type}:${(item.installments?.length || 0) > 1}:${item.studio}` : item.id;
  const group = studioGroups.get(key) || [];
  group.push(item);
  studioGroups.set(key, group);
}
export const cinemaAnimationCards = [...studioGroups.values()]
  .map(group => group.sort((a, b) => Number(a.year) - Number(b.year)))
  .sort((a, b) => animationTier(a[0]) - animationTier(b[0])
    || Number(b.some(hasComment)) - Number(a.some(hasComment))
    || Number(a[0].year) - Number(b[0].year))
  .flat();
