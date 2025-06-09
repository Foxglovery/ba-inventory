import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { QrCodeScanner as ScannerIcon } from '@mui/icons-material';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Order } from '../../types';

const FulfillmentDashboard: React.FC = () => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('status', '==', 'pending')
    );
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
    setPendingOrders(orders);
  };

  const handleScan = async () => {
    // TODO: Implement QR code scanning logic
    // This would typically use a QR code scanner library
    // For now, we'll simulate scanning with a text input
    if (scannedCode) {
      // Find the order with this QR code
      const order = pendingOrders.find(o => o.id === scannedCode);
      if (order) {
        // Update order status
        await updateDoc(doc(db, 'orders', order.id), {
          status: 'fulfilled',
          fulfillmentDate: new Date().toISOString(),
          fulfilledBy: 'current_user_id' // TODO: Get actual user ID
        });
        await fetchPendingOrders();
        setScanDialogOpen(false);
        setScannedCode('');
      }
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Pending Orders Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Pending Orders</Typography>
              <Button
                variant="contained"
                startIcon={<ScannerIcon />}
                onClick={() => setScanDialogOpen(true)}
              >
                Scan QR Code
              </Button>
            </Box>
            <List>
              {pendingOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <ListItem>
                    <ListItemText
                      primary={`Order #${order.id}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Items: {order.items.length}
                          </Typography>
                          <Typography variant="body2">
                            Status: {order.status}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Today's Stats</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Orders Fulfilled"
                  secondary="0" // TODO: Implement actual stats
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Items Processed"
                  secondary="0" // TODO: Implement actual stats
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Average Processing Time"
                  secondary="0 min" // TODO: Implement actual stats
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* QR Code Scanner Dialog */}
      <Dialog open={scanDialogOpen} onClose={() => setScanDialogOpen(false)}>
        <DialogTitle>Scan QR Code</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="QR Code"
            fullWidth
            value={scannedCode}
            onChange={(e) => setScannedCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScanDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleScan} variant="contained">
            Process
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FulfillmentDashboard; 