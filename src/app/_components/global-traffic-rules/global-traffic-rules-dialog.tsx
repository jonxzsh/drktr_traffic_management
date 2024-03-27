"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const GlobalTrafficRulesDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Global Traffic Rules</Button>
      </DialogTrigger>
      <DialogContent></DialogContent>
    </Dialog>
  );
};

export default GlobalTrafficRulesDialog;
