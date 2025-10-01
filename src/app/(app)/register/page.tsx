import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RegisterForm } from '@/components/register-form';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-secondary/50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Become a Vendor</CardTitle>
          <CardDescription>
            Create your vendor account to start selling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
