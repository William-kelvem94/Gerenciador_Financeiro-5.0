import React from 'react';
import { Shield, Database, Key, User } from 'lucide-react';
import { useMasterUser } from '../../hooks/useMasterUser';

interface UserStatusBadgeProps {
  className?: string;
  showDetails?: boolean;
}

export function UserStatusBadge({ className = '', showDetails = false }: UserStatusBadgeProps) {
  const { 
    isMaster, 
    isAdmin, 
    getUserDisplayName, 
    getUserRole, 
    databases, 
    permissions 
  } = useMasterUser();

  if (!showDetails) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        {isMaster && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-cyber-primary/20 text-cyber-primary rounded-full text-xs font-mono">
            <Shield className="w-3 h-3" />
            <span>MASTER</span>
          </div>
        )}
        {isAdmin && !isMaster && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-cyber-accent/20 text-cyber-accent rounded-full text-xs font-mono">
            <Key className="w-3 h-3" />
            <span>ADMIN</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`glass p-4 rounded-lg border border-cyber-primary/20 ${className}`}>
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isMaster 
            ? 'bg-cyber-primary/20 text-cyber-primary' 
            : isAdmin 
            ? 'bg-cyber-accent/20 text-cyber-accent'
            : 'bg-black-secondary text-white-muted'
        }`}>
          {isMaster ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
        </div>
        <div>
          <h3 className="font-mono text-sm font-medium text-white">
            {getUserDisplayName()}
          </h3>
          <p className="text-xs text-white-muted font-mono uppercase">
            {getUserRole()}
          </p>
        </div>
      </div>

      {databases.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-mono text-white-muted mb-2 flex items-center">
            <Database className="w-3 h-3 mr-1" />
            Bancos de Dados
          </h4>
          <div className="flex flex-wrap gap-1">
            {databases.map((db) => (
              <span
                key={db}
                className="px-2 py-1 bg-cyber-primary/10 text-cyber-primary text-xs font-mono rounded"
              >
                {db.replace('db-', '').toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {permissions.length > 0 && (
        <div>
          <h4 className="text-xs font-mono text-white-muted mb-2 flex items-center">
            <Key className="w-3 h-3 mr-1" />
            Permissões
          </h4>
          <div className="flex flex-wrap gap-1">
            {permissions.map((permission) => (
              <span
                key={permission}
                className="px-2 py-1 bg-cyber-accent/10 text-cyber-accent text-xs font-mono rounded"
              >
                {permission.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
