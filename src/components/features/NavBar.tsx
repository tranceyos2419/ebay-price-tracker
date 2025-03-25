"use client";

import { Button } from "@/components/ui/button";
import DataModal from "./DataModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "./ConfirmationModal";
import { useState, useEffect, useRef } from "react";
import {
  onUpdateKeyPage,
  onUpdateTrackingPage,
  onDeleteKeyPage,
} from "@/actions/dashoard";
import toast from "react-hot-toast";
import { TableRowData, TrackingPageData } from "@/types/interfaces";
import { Status } from "@prisma/client";

interface NavBarProps {
  onAddSuccess?: (newRow: TableRowData) => void;
  selectedRows: string[];
  data: TableRowData[];
  setData: (data: TableRowData[]) => void;
  setSelectedRows: (rows: string[]) => void;
}

const NavBar = ({
  onAddSuccess,
  selectedRows,
  data,
  setData,
  setSelectedRows,
}: NavBarProps) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isAtBottom = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if at top
      if (currentScrollY === 0) {
        setIsVisible(true);
        return;
      }

      // Check if at bottom
      isAtBottom.current = currentScrollY + windowHeight >= documentHeight - 10;
      if (isAtBottom.current) {
        setIsVisible(false);
        return;
      }

      // Determine scroll direction
      if (currentScrollY < lastScrollY.current) {
        // Scrolling up - show navbar immediately
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down - hide navbar
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBulkUpdate = async () => {
    const updatedRows = data.filter((row) =>
      selectedRows.includes(row.keyPage.ebay_item_id),
    );

    let allSuccess = true;

    for (const row of updatedRows) {
      const keyPageCard = document.querySelector(
        `[data-ebay-id="${row.keyPage.ebay_item_id}"]`,
      ) as HTMLElement;
      const keyPageInputs = keyPageCard?.querySelectorAll("input");
      const updatedKeyPageData = {
        ebay_item_id: keyPageInputs?.[2]?.value || row.keyPage.ebay_item_id,
        price: parseFloat(
          keyPageInputs?.[0]?.value || row.keyPage.price.toString(),
        ),
        minimum_best_offer: parseFloat(
          keyPageInputs?.[1]?.value ||
            row.keyPage.minimum_best_offer.toString(),
        ),
      };

      const keyPageResult = await onUpdateKeyPage(
        row.keyPage.ebay_item_id,
        updatedKeyPageData,
      );
      if (!keyPageResult.success) {
        toast.error(
          `Failed to update key page ${row.keyPage.ebay_item_id}: ${keyPageResult.message}`,
        );
        allSuccess = false;
        continue;
      }

      const trackingPages = [row.page01, row.page02, row.page03].filter(
        Boolean,
      );
      for (const page of trackingPages) {
        if (page) {
          const trackingCard = document.querySelector(
            `[data-ebay-id="${page.ebay_item_id}"]`,
          ) as HTMLElement;
          const trackingInput = trackingCard?.querySelector("input");
          const updatedTrackingData = {
            ebay_item_id: trackingInput?.value || page.ebay_item_id,
          };

          const trackingResult = await onUpdateTrackingPage(
            page.ebay_item_id,
            updatedTrackingData,
          );
          if (!trackingResult.success) {
            toast.error(
              `Failed to update tracking page ${page.ebay_item_id}: ${trackingResult.message}`,
            );
            allSuccess = false;
          }
        }
      }
    }

    if (allSuccess) {
      const newData: TableRowData[] = data.map((row) => {
        if (selectedRows.includes(row.keyPage.ebay_item_id)) {
          const keyPageCard = document.querySelector(
            `[data-ebay-id="${row.keyPage.ebay_item_id}"]`,
          ) as HTMLElement;
          const keyPageInputs = keyPageCard?.querySelectorAll("input");
          const updatedRow = { ...row };
          updatedRow.keyPage = {
            ...updatedRow.keyPage,
            ebay_item_id: keyPageInputs?.[2]?.value || row.keyPage.ebay_item_id,
            price: parseFloat(
              keyPageInputs?.[0]?.value || row.keyPage.price.toString(),
            ),
            minimum_best_offer: parseFloat(
              keyPageInputs?.[1]?.value ||
                row.keyPage.minimum_best_offer.toString(),
            ),
            last_updated_date: new Date().toLocaleString(),
          };
          updatedRow.timestamp = new Date().toLocaleString();
          updatedRow.status = Status.SUCCESS;

          [row.page01, row.page02, row.page03].forEach((page, index) => {
            if (page) {
              const trackingCard = document.querySelector(
                `[data-ebay-id="${page.ebay_item_id}"]`,
              ) as HTMLElement;
              const trackingInput = trackingCard?.querySelector("input");
              if (trackingInput) {
                const updatedTrackingPage: TrackingPageData = {
                  ...page,
                  ebay_item_id: trackingInput.value,
                  last_updated_date: new Date().toLocaleString(),
                };
                const key = `page0${index + 1}` as
                  | "page01"
                  | "page02"
                  | "page03";
                updatedRow[key] = updatedTrackingPage;
              }
            }
          });
          return updatedRow;
        }
        return row;
      });

      setData(newData);
      setSelectedRows([]);
      toast.success("Selected rows updated successfully");
    }
  };

  const handleBulkDelete = () => {
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    const rowsToDelete = selectedRows;
    for (const ebayId of rowsToDelete) {
      const result = await onDeleteKeyPage(ebayId);
      if (!result.success) {
        toast.error(`Failed to delete row ${ebayId}: ${result.message}`);
        return;
      }
    }
    setData(
      data.filter((row) => !rowsToDelete.includes(row.keyPage.ebay_item_id)),
    );
    setSelectedRows([]);
    setIsBulkDeleteModalOpen(false);
    toast.success("Selected rows deleted successfully");
  };

  return (
    <>
      <div
        className={`flex justify-between items-center mb-4 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 p-4 border-b shadow-sm`}
      >
        <div className="flex space-x-2">
          <DataModal onAddSuccess={onAddSuccess} />
          <Button
            className={`${
              selectedRows.length > 0
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-orange-400 text-gray-700 cursor-not-allowed"
            } cursor-pointer`}
            onClick={handleBulkUpdate}
            disabled={selectedRows.length === 0}
          >
            UPDATE
          </Button>
          <Button
            className={`${
              selectedRows.length > 0
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-400 text-gray-700 cursor-not-allowed"
            } cursor-pointer`}
            onClick={handleBulkDelete}
            disabled={selectedRows.length === 0}
          >
            DELETE
          </Button>
        </div>

        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-13 w-13 cursor-pointer">
                  <AvatarImage src="" alt="dawit" />
                  <AvatarFallback>YF</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">yoshi</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    yoshi@gmail.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="mr-2 h-4 w-4 cursor-pointer" /> Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4 cursor-pointer" /> Dark Mode
                    </>
                  )}
                  <DropdownMenuShortcut>⇧⌘T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        message={`Are you sure you want to delete ${selectedRows.length} selected row(s)? This action will delete the key pages and all related tracking pages and is irreversible.`}
      />
    </>
  );
};

export default NavBar;
