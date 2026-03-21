'use client';

import { useMemo } from 'react';
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

  const selectedOption = value
    ? countryOptions.find((opt) => opt.value === value) || null
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
        onChange={(option: unknown) => {
          const selected = option as CountryOption | null;
          onValueChange?.(selected?.value || '');
        }}
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
        }}
      />
    </>
  );
}
