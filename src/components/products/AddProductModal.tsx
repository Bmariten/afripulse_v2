import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ProductForm, { ProductFormData } from './ProductForm';
import { Product } from '@/services/productService'; // Import the Product type

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ProductFormData) => void;
  loading: boolean;
  productToEdit: Product | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit, loading, productToEdit }) => {
  const isEditMode = !!productToEdit;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Product' : 'Add a New Product'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update the details of your product below. Changes will be submitted for review.' 
              : 'Fill out the details below to add a new product to your store. All products are subject to review.'}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[75vh] overflow-y-auto pr-6">
            <ProductForm onSubmit={onSubmit} loading={loading} productToEdit={productToEdit} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
