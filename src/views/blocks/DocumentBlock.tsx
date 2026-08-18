import { useEffect, useState } from 'react';
import type { BlockInstance } from '../../models';
import { getDocumentStatus } from '../../services/api';

interface Props {
  block: BlockInstance;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
  onAsk?: () => void;
}

type DocStatus = {
  parsingStatus: 'pending' | 'parsing' | 'parsed' | 'failed';
  indexingStatus: 'pending' | 'indexing' | 'indexed' | 'failed';
  chunks?: number;
  error?: string;
};

export default function DocumentBlock({ block, onAsk }: Props) {
  const [status, setStatus] = useState<DocStatus | null>(null);
  const [pollError, setPollError] = useState(false);

  const isReady =
    status?.parsingStatus === 'parsed' && status?.indexingStatus === 'indexed';
  const hasFailed =
    status?.parsingStatus === 'failed' ||
    status?.indexingStatus === 'failed' ||
    !!block.config.uploadError;

  useEffect(() => {
    if (!block.config.fileId) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const s = await getDocumentStatus(block.config.fileId);
        if (cancelled) return;
        setStatus(s);
        setPollError(false);
        if (s.parsingStatus !== 'parsed' || s.indexingStatus !== 'indexed') {
          setTimeout(poll, 2000);
        }
      } catch {
        if (!cancelled) setPollError(true);
      }
    };

    poll();
    return () => { cancelled = true; };
  }, [block.config.fileId]);

  return (
    <div className="document-block">
      <p className="block-label">{block.name}</p>

      {block.config.filename && (
        <div className="doc-filename">📄 {block.config.filename}</div>
      )}

      {/* Upload error */}
      {block.config.uploadError && (
        <div className="doc-error">⚠ {block.config.uploadError}</div>
      )}

      {/* Processing status */}
      {!block.config.uploadError && status && (
        <div className="doc-status-list">
          <div className={`doc-status-item ${status.parsingStatus}`}>
            {status.parsingStatus === 'parsed'  ? '✓' :
             status.parsingStatus === 'failed'  ? '✗' : '⋯'} Parsing
            <span className="doc-status-badge">{status.parsingStatus}</span>
          </div>
          <div className={`doc-status-item ${status.indexingStatus}`}>
            {status.indexingStatus === 'indexed' ? '✓' :
             status.indexingStatus === 'failed'  ? '✗' : '⋯'} Indexing
            <span className="doc-status-badge">{status.indexingStatus}</span>
          </div>
          {status.chunks != null && <p className="doc-meta">{status.chunks} chunks</p>}
        </div>
      )}

      {/* Polling error (backend offline) */}
      {pollError && !block.config.uploadError && (
        <div className="doc-error">⚠ Backend offline — status unavailable</div>
      )}

      {/* No fileId yet */}
      {!block.config.fileId && !block.config.uploadError && (
        <p className="doc-uploading">Uploading…</p>
      )}

      {/* Ask button — only shown when indexed */}
      {isReady && !hasFailed && onAsk && (
        <button className="doc-ask-btn" onClick={onAsk}>
          💬 Ask about this document
        </button>
      )}
    </div>
  );
}
