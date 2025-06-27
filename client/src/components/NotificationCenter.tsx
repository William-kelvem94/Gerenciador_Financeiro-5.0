import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { useNotifications } from '@/hooks/useApi'

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, loading, markAsRead, deleteNotification } = useNotifications()

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30'
      case 'warning':
        return 'border-yellow-500/30'
      case 'error':
        return 'border-red-500/30'
      default:
        return 'border-blue-500/30'
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id)
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id)
    } catch (error) {
      console.error('Erro ao deletar notificação:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <button
              className="fixed inset-0 bg-black/20 z-40 w-full h-full border-0 p-0 m-0 cursor-default"
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsOpen(false)
                }
              }}
              aria-label="Fechar notificações"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
              className="fixed right-4 top-16 w-96 bg-black/90 backdrop-blur-md border border-green-500/30 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden"
            >
              <div className="p-4 border-b border-green-500/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Notificações</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {loading && (
                  <div className="p-4 text-center text-gray-400">
                    Carregando notificações...
                  </div>
                )}
                
                {!loading && notifications.length === 0 && (
                  <div className="p-8 text-center text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma notificação encontrada</p>
                  </div>
                )}
                
                {!loading && notifications.length > 0 && (
                  <div className="space-y-1">
                    {notifications.map((notification: any) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-l-4 ${getBorderColor(notification.type)} ${
                          !notification.read ? 'bg-green-500/5' : 'bg-black/20'
                        } hover:bg-green-500/10 transition-colors`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {getIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-medium ${
                                !notification.read ? 'text-white' : 'text-gray-300'
                              }`}>
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(notification.createdAt).toLocaleString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs text-green-400 hover:text-green-300 transition-colors"
                                title="Marcar como lida"
                              >
                                ✓
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="text-xs text-red-400 hover:text-red-300 transition-colors"
                              title="Deletar"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-4 border-t border-green-500/20">
                  <button
                    onClick={() => {
                      // Marcar todas como lidas
                      notifications.forEach(n => {
                        if (!n.read) {
                          handleMarkAsRead(n.id)
                        }
                      })
                    }}
                    className="w-full text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    Marcar todas como lidas
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
