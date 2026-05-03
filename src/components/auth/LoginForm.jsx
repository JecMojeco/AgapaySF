import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ onLogin }) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login to AgapaySF</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contact">Contact Number</Label>
          <Input id="contact" placeholder="09XXXXXXXXX" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onLogin}>Login</Button>
      </CardFooter>
    </Card>
  );
}
