const visit = require('unist-util-visit');

module.exports = function remarkLogos() {
  return function transformer(tree) {
    visit(tree, 'text', function (node) {
      // Match :logos-*: pattern
      const logoRegex = /:logos-([^:]+):/g;
      let match;
      let newValue = node.value;
      
      while ((match = logoRegex.exec(node.value)) !== null) {
        const logoName = match[1];
        const fullMatch = match[0];
        
        // Create the image tag
        const imageTag = `<img src="/img/logos/${logoName}.svg" alt="${logoName.toUpperCase()}" style={{height: '1.2em', verticalAlign: 'middle'}} />`;
        
        // Replace the :logos-*: with the image tag
        newValue = newValue.replace(fullMatch, imageTag);
      }
      
      if (newValue !== node.value) {
        // Convert the text node to an HTML node if it contains logos
        node.type = 'html';
        node.value = newValue;
      }
    });
  };
};
