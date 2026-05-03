import { RegisterForm } from "@/components/auth/RegisterForm";
import { Link } from "react-router-dom";

export function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="flex flex-col gap-4">
        <RegisterForm onRegister={() => alert("Registration submitted for approval")} />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
