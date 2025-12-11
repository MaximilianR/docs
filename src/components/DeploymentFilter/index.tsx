import React, { useState, useMemo } from 'react';
import deploymentsData from '../../data/deployments.json';
import styles from './styles.module.css';

interface DeploymentEntry {
  chain: string;
  category: string;
  subcategory?: string;
  name: string;
  address: string;
  path: string;
}

// Get explorer URLs from JSON data
const getExplorerUrls = (data: any): Record<string, string> => {
  return (data._explorers || {}) as Record<string, string>;
};

function flattenDeployments(data: any): DeploymentEntry[] {
  const entries: DeploymentEntry[] = [];

  function traverse(obj: any, chain: string, category: string, subcategory: string = '', path: string = '') {
    for (const [key, value] of Object.entries(obj)) {
      // Skip the _explorers key if it exists
      if (key === '_explorers') continue;
      
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string') {
        // This is an address
        entries.push({
          chain,
          category,
          subcategory: subcategory || undefined,
          name: key,
          address: value,
          path: currentPath,
        });
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Check if all values in this object are strings (leaf level)
        const allValuesAreStrings = Object.values(value).every(v => typeof v === 'string');
        
        if (allValuesAreStrings) {
          // This is a subcategory containing only addresses (e.g., "stableswap" under "amm")
          traverse(value, chain, category, key, currentPath);
        } else {
          // This contains nested objects, continue traversing with same subcategory
          traverse(value, chain, category, subcategory, currentPath);
        }
      }
    }
  }

  for (const [chain, chainData] of Object.entries(data)) {
    // Skip _explorers at top level
    if (chain === '_explorers') continue;
    
    if (typeof chainData === 'object' && chainData !== null) {
      for (const [category, categoryData] of Object.entries(chainData as any)) {
        if (typeof categoryData === 'object' && categoryData !== null) {
          traverse(categoryData, chain, category, '', category);
        }
      }
    }
  }

  return entries;
}

function formatChainName(chain: string): string {
  return chain
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Category display name mappings
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'amm': 'AMM',
  'dao': 'DAO',
  'x-dao': 'Crosschain DAO',
  'x-gov': 'Crosschain Governance',
  'crvusd': 'Curve Stablecoin',
  'scrvusd': 'Savings crvUSD',
  'llamalend': 'Curve Lending',
  'tokens': 'Tokens',
  'core': 'Core',
  'gauges': 'Gauges',
  'fees': 'Fees',
  'integrations': 'Integrations',
  'curve-block-oracle': 'Curve Block Oracle',
  'vecrv': 'veCRV',
};

function formatCategoryName(category: string): string {
  // Check if there's a custom display name
  const lowerCategory = category.toLowerCase();
  if (CATEGORY_DISPLAY_NAMES[lowerCategory]) {
    return CATEGORY_DISPLAY_NAMES[lowerCategory];
  }
  
  // Default formatting: capitalize each word
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function ChainLogo({ chain }: { chain: string }) {
  const slug = toSlug(chain);
  const exts = ['svg', 'png', 'webp'];
  const [idx, setIdx] = React.useState(0);
  const [hasTried, setHasTried] = React.useState(false);
  
  const src = idx < exts.length ? `/img/chains/${slug}.${exts[idx]}` : '';

  const handleError = () => {
    if (idx < exts.length - 1) {
      setIdx(idx + 1);
    } else {
      setHasTried(true);
    }
  };

  if (hasTried || !src) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={src} 
      alt="" 
      className={styles.chainLogo} 
      onError={handleError}
    />
  );
}

function NameDisplay({ name }: { name: string }) {
  const lowerName = name.toLowerCase();
  
  // Show CRV logo for "crv" name inside the code box
  if (lowerName === 'crv') {
    return (
      <code className={styles.nameCode}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/img/logos/crv.png" 
          alt="CRV" 
          className={styles.nameLogo}
        />
        <span>CRV</span>
      </code>
    );
  }
  
  // Show veCRV logo for "vecrv" name inside the code box
  if (lowerName === 'vecrv') {
    return (
      <code className={styles.nameCode}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/img/logos/vecrv.png" 
          alt="veCRV" 
          className={styles.nameLogo}
        />
        <span>veCRV</span>
      </code>
    );
  }
  
  // Show crvUSD logo for "crvusd" name inside the code box
  if (lowerName === 'crvusd') {
    return (
      <code className={styles.nameCode}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/img/logos/crvUSD_xs.png" 
          alt="crvUSD" 
          className={styles.nameLogo}
        />
        <span>crvUSD</span>
      </code>
    );
  }
  
  // Show scrvUSD logo for "scrvusd" name inside the code box
  if (lowerName === 'scrvusd') {
    return (
      <code className={styles.nameCode}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/img/logos/scrvUSD_xs.png" 
          alt="scrvUSD" 
          className={styles.nameLogo}
        />
        <span>scrvUSD</span>
      </code>
    );
  }

  return <code className={styles.nameCode}>{name}</code>;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

function ChainSelect({ 
  chains, 
  value, 
  onChange 
}: { 
  chains: string[]; 
  value: string[]; 
  onChange: (value: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleChain = (chain: string) => {
    if (chain === 'all') {
      onChange([]);
    } else {
      const newValue = value.includes(chain)
        ? value.filter(c => c !== chain)
        : [...value, chain];
      onChange(newValue);
    }
  };

  const handleSelectAll = () => {
    onChange([]);
  };

  const isAllSelected = value.length === 0;
  const selectedCount = value.length;

  const getButtonText = () => {
    if (isAllSelected) return 'All Chains';
    if (selectedCount === 1) return formatChainName(value[0]);
    return `${selectedCount} chains selected`;
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.customSelect}`)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={styles.customSelect}>
      <button
        type="button"
        className={styles.selectButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className={styles.selectButtonContent}>
          {!isAllSelected && selectedCount === 1 && <ChainLogo chain={value[0]} />}
          <span>{getButtonText()}</span>
        </div>
        <svg 
          className={`${styles.selectArrow} ${isOpen ? styles.selectArrowOpen : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      {isOpen && (
        <div className={styles.selectDropdown}>
          <button
            type="button"
            className={`${styles.selectOption} ${isAllSelected ? styles.selectOptionActive : ''}`}
            onClick={handleSelectAll}
          >
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={() => {}}
              className={styles.checkbox}
            />
            <span>All Chains</span>
          </button>
          {chains.map(chain => {
            const isSelected = value.includes(chain);
            return (
              <button
                key={chain}
                type="button"
                className={`${styles.selectOption} ${isSelected ? styles.selectOptionActive : ''}`}
                onClick={() => handleToggleChain(chain)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className={styles.checkbox}
                />
                <ChainLogo chain={chain} />
                <span>{formatChainName(chain)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DeploymentFilter(): React.ReactNode {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const explorerUrls = useMemo(() => getExplorerUrls(deploymentsData), []);
  const allDeployments = useMemo(() => flattenDeployments(deploymentsData), []);
  
  const chains = useMemo(() => {
    const chainSet = new Set(allDeployments.map(d => d.chain));
    return Array.from(chainSet).sort();
  }, [allDeployments]);

  const categories = useMemo(() => {
    const categorySet = new Set(allDeployments.map(d => d.category));
    return Array.from(categorySet).sort();
  }, [allDeployments]);

  const filteredDeployments = useMemo(() => {
    return allDeployments.filter(deployment => {
      // Filter by chain(s) - empty array means all chains
      if (selectedChains.length > 0 && !selectedChains.includes(deployment.chain)) {
        return false;
      }

      // Filter by category
      if (selectedCategory !== 'all' && deployment.category !== selectedCategory) {
        return false;
      }

      // Filter by search term - support multi-word search across all fields
      // Support exact match with quotes: "vecrv" will only match exact "vecrv"
      // Support field-specific search: in:category "vecrv", in:chain ethereum, in:name math, in:address 0x...
      if (searchTerm) {
        const trimmed = searchTerm.trim();
        
        // Parse field-specific searches (in:field "value" or in:field value)
        const fieldSearchPattern = /in:(chain|category|name|address|path)\s+(?:"([^"]+)"|(\S+))/gi;
        const fieldSearches: Array<{field: string, value: string, exact: boolean}> = [];
        let match;
        let remainingText = trimmed;
        
        // Extract all field-specific searches
        while ((match = fieldSearchPattern.exec(trimmed)) !== null) {
          const field = match[1].toLowerCase();
          const value = (match[2] || match[3] || '').toLowerCase();
          const exact = !!match[2]; // If it was in quotes, it's exact
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
            
            if (fieldSearch.exact) {
              // Exact match for quoted values
              if (!fieldValue.includes(fieldSearch.value)) {
                return false;
              }
            } else {
              // Regular match
              if (!fieldValue.includes(fieldSearch.value)) {
                return false;
              }
            }
          }
        }
        
        // Process remaining text (non-field-specific searches)
        if (remainingText.trim()) {
          // Check for quoted exact match
          const exactMatchPattern = /"([^"]+)"/g;
          const exactMatches: string[] = [];
          let exactMatch;
          let textForWords = remainingText;
          
          // Extract all quoted strings
          while ((exactMatch = exactMatchPattern.exec(remainingText)) !== null) {
            exactMatches.push(exactMatch[1].toLowerCase());
            textForWords = textForWords.replace(exactMatch[0], '').trim();
          }
          
          // Get remaining words (non-quoted)
          const searchWords = textForWords.split(/\s+/).filter(word => word.length > 0).map(w => w.toLowerCase());
          
          // Create a searchable text string from all deployment fields
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
          
          // Check exact matches first
          if (exactMatches.length > 0) {
            const allExactMatch = exactMatches.every(exact => {
              return searchableText.includes(exact);
            });
            if (!allExactMatch) {
              return false;
            }
          }
          
          // Check regular word matches
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
  }, [allDeployments, selectedChains, selectedCategory, searchTerm]);

  const handleCopy = (e: React.MouseEvent, address: string) => {
    e.preventDefault();
    e.stopPropagation();
    copyToClipboard(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getExplorerUrl = (chain: string, address: string): string | null => {
    const explorerBase = explorerUrls[chain.toLowerCase()];
    if (!explorerBase) return null;
    return `${explorerBase}${address}`;
  };

  return (
    <div className={`${styles.container} deployment-filter-container`}>
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="search" className={styles.label}>Search</label>
          <input
            id="search"
            type="text"
            className={styles.input}
            placeholder="Search by name, address, or path..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="chain" className={styles.label}>Chain</label>
          <ChainSelect
            chains={chains}
            value={selectedChains}
            onChange={setSelectedChains}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="category" className={styles.label}>Category</label>
          <select
            id="category"
            className={styles.select}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {formatCategoryName(category)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.results}>
        <div className={styles.resultsHeader}>
          <span className={styles.resultsCount}>
            {filteredDeployments.length} {filteredDeployments.length === 1 ? 'deployment' : 'deployments'} found
          </span>
        </div>

        {filteredDeployments.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Chain</th>
                  <th>Category</th>
                  <th>Name</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeployments.map((deployment, index) => {
                  const explorerUrl = getExplorerUrl(deployment.chain, deployment.address);
                  return (
                    <tr key={`${deployment.chain}-${deployment.path}-${index}`}>
                      <td>
                        <div className={styles.chainCell}>
                          <ChainLogo chain={deployment.chain} />
                          <span className={styles.chainName}>
                            {formatChainName(deployment.chain)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.categoryBadge}>
                          {formatCategoryName(deployment.category)}
                          {deployment.subcategory && (
                            <span className={styles.subcategory}>
                              {' / '}
                              {formatCategoryName(deployment.subcategory)}
                            </span>
                          )}
                        </span>
                      </td>
                      <td>
                        <NameDisplay name={deployment.name} />
                      </td>
                      <td>
                        <div className={styles.addressCell}>
                          {explorerUrl ? (
                            <a
                              href={explorerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.addressLink}
                            >
                              <code className={styles.addressCode}>{deployment.address}</code>
                            </a>
                          ) : (
                            <code className={styles.addressCode}>{deployment.address}</code>
                          )}
                          <button
                            className={styles.copyIconButton}
                            onClick={(e) => handleCopy(e, deployment.address)}
                            title="Copy address"
                            aria-label="Copy address"
                          >
                            {copiedAddress === deployment.address ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>No deployments found matching your filters.</p>
            <p className={styles.noResultsHint}>
              Try adjusting your search term or filter selections.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
