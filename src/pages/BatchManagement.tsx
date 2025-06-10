import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  QrCode as QrCodeIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { collection, query, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Batch, Product, OilBatch } from '../types';
import { generateBatchCode } from '../utils/batchCodeGenerator';
import { QRCodeSVG } from 'qrcode.react';
import { getProductAbbreviation, getProductFullName } from '../utils/productAbbreviations';

const BatchManagement: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [oilBatches, setOilBatches] = useState<OilBatch[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch batches
    const batchesQuery = query(collection(db, 'batches'));
    const batchesSnapshot = await getDocs(batchesQuery);
    const batchesData = batchesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Batch[];
    setBatches(batchesData);

    // Fetch products
    const productsQuery = query(collection(db, 'products'));
    const productsSnapshot = await getDocs(productsQuery);
    const productsData = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    setProducts(productsData);

    // Fetch oil batches
    const oilBatchesQuery = query(collection(db, 'oilBatches'));
    const oilBatchesSnapshot = await getDocs(oilBatchesQuery);
    const oilBatchesData = oilBatchesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as OilBatch[];
    setOilBatches(oilBatchesData);
  };

  const handleOpenDialog = () => {
    setFormData({
      productId: '',
      oilBatchId: '',
      quantity: '',
      dose: '',
      cannabinoid: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      const selectedProduct = products.find(p => p.id === formData.productId);
      const selectedOilBatch = oilBatches.find(o => o.id === formData.oilBatchId);

      if (!selectedProduct || !selectedOilBatch) {
        throw new Error('Product or oil batch not found');
      }

      const batchCode = generateBatchCode({
        dose: Number(formData.dose),
        cannabinoid: formData.cannabinoid,
        productName: selectedProduct.name,
        oilBatchCode: selectedOilBatch.batchCode,
        batchNumber: 1, // TODO: Implement batch number tracking
      });

      const batchData = {
        productId: formData.productId,
        batchCode,
        productionDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        oilBatchId: formData.oilBatchId,
        quantity: Number(formData.quantity),
        status: 'production',
        qrCode: batchCode,
      };

      await addDoc(collection(db, 'batches'), batchData);
      await fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  };

  const handleStatusChange = async (batchId: string, newStatus: Batch['status']) => {
    try {
      await updateDoc(doc(db, 'batches', batchId), { status: newStatus });
      await fetchData();
    } catch (error) {
      console.error('Error updating batch status:', error);
    }
  };

  const handleShowQR = (batch: Batch) => {
    setSelectedBatch(batch);
    setQrDialogOpen(true);
  };

  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Batch Management</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            New Batch
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Batch Code</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Production Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {batches.map((batch) => {
                const product = products.find(p => p.id === batch.productId);
                return (
                  <TableRow key={batch.id}>
                    <TableCell>{batch.batchCode}</TableCell>
                    <TableCell>{product?.name}</TableCell>
                    <TableCell>{batch.quantity}</TableCell>
                    <TableCell>
                      {new Date(batch.productionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={batch.status}
                        color={
                          batch.status === 'completed' ? 'success' :
                          batch.status === 'shipped' ? 'info' : 'warning'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleShowQR(batch)}>
                        <QrCodeIcon />
                      </IconButton>
                      <IconButton>
                        <PrintIcon />
                      </IconButton>
                      {batch.status === 'production' && (
                        <Button
                          size="small"
                          onClick={() => handleStatusChange(batch.id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                      {batch.status === 'completed' && (
                        <Button
                          size="small"
                          onClick={() => handleStatusChange(batch.id, 'shipped')}
                        >
                          Ship
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Batch</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Product</InputLabel>
              <Select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Oil Batch</InputLabel>
              <Select
                value={formData.oilBatchId}
                onChange={(e) => setFormData({ ...formData, oilBatchId: e.target.value })}
              >
                {oilBatches.map((batch) => (
                  <MenuItem key={batch.id} value={batch.id}>
                    {batch.batchCode} - {batch.cannabinoid} {batch.potency}mg
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Dose (mg)"
              type="number"
              value={formData.dose}
              onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
              fullWidth
            />

            <TextField
              label="Cannabinoid (e.g., D9, D8)"
              value={formData.cannabinoid}
              onChange={(e) => setFormData({ ...formData, cannabinoid: e.target.value })}
              fullWidth
            />

            <TextField
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Create Batch
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)}>
        <DialogTitle>Batch QR Code</DialogTitle>
        <DialogContent>
          {selectedBatch && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
              <QRCodeSVG value={selectedBatch.qrCode} size={200} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedBatch.batchCode}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
          <Button
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BatchManagement; 