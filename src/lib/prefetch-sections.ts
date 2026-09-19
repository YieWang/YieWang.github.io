import { prioritizeImage, preloadImages } from './preload-images';

export interface SectionPrefetchEntry {
  pageUrl: string;
  heroImages: string[];
  thumbnails?: string[];
}

export type SectionPrefetchManifest = Record<string, SectionPrefetchEntry>;

const prefetchedImages = new Set<string>();

function isDataSaver(): boolean {
  if (typeof navigator === 'undefined') return false;
  return Boolean((navigator as any).connection?.saveData);
}

export function prefetchPage(_url: string): void {
  // Page documents are tiny static HTML; avoid link prefetch to prevent browser navigation lock contention
}

export function prefetchImages(urls: string[], priority: 'high' | 'low' = 'low'): void {
  if (typeof window === 'undefined' || isDataSaver()) return;

  const validUrls = urls.filter(url => Boolean(url));
  const newUrls = validUrls.filter(url => !prefetchedImages.has(url));
  newUrls.forEach(url => prefetchedImages.add(url));

  if (priority === 'high') {
    // Immediately elevate to high priority and decode in background
    for (const url of validUrls) {
      void prioritizeImage(url);
    }
  } else if (newUrls.length > 0) {
    preloadImages(newUrls);
  }
}

export function warmSection(
  entry: SectionPrefetchEntry | undefined,
  priority: 'high' | 'low' = 'low'
): void {
  if (!entry) return;
  if (entry.pageUrl) prefetchPage(entry.pageUrl);
  if (entry.heroImages && entry.heroImages.length > 0) {
    prefetchImages(entry.heroImages, priority);
  }
  if (entry.thumbnails && entry.thumbnails.length > 0) {
    prefetchImages(entry.thumbnails, 'low');
  }
}

export function scheduleIdlePrefetch(
  manifest: SectionPrefetchManifest,
  order = ['photography', 'cinema', 'music', 'literature', 'games']
): void {
  if (typeof window === 'undefined' || isDataSaver()) return;

  const runWarmup = () => {
    order.forEach((sectionId, idx) => {
      const entry = manifest[sectionId];
      if (!entry) return;
      // Stagger each section warmup by 350ms to maintain silky smooth frame rates
      setTimeout(() => {
        warmSection(entry, 'low');
      }, idx * 350);
    });
  };

  const schedule = () => {
    // Wait until home page render, fonts and canvas wave are 100% stable
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => setTimeout(runWarmup, 1200), { timeout: 4000 });
    } else {
      setTimeout(runWarmup, 1600);
    }
  };

  if (document.readyState === 'complete') {
    schedule();
  } else {
    window.addEventListener('load', schedule, { once: true });
  }
}
