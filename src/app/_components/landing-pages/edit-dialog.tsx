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
import { Switch } from "@/components/ui/switch";
import { EditLandingPageSchema } from "@/lib/schema/landing-pages";
import { deviceEnum, landingPages } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CountryDropdown from "../generic/country-dropdown";
import FeedProviderDropdown from "../generic/feed-provider-dropdown";
import TopicDropdown from "../generic/topic-dropdown";
import TrafficRulesetsDropdown from "../generic/traffic-rulesets-dropdown";

const LandingPageEditDialog = ({
  landingPage,
  onSuccess,
}: {
  landingPage: typeof landingPages.$inferSelect;
  onSuccess: () => void;
}) => {
  const editLandingPage = api.landingPages.editLandingPage.useMutation();

  const form = useForm<z.infer<typeof EditLandingPageSchema>>({
    resolver: zodResolver(EditLandingPageSchema),
    defaultValues: {
      landing_page_id: landingPage.id,
      name: landingPage.name,
      url: landingPage.url,
      topic_id: landingPage.topicId,
      feed_provider: landingPage.feedProvider,
      max_daily_hits: landingPage.maxDailyHits,
      ip_frequency_cap: {
        requests: landingPage.ipFreqCap,
        hours: landingPage.ipFreqCapHours,
      },
      geo: landingPage.geo ?? undefined,
      device: landingPage.device,
      referrer_required: landingPage.referrerRequired,
      traffic_ruleset_id: landingPage.trafficRulesetId,
    },
  });

  const onSubmit = async (values: z.infer<typeof EditLandingPageSchema>) => {
    const createLandingPage = await editLandingPage.mutateAsync(values);
    if (createLandingPage) {
      form.reset();
      onSuccess();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"}>
          <div>Edit</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Viewing Landing page - {landingPage.name}</DialogTitle>
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

              <div className="flex justify-between gap-x-8">
                <FormField
                  control={form.control}
                  name={"feed_provider"}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Feed Provider</FormLabel>
                      <FormControl>
                        <FeedProviderDropdown
                          defaultValue={field.value}
                          onChange={field.onChange}
                        />
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
            <Button disabled={editLandingPage.isPending} type={"submit"}>
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LandingPageEditDialog;
