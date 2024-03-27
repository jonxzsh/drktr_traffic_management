"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const hashStr = (value: string) => {
  var hash = 0,
    i,
    chr;
  if (value.length === 0) return hash;
  for (i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

const StringArrayBuilder = ({
  defaultValue,
  onChange,
  itemName = "Item",
  maxItems = 5,
}: {
  defaultValue: string[];
  onChange: (state: string[]) => void;
  itemName?: string;
  maxItems?: number;
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      {!(defaultValue.length > 0) && (
        <div className="flex h-9 w-full select-none items-center justify-start rounded-md border border-red-400 px-4 text-sm text-red-400">
          No {itemName}s selected
        </div>
      )}
      {defaultValue.map((item, index) => (
        <div
          className="flex justify-between gap-x-2"
          key={`sab-${itemName}-${crypto.randomUUID()}`}
        >
          <Input
            defaultValue={item}
            onChange={(e) => {
              let arrayCopy = defaultValue;
              console.log("before", defaultValue);
              arrayCopy[index] = e.target.value;
              console.log("after", arrayCopy);
              onChange(arrayCopy);
            }}
          />
          <Button
            variant={"destructive"}
            size={"icon"}
            type={"button"}
            onClick={() => {
              let arrayCopy = defaultValue;
              arrayCopy = arrayCopy.filter((v) => v !== item);
              onChange(arrayCopy);
            }}
          >
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      ))}
      <Button
        disabled={defaultValue.length === maxItems}
        onClick={() => {
          let arrayCopy = defaultValue;
          arrayCopy.push("");
          onChange(arrayCopy);
        }}
        variant={"outline"}
        type={"button"}
      >
        Add New {itemName}
      </Button>
    </div>
  );
};

export default StringArrayBuilder;
