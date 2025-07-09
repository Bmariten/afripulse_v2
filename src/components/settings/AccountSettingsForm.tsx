import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Base schema for personal profile information, required for all users
const profileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  zip_code: z.string().min(1, { message: 'ZIP code is required' }),
});

// Schema for seller-specific business information
const sellerProfileSchema = z.object({
  business_name: z.string().min(1, { message: 'Business name is required' }),
  business_description: z.string().optional(),
  business_address: z.string().min(1, { message: 'Business address is required' }),
  business_city: z.string().min(1, { message: 'Business city is required' }),
  business_state: z.string().min(1, { message: 'Business state is required' }),
  business_country: z.string().min(1, { message: 'Business country is required' }),
  business_zip_code: z.string().min(1, { message: 'Business ZIP code is required' }),
  business_phone: z.string().min(1, { message: 'Business phone is required' }),
  business_email: z.string().email({ message: 'A valid business email is required' }),
});

// Schema for affiliate-specific information
const affiliateProfileSchema = z.object({
  website: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')), 
  social_media: z.string().optional(),
  niche: z.string().optional(),
  paypal_email: z.string().email({ message: 'Please enter a valid PayPal email' }).optional().or(z.literal('')), 
  bank_account: z.string().optional(),
});

// Combine schemas based on user type
const adminFormSchema = profileSchema;
const sellerFormSchema = profileSchema.merge(sellerProfileSchema);
const affiliateFormSchema = profileSchema.merge(affiliateProfileSchema);

// A union type for all possible form values
type AccountFormValues = z.infer<typeof sellerFormSchema> & z.infer<typeof affiliateFormSchema>;

interface AccountSettingsFormProps {
  userType: 'seller' | 'affiliate' | 'admin';
  initialData?: Partial<AccountFormValues>;
  onSubmit: (data: Partial<AccountFormValues>) => Promise<boolean | void>;
}

export function AccountSettingsForm({ userType, initialData, onSubmit }: AccountSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getSchema = () => {
    switch (userType) {
      case 'seller': return sellerFormSchema;
      case 'affiliate': return affiliateFormSchema;
      case 'admin': return adminFormSchema;
      default: return z.object({}); // Should not happen
    }
  };

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      // Personal info
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zip_code: '',

      // Seller info
      business_name: '',
      business_description: '',
      business_address: '',
      business_city: '',
      business_state: '',
      business_country: '',
      business_zip_code: '',
      business_phone: '',
      business_email: '',

      // Affiliate info
      website: '',
      social_media: '',
      niche: '',
      paypal_email: '',
      bank_account: '',
      

      // Merge initial data, which will overwrite defaults if present
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = async (data: Partial<AccountFormValues>) => {
    setIsLoading(true);
    await onSubmit(data);
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* --- Personal Information --- */}
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="text-lg font-medium">Personal Information</h3>
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input {...field} disabled={isLoading} placeholder="Your full name" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl><Input {...field} disabled={isLoading} placeholder="+1 (555) 123-4567" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="address" render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl><Input {...field} disabled={isLoading} placeholder="123 Main St" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="city" render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl><Input {...field} disabled={isLoading} placeholder="Anytown" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="state" render={({ field }) => (
            <FormItem>
              <FormLabel>State / Province</FormLabel>
              <FormControl><Input {...field} disabled={isLoading} placeholder="Your state or province" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="zip_code" render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP / Postal Code</FormLabel>
              <FormControl><Input {...field} disabled={isLoading} placeholder="12345" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="country" render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl><Input {...field} disabled={isLoading} placeholder="Your country" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* --- Business Details (Seller Only) --- */}
        {userType === 'seller' && (
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Business Details</h3>
            <FormField control={form.control} name="business_name" render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl><Input {...field} disabled={isLoading} placeholder="Your Business Inc." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="business_description" render={({ field }) => (
              <FormItem>
                <FormLabel>Business Description (Optional)</FormLabel>
                <FormControl><Textarea {...field} disabled={isLoading} placeholder="What does your business do?" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="business_address" render={({ field }) => (
              <FormItem>
                <FormLabel>Business Address</FormLabel>
                <FormControl><Input {...field} disabled={isLoading} placeholder="123 Business Rd" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="business_city" render={({ field }) => (
              <FormItem>
                <FormLabel>Business City</FormLabel>
                <FormControl><Input {...field} disabled={isLoading} placeholder="Business City" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="business_state" render={({ field }) => (
              <FormItem>
                <FormLabel>Business State / Province</FormLabel>
                <FormControl><Input {...field} disabled={isLoading} placeholder="Business State" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="business_zip_code" render={({ field }) => (
              <FormItem>
                <FormLabel>Business ZIP / Postal Code</FormLabel>
                <FormControl><Input {...field} disabled={isLoading} placeholder="54321" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="business_country" render={({ field }) => (
              <FormItem>
                <FormLabel>Business Country</FormLabel>
                <FormControl><Input {...field} disabled={isLoading} placeholder="Business Country" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="business_phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Business Phone</FormLabel>
                <FormControl><Input {...field} disabled={isLoading} placeholder="+1 (555) 987-6543" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="business_email" render={({ field }) => (
              <FormItem>
                <FormLabel>Business Email</FormLabel>
                <FormControl><Input {...field} type="email" disabled={isLoading} placeholder="contact@business.com" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        )}

        {/* --- Affiliate Details (Affiliate Only) --- */}
        {userType === 'affiliate' && (
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Affiliate Details</h3>
            <FormField control={form.control} name="website" render={({ field }) => (
              <FormItem>
                <FormLabel>Website (Optional)</FormLabel>
                <FormControl><Input {...field} disabled={isLoading} placeholder="https://your-website.com" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="social_media" render={({ field }) => (
              <FormItem>
                <FormLabel>Social Media Profiles (Optional)</FormLabel>
                <FormControl><Textarea {...field} disabled={isLoading} placeholder="Links to your social media profiles, one per line." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="niche" render={({ field }) => (
              <FormItem>
                <FormLabel>Niche / Audience (Optional)</FormLabel>
                <FormControl><Input {...field} disabled={isLoading} placeholder="e.g., Fitness, Cooking, Tech" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="paypal_email" render={({ field }) => (
              <FormItem>
                <FormLabel>PayPal Email (Optional)</FormLabel>
                <FormControl><Input {...field} type="email" disabled={isLoading} placeholder="your-paypal@example.com" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="bank_account" render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Account Details (Optional)</FormLabel>
                <FormControl><Textarea {...field} disabled={isLoading} placeholder="Bank Name, Account Number, etc." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Settings'}
        </Button>
      </form>
    </Form>
  );
}
