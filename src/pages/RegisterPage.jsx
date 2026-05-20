import { RegisterForm } from "@/components/auth/RegisterForm";
import { Link } from "react-router-dom";

export function RegisterPage() {
  return (
    <div className="auth-bg-overlay flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col gap-4">
        <RegisterForm />
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
