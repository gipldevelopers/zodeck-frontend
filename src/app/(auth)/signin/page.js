// src\app\(auth)\signin\page.js
import AuthGuard from "@/components/auth/AuthGuard";
import SignInForm from "@/components/auth/SignInForm";

export const metadata = {
  title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function SignIn() {
  return (
    <AuthGuard requireAuth={false}>  {/* Don't require auth for signin page */}
      <SignInForm />
    </AuthGuard>
  )
}