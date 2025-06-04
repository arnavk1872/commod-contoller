
import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  lastUpdated: string;
}

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Coffee Beans',
    category: 'Beverages',
    price: 24.99,
    quantity: 150,
    description: 'High-quality arabica coffee beans from Colombia',
    lastUpdated: '2024-06-03'
  },
  {
    id: '2',
    name: 'Organic Quinoa',
    category: 'Grains',
    price: 12.50,
    quantity: 75,
    description: 'Certified organic quinoa from Bolivia',
    lastUpdated: '2024-06-02'
  },
  {
    id: '3',
    name: 'Extra Virgin Olive Oil',
    category: 'Oils',
    price: 18.75,
    quantity: 200,
    description: 'Cold-pressed olive oil from Mediterranean olives',
    lastUpdated: '2024-06-01'
  },
  {
    id: '4',
    name: 'Wild-Caught Salmon',
    category: 'Seafood',
    price: 32.00,
    quantity: 45,
    description: 'Fresh Atlantic salmon, sustainably sourced',
    lastUpdated: '2024-06-04'
  },
  {
    id: '5',
    name: 'Himalayan Pink Salt',
    category: 'Seasonings',
    price: 8.99,
    quantity: 300,
    description: 'Pure rock salt from the Himalayan mountains',
    lastUpdated: '2024-06-03'
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProducts(mockProducts);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, 'id' | 'lastUpdated'>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setProducts(prev => [...prev, newProduct]);
    setIsLoading(false);
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
        : product
    ));
    setIsLoading(false);
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProducts(prev => prev.filter(product => product.id !== id));
    setIsLoading(false);
  };

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
