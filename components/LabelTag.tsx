import React from 'react';

interface Props { name: string; }

export default function LabelTag({ name }: Props) {
  return (
    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">
      {name}
    </span>
  );
}
