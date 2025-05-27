import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface SystemInfo {
  cpu_usage: number;
  memory_usage: number;
}

export const useSystemInfo = (intervalMs: number = 5000) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await invoke<SystemInfo>('get_system_info');
      setSystemInfo(info);
    } catch (err) {
      setError('Error fetching system info');
      console.error('Error fetching system info:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemInfo();
    
    if (intervalMs > 0) {
      const interval = setInterval(fetchSystemInfo, intervalMs);
      return () => clearInterval(interval);
    }
  }, [fetchSystemInfo, intervalMs]);

  return {
    systemInfo,
    loading,
    error,
    refresh: fetchSystemInfo
  };
};