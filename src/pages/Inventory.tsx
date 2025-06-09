import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Ingredient, Product } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

const Inventory: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'ingredient' | 'product'>('ingredient');
  const [editingItem, setEditingItem] = useState<Ingredient | Product | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch ingredients
    const ingredientsQuery = query(collection(db, 'ingredients'));
    const ingredientsSnapshot = await getDocs(ingredientsQuery);
    const ingredientsData = ingredientsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Ingredient[];
    setIngredients(ingredientsData);

    // Fetch products
    const productsQuery = query(collection(db, 'products'));
    const productsSnapshot = await getDocs(productsQuery);
    const productsData = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    setProducts(productsData);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type: 'ingredient' | 'product', item?: Ingredient | Product) => {
    setDialogType(type);
    setEditingItem(item || null);
    setFormData(item || {});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      if (dialogType === 'ingredient') {
        const ingredientData = {
          name: formData.name,
          currentStock: Number(formData.currentStock),
          unit: formData.unit,
          reorderThreshold: Number(formData.reorderThreshold),
          supplier: formData.supplier,
          lastOrderDate: formData.lastOrderDate || new Date().toISOString(),
        };

        if (editingItem) {
          await updateDoc(doc(db, 'ingredients', editingItem.id), ingredientData);
        } else {
          await addDoc(collection(db, 'ingredients'), ingredientData);
        }
      } else {
        const productData = {
          name: formData.name,
          recipe: formData.recipe,
          allergens: formData.allergens || [],
          batchHistory: formData.batchHistory || [],
          currentStock: Number(formData.currentStock),
        };

        if (editingItem) {
          await updateDoc(doc(db, 'products', editingItem.id), productData);
        } else {
          await addDoc(collection(db, 'products'), productData);
        }
      }

      await fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (id: string, type: 'ingredient' | 'product') => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, type + 's', id));
        await fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <Box>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="inventory tabs">
          <Tab label="Ingredients" />
          <Tab label="Products" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Ingredients Inventory</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('ingredient')}
            >
              Add Ingredient
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Current Stock</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Reorder Threshold</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingredients.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell>{ingredient.name}</TableCell>
                    <TableCell>
                      {ingredient.currentStock}
                      {ingredient.currentStock <= ingredient.reorderThreshold && (
                        <WarningIcon color="warning" sx={{ ml: 1 }} />
                      )}
                    </TableCell>
                    <TableCell>{ingredient.unit}</TableCell>
                    <TableCell>{ingredient.reorderThreshold}</TableCell>
                    <TableCell>{ingredient.supplier}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog('ingredient', ingredient)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(ingredient.id, 'ingredient')}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Products Inventory</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('product')}
            >
              Add Product
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Current Stock</TableCell>
                  <TableCell>Allergens</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {product.currentStock}
                      {product.currentStock < 10 && (
                        <WarningIcon color="warning" sx={{ ml: 1 }} />
                      )}
                    </TableCell>
                    <TableCell>{product.allergens.join(', ')}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog('product', product)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(product.id, 'product')}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? `Edit ${dialogType}` : `Add ${dialogType}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Current Stock"
              type="number"
              value={formData.currentStock || ''}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              fullWidth
            />
            {dialogType === 'ingredient' && (
              <>
                <TextField
                  label="Unit"
                  value={formData.unit || ''}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Reorder Threshold"
                  type="number"
                  value={formData.reorderThreshold || ''}
                  onChange={(e) => setFormData({ ...formData, reorderThreshold: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Supplier"
                  value={formData.supplier || ''}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  fullWidth
                />
              </>
            )}
            {dialogType === 'product' && (
              <TextField
                label="Allergens (comma-separated)"
                value={formData.allergens?.join(', ') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  allergens: e.target.value.split(',').map((a: string) => a.trim())
                })}
                fullWidth
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory; 