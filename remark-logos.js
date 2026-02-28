/**
 * Remark plugin that converts :logos-<name>: shortcodes into inline
 * <img> elements pointing to /img/logos/<name>.svg.
 *
 * Works with Docusaurus 3 / MDX v3 by emitting mdxJsxTextElement AST
 * nodes that the MDX compiler handles natively.
 */

function remarkLogos() {
  const logoPattern = /:logos-([^:]+):/;

  function transformChildren(node) {
    if (!node.children) return;

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];

      if (child.type === 'text' && logoPattern.test(child.value)) {
        const newNodes = splitTextNode(child);
        node.children.splice(i, 1, ...newNodes);
        i += newNodes.length - 1;
      } else {
        transformChildren(child);
      }
    }
  }

  function splitTextNode(node) {
    const regex = /:logos-([^:]+):/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(node.value)) !== null) {
      // Text before the match
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
      }

      // Inline <img> as an MDX JSX element
      parts.push({
        type: 'mdxJsxTextElement',
        name: 'img',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'src', value: `/img/logos/${match[1]}.svg` },
          { type: 'mdxJsxAttribute', name: 'alt', value: match[1] },
          { type: 'mdxJsxAttribute', name: 'className', value: 'inline-logo' },
        ],
        children: [],
      });

      lastIndex = regex.lastIndex;
    }

    // Remaining text after the last match
    if (lastIndex < node.value.length) {
      parts.push({ type: 'text', value: node.value.slice(lastIndex) });
    }

    return parts;
  }

  return (tree) => {
    transformChildren(tree);
  };
}

module.exports = remarkLogos;
