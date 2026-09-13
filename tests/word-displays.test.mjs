import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { loadBindings, transform } from 'next/dist/build/swc/index.js';

// Compile the actual JSX components with the project's existing Next.js compiler.
async function loadComponent(relativePath) {
  const file = new URL(relativePath, import.meta.url);
  const source = await readFile(file, 'utf8');
  await loadBindings();
  const { code } = await transform(source, {
    filename: file.pathname,
    jsc: { parser: { syntax: 'ecmascript', jsx: true }, transform: { react: { runtime: 'automatic' } } },
    module: { type: 'es6' },
  });
  const resolved = code.replace(/from ["']([^"']+)["']/g, (_, specifier) => {
    const url = specifier.startsWith('.')
      ? new URL(specifier.endsWith('.js') ? specifier : `${specifier}.js`, file).href
      : import.meta.resolve(specifier);
    return `from ${JSON.stringify(url)}`;
  });
  return (await import(`data:text/javascript;base64,${Buffer.from(resolved).toString('base64')}`)).default;
}

test('round-end reveal hides inappropriate words and excludes them from counts', async () => {
  const PossibleWordsPanel = await loadComponent('../components/PossibleWordsPanel.js');
  const puzzle = {
    letters: ['D', 'E', 'I', 'K', 'L', 'N', 'O'], centerLetter: 'I',
    validWords: ['kink', 'dildo', 'kitchen'], pangrams: ['dildo', 'kitchen'],
  };
  const html = renderToStaticMarkup(createElement(PossibleWordsPanel, {
    puzzle, players: [{ wordsFound: ['KINK', 'DILDO', 'kitchen'] }],
  }));
  assert(!/kink|dildo/i.test(html));
  assert.match(html, /All possible words \(1\)/);
  assert.match(html, /Your group found <span[^>]*>1<\/span> of 1/);
  assert.match(html, /kitchen/);
  assert.equal(renderToStaticMarkup(createElement(PossibleWordsPanel, {
    puzzle: { ...puzzle, validWords: ['kink', 'dildo'] }, players: [],
  })), '');
});

test('previously saved inappropriate answers are hidden from Your Words', async () => {
  const FoundWordsPanel = await loadComponent('../components/FoundWordsPanel.js');
  const html = renderToStaticMarkup(createElement(FoundWordsPanel, {
    words: ['KINK', 'dildo', 'class'], puzzleLetters: ['M', 'U', 'S', 'I', 'C', 'A', 'L'],
  }));
  assert(!/kink|dildo/i.test(html));
  assert.match(html, /Your Words \(1\)/);
  assert.match(html, /class/);
});
