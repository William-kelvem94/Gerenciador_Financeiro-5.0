import React from 'react';
import { Shield, Database, Key, User } from 'lucide-react';
import { useMasterUser } from '../../hooks/useMasterUser';

interface UserStatusBadgeProps {
  className?: string;
  showDetails?: boolean;
}

export function UserStatusBadge({ className = '', showDetails = false }: UserStatusBadgeProps) {
  const { isMaster, isAdmin, getUserDisplayName, getUserRole, databases, permissions } =
    useMasterUser();

  if (!showDetails) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        {isMaster && (
          <div className="bg-cyber-primary/20 text-cyber-primary flex items-center space-x-1 rounded-full px-2 py-1 font-mono text-xs">
            <Shield className="h-3 w-3" />
            <span>MASTER</span>
          </div>
        )}
        {isAdmin && !isMaster && (
          <div className="bg-cyber-accent/20 text-cyber-accent flex items-center space-x-1 rounded-full px-2 py-1 font-mono text-xs">
            <Key className="h-3 w-3" />
            <span>ADMIN</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`glass border-cyber-primary/20 rounded-lg border p-4 ${className}`}>
      <div className="mb-3 flex items-center space-x-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isMaster
              ? 'bg-cyber-primary/20 text-cyber-primary'
              : isAdmin
                ? 'bg-cyber-accent/20 text-cyber-accent'
                : 'bg-black-secondary text-white-muted'
          }`}
        >
          {isMaster ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
        </div>
        <div>
          <h3 className="font-mono text-sm font-medium text-white">{getUserDisplayName()}</h3>
          <p className="text-white-muted font-mono text-xs uppercase">{getUserRole()}</p>
        </div>
      </div>

      {databases.length > 0 && (
        <div className="mb-3">
          <h4 className="text-white-muted mb-2 flex items-center font-mono text-xs">
            <Database className="mr-1 h-3 w-3" />
            Bancos de Dados
          </h4>
          <div className="flex flex-wrap gap-1">
            {databases.map(db => (
              <span
                key={db}
                className="bg-cyber-primary/10 text-cyber-primary rounded px-2 py-1 font-mono text-xs"
              >
                {db.replace('db-', '').toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {permissions.length > 0 && (
        <div>
          <h4 className="text-white-muted mb-2 flex items-center font-mono text-xs">
            <Key className="mr-1 h-3 w-3" />
            Permissões
          </h4>
          <div className="flex flex-wrap gap-1">
            {permissions.map(permission => (
              <span
                key={permission}
                className="bg-cyber-accent/10 text-cyber-accent rounded px-2 py-1 font-mono text-xs"
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
