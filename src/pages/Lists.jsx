import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

function Lists() {
  const exportAllTables = () => {
  if (!tables.length) {
    alert("No tables to export");
    return;
  }

  const workbook = XLSX.utils.book_new();

  tables.forEach((table) => {
    if (table.rows.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(table.rows);

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      table.name || "Sheet"
    );
  });

  XLSX.writeFile(workbook, "All_Tables.xlsx");
};
  const exportToExcel = () => {
  if (!activeTable || activeTable.rows.length === 0) {
    alert("No data to export");
    return;
  }

  // Convert rows to worksheet
  const worksheet = XLSX.utils.json_to_sheet(activeTable.rows);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Download file
  XLSX.writeFile(workbook, `${activeTable.name}.xlsx`);
};
  // LOAD FROM STORAGE
  const [tables, setTables] = useState(() => {
    const saved = localStorage.getItem("tables");
    return saved
      ? JSON.parse(saved)
      : [{ name: "Table 1", columns: [], rows: [] }];
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const activeTable = tables[activeIndex];

  // AUTO SAVE 🔥
  useEffect(() => {
    localStorage.setItem("tables", JSON.stringify(tables));
  }, [tables]);

  // Add table
  const addTable = () => {
    const newTable = {
      name: `Table ${tables.length + 1}`,
      columns: [],
      rows: [],
    };

    setTables([...tables, newTable]);
    setActiveIndex(tables.length);
  };

  // Delete table
  const deleteTable = (index) => {
    const updated = tables.filter((_, i) => i !== index);
    setTables(updated);

    if (updated.length === 0) {
      setActiveIndex(null);
    } else if (index === activeIndex) {
      setActiveIndex(0);
    } else if (index < activeIndex) {
      setActiveIndex(activeIndex - 1);
    }
  };

  // Edit table name
  const editTableName = (value) => {
    const updated = [...tables];
    updated[activeIndex].name = value;
    setTables(updated);
  };

  // Add column
  const addColumn = () => {
    const newCol = `Column ${activeTable.columns.length + 1}`;

    const updated = [...tables];
    updated[activeIndex].columns.push(newCol);

    updated[activeIndex].rows.forEach((row) => {
      row[newCol] = "";
    });

    setTables(updated);
  };

  // Delete column
  const deleteColumn = (colIndex) => {
    const updated = [...tables];
    const colName = updated[activeIndex].columns[colIndex];

    updated[activeIndex].columns.splice(colIndex, 1);

    updated[activeIndex].rows.forEach((row) => {
      delete row[colName];
    });

    setTables(updated);
  };

  // Add row
  const addRow = () => {
    const newRow = {};
    activeTable.columns.forEach((col) => {
      newRow[col] = "";
    });

    const updated = [...tables];
    updated[activeIndex].rows.push(newRow);
    setTables(updated);
  };

  // Delete row
  const deleteRow = (rowIndex) => {
    const updated = [...tables];
    updated[activeIndex].rows.splice(rowIndex, 1);
    setTables(updated);
  };

  // Edit column
  const editColumn = (colIndex, value) => {
    const updated = [...tables];
    const oldName = updated[activeIndex].columns[colIndex];

    updated[activeIndex].columns[colIndex] = value;

    updated[activeIndex].rows.forEach((row) => {
      row[value] = row[oldName];
      delete row[oldName];
    });

    setTables(updated);
  };

  // Edit cell
  const editCell = (rowIndex, col, value) => {
    const updated = [...tables];
    updated[activeIndex].rows[rowIndex][col] = value;
    setTables(updated);
  };

  return (
    <div className="p-5">
      {/* TABLE SELECT */}
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        {tables.map((t, index) => (
          <div key={index} className="flex items-center gap-1">
            <button
              onClick={() => setActiveIndex(index)}
              className={`px-3 py-1 ${
                index === activeIndex
                  ? "text-yellow-500 font-bold"
                  : ""
              }`}
            >
              {t.name}
            </button>

            <button
              onClick={() => deleteTable(index)}
              className="text-red-500 text-sm"
            >
              ❌
            </button>
          </div>
        ))}

        <button
          onClick={addTable}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          + Table
        </button>
      </div>

      {/* TABLE */}
      {activeTable ? (
        <>
          <input
            value={activeTable.name}
            onChange={(e) => editTableName(e.target.value)}
            className="text-2xl font-bold mb-4 outline-none border-b"
          />

          <div className="mb-3 flex gap-3">
            <button
              onClick={exportAllTables}
              className="bg-indigo-500 text-white px-3 py-1 rounded"
            >
              Export All Tables
            </button>
            
            <button
              onClick={exportToExcel}
              className="bg-purple-500 text-white px-3 py-1 rounded"
            >
              Export Excel
            </button>

            <button
              onClick={addColumn}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              + Column
            </button>

            <button
              onClick={addRow}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              + Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto border w-full bg-white">
              <thead>
                <tr>
                  {activeTable.columns.map((col, colIndex) => (
                    <th key={colIndex} className="border px-2 py-2 relative">
                      <input
                        value={col}
                        onChange={(e) =>
                          editColumn(colIndex, e.target.value)
                        }
                        className="w-full text-center font-semibold outline-none"
                      />

                      <button
                        onClick={() => deleteColumn(colIndex)}
                        className="absolute top-0 right-1 text-red-500 text-xs"
                      >
                        ✖
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {activeTable.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {activeTable.columns.map((col, colIndex) => (
                      <td key={colIndex} className="border p-1">
                        <input
                          value={row[col] || ""}
                          onChange={(e) =>
                            editCell(rowIndex, col, e.target.value)
                          }
                          className="w-full outline-none"
                        />
                      </td>
                    ))}

                    <td className="border text-center">
                      <button
                        onClick={() => deleteRow(rowIndex)}
                        className="text-red-500"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>No tables available</p>
      )}
    </div>
  );
}

export default Lists;