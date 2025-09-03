import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { vercelSync, type SyncStatus } from '../services/vercelSync';

export default function SyncStatusIndicator() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    isAuthorized: false,
    lastSync: null,
    syncInProgress: false,
    error: null
  });

  useEffect(() => {
    // Get initial status
    vercelSync.getStatus().then(setSyncStatus);
    
    // Listen for status changes
    vercelSync.onStatusChange(setSyncStatus);
  }, []);

  const getStatusIcon = () => {
    if (syncStatus.error) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    
    if (syncStatus.syncInProgress) {
      return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    
    if (syncStatus.isConnected && syncStatus.isAuthorized) {
      return <Wifi className="w-4 h-4 text-green-500" />;
    }
    
    return <WifiOff className="w-4 h-4 text-gray-400" />;
  };

  const getStatusText = () => {
    if (syncStatus.error) {
      return 'Sync Error';
    }
    
    if (syncStatus.syncInProgress) {
      return 'Syncing...';
    }
    
    if (syncStatus.isConnected && syncStatus.isAuthorized) {
      return 'Cloud Connected';
    }
    
    return 'Offline';
  };

  const getStatusColor = () => {
    if (syncStatus.error) {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    
    if (syncStatus.syncInProgress) {
      return 'text-blue-600 bg-blue-50 border-blue-200';
    }
    
    if (syncStatus.isConnected && syncStatus.isAuthorized) {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className={`flex items-center px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="ml-2">{getStatusText()}</span>
      {syncStatus.lastSync && (
        <span className="ml-2 text-xs opacity-75">
          {new Date(syncStatus.lastSync).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
