import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trafficRulesets } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

const TrafficRulesetsPageDeleteDialog = ({
  ruleset,
  onSuccess,
}: {
  ruleset: typeof trafficRulesets.$inferSelect;
  onSuccess: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const deleteRuleset = api.trafficRulesets.deleteTrafficRuleset.useMutation();

  const onDelete = async () => {
    const result = await deleteRuleset.mutateAsync(ruleset.id);
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
          <DialogTitle>Confirm Ruleset deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete ruleset {ruleset.name}? You will
            lose all statistics related to this ruleset You cannot delete a
            ruleset that is still used by a landing page
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-x-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteRuleset.isPending}
            onClick={() => onDelete()}
          >
            Delete {ruleset.name}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrafficRulesetsPageDeleteDialog;
