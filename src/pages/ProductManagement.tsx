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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product } from '../types';
import { getProductAbbreviation } from '../utils/productAbbreviations';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const productsQuery = query(collection(db, 'products'));
    const productsSnapshot = await getDocs(productsQuery);
    const productsData = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    setProducts(productsData);
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        abbreviation: product.abbreviation,
        currentStock: product.currentStock,
        allergens: product.allergens.join(', '),
        recipe: {
          ingredients: product.recipe.ingredients.map(i => ({
            ...i,
            ingredientId: i.ingredientId
          })),
          instructions: product.recipe.instructions
        }
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        abbreviation: '',
        currentStock: 0,
        allergens: '',
        recipe: {
          ingredients: [],
          instructions: ''
        }
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      const productData = {
        name: formData.name,
        abbreviation: formData.abbreviation || getProductAbbreviation(formData.name),
        currentStock: Number(formData.currentStock),
        allergens: formData.allergens.split(',').map((a: string) => a.trim()).filter(Boolean),
        recipe: {
          ingredients: formData.recipe.ingredients || [],
          instructions: formData.recipe.instructions || ''
        },
        batchHistory: editingProduct?.batchHistory || []
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }

      await fetchProducts();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Product Management</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Product
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Abbreviation</TableCell>
                <TableCell>Current Stock</TableCell>
                <TableCell>Allergens</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.abbreviation}</TableCell>
                  <TableCell>{product.currentStock}</TableCell>
                  <TableCell>
                    {product.allergens.map((allergen) => (
                      <Chip
                        key={allergen}
                        label={allergen}
                        size="small"
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(product)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Product Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Abbreviation (optional)"
              value={formData.abbreviation || ''}
              onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
              fullWidth
              helperText="Leave empty to auto-generate from product name"
            />
            <TextField
              label="Current Stock"
              type="number"
              value={formData.currentStock || ''}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Allergens (comma-separated)"
              value={formData.allergens || ''}
              onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
              fullWidth
              helperText="Enter allergens separated by commas"
            />
            <TextField
              label="Recipe Instructions"
              value={formData.recipe?.instructions || ''}
              onChange={(e) => setFormData({
                ...formData,
                recipe: { ...formData.recipe, instructions: e.target.value }
              })}
              fullWidth
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingProduct ? 'Save Changes' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement; 