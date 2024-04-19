import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { topics } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { UsersIcon } from "lucide-react";
import { useState } from "react";

const TopicsAssignAllDialog = ({
  topic,
  onSuccess,
}: {
  topic: typeof topics.$inferSelect;
  onSuccess: () => void;
}) => {
  const assignAllPublishers = api.topics.assignAllPublishers.useMutation();

  const [open, setOpen] = useState<boolean>(false);

  const onAssignAll = async () => {
    const result = await assignAllPublishers.mutateAsync(topic.id);
    if (result) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="smIcon">
          <UsersIcon size={17} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Topic to All Publishers</DialogTitle>
          <DialogDescription>
            Please confirm that you want to assign this topic to all active
            publishers, who don&apos;t have it assigned already
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={assignAllPublishers.isPending}
            onClick={() => onAssignAll()}
          >
            Assign {topic.name} to all publishers
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TopicsAssignAllDialog;
