import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import { TrendingUp, Wallet, Business } from '@mui/icons-material';

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  currentPath: string;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  open, 
  onClose, 
  menuItems, 
  currentPath, 
  isMobile 
}) => {
  const theme = useTheme();
  const drawerWidth = 280;

  const sidebarContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider'
      }}
    >
      {/* Logo/Header */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              mr: 2
            }}
          >
            <Wallet />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              FinanceFlow
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Gerenciador Financeiro 4.0
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 3, py: 2 }}>
        <Paper
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
              <Business />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                Usuário Demo
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Conta Premium
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Box>
              <Typography variant="h6" color="primary.main" fontWeight={700}>
                R$ 4.529,50
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Saldo Total
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle2" color="success.main" fontWeight={600}>
                +12.5%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Este mês
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, px: 2 }}>
        <List sx={{ py: 0 }}>
          {menuItems.map((item, index) => {
            const isActive = currentPath === item.path;
            
            return (
              <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    bgcolor: isActive ? alpha(item.color, 0.12) : 'transparent',
                    border: isActive ? `1px solid ${alpha(item.color, 0.2)}` : '1px solid transparent',
                    '&:hover': {
                      bgcolor: alpha(item.color, 0.08),
                      border: `1px solid ${alpha(item.color, 0.1)}`
                    },
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => {
                    // Navigate to item.path
                    if (isMobile) onClose();
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? item.color : 'text.secondary',
                      minWidth: 40,
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? item.color : 'text.primary',
                      fontSize: '0.95rem'
                    }}
                  />
                  {isActive && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: item.color
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 3, pt: 2 }}>
        <Paper
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.info.main, 0.08),
            border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TrendingUp sx={{ color: 'info.main', mr: 1 }} />
            <Typography variant="subtitle2" fontWeight={600}>
              Meta do Mês
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Economizar R$ 1.000
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: 6,
              bgcolor: alpha(theme.palette.info.main, 0.2),
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                width: '75%',
                height: '100%',
                bgcolor: 'info.main',
                borderRadius: 3
              }}
            />
          </Box>
          <Typography variant="caption" color="info.main" sx={{ mt: 1, display: 'block' }}>
            75% concluído
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'relative',
        },
        transition: 'width 0.3s ease'
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;
