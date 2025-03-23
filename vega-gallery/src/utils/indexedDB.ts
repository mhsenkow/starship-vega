export const initDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VegaGalleryDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('datasets')) {
        db.createObjectStore('datasets', { keyPath: 'id' });
      }
    };
  });
};

export const getAllDatasets = async () => {
  const db: IDBDatabase = await initDB() as IDBDatabase;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['datasets'], 'readonly');
    const store = transaction.objectStore('datasets');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getDataset = async (id: string) => {
  const db: IDBDatabase = await initDB() as IDBDatabase;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['datasets'], 'readonly');
    const store = transaction.objectStore('datasets');
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveDataset = async (dataset: any) => {
  const db: IDBDatabase = await initDB() as IDBDatabase;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['datasets'], 'readwrite');
    const store = transaction.objectStore('datasets');
    const request = store.put(dataset);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteDataset = async (id: string) => {
  const db: IDBDatabase = await initDB() as IDBDatabase;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['datasets'], 'readwrite');
    const store = transaction.objectStore('datasets');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}; 