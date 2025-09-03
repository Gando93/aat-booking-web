import type { AppState } from '../types';

interface SyncStatus {
  isConnected: boolean;
  isAuthorized: boolean;
  lastSync: string | null;
  syncInProgress: boolean;
  error: string | null;
}

interface CloudData {
  bookings: any[];
  services: any[];
  users: any[];
  lastModified: string;
  version: number;
  deviceId: string;
}

class VercelSyncService {
  private deviceId: string;
  private syncCallbacks: Array<(status: SyncStatus) => void> = [];
  private baseUrl: string;
  private syncInProgress: boolean = false;

  constructor() {
    this.deviceId = this.generateDeviceId();
    this.baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://aat-booking-web.vercel.app';
  }

  private generateDeviceId(): string {
    const stored = localStorage.getItem('aat-device-id');
    if (stored) return stored;
    
    const deviceId = 'device_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('aat-device-id', deviceId);
    return deviceId;
  }

  async initialize(): Promise<void> {
    this.notifyStatusChange({
      isConnected: true,
      isAuthorized: true,
      lastSync: localStorage.getItem('aat-last-sync'),
      syncInProgress: false,
      error: null
    });
  }

  async authorize(): Promise<boolean> {
    this.notifyStatusChange({
      isConnected: true,
      isAuthorized: true,
      lastSync: localStorage.getItem('aat-last-sync'),
      syncInProgress: false,
      error: null
    });
    return true;
  }

  async disconnect(): Promise<void> {
    this.notifyStatusChange({
      isConnected: false,
      isAuthorized: false,
      lastSync: null,
      syncInProgress: false,
      error: null
    });
  }

  async syncToCloud(localState: AppState): Promise<void> {
    if (this.syncInProgress) {
      console.log('Sync already in progress, skipping...');
      return;
    }

    try {
      this.syncInProgress = true;
      this.notifyStatusChange({
        isConnected: true,
        isAuthorized: true,
        lastSync: null,
        syncInProgress: true,
        error: null
      });

      const response = await fetch(`${this.baseUrl}/api/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookings: localState.bookings,
          services: localState.services,
          users: localState.users,
          deviceId: this.deviceId
        })
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }

      await response.json();
      const now = new Date().toISOString();
      
      localStorage.setItem('aat-last-sync', now);
      
      this.notifyStatusChange({
        isConnected: true,
        isAuthorized: true,
        lastSync: now,
        syncInProgress: false,
        error: null
      });

    } catch (error) {
      console.error('Sync to cloud failed:', error);
      this.notifyStatusChange({
        isConnected: true,
        isAuthorized: true,
        lastSync: null,
        syncInProgress: false,
        error: 'Sync failed: ' + (error as Error).message
      });
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  async syncFromCloud(): Promise<CloudData | null> {
    if (this.syncInProgress) {
      console.log('Sync already in progress, skipping...');
      return null;
    }

    try {
      this.syncInProgress = true;
      this.notifyStatusChange({
        isConnected: true,
        isAuthorized: true,
        lastSync: null,
        syncInProgress: true,
        error: null
      });

      const response = await fetch(`${this.baseUrl}/api/sync`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }

      const cloudData = await response.json();
      const now = new Date().toISOString();
      
      localStorage.setItem('aat-last-sync', now);
      
      this.notifyStatusChange({
        isConnected: true,
        isAuthorized: true,
        lastSync: now,
        syncInProgress: false,
        error: null
      });

      return cloudData;
    } catch (error) {
      console.error('Sync from cloud failed:', error);
      this.notifyStatusChange({
        isConnected: true,
        isAuthorized: true,
        lastSync: null,
        syncInProgress: false,
        error: 'Sync failed: ' + (error as Error).message
      });
      return null;
    } finally {
      this.syncInProgress = false;
    }
  }

  async clearCloudData(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sync`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Clear failed: ${response.statusText}`);
      }

      this.notifyStatusChange({
        isConnected: true,
        isAuthorized: true,
        lastSync: null,
        syncInProgress: false,
        error: null
      });

    } catch (error) {
      console.error('Clear cloud data failed:', error);
      this.notifyStatusChange({
        isConnected: true,
        isAuthorized: true,
        lastSync: null,
        syncInProgress: false,
        error: 'Clear failed: ' + (error as Error).message
      });
      throw error;
    }
  }

  onStatusChange(callback: (status: SyncStatus) => void): void {
    this.syncCallbacks.push(callback);
  }

  private notifyStatusChange(status: SyncStatus): void {
    this.syncCallbacks.forEach(callback => callback(status));
  }

  async getStatus(): Promise<SyncStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sync`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const lastSync = localStorage.getItem('aat-last-sync');
      
      return {
        isConnected: response.ok,
        isAuthorized: response.ok,
        lastSync,
        syncInProgress: this.syncInProgress,
        error: response.ok ? null : 'Connection failed'
      };
    } catch (error) {
      return {
        isConnected: false,
        isAuthorized: false,
        lastSync: null,
        syncInProgress: false,
        error: (error as Error).message
      };
    }
  }

  startAutoSync(intervalMinutes: number = 5): void {
    setInterval(async () => {
      try {
        if (this.syncInProgress) return; // Skip if already syncing
        
        const status = await this.getStatus();
        if (status.isAuthorized && !status.syncInProgress) {
          const localState = JSON.parse(localStorage.getItem('aat-booking-state') || '{}');
          if (localState.bookings || localState.services || localState.users) {
            await this.syncToCloud(localState);
          }
        }
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }

  async getSyncStats(): Promise<{
    totalRecords: number;
    lastSyncTime: string | null;
    cloudVersion: number;
  }> {
    try {
      const cloudData = await this.syncFromCloud();
      return {
        totalRecords: (cloudData?.bookings.length || 0) + 
                     (cloudData?.services.length || 0) + 
                     (cloudData?.users.length || 0),
        lastSyncTime: cloudData?.lastModified || null,
        cloudVersion: cloudData?.version || 0
      };
    } catch (error) {
      return {
        totalRecords: 0,
        lastSyncTime: null,
        cloudVersion: 0
      };
    }
  }
}

export const vercelSync = new VercelSyncService();
export type { SyncStatus, CloudData };
