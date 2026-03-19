import { LoginForm } from "@/features/auth/ui/login-form";
import { AuthCard } from "@/shared/ui/auth-card";

export const LoginPage = () => {
  return (
    <AuthCard>
      <LoginForm />
    </AuthCard>
  );
};
