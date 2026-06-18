import './Table.css'

function Table({ columns, data, onRowClick }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    {columns.map(col => (
                        <th key={col.key}>{col.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <tr key={i} onClick={() => onRowClick && onRowClick(row)}>
                        {columns.map(col => (
                            <td key={col.key}>{row[col.key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Table