import { useEffect, useState } from 'react';
import type { BlockInstance } from '../../types';
import { getDocumentStatus } from '../../lib/api';

interface Props {
  block: BlockInstance;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
}

export default function DocumentBlockContent({ block }: Props) {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (!block.config.fileId) return;

    const pollStatus = async () => {
      try {
        const result = await getDocumentStatus(block.config.fileId);
        setStatus(result);

        if (result.parsingStatus !== 'parsed' || result.indexingStatus !== 'indexed') {
          setTimeout(pollStatus, 2000);
        }
      } catch (error) {
        console.error('Failed to get status:', error);
      }
    };

    pollStatus();
  }, [block.config.fileId]);

  return (
    <div className="document-block-content">
      {block.config.filename && (
        <div className="doc-filename">📄 {block.config.filename}</div>
      )}

      {status && (
        <div className="doc-status-list">
          <div className={`doc-status-item ${status.parsingStatus}`}>
            <span className="status-icon">
              {status.parsingStatus === 'parsed' ? '✓' : '⋯'}
            </span>
            <span>Parsing</span>
            <span className="status-label">{status.parsingStatus}</span>
          </div>

          <div className={`doc-status-item ${status.indexingStatus}`}>
            <span className="status-icon">
              {status.indexingStatus === 'indexed' ? '✓' : '⋯'}
            </span>
            <span>Indexing</span>
            <span className="status-label">{status.indexingStatus}</span>
          </div>

          {status.chunks && (
            <div className="doc-meta">
              {status.chunks} chunks created
            </div>
          )}
        </div>
      )}

      {!status && <div className="doc-uploading">Uploading...</div>}

      <style>{`
        .document-block-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .doc-filename {
          font-weight: 600;
          font-size: 15px;
          color: var(--text-h);
          padding: 0.75rem;
          background: var(--bg-secondary);
          border-radius: 8px;
        }

        .doc-status-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .doc-status-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.875rem;
          background: var(--bg-secondary);
          border-radius: 6px;
          font-size: 14px;
        }

        .doc-status-item .status-icon {
          font-size: 16px;
        }

        .doc-status-item.parsing,
        .doc-status-item.indexing {
          animation: pulse 1.5s ease-in-out infinite;
        }

        .doc-status-item.parsed .status-icon,
        .doc-status-item.indexed .status-icon {
          color: var(--success);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-label {
          margin-left: auto;
          font-size: 12px;
          text-transform: capitalize;
          opacity: 0.7;
        }

        .doc-meta {
          font-size: 13px;
          color: var(--text);
          opacity: 0.7;
          padding: 0.5rem 0.875rem;
        }

        .doc-uploading {
          color: var(--accent);
          font-style: italic;
          text-align: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}
