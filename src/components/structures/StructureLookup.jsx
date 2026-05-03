import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Loader2, Building } from 'lucide-react';

export function StructureLookup({ onSelect, initialValue = '' }) {
  const [search, setSearch] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const selectedRef = useRef(initialValue);

  // Sync state with initialValue prop if it changes
  if (initialValue !== prevInitialValue) {
    setSearch(initialValue);
    setPrevInitialValue(initialValue);
  }

  useEffect(() => {
    selectedRef.current = initialValue;
  }, [initialValue]);

  useEffect(() => {
    if (!search || search.length < 2 || search === selectedRef.current) {
      if (search !== selectedRef.current) {
        setResults([]);
      }
      return;
    }

    let ignore = false;
    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api(`/structures?search=${encodeURIComponent(search)}`);
        if (!ignore) {
          setResults(data);
          setIsOpen(true);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Structure lookup error:', err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      ignore = true;
      clearTimeout(handler);
    };
  }, [search]);

  const handleSelect = (structure) => {
    selectedRef.current = structure.address;
    setSearch(structure.address);
    setIsOpen(false);
    onSelect(structure);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search structure by address or owner..."
          value={search}
          onChange={(e) => {
            const val = e.target.value;
            setSearch(val);
            if (val !== selectedRef.current) {
              selectedRef.current = null;
            }
            if (!val) setIsOpen(false);
          }}
          className="pl-9"
          onFocus={() => {
            if (search.length >= 2 && results.length > 0) {
              setIsOpen(true);
            }
          }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {results.map((s) => (
            <div
              key={s.structure_id}
              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleSelect(s)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{s.address}</span>
                <span className="text-xs text-muted-foreground">
                  Owner: {s.owner_first_name} {s.owner_surname} • {s.structure_type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isOpen && search.length >= 2 && !loading && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-4 text-sm text-muted-foreground shadow-md">
          No structures found.
        </div>
      )}
    </div>
  );
}
