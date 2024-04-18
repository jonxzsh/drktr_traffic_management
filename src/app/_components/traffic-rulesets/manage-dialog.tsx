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
import { EditTrafficRulesetSchema } from "@/lib/schema/traffic-rulesets";
import { ITrafficRuleset } from "@/lib/types/generic";
import { deviceEnum } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import StringArrayBuilder from "../generic/string-array-builder";

const TrafficRulesetManageDialog = ({
  ruleset,
  refresh,
}: {
  ruleset: ITrafficRuleset;
  refresh: () => void;
}) => {
  const editRuleset = api.trafficRulesets.editTrafficRuleset.useMutation();

  const form = useForm<z.infer<typeof EditTrafficRulesetSchema>>({
    resolver: zodResolver(EditTrafficRulesetSchema),
    defaultValues: {
      ruleset_id: ruleset.id,
      name: ruleset.name,
      device: ruleset.device,
      referrer_domains_allowed: ruleset.rulesetAllowedDomains.map((d) => ({
        id: d.id,
        value: d.domain ?? undefined,
      })),
      referrer_required_parameters: ruleset.rulesetRequiredParameters.map(
        (p) => ({ id: p.id, value: p.parameter ?? undefined }),
      ),
      referrer_url_min_length: ruleset.referrer_url_min_length,
    },
  });

  const onSubmit = async (values: z.infer<typeof EditTrafficRulesetSchema>) => {
    const result = await editRuleset.mutateAsync(values);
    if (result) {
      refresh();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Viewing Ruleset - {ruleset.name}</DialogTitle>
          <DialogDescription>
            View and manage this ruleset below
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
              <FormField
                control={form.control}
                name={"referrer_domains_allowed"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referrer Domains Allowed</FormLabel>
                    <FormControl>
                      <StringArrayBuilder
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"referrer_required_parameters"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referrer Paramters Required</FormLabel>
                    <FormControl>
                      <StringArrayBuilder
                        defaultValue={field.value}
                        onChange={field.onChange}
                        itemName={"Parameter"}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"referrer_url_min_length"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum URL Length</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between">
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
            </div>
            <Button type={"submit"}>Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TrafficRulesetManageDialog;
