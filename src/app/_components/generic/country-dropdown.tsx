"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import countryList from "country-list";

const CountryDropdown = ({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (state: string) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const countryObject = countryList.getCodeList();

  const selectData = Object.keys(countryObject).map((k) => ({
    value: k,
    label: countryObject[k],
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between overflow-hidden"
        >
          {defaultValue
            ? selectData.find((country) => country.value === defaultValue)
                ?.label
            : "Unrestricted"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search countries..." />
          <CommandEmpty>No county found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {selectData !== undefined &&
                selectData.map((country) => (
                  <CommandItem
                    key={country.value}
                    value={country.value}
                    onSelect={(currentValue) => {
                      onChange(
                        currentValue === defaultValue ? "" : currentValue,
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        defaultValue === country.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {country.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountryDropdown;
