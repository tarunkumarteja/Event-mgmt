import { useState, useEffect } from "react";

function Attendance() {
  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem("attendance");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(people));
  }, [people]);

  const addPerson = () => {
    if (!name) return;
    setPeople([...people, { name }]);
    setName("");
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Person Name"
        className="border p-2 mr-2"
      />

      <button onClick={addPerson} className="bg-green-500 text-white px-4 py-2 rounded">
        Add
      </button>

      {people.map((p, i) => (
        <div key={i}>• {p.name}</div>
      ))}
    </div>
  );
}

export default Attendance;