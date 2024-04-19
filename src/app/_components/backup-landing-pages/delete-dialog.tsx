import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { backupLandingPages } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

const BackupLandingPageDeleteDialog = ({
  backupLandingPage,
  onSuccess,
}: {
  backupLandingPage: typeof backupLandingPages.$inferSelect;
  onSuccess: () => void;
}) => {
  const deleteBackupLandingPage =
    api.backupLandingPages.deleteBackupLandingPage.useMutation();

  const [open, setOpen] = useState<boolean>(false);

  const onDelete = async () => {
    const result = await deleteBackupLandingPage.mutateAsync(
      backupLandingPage.id,
    );
    if (result) {
      setOpen(false);
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
          <DialogTitle>Confirm Backup Landing Page deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete backup landing page{" "}
            {backupLandingPage.name}? You will lose all statistics related to
            this landing page
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-x-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteBackupLandingPage.isPending}
            onClick={() => onDelete()}
          >
            Delete {backupLandingPage.name}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BackupLandingPageDeleteDialog;
