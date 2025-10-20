import React, { useState } from 'react';
import { Snapshot } from '../../utils/indexedDB';
import { CloseIcon, SearchIcon } from '../common/Icons';
import styles from './ChartSelector.module.css';

// Styled components removed - using CSS modules instead

interface ChartSelectorProps {
  snapshots: Snapshot[];
  onSelect: (snapshot: Snapshot) => void;
  onClose: () => void;
}

export const ChartSelector: React.FC<ChartSelectorProps> = ({ 
  snapshots, 
  onSelect, 
  onClose 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter snapshots based on search
  const filteredSnapshots = snapshots.filter(snapshot => 
    snapshot.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Select a Chart</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon size={16} />
          </button>
        </div>
        
        <div className={styles.searchContainer}>
          <div className={styles.searchIcon}>
            <SearchIcon size={16} />
          </div>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search charts..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.snapshotGrid}>
          {filteredSnapshots.length > 0 ? (
            filteredSnapshots.map(snapshot => (
              <div 
                key={snapshot.id} 
                className={styles.snapshotCard}
                onClick={() => onSelect(snapshot)}
              >
                <div 
                  className={styles.snapshotThumbnail}
                  style={{ backgroundImage: snapshot.thumbnail ? `url(${snapshot.thumbnail})` : 'none' }}
                />
                <div className={styles.snapshotDetails}>
                  <div className={styles.snapshotName}>{snapshot.name}</div>
                  <div className={styles.snapshotDate}>{formatDate(snapshot.createdAt)}</div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              {searchTerm ? 'No matching charts found' : 'No charts available'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 