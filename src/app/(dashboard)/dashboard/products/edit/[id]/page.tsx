
import { AiProductForm } from "@/components/ai-product-form";

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
        <h1 className="text-3xl font-bold mb-2">Edit Product</h1>
        <p className="text-muted-foreground mb-6">Update the details for your product below.</p>
        <AiProductForm productId={params.id} />
    </div>
  )
}
