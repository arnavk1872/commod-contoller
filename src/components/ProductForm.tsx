import React, { useState, useEffect } from 'react';
import { useProducts, Product } from '../hooks/useProducts';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct, isLoading } = useProducts();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ['Beverages', 'Grains', 'Oils', 'Seafood', 'Seasonings', 'Dairy', 'Meat', 'Vegetables', 'Fruits'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        description: product.description
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = t('productForm.productNameRequired');
    if (!formData.category) newErrors.category = t('productForm.categoryRequired');
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = t('productForm.validPriceRequired');
    }
    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      newErrors.quantity = t('productForm.validQuantityRequired');
    }
    if (!formData.description.trim()) newErrors.description = t('productForm.descriptionRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: t('auth.validationError'),
        description: t('productForm.validationErrorDesc'),
        variant: "destructive"
      });
      return;
    }

    try {
      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        description: formData.description.trim()
      };

      if (product) {
        await updateProduct(product.id, productData);
        toast({
          title: t('productForm.productUpdated'),
          description: `${productData.name} ${t('productForm.productUpdatedDesc')}`
        });
      } else {
        await addProduct(productData);
        toast({
          title: t('productForm.productAdded'),
          description: `${productData.name} ${t('productForm.productAddedDesc')}`
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: t('products.error'),
        description: t('productForm.failedToSave'),
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('productForm.backToProducts')}
        </Button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {product ? t('products.editProduct') : t('products.addNewProduct')}
        </h2>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('productForm.productInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('productForm.productName')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('productForm.enterProductName')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t('productForm.category')} *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('productForm.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {t(`categories.${category}`) || category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{t('productForm.price')} *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">{t('productForm.quantity')} *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="0"
                  className={errors.quantity ? 'border-red-500' : ''}
                />
                {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('productForm.description')} *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={t('productForm.description')}
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? t('productForm.saving') : t('productForm.save')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                {t('productForm.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
