import { SignInButton } from "@/components/SignInButton";

export default async function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <p className="text-gray-600 mb-6">
          Please sign in with eBay to access the dashboard.
        </p>
        <SignInButton />
      </div>
    </div>
  );
}
