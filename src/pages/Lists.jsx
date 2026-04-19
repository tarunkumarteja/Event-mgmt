import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

function Lists() {
  // LOAD
  const [tables, setTables] = useState(() => {
    const saved = localStorage.getItem("tables");
    return saved
      ? JSON.parse(saved)
      : [{ name: "Table 1", columns: [], rows: [] }];
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const activeTable = tables[activeIndex];

  // SAVE
  useEffect(() => {
    localStorage.setItem("tables", JSON.stringify(tables));
  }, [tables]);

  // EXPORT
  const exportToExcel = () => {
    if (!activeTable || activeTable.rows.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(activeTable.rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTable.name);

    XLSX.writeFile(wb, `${activeTable.name}.xlsx`);
  };

  const exportAllTables = () => {
    if (!tables.length) return;

    const wb = XLSX.utils.book_new();

    tables.forEach((t) => {
      if (t.rows.length === 0) return;
      const ws = XLSX.utils.json_to_sheet(t.rows);
      XLSX.utils.book_append_sheet(wb, ws, t.name);
    });

    XLSX.writeFile(wb, "All_Tables.xlsx");
  };

  // TABLE FUNCTIONS
  const addTable = () => {
    const newTable = {
      name: `Table ${tables.length + 1}`,
      columns: [],
      rows: [],
    };
    setTables([...tables, newTable]);
    setActiveIndex(tables.length);
  };

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

  const editTableName = (value) => {
    const updated = [...tables];
    updated[activeIndex].name = value;
    setTables(updated);
  };

  const addColumn = () => {
    const newCol = `Column ${activeTable.columns.length + 1}`;

    const updated = [...tables];
    updated[activeIndex].columns.push(newCol);

    updated[activeIndex].rows.forEach((r) => (r[newCol] = ""));

    setTables(updated);
  };

  const deleteColumn = (i) => {
    const updated = [...tables];
    const col = updated[activeIndex].columns[i];

    updated[activeIndex].columns.splice(i, 1);
    updated[activeIndex].rows.forEach((r) => delete r[col]);

    setTables(updated);
  };

  const addRow = () => {
    const row = {};
    activeTable.columns.forEach((c) => (row[c] = ""));

    const updated = [...tables];
    updated[activeIndex].rows.push(row);
    setTables(updated);
  };

  const deleteRow = (i) => {
    const updated = [...tables];
    updated[activeIndex].rows.splice(i, 1);
    setTables(updated);
  };

  const editColumn = (i, val) => {
    const updated = [...tables];
    const old = updated[activeIndex].columns[i];

    updated[activeIndex].columns[i] = val;

    updated[activeIndex].rows.forEach((r) => {
      r[val] = r[old];
      delete r[old];
    });

    setTables(updated);
  };

  const editCell = (r, c, val) => {
    const updated = [...tables];
    updated[activeIndex].rows[r][c] = val;
    setTables(updated);
  };

  return (
    <div className="p-5">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

        <div className="flex gap-4">

          {/* SIDEBAR */}
          <div className="w-52 bg-white/5 border border-white/10 rounded-xl p-3 h-[500px] overflow-y-auto">
            <h2 className="text-gray-300 mb-3 text-sm">Tables</h2>

            {tables.map((t, i) => (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`flex justify-between items-center px-2 py-1 rounded cursor-pointer mb-1 ${
                  i === activeIndex
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white/10 text-gray-300"
                }`}
              >
                <span className="truncate">{t.name}</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTable(i);
                  }}
                  className="text-red-400 text-xs"
                >
                  ✖
                </button>
              </div>
            ))}

            <button
              onClick={addTable}
              className="mt-3 w-full bg-green-600 py-1 rounded text-white"
            >
              + Add Table
            </button>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1">

            {activeTable ? (
              <>
                <input
                  value={activeTable.name}
                  onChange={(e) => editTableName(e.target.value)}
                  className="text-2xl mb-4 bg-transparent border-b border-gray-600 outline-none text-white"
                />

                <div className="flex gap-2 mb-4 flex-wrap">
                  <button
                    onClick={exportAllTables}
                    className="bg-indigo-600 px-3 py-1 rounded text-white"
                  >
                    Export All
                  </button>

                  <button
                    onClick={exportToExcel}
                    className="bg-purple-600 px-3 py-1 rounded text-white"
                  >
                    Export
                  </button>

                  <button
                    onClick={addColumn}
                    className="bg-blue-600 px-3 py-1 rounded text-white"
                  >
                    + Column
                  </button>

                  <button
                    onClick={addRow}
                    className="bg-green-600 px-3 py-1 rounded text-white"
                  >
                    + Row
                  </button>
                </div>

                <div className="overflow-auto max-h-[400px] border border-white/10 rounded">
                  <table className="w-full text-white text-sm">
                    <thead className="sticky top-0 bg-gray-800">
                      <tr>
                        {activeTable.columns.map((col, i) => (
                          <th key={i} className="border p-2 relative">
                            <input
                              value={col}
                              onChange={(e) =>
                                editColumn(i, e.target.value)
                              }
                              className="bg-transparent w-full text-center outline-none"
                            />

                            <button
                              onClick={() => deleteColumn(i)}
                              className="absolute top-1 right-1 text-red-400 text-xs"
                            >
                              ✖
                            </button>
                          </th>
                        ))}
                        <th className="border p-2">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {activeTable.rows.map((row, r) => (
                        <tr key={r} className="hover:bg-white/5">
                          {activeTable.columns.map((col, c) => (
                            <td key={c} className="border p-1">
                              <input
                                value={row[col] || ""}
                                onChange={(e) =>
                                  editCell(r, col, e.target.value)
                                }
                                className="bg-transparent w-full outline-none"
                              />
                            </td>
                          ))}

                          <td className="border text-center">
                            <button
                              onClick={() => deleteRow(r)}
                              className="text-red-400"
                            >
                              ✖
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="text-gray-400">No tables available</p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Lists;