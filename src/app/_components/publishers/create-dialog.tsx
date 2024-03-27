import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreatePublisherSchema } from "@/lib/schema/publishers";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const PublisherCreateDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const createMutation = api.publishers.createPublisher.useMutation();

  const form = useForm<z.infer<typeof CreatePublisherSchema>>({
    resolver: zodResolver(CreatePublisherSchema),
  });

  const onSubmit = async (values: z.infer<typeof CreatePublisherSchema>) => {
    const createPublisher = await createMutation.mutateAsync(values);
    if (createPublisher) {
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
          <div>Create Publisher</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col">
              <div className="text-xl font-semibold">Create New Publisher</div>
              <div className="text-sm">
                Enter the required details below to create a new publisher, a
                unique ID and API Key will be automatically generated for them
              </div>
            </div>
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
              Create Publisher
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PublisherCreateDialog;
