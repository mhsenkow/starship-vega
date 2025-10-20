import { useState, useEffect } from 'react';
import styles from './SnapshotPanel.module.css';
import { storeSnapshot, getAllSnapshots, deleteSnapshot, Snapshot } from '../../utils/indexedDB';
import { createSnapshot } from '../../utils/chartRenderer';
import { DatasetMetadata } from '../../types/dataset';

interface SnapshotPanelProps {
  chartId: string;
  currentSpec: any;
  vegaView: any;
  onLoadSnapshot: (spec: any) => void;
  currentDataset?: DatasetMetadata;
}

export const SnapshotPanel = ({ 
  chartId, 
  currentSpec, 
  vegaView, 
  onLoadSnapshot,
  currentDataset
}: SnapshotPanelProps) => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snapshotName, setSnapshotName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSnapshots();
  }, [chartId]);

  const loadSnapshots = async () => {
    try {
      const allSnapshots = await getAllSnapshots();
      const chartSnapshots = allSnapshots.filter(s => s.chartId === chartId);
      setSnapshots(chartSnapshots);
    } catch (err) {
      console.error('Error loading snapshots:', err);
      setError('Failed to load snapshots');
    }
  };

  const handleTakeSnapshot = async () => {
    if (!currentSpec || !vegaView) {
      setError('No chart data available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const thumbnail = await createSnapshot(vegaView);
      
      const snapshotData: Snapshot = {
        id: Date.now().toString(),
        chartId,
        name: snapshotName || `Snapshot ${new Date().toLocaleString()}`,
        spec: currentSpec,
        createdAt: new Date().toISOString(),
        thumbnail: thumbnail, // Add the thumbnail data URL
        datasetId: currentDataset?.id,
        datasetMetadata: currentDataset ? {
          name: currentDataset.name,
          description: currentDataset.description,
          columns: currentDataset.columns,
          rowCount: currentDataset.rowCount
        } : undefined
      };

      await storeSnapshot(snapshotData);
      setSnapshots(prev => [...prev, snapshotData]);
      setSnapshotName('');
      setMessage('Snapshot saved successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error taking snapshot:', err);
      setError('Failed to take snapshot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSnapshot = (snapshot: Snapshot) => {
    try {
      onLoadSnapshot(snapshot.spec);
      setMessage(`Loaded snapshot: ${snapshot.name}`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error loading snapshot:', err);
      setError('Failed to load snapshot');
    }
  };

  const handleDeleteSnapshot = async (snapshotId: string) => {
    try {
      await deleteSnapshot(snapshotId);
      setSnapshots(prev => prev.filter(s => s.id !== snapshotId));
      setMessage('Snapshot deleted');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting snapshot:', err);
      setError('Failed to delete snapshot');
    }
  };

  return (
    <div className={styles.panelContainer}>
      <h3 className={styles.title}>Snapshots</h3>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '16px' }}>
          {error}
        </div>
      )}
      
      {message && (
        <div style={{ color: 'green', marginBottom: '16px' }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Snapshot name (optional)"
          value={snapshotName}
          onChange={(e) => setSnapshotName(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            marginBottom: '8px',
            backgroundColor: 'var(--color-surface-primary)',
            color: 'var(--color-text-primary)'
          }}
        />
        <button
          onClick={handleTakeSnapshot}
          disabled={isLoading || !currentSpec}
          style={{
            width: '100%',
            padding: '8px 16px',
            background: 'var(--color-primary)',
            color: 'var(--color-surface)',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Taking Snapshot...' : 'Take Snapshot'}
        </button>
      </div>

      {snapshots.length === 0 ? (
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '32px' }}>
          No snapshots yet. Take a snapshot to save the current chart state.
        </p>
      ) : (
        <div className={styles.snapshotGrid}>
          {snapshots.map((snapshot) => (
            <div key={snapshot.id} className={styles.snapshotCard}>
              <div
                style={{
                  height: '120px',
                  backgroundImage: `url(${snapshot.thumbnail})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  cursor: 'pointer',
                  marginBottom: '8px'
                }}
                onClick={() => handleLoadSnapshot(snapshot)}
              />
              <div style={{ padding: '8px' }}>
                <div style={{ fontWeight: '500', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {snapshot.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                  {new Date(snapshot.createdAt).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleLoadSnapshot(snapshot)}
                    style={{
                      flex: 1,
                      padding: '4px 8px',
                      background: 'var(--color-primary)',
                      color: 'var(--color-surface)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDeleteSnapshot(snapshot.id)}
                    style={{
                      flex: 1,
                      padding: '4px 8px',
                      background: 'var(--color-error)',
                      color: 'var(--color-surface)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
