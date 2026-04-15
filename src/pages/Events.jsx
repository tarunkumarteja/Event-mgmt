import { useState, useEffect } from "react";

function Events() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const addEvent = () => {
    if (!name) return;
    setEvents([...events, { name }]);
    setName("");
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Events</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Event Name"
        className="border p-2 mr-2"
      />

      <button onClick={addEvent} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add
      </button>

      {events.map((e, i) => (
        <div key={i}>• {e.name}</div>
      ))}
    </div>
  );
}

export default Events;