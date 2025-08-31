import React, { useState, useEffect } from 'react';
import { Shield, Clock, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { storageService } from '../../services/storageService';

interface BackupStatusProps {
  className?: string;
  showDetails?: boolean;
}

export function BackupStatus({ className = '', showDetails = false }: BackupStatusProps) {
  const [backupInfo, setBackupInfo] = useState({
    hasBackup: false,
    lastBackup: undefined as Date | undefined,
    backupCount: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateBackupInfo = () => {
      const info = storageService.getBackupInfo();
      setBackupInfo({
        hasBackup: info.hasBackup,
        lastBackup: info.lastBackup,
        backupCount: info.backupCount,
      });
    };

    // Atualizar inicialmente
    updateBackupInfo();

    // Atualizar a cada 30 segundos
    const interval = setInterval(updateBackupInfo, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleForceBackup = () => {
    storageService.forceBackup();
    // Atualizar após backup
    setTimeout(() => {
      const info = storageService.getBackupInfo();
      setBackupInfo({
        hasBackup: info.hasBackup,
        lastBackup: info.lastBackup,
        backupCount: info.backupCount,
      });
    }, 1000);
  };

  const getStatusColor = () => {
    if (!backupInfo.hasBackup) return 'text-cyber-danger';
    if (backupInfo.lastBackup) {
      const timeDiff = Date.now() - backupInfo.lastBackup.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      if (minutesDiff > 5) return 'text-yellow-400';
    }
    return 'text-cyber-accent';
  };

  const getStatusIcon = () => {
    if (!backupInfo.hasBackup) return <AlertTriangle className="h-4 w-4" />;
    if (backupInfo.lastBackup) {
      const timeDiff = Date.now() - backupInfo.lastBackup.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      if (minutesDiff > 5) return <Clock className="h-4 w-4" />;
    }
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!backupInfo.hasBackup) return 'Sem backup';
    if (backupInfo.lastBackup) {
      const timeDiff = Date.now() - backupInfo.lastBackup.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));
      if (minutesDiff < 1) return 'Backup recente';
      if (minutesDiff < 60) return `${minutesDiff}min atrás`;
      const hoursDiff = Math.floor(minutesDiff / 60);
      return `${hoursDiff}h atrás`;
    }
    return 'Status desconhecido';
  };

  if (!showDetails && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`flex items-center space-x-2 ${getStatusColor()} transition-opacity hover:opacity-80 ${className}`}
        title="Status do backup automático"
      >
        <Shield className="h-4 w-4" />
        {getStatusIcon()}
      </button>
    );
  }

  return (
    <div className={`glass border-cyber-primary/20 rounded-lg border p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="text-cyber-primary h-5 w-5" />
          <h3 className="font-mono text-sm font-medium text-white">Backup Automático</h3>
        </div>
        {!showDetails && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-white-muted transition-colors hover:text-white"
          >
            ×
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white-muted font-mono text-sm">Status:</span>
          <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="font-mono text-sm">{getStatusText()}</span>
          </div>
        </div>

        {backupInfo.hasBackup && (
          <div className="flex items-center justify-between">
            <span className="text-white-muted font-mono text-sm">Backups:</span>
            <span className="text-cyber-accent font-mono text-sm">{backupInfo.backupCount}</span>
          </div>
        )}

        {backupInfo.lastBackup && (
          <div className="flex items-center justify-between">
            <span className="text-white-muted font-mono text-sm">Último:</span>
            <span className="font-mono text-sm text-white">
              {backupInfo.lastBackup.toLocaleTimeString('pt-BR')}
            </span>
          </div>
        )}

        <div className="border-cyber-primary/10 border-t pt-2">
          <button
            onClick={handleForceBackup}
            className="bg-cyber-primary/20 hover:bg-cyber-primary/30 flex w-full items-center justify-center space-x-2 rounded-lg px-3 py-2 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="font-mono text-sm">Backup Manual</span>
          </button>
        </div>
      </div>

      {!backupInfo.hasBackup && (
        <div className="bg-cyber-danger/10 border-cyber-danger/30 mt-3 rounded-lg border p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="text-cyber-danger mt-0.5 h-4 w-4" />
            <div className="text-cyber-danger font-mono text-xs">
              <p className="font-medium">Backup não disponível</p>
              <p className="mt-1 opacity-80">
                Os dados são salvos apenas no localStorage. Use o backup manual para proteção extra.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
