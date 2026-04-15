import { useState, useEffect } from "react";

function Gifts() {
  // LOAD FROM STORAGE
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [money, setMoney] = useState(() => {
    const saved = localStorage.getItem("money");
    return saved ? JSON.parse(saved) : 0;
  });

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("add");

  // AUTO SAVE
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("money", JSON.stringify(money));
  }, [transactions, money]);

  const addTransaction = () => {
    if (!name || !amount) return alert("Fill all fields");

    const value = Number(amount);

    const newTransaction = {
      name,
      amount: value,
      type,
    };

    let newBalance =
      type === "add" ? money + value : money - value;

    setTransactions([...transactions, newTransaction]);
    setMoney(newBalance);

    setName("");
    setAmount("");
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">
        Money Management
      </h1>

      {/* BALANCE */}
      <div className="bg-yellow-200 p-4 rounded mb-4 text-xl font-bold">
        Balance: ₹ {money}
      </div>

      {/* FORM */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <input
          type="text"
          placeholder="Purpose"
          className="border p-2 mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          className="border p-2 mr-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          className="border p-2 mr-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="add">Add</option>
          <option value="deduct">Deduct</option>
        </select>

        <button
          onClick={addTransaction}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* LIST */}
      <div>
        {transactions.map((t, index) => (
          <div
            key={index}
            className="flex justify-between bg-white p-3 mb-2 rounded shadow"
          >
            <span>{t.name}</span>

            <span
              className={
                t.type === "add"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {t.type === "add" ? "+" : "-"} ₹{t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gifts;