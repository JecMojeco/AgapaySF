import { RegisterForm } from "@/components/auth/RegisterForm";

export function RegisterPage() {
  return (
    <div className="auth-bg-overlay flex min-h-screen items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
