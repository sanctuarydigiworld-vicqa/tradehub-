'use server';

import {
  generateProductDescription as generateProductDescriptionFlow,
  type GenerateProductDescriptionInput,
} from '@/ai/flows/generate-product-description';
import { z } from 'zod';

const formSchema = z.object({
  productName: z.string().min(1, 'Product name is required.'),
  productFeatures: z.string().min(1, 'Product features are required.'),
  productCategory: z.string().optional(),
  targetAudience: z.string().optional(),
  stylePreferences: z.string().optional(),
});

export async function generateDescriptionAction(
  formData: FormData
) {
  const validatedFields = formSchema.safeParse({
    productName: formData.get('productName'),
    productFeatures: formData.get('productFeatures'),
    productCategory: formData.get('productCategory'),
    targetAudience: formData.get('targetAudience'),
    stylePreferences: formData.get('stylePreferences'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      description: '',
    };
  }

  try {
    const input: GenerateProductDescriptionInput = {
      productName: validatedFields.data.productName,
      productFeatures: validatedFields.data.productFeatures,
      productCategory: validatedFields.data.productCategory || 'general',
      targetAudience: validatedFields.data.targetAudience || 'all customers',
      stylePreferences: validatedFields.data.stylePreferences || 'engaging',
    };
    
    const result = await generateProductDescriptionFlow(input);

    return {
      success: true,
      message: 'Description generated successfully.',
      description: result.productDescription,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to generate description. Please try again.',
      description: '',
    };
  }
}
