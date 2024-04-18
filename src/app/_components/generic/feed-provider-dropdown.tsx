import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeedProvider } from "@/lib/types/generic";
import { feedProviderEnum } from "@/server/db/schema";

const FeedProviderDropdown = ({
  defaultValue,
  onChange,
}: {
  defaultValue: undefined | FeedProvider;
  onChange: (state: FeedProvider) => void;
}) => {
  return (
    <Select
      value={defaultValue}
      onValueChange={(v) => {
        onChange(v as FeedProvider);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a feed provider" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={feedProviderEnum.enumValues[0]}>System1</SelectItem>
        <SelectItem value={feedProviderEnum.enumValues[1]}>Ads.com</SelectItem>
        <SelectItem value={feedProviderEnum.enumValues[2]}>Tonic</SelectItem>
        <SelectItem value={feedProviderEnum.enumValues[3]}>Sedo</SelectItem>
        <SelectItem value={feedProviderEnum.enumValues[4]}>
          Youversal
        </SelectItem>
        <SelectItem value={feedProviderEnum.enumValues[5]}>Perion</SelectItem>
        <SelectItem value={feedProviderEnum.enumValues[6]}>AdMakxx</SelectItem>
        <SelectItem value={feedProviderEnum.enumValues[7]}>
          First Offer
        </SelectItem>
        <SelectItem value={feedProviderEnum.enumValues[8]}>Advertiv</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FeedProviderDropdown;
