import './Table.css';

function Table({ columns, data, onRowClick, selectedKey, getRowKey }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td className="table-empty" colSpan={columns.length}>
              Sin registros
            </td>
          </tr>
        ) : (
          data.map((row, i) => {
            const rowKey = getRowKey ? getRowKey(row) : i;
            return (
              <tr
                key={rowKey}
                className={selectedKey === rowKey ? 'table-row-selected' : ''}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key]}</td>
                ))}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

export default Table;
