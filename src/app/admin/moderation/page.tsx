import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { products } from "@/lib/placeholder-data";

export default function ModerationPage() {
  const flaggedItems = [
    { ...products[0], reason: "Prohibited item" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Content Moderation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Flagged Items</CardTitle>
          <CardDescription>
            Review items flagged by users for policy violations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Reason Flagged</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flaggedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.vendor}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{item.reason}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm">Ignore</Button>
                    <Button variant="destructive" size="sm">Remove Item</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
