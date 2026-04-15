import { useState, useEffect } from "react";

function Prizes() {
  const [prizes, setPrizes] = useState(() => {
    const saved = localStorage.getItem("prizes");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");

  useEffect(() => {
    localStorage.setItem("prizes", JSON.stringify(prizes));
  }, [prizes]);

  const addPrize = () => {
    if (!name) return;
    setPrizes([...prizes, { name, status: "Pending" }]);
    setName("");
  };

  const markGiven = (i) => {
    const updated = [...prizes];
    updated[i].status = "Given";
    setPrizes(updated);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Prizes</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Prize Name"
        className="border p-2 mr-2"
      />

      <button onClick={addPrize} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add
      </button>

      {prizes.map((p, i) => (
        <div key={i}>
          {p.name} - {p.status}
          {p.status === "Pending" && (
            <button onClick={() => markGiven(i)} className="ml-2 text-blue-500">
              Mark Given
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Prizes;