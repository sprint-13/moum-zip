import { SignupForm } from "@/features/auth/ui/signup-form";
import { AuthCard } from "@/shared/ui/auth-card";

export const SignupPage = () => {
  return (
    <AuthCard>
      <SignupForm />
    </AuthCard>
  );
};
