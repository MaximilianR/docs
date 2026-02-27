#!/usr/bin/env node

/**
 * fix-mdx-errors.js
 *
 * Post-conversion cleanup: fixes MDX compilation errors in developer docs.
 *
 * Handles:
 *   1. MkDocs attribute syntax: { .md-button ... } after links
 *   2. Interactive HTML blocks: <div class="highlight"> ... </div>
 *   3. Orphaned </div> tags
 *   4. <div ... markdown="block"> → <div>
 *   5. <details> inside list items (needs blank lines)
 *   6. Bare { } in non-code text (escape for MDX)
 *   7. Unquoted HTML attributes
 *   8. Interactive widget lines { title='...' }
 *   9. <pre><code> blocks with interactive inputs → remove
 *  10. <input> elements outside code fences
 */

const fs = require('fs');
const path = require('path');

const DEVELOPER_DIR = path.join(__dirname, '..', 'docs', 'developer');

function getAllMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllMdFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // 1. Remove MkDocs attribute syntax after links: [text](url){ .class style="..." }
  content = content.replace(
    /(\[[^\]]*\]\([^)]*\))\s*\{[^}]*\.md-button[^}]*\}/g,
    '$1'
  );

  // 2. Remove remaining MkDocs attribute blocks: { .class .class }
  //    (already partially handled but catch any remaining after links)
  content = content.replace(
    /(\])\(\s*([^)]+)\s*\)\s*\{\s*\.[^}]+\}/g,
    '$1($2)'
  );

  // 3. Remove <div class="highlight"> lines (interactive widgets — orphaned or complete)
  content = content.replace(/^<div class="highlight">\s*$/gm, '');
  content = content.replace(/<div class="highlight">[\s\S]*?<\/div>/g, '');

  // 4. Remove interactive widget description lines
  content = content.replace(
    /^\{\s*title='[^']*'\s*\}\s*.*$/gm,
    ''
  );

  // 4b. Remove <pre><code> interactive blocks (with inputs, spans, buttons)
  content = content.replace(/<pre><code>[\s\S]*?<\/code><\/pre>/g, (match) => {
    if (match.includes('<input') || match.includes('<button') || match.includes('<span id=') || match.includes('>>>')) {
      return '';
    }
    return match;
  });
  // Remove standalone <pre> and </pre> tags
  content = content.replace(/^<pre>\s*$/gm, '');
  content = content.replace(/^<\/pre>\s*$/gm, '');

  // 4c. Remove <input> tags (self-closing in MDX requires />)
  content = content.replace(/^<input\b[^>]*>\s*$/gm, '');
  // Fix inline <input> that aren't self-closed
  content = content.replace(/<input\b([^/>]*)>/g, '<input$1 />');

  // 4d. Remove <style> blocks
  content = content.replace(/<style>[\s\S]*?<\/style>/g, '');

  // 5. Clean up <div ... markdown...> attributes
  content = content.replace(
    /<div\s+class="centered"\s*markdown="block"\s*>/g,
    '<div className="centered">'
  );
  content = content.replace(
    /<div\s+markdown(?:="[^"]*")?\s*>/g,
    '<div>'
  );

  // 6. Remove orphaned </div> on their own line (that don't have a matching opener)
  // Be conservative: only remove </div> if on its own line
  content = content.replace(/^\s*<\/div>\s*$/gm, (match, offset) => {
    // Check if there's a matching <div> before this </div>
    const before = content.substring(0, offset);
    const openCount = (before.match(/<div[\s>]/g) || []).length;
    const closeCount = (before.match(/<\/div>/g) || []).length;
    if (closeCount >= openCount) {
      // No matching open div, this is orphaned — remove it
      return '';
    }
    return match;
  });

  // 7. Fix <details> positioning issues
  //    a. <details> on the same line as preceding text → separate with blank lines
  content = content.replace(
    /([^\n])<details/g,
    '$1\n\n<details'
  );
  //    b. <details> right after a line without a blank line → add blank line
  content = content.replace(
    /^(\S[^\n]*)\n(<details)/gm,
    '$1\n\n$2'
  );
  //    c. text on same line as <details> but indented (list item)
  content = content.replace(
    /^(\s*-\s+.*\S.*)\n(\s*<details)/gm,
    '$1\n\n$2'
  );
  //    d. </summary> followed immediately by content needs blank line
  content = content.replace(
    /(<\/summary>)\n([^\n])/g,
    '$1\n\n$2'
  );

  // 8. Remove <pre><code> blocks with interactive inputs
  content = content.replace(
    /<pre><code>[\s\S]*?<\/code><\/pre>/g,
    (match) => {
      if (match.includes('<input') || match.includes('<button') || match.includes('<span id=')) {
        return ''; // Remove interactive blocks
      }
      return match; // Keep non-interactive ones
    }
  );

  // 9. Remove standalone <input> elements outside code fences
  content = content.replace(
    /^<input\b[^>]*>\s*$/gm,
    ''
  );

  // 10. Fix unquoted HTML attributes like style=width:
  content = content.replace(
    /(<\w[^>]*?\s)style=([^"'][^\s>]*)/g,
    '$1style="$2"'
  );

  // 11. Remove <style> blocks (MkDocs custom styles for interactive elements)
  content = content.replace(
    /<style>[\s\S]*?<\/style>/g,
    ''
  );

  // 12. Escape bare { } in non-code-block content that MDX would parse as JSX
  //     Process line by line, skipping code fences
  const lines = content.split('\n');
  let inCodeFence = false;
  let inHtmlBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed.startsWith('```')) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    // Skip lines that are JSX/HTML (start with < or are import statements)
    if (trimmed.startsWith('<') || trimmed.startsWith('import ')) continue;
    // Skip lines inside ::: admonitions markers
    if (trimmed.startsWith(':::')) continue;

    // Escape { and } that are NOT:
    // - Inside backtick inline code
    // - Part of ${...} template literals
    // - Part of math $...$ blocks
    // - Part of a JSX expression we intentionally wrote (like <Tabs>)
    let line = lines[i];

    // Only fix lines that have { or } and aren't code/JSX
    if (line.includes('{') || line.includes('}')) {
      // Replace { and } that appear in regular markdown text
      // Skip if inside inline code (`...`)
      let result = '';
      let inInlineCode = false;
      let inMathMode = false;

      for (let j = 0; j < line.length; j++) {
        const ch = line[j];
        const nextCh = line[j + 1];

        if (ch === '`') {
          inInlineCode = !inInlineCode;
          result += ch;
        } else if (ch === '$' && !inInlineCode) {
          inMathMode = !inMathMode;
          result += ch;
        } else if ((ch === '{' || ch === '}') && !inInlineCode && !inMathMode) {
          // Check if this is a JSX expression we want to keep
          // (like {/* comment */} or React component props)
          // We want to escape it to prevent MDX from parsing it
          result += ch === '{' ? '\\{' : '\\}';
        } else {
          result += ch;
        }
      }
      lines[i] = result;
    }
  }

  content = lines.join('\n');

  // 13. Clean up excessive blank lines (from removed blocks)
  content = content.replace(/\n{4,}/g, '\n\n\n');
  content = content.trimEnd() + '\n';

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

// ──────────────────────────────────────────────────────────────
// Entry point
// ──────────────────────────────────────────────────────────────
const files = getAllMdFiles(DEVELOPER_DIR);
console.log(`Processing ${files.length} files for MDX fixes...`);

let fixed = 0;
let errors = 0;

for (const file of files) {
  const rel = path.relative(DEVELOPER_DIR, file);
  try {
    if (fixFile(file)) {
      fixed++;
    }
  } catch (err) {
    errors++;
    console.error(`  ERROR in ${rel}: ${err.message}`);
  }
}

console.log(`\nDone: ${fixed} files modified, ${errors} errors.`);
