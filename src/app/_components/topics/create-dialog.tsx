import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateTopicSchema } from "@/lib/schema/topics";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const TopicCreateDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const createMutation = api.topics.createTopic.useMutation();

  const form = useForm<z.infer<typeof CreateTopicSchema>>({
    resolver: zodResolver(CreateTopicSchema),
  });

  const onSubmit = async (values: z.infer<typeof CreateTopicSchema>) => {
    const createTopic = await createMutation.mutateAsync(values);
    if (createTopic) {
      form.reset();
      onSuccess();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <div>Create Topic</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
          <DialogDescription>
            Enter the required details below to create a new topic
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-y-3">
              <FormField
                control={form.control}
                name={"name"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={createMutation.isPending} type={"submit"}>
              Create Topic
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TopicCreateDialog;
