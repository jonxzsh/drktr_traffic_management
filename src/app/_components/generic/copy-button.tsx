import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CopyCheck, CopyIcon } from "lucide-react";
import { useState } from "react";

const CopyButton = ({
  className = buttonVariants({ size: "icon", variant: "outline" }),
  iconSize = 17,
  text,
  children,
}: {
  className?: string;
  iconSize?: number;
  text: string;
  children?: React.ReactNode;
}) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const copyText = async () => {
    await navigator.clipboard.writeText(text);

    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 1000);
  };

  return (
    <button
      className={cn(className, "flex gap-x-2")}
      onClick={() => copyText()}
    >
      {copySuccess ? (
        <CopyCheck size={iconSize ?? 17} />
      ) : (
        <CopyIcon size={iconSize ?? 17} />
      )}
      {children && <div>{children}</div>}
    </button>
  );
};

export default CopyButton;
