'use client';

import { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { COUNTRIES } from '@/types';

const Select = dynamic(() => import('react-select'), { ssr: false });

interface CountryOption {
  value: string;
  label: string;
}

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
  const countryOptions: CountryOption[] = useMemo(
    () =>
      [...COUNTRIES].map((country) => ({
        value: country,
        label: country,
      })),
    []
  );

  const [selectedOption, setSelectedOption] = useState<CountryOption | null>(null);

  // Sync selectedOption with value prop
  useEffect(() => {
    if (value) {
      const option = countryOptions.find((opt) => opt.value === value);
      setSelectedOption(option || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, countryOptions]);

  const handleChange = (option: unknown) => {
    const selected = option as CountryOption | null;
    setSelectedOption(selected);
    onValueChange?.(selected?.value || '');
  };

  return (
    <>
      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedOption?.value || ''}
          required={required}
        />
      )}
      <Select
        options={countryOptions}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable
        isSearchable
        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
        styles={{
          control: (base: Record<string, unknown>) => ({
            ...base,
            minHeight: '36px',
            fontSize: '14px',
          }),
          menuPortal: (base: Record<string, unknown>) => ({
            ...base,
            zIndex: 9999,
          }),
          singleValue: (base: Record<string, unknown>) => ({
            ...base,
            color: 'inherit',
          }),
        }}
      />
    </>
  );
}
