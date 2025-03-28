"use client";

import { useEffect, useState } from "react";
import TableView from "@/components/features/TableView";
import {
  onFetchRecords,
  initiateOAuthFlow,
  handleOAuthCallback,
  isAuthenticated,
} from "@/actions/dashoard";
import { TableRowData } from "@/types/interfaces";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [initialData, setInitialData] = useState<TableRowData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const error = searchParams.get("error");
        if (error) {
          router.replace("/auth-declined");
          return;
        }

        const code = searchParams.get("code");
        if (code) {
          await handleOAuthCallback(code);
          router.replace("/dashboard");
          return;
        }

        const authenticated = await isAuthenticated();
        if (!authenticated) {
          setShowModal(true);
          return;
        }

        setShowModal(false);
        const result = await onFetchRecords();
        setInitialData(result.initialData || []);
      } catch (error) {
        console.error("Error checking auth or fetching records:", error);
      }
    };
    checkAuthAndFetch();
  }, [searchParams, router]);

  const handleLogin = async () => {
    await initiateOAuthFlow();
  };

  return (
    <div className="p-4 min-h-screen flex flex-col">
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Please Authenticate
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={handleLogin} variant="primary">
              Login with eBay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <TableView initialData={initialData} />
    </div>
  );
}
