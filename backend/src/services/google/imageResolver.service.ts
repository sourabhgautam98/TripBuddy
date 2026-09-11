import axios from 'axios';
import { logger } from '../../utils/logger.js';

const WIKI_HEADERS = {
  'User-Agent': 'TripBuddy/1.0 (TravelPlanner; contact: support@tripbuddy.internal)',
  Accept: 'application/json',
};

/**
 * Dynamically resolves real, authentic photo URLs for destinations and landmarks
 * on the fly without storing any files locally on disk or in the database.
 */
export async function resolveDynamicPhoto(query: string): Promise<string | null> {
  if (!query || query.trim().length === 0) return null;
  const cleanQuery = query.trim().replace(/[^\w\s,'-]/gi, '');

  try {
    // 1. Wikipedia Page Summary API (Direct exact title lookup)
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      cleanQuery.replace(/\s+/g, '_')
    )}`;
    const summaryRes = await axios.get(summaryUrl, {
      timeout: 3000,
      headers: WIKI_HEADERS,
    });

    if (summaryRes.data?.originalimage?.source) {
      return summaryRes.data.originalimage.source;
    }
    if (summaryRes.data?.thumbnail?.source) {
      return summaryRes.data.thumbnail.source;
    }
  } catch {
    // Fall through to search API
  }

  try {
    // 2. Wikipedia Search API with PageImages (Finds top matching article with photo)
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original|thumbnail&pithumbsize=1200&generator=search&gsrsearch=${encodeURIComponent(
      cleanQuery
    )}&gsrlimit=1`;
    const searchRes = await axios.get(searchUrl, {
      timeout: 3000,
      headers: WIKI_HEADERS,
    });

    const pages = searchRes.data?.query?.pages;
    if (pages) {
      const firstKey = Object.keys(pages)[0];
      const page = pages[firstKey];
      if (page?.original?.source) {
        return page.original.source;
      }
      if (page?.thumbnail?.source) {
        return page.thumbnail.source;
      }
    }
  } catch {
    // Silent fallback
  }

  return null;
}

/**
 * Dynamically resolves a gallery of photos for any attraction on the fly
 */
export async function resolveDynamicPlaceGallery(
  placeName: string,
  destination: string
): Promise<string[]> {
  const query = `${placeName} ${destination}`;
  const cleanQuery = query.trim().replace(/[^\w\s,'-]/gi, '');
  const photos: string[] = [];

  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original|thumbnail&pithumbsize=1200&generator=search&gsrsearch=${encodeURIComponent(
      cleanQuery
    )}&gsrlimit=3`;
    const searchRes = await axios.get(searchUrl, {
      timeout: 3000,
      headers: WIKI_HEADERS,
    });

    const pages = searchRes.data?.query?.pages;
    if (pages) {
      for (const key of Object.keys(pages)) {
        const page = pages[key];
        const img = page?.original?.source || page?.thumbnail?.source;
        if (img && !photos.includes(img)) {
          photos.push(img);
        }
      }
    }
  } catch {
    // Fallback handled by caller
  }

  return photos;
}
