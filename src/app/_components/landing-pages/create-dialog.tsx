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
import { Switch } from "@/components/ui/switch";
import { CreateLandingPageSchema } from "@/lib/schema/landing-pages";
import { deviceEnum } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CountryDropdown from "../generic/country-dropdown";
import TopicDropdown from "../generic/topic-dropdown";
import TrafficRulesetsDropdown from "../generic/traffic-rulesets-dropdown";

const LandingPageCreateDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const createMutation = api.landingPages.createLandingPage.useMutation();

  const form = useForm<z.infer<typeof CreateLandingPageSchema>>({
    resolver: zodResolver(CreateLandingPageSchema),
    defaultValues: {
      ip_frequency_cap: {
        requests: 3,
        hours: 24,
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateLandingPageSchema>) => {
    const createLandingPage = await createMutation.mutateAsync(values);
    if (createLandingPage) {
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
          <div>Create Landing Page</div>
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
                Create New Landing Page
              </div>
              <div className="text-sm">
                Enter the required details below to create a new landing page,
                you can edit everything below later
              </div>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="flex justify-between gap-x-8">
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
                  name={"topic_id"}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <TopicDropdown defaultValue={field.value} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              <div className="flex justify-between gap-x-8">
                <FormField
                  control={form.control}
                  name={"ip_frequency_cap.requests"}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>IP Frequency Cap Requests</FormLabel>
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
                <FormField
                  control={form.control}
                  name={"ip_frequency_cap.hours"}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>IP Frequency Cap Hours</FormLabel>
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
                name={"max_daily_hits"}
                render={({ field }) => (
                  <FormItem>
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

              <div className="flex justify-between gap-x-8">
                <div className="flex w-full flex-col gap-y-3">
                  <FormField
                    control={form.control}
                    name={"traffic_ruleset_id"}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Traffic Ruleset</FormLabel>
                        <FormControl>
                          <TrafficRulesetsDropdown
                            defaultValue={field.value ?? ""}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"geo"}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Geographic Restrictions</FormLabel>
                        <FormControl>
                          <CountryDropdown
                            defaultValue={field.value ?? ""}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full flex-col gap-y-5">
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
                              <RadioGroupItem
                                value={deviceEnum.enumValues[2]}
                              />
                              <FormLabel>Any</FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={deviceEnum.enumValues[0]}
                              />
                              <FormLabel>Desktop</FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={deviceEnum.enumValues[1]}
                              />
                              <FormLabel>Mobile</FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"referrer_required"}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch
                          defaultChecked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                        <FormLabel>Referrer Required</FormLabel>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            <Button disabled={createMutation.isPending} type={"submit"}>
              Create Landing Page
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LandingPageCreateDialog;
