"use client";

import { Button } from "@/components/ui/button";
import DataModal from "./DataModal";

const NavBar = ({ onAdd }: { onAdd: (data: any) => void }) => {
  return (
    <div className="flex justify-start space-x-2 mb-4">
      <DataModal onSubmit={onAdd} />
      <Button className="bg-orange-500 hover:bg-orange-600">UPDATE</Button>
      <Button className="bg-red-500 hover:bg-red-600">DELETE</Button>
    </div>
  );
};

export default NavBar;
