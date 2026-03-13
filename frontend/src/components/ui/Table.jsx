import { FiInbox } from 'react-icons/fi';

export default function Table({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  striped = false,
  onRowClick
}) {

  const stateCellStyles = {
    padding: 'var(--spacing-8)',
    textAlign: 'center',
    color: 'var(--text-secondary)'
  };

  return (
    <div className="table-wrapper">
      <table className={`table ${striped ? 'table-striped' : ''}`}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={stateCellStyles}>
                Cargando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={stateCellStyles}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <FiInbox size={32} />
                  <span>{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
