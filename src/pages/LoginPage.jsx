import { LoginForm } from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

export function LoginPage({ onLogin }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="flex flex-col gap-4">
        <LoginForm onLogin={onLogin} />
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
