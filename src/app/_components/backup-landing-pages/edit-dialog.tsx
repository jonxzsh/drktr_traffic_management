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
import { EditBackupLandingPageSchema } from "@/lib/schema/backup-landing-pages";
import { backupLandingPages, deviceEnum } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const BackupLandingPageEditDialog = ({
  backupLandingPage,
  onSuccess,
}: {
  backupLandingPage: typeof backupLandingPages.$inferSelect;
  onSuccess: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const editBackupLandingPage =
    api.backupLandingPages.editBackupLandingPage.useMutation();

  const form = useForm<z.infer<typeof EditBackupLandingPageSchema>>({
    resolver: zodResolver(EditBackupLandingPageSchema),
    defaultValues: {
      landing_page_id: backupLandingPage.id,
      name: backupLandingPage.name,
      url: backupLandingPage.url,
      max_daily_hits: backupLandingPage.maxDailyHits,
      device: backupLandingPage.device,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof EditBackupLandingPageSchema>,
  ) => {
    const createLandingPage = await editBackupLandingPage.mutateAsync(values);
    if (createLandingPage) {
      form.reset();
      setOpen(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"}>
          <div>Edit</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Viewing Backup Landing page - {backupLandingPage.name}
          </DialogTitle>
          <DialogDescription>
            You can view and edit the selected page below
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
            <Button disabled={editBackupLandingPage.isPending} type={"submit"}>
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BackupLandingPageEditDialog;
