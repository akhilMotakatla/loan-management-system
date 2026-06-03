export default function Table({ columns, data, loading, emptyText = 'No data found' }) {
  if (loading) return <div className="py-16 text-center text-muted">Loading...</div>;
  if (!data?.length) return <div className="py-16 text-center text-muted">{emptyText}</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy-light">
            {columns.map((c) => (
              <th key={c.key} className="text-left py-3 px-4 text-silver font-medium tracking-wider uppercase text-xs">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row._id || i} className="border-b border-navy-mid hover:bg-navy-mid/50 transition-colors">
              {columns.map((c) => (
                <td key={c.key} className="py-3 px-4 text-platinum">
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
