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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { vendors } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Vendor Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
          <CardDescription>
            Approve new vendors and manage existing accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Member Since
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.storeName}</TableCell>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn("text-xs", {
                        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400 border-green-300":
                          vendor.status === "Active",
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400 border-yellow-300":
                          vendor.status === "Pending",
                        "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400 border-red-300":
                          vendor.status === "Suspended",
                      })}
                      variant="outline"
                    >
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {vendor.memberSince}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Approve</DropdownMenuItem>
                        <DropdownMenuItem>View Store</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Suspend
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
