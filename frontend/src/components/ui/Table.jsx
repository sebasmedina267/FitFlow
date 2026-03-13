import { FiInbox } from 'react-icons/fi';

export default function Table({ 
  columns, 
  data = [], 
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  onRowClick
}) {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner-lg" />
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="table-empty">
        <FiInbox className="empty-icon" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
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
          {data.map((row, idx) => (
            <tr 
              key={row.id || idx} 
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'clickable' : ''}
            >
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
