'use client';

export function TimeFilter() {
  return (
    <select className="px-2 py-1 text-xs border rounded-md">
      <option>Today</option>
      <option>This Week</option>
      <option>This Month</option>
    </select>
  );
}