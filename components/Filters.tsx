import React from 'react';

interface Props { onSearch: (term: string) => void; }

export default function Filters({ onSearch }: Props) {
  return (
    <div className="p-2">
      <input
        type="text"
        placeholder="Search chats"
        onChange={e => onSearch(e.target.value)}
        className="w-full px-3 py-2 border rounded focus:outline-none"
        aria-label="Search chats"
      />
    </div>
  );
}