/**
 * Serviço de gerenciamento de armazenamento com backup automático
 * Resolve o problema de dependência exclusiva do localStorage
 */

export interface StorageBackup {
  timestamp: number;
  data: string;
  version: string;
}

export class StorageService {
  private static readonly BACKUP_INTERVAL = 60000; // 1 minuto
  private static readonly MAX_BACKUPS = 5;
  private static readonly VERSION = '1.0.0';

  private backupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeBackup();
    this.restoreFromBackup();
  }

  /**
   * Inicializa o sistema de backup automático
   */
  private initializeBackup(): void {
    // Evita múltiplos intervalos
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
    }

    this.backupInterval = setInterval(() => {
      this.createBackup();
    }, StorageService.BACKUP_INTERVAL);

    // Cleanup no beforeunload
    window.addEventListener('beforeunload', () => {
      this.createBackup();
      if (this.backupInterval) {
        clearInterval(this.backupInterval);
      }
    });
  }

  /**
   * Cria backup de todos os dados importantes
   */
  private createBackup(): void {
    try {
      const criticalKeys = ['transaction-storage', 'budget-storage', 'auth-storage'];

      const backupData: Record<string, any> = {};

      criticalKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          backupData[key] = data;
        }
      });

      if (Object.keys(backupData).length === 0) {
        return; // Nada para fazer backup
      }

      const backup: StorageBackup = {
        timestamp: Date.now(),
        data: JSON.stringify(backupData),
        version: StorageService.VERSION,
      };

      // Armazena no sessionStorage como backup primário
      sessionStorage.setItem('app_backup_primary', JSON.stringify(backup));

      // Mantém histórico de backups
      this.maintainBackupHistory(backup);

      console.log('[StorageService] Backup criado:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('[StorageService] Erro ao criar backup:', error);
    }
  }

  /**
   * Mantém histórico de backups limitado
   */
  private maintainBackupHistory(newBackup: StorageBackup): void {
    try {
      const historyKey = 'app_backup_history';
      const existingHistory = sessionStorage.getItem(historyKey);
      let backups: StorageBackup[] = existingHistory ? JSON.parse(existingHistory) : [];

      backups.unshift(newBackup);

      // Limita o número de backups
      if (backups.length > StorageService.MAX_BACKUPS) {
        backups = backups.slice(0, StorageService.MAX_BACKUPS);
      }

      sessionStorage.setItem(historyKey, JSON.stringify(backups));
    } catch (error) {
      console.error('[StorageService] Erro ao manter histórico:', error);
    }
  }

  /**
   * Restaura dados do backup se o localStorage estiver vazio
   */
  private restoreFromBackup(): void {
    try {
      // Verifica se há dados críticos no localStorage
      const hasData =
        localStorage.getItem('transaction-storage') ||
        localStorage.getItem('budget-storage') ||
        localStorage.getItem('auth-storage');

      if (hasData) {
        return; // LocalStorage tem dados, não precisa restaurar
      }

      // Tenta restaurar do backup primário
      const primaryBackup = sessionStorage.getItem('app_backup_primary');
      if (primaryBackup) {
        this.restoreFromBackupData(primaryBackup);
        console.log('[StorageService] Dados restaurados do backup primário');
        return;
      }

      // Tenta restaurar do histórico
      const historyBackup = sessionStorage.getItem('app_backup_history');
      if (historyBackup) {
        const backups: StorageBackup[] = JSON.parse(historyBackup);
        if (backups.length > 0) {
          this.restoreFromBackupData(JSON.stringify(backups[0]));
          console.log('[StorageService] Dados restaurados do histórico de backup');
        }
      }
    } catch (error) {
      console.error('[StorageService] Erro ao restaurar backup:', error);
    }
  }

  /**
   * Restaura dados específicos do backup
   */
  private restoreFromBackupData(backupString: string): void {
    try {
      const backup: StorageBackup = JSON.parse(backupString);
      const data = JSON.parse(backup.data);

      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });
    } catch (error) {
      console.error('[StorageService] Erro ao restaurar dados do backup:', error);
    }
  }

  /**
   * Força criação de backup manual
   */
  public forceBackup(): void {
    this.createBackup();
  }

  /**
   * Retorna informações sobre backups disponíveis
   */
  public getBackupInfo(): { hasBackup: boolean; lastBackup?: Date; backupCount: number } {
    try {
      const primaryBackup = sessionStorage.getItem('app_backup_primary');
      const historyBackup = sessionStorage.getItem('app_backup_history');

      let lastBackup: Date | undefined;
      let backupCount = 0;

      if (primaryBackup) {
        const backup: StorageBackup = JSON.parse(primaryBackup);
        lastBackup = new Date(backup.timestamp);
        backupCount++;
      }

      if (historyBackup) {
        const backups: StorageBackup[] = JSON.parse(historyBackup);
        backupCount += backups.length;
      }

      return {
        hasBackup: backupCount > 0,
        lastBackup,
        backupCount,
      };
    } catch (error) {
      console.error('[StorageService] Erro ao obter informações de backup:', error);
      return { hasBackup: false, backupCount: 0 };
    }
  }

  /**
   * Limpa todos os backups
   */
  public clearBackups(): void {
    try {
      sessionStorage.removeItem('app_backup_primary');
      sessionStorage.removeItem('app_backup_history');
      console.log('[StorageService] Backups limpos');
    } catch (error) {
      console.error('[StorageService] Erro ao limpar backups:', error);
    }
  }

  /**
   * Destrói o serviço e limpa intervalos
   */
  public destroy(): void {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
    }
  }
}

// Instância singleton
export const storageService = new StorageService();
