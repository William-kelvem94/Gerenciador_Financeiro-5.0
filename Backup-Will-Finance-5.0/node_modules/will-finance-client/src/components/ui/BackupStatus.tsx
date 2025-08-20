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
    backupCount: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateBackupInfo = () => {
      const info = storageService.getBackupInfo();
      setBackupInfo({
        hasBackup: info.hasBackup,
        lastBackup: info.lastBackup,
        backupCount: info.backupCount
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
        backupCount: info.backupCount
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
    if (!backupInfo.hasBackup) return <AlertTriangle className="w-4 h-4" />;
    if (backupInfo.lastBackup) {
      const timeDiff = Date.now() - backupInfo.lastBackup.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      if (minutesDiff > 5) return <Clock className="w-4 h-4" />;
    }
    return <CheckCircle className="w-4 h-4" />;
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
        className={`flex items-center space-x-2 ${getStatusColor()} hover:opacity-80 transition-opacity ${className}`}
        title="Status do backup automático"
      >
        <Shield className="w-4 h-4" />
        {getStatusIcon()}
      </button>
    );
  }

  return (
    <div className={`glass p-4 rounded-lg border border-cyber-primary/20 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-cyber-primary" />
          <h3 className="font-mono text-sm font-medium text-white">
            Backup Automático
          </h3>
        </div>
        {!showDetails && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-white-muted hover:text-white transition-colors"
          >
            ×
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white-muted font-mono">Status:</span>
          <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-sm font-mono">{getStatusText()}</span>
          </div>
        </div>

        {backupInfo.hasBackup && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-white-muted font-mono">Backups:</span>
            <span className="text-sm font-mono text-cyber-accent">
              {backupInfo.backupCount}
            </span>
          </div>
        )}

        {backupInfo.lastBackup && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-white-muted font-mono">Último:</span>
            <span className="text-sm font-mono text-white">
              {backupInfo.lastBackup.toLocaleTimeString('pt-BR')}
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-cyber-primary/10">
          <button
            onClick={handleForceBackup}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-cyber-primary/20 hover:bg-cyber-primary/30 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-mono">Backup Manual</span>
          </button>
        </div>
      </div>

      {!backupInfo.hasBackup && (
        <div className="mt-3 p-3 bg-cyber-danger/10 border border-cyber-danger/30 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-cyber-danger mt-0.5" />
            <div className="text-xs text-cyber-danger font-mono">
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
