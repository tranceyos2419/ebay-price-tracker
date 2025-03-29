"use client";

import { initiateOAuthFlow } from "@/actions/dashoard";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await initiateOAuthFlow();
    } catch (error) {
      console.error("Sign-in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      onClick={handleSignIn}
      className="w-full flex gap-2 items-center justify-center"
      variant="primary"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In with eBay"
      )}
    </Button>
  );
}
