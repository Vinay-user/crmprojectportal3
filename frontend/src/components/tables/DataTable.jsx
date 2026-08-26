import EmptyState from "../common/EmptyState";
import Loading from "../common/Loading";

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  onRowClick
}) {
  if (loading) {
    return <Loading />;
  }

  if (!data.length) {
    return <EmptyState />;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id || index}
              onClick={() =>
                onRowClick?.(row)
              }
              className={
                onRowClick
                  ? "clickable-row"
                  : ""
              }
            >
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render
                    ? column.render(
                        row[column.key],
                        row
                      )
                    : row[column.key] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}