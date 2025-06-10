import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';

// Lazy load components
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const KitchenDashboard = React.lazy(() => import('./pages/kitchen/KitchenDashboard'));
const FulfillmentDashboard = React.lazy(() => import('./pages/fulfillment/FulfillmentDashboard'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const BatchManagement = React.lazy(() => import('./pages/BatchManagement'));
const OrderManagement = React.lazy(() => import('./pages/OrderManagement'));
const ProductManagement = React.lazy(() => import('./pages/ProductManagement'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />}>
              <Route path="kitchen" element={<KitchenDashboard />} />
              <Route path="fulfillment" element={<FulfillmentDashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="batches" element={<BatchManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="products" element={<ProductManagement />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
