type ImageJob = {
  url: string;
  image: HTMLImageElement;
  elements: Set<HTMLImageElement>;
  loading?: Promise<boolean>;
};

const jobs = new Map<string, ImageJob>();
let ready = false;

function getJob(source: HTMLImageElement | string) {
  const url = typeof source === 'string' ? source : source.currentSrc || source.src;
  let job = jobs.get(url);
  if (!job) {
    job = { url, image: typeof source === 'string' ? new Image() : source, elements: new Set() };
    jobs.set(url, job);
  }
  if (typeof source !== 'string') {
    job.elements.add(source);
    if (job.loading) void job.loading.then(() => { source.loading = 'eager'; });
  }
  return job;
}

function load(job: ImageJob) {
  if (!job.loading) {
    if (job.image.fetchPriority !== 'high') job.image.fetchPriority = 'low';
    job.image.loading = 'eager';
    if (!job.image.getAttribute('src')) job.image.src = job.url;
    job.loading = job.image.decode().then(() => true, () => false).then(loaded => {
      for (const image of job.elements) image.loading = 'eager';
      return loaded;
    });
  }
  return job.loading;
}

export function prioritizeImage(source: HTMLImageElement | string) {
  const job = getJob(source);
  job.image.fetchPriority = 'high';
  if (typeof source !== 'string') source.fetchPriority = 'high';
  return load(job);
}

let observing = false;
let visibilityChecked: () => void;
const firstVisibilityCheck = new Promise<void>(resolve => { visibilityChecked = resolve; });
const visibleImages = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting || entry.target.closest('[inert], [hidden], .hidden')) continue;
    visibleImages.unobserve(entry.target);
    void prioritizeImage(entry.target as HTMLImageElement);
  }
  visibilityChecked();
});

export function preloadImages(sources: (HTMLImageElement | string)[]) {
  for (const source of sources) {
    getJob(source);
    if (typeof source === 'string') continue;
    observing = true;
    visibleImages.observe(source);
  }
  if (ready) for (const job of jobs.values()) void load(job);
}

async function startBackground() {
  // Native lazy images do not delay window.load, so also wait for the visible images.
  if (observing) await firstVisibilityCheck;
  await Promise.all([...jobs.values()].filter(job => job.image.fetchPriority === 'high').map(load));
  ready = true;
  // Release every remaining image; the browser schedules bandwidth by fetch priority.
  for (const job of jobs.values()) void load(job);
}
if (document.readyState === 'complete') queueMicrotask(startBackground);
else window.addEventListener('load', startBackground, { once: true });
