import React, { createContext, useContext, useState, ReactNode } from 'react';
import { load, Store } from '@tauri-apps/plugin-store';
import { useEffect } from 'react';

interface StorageContextType {
  screenshotCollectionFolderPath: string;
  saveScreenshotCollectionFolderPath: (path: string) => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

interface StorageProviderProps {
  children: ReactNode;
}

// 4. 创建 Provider 组件
export const StorageProvider: React.FC<StorageProviderProps> = ({ children }) => {
  const [screenshotCollectionFolderPath, setScreenshotCollectionFolderPath] = useState<string>("");

  let store: Store;
  const initStore = async () => {
    store = await load('pet-on-window-settings.json', { autoSave: false });
  }
  useEffect(() => {
    initStore();
  }, []);

  const saveScreenshotCollectionFolderPath = async (path: string) => {
    setScreenshotCollectionFolderPath(path);
    await store.set('screenshot-collection-foleder-path', { value: path });
  }




  const value: StorageContextType = {
    screenshotCollectionFolderPath,
    saveScreenshotCollectionFolderPath,
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};

// 5. 创建自定义 Hook 以方便使用 Context
export const useStorage = (): StorageContextType => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};