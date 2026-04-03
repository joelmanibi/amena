import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

function NewsSearchForm({ query, selectedCategory, copy }) {
  return (
    <form action="/news" className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray-dark" />
        <Input
          name="q"
          defaultValue={query}
          placeholder={copy.searchPlaceholder}
          className="input-corporate h-12 rounded-xl border-brand-gray-modern bg-white pl-11 text-brand-black placeholder:text-brand-gray-dark/80"
        />
      </div>
      {selectedCategory ? <input type="hidden" name="category" value={selectedCategory} /> : null}
      <button type="submit" className="btn-brand-primary h-12 px-6">
        {copy.searchButton}
      </button>
    </form>
  );
}

export { NewsSearchForm };
