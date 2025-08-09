import { Input } from '../ui/input';
import { useQueryStore } from '@/hooks/useQueryStore';

const SearchInput = () => {
  const { query, setQuery } = useQueryStore();
  return <Input value={query} onChange={(e) => setQuery(e.target.value)} type='text' placeholder="Search Tasks..." className="h-8" />;
};

export default SearchInput;
