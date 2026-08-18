import { useEffect, useState } from 'react';
import type { BlockInstance } from '../../models';
import { getDocumentStatus } from '../../services/api';

interface Props {
  block: BlockInstance;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
}

export default function DocumentBlock({ block }: Props) {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (!block.config.fileId) return;
    const poll = async () => {
      try {
        const s = await getDocumentStatus(block.config.fileId);
        setStatus(s);
        if (s.parsingStatus !== 'parsed' || s.indexingStatus !== 'indexed') {
          setTimeout(poll, 2000);
        }
      } catch { /* backend offline */ }
    };
    poll();
  }, [block.config.fileId]);

  return (
    <div className="document-block">
      <p className="block-label">{block.name}</p>
      {block.config.filename && (
        <div className="doc-filename">📄 {block.config.filename}</div>
      )}
      {status ? (
        <div className="doc-status-list">
          <div className={`doc-status-item ${status.parsingStatus}`}>
            {status.parsingStatus === 'parsed' ? '✓' : '⋯'} Parsing
            <span className="doc-status-badge">{status.parsingStatus}</span>
          </div>
          <div className={`doc-status-item ${status.indexingStatus}`}>
            {status.indexingStatus === 'indexed' ? '✓' : '⋯'} Indexing
            <span className="doc-status-badge">{status.indexingStatus}</span>
          </div>
          {status.chunks && <p className="doc-meta">{status.chunks} chunks</p>}
        </div>
      ) : (
        <p className="doc-uploading">Uploading…</p>
      )}
    </div>
  );
}
