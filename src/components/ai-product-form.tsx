
'use client';

import { useRef, useState, useEffect } from 'react';
import { generateDescriptionAction } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, Sparkles, Upload } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useFirebase, useUser } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';
import { categories } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function AiProductForm({ productId }: { productId?: string }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [productDescription, setProductDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(!!productId);
  const [product, setProduct] = useState<Partial<Product>>({});

  const { firestore } = useFirebase();
  const { user } = useUser();
  const router = useRouter();


  useEffect(() => {
    if (productId && firestore) {
      setIsEditMode(true);
      const fetchProduct = async () => {
        const docRef = doc(firestore, 'products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = docSnap.data() as Product;
          setProduct(productData);
          setProductDescription(productData.description || '');
          setImagePreview(productData.image?.imageUrl || null);
        } else {
          toast({ title: 'Error', description: 'Product not found.', variant: 'destructive'});
          router.push('/dashboard/products');
        }
      };
      fetchProduct();
    }
  }, [productId, firestore, toast, router]);


  const handleFormAction = async (formData: FormData) => {
    setIsLoading(true);
    setProductDescription('');
    const result = await generateDescriptionAction(formData);
    setIsLoading(false);

    if (result.success && result.description) {
      setProductDescription(result.description);
      toast({
        title: 'Success!',
        description: 'Your AI-powered description is ready.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!formRef.current || !firestore || !user) return;
    setIsSaving(true);

    const formData = new FormData(formRef.current);
    const productName = formData.get('productName') as string;
    const price = formData.get('price') as string;
    const category = formData.get('productCategory') as string;
    const features = (formData.get('productFeatures') as string).split(',').map(f => f.trim()).filter(Boolean);

    if (!productName) {
      toast({ title: 'Missing Product Name', description: 'Please enter a name for your product.', variant: 'destructive'});
      setIsSaving(false);
      return;
    }
    if (!imagePreview) {
      toast({ title: 'Missing Image', description: 'Please upload an image for your product.', variant: 'destructive' });
      setIsSaving(false);
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      toast({ title: 'Invalid Price', description: 'Please enter a valid price for your product.', variant: 'destructive' });
      setIsSaving(false);
      return;
    }
     if (!category) {
      toast({ title: 'Missing Category', description: 'Please select a category.', variant: 'destructive'});
      setIsSaving(false);
      return;
    }

    const docId = productId || doc(collection(firestore, 'products')).id;
    
    // Find a placeholder image for hint, or default.
    const imageHintData = PlaceHolderImages.find(p => p.imageUrl === imagePreview) || { imageHint: 'product ' + category.toLowerCase(), id: docId, description: productName };

    const productData: Product = {
      id: docId,
      name: productName,
      price: parseFloat(price),
      category: category,
      description: productDescription,
      image: {
        id: imageHintData.id,
        imageUrl: imagePreview,
        imageHint: imageHintData.imageHint,
        description: imageHintData.description,
      },
      vendor: user.uid,
      features: features,
    };
    
    try {
        await setDoc(doc(firestore, 'products', docId), productData, { merge: isEditMode });
        
        toast({
            title: `Product ${isEditMode ? 'Updated' : 'Published'}!`,
            description: `${productName} has been saved.`,
        });
        router.push('/dashboard/products');

    } catch (error) {
        console.error("Error saving product:", error);
        toast({
            title: 'Error Saving Product',
            description: 'There was an issue saving your product to Firestore.',
            variant: 'destructive',
        });
    } finally {
        setIsSaving(false);
    }
  };


  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <form
        ref={formRef}
        action={handleFormAction}
        className="lg:col-span-2 grid gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Enter your product details and upload an image.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <div className="grid gap-2">
              <Label>Product Image</Label>
              <div className={cn(
                  "aspect-video w-full rounded-md flex items-center justify-center border-2 border-dashed border-muted-foreground/30 relative",
                  {"items-start": !!imagePreview}
              )}>
                {imagePreview ? (
                    <Image src={imagePreview} alt="Product preview" fill className="object-contain rounded-md" />
                ) : (
                    <div className="text-center text-muted-foreground">
                        <Upload className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm">Drag & drop or click to upload</p>
                    </div>
                )}
                <Input 
                    id="productImage" 
                    name="productImage" 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    name="productName"
                    placeholder="e.g. Hand-carved Wooden Cross"
                    defaultValue={product.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (GH₵)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="e.g. 29.99"
                    defaultValue={product.price}
                    required
                    step="0.01"
                  />
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="productFeatures">
                Key Features (comma-separated)
              </Label>
              <Textarea
                id="productFeatures"
                name="productFeatures"
                placeholder="e.g. Made from olive wood, Hand-carved in Bethlehem, Smooth finish"
                defaultValue={product.features?.join(', ')}
                required
              />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="productCategory">Product Category</Label>
                 <Select name="productCategory" defaultValue={product.category}>
                    <SelectTrigger id="productCategory">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(category => (
                            <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                name="targetAudience"
                placeholder="e.g. Devout Catholics, Gift shoppers"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stylePreferences">Tone & Style</Label>
              <Select name="stylePreferences" defaultValue="engaging">
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
            <Button type="submit" disabled={isLoading || isSaving}>
              {isLoading ? (
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
          </CardFooter>
        </Card>
      </form>

      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" /> AI Generated Description
            </CardTitle>
            <CardDescription>
              Your generated product description will appear here. You can edit
              it before saving.
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
            <Button variant="outline" disabled={isSaving}>Save as Draft</Button>
            <Button onClick={handlePublish} disabled={isSaving || isLoading}>
              {isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Publish Product')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
