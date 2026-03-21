import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineX
} from 'react-icons/hi';

const statuses = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' }
];

const priorities = [
  { value: 'all', label: 'All Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'study', label: 'Study' },
  { value: 'health', label: 'Health' },
  { value: 'finance', label: 'Finance' },
  { value: 'other', label: 'Other' }
];

/**
 * TaskFilters - Filter bar with search, status, priority, and category filters
 */
export default function TaskFilters({ filters, onFilterChange }) {
  const hasActiveFilters = filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all' || filters.search;

  const clearFilters = () => {
    onFilterChange({
      status: 'all',
      priority: 'all',
      category: 'all',
      search: ''
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-lg" />
        <input
          type="text"
          value={filters.search}
          onChange={e => onFilterChange({ search: e.target.value })}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-neutral-100
            focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-sm"
        />
      </div>

      {/* Filter dropdowns */}
      <div className="flex items-center gap-2 flex-wrap">
        <HiOutlineFilter className="text-neutral-400 hidden sm:block" />
        
        <select
          value={filters.status}
          onChange={e => onFilterChange({ status: e.target.value })}
          className="px-3 py-2.5 rounded-xl border border-white/10 bg-[#111111] text-neutral-200 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
        >
          {statuses.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select
          value={filters.priority}
          onChange={e => onFilterChange({ priority: e.target.value })}
          className="px-3 py-2.5 rounded-xl border border-white/10 bg-[#111111] text-neutral-200 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
        >
          {priorities.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={e => onFilterChange({ category: e.target.value })}
          className="px-3 py-2.5 rounded-xl border border-white/10 bg-[#111111] text-neutral-200 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
        >
          {categories.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm font-medium text-danger-500 hover:bg-danger-500/10 transition-colors"
          >
            <HiOutlineX className="text-sm" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
