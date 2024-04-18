import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { landingPages } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

const LandingPageDeleteDialog = ({
  landingPage,
  onSuccess,
}: {
  landingPage: typeof landingPages.$inferSelect;
  onSuccess: () => void;
}) => {
  const deleteLandingPage = api.landingPages.deleteLandingPage.useMutation();

  const [open, setOpen] = useState<boolean>(false);

  const onDelete = async () => {
    const result = await deleteLandingPage.mutateAsync(landingPage.id);
    if (result) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="smIcon" variant="destructive">
          <TrashIcon size={17} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Landing Page deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete landing page {landingPage.name}? You
            will lose all statistics related to this landing page
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-x-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteLandingPage.isPending}
            onClick={() => onDelete()}
          >
            Delete {landingPage.name}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LandingPageDeleteDialog;
