import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/elements/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  [key: string]: FilterOption[];
}

interface DataTableFiltersProps {
  resourceName: string;
  filters: Record<string, string | undefined>;
}

export function DataTableFilters({ resourceName, filters }: DataTableFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const applyFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      }
    });

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.get(newUrl, {}, { preserveState: true, preserveScroll: true });
  };

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    setLocalFilters({});
    router.get(window.location.pathname, {}, { preserveState: true, preserveScroll: true });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== 'all' && value !== ''
  ).length;

  const getFilterOptions = (): FilterConfig => {
    switch (resourceName) {
      case 'user':
        return {
          role: [
            { value: 'all', label: 'All Roles' },
            { value: 'ADMIN', label: 'Admin' },
            { value: 'COURIER', label: 'Courier' },
            { value: 'CLIENT', label: 'Client' },
          ],
          status: [
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ],
          deleted_status: [
            { value: 'all', label: 'All Users' },
            { value: 'active', label: 'Active Only' },
            { value: 'deleted', label: 'Deleted Only' },
          ],
        };
      case 'contact':
        return {
          gender: [
            { value: 'all', label: 'All Genders' },
            { value: 'MAN', label: 'Man' },
            { value: 'WOMAN', label: 'Woman' },
          ],
        };
      default:
        return {};
    }
  };

  const filterOptions = getFilterOptions();

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge 
                variant="default"
                className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[250px]">
          <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="space-y-4 p-2">
            {Object.entries(filterOptions).map(([key, options]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium capitalize">
                  {key.replace('_', ' ')}
                </label>
                <Select
                  value={localFilters[key] || 'all'}
                  onValueChange={(value) => updateFilter(key, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option: FilterOption) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            
            {activeFiltersCount > 0 && (
              <>
                <DropdownMenuSeparator />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full justify-start"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || value === 'all' || value === '') return null;
            
            return (
              <Badge key={key} variant="default" className="text-xs">
                {key.replace('_', ' ')}: {value}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => updateFilter(key, 'all')}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}