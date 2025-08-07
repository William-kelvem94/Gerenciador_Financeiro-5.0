/**
 * 🔐 Utilitários de Criptografia - Will Finance 5.0
 */

import crypto from 'crypto';

/**
 * Gerar token aleatório seguro
 */
export function generateRandomToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Gerar hash SHA256
 */
export function generateSHA256Hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Gerar código numérico aleatório
 */
export function generateRandomCode(length: number = 6): string {
  const digits = '0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  
  return result;
}

/**
 * Criptografar dados sensíveis
 */
export function encrypt(text: string, key: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * Descriptografar dados sensíveis
 */
export function decrypt(encryptedText: string, key: string): string {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
