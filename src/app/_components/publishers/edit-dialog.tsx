import { Button, buttonVariants } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env";
import { AssignPublisherTopicSchema } from "@/lib/schema/publishers";
import { IPublisher, IPublisherTopic } from "@/lib/types/generic";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DownloadIcon, PauseIcon, PlayIcon, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CopyButton from "../generic/copy-button";
import TopicDropdown from "../generic/topic-dropdown";

const getPublisherTopicUrl = (relation_id: string) => {
  return `${env.NEXT_PUBLIC_APP_URL}/tr/${relation_id}?adbid=&subid=`;
};

const PublisherEditDialog = ({
  publisher,
  refresh,
}: {
  publisher: IPublisher;
  refresh: () => void;
}) => {
  const editPublisher = api.publishers.editPublisher.useMutation();

  const publisherTxtList = publisher.topics
    .map(
      (t, index) =>
        `${index + 1}) ${t.topic.name} ${getPublisherTopicUrl(t.id)}`,
    )
    .join("\n");

  const downloadCsv = () => {
    let csvFileData = "Index, Title, URL";
    csvFileData += `\n${publisher.topics
      .map(
        (t, index) =>
          `${index + 1},${t.topic.name},${getPublisherTopicUrl(t.id)}`,
      )
      .join("\n")}`;
    const anchor = document.createElement("a");
    anchor.href = "data:text/csv;charset=utf-8," + encodeURI(csvFileData);
    anchor.target = "_blank";
    anchor.download = `${publisher.name.replaceAll(" ", "-").toLowerCase()}-topics.csv`;
    anchor.click();
  };

  const toggleActivePublisher = async () => {
    const result = await editPublisher.mutateAsync({
      publisher_id: publisher.id,
      active: !publisher.active,
    });
    if (result) refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Viewing Publisher - {publisher.name}</DialogTitle>
          <DialogDescription>
            View and manage this publisher below
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <div className="flex w-full flex-col gap-y-4">
            <div className="flex justify-between gap-x-2">
              <div className="flex flex-col">
                <Label>Publisher ID</Label>
                <div className="flex items-center gap-x-2 text-sm text-foreground/70">
                  <div>{publisher.id}</div>
                  <CopyButton
                    className={cn(
                      buttonVariants({ size: "icon", variant: "outline" }),
                      "h-7 w-7",
                    )}
                    iconSize={15}
                    text={publisher.id}
                  />
                </div>
              </div>
              <div className="flex gap-x-2">
                <Button
                  size="icon"
                  disabled={editPublisher.isPending}
                  onClick={() => toggleActivePublisher()}
                >
                  {publisher.active ? (
                    <PauseIcon size={18} />
                  ) : (
                    <PlayIcon size={18} />
                  )}
                </Button>
              </div>
            </div>
            <Separator />
            {publisher.topics.map((topic) => (
              <PublisherTopic
                topic_publisher_relation_id={topic.id}
                topic={topic}
                refresh={refresh}
                key={`publisher_${publisher.id}_topic_${topic.id}_manage`}
              />
            ))}
            {publisher.topics.length > 0 && (
              <div className="flex gap-x-2">
                <CopyButton
                  className={cn(
                    buttonVariants({ size: "default", variant: "outline" }),
                    "w-full",
                  )}
                  text={publisherTxtList}
                >
                  Copy List
                </CopyButton>
                <Button className="w-full">
                  <DownloadIcon size={18} />
                  <div onClick={() => downloadCsv()}>Download CSV</div>
                </Button>
              </div>
            )}
            {!(publisher.topics.length > 0) && (
              <div className="flex items-center justify-center py-4 text-sm text-foreground/60">
                No topics assigned to publisher
              </div>
            )}
            <Separator />
            <PublisherAssignTopic publisher={publisher} refresh={refresh} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PublisherTopic = ({
  topic_publisher_relation_id,
  topic,
  refresh,
}: {
  topic_publisher_relation_id: string;
  topic: IPublisherTopic;
  refresh: () => void;
}) => {
  const removeTopic = api.publishers.removeTopic.useMutation();

  const onDelete = async () => {
    const result = await removeTopic.mutateAsync({
      publisher_topic_relation_id: topic.id,
    });
    if (result) {
      refresh();
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Label>{topic.topic.name}</Label>
      <div className="flex gap-x-2">
        <Input
          value={getPublisherTopicUrl(topic_publisher_relation_id)}
          disabled={true}
        />
        <CopyButton text={getPublisherTopicUrl(topic_publisher_relation_id)} />
        <Button
          variant="destructive"
          size="icon"
          disabled={removeTopic.isPending}
          onClick={() => onDelete()}
        >
          <TrashIcon size={18} />
        </Button>
      </div>
    </div>
  );
};

const PublisherAssignTopic = ({
  publisher,
  refresh,
}: {
  publisher: IPublisher;
  refresh: () => void;
}) => {
  const assignTopic = api.publishers.assignTopic.useMutation();

  const form = useForm<z.infer<typeof AssignPublisherTopicSchema>>({
    resolver: zodResolver(AssignPublisherTopicSchema),
    defaultValues: {
      publisher_id: publisher.id,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AssignPublisherTopicSchema>,
  ) => {
    const result = await assignTopic.mutateAsync(values);
    if (result) {
      form.reset();
      refresh();
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="topic_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign New Topic</FormLabel>
              <FormControl>
                <TopicDropdown
                  defaultValue={field.value}
                  onChange={field.onChange}
                  filter={(id: string) =>
                    publisher.topics.findIndex((t) => t.topic.id === id) === -1
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Assign Topic</Button>
      </form>
    </Form>
  );
};

export default PublisherEditDialog;
