const STORAGE_KEY = 'mona-bookmarks';

/**
 * @typedef {{ url: string, slug: string }} Bookmark
 */

/** @param {string} value */
export function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.href;
  } catch {
    return null;
  }
}

/** @param {unknown} value */
function isBookmark(value) {
  if (!value || typeof value !== 'object') return false;

  const bookmark = /** @type {{ url?: unknown, slug?: unknown }} */ (value);
  return typeof bookmark.url === 'string'
    && normalizeUrl(bookmark.url) === bookmark.url
    && typeof bookmark.slug === 'string'
    && /^mona-[0-9A-Za-z]{4}$/.test(bookmark.slug);
}

/**
 * Parses untrusted storage without allowing its raw contents into application code.
 * @param {string | null} storedValue
 * @returns {Bookmark[]}
 */
export function loadBookmarks(storedValue) {
  if (!storedValue) return [];

  try {
    const parsed = JSON.parse(storedValue);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isBookmark);
  } catch {
    return [];
  }
}

/** @param {Bookmark} bookmark */
export function formatBookmark(bookmark) {
  return `${bookmark.url} :: ${bookmark.slug}`;
}

export { STORAGE_KEY };
