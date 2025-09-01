import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StorageService } from '@/services/storageService';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('StorageService', () => {
  let storageService: StorageService;

  beforeEach(() => {
    vi.clearAllMocks();
    storageService = new StorageService();
  });

  afterEach(() => {
    storageService.stopBackup();
  });

  describe('Basic Storage Operations', () => {
    it('should store and retrieve data correctly', () => {
      const testData = { id: '1', name: 'Test Transaction', amount: 100 };
      
      storageService.setItem('test-key', testData);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(testData)
      );
    });

    it('should return null for non-existent keys', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = storageService.getItem('non-existent-key');
      
      expect(result).toBeNull();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('non-existent-key');
    });

    it('should remove items correctly', () => {
      storageService.removeItem('test-key');
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should clear all storage', () => {
      storageService.clear();
      
      expect(localStorageMock.clear).toHaveBeenCalled();
    });
  });

  describe('Data Encryption/Decryption', () => {
    it('should encrypt sensitive data before storing', () => {
      const sensitiveData = { password: 'secret123', token: 'auth-token' };
      
      storageService.setSecureItem('secure-key', sensitiveData, 'encryption-password');
      
      // Should call setItem with encrypted data (not plain text)
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const [key, encryptedValue] = localStorageMock.setItem.mock.calls[0];
      expect(key).toBe('secure-key');
      expect(encryptedValue).not.toContain('secret123');
      expect(encryptedValue).not.toContain('auth-token');
    });

    it('should decrypt data when retrieving secure items', () => {
      const originalData = { password: 'secret123', token: 'auth-token' };
      const password = 'encryption-password';
      
      // First store the data
      storageService.setSecureItem('secure-key', originalData, password);
      
      // Mock the encrypted value being retrieved
      const encryptedValue = localStorageMock.setItem.mock.calls[0][1];
      localStorageMock.getItem.mockReturnValue(encryptedValue);
      
      // Retrieve and decrypt
      const decryptedData = storageService.getSecureItem('secure-key', password);
      
      expect(decryptedData).toEqual(originalData);
    });

    it('should return null for incorrect decryption password', () => {
      const originalData = { password: 'secret123' };
      const correctPassword = 'correct-password';
      const wrongPassword = 'wrong-password';
      
      storageService.setSecureItem('secure-key', originalData, correctPassword);
      const encryptedValue = localStorageMock.setItem.mock.calls[0][1];
      localStorageMock.getItem.mockReturnValue(encryptedValue);
      
      const result = storageService.getSecureItem('secure-key', wrongPassword);
      
      expect(result).toBeNull();
    });
  });

  describe('Backup Functionality', () => {
    it('should create backup with correct structure', () => {
      const mockData = {
        'key1': 'value1',
        'key2': { nested: 'value2' }
      };
      
      // Mock localStorage.length and key/getItem
      Object.defineProperty(localStorageMock, 'length', { value: 2 });
      localStorageMock.key = vi.fn()
        .mockReturnValueOnce('key1')
        .mockReturnValueOnce('key2');
      localStorageMock.getItem = vi.fn()
        .mockReturnValueOnce('"value1"')
        .mockReturnValueOnce('{"nested":"value2"}');
      
      const backup = storageService.createBackup();
      
      expect(backup).toMatchObject({
        timestamp: expect.any(Number),
        version: expect.any(String),
        data: expect.any(String)
      });
      
      const backupData = JSON.parse(backup.data);
      expect(backupData).toEqual(mockData);
    });

    it('should restore data from backup correctly', () => {
      const originalData = {
        'transactions': [{ id: '1', amount: 100 }],
        'settings': { theme: 'dark' }
      };
      
      const backup = {
        timestamp: Date.now(),
        version: '1.0.0',
        data: JSON.stringify(originalData)
      };
      
      const result = storageService.restoreFromBackup(backup);
      
      expect(result).toBe(true);
      expect(localStorageMock.clear).toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalledWith('transactions', JSON.stringify(originalData.transactions));
      expect(localStorageMock.setItem).toHaveBeenCalledWith('settings', JSON.stringify(originalData.settings));
    });

    it('should handle corrupted backup data gracefully', () => {
      const corruptedBackup = {
        timestamp: Date.now(),
        version: '1.0.0',
        data: 'invalid-json-data'
      };
      
      const result = storageService.restoreFromBackup(corruptedBackup);
      
      expect(result).toBe(false);
      expect(localStorageMock.clear).not.toHaveBeenCalled();
    });
  });

  describe('Automatic Backup', () => {
    it('should start automatic backup with correct interval', () => {
      vi.useFakeTimers();
      const backupSpy = vi.spyOn(storageService, 'createBackup');
      
      storageService.startAutoBackup();
      
      // Fast-forward time to trigger backup
      vi.advanceTimersByTime(60000); // 1 minute
      
      expect(backupSpy).toHaveBeenCalled();
      
      vi.useRealTimers();
    });

    it('should stop automatic backup', () => {
      vi.useFakeTimers();
      const backupSpy = vi.spyOn(storageService, 'createBackup');
      
      storageService.startAutoBackup();
      storageService.stopBackup();
      
      vi.advanceTimersByTime(60000);
      
      expect(backupSpy).not.toHaveBeenCalled();
      
      vi.useRealTimers();
    });
  });

  describe('Backup Management', () => {
    it('should limit number of stored backups', () => {
      const maxBackups = 5;
      
      // Create more backups than the limit
      for (let i = 0; i < maxBackups + 2; i++) {
        storageService.saveBackup({
          timestamp: Date.now() + i,
          version: '1.0.0',
          data: `{"backup": ${i}}`
        });
      }
      
      const backups = storageService.getBackupList();
      
      expect(backups).toHaveLength(maxBackups);
      // Should keep the most recent backups
      expect(backups[0].timestamp).toBeGreaterThan(backups[backups.length - 1].timestamp);
    });

    it('should retrieve backup list sorted by timestamp', () => {
      const backup1 = { timestamp: 1000, version: '1.0.0', data: '{}' };
      const backup2 = { timestamp: 2000, version: '1.0.0', data: '{}' };
      const backup3 = { timestamp: 1500, version: '1.0.0', data: '{}' };
      
      storageService.saveBackup(backup1);
      storageService.saveBackup(backup2);
      storageService.saveBackup(backup3);
      
      const backups = storageService.getBackupList();
      
      expect(backups[0].timestamp).toBe(2000); // Most recent first
      expect(backups[1].timestamp).toBe(1500);
      expect(backups[2].timestamp).toBe(1000);
    });

    it('should delete specific backup', () => {
      const backup = { timestamp: 12345, version: '1.0.0', data: '{}' };
      
      storageService.saveBackup(backup);
      let backups = storageService.getBackupList();
      expect(backups).toHaveLength(1);
      
      storageService.deleteBackup(12345);
      backups = storageService.getBackupList();
      expect(backups).toHaveLength(0);
    });
  });

  describe('Data Integrity', () => {
    it('should verify data integrity with checksums', () => {
      const testData = { id: '1', amount: 100, description: 'Test' };
      
      storageService.setItemWithIntegrity('test-data', testData);
      
      // Should store both data and checksum
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-data', JSON.stringify(testData));
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-data_checksum', expect.any(String));
    });

    it('should detect data corruption', () => {
      const originalData = { id: '1', amount: 100 };
      const corruptedData = { id: '1', amount: 999 }; // Data was modified
      const originalChecksum = 'original-checksum';
      
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'test-data') return JSON.stringify(corruptedData);
        if (key === 'test-data_checksum') return originalChecksum;
        return null;
      });
      
      const result = storageService.getItemWithIntegrity('test-data');
      
      expect(result).toBeNull(); // Should return null for corrupted data
    });

    it('should return data when integrity check passes', () => {
      const testData = { id: '1', amount: 100 };
      
      // Store data with integrity
      storageService.setItemWithIntegrity('test-data', testData);
      
      // Get the stored checksum
      const storedChecksum = localStorageMock.setItem.mock.calls[1][1];
      
      // Mock retrieval
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'test-data') return JSON.stringify(testData);
        if (key === 'test-data_checksum') return storedChecksum;
        return null;
      });
      
      const result = storageService.getItemWithIntegrity('test-data');
      
      expect(result).toEqual(testData);
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage quota exceeded error', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      
      const result = storageService.setItem('test-key', { large: 'data' });
      
      expect(result).toBe(false);
    });

    it('should handle localStorage access denied error', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('SecurityError');
      });
      
      const result = storageService.getItem('test-key');
      
      expect(result).toBeNull();
    });

    it('should handle malformed JSON gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json{');
      
      const result = storageService.getItem('test-key');
      
      expect(result).toBeNull();
    });
  });
});