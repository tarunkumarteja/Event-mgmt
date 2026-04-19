import { useState, useEffect } from "react";

function Gifts() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("money");
    return saved ? JSON.parse(saved) : [];
  });

  const [deductions, setDeductions] = useState(() => {
    const saved = localStorage.getItem("deductions");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const [dName, setDName] = useState("");
  const [dAmount, setDAmount] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("money", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("deductions", JSON.stringify(deductions));
  }, [deductions]);

  // ADD INCOME
  const addTransaction = () => {
    if (!name || !amount) return;

    setTransactions([
      ...transactions,
      { name, amount: Number(amount) },
    ]);

    setName("");
    setAmount("");
  };

  // ADD DEDUCTION
  const addDeduction = () => {
    if (!dName || !dAmount) return;

    setDeductions([
      ...deductions,
      { name: dName, amount: Number(dAmount) },
    ]);

    setDName("");
    setDAmount("");
  };

  // DELETE
  const deleteTransaction = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const deleteDeduction = (index) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  // SEARCH + HIGHLIGHT
  const highlightText = (text) => {
    if (!search) return text;

    const parts = text.split(new RegExp(`(${search})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={i} className="bg-yellow-100 text-black px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // FILTER
  const filteredTransactions = transactions.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDeductions = deductions.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  // CALCULATIONS
  const totalIncome = transactions.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );

  const totalDeduction = deductions.reduce(
    (sum, d) => sum + Number(d.amount),
    0
  );

  const finalBalance = totalIncome - totalDeduction;

  return (
    <div className="p-5">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl text-gray-200">Money</h1>

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/10 p-2 rounded"
          />
        </div>

        {/* TOTALS */}
        <div className="mb-6 space-y-1">
          <p className="text-green-400">Total Income: ₹{totalIncome}</p>
          <p className="text-red-400">Total Deduction: ₹{totalDeduction}</p>
          <p className="text-blue-400 font-bold">
            Final Balance: ₹{finalBalance}
          </p>
        </div>

        {/* ADD INCOME */}
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/10 p-2 rounded"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-white/10 p-2 rounded"
          />

          <button
            onClick={addTransaction}
            className="bg-green-600 px-4 py-2 rounded text-white"
          >
            Add
          </button>
        </div>

        {/* ADD DEDUCTION */}
        <div className="flex gap-2 mb-6">
          <input
            placeholder="Deduction Name"
            value={dName}
            onChange={(e) => setDName(e.target.value)}
            className="bg-white/10 p-2 rounded"
          />

          <input
            type="number"
            placeholder="Amount"
            value={dAmount}
            onChange={(e) => setDAmount(e.target.value)}
            className="bg-white/10 p-2 rounded"
          />

          <button
            onClick={addDeduction}
            className="bg-red-600 px-4 py-2 rounded text-white"
          >
            Add
          </button>
        </div>

        {/* INCOME LIST */}
        <h2 className="text-green-400 mb-2">Income</h2>
        <div className="max-h-[200px] overflow-y-auto space-y-2 mb-6">
          {filteredTransactions.length === 0 ? (
            <p className="text-gray-400">No income found</p>
          ) : (
            filteredTransactions.map((t, i) => (
              <div
                key={i}
                className="flex justify-between bg-white/5 p-3 rounded border border-white/10"
              >
                <span>{highlightText(t.name)}</span>

                <div className="flex gap-3">
                  <span className="text-green-400">
                    ₹{t.amount}
                  </span>

                  <button
                    onClick={() => deleteTransaction(i)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DEDUCTION LIST */}
        <h2 className="text-red-400 mb-2">Deductions</h2>
        <div className="max-h-[200px] overflow-y-auto space-y-2">
          {filteredDeductions.length === 0 ? (
            <p className="text-gray-400">No deductions found</p>
          ) : (
            filteredDeductions.map((d, i) => (
              <div
                key={i}
                className="flex justify-between bg-white/5 p-3 rounded border border-white/10"
              >
                <span>{highlightText(d.name)}</span>

                <div className="flex gap-3">
                  <span className="text-red-400">
                    ₹{d.amount}
                  </span>

                  <button
                    onClick={() => deleteDeduction(i)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Gifts;