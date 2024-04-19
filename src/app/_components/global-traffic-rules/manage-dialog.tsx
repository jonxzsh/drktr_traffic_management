"use client";

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
import { Switch } from "@/components/ui/switch";
import { SetGlobalTrafficRulesSchema } from "@/lib/schema/global-traffic-rules";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const GlobalTrafficRulesMangeDialog = () => {
  const [open, setOpen] = useState<boolean>(false);

  const trafficRules = api.globalTraffic.getRules.useQuery();
  const setTrafficRules = api.globalTraffic.setRules.useMutation();

  const form = useForm<z.infer<typeof SetGlobalTrafficRulesSchema>>({
    resolver: zodResolver(SetGlobalTrafficRulesSchema),
  });

  const onSubmit = async (
    values: z.infer<typeof SetGlobalTrafficRulesSchema>,
  ) => {
    const result = await setTrafficRules.mutateAsync(values);
    if (result) {
      trafficRules.refetch();
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!trafficRules.data) return;
    form.setValue("block_http_traffic", trafficRules.data.block_http_traffic);
    form.setValue(
      "block_alternative_browsers",
      trafficRules.data.block_alternative_browsers,
    );
  }, [trafficRules.data]);

  useEffect(() => {
    trafficRules.refetch();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Global Traffic Rules</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Global Traffic Rules</DialogTitle>
          <DialogDescription>
            View and manage the global traffic rules
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
                name="block_http_traffic"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-x-2">
                    <FormLabel>Block HTTP Traffic</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="block_alternative_browsers"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-x-2">
                    <FormLabel>Block Alternative Browsers</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              disabled={trafficRules.isPending || setTrafficRules.isPending}
              type="submit"
            >
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalTrafficRulesMangeDialog;
