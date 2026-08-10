'use client';

import React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Search({
  value,
  onChange,
  placeholder = 'Search news, topics, authors…',
  id = 'search-input',
  autoFocus = false,
  size = 'md',
  className = '',
}: SearchProps) {
  const sizeClasses = {
    sm: 'py-1.5 pl-8 pr-3 text-xs',
    md: 'py-2.5 pl-10 pr-4 text-sm',
    lg: 'py-3.5 pl-12 pr-5 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5 left-2.5',
    md: 'w-4 h-4 left-3',
    lg: 'w-5 h-5 left-4',
  };

  return (
    <div className={`relative ${className}`}>
      <SearchIcon
        className={`absolute ${iconSizes[size]} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`}
      />
      <input
        id={id}
        type="search"
        autoFocus={autoFocus}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-navy-surface border border-white/10 rounded-2xl ${sizeClasses[size]} text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/25 transition-all`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
