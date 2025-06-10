export type UserRole = 'admin' | 'kitchen_manager' | 'kitchen_staff' | 'fulfillment_manager' | 'fulfillment_staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: 'kitchen' | 'fulfillment';
}

export interface Ingredient {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
  reorderThreshold: number;
  supplier: string;
  lastOrderDate: string;
}

export interface OilBatch {
  id: string;
  batchCode: string;
  cannabinoid: string;
  potency: number;
  source: string;
  productionDate: string;
  expiryDate: string;
  currentStock: number;
}

export interface Product {
  id: string;
  name: string;
  abbreviation: string;
  recipe: {
    ingredients: {
      ingredientId: string;
      amount: number;
      unit: string;
    }[];
    instructions: string;
  };
  allergens: string[];
  batchHistory: string[];
  currentStock: number;
}

export interface Batch {
  id: string;
  productId: string;
  batchCode: string;
  productionDate: string;
  expiryDate: string;
  oilBatchId: string;
  quantity: number;
  status: 'production' | 'completed' | 'shipped';
  qrCode: string;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    batchId: string;
    quantity: number;
  }[];
  status: 'pending' | 'fulfilled' | 'cancelled';
  fulfillmentDate?: string;
  fulfilledBy?: string;
} 