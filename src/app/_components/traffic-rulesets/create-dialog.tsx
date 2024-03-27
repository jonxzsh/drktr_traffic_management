import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { CreateTrafficRulesetSchema } from "@/lib/schema/traffic-rulesets";
import { deviceEnum } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import StringArrayBuilder from "../generic/string-array-builder";

const TrafficRulesetsCreateDialog = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const createMutation = api.trafficRulesets.createTrafficRuleset.useMutation();

  const form = useForm<z.infer<typeof CreateTrafficRulesetSchema>>({
    resolver: zodResolver(CreateTrafficRulesetSchema),
    defaultValues: {
      referrer_domains_allowed: ["example.com"],
      referrer_required_parameters: [],
    },
  });

  const onSubmit = async (
    values: z.infer<typeof CreateTrafficRulesetSchema>,
  ) => {
    const createTrafficRuleset = await createMutation.mutateAsync(values);
    if (createTrafficRuleset) {
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
          <div>Create Traffic Ruleset</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col">
              <div className="text-xl font-semibold">
                Create New Traffic Ruleset
              </div>
              <div className="text-sm">
                Enter the required details below to create a new traffic ruleset
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
            <Button disabled={createMutation.isPending} type={"submit"}>
              Create Traffic Ruleset
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TrafficRulesetsCreateDialog;
