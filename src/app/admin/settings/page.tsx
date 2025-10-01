
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Admin Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Site Configuration</CardTitle>
          <CardDescription>
            Manage global settings for the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="maintenance-mode" className="flex flex-col space-y-1">
              <span>Maintenance Mode</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Temporarily disable the storefront for all users.
              </span>
            </Label>
            <Switch id="maintenance-mode" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="vendor-approval" className="flex flex-col space-y-1">
                <span>Require Vendor Approval</span>
                <span className="font-normal leading-snug text-muted-foreground">
                    New vendor accounts must be manually approved by an admin.
                </span>
            </Label>
            <Switch id="vendor-approval" defaultChecked />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
