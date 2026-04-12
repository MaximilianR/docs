import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import TagsListInline from '@theme/TagsListInline';
import EditMetaRow from '@theme/EditMetaRow';

export default function DocItemFooter() {
  const {metadata} = useDoc();
  const {editUrl, lastUpdatedAt, lastUpdatedBy, tags, permalink} = metadata;
  const canDisplayTagsRow = tags.length > 0;
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);

  // Build the path to the LLM-friendly markdown file
  // permalink is like "/user/dex/overview", file is at "/docs/user/dex/overview.md"
  const cleanPath = permalink.endsWith('/') ? permalink.slice(0, -1) : permalink;
  const llmFilePath = `/docs${cleanPath}.md`;

  return (
    <footer
      className={clsx(ThemeClassNames.docs.docFooter, 'docusaurus-mt-lg')}>
      {canDisplayTagsRow && (
        <div
          className={clsx(
            'row margin-top--sm',
            ThemeClassNames.docs.docFooterTagsRow,
          )}>
          <div className="col">
            <TagsListInline tags={tags} />
          </div>
        </div>
      )}
      {canDisplayEditMetaRow && (
        <EditMetaRow
          className={clsx(
            'margin-top--sm',
            ThemeClassNames.docs.docFooterEditMetaRow,
          )}
          editUrl={editUrl}
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
        />
      )}
      <div className="llm-txt-link margin-top--md">
        <span className="llm-txt-label">LLM-friendly docs:</span>
        <a href={llmFilePath} target="_blank" rel="noopener noreferrer">
          This page (.md)
        </a>
        <span className="llm-txt-separator"> | </span>
        <a href="/llms-full.txt" target="_blank" rel="noopener noreferrer">
          Full docs (.txt)
        </a>
        <span className="llm-txt-separator"> | </span>
        <a href="/llms.txt" target="_blank" rel="noopener noreferrer">
          llms.txt
        </a>
      </div>
    </footer>
  );
}
