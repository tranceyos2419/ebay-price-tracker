import { isAuthenticated } from "@/actions/dashoard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function LandingPage() {
  const isAuth = await isAuthenticated();
  const text = isAuth ? "Dashboard" : "Sign in";
  const link = isAuth ? "/dashboard" : "/signin";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-400 p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-white text-xl font-bold">Ebay Price Tracker</div>
          <Button className="bg-blue-600 hover:bg-blue-600/90 px-5 h-10">
            <Link href={link} className="text-white hover:text-gray-200">
              {text}
            </Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Ebay Price Tracker
        </h1>
        <p className="text-gray-600 mb-8">
          Manage your eBay listings with ease and efficiency.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href={link}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            {text}
          </Link>
        </div>
      </div>
    </div>
  );
}
