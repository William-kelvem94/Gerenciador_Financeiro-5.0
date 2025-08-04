export interface BankConnection {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'error' | 'expired';
  bankName: string;
  connectionType: string;
  lastSync: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OpenFinanceAccount {
  id: string;
  number: string;
  type: string;
  subtype: string;
  currency: string;
  branch: string;
  balance: {
    available: number;
    current: number;
  };
}

export interface OpenFinanceTransaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  date: Date;
  type: 'DEBIT' | 'CREDIT';
  completionDate: Date;
  transactionName: string;
  merchantName?: string;
  merchantCategoryCode?: string;
}

// Extensão para Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};
