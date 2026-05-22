import React from 'react';

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface GenericTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];

  renderActions?: (item: T) => React.ReactNode;
}

const GenericTable = <T extends Record<string, any>>({
  data,
  columns,
  renderActions,
}: GenericTableProps<T>) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`py-4 px-4 font-medium text-black dark:text-white ${
                    index === 0 ? 'min-w-[220px] xl:pl-11' : 'min-w-[150px]'
                  }`}
                >
                  {column.label}
                </th>
              ))}

              {renderActions && (
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={item.id ?? index}>
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key}
                    className={`border-b border-[#eee] py-5 px-4 dark:border-strokedark ${
                      colIndex === 0 ? 'pl-9 xl:pl-11' : ''
                    }`}
                  >
                    <p className="text-black dark:text-white">
                      {column.render
                        ? column.render(item)
                        : item[column.key] ?? '—'}
                    </p>
                  </td>
                ))}

                {renderActions && (
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {renderActions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;
