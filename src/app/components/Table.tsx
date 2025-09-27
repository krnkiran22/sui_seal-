import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-brown-200 rounded-lg">
        <thead className="bg-brown-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-brown-700 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brown-200">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;