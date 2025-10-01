'use client';

import { useFormStatus } from 'react-dom';
import { generateDescriptionAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: '',
  description: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate with AI
        </>
      )}
    </Button>
  );
}

export function AiProductForm() {
  const [state, formAction] = useActionState(generateDescriptionAction, initialState);
  const [productDescription, setProductDescription] = useState('');
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);


  useEffect(() => {
    if(state.message && state.message !== 'Description generated successfully.') {
        toast({
            title: 'Error',
            description: state.message,
            variant: 'destructive'
        })
    }
    if (state.description) {
      setProductDescription(state.description);
      toast({
        title: 'Success!',
        description: "Your AI-powered description is ready.",
      })
    }
  }, [state, toast]);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
        <form action={formAction} ref={formRef} className="lg:col-span-2 grid gap-6">
            <Card>
                <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                    Enter your product details here. These will be used by the AI to generate a description.
                </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input id="productName" name="productName" placeholder="e.g. Hand-carved Wooden Cross" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="productFeatures">Key Features (comma-separated)</Label>
                    <Textarea
                    id="productFeatures"
                    name="productFeatures"
                    placeholder="e.g. Made from olive wood, Hand-carved in Bethlehem, Smooth finish"
                    />
                </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>AI Generation Options</CardTitle>
                    <CardDescription>
                        Fine-tune the AI to match your brand's voice.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="productCategory">Product Category</Label>
                    <Input id="productCategory" name="productCategory" placeholder="e.g. Sacramentals" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input id="targetAudience" name="targetAudience" placeholder="e.g. Devout Catholics, Gift shoppers" />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="stylePreferences">Tone & Style</Label>
                     <Select name="stylePreferences" defaultValue='engaging'>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="engaging">Engaging</SelectItem>
                            <SelectItem value="humorous">Humorous</SelectItem>
                            <SelectItem value="luxurious">Luxurious</SelectItem>
                            <SelectItem value="minimalist">Minimalist</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </Card>
        </form>

        <div className="lg:col-span-1">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5"/> AI Generated Description</CardTitle>
                    <CardDescription>
                        Your generated product description will appear here. You can edit it before saving.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder="Your AI-generated product description will appear here..."
                        className="min-h-[200px]"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                    />
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Save as Draft</Button>
                    <Button>Publish Product</Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
