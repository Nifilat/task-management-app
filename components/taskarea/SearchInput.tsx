'use client';

import type React from 'react';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectQuery, setQuery } from '@/lib/features/filters/filtersSlice';
import { Search } from 'lucide-react';

const SearchInput = () => {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectQuery);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value));
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search tasks..."
        value={query}
        onChange={handleChange}
        className="pl-10"
      />
    </div>
  );
};

export default SearchInput;
