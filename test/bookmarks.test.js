import test from 'node:test';
import assert from 'node:assert/strict';

import {
  formatBookmark,
  loadBookmarks,
  normalizeUrl,
} from '../src/lib/bookmarks.js';

test('normalizes a URL with or without https to the same value', () => {
  assert.equal(normalizeUrl('example.com'), 'https://example.com/');
  assert.equal(normalizeUrl('https://example.com'), normalizeUrl('example.com'));
});

test('recovers from empty and malformed storage values', () => {
  assert.deepEqual(loadBookmarks(null), []);
  assert.deepEqual(loadBookmarks(''), []);
  assert.deepEqual(loadBookmarks('{corrupted'), []);
  assert.deepEqual(loadBookmarks('{"url":"https://example.com/"}'), []);
  assert.deepEqual(loadBookmarks('"https://example.com/"'), []);
});

test('recovers legacy entries while retaining valid bookmarks', () => {
  const valid = { url: 'https://example.com/', slug: 'mona-7fk2' };
  assert.deepEqual(loadBookmarks(JSON.stringify([
    'https://example.com/',
    { url: 42, slug: 'mona-ab12' },
    valid,
  ])), [valid]);
});

test('formats the exact visible bookmark separator', () => {
  assert.equal(
    formatBookmark({
      url: 'https://www.example.com/',
      slug: 'mona-7fk2',
    }),
    'https://www.example.com/ :: mona-7fk2',
  );
});
