import React, { useState } from 'react';
import { useProducts, Product } from '../hooks/useProducts';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import ProductForm from './ProductForm';
import { useToast } from '@/hooks/use-toast';

const ProductList = () => {
  const { products, isLoading, deleteProduct } = useProducts();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Group products by category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (window.confirm(`${t('products.deleteConfirm')} "${productName}"?`)) {
      try {
        await deleteProduct(productId);
        toast({
          title: t('products.productDeleted'),
          description: `${productName} ${t('products.productDeletedDesc')}`
        });
      } catch (error) {
        toast({
          title: t('products.error'),
          description: t('products.failedToDelete'),
          variant: "destructive"
        });
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onClose={handleCloseForm}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('products.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('products.subtitle')}
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('products.addProduct')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('products.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t('products.filterByCategory')} />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? t('products.allCategories') : t(`categories.${category}`) || category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products List */}
      <div className="space-y-2">
        <Accordion type="multiple" className="w-full">
          {Object.entries(groupedProducts).map(([category, categoryProducts], categoryIndex) => (
            <AccordionItem key={category} value={`item-${categoryIndex}`} className="border rounded-lg">
              <AccordionTrigger className="px-4 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-lg text-blue-900 dark:text-blue-100">
                    {t(`categories.${category}`) || category}
                  </span>
                  <Badge variant="outline" className="text-sm mr-4">
                    {categoryProducts.length} {categoryProducts.length === 1 ? t('products.product') : t('products.products')}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableHead className="font-semibold">{t('products.name')}</TableHead>
                      <TableHead className="font-semibold">{t('products.description')}</TableHead>
                      <TableHead className="font-semibold text-right">{t('products.price')}</TableHead>
                      <TableHead className="font-semibold text-right">{t('products.quantity')}</TableHead>
                      <TableHead className="font-semibold text-right">{t('products.totalValue')}</TableHead>
                      <TableHead className="font-semibold text-center">{t('products.status')}</TableHead>
                      <TableHead className="font-semibold text-center">{t('products.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t('products.lastUpdated')}: {product.lastUpdated}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {product.description}
                          </p>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${product.price}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.quantity}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-green-600">
                          ${(product.price * product.quantity).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={product.quantity < 50 ? "destructive" : "secondary"}>
                            {product.quantity < 50 ? t('products.lowStock') : t('products.inStock')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product.id, product.name)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {t('products.noProductsFound')}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {t('products.noProductsDesc')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
