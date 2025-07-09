import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X } from 'lucide-react';
import { Product } from '@/services/productService';
import { fetchAllSellers, SellerInfo } from '@/services/admin.service';
import { useAuth } from '@/contexts/AuthContext';

const productFormSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive('Price must be a positive number')),
  discount_price: z.preprocess((a) => (a ? parseFloat(z.string().parse(a)) : undefined), z.number().positive('Discount price must be a positive number').optional().nullable()),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  long_description: z.string().optional(),
  inventory_count: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().int().min(0, "Inventory can't be negative")),
  seller_id: z.string().optional(),
  images: z.array(z.instanceof(File)).min(1, 'At least one image is required').max(5, 'You can upload a maximum of 5 images'),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  loading: boolean;
  productToEdit: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, loading, productToEdit }) => {
  const isEditMode = !!productToEdit;
  const { user } = useAuth();
  const { toast } = useToast();
  const [sellers, setSellers] = useState<SellerInfo[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      price: 0,
      discount_price: null,
      category: '',
      description: '',
      long_description: '',
      inventory_count: 1,
      images: [],
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = form;

  useEffect(() => {
    if (isEditMode && productToEdit) {
      reset({
        name: productToEdit.name,
        description: productToEdit.description,
        long_description: productToEdit.long_description || '',
        price: productToEdit.price,
        discount_price: productToEdit.discount_price || undefined,
        category: productToEdit.category?.slug || '',
        inventory_count: productToEdit.inventory_count,
        images: [], // Image editing is not handled in this form for simplicity
      });
    } else if (!isEditMode) {
      reset({
        name: '',
        price: 0,
        discount_price: null,
        category: '',
        description: '',
        long_description: '',
        inventory_count: 1,
        images: [],
      });
    }
  }, [productToEdit, isEditMode, reset]);

  const watchedImages = watch('images');

  useEffect(() => {
    if (watchedImages && watchedImages.length > 0) {
      const newImageUrls = Array.from(watchedImages).map(file => URL.createObjectURL(file));
      setImagePreviews(newImageUrls);

      return () => newImageUrls.forEach(url => URL.revokeObjectURL(url));
    } else {
        setImagePreviews([]);
    }
  }, [watchedImages]);

  useEffect(() => {
    const getSellers = async () => {
      try {
        const sellerData = await fetchAllSellers();
        setSellers(sellerData);
      } catch (error) {
        toast({ title: 'Error', description: 'Could not fetch sellers.', variant: 'destructive' });
      }
    };

    if (user?.role === 'admin') {
      getSellers();
    }
  }, [user, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setValue('images', files, { shouldValidate: true });
    }
  };
  
  const removeImage = (index: number) => {
    const updatedImages = [...(watchedImages || [])];
    updatedImages.splice(index, 1);
    setValue('images', updatedImages, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      {user?.role === 'admin' && (
        <div className="md:col-span-2">
          <Label htmlFor="seller_id">Seller *</Label>
          <Select name="seller_id" onValueChange={(value) => setValue('seller_id', value)} defaultValue={form.getValues('seller_id')}>
            <SelectTrigger><SelectValue placeholder="Select a seller" /></SelectTrigger>
            <SelectContent>
              {sellers.map(seller => (
                <SelectItem key={seller.id} value={String(seller.id)}>{seller.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.seller_id && <p className="text-red-500 text-xs mt-1">{errors.seller_id.message}</p>}
        </div>
      )}

      <div className="md:col-span-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="price">Price ($) *</Label>
        <Input id="price" type="number" step="0.01" {...register('price')} />
        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
      </div>

      <div>
        <Label htmlFor="discount_price">Discount Price ($) (Optional)</Label>
        <Input id="discount_price" type="number" step="0.01" {...register('discount_price')} />
        {errors.discount_price && <p className="text-red-500 text-xs mt-1">{errors.discount_price.message}</p>}
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Select onValueChange={(value) => setValue('category', value, { shouldValidate: true })} defaultValue={form.getValues('category')}>
          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
          <SelectContent>
            {[
              'Apparel & Accessories',
              'Electronics',
              'Home & Garden',
              'Health & Beauty',
              'Sports & Outdoors',
              'Toys & Hobbies',
              'Books & Media',
              'Automotive',
              'Grocery',
              'Pet Supplies',
              'Real Estate',
              'Technology',
              'Handmade',
              'Vintage',
            ].map(category => (
              <SelectItem key={category} value={category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
      </div>

      <div>
        <Label htmlFor="inventory_count">Inventory Count</Label>
        <Input id="inventory_count" type="number" {...register('inventory_count')} />
        {errors.inventory_count && <p className="text-red-500 text-xs mt-1">{errors.inventory_count.message}</p>}
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="description">Short Description *</Label>
        <Textarea id="description" {...register('description')} />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="long_description">Long Description (Optional)</Label>
        <Textarea id="long_description" {...register('long_description')} rows={5} />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="images">Product Images *</Label>
        <Input id="images" type="file" multiple onChange={handleImageChange} accept="image/*" className="mb-2" />
        {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2 p-2 border rounded-md">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative group">
                <img src={src} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="md:col-span-2 text-right">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            isEditMode ? 'Update Product' : 'Submit for Review'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
