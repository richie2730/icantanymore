import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  currentSort: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
  className?: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  children,
  sortKey,
  currentSort,
  onSort,
  className = ""
}) => {
  const isActive = currentSort?.key === sortKey;
  const direction = currentSort?.direction;

  return (
    <th 
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center justify-between">
        <span>{children}</span>
        <div className="flex flex-col ml-1">
          <ChevronUp 
            className={`w-3 h-3 ${isActive && direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
          />
          <ChevronDown 
            className={`w-3 h-3 -mt-1 ${isActive && direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
          />
        </div>
      </div>
    </th>
  );
};

export default SortableHeader;