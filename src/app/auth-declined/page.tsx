"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { initiateOAuthFlow } from "@/actions/dashoard";

export default function AuthDeclinedPage() {
  const handleSignInAgain = async () => {
    await initiateOAuthFlow();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Authorization Required
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-700 mb-4">
            You declined the authorization request OR there was an error. To use
            this app, you must grant consent to access and modify your eBay
            store data.
          </p>
          <p className="text-gray-600 mb-6">
            Please sign in again and allow access to continue.
          </p>
          <Button
            onClick={handleSignInAgain}
            className="w-full"
            variant="primary"
          >
            Sign In with eBay Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
