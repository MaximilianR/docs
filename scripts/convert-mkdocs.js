#!/usr/bin/env node

/**
 * convert-mkdocs.js
 *
 * Converts MkDocs Material markdown syntax to Docusaurus-compatible MDX
 * for all .md files in docs/developer/.
 *
 * Handles:
 *   - !!! admonitions  → ::: admonitions
 *   - ??? collapsibles → <details>
 *   - === tabs         → <Tabs>/<TabItem>
 *   - Material icons   → text replacements or removal
 *   - Image attributes → HTML <img> tags
 *   - <figure markdown> → <figure>
 *   - <script> tags    → HTML comments (deferred)
 *   - MkDocs frontmatter cleanup
 *   - <h1> → # heading
 *   - <div class="grid cards"> → plain content
 */

const fs = require('fs');
const path = require('path');

const DEVELOPER_DIR = path.join(__dirname, '..', 'docs', 'developer');

// ──────────────────────────────────────────────────────────────
// Utility: recursively collect .md files
// ──────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────
// Phase 0: Frontmatter & <h1> handling
// ──────────────────────────────────────────────────────────────
function handleFrontmatter(content) {
  // Strip MkDocs-specific frontmatter (hide: toc, etc.)
  content = content.replace(/^---\n[\s\S]*?\n---\n/, '');

  // Convert <h1>Title</h1> to # Title (first occurrence only)
  content = content.replace(/^<h1>(.*?)<\/h1>\s*$/m, '# $1');

  return content;
}

// ──────────────────────────────────────────────────────────────
// Phase 1: Block structure conversion (state machine)
// ──────────────────────────────────────────────────────────────

// Regex patterns for block markers
const RE_ADMONITION = /^(!!!)\s*(\w[\w-]*)\s*(?:"([^"]*)")?(.*)$/;
const RE_COLLAPSIBLE = /^(\?\?\?)(\+)?\s*(\w[\w-]*)\s*(?:"([^"]*)")?(.*)$/;
const RE_TAB = /^===\s*"([^"]*)"(.*)$/;

function getContentIndent(stack) {
  if (stack.length === 0) return 0;
  return stack[stack.length - 1].contentIndent;
}

function deindent(line, amount) {
  if (amount <= 0) return line;
  let i = 0;
  while (i < line.length && i < amount && line[i] === ' ') i++;
  return line.substring(i);
}

function closeBlock(stack, output) {
  const block = stack.pop();
  if (!block) return;

  if (block.type === 'admonition') {
    output.push('');
    output.push(':::');
    output.push('');
  } else if (block.type === 'collapsible') {
    output.push('');
    output.push('</details>');
    output.push('');
  } else if (block.type === 'tabgroup') {
    output.push('');
    output.push('</TabItem>');
    output.push('</Tabs>');
    output.push('');
  }
}

function convertBlocks(content) {
  const lines = content.split('\n');
  const output = [];
  const stack = []; // {type, markerIndent, contentIndent, ...}
  let inCodeFence = false;
  let codeFenceIndent = 0;
  let usedTabs = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimStart();
    const indent = line.length - trimmed.length;

    // ── Code fence tracking ──
    if (inCodeFence) {
      if (trimmed.startsWith('```') && indent <= codeFenceIndent) {
        inCodeFence = false;
      }
      output.push(deindent(line, getContentIndent(stack)));
      continue;
    }

    if (trimmed.startsWith('```')) {
      inCodeFence = true;
      codeFenceIndent = indent;
      output.push(deindent(line, getContentIndent(stack)));
      continue;
    }

    // ── Blank lines: pass through, don't close blocks ──
    if (trimmed === '') {
      output.push('');
      continue;
    }

    // ── Close blocks whose content indent exceeds current line indent ──
    while (stack.length > 0) {
      const top = stack[stack.length - 1];

      // Close if line is at a shallower indent than the block expects
      if (top.contentIndent > indent) {
        // Special case: tab group closes when a non-tab line appears at
        // the tab marker indent or shallower
        closeBlock(stack, output);
      } else if (
        top.type === 'tabgroup' &&
        indent === top.markerIndent &&
        !RE_TAB.test(trimmed)
      ) {
        // Non-tab content at the same indent as the tab markers → close group
        closeBlock(stack, output);
      } else {
        break;
      }
    }

    // ── Detect block markers ──
    const admMatch = trimmed.match(RE_ADMONITION);
    const collMatch = trimmed.match(RE_COLLAPSIBLE);
    const tabMatch = trimmed.match(RE_TAB);

    if (collMatch) {
      // ??? collapsible (check before admonition because ??? contains !)
      const isOpen = collMatch[2] === '+';
      const type = collMatch[3];
      const title = collMatch[4] || capitalise(type);

      stack.push({
        type: 'collapsible',
        markerIndent: indent,
        contentIndent: indent + 4,
      });

      const deindentAmt = getContentIndent(
        stack.slice(0, -1) // parent's indent
      );
      const prefix = ' '.repeat(indent - deindentAmt);

      output.push(
        `${prefix}${isOpen ? '<details open>' : '<details>'}`
      );
      output.push(`${prefix}<summary>${escapeHtml(title)}</summary>`);
      output.push('');
    } else if (admMatch) {
      // !!! admonition
      const type = admMatch[2];
      const title = admMatch[3] || '';

      stack.push({
        type: 'admonition',
        markerIndent: indent,
        contentIndent: indent + 4,
        admType: type,
      });

      const deindentAmt = getContentIndent(
        stack.slice(0, -1)
      );
      const prefix = ' '.repeat(Math.max(0, indent - deindentAmt));

      if (title) {
        output.push(`${prefix}:::${type}[${title}]`);
      } else {
        output.push(`${prefix}:::${type}`);
      }
      output.push('');
    } else if (tabMatch) {
      // === tab
      const tabTitle = tabMatch[1];
      usedTabs = true;

      // Check if current top is a tab group at the same indent
      const topIsTabGroup =
        stack.length > 0 &&
        stack[stack.length - 1].type === 'tabgroup' &&
        stack[stack.length - 1].markerIndent === indent;

      const deindentAmt = topIsTabGroup
        ? getContentIndent(stack.slice(0, -1))
        : getContentIndent(stack);
      const prefix = ' '.repeat(Math.max(0, indent - deindentAmt));

      if (topIsTabGroup) {
        // Close previous tab item, open new one
        output.push('');
        output.push(`${prefix}</TabItem>`);
      } else {
        // Start new tab group
        stack.push({
          type: 'tabgroup',
          markerIndent: indent,
          contentIndent: indent + 4,
        });
        output.push(`${prefix}<Tabs>`);
      }

      const tabValue = tabTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'tab';

      output.push(
        `${prefix}<TabItem value="${tabValue}" label="${escapeHtml(tabTitle)}">`
      );
      output.push('');
    } else {
      // ── Regular content line ──
      output.push(deindent(line, getContentIndent(stack)));
    }
  }

  // Close remaining open blocks
  while (stack.length > 0) {
    closeBlock(stack, output);
  }

  let result = output.join('\n');

  // Inject tab imports if needed
  if (usedTabs) {
    const importLine =
      "import Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';\n";

    // Insert after the first heading or at the very top
    const firstHeadingIdx = result.search(/^#\s/m);
    if (firstHeadingIdx >= 0) {
      // Find end of the heading line
      const eol = result.indexOf('\n', firstHeadingIdx);
      result =
        result.substring(0, eol + 1) +
        '\n' +
        importLine +
        '\n' +
        result.substring(eol + 1);
    } else {
      result = importLine + '\n' + result;
    }
  }

  return result;
}

// ──────────────────────────────────────────────────────────────
// Phase 2: Inline pattern conversions
// ──────────────────────────────────────────────────────────────
function convertInlinePatterns(content) {
  // ── Material / Octicons / Simple icons → text or remove ──
  // Arrow icons → unicode arrows
  content = content.replace(/:octicons-arrow-right-24:/g, '→');
  content = content.replace(/:material-arrow-up-right:/g, '↗');
  content = content.replace(/:material-arrow-right:/g, '→');

  // GitHub icon → remove (text "GitHub" typically follows the icon)
  content = content.replace(/:material-github:/g, '');

  // Remove remaining material/octicons/simple icons (with optional size suffixes and attr classes)
  content = content.replace(
    /:(?:octicons|material|simple)-[\w-]+(?::\{[^}]*\})?:/g,
    ''
  );
  // Clean up size variants like :octicons-code-16:
  content = content.replace(/:(?:octicons|material|simple)-[\w-]+:/g, '');

  // Remove attribute classes after icons like { .lg .middle }
  content = content.replace(/\{\s*(?:\.\w+\s*)+\}/g, '');

  // Clean up leading/trailing spaces inside bold markers from icon removal
  content = content.replace(/\*\*\s+/g, '**');

  // ── Image attributes: ![alt](url){ width="N" } → <img> ──
  content = content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)\s*\{([^}]+)\}/g,
    (match, alt, src, attrs) => {
      const widthMatch = attrs.match(/width="?(\d+)"?/);
      const heightMatch = attrs.match(/height="?(\d+)"?/);
      let tag = `<img src="${src}" alt="${alt}"`;
      if (widthMatch) tag += ` width="${widthMatch[1]}"`;
      if (heightMatch) tag += ` height="${heightMatch[1]}"`;
      tag += ' />';
      return tag;
    }
  );

  // ── <figure markdown="span"> → <figure> ──
  content = content.replace(/<figure\s+markdown(?:="[^"]*")?>/g, '<figure>');

  // ── <script> tags → HTML comments (not JSX - just remove them) ──
  content = content.replace(
    /^<script\b[^>]*>[\s\S]*?<\/script>\s*$/gm,
    ''
  );
  content = content.replace(
    /^<script\b[^>]*>\s*$/gm,
    ''
  );

  // ── <div class="grid cards" markdown> and closing </div> → remove ──
  content = content.replace(/<div\s+class="grid cards"\s*markdown\s*>/g, '');
  // Remove </div> on its own line (orphaned from grid cards removal)
  content = content.replace(/^<\/div>\s*$/gm, '');

  // ── Remove footnote-style markdown attr: {: .class } ──
  content = content.replace(/\{:\s*[^}]+\}/g, '');

  // ── Escape bare <> in text (e.g. CRV<>ETH) for MDX compatibility ──
  // Only replace <> that is NOT inside a code block or HTML tag
  content = content.replace(/(?<![`<])<>(?![`>])/g, '&lt;&gt;');

  // ── Fix unquoted HTML attributes (e.g. value=0 → value="0") ──
  content = content.replace(
    /(<\w[^>]*?\s\w+)=(\d[\w.]*)/g,
    '$1="$2"'
  );

  return content;
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
function capitalise(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ──────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────
function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Phase 0: Frontmatter & h1
  content = handleFrontmatter(content);

  // Phase 1: Block structures
  content = convertBlocks(content);

  // Phase 2: Inline patterns
  content = convertInlinePatterns(content);

  // Phase 3: Clean up excessive blank lines
  content = content.replace(/\n{4,}/g, '\n\n\n');

  // Ensure file ends with single newline
  content = content.trimEnd() + '\n';

  fs.writeFileSync(filePath, content);
}

// ──────────────────────────────────────────────────────────────
// Entry point
// ──────────────────────────────────────────────────────────────
const files = getAllMdFiles(DEVELOPER_DIR);
console.log(`Found ${files.length} markdown files in docs/developer/`);

let converted = 0;
let errors = 0;

for (const file of files) {
  const rel = path.relative(DEVELOPER_DIR, file);
  try {
    convertFile(file);
    converted++;
    if (converted % 20 === 0) {
      console.log(`  ... converted ${converted}/${files.length}`);
    }
  } catch (err) {
    errors++;
    console.error(`  ERROR in ${rel}: ${err.message}`);
  }
}

console.log(
  `\nDone: ${converted} converted, ${errors} errors out of ${files.length} files.`
);
