import { useState, useEffect } from "react";

function Prizes() {
  const [prizes, setPrizes] = useState(() => {
    const saved = localStorage.getItem("prizes");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [winner, setWinner] = useState("");
  const [category, setCategory] = useState("1st");
  const [note, setNote] = useState("");
  const [assigned, setAssigned] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("prizes", JSON.stringify(prizes));
  }, [prizes]);

  // ADD
  const add = () => {
    if (!name) return;

    if (assigned && !winner) {
      alert("Enter winner name");
      return;
    }

    setPrizes([
      ...prizes,
      {
        name,
        winner: assigned ? winner : "",
        category,
        note,
        assigned,
      },
    ]);

    setName("");
    setWinner("");
    setCategory("1st");
    setNote("");
    setAssigned(false);
  };

  // DELETE
  const deletePrize = (index) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  // TOGGLE ASSIGNED
  const toggleAssigned = (index) => {
    const updated = [...prizes];
    updated[index].assigned = !updated[index].assigned;

    if (!updated[index].assigned) {
      updated[index].winner = "";
    }

    setPrizes(updated);
  };

  // HIGHLIGHT
  const highlightText = (text) => {
    if (!search || !text) return text;

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
  const filteredPrizes = prizes.filter((p) => {
    const s = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(s) ||
      (p.winner && p.winner.toLowerCase().includes(s)) ||
      p.category.toLowerCase().includes(s) ||
      (p.note && p.note.toLowerCase().includes(s))
    );
  });

  return (
    <div className="p-5">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl text-gray-200">Prizes</h1>

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/10 border border-white/30 p-2 rounded w-60"
          />
        </div>

        {/* TOTAL */}
        <p className="text-gray-400 mb-4">
          Total Prizes: {prizes.length}
        </p>

        {/* ADD FORM */}
        <div className="flex flex-wrap gap-3 mb-4">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Prize name"
            className="bg-white/10 p-2 rounded"
          />

          <button
            onClick={() => setAssigned(!assigned)}
            className={`px-3 py-2 rounded text-white ${
              assigned ? "bg-green-600" : "bg-gray-600"
            }`}
          >
            {assigned ? "Assigned" : "Not Assigned"}
          </button>

          {assigned && (
            <input
              value={winner}
              onChange={(e) => setWinner(e.target.value)}
              placeholder="Winner name"
              className="bg-white/10 p-2 rounded"
            />
          )}

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white/10 p-2 rounded"
          >
            <option>1st</option>
            <option>2nd</option>
            <option>3rd</option>
            <option>Special</option>
          </select>

          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reason"
            className="bg-white/10 p-2 rounded w-full max-w-md"
          />

          <button
            onClick={add}
            className="bg-yellow-600 px-4 py-2 rounded text-white"
          >
            Add
          </button>
        </div>

        {/* LIST */}
        <div className="max-h-[400px] overflow-y-auto space-y-2">

          {filteredPrizes.length === 0 ? (
            <p className="text-gray-400">No prizes found</p>
          ) : (
            filteredPrizes.map((p, i) => (
              <div
                key={i}
                className="bg-white/5 p-3 rounded border border-white/10"
              >
                <div className="flex justify-between">

                  <div className="w-full space-y-1">

                    {/* CATEGORY */}
                    <p className="text-yellow-400 font-semibold">
                      🏆 {highlightText(p.category)}
                    </p>

                    {/* PRIZE NAME (INLINE EDIT) */}
                    <input
                      value={p.name}
                      onChange={(e) => {
                        const updated = [...prizes];
                        updated[i].name = e.target.value;
                        setPrizes(updated);
                      }}
                      className="bg-transparent outline-none w-full"
                    />

                    {/* STATUS */}
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={
                          p.assigned
                            ? "text-green-400"
                            : "text-gray-400"
                        }
                      >
                        {p.assigned ? "Assigned" : "Not Assigned"}
                      </span>
                    </p>

                    {/* WINNER */}
                    {p.assigned && (
                      <input
                        value={p.winner}
                        onChange={(e) => {
                          const updated = [...prizes];
                          updated[i].winner = e.target.value;
                          setPrizes(updated);
                        }}
                        placeholder="Winner name"
                        className="bg-transparent outline-none text-gray-300 w-full"
                      />
                    )}

                    {/* NOTE */}
                    <input
                      value={p.note}
                      onChange={(e) => {
                        const updated = [...prizes];
                        updated[i].note = e.target.value;
                        setPrizes(updated);
                      }}
                      placeholder="Reason"
                      className="bg-transparent outline-none text-gray-400 w-full"
                    />

                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col gap-2 ml-3">
                    <button
                      onClick={() => toggleAssigned(i)}
                      className="text-blue-400 text-sm"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() => deletePrize(i)}
                      className="text-red-400 text-sm"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}

export default Prizes;