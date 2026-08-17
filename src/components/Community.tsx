import { useState, useEffect } from 'react';
import { listPacks, type Pack } from '../lib/api';
import './Community.css';

export default function Community() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPacks();
  }, []);

  const loadPacks = async () => {
    try {
      const result = await listPacks();
      setPacks(result.packs);
    } catch (error) {
      console.error('Failed to load packs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="community-container">
      <div className="community-header">
        <h1>Community Packs</h1>
        <p>Discover and install pre-built workspace configurations</p>
      </div>

      <div className="community-filters">
        <input type="text" placeholder="🔍 Search packs..." className="pack-search" />
        <select className="pack-filter">
          <option>All Categories</option>
          <option>Research</option>
          <option>Development</option>
          <option>Writing</option>
        </select>
        <select className="pack-sort">
          <option>Most Popular</option>
          <option>Highest Rated</option>
          <option>Recently Updated</option>
        </select>
      </div>

      {loading && <div className="loading">Loading packs...</div>}

      <div className="packs-grid">
        {packs.map((pack) => (
          <div key={pack.id} className="pack-card">
            <div className="pack-card-header">
              <h3>{pack.name}</h3>
              <div className="pack-rating">
                ⭐ {pack.rating} ({pack.installs.toLocaleString()})
              </div>
            </div>
            <p className="pack-description">{pack.description}</p>
            <div className="pack-footer">
              <span className="pack-author">by {pack.author}</span>
              <button className="pack-install-btn">Install</button>
            </div>
          </div>
        ))}
      </div>

      {!loading && packs.length === 0 && (
        <div className="no-packs">No packs found</div>
      )}
    </div>
  );
}
