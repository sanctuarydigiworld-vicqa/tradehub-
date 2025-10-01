'use server';

/**
 * @fileOverview A product description AI generator.
 *
 * - generateProductDescription - A function that handles the product description generation.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productFeatures: z.string().describe('The features of the product.'),
  productCategory: z.string().describe('The category of the product.'),
  targetAudience: z.string().describe('The target audience for the product.'),
  stylePreferences: z.string().describe('The desired style of the description (e.g., professional, humorous, engaging).'),
});
export type GenerateProductDescriptionInput = z.infer<
  typeof GenerateProductDescriptionInputSchema
>;

const GenerateProductDescriptionOutputSchema = z.object({
  productDescription: z.string().describe('The generated product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<
  typeof GenerateProductDescriptionOutputSchema
>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating compelling product descriptions.
Your task is to write a product description based on the provided details.
The output should only be the product description itself, formatted according to the specified style.

## Product Details ##
Product Name: {{{productName}}}
Features: {{{productFeatures}}}
Category: {{{productCategory}}}
Target Audience: {{{targetAudience}}}
Tone & Style: {{{stylePreferences}}}

## Generated Product Description ##
`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
