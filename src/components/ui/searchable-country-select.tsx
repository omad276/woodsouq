'use client';

import { useMemo } from 'react';
import Select from 'react-select';
import { COUNTRIES } from '@/types';

interface SearchableCountrySelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
}

export function SearchableCountrySelect({
  value,
  onValueChange,
  placeholder = 'Search countries...',
  name,
  required,
}: SearchableCountrySelectProps) {
  const countryOptions = useMemo(
    () =>
      COUNTRIES.map((country) => ({
        value: country,
        label: country,
      })),
    []
  );

  const selectedOption = value
    ? countryOptions.find((opt) => opt.value === value)
    : null;

  return (
    <>
      {name && (
        <input
          type="hidden"
          name={name}
          value={value || ''}
          required={required}
        />
      )}
      <Select
        options={countryOptions}
        value={selectedOption}
        onChange={(option) => onValueChange?.(option?.value || '')}
        placeholder={placeholder}
        isClearable
        isSearchable
        classNames={{
          control: () =>
            'h-9 rounded-md border border-input bg-transparent text-sm shadow-sm',
          placeholder: () => 'text-muted-foreground',
          input: () => 'text-sm',
          menu: () => 'rounded-md border bg-popover shadow-lg',
          option: ({ isFocused, isSelected }) =>
            `px-2 py-1.5 text-sm cursor-pointer ${
              isSelected
                ? 'bg-accent text-accent-foreground'
                : isFocused
                ? 'bg-accent/50'
                : ''
            }`,
        }}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: '36px',
            backgroundColor: 'transparent',
            borderColor: 'hsl(var(--input))',
          }),
          menu: (base) => ({
            ...base,
            zIndex: 50,
          }),
          option: (base) => ({
            ...base,
            backgroundColor: undefined,
          }),
        }}
      />
    </>
  );
}
