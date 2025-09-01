/**
 * Seletor de usuário para contexto familiar
 * Interface moderna com animações e status visual
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFamily, FamilyUser } from '../../contexts/FamilyContext';
import { toast } from 'react-toastify';

// Ícones
const UserIcon = ({ role }: { role: FamilyUser['role'] }) => {
  const icons = {
    master: '👑',
    admin: '🔑',
    user: '👤',
    child: '🧒',
  };

  return <span className="text-xl">{icons[role]}</span>;
};

const StatusBadge = ({ isActive, lastActive }: { isActive: boolean; lastActive?: string }) => {
  if (isActive) {
    return (
      <div className="flex items-center gap-1">
        <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
        <span className="text-xs text-green-400">Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="h-2 w-2 rounded-full bg-gray-500"></div>
      <span className="text-xs text-gray-400">
        {lastActive ? `Visto ${new Date(lastActive).toLocaleDateString()}` : 'Offline'}
      </span>
    </div>
  );
};

export const FamilyUserSelector: React.FC = () => {
  const { users, currentUser, setCurrentUser, getFamilyStats } = useFamily();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = getFamilyStats();

  // Filtrar usuários por busca
  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user: FamilyUser) => {
    setCurrentUser(user);
    setIsOpen(false);
    toast.success(`Conectado como ${user.name}`, {
      icon: <UserIcon role={user.role} />,
    });
  };

  const roleColors = {
    master: 'from-purple-500 to-pink-500',
    admin: 'from-blue-500 to-cyan-500',
    user: 'from-green-500 to-teal-500',
    child: 'from-orange-500 to-yellow-500',
  };

  const roleLabels = {
    master: 'Master',
    admin: 'Administrador',
    user: 'Usuário',
    child: 'Criança',
  };

  return (
    <div className="relative">
      {/* Botão principal */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-gray-900/50 p-3 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/40"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {currentUser ? (
          <>
            <div
              className={`h-10 w-10 rounded-full bg-gradient-to-r ${roleColors[currentUser.role]} flex items-center justify-center font-bold text-white`}
            >
              <UserIcon role={currentUser.role} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-white">{currentUser.name}</div>
              <div className="text-xs text-gray-400">{roleLabels[currentUser.role]}</div>
            </div>
            <StatusBadge isActive={currentUser.isActive} lastActive={currentUser.lastActive} />
          </>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
              <span className="text-gray-400">👤</span>
            </div>
            <div className="flex-1 text-left">
              <div className="text-gray-400">Selecionar usuário</div>
              <div className="text-xs text-gray-500">{stats.totalUsers} usuários disponíveis</div>
            </div>
          </>
        )}

        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-cyan-500/20 bg-gray-900/95 shadow-2xl backdrop-blur-sm"
          >
            {/* Header com busca */}
            <div className="border-b border-gray-700/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-white">Usuários da Família</h3>
                <div className="text-xs text-gray-400">
                  {stats.activeUsers}/{stats.totalUsers} online
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar usuário..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-600/50 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-400 transition-colors focus:border-cyan-400/50 focus:outline-none"
                />
                <svg
                  className="absolute top-2.5 right-3 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Lista de usuários */}
            <div className="max-h-64 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário disponível'}
                </div>
              ) : (
                filteredUsers.map(user => (
                  <motion.button
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') handleUserSelect(user);
                    }}
                    role="button"
                    tabIndex={0}
                    className={`flex w-full items-center gap-3 p-3 transition-colors hover:bg-gray-800/50 ${
                      currentUser?.id === user.id ? 'border-r-2 border-cyan-400 bg-cyan-500/10' : ''
                    }`}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.1 }}
                  >
                    <div
                      className={`h-8 w-8 rounded-full bg-gradient-to-r ${roleColors[user.role]} flex items-center justify-center text-sm text-white`}
                    >
                      <UserIcon role={user.role} />
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 font-medium text-white">
                        {user.name}
                        {currentUser?.id === user.id && (
                          <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-400">
                            Atual
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                      <div className="text-xs text-gray-500">{roleLabels[user.role]}</div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge isActive={user.isActive} lastActive={user.lastActive} />
                      <div className="text-xs text-gray-500">{user.databases.length} DBs</div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer com estatísticas */}
            <div className="border-t border-gray-700/50 bg-gray-800/30 p-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex gap-4">
                  <span>👑 {stats.usersByRole.master || 0}</span>
                  <span>🔑 {stats.usersByRole.admin || 0}</span>
                  <span>👤 {stats.usersByRole.user || 0}</span>
                  <span>🧒 {stats.usersByRole.child || 0}</span>
                </div>
                <span>{stats.totalDatabases} databases</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para fechar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Fechar seletor de usuário"
        />
      )}
    </div>
  );
};

export default FamilyUserSelector;
