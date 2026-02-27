import type { DeploymentEntry } from './types';
import { formatChainName, formatCategoryName } from './constants';

/**
 * Filters deployments by chain, category, and search term.
 * Supports:
 * - Multi-word search across all fields
 * - Exact match with quotes: "vecrv"
 * - Field-specific search: in:category "vecrv", in:chain ethereum, in:name math, in:address 0x...
 */
export function filterDeployments(
  allDeployments: DeploymentEntry[],
  selectedChains: string[],
  selectedCategory: string,
  searchTerm: string,
): DeploymentEntry[] {
  return allDeployments.filter(deployment => {
    // Filter by chain(s) - empty array means all chains
    if (selectedChains.length > 0 && !selectedChains.includes(deployment.chain)) {
      return false;
    }

    // Filter by category
    if (selectedCategory !== 'all' && deployment.category !== selectedCategory) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const trimmed = searchTerm.trim();

      // Parse field-specific searches (in:field "value" or in:field value)
      const fieldSearchPattern = /in:(chain|category|name|address|path)\s+(?:"([^"]+)"|(\S+))/gi;
      const fieldSearches: Array<{field: string, value: string, exact: boolean}> = [];
      let match;
      let remainingText = trimmed;

      while ((match = fieldSearchPattern.exec(trimmed)) !== null) {
        const field = match[1].toLowerCase();
        const value = (match[2] || match[3] || '').toLowerCase();
        const exact = !!match[2];
        if (value) {
          fieldSearches.push({ field, value, exact });
          remainingText = remainingText.replace(match[0], '').trim();
        }
      }

      // Check field-specific searches
      if (fieldSearches.length > 0) {
        for (const fieldSearch of fieldSearches) {
          let fieldValue = '';
          switch (fieldSearch.field) {
            case 'chain':
              fieldValue = [deployment.chain, formatChainName(deployment.chain)].join(' ').toLowerCase();
              break;
            case 'category':
              fieldValue = [deployment.category, formatCategoryName(deployment.category)].join(' ').toLowerCase();
              break;
            case 'name':
              fieldValue = deployment.name.toLowerCase();
              break;
            case 'address':
              fieldValue = deployment.address.toLowerCase();
              break;
            case 'path':
              fieldValue = deployment.path.toLowerCase();
              break;
          }

          if (!fieldValue.includes(fieldSearch.value)) {
            return false;
          }
        }
      }

      // Process remaining text (non-field-specific searches)
      if (remainingText.trim()) {
        const exactMatchPattern = /"([^"]+)"/g;
        const exactMatches: string[] = [];
        let exactMatch;
        let textForWords = remainingText;

        while ((exactMatch = exactMatchPattern.exec(remainingText)) !== null) {
          exactMatches.push(exactMatch[1].toLowerCase());
          textForWords = textForWords.replace(exactMatch[0], '').trim();
        }

        const searchWords = textForWords.split(/\s+/).filter(word => word.length > 0).map(w => w.toLowerCase());

        const searchableText = [
          deployment.chain,
          deployment.category,
          deployment.subcategory || '',
          deployment.name,
          deployment.address,
          deployment.path,
          formatChainName(deployment.chain),
          formatCategoryName(deployment.category),
          deployment.subcategory ? formatCategoryName(deployment.subcategory) : '',
        ].join(' ').toLowerCase();

        if (exactMatches.length > 0) {
          const allExactMatch = exactMatches.every(exact => searchableText.includes(exact));
          if (!allExactMatch) {
            return false;
          }
        }

        if (searchWords.length > 0) {
          const allWordsMatch = searchWords.every(word => searchableText.includes(word));
          if (!allWordsMatch) {
            return false;
          }
        }
      }
    }

    // Only show entries with non-empty addresses
    return deployment.address && deployment.address.trim() !== '';
  });
}
