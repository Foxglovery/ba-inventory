import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Kitchen as KitchenIcon,
  LocalShipping as ShippingIcon,
  Inventory as InventoryIcon,
  BatchPrediction as BatchIcon,
  ShoppingCart as OrderIcon,
  Logout as LogoutIcon,
  Category as ProductIcon,
} from '@mui/icons-material';
import { signOut } from 'firebase/auth';
import { keyframes } from '@emotion/react';
import { auth } from '../firebase/config';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Kitchen', icon: <KitchenIcon />, path: '/kitchen' },
  { text: 'Fulfillment', icon: <ShippingIcon />, path: '/fulfillment' },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Products', icon: <ProductIcon />, path: '/products' },
  { text: 'Batches', icon: <BatchIcon />, path: '/batches' },
  { text: 'Orders', icon: <OrderIcon />, path: '/orders' },
];

const floating = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(12px);
  }
  100% {
    transform: translateX(0);
  }
`;

const Dashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          BA Inventory
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) {
                setMobileOpen(false);
              }
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        {location.pathname === '/' && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: '60vh', sm: '70vh' },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                animation: `${floating} 2.4s ease-in-out infinite`,
              }}
            >
              Take Tylenol
            </Button>
          </Box>
        )}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard; 