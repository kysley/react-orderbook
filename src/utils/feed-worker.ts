export const feedWorker = new Worker(
  new URL('./feed.worker.js', import.meta.url),
);
