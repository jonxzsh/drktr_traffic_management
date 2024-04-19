import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IPublisher } from "@/lib/types/generic";
import { api } from "@/trpc/react";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

const PublishersPageDeleteDialog = ({
  publisher,
  onSuccess,
}: {
  publisher: IPublisher;
  onSuccess: () => void;
}) => {
  const deletePublisher = api.publishers.deletePublisher.useMutation();

  const [open, setOpen] = useState<boolean>(false);

  const onDelete = async () => {
    const result = await deletePublisher.mutateAsync(publisher.id);
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
          <DialogTitle>Confirm Publisher deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete publisher {publisher.name}? You will
            lose all statistics related to this publisher
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-x-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deletePublisher.isPending}
            onClick={() => onDelete()}
          >
            Delete {publisher.name}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishersPageDeleteDialog;
