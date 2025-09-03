import type { AppState, Booking, Service, User } from '../types';

// Google Drive API configuration
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const FOLDER_NAME = 'AAT Booking System Data';
const DATA_FILE_NAME = 'aat-booking-data.json';

interface SyncStatus {
  isConnected: boolean;
  isAuthorized: boolean;
  lastSync: string | null;
  syncInProgress: boolean;
  error: string | null;
}

interface CloudData {
  bookings: Booking[];
  services: Service[];
  users: User[];
  lastModified: string;
  version: number;
  deviceId: string;
}

class GoogleDriveSyncService {
  private gapi: any = null;
  private folderId: string | null = null;
  private fileId: string | null = null;
  private deviceId: string;
  private syncCallbacks: Array<(status: SyncStatus) => void> = [];

  constructor() {
    this.deviceId = this.generateDeviceId();
    this.loadGoogleAPI();
  }

  private generateDeviceId(): string {
    const stored = localStorage.getItem('aat-device-id');
    if (stored) return stored;
    
    const deviceId = 'device_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('aat-device-id', deviceId);
    return deviceId;
  }

  private async loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).gapi) {
        this.gapi = (window as any).gapi;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        this.gapi = (window as any).gapi;
        this.gapi.load('auth2:client', () => {
          resolve();
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async initialize(clientId: string): Promise<void> {
    await this.loadGoogleAPI();
    
    await this.gapi.client.init({
      discoveryDocs: [DISCOVERY_DOC],
      clientId: clientId,
      scope: SCOPES
    });
  }

  async authorize(): Promise<boolean> {
    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }
      
      await this.ensureFolderExists();
      this.notifyStatusChange({ 
        isConnected: true, 
        isAuthorized: true, 
        lastSync: null, 
        syncInProgress: false, 
        error: null 
      });
      
      return true;
    } catch (error) {
      console.error('Authorization failed:', error);
      this.notifyStatusChange({ 
        isConnected: false, 
        isAuthorized: false, 
        lastSync: null, 
        syncInProgress: false, 
        error: 'Authorization failed' 
      });
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      if (authInstance.isSignedIn.get()) {
        await authInstance.signOut();
      }
      
      this.folderId = null;
      this.fileId = null;
      
      this.notifyStatusChange({ 
        isConnected: false, 
        isAuthorized: false, 
        lastSync: null, 
        syncInProgress: false, 
        error: null 
      });
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  }

  private async ensureFolderExists(): Promise<void> {
    // Search for existing folder
    const response = await this.gapi.client.drive.files.list({
      q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      spaces: 'drive'
    });

    if (response.result.files && response.result.files.length > 0) {
      this.folderId = response.result.files[0].id;
    } else {
      // Create folder
      const folderResponse = await this.gapi.client.drive.files.create({
        resource: {
          name: FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder'
        }
      });
      this.folderId = folderResponse.result.id;
    }
  }

  private async ensureDataFileExists(): Promise<void> {
    if (!this.folderId) return;

    // Search for existing data file
    const response = await this.gapi.client.drive.files.list({
      q: `name='${DATA_FILE_NAME}' and parents in '${this.folderId}' and trashed=false`,
      spaces: 'drive'
    });

    if (response.result.files && response.result.files.length > 0) {
      this.fileId = response.result.files[0].id;
    } else {
      // Create empty data file
      const initialData: CloudData = {
        bookings: [],
        services: [],
        users: [],
        lastModified: new Date().toISOString(),
        version: 1,
        deviceId: this.deviceId
      };

      const fileResponse = await this.gapi.client.request({
        path: 'https://www.googleapis.com/upload/drive/v3/files',
        method: 'POST',
        params: {
          uploadType: 'multipart'
        },
        headers: {
          'Content-Type': 'multipart/related; boundary="foo_bar_baz"'
        },
        body: this.createMultipartBody({
          name: DATA_FILE_NAME,
          parents: [this.folderId]
        }, JSON.stringify(initialData))
      });

      this.fileId = fileResponse.result.id;
    }
  }

  private createMultipartBody(metadata: any, data: string): string {
    const delimiter = 'foo_bar_baz';
    const close_delim = `\r\n--${delimiter}--`;
    
    let body = `--${delimiter}\r\n`;
    body += 'Content-Type: application/json\r\n\r\n';
    body += JSON.stringify(metadata) + '\r\n';
    body += `--${delimiter}\r\n`;
    body += 'Content-Type: application/json\r\n\r\n';
    body += data;
    body += close_delim;
    
    return body;
  }

  async syncToCloud(localState: AppState): Promise<void> {
    try {
      this.notifyStatusChange({ 
        isConnected: true, 
        isAuthorized: true, 
        lastSync: null, 
        syncInProgress: true, 
        error: null 
      });

      await this.ensureDataFileExists();
      
      // Get current cloud data
      const cloudData = await this.getCloudData();
      
      // Merge data with deduplication
      const mergedData = this.mergeData(localState, cloudData);
      
      // Update cloud
      await this.updateCloudData(mergedData);
      
      const now = new Date().toISOString();
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
    }
  }

  async syncFromCloud(): Promise<CloudData | null> {
    try {
      this.notifyStatusChange({ 
        isConnected: true, 
        isAuthorized: true, 
        lastSync: null, 
        syncInProgress: true, 
        error: null 
      });

      const cloudData = await this.getCloudData();
      
      const now = new Date().toISOString();
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
    }
  }

  private async getCloudData(): Promise<CloudData> {
    if (!this.fileId) {
      throw new Error('Data file not found');
    }

    const response = await this.gapi.client.drive.files.get({
      fileId: this.fileId,
      alt: 'media'
    });

    return JSON.parse(response.body);
  }

  private async updateCloudData(data: CloudData): Promise<void> {
    if (!this.fileId) {
      throw new Error('Data file not found');
    }

    await this.gapi.client.request({
      path: `https://www.googleapis.com/upload/drive/v3/files/${this.fileId}`,
      method: 'PATCH',
      params: {
        uploadType: 'media'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  private mergeData(localState: AppState, cloudData: CloudData): CloudData {
    // Deduplication logic
    const mergedBookings = this.deduplicateArray(
      [...cloudData.bookings, ...localState.bookings],
      'id'
    );

    const mergedServices = this.deduplicateArray(
      [...cloudData.services, ...localState.services],
      'id'
    );

    const mergedUsers = this.deduplicateArray(
      [...cloudData.users, ...localState.users],
      'id'
    );

    return {
      bookings: mergedBookings,
      services: mergedServices,
      users: mergedUsers,
      lastModified: new Date().toISOString(),
      version: cloudData.version + 1,
      deviceId: this.deviceId
    };
  }

  private deduplicateArray<T extends { id: string; createdAt?: string; updatedAt?: string }>(
    array: T[], 
    key: keyof T
  ): T[] {
    const seen = new Map<any, T>();
    
    for (const item of array) {
      const id = item[key];
      const existing = seen.get(id);
      
      if (!existing) {
        seen.set(id, item);
      } else {
        // Keep the most recently updated item
        const existingTime = new Date(existing.updatedAt || existing.createdAt || '').getTime();
        const itemTime = new Date(item.updatedAt || item.createdAt || '').getTime();
        
        if (itemTime > existingTime) {
          seen.set(id, item);
        }
      }
    }
    
    return Array.from(seen.values());
  }

  onStatusChange(callback: (status: SyncStatus) => void): void {
    this.syncCallbacks.push(callback);
  }

  private notifyStatusChange(status: SyncStatus): void {
    this.syncCallbacks.forEach(callback => callback(status));
  }

  async getStatus(): Promise<SyncStatus> {
    try {
      if (!this.gapi) {
        return {
          isConnected: false,
          isAuthorized: false,
          lastSync: null,
          syncInProgress: false,
          error: 'Google API not loaded'
        };
      }

      const authInstance = this.gapi.auth2.getAuthInstance();
      const isAuthorized = authInstance && authInstance.isSignedIn.get();
      
      const lastSync = localStorage.getItem('aat-last-sync');
      
      return {
        isConnected: !!this.folderId,
        isAuthorized: !!isAuthorized,
        lastSync,
        syncInProgress: false,
        error: null
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

  // Auto-sync functionality
  startAutoSync(intervalMinutes: number = 5): void {
    setInterval(async () => {
      try {
        const status = await this.getStatus();
        if (status.isAuthorized && !status.syncInProgress) {
          const localState = JSON.parse(localStorage.getItem('aat-booking-state') || '{}');
          await this.syncToCloud(localState);
        }
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }
}

export const googleDriveSync = new GoogleDriveSyncService();
export type { SyncStatus, CloudData };
