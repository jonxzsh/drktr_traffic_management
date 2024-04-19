"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Combobox } from "@headlessui/react";
import countryList from "country-list";

type Country = {
  value: string;
  label: string;
};

const CountryDropdown = ({
  defaultValue,
  onChange,
}: {
  defaultValue: string[];
  onChange: (state: string[]) => void;
}) => {
  const [countryName, setCountryName] = useState<string>("");

  const countryObject = countryList.getCodeList();

  const countries = Object.keys(countryObject).map((k) => ({
    value: k,
    label: countryObject[k],
  })) as Country[];

  const [countriesData, setCountriesData] = useState<Country[]>(countries);

  useEffect(() => {
    if (countryName.length > 0) {
      setCountriesData(
        countries.filter((c) =>
          c.label.toLowerCase().includes(countryName.toLowerCase()),
        ),
      );
    } else {
      setCountriesData(countries);
    }
  }, [countryName]);

  return (
    <Combobox value={defaultValue} onChange={onChange} multiple>
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg border border-input bg-white text-left">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus-visible:outline-none"
            displayValue={(countries: string[]) => countries.join(", ")}
            onChange={(e) => setCountryName(e.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {countriesData.map((country) => (
            <Combobox.Option
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-4 pr-4 ${
                  active ? "bg-primary text-white" : "text-gray-900"
                }`
              }
              key={`country-option-${country.value}`}
              value={country.value}
            >
              {({ selected, active }) => (
                <div className="flex items-center gap-x-2">
                  <div className="w-6">
                    {selected && <CheckIcon size={17} />}
                  </div>
                  <div>{country.label}</div>
                </div>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default CountryDropdown;
