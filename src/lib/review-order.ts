type ReviewedItem = {
  hidden?: boolean;
  review?: { content?: string };
  collectionReview?: { content?: string };
  installments?: ReviewedItem[];
  seasons?: ReviewedItem[];
};

export function hasComment(item: ReviewedItem): boolean {
  return !item.hidden && (!!item.review?.content?.trim() || !!item.collectionReview?.content?.trim()
    || !!item.installments?.some(hasComment) || !!item.seasons?.some(hasComment));
}

// Stable sorting preserves the existing order within both groups.
export const reviewFirst = (a: ReviewedItem, b: ReviewedItem) => Number(hasComment(b)) - Number(hasComment(a));
