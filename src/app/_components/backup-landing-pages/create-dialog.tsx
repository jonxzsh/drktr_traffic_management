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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreateBackupLandingPageSchema } from "@/lib/schema/backup-landing-pages";
import { deviceEnum } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const BackupLandingPageEditDialog = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const createBackupLandingPage =
    api.backupLandingPages.createBackupLandingPage.useMutation();

  const form = useForm<z.infer<typeof CreateBackupLandingPageSchema>>({
    resolver: zodResolver(CreateBackupLandingPageSchema),
  });

  const onSubmit = async (
    values: z.infer<typeof CreateBackupLandingPageSchema>,
  ) => {
    const createLandingPage = await createBackupLandingPage.mutateAsync(values);
    if (createLandingPage) {
      form.reset();
      setOpen(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <div>Create Backup Landing Page</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Backup Landing Page</DialogTitle>
          <DialogDescription>
            Enter the required details below to create a new backup landing
            page, you can edit everything below later
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
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"url"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"max_daily_hits"}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Maximum Daily Hits</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name={"device"}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Device Restrictions</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={deviceEnum.enumValues[2]} />
                        <FormLabel>Any</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={deviceEnum.enumValues[0]} />
                        <FormLabel>Desktop</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={deviceEnum.enumValues[1]} />
                        <FormLabel>Mobile</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={createBackupLandingPage.isPending}
              type={"submit"}
            >
              Create Backup Landing Page
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BackupLandingPageEditDialog;
