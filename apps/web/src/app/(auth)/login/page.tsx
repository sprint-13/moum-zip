import { LoginForm } from "@/features/auth";
import { AuthCard } from "@/shared/ui";

export default function Page() {
  return (
    <AuthCard>
      <LoginForm />
    </AuthCard>
  );
}
