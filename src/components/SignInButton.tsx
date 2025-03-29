"use client";

import { initiateOAuthFlow } from "@/actions/dashoard";
import { Button } from "./ui/button";

export function SignInButton() {
  const handleSignIn = async () => {
    await initiateOAuthFlow();
  };

  return (
    <Button onClick={handleSignIn} className="w-full" variant="primary">
      Sign In with eBay
    </Button>
  );
}
