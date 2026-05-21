import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/Logo";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    full_name: "",
    contact_number: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "contact_number") {
      setFormData((prev) => ({ ...prev, [id]: value.replace(/\D/g, "").slice(0, 11) }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const contactRegex = /^09\d{9}$/;
    if (!contactRegex.test(formData.contact_number)) {
      return toast({
        title: "Registration Failed",
        description: "Invalid contact number. Must be 11 digits starting with 09.",
        variant: "destructive",
      });
    }

    // Password must be at least 8 characters and include letters, numbers, and special characters
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      return toast({
        title: "Registration Failed",
        description: "Password must be at least 8 characters long and contain letters, numbers, and at least one special character (@$!%*?&).",
        variant: "destructive",
      });
    }

    if (formData.password !== formData.confirmPassword) {
      return toast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
    }

    setIsLoading(true);

    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.full_name,
          contact_number: formData.contact_number,
          password: formData.password,
        }),
      });

      toast({
        title: "Registration Successful",
        description: "Your account is pending approval by an administrator.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <Logo className="h-16 mx-auto mb-2" />
          <CardTitle>Register for AgapaySF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_number">Contact Number</Label>
            <Input
              id="contact_number"
              placeholder="09XXXXXXXXX"
              value={formData.contact_number}
              onChange={handleChange}
              maxLength={11}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
