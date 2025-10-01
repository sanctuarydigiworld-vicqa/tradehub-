import { AiProductForm } from "@/components/ai-product-form";

export default function NewProductPage() {
  return (
    <div>
        <h1 className="text-3xl font-bold mb-2">Create New Product</h1>
        <p className="text-muted-foreground mb-6">Fill in the details below or use our AI to generate a compelling description.</p>
        <AiProductForm />
    </div>
  )
}
