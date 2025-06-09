import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Batch, Product } from '../../types';

const KitchenDashboard: React.FC = () => {
  const [activeBatches, setActiveBatches] = useState<Batch[]>([]);
  const [lowInventory, setLowInventory] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch active batches
      const batchesQuery = query(
        collection(db, 'batches'),
        where('status', '==', 'production')
      );
      const batchesSnapshot = await getDocs(batchesQuery);
      const batches = batchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Batch[];
      setActiveBatches(batches);

      // Fetch low inventory products
      const productsQuery = query(
        collection(db, 'products'),
        where('currentStock', '<', 10) // Assuming 10 is the threshold
      );
      const productsSnapshot = await getDocs(productsQuery);
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setLowInventory(products);
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Active Production Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Active Production</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {/* TODO: Implement new batch creation */}}
              >
                New Batch
              </Button>
            </Box>
            <List>
              {activeBatches.map((batch) => (
                <React.Fragment key={batch.id}>
                  <ListItem>
                    <ListItemText
                      primary={batch.batchCode}
                      secondary={`Quantity: ${batch.quantity} | Status: ${batch.status}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Low Inventory Alerts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Low Inventory Alerts</Typography>
            <List>
              {lowInventory.map((product) => (
                <React.Fragment key={product.id}>
                  <ListItem>
                    <ListItemText
                      primary={product.name}
                      secondary={`Current Stock: ${product.currentStock}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">New Batch</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create a new production batch
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Create</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Inventory Check</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Perform inventory count
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Start</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Batch Report</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Generate batch reports
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Generate</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Order Supplies</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Place ingredient orders
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Order</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default KitchenDashboard; 