import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { topics } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

const TopicsPageDeleteDialog = ({
  topic,
  onSuccess,
}: {
  topic: typeof topics.$inferSelect;
  onSuccess: () => void;
}) => {
  const deleteTopic = api.topics.deleteTopic.useMutation();

  const [open, setOpen] = useState<boolean>(false);

  const onDelete = async () => {
    const result = await deleteTopic.mutateAsync(topic.id);
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
          <DialogTitle>Confirm Publisher deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete publisher {topic.name}? You will
            lose all statistics related to this publisher
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-x-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteTopic.isPending}
            onClick={() => onDelete()}
          >
            Delete {topic.name}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopicsPageDeleteDialog;
