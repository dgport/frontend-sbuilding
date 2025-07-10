"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import AddFloorPlan from "./_components/AddFloorPlan";
import FloorPlanList from "./_components/FloorPlanList";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Page() {
  const [open, setOpen] = useState(false);
  return (
    <section className="w-full px-10">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-4">
        <CardTitle>Floor Plans</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              <Plus className="w-4 h-4" />
              Add New Floor Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[calc(100vh-20%)] min-w-[1000px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Floor Plan</DialogTitle>
            </DialogHeader>
            <AddFloorPlan onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <FloorPlanList />
    </section>
  );
}
